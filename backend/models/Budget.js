const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  amount: { type: Number, required: true },
  timeInterval: { type: String, enum: ['monthly', 'quarterly', 'yearly'], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Budget', BudgetSchema); 