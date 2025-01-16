const RENTCAST_API_KEY = process.env.NEXT_PUBLIC_REALTCAST_API_KEY

export interface Property {
  id: string
  address: string
  price: number
  squareFootage: number
  yearBuilt: number
  ownerName: string
  ownerType: string
  legalDescription: string
}

export async function getProperties(): Promise<Property[]> {
  try {
    const response = await fetch('https://api.rentcast.io/v1/properties', {
      headers: {
        'Authorization': `Bearer ${RENTCAST_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch properties')
    }

    const data = await response.json()
    return data.properties.map((property: any) => ({
      id: property.id,
      address: property.address,
      price: property.price,
      squareFootage: property.square_feet,
      yearBuilt: property.year_built,
      ownerName: property.owner_name,
      ownerType: property.owner_type,
      legalDescription: property.legal_description,
    }))
  } catch (error) {
    console.error('Error fetching properties:', error)
    return []
  }
}

