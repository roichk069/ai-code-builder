import { NextRequest } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';

let io: SocketIOServer | null = null;

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

export async function GET(req: NextRequest) {
  if (!io) {
    // @ts-ignore - Next.js socket server
    const httpServer: HTTPServer = (req as any).socket.server;
    
    io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        credentials: true,
      },
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

      socket.on('join-project', async (projectId: string) => {
        try {
          const user = socket.data.user;
          
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
          
          socket.join(`project:${projectId}`);
          
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
          
          await db.query(
            `INSERT INTO sessions (user_id, project_id, socket_id) 
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE project_id = ?, socket_id = ?`,
            [user.userId, projectId, socket.id, projectId, socket.id]
          );
          
          socket.to(`project:${projectId}`).emit('user-joined', {
            userId: user.userId,
            name: user.name,
            email: user.email,
          });
          
          const usersList = Array.from(room.users.values()).map(u => ({
            userId: u.userId,
            name: u.name,
            email: u.email,
          }));
          
          socket.emit('users-list', usersList);
        } catch (error) {
          console.error('Join project error:', error);
          socket.emit('error', { message: 'Failed to join project' });
        }
      });

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

      socket.on('code-change', (data: any) => {
        socket.to(`project:${data.projectId}`).emit('code-update', {
          userId: socket.data.user.userId,
          name: socket.data.user.name,
          filePath: data.filePath,
          content: data.content,
          cursorPosition: data.cursorPosition,
        });
      });

      socket.on('cursor-move', (data: any) => {
        socket.to(`project:${data.projectId}`).emit('cursor-update', {
          userId: socket.data.user.userId,
          name: socket.data.user.name,
          filePath: data.filePath,
          position: data.position,
        });
      });

      socket.on('file-select', (data: any) => {
        socket.to(`project:${data.projectId}`).emit('file-selected', {
          userId: socket.data.user.userId,
          name: socket.data.user.name,
          filePath: data.filePath,
        });
      });

      socket.on('chat-message', (data: any) => {
        const timestamp = new Date().toISOString();
        
        io!.to(`project:${data.projectId}`).emit('chat-message', {
          userId: socket.data.user.userId,
          name: socket.data.user.name,
          message: data.message,
          timestamp,
        });
      });

      socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.data.user.name);
        
        await db.query('DELETE FROM sessions WHERE socket_id = ?', [socket.id]);
        
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
  }

  return new Response('Socket.io server running', { status: 200 });
}
