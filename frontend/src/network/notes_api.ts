import { Note } from "../models/note";
import {ConflictError, UnauthorizedError} from "../errors/http_errors";

async function fetchData(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const response: Response = await fetch(input, init);

    if (!response.ok) {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;

        if (response.status === 401) {
            throw new UnauthorizedError(errorMessage);
        } else if (response.status === 409) {
            throw new ConflictError(errorMessage);
        } else {
            throw new Error("Request failed with status: " + response.status + " message: " + errorMessage);
        }
    }

    return response;
}

export async function fetchNotes(): Promise<Note[]> {
    const response: Response = await fetchData('/api/v1/notes', { method: 'GET' });

    return response.json();
}

export interface NoteInput {
    title: string,
    text?: string,
}

export async function createNote(note: NoteInput): Promise<Note> {
    const response: Response = await fetchData("/api/v1/notes", {
        method: 'POST',
        body: JSON.stringify(note),
        headers: {
            "Content-Type": "application/json",
        }
    });

    return response.json();
}

export async function updateNote(noteId: string, note: NoteInput): Promise<Note> {
    const response: Response = await fetchData("/api/v1/notes/" + noteId, {
        method: 'PATCH',
        body: JSON.stringify(note),
        headers: {
            "Content-Type": "application/json",
        }
    });

    return response.json();
}

export async function deleteNote(noteId: string): Promise<void> {
    await fetchData("/api/v1/notes/" + noteId, {
        method: 'DELETE',
    });
}