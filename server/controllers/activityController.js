import Activity from '../models/Activity.js';

export const getActivities = async (req, res) => {
  const activities = await Activity.find()
    .populate('member_id', 'first_name last_name email')
    .sort({ timestamp: -1 });
  res.json(activities);
};

export const getActivity = async (req, res) => {
  const activity = await Activity.findById(req.params.id)
    .populate('member_id', 'first_name last_name email');
  if (!activity) return res.status(404).json({ message: 'Activity not found' });
  res.json(activity);
};

export const createActivity = async (req, res) => {
  const activity = await Activity.create(req.body);
  res.status(201).json(activity);
};

export const updateActivity = async (req, res) => {
  const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!activity) return res.status(404).json({ message: 'Activity not found' });
  res.json(activity);
};

export const deleteActivity = async (req, res) => {
  const activity = await Activity.findByIdAndDelete(req.params.id);
  if (!activity) return res.status(404).json({ message: 'Activity not found' });
  res.json({ message: 'Activity deleted' });
};
