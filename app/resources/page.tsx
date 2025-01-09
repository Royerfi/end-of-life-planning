'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  content: string;
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [newResource, setNewResource] = useState<Omit<Resource, 'id'>>({
    title: '',
    description: '',
    category: '',
    content: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewResource(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setNewResource(prev => ({ ...prev, category: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = resources.length + 1
    setResources([...resources, { ...newResource, id }])
    setNewResource({ title: '', description: '', category: '', content: '' })
  }

  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === 'all' || resource.category === filterCategory)
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Resources</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Resource</CardTitle>
          <CardDescription>Upload new content for users to access</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={newResource.title} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={newResource.description} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={handleCategoryChange} value={newResource.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" name="content" value={newResource.content} onChange={handleInputChange} required />
            </div>
            <Button type="submit">Add Resource</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search and Filter Resources</CardTitle>
          <CardDescription>Find the information you need</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Input 
              placeholder="Search resources..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select onValueChange={setFilterCategory} value={filterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            {filteredResources.map(resource => (
              <Card key={resource.id}>
                <CardHeader>
                  <CardTitle>{resource.title}</CardTitle>
                  <CardDescription>{resource.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{resource.description}</p>
                  <p className="text-sm text-gray-500">{resource.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

