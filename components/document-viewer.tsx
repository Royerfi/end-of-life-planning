'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Replacing <img> for optimization
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PDFViewer } from './pdf-viewer';

interface DocumentViewerProps {
  documentId: string;
  documentUrl: string;
  mimeType?: string;
  filePath: string;
  onClose: () => void;
}

function getMimeType(filePath: string): string {
  const extension = filePath?.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf': return 'application/pdf';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'txt': return 'text/plain';
    default: return 'application/octet-stream';
  }
}

export function DocumentViewer({ documentId, documentUrl, mimeType, filePath, onClose }: DocumentViewerProps) {
  const resolvedMimeType = mimeType || getMimeType(filePath); // Removed dependency on resolvedMimeType state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.statusText}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [filePath]); // Removed `resolvedMimeType` from dependencies

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
          <DialogDescription>{error}</DialogDescription>
        </DialogHeader>
        <Button onClick={onClose} className="mt-4">
          Close
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <DialogHeader>
          <DialogTitle>Loading Document</DialogTitle>
          <DialogDescription>Please wait while we load your document...</DialogDescription>
        </DialogHeader>
      </div>
    );
  }

  const downloadFileName = `document-${documentUrl.split('/').pop()}.${filePath.split('.').pop()}`;

  return (
    <div className="h-full flex flex-col">
      <DialogHeader>
        <DialogTitle>Document Viewer</DialogTitle>
        <DialogDescription>Viewing your document</DialogDescription>
        <DialogDescription>{documentId}</DialogDescription>
      </DialogHeader>
      <div className="flex-grow overflow-auto">
        {resolvedMimeType.startsWith('image/') ? (
         <Image
         src={filePath}
         alt="Document preview"
         width={800}
         height={600}
         className="mx-auto"
       />
       
        ) : resolvedMimeType === 'application/pdf' ? (
          <PDFViewer documentUrl={filePath} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="mb-4">This file type cannot be previewed.</p>
            <Button
              onClick={() => {
                const a = document.createElement('a');
                a.href = filePath;
                a.download = downloadFileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              Download Document
            </Button>
          </div>
        )}
      </div>
      <div className="flex justify-end p-4">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
