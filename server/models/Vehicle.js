import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    member_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    license_plate: { type: String, required: true },
    state:         { type: String },
    make_model:    { type: String },
    rfid_tag_id:   { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Vehicle', vehicleSchema);
