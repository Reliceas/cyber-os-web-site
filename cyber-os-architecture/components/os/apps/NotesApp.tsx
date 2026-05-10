"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Search } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

type SerializedNote = Omit<Note, "updatedAt"> & {
  updatedAt: string;
};

const NOTES_STORAGE_KEY = "cyber-os-notes";
const SELECTED_NOTE_STORAGE_KEY = "cyber-os-selected-note";

const initialNotes: Note[] = [
  {
    id: "1",
    title: "Welcome to Notes",
    content:
      "This is your notes app. Start writing your thoughts, ideas, and reminders here.\n\nFeatures:\n- Create new notes\n- Edit existing notes\n- Delete notes you don't need\n- Search through your notes\n- Notes now save automatically in this browser",
    updatedAt: new Date("2026-05-01"),
  },
  {
    id: "2",
    title: "Project Ideas",
    content:
      "1. AI-powered code assistant\n2. Decentralized social network\n3. Neural interface simulator\n4. Quantum computing emulator\n5. Holographic display system",
    updatedAt: new Date("2026-04-28"),
  },
  {
    id: "3",
    title: "Meeting Notes",
    content:
      "Team sync - May 5th\n\n- Discussed project timeline\n- Reviewed design mockups\n- Assigned tasks for next sprint\n- Set deadline for MVP: June 15th",
    updatedAt: new Date("2026-05-05"),
  },
];

function serializeNote(note: Note): SerializedNote {
  return {
    ...note,
    updatedAt: note.updatedAt.toISOString(),
  };
}

function deserializeNotes(value: string): Note[] {
  const parsed = JSON.parse(value) as SerializedNote[];

  if (!Array.isArray(parsed)) {
    return initialNotes;
  }

  return parsed.map((note) => {
    const updatedAt = new Date(note.updatedAt);

    return {
      id: String(note.id),
      title: String(note.title || "Untitled Note"),
      content: String(note.content || ""),
      updatedAt: Number.isNaN(updatedAt.getTime()) ? new Date() : updatedAt,
    };
  });
}

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    initialNotes[0]?.id ?? null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedNotes = window.localStorage.getItem(NOTES_STORAGE_KEY);

      if (savedNotes) {
        const parsedNotes = deserializeNotes(savedNotes);
        const savedSelectedNoteId = window.localStorage.getItem(
          SELECTED_NOTE_STORAGE_KEY,
        );

        setNotes(parsedNotes);
        setSelectedNoteId(
          parsedNotes.some((note) => note.id === savedSelectedNoteId)
            ? savedSelectedNoteId
            : (parsedNotes[0]?.id ?? null),
        );
      }
    } catch (error) {
      console.warn("Failed to load CyberOS notes from localStorage", error);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    window.localStorage.setItem(
      NOTES_STORAGE_KEY,
      JSON.stringify(notes.map(serializeNote)),
    );
  }, [hasHydrated, notes]);

  useEffect(() => {
    if (!hasHydrated) return;

    if (selectedNoteId) {
      window.localStorage.setItem(SELECTED_NOTE_STORAGE_KEY, selectedNoteId);
    } else {
      window.localStorage.removeItem(SELECTED_NOTE_STORAGE_KEY);
    }
  }, [hasHydrated, selectedNoteId]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null;

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      updatedAt: new Date(),
    };

    setNotes((currentNotes) => [newNote, ...currentNotes]);
    setSelectedNoteId(newNote.id);
  };

  const updateNote = (field: "title" | "content", value: string) => {
    if (!selectedNoteId) return;

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === selectedNoteId
          ? {
              ...note,
              [field]: value,
              updatedAt: new Date(),
            }
          : note,
      ),
    );
  };

  const deleteNote = (id: string) => {
    const newNotes = notes.filter((note) => note.id !== id);

    setNotes(newNotes);

    if (selectedNoteId === id) {
      setSelectedNoteId(newNotes[0]?.id ?? null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="h-full flex bg-background max-sm:flex-col">
      <div className="w-64 border-r border-border bg-muted/30 flex flex-col max-sm:w-full max-sm:h-56 max-sm:border-r-0 max-sm:border-b">
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">Notes</h1>
              <p className="text-[11px] text-muted-foreground">
                {hasHydrated ? "Saved locally" : "Loading notes..."}
              </p>
            </div>
            <button
              onClick={createNote}
              className="p-1.5 hover:bg-muted rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              title="New Note"
              aria-label="Create new note"
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
              onClick={() => setSelectedNoteId(note.id)}
              className={`w-full text-left p-3 border-b border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400 ${
                selectedNoteId === note.id ? "bg-accent" : "hover:bg-muted/50"
              }`}
            >
              <div className="font-medium text-foreground truncate">
                {note.title}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatDate(note.updatedAt)}
              </div>
              <div className="text-sm text-muted-foreground truncate mt-1">
                {note.content.split("\n")[0] || "Empty note"}
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

      <div className="flex-1 flex flex-col min-h-0">
        {selectedNote ? (
          <>
            <div className="flex items-center justify-between p-3 border-b border-border gap-3">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => updateNote("title", e.target.value)}
                className="text-lg font-semibold bg-transparent text-foreground focus:outline-none flex-1 min-w-0"
                placeholder="Note title..."
              />
              <button
                onClick={() => deleteNote(selectedNote.id)}
                className="p-1.5 hover:bg-destructive/20 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/60"
                title="Delete Note"
                aria-label="Delete selected note"
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
              className="flex-1 p-4 bg-transparent text-foreground resize-none focus:outline-none min-h-0"
              placeholder="Start writing..."
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <div className="text-lg mb-2">No note selected</div>
              <button
                onClick={createNote}
                className="text-cyan-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm"
              >
                Create a new note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
