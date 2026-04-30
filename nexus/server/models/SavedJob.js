import mongoose from 'mongoose';

const { Schema } = mongoose;

const SavedJobSchema = new Schema({
  userId: String,
  job: Object,
  savedAt: { type: Date, default: Date.now }
});

export default mongoose.models.SavedJob || mongoose.model('SavedJob', SavedJobSchema);
