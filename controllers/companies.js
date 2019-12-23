const Company = require('../models/Company');

// @desc    Get all companies
// @route   GET /api/v1/companies
// @access  Public
exports.getCompanies = async (req, res, next) => {
    try {
        const companies = await Company.find();
        res.json({ success: true, count: companies.length, data: companies });
    } catch (error) {
        res.status(400).json({ success: false, data: error.errmsg });
    }
};

// @desc    Create new companies
// @route   POST /api/v1/companies
// @access  Private
exports.createCompany = async (req, res, next) => {
    try {
        const company = await Company.create(req.body);
        res.status(201).json({ success: true, data: company });
    } catch (error) {
        res.status(400).json({ success: false, data: error.errmsg });
    }
};

// @desc    Get single companies
// @route   GET /api/v1/companies/:id
// @access  Public
exports.getCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ success: false, data: 'Wrong ID' });
        }
        res.json({ success: true, data: company });
    } catch (error) {
        next(error);
        // res.status(400).json({ success: false, data: error.errmsg });
    }
};

// @desc    Update new companies
// @route   PUT /api/v1/companies/:id
// @access  Private
exports.updateCompany = async (req, res, next) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!company) {
            return res.status(404).json({ success: false, data: 'Wrong ID' });
        }
        res.json({ success: true, data: company });
    } catch (error) {
        res.status(400).json({ success: false, data: error.message });
    }
};

// @desc    Delete new companies
// @route   DELETE /api/v1/companies/:id
// @access  Private
exports.deleteCompany = async (req, res, next) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) {
            return res.status(404).json({ success: false, data: 'ID not found' });
        }
        res.json({ success: true, data: `Company deleted ` });
    } catch (error) {
        res.status(400).json({ success: false, data: error.errmsg });
    }
};