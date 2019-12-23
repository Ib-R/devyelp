const Company = require('../models/Company');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all companies
// @route   GET /api/v1/companies
// @access  Public
exports.getCompanies = asyncHandler(async (req, res, next) => {
    const companies = await Company.find();
    res.json({ success: true, count: companies.length, data: companies });
});

// @desc    Create new companies
// @route   POST /api/v1/companies
// @access  Private
exports.createCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, data: company });
});

// @desc    Get single companies
// @route   GET /api/v1/companies/:id
// @access  Public
exports.getCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.findById(req.params.id);
    if (!company) {
        return next(new ErrorResponse(`ID not found ${req.params.id}`, 404));
    }
    res.json({ success: true, data: company });
});

// @desc    Update new companies
// @route   PUT /api/v1/companies/:id
// @access  Private
exports.updateCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!company) {
        return next(new ErrorResponse(`ID not found ${req.params.id}`, 404));
    }
    res.json({ success: true, data: company });
});

// @desc    Delete new companies
// @route   DELETE /api/v1/companies/:id
// @access  Private
exports.deleteCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
        return next(new ErrorResponse(`ID not found ${req.params.id}`, 404));
    }
    res.json({ success: true, data: `Company deleted ` });
});