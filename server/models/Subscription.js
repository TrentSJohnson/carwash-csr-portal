import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    member_id:        { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    plan_id:          { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    vehicle_id:       { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    start_date:       { type: Date, required: true },
    next_billing_date:{ type: Date },
    status:           {
      type: String,
      enum: ['Active', 'Paused', 'Overdue', 'Canceled'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Subscription', subscriptionSchema);
