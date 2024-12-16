import { literal, Op } from "sequelize";
import { Models } from "../../database/models/index.js";
import { SequelizeConnection } from "../../database/connection.js";
import { NOTE_PERMISSION } from "../../utils/constants.js";

export class NoteRepository {
  constructor() {
    if (NoteRepository.instance) return NoteRepository.instance;

    this.Note = new Models().Note;
    this.connection = new SequelizeConnection().connection;
    this.NoteVersion = new Models().NoteVersion;
    this.Attachment = new Models().Attachment;
    this.NoteAccess = new Models().NoteAccess;
    NoteRepository.instance = this;
  }

  addNote = async (userId, newNote, savedAttachmentsPath) => {
    let note = null;

    // use transaction to ensure atomicity
    await this.connection.transaction(async (transaction) => {
      note = await this.Note.create(newNote, { transaction });

      await this.NoteAccess.create(
        {
          noteId: note.id,
          userId: userId,
          permission: NOTE_PERMISSION.OWNER,
        },
        { transaction }
      );
      console.log("AddNote:", note);
      // save attachments
      if (savedAttachmentsPath?.length > 0) {
        const attachments = savedAttachmentsPath.map((attachmentPath) => {
          return {
            noteId: note.id,
            filePath: attachmentPath,
          };
        });
        await this.Attachment.bulkCreate(attachments, { transaction });
      }
    });

    return note;
  };

  getAll = async (userId, search) => {
    console.log({ userId, search });
    const notes = await this.Note.findAll(
      search?.toString().trim().length > 0
        ? {
            include: [
              {
                model: this.NoteAccess,
                where: { userId },
                attributes: [], // We don't need any columns from the Share table
              },
            ],
            attributes: {
              include: [
                [
                  literal(
                    `MATCH (title, content) AGAINST ('${search}' IN BOOLEAN MODE)`
                  ),
                  "score",
                ],
              ],
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
            where: literal(
              `MATCH (title, content) AGAINST ('${search}' IN BOOLEAN MODE)`
            ),

            order: [[literal("score"), "DESC"]], // Order by relevance score
          }
        : {
            include: [
              {
                model: this.NoteAccess,
                where: { userId },
                attributes: [], // We don't need any columns from the Share table
              },
            ],
            attributes: this.Note.publicFields,
          }
    );
    return notes;
  };

  update = async (id, userId, updatedNote, savedAttachmentsPath) => {
    const { title, content, version } = updatedNote;
    const note = await this.Note.findOne({
      include: [
        {
          model: this.NoteAccess,
          where: {
            [Op.or]: [
              { userId, permission: NOTE_PERMISSION.OWNER }, // Match by note ID
              { userId, permission: NOTE_PERMISSION.EDIT }, // Match by note ID
            ],
          },
          attributes: [], // We don't need any columns from the Share table
        },
      ],
      where: { id },
    });
    if (!note) throw new Error("Note not found");

    // Optimistic Locking Check
    if (note.version != version) {
      throw new Error("Version conflict. Please reload the note.");
    }

    // use transaction to ensure atomicity
    await this.connection.transaction(async (transaction) => {
      await this.Note.update(
        {
          title,
          content,
          version: version + 1,
        },
        {
          where: { id, version },
          transaction,
        }
      );

      await this.NoteVersion.create(
        {
          noteId: id,
          title: note.title,
          content: note.content,
          version: version,
        },
        { transaction }
      );
      updatedNote.version = version + 1;

      // save attachments
      if (savedAttachmentsPath?.length > 0) {
        const attachments = savedAttachmentsPath.map((attachmentPath) => {
          return {
            noteId: note.id,
            filePath: attachmentPath,
          };
        });
        await this.Attachment.bulkCreate(attachments, { transaction });
      }
    });

    return { id: +id, ...updatedNote };
  };

  revertToPreviousVersion = async (id, userId, version) => {
    const note = await this.Note.findOne({
      include: [
        {
          model: this.NoteAccess,
          where: {
            [Op.or]: [
              { userId, permission: NOTE_PERMISSION.OWNER }, // Match by note ID
              { userId, permission: NOTE_PERMISSION.EDIT }, // Match by note ID
            ],
          },
          attributes: [], // We don't need any columns from the Share table
        },
      ],
      where: { id },
    });
    if (!note) throw new Error("Note not found");

    const noteVersion = await this.NoteVersion.findOne({
      where: { noteId: id, version },
    });

    if (!noteVersion) throw new Error("Note version is not valid");

    return await this.update(id, userId, {
      title: noteVersion.title,
      content: noteVersion.content,
      version: note.version,
    });
  };

  shareWithAnotherUser = async (noteId, ownerId, userId, permission) => {
    const note = await this.Note.findOne({
      include: [
        {
          model: this.NoteAccess,
          where: {
            [Op.or]: [
              { userId: ownerId, permission: NOTE_PERMISSION.OWNER }, // Match by note ID
              { userId: ownerId, permission: NOTE_PERMISSION.EDIT }, // Match by note ID
            ],
          },
          attributes: [], // We don't need any columns from the Share table
        },
      ],
      where: { id: noteId },
    });
    if (!note) throw new Error("Note not found");

    const share = await this.NoteAccess.create({
      noteId,
      userId,
      permission,
    });

    return share;
  };

  getById = async (id, userId) => {
    console.log({ id, userId });
    const note = await this.Note.findOne({
      include: [
        {
          model: this.NoteAccess,
          where: { userId },
          attributes: [], // We don't need any columns from the Share table
        },
      ],
      where: { id },
      include: [
        {
          model: this.NoteVersion,
          attributes: ["id", "title", "content", "version"],
        },
        {
          model: this.Attachment,
          attributes: ["id", "filePath"],
        },
      ],
      attributes: this.Note.publicFields,
    });

    if (!note) throw new Error("Note not found");
    return note;
  };

  delete = async (id, userId) => {
    const note = await this.Note.findOne({
      include: [
        {
          model: this.NoteAccess,
          where: {
            userId,
            permission: NOTE_PERMISSION.OWNER,
          },
          attributes: [], // We don't need any columns from the Share table
        },
      ],
      where: { id },
    });
    if (!note) throw new Error("Note not found");

    await note.destroy(); // will soft delete

    return true;
  };
}
