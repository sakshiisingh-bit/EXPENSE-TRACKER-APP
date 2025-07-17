// middleware/errorHandler.js
// Handles errors in one place for the whole app

function errorHandler(err, req, res, next) {
  console.error(err.stack); // Log the error for debugging
  res.status(500).json({ message: 'Server error', error: err.message });
}

module.exports = errorHandler; 