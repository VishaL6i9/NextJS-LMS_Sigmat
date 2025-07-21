import React, { useState } from 'react';
import { Plus, Edit3, Clock } from 'lucide-react';
import { Delete } from '@/components/ui/Delete';
import { Note } from '../types/course';
import { formatTime } from '../utils/timeUtils';

interface NotesPanelProps {
  notes: Note[];
  currentLessonId: string;
  currentTime: number;
  onAddNote: (content: string, timestamp: number) => void;
  onDeleteNote: (noteId: string) => void;
  onSeekToNote: (timestamp: number) => void;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({
  notes,
  currentLessonId,
  currentTime,
  onAddNote,
  onDeleteNote,
  onSeekToNote,
}) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  const lessonNotes = notes.filter(note => note.lessonId === currentLessonId);

  const handleAddNote = () => {
    if (noteContent.trim()) {
      onAddNote(noteContent.trim(), currentTime);
      setNoteContent('');
      setIsAddingNote(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Edit3 size={18} className="mr-2" />
          My Notes
        </h3>
        <button
          onClick={() => setIsAddingNote(true)}
          className="flex items-center space-x-1 px-3 py-1 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
        >
          <Plus size={16} />
          <span>Add Note</span>
        </button>
      </div>

      {isAddingNote && (
        <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Clock size={14} className="mr-1" />
            <span>At {formatTime(currentTime)}</span>
          </div>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Write your note here..."
            className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            autoFocus
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => {
                setIsAddingNote(false);
                setNoteContent('');
              }}
              className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNote}
              disabled={!noteContent.trim()}
              className="px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors disabled:opacity-50 text-sm"
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {lessonNotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Edit3 size={32} className="mx-auto mb-2 opacity-50" />
            <p>No notes yet for this lesson</p>
            <p className="text-sm">Click "Add Note" to get started</p>
          </div>
        ) : (
          lessonNotes
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((note) => (
              <div key={note.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => onSeekToNote(note.timestamp)}
                    className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <Clock size={14} className="mr-1" />
                    {formatTime(note.timestamp)}
                  </button>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete note"
                  >
                    <Delete width={14} height={14} stroke="currentColor" />
                  </button>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{note.content}</p>
                <div className="text-xs text-gray-500 mt-2">
                  {note.createdAt.toLocaleDateString()} at {note.createdAt.toLocaleTimeString()}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};