import React, {useEffect, useState} from 'react';
import {Note as NoteModel} from "./models/note";
import Note from "./components/Note";
import {Button, Col, Container, Row} from "react-bootstrap";
import styles from "./styles/NotesPage.module.css";
import * as NotesApi from "./network/notes_api";
import AddNoteModal from "./components/AddNoteModal";
import EditNoteModal from "./components/EditNoteModal";

function App() {
    const [notes, setNotes] = useState<NoteModel[]>([]);
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);
    const [editingNote, setEditingNote] = useState<NoteModel|null>(null);

    useEffect((): void => {
        async function loadNotes(): Promise<void> {
            try {
                const data: NoteModel[] = await NotesApi.fetchNotes();
                setNotes(data);
            } catch (error) {
                console.log(error);
            }
        }

        loadNotes();
    }, []);

    async function deleteNote(note: NoteModel): Promise<void> {
        try {
            await NotesApi.deleteNote(note._id);
            setNotes(notes.filter((existingNote: NoteModel): boolean => existingNote._id !== note._id));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container>
            <Button onClick={() => setShowAddNoteModal(true)} className="my-4 mx-auto d-block">
                Add Note
            </Button>
            <Row xs={1} md={2} xl={3} className="g-4">
                {notes.map((note: NoteModel) => (
                    <Col key={note._id}>
                        <Note
                            note={note}
                            onNoteClicked={setEditingNote}
                            onDeleteClicked={deleteNote}
                            className={styles.note}
                        />
                    </Col>
                ))}
            </Row>
            {showAddNoteModal && (
                <AddNoteModal
                    onDismiss={() => setShowAddNoteModal(false)}
                    onNoteSaved={(newNote: NoteModel): void => {
                        setNotes([...notes, newNote]);
                        setShowAddNoteModal(false);
                    }}
                />
            )}
            {editingNote && (
                <EditNoteModal
                    note={editingNote}
                    onDismiss={() => setEditingNote(null)}
                    onNoteSaved={(updatedNote: NoteModel): void => {
                        setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote));
                        setEditingNote(null);
                    }}
                />
            )}
        </Container>
    );
}

export default App;
