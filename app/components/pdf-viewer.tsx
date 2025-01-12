'use client'

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Set the worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  documentUrl: string;
}

export function PDFViewer({ documentUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="flex flex-col items-center">
      <Document
        file={documentUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        options={{
          cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
          cMapPacked: true,
        }}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <div className="flex items-center mt-4">
        <Button
          onClick={() => setPageNumber(page => Math.max(page - 1, 1))}
          disabled={pageNumber <= 1}
          className="mr-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="text-sm">
          Page {pageNumber} of {numPages}
        </p>
        <Button
          onClick={() => setPageNumber(page => Math.min(page + 1, numPages || 1))}
          disabled={numPages === null || pageNumber >= numPages}
          className="ml-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

