import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    first_name:     { type: String, required: true },
    last_name:      { type: String, required: true },
    email:          { type: String, required: true, unique: true },
    phone:          { type: String },
    account_status: { type: String, default: 'Active' },
  },
  { timestamps: true }
);

export default mongoose.model('Member', memberSchema);
