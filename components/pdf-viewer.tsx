'use client';

import { useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '@react-pdf-viewer/core/lib/styles/index.css';

interface PDFViewerProps {
  documentUrl: string;
}

export function PDFViewer({ documentUrl }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const onDocumentLoad = (e: { doc: { numPages: number } }) => {
    setTotalPages(e.doc.numPages);
    setCurrentPage(1);
  };

  const onPageChange = (e: { currentPage: number }) => {
    setCurrentPage(e.currentPage + 1);
  };

  const downloadPDF = () => {
    const a = document.createElement('a');
    a.href = documentUrl;
    a.download = 'document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col items-center">
      <Worker workerUrl="/pdf.worker.min.js">
        <div className="max-h-[70vh] overflow-y-auto border">
          <Viewer
            fileUrl={documentUrl}
            onDocumentLoad={onDocumentLoad}
            onPageChange={onPageChange}
            defaultScale={1}
            renderError={() => (
              <div className="flex flex-col items-center justify-center p-4">
                <p className="text-red-500">Failed to load PDF. Please try downloading it.</p>
                <Button onClick={downloadPDF}>Download PDF</Button>
              </div>
            )}
          />
        </div>
      </Worker>

      {totalPages > 0 && (
        <div className="flex items-center gap-4 mt-4">
          <Button
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
