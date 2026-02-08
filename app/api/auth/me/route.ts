import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    // If no user is authenticated, return a guest user instead of failing
    if (!user) {
      return NextResponse.json({
        user: {
          userId: 0,
          email: 'guest@local',
          name: 'Guest User'
        },
        isGuest: true
      });
    }
    
    return NextResponse.json({ user, isGuest: false });
  } catch (error) {
    console.error('Auth check error:', error);
    // On any error, return guest user to keep app functional
    return NextResponse.json({
      user: {
        userId: 0,
        email: 'guest@local',
        name: 'Guest User'
      },
      isGuest: true
    });
  }
}
