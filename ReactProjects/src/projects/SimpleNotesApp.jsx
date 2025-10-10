import { useState } from 'react'

const SimpleNotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');

  const addNote = () => {
    if (noteText.trim()) {
      setNotes([...notes, { id: Date.now(), text: noteText }]);
      setNoteText('');
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="project-content">
      <h2>Simple Notes App</h2>
      <div className="notes-container">
        <div className="note-input">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write your note here..."
            rows="4"
          />
          <button onClick={addNote}>Add Note</button>
        </div>
        <div className="notes-list">
          {notes.length === 0 ? (
            <p className="empty-message">No notes yet. Start writing!</p>
          ) : (
            notes.map(note => (
              <div key={note.id} className="note-item">
                <p>{note.text}</p>
                <button onClick={() => deleteNote(note.id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleNotesApp;
