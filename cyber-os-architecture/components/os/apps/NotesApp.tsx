"use client"

import { useState } from "react"
import { Plus, Trash2, Search } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  updatedAt: Date
}

const initialNotes: Note[] = [
  {
    id: "1",
    title: "Welcome to Notes",
    content: "This is your notes app. Start writing your thoughts, ideas, and reminders here.\n\nFeatures:\n- Create new notes\n- Edit existing notes\n- Delete notes you don't need\n- Search through your notes",
    updatedAt: new Date("2026-05-01"),
  },
  {
    id: "2",
    title: "Project Ideas",
    content: "1. AI-powered code assistant\n2. Decentralized social network\n3. Neural interface simulator\n4. Quantum computing emulator\n5. Holographic display system",
    updatedAt: new Date("2026-04-28"),
  },
  {
    id: "3",
    title: "Meeting Notes",
    content: "Team sync - May 5th\n\n- Discussed project timeline\n- Reviewed design mockups\n- Assigned tasks for next sprint\n- Set deadline for MVP: June 15th",
    updatedAt: new Date("2026-05-05"),
  },
]

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [selectedNote, setSelectedNote] = useState<Note | null>(initialNotes[0])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      updatedAt: new Date(),
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
  }

  const updateNote = (field: "title" | "content", value: string) => {
    if (!selectedNote) return

    const updated = {
      ...selectedNote,
      [field]: value,
      updatedAt: new Date(),
    }
    setSelectedNote(updated)
    setNotes(notes.map((n) => (n.id === selectedNote.id ? updated : n)))
  }

  const deleteNote = (id: string) => {
    const newNotes = notes.filter((n) => n.id !== id)
    setNotes(newNotes)
    if (selectedNote?.id === id) {
      setSelectedNote(newNotes[0] || null)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="h-full flex bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-muted/30 flex flex-col">
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-lg font-semibold text-foreground flex-1">Notes</h1>
            <button
              onClick={createNote}
              className="p-1.5 hover:bg-muted rounded-sm transition-colors"
              title="New Note"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-muted border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`w-full text-left p-3 border-b border-border transition-colors ${
                selectedNote?.id === note.id
                  ? "bg-accent"
                  : "hover:bg-muted/50"
              }`}
            >
              <div className="font-medium text-foreground truncate">{note.title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatDate(note.updatedAt)}
              </div>
              <div className="text-sm text-muted-foreground truncate mt-1">
                {note.content.split("\n")[0]}
              </div>
            </button>
          ))}
          {filteredNotes.length === 0 && (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No notes found
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="flex items-center justify-between p-3 border-b border-border">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => updateNote("title", e.target.value)}
                className="text-lg font-semibold bg-transparent text-foreground focus:outline-none flex-1"
                placeholder="Note title..."
              />
              <button
                onClick={() => deleteNote(selectedNote.id)}
                className="p-1.5 hover:bg-destructive/20 rounded-sm transition-colors"
                title="Delete Note"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
            <div className="p-3 text-xs text-muted-foreground border-b border-border">
              Last updated: {formatDate(selectedNote.updatedAt)}
            </div>
            <textarea
              value={selectedNote.content}
              onChange={(e) => updateNote("content", e.target.value)}
              className="flex-1 p-4 bg-transparent text-foreground resize-none focus:outline-none"
              placeholder="Start writing..."
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <div className="text-lg mb-2">No note selected</div>
              <button
                onClick={createNote}
                className="text-cyan-400 hover:underline"
              >
                Create a new note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
