import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Property } from '@/lib/rentcast'

interface RealEstateRecapProps {
  properties: Property[]
  isLoading: boolean
}

export function RealEstateRecap({ properties, isLoading }: RealEstateRecapProps) {
  if (isLoading) {
    return <div>Loading properties...</div>
  }

  if (properties.length === 0) {
    return <div>No properties found.</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <Card key={property.id}>
          <CardHeader>
            <CardTitle className="text-sm">{property.address}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${property.price.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              {property.squareFootage} sq ft • Built in {property.yearBuilt}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Owner: {property.ownerName} ({property.ownerType})
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

