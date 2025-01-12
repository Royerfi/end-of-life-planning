import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create new user
    const user = await createUser(name, email, password);
    return NextResponse.json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ 
      error: 'Failed to create user', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

