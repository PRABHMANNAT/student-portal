import mongoose from 'mongoose';

const { Schema } = mongoose;

const RoadmapSchema = new Schema({
  userId: { type: String, required: true },
  title: String,
  query: String,
  data: { type: Object, required: true },
  source: { type: String, enum: ['openai', 'demo'] },
  savedAt: { type: Date, default: Date.now },
  tags: [String]
});

export default mongoose.models.Roadmap || mongoose.model('Roadmap', RoadmapSchema);
