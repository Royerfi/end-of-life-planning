'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DocumentViewer } from './document-viewer';

interface DocumentType {
  id: string;
  name: string;
  type: string;
  filePath: string;
  size: number;
  mimeType: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface DocumentPopupProps {
  document: DocumentType | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (document: DocumentType) => Promise<void>;
  onDelete: (document: DocumentType) => Promise<void>;
}

export function DocumentPopup({
  document,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: DocumentPopupProps) {
  const [editedDocument, setEditedDocument] = useState<DocumentType | null>(document);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedDocument) {
      setEditedDocument({ ...editedDocument, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (editedDocument) {
      setIsLoading(true);
      try {
        await onSave(editedDocument);
        onClose();
      } catch (error) {
        console.error('Error saving document:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (editedDocument) {
      setIsLoading(true);
      try {
        await onDelete(editedDocument);
        onClose();
      } catch (error) {
        console.error('Error deleting document:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!document) return null;

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
            <DocumentViewer
              documentId={document.id}
              documentUrl={document.filePath}
              mimeType={document.mimeType}
              filePath={document.filePath}
              onClose={onClose}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete Document
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSave}
              disabled={isLoading}
            >
              Save changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
