import React, {useEffect, useState} from 'react';
import {Note as NoteModel} from "./models/note";
import Note from "./components/Note";
import {Button, Col, Container, Row} from "react-bootstrap";
import styles from "./styles/NotesPage.module.css";
import * as NotesApi from "./network/notes_api";
import AddNoteModal from "./components/AddNoteModal";

function App() {
    const [notes, setNotes] = useState<NoteModel[]>([]);
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);

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

    return (
        <Container>
            <Button onClick={() => setShowAddNoteModal(true)}>
                Add Note
            </Button>
            <Row xs={1} md={2} xl={3} className="g-4">
                {notes.map((note: NoteModel) => (
                    <Col key={note._id}>
                        <Note note={note} className={styles.note}/>
                    </Col>
                ))}
            </Row>
            {showAddNoteModal && (
                <AddNoteModal
                    onDismiss={() => setShowAddNoteModal(false)}
                    onNoteSaved={(newNote: NoteModel) => {
                        setNotes([...notes, newNote])
                        setShowAddNoteModal(false);
                    }}
                />
            )}
        </Container>
    );
}

export default App;
