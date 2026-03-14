import Subscription from '../models/Subscription.js';

export const getSubscriptions = async (req, res) => {
  const subscriptions = await Subscription.find()
    .populate('member_id', 'first_name last_name email')
    .populate('plan_id', 'plan_name monthly_price')
    .populate('vehicle_id', 'license_plate state make_model');
  res.json(subscriptions);
};

export const getSubscription = async (req, res) => {
  const subscription = await Subscription.findById(req.params.id)
    .populate('member_id', 'first_name last_name email')
    .populate('plan_id', 'plan_name monthly_price')
    .populate('vehicle_id', 'license_plate state make_model');
  if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
  res.json(subscription);
};

export const createSubscription = async (req, res) => {
  const subscription = await Subscription.create(req.body);
  res.status(201).json(subscription);
};

export const updateSubscription = async (req, res) => {
  const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
  res.json(subscription);
};

export const deleteSubscription = async (req, res) => {
  const subscription = await Subscription.findByIdAndDelete(req.params.id);
  if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
  res.json({ message: 'Subscription deleted' });
};
