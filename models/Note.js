// models/Note.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true, // e.g., 'PDF'
    },
    date: {
      type: Date,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String, // URL to the note file, if stored externally
      required: false,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);


const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default Note;