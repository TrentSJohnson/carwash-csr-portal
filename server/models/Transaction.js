import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    member_id:       { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    subscription_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
    timestamp:       { type: Date, default: Date.now },
    amount:          { type: Number, required: true },
    status:          { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
