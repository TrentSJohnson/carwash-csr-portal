import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    plan_name:     { type: String, required: true, unique: true },
    monthly_price: { type: Number, required: true },
    features:      { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Plan', planSchema);
