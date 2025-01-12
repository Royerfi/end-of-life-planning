import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify } from '@/lib/auth'
import { getUserById } from '@/lib/db'

export async function GET() {
  const token = cookies().get('token')?.value

  if (!token) {
    return NextResponse.json({ user: null })
  }

  try {
    const payload = await verify(token)
    const user = await getUserById(payload.userId)
    
    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      } 
    })
  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json({ user: null })
  }
}

