"use client";

import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Upload, FileText } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { DocumentViewer } from "@/components/document-viewer";

const documentTypes = ['Will', 'Power of Attorney', 'Medical Directive', 'Insurance Policy', 'Financial Statement', 'Deed', 'Other'];

interface Document {
  id: string;
  name: string;
  type: string;
  file_path: string;
  mimeType: string;
  created_at: string;
  tags?: string[];
}

export default function DocumentsPage(): JSX.Element {
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await fetch('/api/documents');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      console.log('Fetched documents:', data);
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch documents. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags(prev => [...prev, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!documentName) {
        setDocumentName(file.name);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile || !documentName || !documentType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', documentName);
    formData.append('type', documentType);
    formData.append('tags', JSON.stringify(tags));

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload document');
      }

      await fetchDocuments();
      toast({
        title: "Success",
        description: "Document uploaded successfully.",
      });

      setSelectedFile(null);
      setDocumentName('');
      setDocumentType('');
      setTags([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleViewDocument = (doc: Document) => {
    console.log('Attempting to view document:', doc);
    try {
      setSelectedDocument(doc);
      setIsViewerOpen(true);
    } catch (error) {
      console.error('Error setting up document viewer:', error);
      toast({
        title: "Error",
        description: "Failed to open document viewer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderDocuments = () => {
    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">{doc.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {doc.type}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-center py-6">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDocument(doc)}
                  >
                    View
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Uploaded on {formatDate(doc.created_at)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="text-lg font-medium">{doc.name}</h3>
                <p className="text-sm text-muted-foreground">{doc.type}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Uploaded on {formatDate(doc.created_at)}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDocument(doc)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Documents</h1>
        </div>
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
                    ref={fileInputRef}
                    disabled={isLoading} 
                  />
                  <Button type="button" size="icon" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Document Name</Label>
                <Input 
                  id="name" 
                  value={documentName} 
                  onChange={(e) => setDocumentName(e.target.value)} 
                  placeholder="Enter document name"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Document Type</Label>
                <Select onValueChange={setDocumentType} value={documentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex space-x-2">
                  <Input 
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    disabled={isLoading}
                  />
                  <Button type="button" onClick={handleAddTag} disabled={isLoading}>Add Tag</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <button 
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 hover:text-destructive"
                        disabled={isLoading}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Uploading...' : 'Upload Document'}
              </Button>
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
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderDocuments()}
          </CardContent>
        </Card>
      </div>
      <Dialog
        open={isViewerOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            console.log('Closing document viewer');
            setSelectedDocument(null);
          }
          setIsViewerOpen(open);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh]">
          {selectedDocument ? (
            <DocumentViewer
              documentId={selectedDocument.id}
              documentUrl={selectedDocument.file_path}
              mimeType={selectedDocument.mimeType}
              filePath={selectedDocument.file_path}
              onClose={() => setIsViewerOpen(false)}
            />
          ) : (
            <div>No document selected</div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}