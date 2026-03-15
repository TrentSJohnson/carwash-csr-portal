import Transaction from '../models/Transaction.js';

export const getTransactions = async (req, res) => {
  const transactions = await Transaction.find()
    .populate('member_id', 'first_name last_name email')
    .populate('subscription_id', 'status start_date');
  res.json(transactions);
};

export const getTransaction = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('member_id', 'first_name last_name email')
    .populate('subscription_id', 'status start_date');
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
  res.json(transaction);
};

export const createTransaction = async (req, res) => {
  const transaction = await Transaction.create(req.body);
  res.status(201).json(transaction);
};

export const updateTransaction = async (req, res) => {
  const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
  res.json(transaction);
};

export const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findByIdAndDelete(req.params.id);
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
  res.json({ message: 'Transaction deleted' });
};
