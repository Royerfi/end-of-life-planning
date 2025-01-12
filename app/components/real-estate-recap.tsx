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
  const oldestProperty = properties.length > 0
    ? Math.min(...properties.map(property => property.yearBuilt))
    : null;

  return (
    <div className="grid gap-4 grid-cols-2">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium w-full pr-2">Total Properties</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{properties.length}</div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium w-full pr-2">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold whitespace-normal">${totalValue.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium w-full pr-2">Oldest Property</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {oldestProperty || 'N/A'}
          </div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium w-full pr-2">Latest Addition</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold whitespace-normal">
            {properties.length > 0 
              ? new Date().getFullYear() 
              : 'N/A'}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

