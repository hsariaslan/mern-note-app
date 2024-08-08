import { RequestHandler } from "express";
import Note from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import {assertIsDefined} from "../util/assertIsDefined";

export const getNotes: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const notes = await Note.find({userId: authenticatedUserId}).exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
}

export const showNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id.");
        }

        const note = await Note.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note is not found.");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You are not authorized here!");
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
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!title) {
            throw createHttpError(400, "Title field is required.");
        }

        const newNote = await Note.create({
            userId: authenticatedUserId,
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
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

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

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You are not authorized here!");
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
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id.");
        }

        const deleteNote = await Note.findByIdAndDelete(noteId);

        if (!deleteNote) {
            throw createHttpError(404, "Note is not found.");
        }

        if (!deleteNote.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You are not authorized here!");
        }

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}