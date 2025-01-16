import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import pool from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Check if user already exists
    const client = await pool.connect()
    const existingUser = await client.query('SELECT * FROM auth_users WHERE email = $1', [email])
    
    if (existingUser.rows.length > 0) {
      client.release()
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Insert new user
    const result = await client.query(
      'INSERT INTO auth_users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    )
    client.release()

    const newUser = result.rows[0]

    return NextResponse.json({ message: 'User registered successfully', user: newUser }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

