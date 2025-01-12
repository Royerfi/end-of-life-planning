'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, Upload } from 'lucide-react'

interface FamilyMember {
  id: number;
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

const relationships = [
  'Spouse', 'Child', 'Parent', 'Sibling', 'Grandparent', 'Grandchild', 'Other'
]

export default function FamilyMembers() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null)
  const [newMember, setNewMember] = useState<Omit<FamilyMember, 'id'>>({
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
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (editingMember) {
      setEditingMember({ ...editingMember, [name]: value })
    } else {
      setNewMember(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleRelationshipChange = (value: string) => {
    if (editingMember) {
      setEditingMember({ ...editingMember, relationship: value })
    } else {
      setNewMember(prev => ({ ...prev, relationship: value }))
    }
  }

  const handlePermissionChange = (permission: keyof FamilyMember['permissions']) => {
    if (editingMember) {
      setEditingMember({
        ...editingMember,
        permissions: { ...editingMember.permissions, [permission]: !editingMember.permissions[permission] }
      })
    } else {
      setNewMember(prev => ({
        ...prev,
        permissions: { ...prev.permissions, [permission]: !prev.permissions[permission] }
      }))
    }
  }

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        if (editingMember) {
          setEditingMember({ ...editingMember, profilePicture: base64String })
        } else {
          setNewMember(prev => ({ ...prev, profilePicture: base64String }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingMember) {
      setFamilyMembers(familyMembers.map(member => 
        member.id === editingMember.id ? editingMember : member
      ))
      setEditingMember(null)
    } else {
      const id = familyMembers.length + 1
      setFamilyMembers([...familyMembers, { ...newMember, id }])
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
      })
    }
  }

  const startEditing = (member: FamilyMember) => {
    setEditingMember(member)
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
    })
  }

  const cancelEditing = () => {
    setEditingMember(null)
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
    })
  }

  const removeMember = (id: number) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id))
  }

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'card' : 'list')
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingMember ? 'Edit Family Member' : 'Add New Family Member'}</CardTitle>
          <CardDescription>
            {editingMember ? 'Update the details of your family member' : 'Add a new family member to your plan'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={editingMember ? editingMember.profilePicture : newMember.profilePicture} />
                <AvatarFallback>{editingMember ? editingMember.name.charAt(0) : newMember.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" /> Upload Picture
                </Button>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleProfilePictureUpload}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={editingMember ? editingMember.name : newMember.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Select 
                  onValueChange={handleRelationshipChange} 
                  value={editingMember ? editingMember.relationship : newMember.relationship}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationships.map(rel => (
                      <SelectItem key={rel} value={rel}>{rel}</SelectItem>
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
                  value={editingMember ? editingMember.email : newMember.email} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  value={editingMember ? editingMember.phone : newMember.phone} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                name="address" 
                value={editingMember ? editingMember.address : newMember.address} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea 
                id="additionalInfo" 
                name="additionalInfo" 
                value={editingMember ? editingMember.additionalInfo : newMember.additionalInfo} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="viewDocuments" 
                    checked={editingMember ? editingMember.permissions.viewDocuments : newMember.permissions.viewDocuments} 
                    onCheckedChange={() => handlePermissionChange('viewDocuments')} 
                  />
                  <Label htmlFor="viewDocuments">View Documents</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="viewContacts" 
                    checked={editingMember ? editingMember.permissions.viewContacts : newMember.permissions.viewContacts} 
                    onCheckedChange={() => handlePermissionChange('viewContacts')} 
                  />
                  <Label htmlFor="viewContacts">View Contacts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="viewProfile" 
                    checked={editingMember ? editingMember.permissions.viewProfile : newMember.permissions.viewProfile} 
                    onCheckedChange={() => handlePermissionChange('viewProfile')} 
                  />
                  <Label htmlFor="viewProfile">View Profile</Label>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button type="submit">
                {editingMember ? 'Update Family Member' : 'Add Family Member'}
              </Button>
              {editingMember && (
                <Button type="button" variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Your Family Members</CardTitle>
              <CardDescription>Manage and view your family members</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="view-mode">List</Label>
              <Switch
                id="view-mode"
                checked={viewMode === 'card'}
                onCheckedChange={toggleViewMode}
              />
              <Label htmlFor="view-mode">Grid</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'list' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Picture</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {familyMembers.map(member => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={member.profilePicture} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.relationship}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>
                      {member.permissions.viewDocuments && <span className="mr-2">Documents</span>}
                      {member.permissions.viewContacts && <span className="mr-2">Contacts</span>}
                      {member.permissions.viewProfile && <span>Profile</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => startEditing(member)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit family member</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit family member</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => removeMember(member.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove family member</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove family member</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {familyMembers.map(member => (
                <Card key={member.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={member.profilePicture} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{member.name}</CardTitle>
                        <CardDescription>{member.relationship}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Email:</strong> {member.email}</p>
                      <p><strong>Phone:</strong> {member.phone}</p>
                      <p><strong>Permissions:</strong></p>
                      <ul className="list-disc list-inside">
                        {member.permissions.viewDocuments && <li>View Documents</li>}
                        {member.permissions.viewContacts && <li>View Contacts</li>}
                        {member.permissions.viewProfile && <li>View Profile</li>}
                      </ul>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => startEditing(member)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => removeMember(member.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
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

