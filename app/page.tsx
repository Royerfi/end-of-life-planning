import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RealEstateRecap } from "./components/real-estate-recap"
import { verifyConnection, createTables, getUser, createUser } from "@/lib/db"

export default async function Dashboard() {
  // Verify database connection
  const isConnected = await verifyConnection();
  if (!isConnected) {
    return <div>Error: Unable to connect to the database. Please check your configuration.</div>;
  }

  // Ensure tables are created
  await createTables();

  // For demonstration, let's create a user if they don't exist
  const email = "demo@example.com";
  let user = await getUser(email);
  if (!user) {
    user = await createUser("Demo User", email);
  }

  // TODO: Fetch real data from the database
  const mockProperties = [
    { address: "123 Main St", price: 300000, squareFootage: 1500, yearBuilt: 1990 },
    { address: "456 Elm St", price: 450000, squareFootage: 2000, yearBuilt: 2005 },
    { address: "789 Oak St", price: 550000, squareFootage: 2500, yearBuilt: 2015 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">End of Life Planning Dashboard</h1>
      
      <RealEstateRecap properties={mockProperties} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Manage your important documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have 5 documents stored securely.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Family Members</CardTitle>
            <CardDescription>Manage your family members' information</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have 3 family members listed.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Key Contacts</CardTitle>
            <CardDescription>Keep track of important contacts</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have 2 key contacts saved.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

