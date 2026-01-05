'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  FileText, Save, Edit, Tag, Clock, 
  User, Trash2, CheckCircle, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface ChatNote {
  id: string;
  content: string;
  tags: string[];
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
}

interface ChatNotesProps {
  sessionId: string;
  isAttendant?: boolean;
}

export default function ChatNotes({ sessionId, isAttendant = false }: ChatNotesProps) {
  const [notes, setNotes] = useState<ChatNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const notesContainerRef = useRef<HTMLDivElement>(null);
  
  // Predefined tags for quick selection
  const predefinedTags = [
    'Follow-up', 'Urgent', 'Resolved', 'Technical', 
    'Billing', 'Academic', 'Admission', 'General'
  ];

  // Load notes from localStorage (or API in production)
  useEffect(() => {
    const savedNotes = localStorage.getItem(`chat_notes_${sessionId}`);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        // Convert date strings back to Date objects
        const notesWithDates = parsedNotes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: note.updatedAt ? new Date(note.updatedAt) : undefined
        }));
        setNotes(notesWithDates);
      } catch (err) {
        console.error('Failed to load notes:', err);
      }
    }
  }, [sessionId]);

  // Save notes to localStorage
  const saveNotes = (notesToSave: ChatNote[]) => {
    localStorage.setItem(`chat_notes_${sessionId}`, JSON.stringify(notesToSave));
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !isAttendant) return;

    setSaving(true);
    setError(null);

    try {
      const newNoteObj: ChatNote = {
        id: Date.now().toString(),
        content: newNote.trim(),
        tags: newTags,
        createdAt: new Date(),
        createdBy: 'Attendant' // In real app, get from user context
      };

      const updatedNotes = [newNoteObj, ...notes];
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
      
      setNewNote('');
      setNewTags([]);
      
      // Scroll to top
      if (notesContainerRef.current) {
        notesContainerRef.current.scrollTop = 0;
      }
    } catch (err) {
      setError('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateNote = (noteId: string) => {
    if (!editContent.trim()) return;

    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { 
            ...note, 
            content: editContent.trim(),
            updatedAt: new Date()
          }
        : note
    );
    
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setEditingNoteId(null);
    setEditContent('');
  };

  const handleDeleteNote = (noteId: string) => {
    if (!window.confirm('Delete this note?')) return;

    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const handleAddTag = (tag: string) => {
    if (!newTags.includes(tag)) {
      setNewTags([...newTags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewTags(newTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag(tagInput.trim());
      setTagInput('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-text-primary">Chat Notes</h3>
        </div>
        
        {!isAttendant && (
          <div className="p-3 bg-warning/10 rounded-lg">
            <p className="text-sm text-warning">
              Only attendants can add notes
            </p>
          </div>
        )}
      </div>

      {/* Notes List */}
      <div 
        ref={notesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {notes.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-text-secondary mx-auto mb-3" />
            <p className="text-text-secondary">No notes yet</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-background2 rounded-lg p-3 border border-border">
              {editingNoteId === note.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingNoteId(null);
                        setEditContent('');
                      }}
                      className="px-3 py-1 text-sm text-text-secondary hover:bg-background2/80 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateNote(note.id)}
                      className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-hover"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-2">
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  </div>
                  
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{note.createdBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{format(new Date(note.createdAt), 'PP')}</span>
                      </div>
                    </div>
                    
                    {isAttendant && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingNoteId(note.id);
                            setEditContent(note.content);
                          }}
                          className="p-1 hover:bg-background2/80 rounded"
                          title="Edit note"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1 hover:bg-error/10 rounded text-error"
                          title="Delete note"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Note Form (Only for attendants) */}
      {isAttendant && (
        <div className="p-4 border-t border-border space-y-3">
          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-2 bg-error/10 rounded-lg">
              <AlertCircle className="h-4 w-4 text-error" />
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {/* Tags Input */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tags
            </label>
            
            {/* Selected Tags */}
            {newTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {newTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-primary-hover"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Predefined Tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {predefinedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleAddTag(tag)}
                  disabled={newTags.includes(tag)}
                  className={`px-2 py-1 text-xs rounded transition ${
                    newTags.includes(tag)
                      ? 'bg-primary text-white'
                      : 'bg-background2 text-text-secondary hover:bg-background2/80'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            {/* Custom Tag Input */}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Type tag and press Enter..."
              className="w-full px-3 py-2 bg-background2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Add Note
            </label>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add notes about this chat..."
              className="w-full px-3 py-2 bg-background2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              rows={3}
              disabled={saving}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim() || saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <CheckCircle className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Note
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}