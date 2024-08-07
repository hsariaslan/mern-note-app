import {Button, Form, Modal} from "react-bootstrap";
import { Note as NoteModel } from "../models/note";
import {useForm} from "react-hook-form";
import * as NotesApi from "../network/notes_api";
import TextInputField from "./form/TextInputField";

interface AddNoteModalProps {
    onDismiss: () => void,
    onNoteSaved: (note: NoteModel) => void,
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
            const noteResponse: NoteModel = await NotesApi.createNote(input);
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
                    <TextInputField
                        name="title"
                        label="Title"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.title}
                        type="text"
                    />
                    <TextInputField
                        name="text"
                        label="Text"
                        register={register}
                        as="textarea"
                        rows="4"
                    />
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