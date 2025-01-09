'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { FileText, Upload, Tag, Edit, File, List, Grid } from 'lucide-react'
import { DocumentPopup } from '../components/document-popup'

interface Document {
  id: number;
  name: string;
  type: string;
  tags: string[];
  uploadDate: string;
  file: File | null;
}

const documentTypes = ['Will', 'Power of Attorney', 'Medical Directive', 'Insurance Policy', 'Financial Statement', 'Other']

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [newDocument, setNewDocument] = useState<Omit<Document, 'id' | 'uploadDate'>>({
    name: '',
    type: '',
    tags: [],
    file: null,
  })
  const [newTag, setNewTag] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

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
    if (e.target.files && e.target.files[0]) {
      setNewDocument(prev => ({ ...prev, file: e.target.files![0] }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = documents.length + 1
    const uploadDate = new Date().toISOString().split('T')[0]
    setDocuments([...documents, { ...newDocument, id, uploadDate }])
    setNewDocument({ name: '', type: '', tags: [], file: null })
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

  const saveDocumentChanges = (updatedDocument: Document) => {
    setDocuments(documents.map(doc => 
      doc.id === updatedDocument.id ? updatedDocument : doc
    ))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Document Management</h1>
      
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
              <Label htmlFor="view-mode">List View</Label>
              <Switch
                id="view-mode"
                checked={viewMode === 'card'}
                onCheckedChange={toggleViewMode}
              />
              <Label htmlFor="view-mode">Card View</Label>
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
                      {doc.file ? doc.file.name : doc.name}
                    </CardTitle>
                    <CardDescription className="text-sm">{doc.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {doc.tags.map(tag => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">Uploaded on: {doc.uploadDate}</p>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => openDocumentPopup(doc)}>
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openDocumentPopup(doc)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <File className="h-4 w-4" />
                        <span>{doc.file ? doc.file.name : doc.name}</span>
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
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => openDocumentPopup(doc)}>
                                <FileText className="h-4 w-4" />
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

