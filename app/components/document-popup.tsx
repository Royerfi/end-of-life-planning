'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DocumentViewer from './document-viewer'

interface Document {
  id: number;
  name: string;
  type: string;
  tags: string[];
  upload_date: string;
  file_path: string;
  uploader_name: string;
}

interface DocumentPopupProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (document: Document) => Promise<void>;
}

export default function DocumentPopup({ document, isOpen, onClose, onSave }: DocumentPopupProps) {
  const [editedDocument, setEditedDocument] = useState<Document | null>(document)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedDocument) {
      setEditedDocument({ ...editedDocument, [e.target.name]: e.target.value })
    }
  }

  const handleSave = async () => {
    if (editedDocument) {
      await onSave(editedDocument);
      onClose();
    }
  }

  if (!document) return null

  const documentUrl = `/api/documents?id=${document.id}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{document.name}</DialogTitle>
          <DialogDescription>View and edit document details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={editedDocument?.name || ''}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Input
              id="type"
              name="type"
              value={editedDocument?.type || ''}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="col-span-4">
            <DocumentViewer documentUrl={documentUrl} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

