'use client'

import { useState } from 'react'
import { FamilyMembersManager } from "@/components/family-members-manager"
import { Button } from "@/components/ui/button"
import { Grid2X2, List, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddFamilyMemberForm } from "@/components/add-family-member-form"

export default function FamilyMembersPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Family Members</h1>
          <p className="text-muted-foreground">
            Manage and organize your family members&apos; information
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Family Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Family Member</DialogTitle>
                <DialogDescription>
                  Enter the details of your new family member here.
                </DialogDescription>
              </DialogHeader>
              <AddFamilyMemberForm />
            </DialogContent>
          </Dialog>
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setView('grid')}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <FamilyMembersManager view={view} />
    </div>
  )
}
