import mongoose from 'mongoose';

const { Schema } = mongoose;

const NoteSchema = new Schema({
  userId: { type: String, required: true },
  title: String,
  query: String,
  content: String,
  comments: [
    {
      id: String,
      highlightedText: String,
      commentText: String,
      author: String,
      position: Number,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  source: String,
  savedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
