'use client'

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const PDFViewer = dynamic(() => import('./pdf-viewer').then(mod => mod.PDFViewer), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-[600px]"><Loader2 className="h-8 w-8 animate-spin" /></div>,
});

interface DocumentViewerProps {
  documentUrl: string;
}

export default function DocumentViewer({ documentUrl }: DocumentViewerProps) {
  const [fileType, setFileType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileType = async () => {
      try {
        const response = await fetch(documentUrl, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error('Failed to fetch document');
        }
        const contentType = response.headers.get('content-type');
        setFileType(contentType);
      } catch (error) {
        console.error('Error fetching file type:', error);
        setError('Failed to load document. Please try again later.');
      }
    };

    fetchFileType();
  }, [documentUrl]);

  if (error) {
    return <div className="flex justify-center items-center h-[600px] text-red-500">{error}</div>;
  }

  if (!fileType) {
    return <div className="flex justify-center items-center h-[600px]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (fileType === 'application/pdf') {
    return <PDFViewer documentUrl={documentUrl} />;
  }

  // For non-PDF files, provide a download link
  return (
    <div className="flex justify-center items-center h-[600px]">
      <a
        href={documentUrl}
        download
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Download File
      </a>
    </div>
  );
}

