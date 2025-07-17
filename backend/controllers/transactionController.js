// controllers/transactionController.js
// Handles the logic for transaction routes

const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res, next) => {
  try {
    const transaction = new Transaction({ ...req.body, user: req.user });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user })
      .populate('category tags vendor project');
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

exports.getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user })
      .populate('category tags vendor project');
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    next(err);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    next(err);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    next(err);
  }
}; 