import Vehicle from '../models/Vehicle.js';
import Activity from '../models/Activity.js';

export const getVehicles = async (req, res) => {
  const vehicles = await Vehicle.find().populate('member_id', 'first_name last_name email');
  res.json(vehicles);
};

export const getVehicle = async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id).populate('member_id', 'first_name last_name email');
  if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
  res.json(vehicle);
};

export const createVehicle = async (req, res) => {
  const vehicle = await Vehicle.create(req.body);
  res.status(201).json(vehicle);
};

export const updateVehicle = async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

  await Activity.create({
    member_id:    vehicle.member_id,
    action_taken: 'Edit Vehicle',
    notes:        `Updated vehicle ${vehicle.make_model ?? ''} (${vehicle.license_plate})`.trim(),
  });

  res.json(vehicle);
};

export const deleteVehicle = async (req, res) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
  if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

  await Activity.create({
    member_id:    vehicle.member_id,
    action_taken: 'Delete Vehicle',
    notes:        `Deleted vehicle ${vehicle.make_model ?? ''} (${vehicle.license_plate})`.trim(),
  });

  res.json({ message: 'Vehicle deleted' });
};
