import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Document {
  id: number;
  name: string;
  type: string;
  tags: string[];
  uploadDate: string;
  file: File | null;
}

interface DocumentPopupProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedDocument: Document) => void;
}

const documentTypes = ['Will', 'Power of Attorney', 'Medical Directive', 'Insurance Policy', 'Financial Statement', 'Other']

export function DocumentPopup({ document, isOpen, onClose, onSave }: DocumentPopupProps) {
  const [editedDocument, setEditedDocument] = React.useState<Document | null>(null)
  const [newTag, setNewTag] = React.useState('')

  React.useEffect(() => {
    setEditedDocument(document)
  }, [document])

  if (!editedDocument) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedDocument(prev => ({ ...prev!, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setEditedDocument(prev => ({ ...prev!, type: value }))
  }

  const handleAddTag = () => {
    if (newTag && !editedDocument.tags.includes(newTag)) {
      setEditedDocument(prev => ({ ...prev!, tags: [...prev!.tags, newTag] }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedDocument(prev => ({
      ...prev!,
      tags: prev!.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSave = () => {
    onSave(editedDocument)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editedDocument.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={editedDocument.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select onValueChange={handleTypeChange} value={editedDocument.type}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="uploadDate" className="text-right">
              Upload Date
            </Label>
            <Input
              id="uploadDate"
              name="uploadDate"
              value={editedDocument.uploadDate}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <div className="col-span-3">
              <div className="flex flex-wrap gap-2 mb-2">
                {editedDocument.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="px-2 py-1">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-2 text-xs">&times;</button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="newTag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                />
                <Button type="button" onClick={handleAddTag}>Add</Button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

