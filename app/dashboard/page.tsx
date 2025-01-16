'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RealEstateRecap } from "../components/real-estate-recap"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileText, Users, PhoneCall, Home } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '@/lib/AuthContext'
import { Property } from '@/lib/rentcast'

export default function Dashboard() {
  const { user } = useAuth()
  const [completionPercentage, setCompletionPercentage] = useState(65)
  const [documentCount, setDocumentCount] = useState(0)
  const [familyMemberCount, setFamilyMemberCount] = useState(0)
  const { toast } = useToast()
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoadingProperties, setIsLoadingProperties] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProperties()
      fetchDocumentCount()
      fetchFamilyMemberCount()
    }
  }, [user])

  const fetchProperties = async () => {
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
      setIsLoadingProperties(false)
    }
  }

  const fetchDocumentCount = async () => {
    try {
      const response = await fetch('/api/documents/count')
      if (!response.ok) {
        throw new Error('Failed to fetch document count')
      }
      const data = await response.json()
      setDocumentCount(data.count)
    } catch (error) {
      console.error('Error fetching document count:', error)
      toast({
        title: "Error",
        description: "Failed to fetch document count. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchFamilyMemberCount = async () => {
    try {
      const response = await fetch('/api/family-members/count')
      if (!response.ok) {
        throw new Error('Failed to fetch family member count')
      }
      const data = await response.json()
      setFamilyMemberCount(data.count)
    } catch (error) {
      console.error('Error fetching family member count:', error)
      toast({
        title: "Error",
        description: "Failed to fetch family member count. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user.name || 'User'}</p>
      </div>

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
            <div className="text-2xl font-bold">{familyMemberCount}</div>
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

      <Card>
        <CardHeader>
          <CardTitle>Real Estate Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <RealEstateRecap properties={properties} isLoading={isLoadingProperties} />
        </CardContent>
      </Card>

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

