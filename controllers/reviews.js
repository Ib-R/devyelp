const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Review = require('../models/Review');
const Company = require('../models/Company');

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/companies/:companyID/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.companyId) { // Get reviews for specific company
        const data = await Review.find({ company: req.params.companyId });
        return res.json({ success: true, count: data.length, data });
    } else { // get all reviews
        res.json(res.advancedResults);
    }
});

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate('company', 'name desc');

    if (!review) {
        return next(new ErrorResponse(`No review with id of ${req.params.id} found`, 404));
    }

    res.json({ success: true, data: review });
});

// @desc    Create review
// @route   POST /api/v1/reviews/:id
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
    // Link user
    req.body.user = req.user.id;

    // Check company exists
    const company = await Company.findById(req.body.company);

    if (!company) {
        return next(new ErrorResponse(`No company with id of ${req.body.company} found`, 404));
    }

    const review = await Review.create(req.body);

    res.status(201).json({ success: true, data: review });
});

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`No review with id of ${req.params.id} found`, 404));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User is not authorized to update this review`, 403));
    }

    // Check company exists
    const company = await Company.findById(review.company);

    if (!company) {
        return next(new ErrorResponse(`No company with id of ${review.company} found`, 404));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(201).json({ success: true, data: review });
});

// @desc    Delete review
// @route   Delete /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`No review with id of ${req.params.id} found`, 404));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User is not authorized to update this review`, 403));
    }

    await review.remove();

    res.status(201).json({ success: true, data: 'Review deleted' });
});