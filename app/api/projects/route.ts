import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// GET - List user's projects
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const [projects] = await db.query<RowDataPacket[]>(
      `SELECT p.*, 
        (SELECT COUNT(*) FROM project_shares WHERE project_id = p.id) as share_count
       FROM projects p
       WHERE p.user_id = ? OR p.id IN (
         SELECT project_id FROM project_shares WHERE user_id = ?
       )
       ORDER BY p.updated_at DESC`,
      [user.userId, user.userId]
    );
    
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const { name, description, files } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }
    
    const [result] = await db.query(
      'INSERT INTO projects (user_id, name, description, files) VALUES (?, ?, ?, ?)',
      [user.userId, name, description || null, JSON.stringify(files || {})]
    );
    
    const projectId = (result as any).insertId;
    
    return NextResponse.json({
      success: true,
      project: {
        id: projectId,
        user_id: user.userId,
        name,
        description,
        files: files || {},
      },
    });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
