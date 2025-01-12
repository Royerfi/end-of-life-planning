'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RealEstate } from '@/types/realEstate'
import { realEstateService } from '@/lib/services/realEstateService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'

interface RealEstateFormProps {
  property?: RealEstate
  isEditing?: boolean
}

export function RealEstateForm({ property, isEditing }: RealEstateFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<RealEstate>>(
    property || {
      address: '',
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      squareFootage: 0,
      yearBuilt: new Date().getFullYear(),
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && property) {
        await realEstateService.update(property.id, formData)
        toast({ title: 'Success', description: 'Property updated successfully' })
      } else {
        await realEstateService.create(formData as Omit<RealEstate, 'id'>)
        toast({ title: 'Success', description: 'Property added successfully' })
      }
      router.push('/real-estate')
    } catch (error) {
      toast({
        title: 'Error',
        description: isEditing ? 'Failed to update property' : 'Failed to add property',
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="bedrooms">Bedrooms</Label>
        <Input
          id="bedrooms"
          name="bedrooms"
          type="number"
          value={formData.bedrooms}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="bathrooms">Bathrooms</Label>
        <Input
          id="bathrooms"
          name="bathrooms"
          type="number"
          value={formData.bathrooms}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="squareFootage">Square Footage</Label>
        <Input
          id="squareFootage"
          name="squareFootage"
          type="number"
          value={formData.squareFootage}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="yearBuilt">Year Built</Label>
        <Input
          id="yearBuilt"
          name="yearBuilt"
          type="number"
          value={formData.yearBuilt}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit">{isEditing ? 'Update' : 'Add'} Property</Button>
    </form>
  )
}

