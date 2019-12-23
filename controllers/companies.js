const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const Company = require('../models/Company');

// @desc    Get all companies
// @route   GET /api/v1/companies
// @access  Public
exports.getCompanies = asyncHandler(async (req, res, next) => {
    const reqQuery = { ...req.query };

    // Queries to Exclude
    const removeQueries = ['select', 'sort', 'page', 'limit'];
    removeQueries.forEach(param => delete reqQuery[param]);

    // Filtering
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = Company.find(JSON.parse(queryStr));

    // Select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        query = query.sort(req.query.sort);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Company.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const companies = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) { // if not the last page
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) { // if not first page
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.json({ success: true, count: companies.length, pagination, data: companies });
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

// @desc    GET companies within radius
// @route   GET /api/v1/companies/radius/:coords/:distance
// @access  Private
exports.getCompaniesInRadius = asyncHandler(async (req, res, next) => {
    const { coords, distance } = req.params;
    const coordsArr = coords.split(',');
    const lat = coordsArr[0];
    const lng = coordsArr[1];

    // Calc radius using radians
    // By dividing dist by radius of Earth
    // Earth radius = 3,963 mi or 6,378 km
    const radius = distance / 6378;

    const companies = await Company.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.json({ success: true, count: companies.length, data: companies });
});

// @desc    GET companies within radius with Zipcode
// @route   GET /api/v1/companies/radius/:zipcode/:distance
// @access  Private
// exports.getCompaniesInRadius = asyncHandler(async (req, res, next) => {
//     const { zipcode, distance } = req.params;

//     // Get lat/lng from geocode
//     const loc = await geocoder.geocode(zipcode);
//     const lat = 29.908118;
//     const lng = 31.287130;

//     // Calc radius using radians
//     // By dividing dist by radius of Earth
//     // Earth radius = 3,963 mi or 6,378 km
//     const radius = distance / 6378;

//     const companies = await Company.find({
//         location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
//     });

//     res.json({ success: true, count: companies.length, data: companies });
// });