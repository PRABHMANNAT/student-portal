import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: 'guest'
    },
    type: {
      type: String,
      enum: ['roadmap', 'jobs', 'notes'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    summary: String,
    tags: [String],
    payload: mongoose.Schema.Types.Mixed
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Collection || mongoose.model('Collection', collectionSchema);

