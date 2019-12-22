const express = require('express');
const env = require('dotenv');
const logger = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

// Load env variables
env.config({ path: '.env' });

// Connect to DB
connectDB();

// Route files
const compaines = require('./routes/companies');


const app = express();

// Mount middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
}

//Mount routers
app.use('/api/v1/companies', compaines);

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