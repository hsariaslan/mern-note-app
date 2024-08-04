import {Button, Form, Modal} from "react-bootstrap";
import { Note as NoteModel } from "../models/note";
import {useForm} from "react-hook-form";
import * as NotesApi from "../network/notes_api";

interface EditNoteModalProps {
    note?: NoteModel,
    onDismiss: () => void,
    onNoteSaved: (note: NoteModel) => void,
}

const EditNoteModal = ({note, onDismiss, onNoteSaved}: EditNoteModalProps) => {
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
    }} = useForm<NotesApi.NoteInput>({
        defaultValues: {
            title: note?.title || "",
            text: note?.text || "",
        },
    });

    async function onSubmit(input: NotesApi.NoteInput): Promise<void> {
        try {
            let noteResponse: NoteModel;

            if (note) {
                noteResponse = await NotesApi.updateNote(note._id, input);
            } else {
                noteResponse = await NotesApi.createNote(input);
            }

            onNoteSaved(noteResponse);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit Note
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

export default EditNoteModal;