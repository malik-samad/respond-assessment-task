import RedisClient from "../redisClient/redisClient.service.js";
import { NoteRepository } from "./notes.repository.js";

export class NoteService {
  redisClient;
  constructor() {
    if (NoteService.instance) return NoteService.instance;

    this.redisClient = new RedisClient();
    this.noteRepository = new NoteRepository();
    NoteService.instance = this;
  }

  addNote = async (newNote, savedAttachmentsPath) => {
    const { userId, title, content } = newNote;
    const note = await this.noteRepository.addNote(
      userId,
      { title, content },
      savedAttachmentsPath
    );

    return note;
  };

  getAll = async (userId, search) => {
    // Fetch from DB
    const notes = await this.noteRepository.getAll(userId, search);

    return notes;
  };

  update = async (id, userId, updatedNote, savedAttachmentsPath) => {
    const note = await this.noteRepository.update(
      id,
      userId,
      updatedNote,
      savedAttachmentsPath
    );

    // Cache invalidation
    await this.redisClient.client.del(`note:${id}`);

    return note;
  };

  shareWithAnotherUser = async (noteId, ownerId, userId, permission) => {
    const note = await this.noteRepository.shareWithAnotherUser(
      noteId,
      ownerId,
      userId,
      permission
    );

    return note;
  };

  revertToPreviousVersion = async (id, userId, versionId) => {
    const note = await this.noteRepository.revertToPreviousVersion(
      id,
      userId,
      versionId
    );

    // Cache invalidation
    await this.redisClient.resetForUser(id, userId);

    return note;
  };

  getById = async (id, userId) => {
    // Check Redis Cache
    const cacheKey = `note:${id}`;
    const cachedNote = await this.redisClient.client.get(cacheKey);
    if (cachedNote) return JSON.parse(cachedNote);

    const note = await this.noteRepository.getById(id, userId);

    // set Cache
    await this.redisClient.client.set(cacheKey, JSON.stringify(note));

    return note;
  };
  delete = async (id, userId) => {
    const note = await this.noteRepository.delete(id, userId);

    // Cache invalidation
    await this.redisClient.client.del(`note:${userId}`);
    return true;
  };
}
