import Plan from '../models/Plan.js';

export const getPlans = async (req, res) => {
  const plans = await Plan.find();
  res.json(plans);
};

export const getPlan = async (req, res) => {
  const plan = await Plan.findById(req.params.id);
  if (!plan) return res.status(404).json({ message: 'Plan not found' });
  res.json(plan);
};

export const createPlan = async (req, res) => {
  const plan = await Plan.create(req.body);
  res.status(201).json(plan);
};

export const updatePlan = async (req, res) => {
  const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!plan) return res.status(404).json({ message: 'Plan not found' });
  res.json(plan);
};

export const deletePlan = async (req, res) => {
  const plan = await Plan.findByIdAndDelete(req.params.id);
  if (!plan) return res.status(404).json({ message: 'Plan not found' });
  res.json({ message: 'Plan deleted' });
};
