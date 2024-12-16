import User from "./user.model";
import Attachment from "./attachment.model";
import Note from "./note.model";
import NoteAccess from "./noteAccess.model";
import NoteVersion from "./noteVersioning.model";

export class Models {
  constructor() {
    if (Models.instance) return Models.instance;

    this.User = User;
    this.Attachment = Attachment;
    this.Note = Note;
    this.NoteVersion = NoteVersion;
    this.NoteAccess = NoteAccess;

    Object.keys(this).forEach((model) => {
      this[model].associate(this);
    });
  }
}
