import { NoteController } from "../services/notes/note.controller.js";
import express from "express";

const router = express.Router();
const controller = new NoteController();

// Serve static files (optional)
router.use("/attachments", express.static("uploads"));

/**
 * @swagger
 * /api/notes:
 *   post:
 *     tags:
 *      - Note
 *     description: Creates a new note
 *     consumes:
 *         - multipart/form-data
 *     parameters:
 *         - name: attachments
 *           in: formData
 *           description: The file(s) to upload (PDF)
 *           required: true
 *           type: array
 *           items:
 *              type: file
 *         - name: title
 *           in: formData
 *           required: true
 *           type: string
 *         - name: content
 *           in: formData
 *           required: true
 *           type: string
 *     responses:
 *       '200':
 *         description: Returns success
 */
router.post("/", controller.addNote);

/**
 * @swagger
 * /api/notes:
 *   get:
 *     tags:
 *      - Note
 *     description: Get list of notes for current user
 *     parameters:
 *         - in: query
 *           name: search
 *           schema:
 *              type: string
 *     responses:
 *       '200':
 *         description: Returns a list of notes
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     tags:
 *      - Note
 *     description: Update Note by id
 *     consumes:
 *         - multipart/form-data
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: number
 *           required: true
 *           description: id of the note to update
 *         - name: attachments
 *           in: formData
 *           description: The file(s) to upload (PDF)
 *           required: true
 *           type: array
 *           items:
 *              type: file
 *         - name: title
 *           in: formData
 *           required: true
 *           type: string
 *         - name: content
 *           in: formData
 *           required: true
 *           type: string
 *         - name: version
 *           in: formData
 *           required: true
 *           type: number
 *     responses:
 *       '200':
 *         description: Returns updated note
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     tags:
 *      - Note
 *     description: Get Note by id
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: number
 *           required: true
 *           description: id of the note to get
 *     responses:
 *       '200':
 *         description: Returns updated note
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /api/notes/{id}/revert-to-previous-version/{version}:
 *   put:
 *     tags:
 *      - Note
 *     description: Revert note to previous version
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: number
 *           required: true
 *           description: id of the note to update
 *         - in: path
 *           name: version
 *           schema:
 *              type: number
 *           required: true
 *           description: version of the note to revert
 *     responses:
 *       '200':
 *         description: Returns updated note
 */
router.put(
  "/:id/revert-to-previous-version/:version",
  controller.revertToPreviousVersion
);

/**
 * @swagger
 * /api/notes/{id}/share:
 *   post:
 *     tags:
 *      - Note
 *     description: Share a note with another user
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: number
 *           required: true
 *           description: id of the note to update
 *         - in: body
 *           name: body
 *           schema:
 *              type: object
 *              properties:
 *                  sharedWithUserId:
 *                      type: number
 *                      required: true
 *                  permission:
 *                      type: string
 *                      validation: READ_ONLY|EDIT
 *                      required: true
 *     responses:
 *       '200':
 *         description: Returns success
 */
router.post("/:id/share", controller.shareWithAnotherUser);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     tags:
 *      - Note
 *     description: Delete a note by id
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: string
 *           required: true
 *           description: id of the note to update
 *     responses:
 *       '200':
 *         description: Returns success
 */
router.delete("/:id", controller.delete);

export default router;
