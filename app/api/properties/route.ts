import { NextRequest, NextResponse } from 'next/server'
import { getProperties, addProperty } from '@/lib/rentcast'

export async function GET() {
  try {
    const properties = await getProperties()
    console.log('Fetched properties:', properties) // Add this line for debugging
    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const property = await request.json()
    const addedProperty = await addProperty(property)
    console.log('Added property:', addedProperty) // Add this line for debugging
    return NextResponse.json(addedProperty, { status: 201 })
  } catch (error) {
    console.error('Error adding property:', error)
    return NextResponse.json(
      { error: 'Failed to add property' },
      { status: 500 }
    )
  }
}

