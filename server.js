const path = require('path');
const env = require('dotenv');
const logger = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const express = require('express');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');
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
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Mount logger for development
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
}

// File-upload middleware
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Set security headers
app.use(helmet());

// Rate limiter
app.use(rateLimit({
    windowMs: 1 * 60 * 1000, // 1min
    max: 10
}));

// Prevent HTTP param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers
app.use('/api/v1/companies', compaines);
app.use('/api/v1/jobs', jobs);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);
app.get('/api/v1/mapquest', (req, res, next) => {
    res.json(process.env.GEOCODER_KEY);
});

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