'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RealEstateRecap } from "../components/real-estate-recap"
import { PropertySearch } from "../components/property-search"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
import { Property } from "@/lib/rentcast"

export default function RealEstatePage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/properties')
      if (!response.ok) {
        throw new Error('Failed to fetch properties')
      }
      const data = await response.json()
      setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast({
        title: "Error",
        description: "Failed to fetch properties. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProperty = async (property: Property) => {
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(property),
      })

      if (!response.ok) {
        throw new Error('Failed to add property')
      }

      const addedProperty = await response.json()
      setProperties([...properties, addedProperty])
      toast({
        title: "Success",
        description: "Property added successfully.",
      })
    } catch (error) {
      console.error('Error adding property:', error)
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Real Estate</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Property Search</CardTitle>
          <CardDescription>Search for properties to add to your estate plan</CardDescription>
        </CardHeader>
        <CardContent>
          <PropertySearch onAddProperty={handleAddProperty} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Properties</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading properties...</p>
          ) : properties.length > 0 ? (
            <RealEstateRecap properties={properties} />
          ) : (
            <p>No properties found. Try adding some using the search above.</p>
          )}
        </CardContent>
      </Card>

      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Add Property Manually
      </Button>
    </div>
  )
}

