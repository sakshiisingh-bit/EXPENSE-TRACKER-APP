// models/Transaction.js
// This is the schema for transactions (income/expense)

const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who made it
  amount: { type: Number, required: true }, // how much
  type: { type: String, enum: ['income', 'expense'], required: true }, // income or expense
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // category
  paymentMethod: { type: String }, // cash, card, etc.
  date: { type: Date, required: true }, // when
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }], // custom tags
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }, // who/where
  location: { type: String }, // where
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }, // for which project/goal
  isRecurring: { type: Boolean, default: false }, // is it recurring?
  notes: { type: String }, // any notes
  createdAt: { type: Date, default: Date.now }, // when added
});

module.exports = mongoose.model('Transaction', TransactionSchema); 