'use client'

import React, { useState } from 'react'
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from 'lucide-react'

const relationshipOptions = [
  'Spouse', 'Partner', 'Child', 'Parent', 'Sibling', 'Grandparent', 'Grandchild',
  'Aunt/Uncle', 'Niece/Nephew', 'Cousin', 'In-law', 'Friend', 'Other'
];

interface FamilyMember {
  name: string;
  relationship: string;
  email: string;
  phone: string;
  address: string;
  additionalInfo: string;
  profilePicture: string;
  permissions: {
    viewDocuments: boolean;
    viewContacts: boolean;
    viewProfile: boolean;
  };
}

export function AddFamilyMemberForm() {
  const [newMember, setNewMember] = useState<FamilyMember>({
    name: '',
    relationship: '',
    email: '',
    phone: '',
    address: '',
    additionalInfo: '',
    profilePicture: '',
    permissions: {
      viewDocuments: false,
      viewContacts: false,
      viewProfile: false,
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewMember(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewMember(prev => ({ ...prev, [name]: value }))
  }

  const handlePermissionChange = (permission: keyof FamilyMember['permissions']) => {
    setNewMember(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [permission]: !prev.permissions[permission] }
    }))
  }

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch('/api/upload-profile-picture', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Failed to upload profile picture')
        }

        const { url } = await response.json()
        setNewMember(prev => ({ ...prev, profilePicture: url }))

        toast({
          title: "Success",
          description: "Profile picture uploaded successfully.",
        })
      } catch (error) {
        console.error('Error uploading profile picture:', error)
        toast({
          title: "Error",
          description: "Failed to upload profile picture. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const validateForm = () => {
    const requiredFields = ['name', 'relationship', 'email', 'phone', 'address']
    for (const field of requiredFields) {
      if (!newMember[field as keyof FamilyMember]) {
        toast({
          title: "Validation Error",
          description: `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`,
          variant: "destructive",
        })
        return false
      }
    }
    if (!/^\S+@\S+\.\S+$/.test(newMember.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/family-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save family member');
      }

      toast({
        title: "Success",
        description: "Family member added successfully.",
      });

      // Reset form
      setNewMember({
        name: '',
        relationship: '',
        email: '',
        phone: '',
        address: '',
        additionalInfo: '',
        profilePicture: '',
        permissions: {
          viewDocuments: false,
          viewContacts: false,
          viewProfile: false,
        },
      });
    } catch (error) {
      console.error('Error saving family member:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save family member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={newMember.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="relationship">Relationship</Label>
          <Select
            name="relationship"
            value={newMember.relationship}
            onValueChange={(value) => handleSelectChange('relationship', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              {relationshipOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={newMember.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={newMember.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            value={newMember.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="additionalInfo">Additional Information</Label>
          <Textarea
            id="additionalInfo"
            name="additionalInfo"
            value={newMember.additionalInfo}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="profilePicture">Profile Picture</Label>
          <Input
            id="profilePicture"
            name="profilePicture"
            type="file"
            onChange={handleProfilePictureUpload}
            accept="image/*"
          />
        </div>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Permissions</Label>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="viewDocuments"
              checked={newMember.permissions.viewDocuments}
              onCheckedChange={() => handlePermissionChange('viewDocuments')}
            />
            <Label htmlFor="viewDocuments">View Documents</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="viewContacts"
              checked={newMember.permissions.viewContacts}
              onCheckedChange={() => handlePermissionChange('viewContacts')}
            />
            <Label htmlFor="viewContacts">View Contacts</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="viewProfile"
              checked={newMember.permissions.viewProfile}
              onCheckedChange={() => handlePermissionChange('viewProfile')}
            />
            <Label htmlFor="viewProfile">View Profile</Label>
          </div>
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          <>Add Family Member</>
        )}
      </Button>
    </form>
  )
}

