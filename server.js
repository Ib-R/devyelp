const path = require('path');
const env = require('dotenv');
const logger = require('morgan');
const express = require('express');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');

require('colors');

// Load env variables
env.config({ path: '.env' });

// Connect to DB
connectDB();

// Route files
const compaines = require('./routes/companies');
const jobs = require('./routes/jobs');

const app = express();

// Body parser
app.use(express.json());

// Mount logger for development
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
}

// File-upload middleware
app.use(fileupload());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers
app.use('/api/v1/companies', compaines);
app.use('/api/v1/jobs', jobs);

// Mount error handler
app.use(errorHandler);

let port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server and exit process
    server.close(() => process.exit(1));
});