import {Button, Form, Modal} from "react-bootstrap";
import { Note as NoteModel } from "../models/note";
import {useForm} from "react-hook-form";
import * as NotesApi from "../network/notes_api";
import TextInputField from "./form/TextInputField";

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

export default EditNoteModal;