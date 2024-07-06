import React, {useEffect, useState} from 'react';
import './App.css';
import { Note } from "./models/note";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    async function loadNotes() {
      try {
        const response = await fetch('/api/v1/notes', { method: 'GET' });
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.log(error);
      }
    }

    loadNotes();
  }, []);

  return (
    <div className="app">
      { JSON.stringify(notes) }
    </div>
  );
}

export default App;
