import Member from '../models/Member.js';

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
    new: true,
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
