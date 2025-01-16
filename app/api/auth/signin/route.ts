import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sign } from '@/lib/auth'
import pool from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    console.log('Attempting login for email:', email)

    const client = await pool.connect()
    const result = await client.query(
      'SELECT * FROM auth_users WHERE email = $1',
      [email]
    )
    client.release()

    if (result.rows.length === 0) {
      console.log('No user found with email:', email)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const user = result.rows[0]
    console.log('User found:', { id: user.id, email: user.email })
    
    if (!user.password) {
      console.error('User password is null or undefined for email:', email)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log('Password match:', passwordMatch)

    if (!passwordMatch) {
      console.log('Password does not match for email:', email)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await sign({ 
      userId: user.id, 
      email: user.email,
    })

    const response = NextResponse.json({ 
      id: user.id,
      name: user.name,
      email: user.email,
    })
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/',
    })

    console.log('Login successful for email:', email)
    return response
  } catch (error) {
    console.error('Sign-in error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

