import mysql from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';

// Create database pool lazily - only when needed
let pool: Pool | null = null;
let poolError: Error | null = null;

function getPool(): Pool {
  if (poolError) {
    throw poolError;
  }
  
  if (!pool) {
    try {
      pool = mysql.createPool({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'ai_code_builder',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    } catch (error) {
      poolError = error as Error;
      console.error('Failed to create database pool:', error);
      throw error;
    }
  }
  
  return pool;
}

// Export a proxy that creates the pool on first access
export default new Proxy({} as Pool, {
  get(target, prop) {
    const poolInstance = getPool();
    const value = poolInstance[prop as keyof Pool];
    return typeof value === 'function' ? value.bind(poolInstance) : value;
  }
});

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
