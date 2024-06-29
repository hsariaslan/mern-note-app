import { RequestHandler } from "express";
import Note from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getNotes: RequestHandler = async (req, res, next) => {
    try {
        const notes = await Note.find().exec();
        // I can add if notes are empty control here
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
}

export const showNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;

    try {
        // TODO: make better error handling that is not required duplications.
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id.");
        }

        const note = await Note.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note is not found.");
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
}

interface createNoteBody {
    title?: string,
    text?: string,
}

export const createNote: RequestHandler<unknown, unknown, createNoteBody, unknown> = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;

    try {
        if (!title) {
            throw createHttpError(400, "Title field is required.");
        }

        const newNote = await Note.create({
            title: title,
            text: text,
        });

        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
}

interface updateNoteParams {
    noteId: string,
}

interface updateNoteBody {
    title?: string,
    text?: string,
}

export const updateNote: RequestHandler<updateNoteParams, unknown, updateNoteBody, unknown> = async (req, res, next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;

    try {
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id.");
        }

        if (!newTitle) {
            throw createHttpError(400, "Title field is required.");
        }

        const note = await Note.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note is not found.");
        }

        note.title = newTitle;
        note.text = newText;

        const updateNote = await note.save();

        res.status(200).json(updateNote);
    } catch (error) {
        next(error);
    }
}

export const deleteNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;

    try {
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id.");
        }

        const deleteNote = await Note.findByIdAndDelete(noteId);

        if (!deleteNote) {
            throw createHttpError(404, "Note is not found.");
        }

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}