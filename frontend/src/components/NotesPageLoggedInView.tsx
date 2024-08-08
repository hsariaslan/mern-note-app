import {Button, Col, Row, Spinner} from "react-bootstrap";
import AddNoteModal from "./AddNoteModal";
import {Note as NoteModel} from "../models/note";
import EditNoteModal from "./EditNoteModal";
import React, {useEffect, useState} from "react";
import Note from "./Note";
import styles from "../styles/NotesPage.module.css";
import * as NotesApi from "../network/notes_api";

const NotesPageLoggedInView = () => {
    const [notes, setNotes] = useState<NoteModel[]>([]);
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);
    const [editingNote, setEditingNote] = useState<NoteModel | null>(null);
    const [notesLoading, setNotesLoading] = useState(true);
    const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);

    useEffect((): void => {
        async function loadNotes(): Promise<void> {
            try {
                setNotesLoading(true);
                setShowNotesLoadingError(false);
                const data: NoteModel[] = await NotesApi.fetchNotes();
                setNotes(data);
            } catch (error) {
                console.log(error);
                setShowNotesLoadingError(true);
            } finally {
                setNotesLoading(false);
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

    let notesGrid =
        <Row xs={1} md={2} xl={3} className="g-4 w-100">
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

    return (
        <>
            <Button onClick={() => setShowAddNoteModal(true)} className="my-4 mx-auto d-block">
                Add Note
            </Button>
            {notesLoading && <Spinner animation="border" variant="primary" />}
            {showNotesLoadingError && <p>Something went wrong. Re fresh the page.</p>}
            {!notesLoading && !showNotesLoadingError &&
                <>
                    {notes.length > 0
                        ? notesGrid
                        : <p>There is not a note! What about creating new 1?</p>
                    }
                </>
            }
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
        </>
    );
}

export default NotesPageLoggedInView;