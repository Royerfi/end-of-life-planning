'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Property, TaxAssessment, PropertyTax } from '@/lib/rentcast'

interface PropertySearchProps {
  onAddProperty: (property: Property) => void;
}

export function PropertySearch({ onAddProperty }: PropertySearchProps) {
  const [address, setAddress] = useState('')
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    setIsLoading(true)
    setError(null)
    setProperty(null)
    try {
      const response = await fetch(`/api/properties/${encodeURIComponent(address)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch property')
      }

      if (data.message === 'Property not found') {
        setError('Property not found. Please check the address and try again.')
      } else {
        setProperty(data)
      }
    } catch (error) {
      console.error('Error fetching property:', error)
      setError('Failed to fetch property. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProperty = () => {
    if (property) {
      onAddProperty(property)
      setProperty(null)
      setAddress('')
    }
  }

  const formatCurrency = (value: number | null) => {
    return value ? `$${value.toLocaleString()}` : 'N/A'
  }

  const renderTaxAssessments = (assessments: TaxAssessment[]) => {
    return assessments.map((assessment, index) => (
      <p key={index}>
        Tax Assessment {assessment.year}: {formatCurrency(assessment.value)}
      </p>
    ))
  }

  const renderPropertyTaxes = (taxes: PropertyTax[]) => {
    return taxes.map((tax, index) => (
      <p key={index}>
        Property Tax {tax.year}: {formatCurrency(tax.amount)}
      </p>
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter property address"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {property && (
        <Card>
          <CardHeader>
            <CardTitle>{property.address}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Owner Name(s): {property.ownerName}</p>
            <p>Price: {formatCurrency(property.price)}</p>
            <p>Square Footage: {property.squareFootage ? `${property.squareFootage} sq ft` : 'N/A'}</p>
            <p>Year Built: {property.yearBuilt || 'N/A'}</p>
            <p>Bedrooms: {property.bedrooms || 'N/A'}</p>
            <p>Bathrooms: {property.bathrooms || 'N/A'}</p>
            <p>Owner Type: {property.ownerType || 'N/A'}</p>
            <p>Legal Description: {property.legalDescription || 'N/A'}</p>
            <p>County: {property.county || 'N/A'} </p>
            <p>Last Sale Date: {property.lastSaleDate || 'N/A'}</p>
            <p>Last Sale Price: {formatCurrency(property.lastSalePrice)}</p>
            <p>Lot Size: {property.lotSize ? `${property.lotSize} sq ft` : 'N/A'}</p>
            <p>Subdivision : {property.subdivision || 'N/A'}</p>
            {renderTaxAssessments(property.taxAssessments)}
            {renderPropertyTaxes(property.propertyTaxes)}

            <Button onClick={handleAddProperty} className="mt-4">
              Add Property
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

