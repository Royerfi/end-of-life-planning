import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, DollarSign, Ruler, Calendar } from 'lucide-react'

interface Property {
  address: string;
  price: number;
  squareFootage: number;
  yearBuilt: number;
}

interface RealEstateRecapProps {
  properties: Property[];
}

export function RealEstateRecap({ properties }: RealEstateRecapProps) {
  const totalValue = properties.reduce((sum, property) => sum + property.price, 0);
  const averageSquareFootage = properties.length > 0
    ? properties.reduce((sum, property) => sum + property.squareFootage, 0) / properties.length
    : 0;
  const oldestProperty = properties.length > 0
    ? Math.min(...properties.map(property => property.yearBuilt))
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real Estate Recap</CardTitle>
        <CardDescription>Overview of your property portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Square Footage</CardTitle>
              <Ruler className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageSquareFootage.toFixed(0)} sq ft</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Oldest Property</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{oldestProperty || 'N/A'}</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

