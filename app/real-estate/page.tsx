'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Home, List, Grid, Search } from 'lucide-react'

interface Property {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  yearBuilt: number;
  lastSaleDate: string;
  lastSalePrice: number;
  taxAssessment: number;
  propertyTax: number;
  legalDescription: string;
  ownerName: string;
  ownerType: string;
}

const getMockPropertyData = (address: string): Property => ({
  id: Date.now().toString(),
  address: address,
  price: 500000,
  bedrooms: Math.floor(Math.random() * 5) + 1,
  bathrooms: Math.floor(Math.random() * 3) + 1,
  squareFootage: Math.floor(Math.random() * 2000) + 1000,
  yearBuilt: Math.floor(Math.random() * 70) + 1950,
  lastSaleDate: '2020-01-01',
  lastSalePrice: 450000,
  taxAssessment: 480000,
  propertyTax: 5000,
  legalDescription: 'Lot 1, Block A, Sample Subdivision',
  ownerName: 'John Doe',
  ownerType: 'Individual',
})

export default function RealEstate() {
  const [properties, setProperties] = useState<Property[]>([])
  const [newAddress, setNewAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list')

  const fetchPropertyInfo = async (address: string): Promise<Property> => {
    const apiKey = process.env.NEXT_PUBLIC_REALTCAST_API_KEY
    if (!apiKey) {
      console.error('Rentcast API key is not set')
      throw new Error('Rentcast API key is not set')
    }

    const url = `https://api.rentcast.io/v1/properties?address=${encodeURIComponent(address)}`

    try {
      console.log('Fetching property info for address:', address)
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'X-Api-Key': apiKey
        }
      })

      console.log('API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API response data:', data)

      if (!data || data.length === 0) {
        throw new Error('No property found for this address')
      }

      const property = data[0]
      const currentYear = new Date().getFullYear()
      const latestTaxAssessment = property.taxAssessments[currentYear] || property.taxAssessments[currentYear - 1]
      const latestPropertyTax = property.propertyTaxes[currentYear] || property.propertyTaxes[currentYear - 1]

      return {
        id: property.id || Date.now().toString(),
        address: property.formattedAddress || address,
        price: property.lastSalePrice || 0,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        squareFootage: property.squareFootage || 0,
        yearBuilt: property.yearBuilt || 0,
        lastSaleDate: property.lastSaleDate || '',
        lastSalePrice: property.lastSalePrice || 0,
        taxAssessment: latestTaxAssessment ? latestTaxAssessment.value : 0,
        propertyTax: latestPropertyTax ? latestPropertyTax.total : 0,
        legalDescription: property.legalDescription || 'Not available',
        ownerName: property.owner && property.owner.names ? property.owner.names.join(', ') : 'Not available',
        ownerType: property.owner && property.owner.type ? property.owner.type : 'Not available',
      }
    } catch (error) {
      console.error('Error fetching property data:', error)
      throw error
    }
  }

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter an address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      console.log('Attempting to add property:', newAddress)
      let propertyInfo: Property
      try {
        propertyInfo = await fetchPropertyInfo(newAddress)
      } catch (error) {
        console.error('Error fetching from API, using mock data:', error)
        propertyInfo = getMockPropertyData(newAddress)
      }
      console.log('Property info received:', propertyInfo)
      setProperties(prevProperties => [...prevProperties, propertyInfo])
      setNewAddress('')
      toast({
        title: "Property added",
        description: "The property has been successfully added to your list.",
      })
    } catch (error) {
      console.error('Error in handleAddProperty:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add property. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'card' : 'list')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Real Estate Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add New Property</CardTitle>
          <CardDescription>Enter an address to fetch property information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddProperty} className="flex items-end space-x-2">
            <div className="flex-grow">
              <Label htmlFor="address">Property Address</Label>
              <Input
                id="address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Enter property address"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Add Property
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Your Properties</CardTitle>
            <div className="flex items-center space-x-2">
              <List className="h-4 w-4" />
              <Switch
                checked={viewMode === 'card'}
                onCheckedChange={toggleViewMode}
                aria-label="Toggle view mode"
              />
              <Grid className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <p className="text-center text-muted-foreground">No properties added yet.</p>
          ) : viewMode === 'list' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Bedrooms</TableHead>
                  <TableHead>Bathrooms</TableHead>
                  <TableHead>Year Built</TableHead>
                  <TableHead>Square Footage</TableHead>
                  <TableHead>Owner Name</TableHead>
                  <TableHead>Owner Type</TableHead>
                  <TableHead>Legal Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>{property.address}</TableCell>
                    <TableCell>${property.price.toLocaleString()}</TableCell>
                    <TableCell>{property.bedrooms}</TableCell>
                    <TableCell>{property.bathrooms}</TableCell>
                    <TableCell>{property.yearBuilt}</TableCell>
                    <TableCell>{property.squareFootage} sq ft</TableCell>
                    <TableCell>{property.ownerName}</TableCell>
                    <TableCell>{property.ownerType}</TableCell>
                    <TableCell>{property.legalDescription}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <Card key={property.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{property.address}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Price:</strong> ${property.price.toLocaleString()}</p>
                      <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
                      <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
                      <p><strong>Year Built:</strong> {property.yearBuilt}</p>
                      <p><strong>Square Footage:</strong> {property.squareFootage} sq ft</p>
                      <p><strong>Owner Name(s):</strong> {property.ownerName}</p>
                      <p><strong>Owner Type:</strong> {property.ownerType}</p>
                      <p><strong>Legal Description:</strong> {property.legalDescription}</p>
                      <p><strong>Last Sale Date:</strong> {new Date(property.lastSaleDate).toLocaleDateString()}</p>
                      <p><strong>Tax Assessment:</strong> ${property.taxAssessment.toLocaleString()}</p>
                      <p><strong>Property Tax:</strong> ${property.propertyTax.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

