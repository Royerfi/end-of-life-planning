"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash } from 'lucide-react'

export function DocumentList() {
  const [documents, setDocuments] = useState<string[]>([])
  const [newDocument, setNewDocument] = useState("")

  const addDocument = () => {
    if (newDocument.trim() !== "") {
      setDocuments([...documents, newDocument.trim()])
      setNewDocument("")
    }
  }

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter document name"
          value={newDocument}
          onChange={(e) => setNewDocument(e.target.value)}
        />
        <Button onClick={addDocument}>
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
      <ul className="space-y-2">
        {documents.map((doc, index) => (
          <li key={index} className="flex items-center justify-between">
            <span>{doc}</span>
            <Button variant="ghost" size="sm" onClick={() => removeDocument(index)}>
              <Trash className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

