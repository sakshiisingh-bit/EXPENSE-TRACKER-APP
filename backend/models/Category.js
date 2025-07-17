const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For user-specific categories
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Category', CategorySchema); 