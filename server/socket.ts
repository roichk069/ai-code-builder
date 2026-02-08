import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import db from '../lib/db';
import { verifyToken } from '../lib/auth';

interface SocketUser {
  userId: number;
  name: string;
  email: string;
  socketId: string;
}

interface ProjectRoom {
  projectId: string;
  users: Map<string, SocketUser>;
}

const projectRooms = new Map<string, ProjectRoom>();

export function initializeSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'https://securemail.ltd',
      credentials: true,
    },
    path: '/socket.io',
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication required'));
      }
      
      const user = verifyToken(token);
      
      if (!user) {
        return next(new Error('Invalid token'));
      }
      
      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.user.name);

    // Join project room
    socket.on('join-project', async (projectId: string) => {
      try {
        const user = socket.data.user;
        
        // Verify user has access to project
        const [result]: any = await db.query(
          `SELECT p.id FROM projects p
           WHERE p.id = ? AND (
             p.user_id = ? OR 
             p.id IN (SELECT project_id FROM project_shares WHERE user_id = ?)
           )`,
          [projectId, user.userId, user.userId]
        );
        
        if (result.length === 0) {
          socket.emit('error', { message: 'No access to this project' });
          return;
        }
        
        // Join the room
        socket.join(`project:${projectId}`);
        
        // Add user to room tracking
        if (!projectRooms.has(projectId)) {
          projectRooms.set(projectId, {
            projectId,
            users: new Map(),
          });
        }
        
        const room = projectRooms.get(projectId)!;
        room.users.set(socket.id, {
          userId: user.userId,
          name: user.name,
          email: user.email,
          socketId: socket.id,
        });
        
        // Update session in database
        await db.query(
          `INSERT INTO sessions (user_id, project_id, socket_id) 
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE project_id = ?, socket_id = ?`,
          [user.userId, projectId, socket.id, projectId, socket.id]
        );
        
        // Broadcast to others in room
        socket.to(`project:${projectId}`).emit('user-joined', {
          userId: user.userId,
          name: user.name,
          email: user.email,
        });
        
        // Send current users list to new joiner
        const usersList = Array.from(room.users.values()).map(u => ({
          userId: u.userId,
          name: u.name,
          email: u.email,
        }));
        
        socket.emit('users-list', usersList);
        
        console.log(`User ${user.name} joined project ${projectId}`);
      } catch (error) {
        console.error('Join project error:', error);
        socket.emit('error', { message: 'Failed to join project' });
      }
    });

    // Leave project room
    socket.on('leave-project', (projectId: string) => {
      socket.leave(`project:${projectId}`);
      
      const room = projectRooms.get(projectId);
      if (room) {
        room.users.delete(socket.id);
        
        if (room.users.size === 0) {
          projectRooms.delete(projectId);
        }
      }
      
      socket.to(`project:${projectId}`).emit('user-left', {
        userId: socket.data.user.userId,
        name: socket.data.user.name,
      });
    });

    // Code change
    socket.on('code-change', (data: {
      projectId: string;
      filePath: string;
      content: string;
      cursorPosition: any;
    }) => {
      socket.to(`project:${data.projectId}`).emit('code-update', {
        userId: socket.data.user.userId,
        name: socket.data.user.name,
        filePath: data.filePath,
        content: data.content,
        cursorPosition: data.cursorPosition,
      });
    });

    // Cursor move
    socket.on('cursor-move', (data: {
      projectId: string;
      filePath: string;
      position: any;
    }) => {
      socket.to(`project:${data.projectId}`).emit('cursor-update', {
        userId: socket.data.user.userId,
        name: socket.data.user.name,
        filePath: data.filePath,
        position: data.position,
      });
    });

    // File select
    socket.on('file-select', (data: {
      projectId: string;
      filePath: string;
    }) => {
      socket.to(`project:${data.projectId}`).emit('file-selected', {
        userId: socket.data.user.userId,
        name: socket.data.user.name,
        filePath: data.filePath,
      });
    });

    // Chat message
    socket.on('chat-message', (data: {
      projectId: string;
      message: string;
    }) => {
      const timestamp = new Date().toISOString();
      
      io.to(`project:${data.projectId}`).emit('chat-message', {
        userId: socket.data.user.userId,
        name: socket.data.user.name,
        message: data.message,
        timestamp,
      });
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.data.user.name);
      
      // Clean up sessions
      await db.query(
        'DELETE FROM sessions WHERE socket_id = ?',
        [socket.id]
      );
      
      // Remove from all rooms
      projectRooms.forEach((room, projectId) => {
        if (room.users.has(socket.id)) {
          room.users.delete(socket.id);
          
          socket.to(`project:${projectId}`).emit('user-left', {
            userId: socket.data.user.userId,
            name: socket.data.user.name,
          });
          
          if (room.users.size === 0) {
            projectRooms.delete(projectId);
          }
        }
      });
    });
  });

  return io;
}
