import { Note } from "../models/note";

async function fetchData(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const response: Response = await fetch(input, init);

    if (!response.ok) {
        const errorBody = await response.json();
        throw Error(errorBody.error);
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