const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Job = require('../models/Job');
const Company = require('../models/Company');

// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @route   GET /api/v1/companies/:companyID/jobs
// @access  Public
exports.getJobs = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.companyId) { // Get jobs for specific company
        query = Job.find({ company: req.params.companyId });
    } else { // get all jobs
        query = Job.find().populate('company', 'name desc');
    }

    const jobs = await query;

    res.json({ success: true, count: jobs.length, data: jobs });
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
    // Check company exists
    const company = await Company.findById(req.body.company);
    if (!company) {
        return next(new ErrorResponse(`No company with id of ${req.body.company} found`, 404));
    }

    const job = await Job.create(req.body);

    res.json({ success: true, data: job });
});

// @desc    Update job
// @route   PUT /api/v1/jobs/:id
// @access  Private
exports.updateJob = asyncHandler(async (req, res, next) => {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!job) {
        return next(new ErrorResponse(`No job with id of ${req.params.id} found`, 404));
    }

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
    job.remove();
    res.json({ success: true, data: 'Job deleted' });
});