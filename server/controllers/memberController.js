import Member from '../models/Member.js';
import Vehicle from '../models/Vehicle.js';
import Transaction from '../models/Transaction.js';
import Activity from '../models/Activity.js';
import Subscription from '../models/Subscription.js';

export const getMembers = async (req, res) => {
  const members = await Member.find();
  res.json(members);
};

export const getMember = async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) return res.status(404).json({ message: 'Member not found' });
  res.json(member);
};

export const createMember = async (req, res) => {
  const member = await Member.create(req.body);
  res.status(201).json(member);
};

export const updateMember = async (req, res) => {
  const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!member) return res.status(404).json({ message: 'Member not found' });
  res.json(member);
};

export const deleteMember = async (req, res) => {
  const member = await Member.findByIdAndDelete(req.params.id);
  if (!member) return res.status(404).json({ message: 'Member not found' });
  res.json({ message: 'Member deleted' });
};

export const getMemberVehicles = async (req, res) => {
  const vehicles = await Vehicle.find({ member_id: req.params.id });
  res.json(vehicles);
};

export const getMemberSubscriptions = async (req, res) => {
  const subscriptions = await Subscription.find({ member_id: req.params.id })
    .populate('plan_id', 'plan_name monthly_price')
    .populate('vehicle_id', 'license_plate make_model');
  res.json(subscriptions);
};

export const getMemberTransactions = async (req, res) => {
  const transactions = await Transaction.find({ member_id: req.params.id })
    .sort({ timestamp: -1 });
  res.json(transactions);
};

export const getMemberActivities = async (req, res) => {
  const activities = await Activity.find({ member_id: req.params.id })
    .sort({ timestamp: -1 });
  res.json(activities);
};
