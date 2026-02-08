import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// GET - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const [projects] = await db.query<RowDataPacket[]>(
      `SELECT p.*, u.name as owner_name, u.email as owner_email
       FROM projects p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ? AND (
         p.user_id = ? OR 
         p.id IN (SELECT project_id FROM project_shares WHERE user_id = ?)
       )`,
      [id, user.userId, user.userId]
    );
    
    if (projects.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    const project = projects[0];
    
    // Parse files JSON
    if (typeof project.files === 'string') {
      project.files = JSON.parse(project.files);
    }
    
    return NextResponse.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const { name, description, files } = await request.json();
    
    // Check if user has edit permission
    const [projects] = await db.query<RowDataPacket[]>(
      `SELECT p.user_id, ps.permission
       FROM projects p
       LEFT JOIN project_shares ps ON p.id = ps.project_id AND ps.user_id = ?
       WHERE p.id = ?`,
      [user.userId, id]
    );
    
    if (projects.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    const project = projects[0];
    const isOwner = project.user_id === user.userId;
    const hasEditPermission = project.permission === 'edit';
    
    if (!isOwner && !hasEditPermission) {
      return NextResponse.json(
        { error: 'No permission to edit this project' },
        { status: 403 }
      );
    }
    
    await db.query(
      'UPDATE projects SET name = ?, description = ?, files = ? WHERE id = ?',
      [name, description, JSON.stringify(files), id]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Check if user is owner
    const [projects] = await db.query<RowDataPacket[]>(
      'SELECT user_id FROM projects WHERE id = ?',
      [id]
    );
    
    if (projects.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    if (projects[0].user_id !== user.userId) {
      return NextResponse.json(
        { error: 'Only the owner can delete this project' },
        { status: 403 }
      );
    }
    
    await db.query('DELETE FROM projects WHERE id = ?', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
