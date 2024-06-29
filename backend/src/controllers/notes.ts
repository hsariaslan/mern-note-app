import { RequestHandler } from "express";
import Note from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const index: RequestHandler = async (req, res, next) => {
    try {
        const notes = await Note.find().exec();
        // I can add if notes are empty control here
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
}

export const show: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;

    try {
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

export const create: RequestHandler<unknown, unknown, createNoteBody, unknown> = async (req, res, next) => {
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