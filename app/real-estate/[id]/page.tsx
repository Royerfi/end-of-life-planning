'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { RealEstate } from '@/types/realEstate'
import { realEstateService } from '@/lib/services/realEstateService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'

export default function RealEstateDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<RealEstate | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await realEstateService.getById(Number(id))
        setProperty(data)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch property details',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await realEstateService.delete(Number(id))
        toast({ title: 'Success', description: 'Property deleted successfully' })
        router.push('/real-estate')
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete property',
          variant: 'destructive',
        })
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!property) {
    return <div>Property not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>{property.address}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Price: ${property.price.toLocaleString()}</p>
          <p>Bedrooms: {property.bedrooms}</p>
          <p>Bathrooms: {property.bathrooms}</p>
          <p>Square Footage: {property.squareFootage} sq ft</p>
          <p>Year Built: {property.yearBuilt}</p>
          <div className="mt-4 space-x-2">
            <Link href={`/real-estate/${id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

