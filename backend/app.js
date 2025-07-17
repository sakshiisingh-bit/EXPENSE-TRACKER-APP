var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRouter = require('./routes/auth').router;
const transactionsRouter = require('./routes/transactions');
const categoriesRouter = require('./routes/categories');
const tagsRouter = require('./routes/tags');
const projectsRouter = require('./routes/projects');
const vendorsRouter = require('./routes/vendors');
const budgetsRouter = require('./routes/budgets');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// MongoDB connection
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not set in environment variables');
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/transactions', transactionsRouter);
app.use('/categories', categoriesRouter);
app.use('/tags', tagsRouter);
app.use('/projects', projectsRouter);
app.use('/vendors', vendorsRouter);
app.use('/budgets', budgetsRouter);
app.use(errorHandler);

module.exports = app;
