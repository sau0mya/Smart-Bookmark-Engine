const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

const serverless = require("serverless-http");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const bookmarks = require('./routes/bookmarks');
const analytics = require('./routes/analytics');
const activity = require('./routes/activity');
const collections = require('./routes/collections');

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/bookmarks', bookmarks);
app.use('/api/analytics', analytics);
app.use('/api/activity', activity);
app.use('/api/collections', collections);

// Custom error handler middleware
app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// const server = app.listen(
//     PORT,
//     console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
// );

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

module.exports = serverless(app);
