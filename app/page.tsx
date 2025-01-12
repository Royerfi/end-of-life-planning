'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RealEstateRecap } from "./components/real-estate-recap"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Users, PhoneCall, Home, PlusCircle } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const [completionPercentage, setCompletionPercentage] = useState(65)
  const [documentCount, setDocumentCount] = useState(0)

  // Mock data for the real estate recap
  const properties = [
    { address: "123 Main St", price: 300000, squareFootage: 1500, yearBuilt: 1990 },
    { address: "456 Elm St", price: 450000, squareFootage: 2000, yearBuilt: 2005 },
    { address: "789 Oak St", price: 550000, squareFootage: 2500, yearBuilt: 2015 },
  ];

  const recentActivity = [
    { action: "Updated medical information", date: "2023-07-15" },
    { action: "Added new family member", date: "2023-07-10" },
    { action: "Uploaded new document", date: "2023-07-05" },
  ];

  useEffect(() => {
    fetchDocumentCount()
  }, [])

  const fetchDocumentCount = async () => {
    try {
      const response = await fetch('/api/documents')
      if (response.ok) {
        const documents = await response.json()
        setDocumentCount(documents.length)
      } else {
        throw new Error('Failed to fetch documents')
      }
    } catch (error) {
      console.error('Error fetching document count:', error)
      toast({
        title: "Error",
        description: "Failed to fetch document count. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Completion</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <Progress value={completionPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {100 - completionPercentage}% left to complete
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentCount}</div>
            <p className="text-xs text-muted-foreground">stored securely</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Family Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">added to your plan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Key Contacts</CardTitle>
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">important contacts saved</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Real Estate Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <RealEstateRecap properties={properties} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Add Document
            </Button>
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Add Family Member
            </Button>
            <Button>
              <PhoneCall className="mr-2 h-4 w-4" />
              Add Key Contact
            </Button>
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

