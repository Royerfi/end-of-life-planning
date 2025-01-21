import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Property } from "@/lib/rentcast"

interface RealEstateRecapProps {
  properties: Property[];
}

export function RealEstateRecap({ properties }: RealEstateRecapProps) {
  const totalValue = properties.reduce((sum, property) => sum + (Number(property.price) || 0), 0);
   const averageSquareFootage = properties.reduce((sum, property) => sum + (property.squareFootage || 0), 0) / properties.length;
  const totalTaxValue = properties.reduce((sum, property) => {
    const latestAssessment = property.taxAssessments?.sort((a, b) => b.year - a.year)[0];
    return sum + (latestAssessment?.value || 0);
  }, 0);

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Square Footage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageSquareFootage.toFixed(0)} sq ft</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tax Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalTaxValue)}</div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        {properties.map((property, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{property.address}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Owner(s) Name: {property.ownerName || 'N/A'}</p>
              <p>Price: {formatCurrency(property.price || 0)}</p>
              <p>Square Footage: {property.squareFootage ? `${property.squareFootage} sq ft` : 'N/A'}</p>
              <p>Year Built: {property.yearBuilt || 'N/A'}</p>
              <p>Bedrooms: {property.bedrooms || 'N/A'}</p>
              <p>Bathrooms: {property.bathrooms || 'N/A'}</p>
              <p>Owner Type: {property.ownerType || 'N/A'}</p>
              <p>Legal Description: {property.legalDescription || 'N/A'}</p>
              <p>Last Sale Date: {property.lastSaleDate || 'N/A'}</p>
              <p>Last Sale Price: {formatCurrency(property.lastSalePrice || 0)}</p>
              <p>Lot Size: {property.lotSize ? `${property.lotSize} sq ft` : 'N/A'}</p>
              {property.taxAssessments?.map((assessment, idx) => (
                <p key={idx}>Tax Assessment {assessment.year}: {formatCurrency(assessment.value)}</p>
              )) || <p>No tax assessments available</p>}
              {property.propertyTaxes?.map((tax, idx) => (
                <p key={idx}>Property Tax {tax.year}: {formatCurrency(tax.amount)}</p>
              )) || <p>No property taxes available</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

