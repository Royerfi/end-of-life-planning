'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Home, Activity } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Property } from "@/lib/rentcast";

export default function Dashboard() {
  const [documentCount, setDocumentCount] = useState(0);
  const [familyMemberCount, setFamilyMemberCount] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetchDocumentCount();
    fetchFamilyMemberCount();
    fetchProperties();
  }, []);

  const fetchDocumentCount = async () => {
    try {
      const response = await fetch('/api/documents/count');
      if (response.ok) {
        const data = await response.json();
        setDocumentCount(data.count);
      } else {
        throw new Error('Failed to fetch document count');
      }
    } catch (error) {
      console.error('Error fetching document count:', error);
      toast({
        title: "Error",
        description: "Failed to fetch document count. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchFamilyMemberCount = async () => {
    try {
      const response = await fetch('/api/family-members/count');
      if (response.ok) {
        const data = await response.json();
        setFamilyMemberCount(data.count);
      } else {
        throw new Error('Failed to fetch family member count');
      }
    } catch (error) {
      console.error('Error fetching family member count:', error);
      toast({
        title: "Error",
        description: "Failed to fetch family member count. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to fetch properties. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Completion</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
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
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
            <p className="text-xs text-muted-foreground">in your estate plan</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
