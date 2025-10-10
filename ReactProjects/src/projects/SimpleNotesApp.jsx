import { useState, useRef, useEffect } from 'react'

const SimpleNotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (showWarning) {
      const timer = setTimeout(() => {
        setShowWarning(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showWarning]);

  const addOrUpdateNote = () => {
    if (noteText.trim()) {
      if (editingId) {
        // Update existing note
        setNotes(notes.map(note => 
          note.id === editingId ? { ...note, text: noteText } : note
        ));
        setEditingId(null);
      } else {
        // Add new note
        setNotes([...notes, { id: Date.now(), text: noteText }]);
      }
      setNoteText('');
      setShowWarning(false);
    } else {
      // Focus textarea and show warning if empty
      textareaRef.current?.focus();
      setShowWarning(true);
    }
  };

  const editNote = (note) => {
    setNoteText(note.text);
    setEditingId(note.id);
    setShowWarning(false);
    // Focus textarea after state update
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const cancelEdit = () => {
    setNoteText('');
    setEditingId(null);
    setShowWarning(false);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    // If deleting the note being edited, cancel edit
    if (id === editingId) {
      cancelEdit();
    }
  };

  return (
    <div className="project-content">
      <h2>Simple Notes App</h2>
      <div className="notes-container">
        <div className="note-input">
          <textarea
            ref={textareaRef}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write your note here..."
            rows="4"
            className={showWarning ? 'warning' : ''}
            maxLength={1000}
          />
          <div className="character-counter">
            {noteText.length} / 1000 characters
          </div>
          {showWarning && (
            <p className="warning-text">⚠️ Please write something before adding a note!</p>
          )}
          <div className="button-group">
            <button onClick={addOrUpdateNote} className="primary-button">
              {editingId ? '💾 Save Note' : '➕ Add Note'}
            </button>
            {editingId && (
              <button onClick={cancelEdit} className="secondary-button">
                ✕ Cancel
              </button>
            )}
          </div>
        </div>
        <div className="notes-list">
          {notes.length === 0 ? (
            <p className="empty-message">No notes yet. Start writing!</p>
          ) : (
            notes.map(note => (
              <div key={note.id} className="note-item">
                <p>{note.text}</p>
                <div className="note-actions">
                  <button onClick={() => editNote(note)} className="edit-button">
                    ✏️ Edit
                  </button>
                  <button onClick={() => deleteNote(note.id)} className="delete-button">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleNotesApp;
