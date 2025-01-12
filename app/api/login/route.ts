import { NextResponse } from 'next/server';
import { validateUser, getUserByEmail } from '@/lib/db';
import { sign } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    console.log('Login attempt for email:', email);

    const isValid = await validateUser(email, password);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = await getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const token = await sign({ userId: user.id });
    
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/',
    });
    
    return NextResponse.json({ 
      message: 'Logged in successfully', 
      user: { id: user.id, name: user.name, email: user.email } 
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      error: 'Failed to log in', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

