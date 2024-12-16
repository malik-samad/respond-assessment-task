import ModelManager from "sequelize/lib/model-manager";
import path from "path";
import { NoteService } from "./notes.service.js";
import {
  generateUniqueFileName,
  isValidFileType,
  removeFile,
  UPLOAD_DIR,
} from "../../utils/helpers.js";
import { type } from "os";

export class NoteController {
  static instance = null;

  constructor() {
    if (NoteController.instance) return NoteController.instance;

    this.service = new NoteService();
    this.modelManager = new ModelManager();
    NoteController.instance = this;
  }

  processAttachments = async (savedAttachmentsPath, req) => {
    if (!Array.isArray(savedAttachmentsPath))
      throw new Error("savedAttachmentsPath must be an array");

    // handle attachments
    if (!req.is("multipart/form-data")) {
      return res.status(400).json({
        error: "Invalid Content-Type. Expected multipart/form-data.",
      });
    }

    const attachments = req.files.attachments;
    // If only one attachment file is uploaded (not in an array), convert it to an array
    const attachmentsArray = Array.isArray(attachments)
      ? attachments
      : [attachments];

    // Save each attachment file
    for (const attachment of attachmentsArray) {
      // Check if the attachment file type is valid (image/video)
      if (!isValidFileType(attachment)) {
        throw new Error(
          "Invalid attachment file type. Only images and videos are allowed."
        );
      }

      // Define the attachment file upload path
      const uploadPath = path.join(
        UPLOAD_DIR,
        generateUniqueFileName(attachment.name)
      );

      // Move the attachment file to the uploads folder
      await attachment.mv(uploadPath);
      savedAttachmentsPath.push(uploadPath); // Add the saved attachment to the response list
    }
  };

  addNote = async (req, res) => {
    // Array to store attachment file information that will be saved in the database
    const savedAttachmentsPath = [];

    try {
      await this.processAttachments(savedAttachmentsPath, req);

      // save to DB
      const { title, content } = req.body;
      console.log({ title, content, userId: req.userId });
      const note = await this.service.addNote(
        {
          title,
          content,
          userId: req.userId,
        },
        savedAttachmentsPath
      );
      res.status(201).json(note);
    } catch (err) {
      // Delete the uploaded attachments if the request fails
      savedAttachmentsPath.forEach((path) => removeFile(path));
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };

  getAll = async (req, res) => {
    try {
      const { search } = req.query; // TODO: use paginated - not specified in task requirements.
      const notes = await this.service.getAll(req.userId, search);

      res.json(notes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };

  update = async (req, res) => {
    // Array to store attachment file information that will be saved in the database
    const savedAttachmentsPath = [];

    try {
      await this.processAttachments(savedAttachmentsPath, req);

      const { id } = req.params;
      const { title, content, version } = req.body;
      const note = await this.service.update(
        id,
        req.userId,
        {
          title,
          content,
          version: parseInt(version),
        },
        savedAttachmentsPath
      );
      res.json(note);
    } catch (err) {
      // Delete the uploaded attachments if the request fails
      savedAttachmentsPath.forEach((path) => removeFile(path));
      console.error(err);
      let errorCode = 500;
      if (err.message == "Version conflict. Please reload the note.")
        errorCode = 409;
      if (err.message == "Note not found") errorCode = 404;

      res.status(errorCode).json({ error: err.message });
    }
  };

  revertToPreviousVersion = async (req, res) => {
    try {
      const { id, version } = req.params;
      const note = await this.service.revertToPreviousVersion(
        id,
        req.userId,
        version
      );
      res.json(note);
    } catch (err) {
      console.error(err);
      let errorCode = 500;
      if (err.message == "Version conflict. Please reload the note.")
        errorCode = 409;
      if (
        err.message == "Note not found" ||
        err.message == "Note version is not valid"
      )
        errorCode = 404;

      res.status(errorCode).json({ error: err.message });
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const note = await this.service.getById(id, req.userId);
      res.json(note);
    } catch (err) {
      console.error(err);
      let errorCode = 500;
      if (err.message == "Note not found") errorCode = 404;

      res.status(errorCode).json({ error: err.message });
    }
  };

  shareWithAnotherUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { sharedWithUserId, permission } = req.body;
      const note = await this.service.shareWithAnotherUser(
        id,
        req.userId,
        sharedWithUserId,
        permission
      );
      res.json(note);
    } catch (err) {
      console.error(err);
      let errorCode = 500;
      if (err.message == "Note not found") errorCode = 404;

      res.status(errorCode).json({ error: err.message });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await this.service.delete(id, req.userId);

      res.status(204).send();
    } catch (err) {
      console.error(err);
      let errorCode = 500;
      if (err.message == "Note not found") errorCode = 404;
      res.status(500).json({ error: err.message });
    }
  };
}
