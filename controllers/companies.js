// @desc    Get all companies
// @route   GET /api/v1/companies
// @access  Public
exports.getCompanies = (req, res, next) => {
    res.json({ success: true, data: 'Show all dev companies' });
}

// @desc    Get single companies
// @route   GET /api/v1/companies/:id
// @access  Public
exports.getCompany = (req, res, next) => {
    res.json({ success: true, data: `Show dev company ${req.params.id}` });
}

// @desc    Create new companies
// @route   POST /api/v1/companies
// @access  Private
exports.createCompany = (req, res, next) => {
    res.json({ success: true, data: 'Create dev company' });
}

// @desc    Update new companies
// @route   PUT /api/v1/companies/:id
// @access  Private
exports.updateCompany = (req, res, next) => {
    res.json({ success: true, data: `Update dev company ${req.params.id}` });
}

// @desc    Delete new companies
// @route   DELETE /api/v1/companies/:id
// @access  Private
exports.deleteCompany = (req, res, next) => {
    res.json({ success: true, data: `Delete dev company ${req.params.id}` });
}