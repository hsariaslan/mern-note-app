import {Button, Form, Modal} from "react-bootstrap";
import { Note } from "../models/note";
import {useForm} from "react-hook-form";
import * as NotesApi from "../network/notes_api";

interface AddNoteModalProps {
    onDismiss: () => void,
    onNoteSaved: (note: Note) => void,
}

const AddNoteModal = ({onDismiss, onNoteSaved}: AddNoteModalProps) => {
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
    }} = useForm<NotesApi.NoteInput>();

    async function onSubmit(input: NotesApi.NoteInput): Promise<void> {
        try {
            const noteResponse = await NotesApi.createNote(input);
            onNoteSaved(noteResponse);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Add Note
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="addNoteForm" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Title
                        </Form.Label>
                        <Form.Control
                            type="text"
                            isInvalid={!!errors.title}
                            {...register("title", {required: "Required"})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            Text
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            {...register("text")}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type="submit"
                    form="addNoteForm"
                    disabled={isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddNoteModal;