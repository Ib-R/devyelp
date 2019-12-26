const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console
    // console.log(err.stack.red);
    console.error(err);

    if (err.name === 'CastError') {
        if (err.kind === 'ObjectId') { // Mongoose bad objectId
            error = new ErrorResponse(`Resource with id ${err.value} not found`, 400);
        } else { // Mongoose other cast errors
            error = new ErrorResponse('Invalid input', 400);
        }
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        error = new ErrorResponse(`Field '${Object.keys(err.keyValue)[0]}' with value '${err.keyValue[Object.keys(err.keyValue)[0]]}' already exist`, 400);
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server error' });
};

module.exports = errorHandler;