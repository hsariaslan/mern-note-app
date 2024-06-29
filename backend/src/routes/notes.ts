import express from "express";
import * as NotesController from "../controllers/notes";

const router = express.Router();

router.get("/", NotesController.index);
router.get("/:noteId", NotesController.show);
router.post("/create", NotesController.create);

export default router;