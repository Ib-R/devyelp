const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const Company = require('../models/Company');

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