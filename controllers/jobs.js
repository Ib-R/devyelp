const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Job = require('../models/Job');
const Company = require('../models/Company');

// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @route   GET /api/v1/companies/:companyID/jobs
// @access  Public
exports.getJobs = asyncHandler(async (req, res, next) => {
    if (req.params.companyId) { // Get jobs for specific company
        const data = await Job.find({ company: req.params.companyId });
        return res.json({ success: true, count: data.length, data });
    } else { // get all jobs
        res.json(res.advancedResults);
    }
});

// @desc    Get single jobs
// @route   GET /api/v1/jobs/:id
// @access  Public
exports.getJob = asyncHandler(async (req, res, next) => {
    const job = await Job.findById(req.params.id).populate('company', 'name desc');

    if (!job) {
        return next(new ErrorResponse(`No job with id of ${req.params.id} found`, 404));
    }

    res.json({ success: true, data: job });
});

// @desc    Create single job
// @route   POST /api/v1/jobs
// @access  Private
exports.createJob = asyncHandler(async (req, res, next) => {
    // Link user
    req.body.user = req.user.id;

    // Check company exists
    const company = await Company.findById(req.body.company);

    if (!company) {
        return next(new ErrorResponse(`No company with id of ${req.body.company} found`, 404));
    }

    // Company ownership check
    if (company.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User is not authorized to add job to this company`, 403));
    }

    const job = await Job.create(req.body);

    res.status(201).json({ success: true, data: job });
});

// @desc    Update job
// @route   PUT /api/v1/jobs/:id
// @access  Private
exports.updateJob = asyncHandler(async (req, res, next) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        return next(new ErrorResponse(`No job with id of ${req.params.id} found`, 404));
    }

    // Ownership check
    if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User is not authorized to update this job`, 403));
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.json({ success: true, data: job });
});

// @desc    Delete job
// @route   DELETE /api/v1/jobs/:id
// @access  Private
exports.deleteJob = asyncHandler(async (req, res, next) => {
    const job = await Job.findById(req.params.id);
    if (!job) {
        return next(new ErrorResponse(`ID not found ${req.params.id}`, 404));
    }
    // Ownership check
    if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User is not authorized to delete this job`, 403));
    }
    job.remove();
    res.json({ success: true, data: 'Job deleted' });
});