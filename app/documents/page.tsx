'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { FileText, Upload, Edit, File, Trash2, Download, Eye, Loader2 } from 'lucide-react'
import DocumentPopup from '../components/document-popup'
import { toast } from "@/components/ui/use-toast"

interface Document {
  id: number;
  name: string;
  type: string;
  tags: string[];
  upload_date: string;
  file_path: string;
  uploader_name: string; // Added uploader_name
}

interface NewDocument {
  name: string;
  type: string;
  tags: string[];
  file_path: File | null;
}

const documentTypes = ['Will', 'Power of Attorney', 'Medical Directive', 'Insurance Policy', 'Financial Statement', 'Deed', 'Other']

export default function Documents() {
  const { user, isLoading: authLoading } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [newDocument, setNewDocument] = useState<NewDocument>({
    name: '',
    type: '',
    tags: [],
    file_path: null,
  })
  const [newTag, setNewTag] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && user) {
      fetchDocuments()
    }
  }, [authLoading, user])

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/documents')
      if (response.ok) {
        const data = await response.json()
        setDocuments(data)
      } else {
        throw new Error('Failed to fetch documents')
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
      toast({
        title: "Error",
        description: "Failed to fetch documents. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewDocument(prev => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setNewDocument(prev => ({ ...prev, type: value }))
  }

  const handleAddTag = () => {
    if (newTag && !newDocument.tags.includes(newTag)) {
      setNewDocument(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setNewDocument(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setNewDocument(prev => ({ ...prev, file_path: files[0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDocument.file_path) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }
    try {
      const formData = new FormData()
      formData.append('name', newDocument.name)
      formData.append('type', newDocument.type)
      formData.append('tags', JSON.stringify(newDocument.tags))
      formData.append('file', newDocument.file_path)

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.message || "Document uploaded successfully.",
        })
        setNewDocument({ name: '', type: '', tags: [], file_path: null })
        fetchDocuments()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload document')
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'card' : 'list')
  }

  const openDocumentPopup = (document: Document) => {
    setSelectedDocument(document)
    setIsPopupOpen(true)
  }

  const closeDocumentPopup = () => {
    setSelectedDocument(null)
    setIsPopupOpen(false)
  }

  const saveDocumentChanges = async (updatedDocument: Document) => {
    try {
      const response = await fetch('/api/documents', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDocument),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Document updated successfully.",
        })
        fetchDocuments()
      } else {
        throw new Error('Failed to update document')
      }
    } catch (error) {
      console.error('Error updating document:', error)
      toast({
        title: "Error",
        description: "Failed to update document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteDocument = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const response = await fetch('/api/documents', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        })

        if (response.ok) {
          toast({
            title: "Success",
            description: "Document deleted successfully.",
          })
          fetchDocuments()
        } else {
          throw new Error('Failed to delete document')
        }
      } catch (error) {
        console.error('Error deleting document:', error)
        toast({
          title: "Error",
          description: "Failed to delete document. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Please log in to view documents.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload New Document</CardTitle>
          <CardDescription>Add a new document to your secure storage</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Upload Document</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="w-full"
                  required
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" size="icon" variant="outline">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Upload document</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Document Name</Label>
              <Input id="name" name="name" value={newDocument.name} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Document Type</Label>
              <Select onValueChange={handleTypeChange} value={newDocument.type}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex space-x-2">
                <Input id="tags" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add a tag" />
                <Button type="button" onClick={handleAddTag}>Add Tag</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {newDocument.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="px-2 py-1">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-2 text-xs">&times;</button>
                  </Badge>
                ))}
              </div>
            </div>
            <Button type="submit">Upload Document</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Your Documents</CardTitle>
              <CardDescription>Manage and view your uploaded documents</CardDescription>
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
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map(doc => (
                <Card key={doc.id}>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-base font-medium leading-none truncate">
                      {doc.name}
                    </CardTitle>
                    <CardDescription className="text-sm">{doc.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {doc.tags.map(tag => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">Uploaded on: {new Date(doc.upload_date).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Uploaded by: {doc.uploader_name}</p>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => window.open(`/api/documents?id=${doc.id}`, '_blank')}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openDocumentPopup(doc)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openDocumentPopup(doc)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteDocument(doc.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <File className="h-4 w-4" />
                        <span>{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map(tag => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(doc.upload_date).toLocaleString()}</TableCell>
                    <TableCell>{doc.uploader_name}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => window.open(`/api/documents?id=${doc.id}`, '_blank')}>
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download document</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download document</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => openDocumentPopup(doc)}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View document</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View document</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => openDocumentPopup(doc)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit document</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit document</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => deleteDocument(doc.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete document</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete document</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <DocumentPopup
        document={selectedDocument}
        isOpen={isPopupOpen}
        onClose={closeDocumentPopup}
        onSave={saveDocumentChanges}
      />
    </div>
  )
}

