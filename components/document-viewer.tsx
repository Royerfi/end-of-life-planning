'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { PDFViewer } from './pdf-viewer'

interface DocumentViewerProps {
  documentUrl: string;
  mimeType: string;
  onClose: () => void;
}

export function DocumentViewer({ documentUrl, mimeType, onClose }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  if (!documentUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
          <DialogDescription>No document URL provided</DialogDescription>
        </DialogHeader>
        <Button onClick={onClose} className="mt-4">Close</Button>
      </div>
    )
  }

  useEffect(() => {
    if (!documentUrl) {
      setError('No document URL provided')
      setIsLoading(false)
      return
    }

    const checkDocument = async () => {
      try {
        const response = await fetch(documentUrl)
        if (!response.ok) {
          throw new Error('Failed to load document')
        }
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load document. Please try again later.')
        console.error('Error loading document:', err)
      }
    }

    checkDocument()
  }, [documentUrl])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
          <DialogDescription>{error}</DialogDescription>
        </DialogHeader>
        <Button onClick={onClose} className="mt-4">Close</Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <DialogHeader>
          <DialogTitle>Loading Document</DialogTitle>
          <DialogDescription>Please wait while we load your document...</DialogDescription>
        </DialogHeader>
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <DialogHeader>
        <DialogTitle>Document Viewer</DialogTitle>
        <DialogDescription>Viewing your document</DialogDescription>
      </DialogHeader>
      <div className="flex-grow">
        {mimeType.startsWith('image/') && (
          <img 
            src={documentUrl || "/placeholder.svg"} 
            alt="Document" 
            className="max-w-full max-h-full object-contain"
            crossOrigin="anonymous"
          />
        )}
        {mimeType === 'application/pdf' && (
          <PDFViewer documentUrl={documentUrl} />
        )}
        {!mimeType.startsWith('image/') && mimeType !== 'application/pdf' && (
          <div className="flex items-center justify-center h-full">
            <p>Unsupported file type. Please download to view.</p>
          </div>
        )}
      </div>
      <div className="flex justify-end p-4">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  )
}

