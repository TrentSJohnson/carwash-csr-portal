import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    member_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    csr_id:       { type: String },
    timestamp:    { type: Date, default: Date.now },
    action_taken: { type: String, enum: ['Transfer', 'Edit Info', 'Cancel Sub'], required: true },
    notes:        { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Activity', activitySchema);
