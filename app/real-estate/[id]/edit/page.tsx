'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { RealEstate } from '@/types/realEstate'
import { realEstateService } from '@/lib/services/realtcast'
import { RealEstateForm } from '../../components/RealEstateForm'
import { toast } from '@/components/ui/use-toast'

export default function EditRealEstatePage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [property, setProperty] = useState<RealEstate | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (id) {
          const data = await realEstateService.getById(Number(id))
          setProperty(data)
        } else {
          // Handle case where id is null
          toast({
            title: 'Error',
            description: 'Property ID not found',
            variant: 'destructive',
          })
        }
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

    if (id) {
      fetchProperty()
    }
  }, [id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!property) {
    return <div>Property not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Property</h1>
      <RealEstateForm property={property} isEditing />
    </div>
  )
}

