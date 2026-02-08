import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'ai_code_builder',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

// Type definitions
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  files: any;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectShare {
  id: number;
  project_id: number;
  user_id: number;
  permission: 'view' | 'edit';
  created_at: Date;
}

export interface Session {
  id: number;
  user_id: number;
  project_id: number | null;
  socket_id: string | null;
  created_at: Date;
}
