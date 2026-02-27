import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  summary: { type: String, required: true },
  completedCount: { type: Number, default: 0 },
  briefSummary: { type: String, default: '' },
  tasksSnapshot: [{
    title: { type: String, required: true },
    description: { type: String, default: '' },
    priority: { type: String, enum: ['low', 'medium', 'high'], required: true }
  }],
  tasksCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Summary', summarySchema);
