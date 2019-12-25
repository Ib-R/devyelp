const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/v1/auth/users
// @access  Private:Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/v1/auth/users/:id
// @access  Private:Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.json({ success: true, data: user });
});

// @desc    Create user
// @route   POST /api/v1/auth/users
// @access  Private:Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
});

// @desc    Update user
// @route   PUT /api/v1/auth/users/:id
// @access  Private:Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.params.id);
    // Remove password from body
    const { password, ...body } = req.body;

    if (!user) {
        return next(new ErrorResponse(`ID ${req.params.id} not found`, 404));
    }

    user = await User.findByIdAndUpdate(req.params.id, body, {
        new: true,
        runValidators: true
    });

    res.json({ success: true, data: user });
});

// @desc    Delete user
// @route   DELETE /api/v1/auth/users/:id
// @access  Private:Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`ID ${req.params.id} not found`, 404));
    }
    await user.remove();
    res.json({ success: true, data: 'User deleted' });
});