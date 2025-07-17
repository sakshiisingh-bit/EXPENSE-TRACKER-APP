// routes/transactions.js
// Handles all transaction-related API endpoints

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth');
const transactionController = require('../controllers/transactionController');

// Create a transaction (POST /transactions)
router.post('/', authMiddleware, transactionController.createTransaction);

// Get all transactions for the logged-in user (GET /transactions)
router.get('/', authMiddleware, transactionController.getTransactions);

// Get a single transaction by ID (GET /transactions/:id)
router.get('/:id', authMiddleware, transactionController.getTransactionById);

// Update a transaction (PUT /transactions/:id)
router.put('/:id', authMiddleware, transactionController.updateTransaction);

// Delete a transaction (DELETE /transactions/:id)
router.delete('/:id', authMiddleware, transactionController.deleteTransaction);

module.exports = router; 