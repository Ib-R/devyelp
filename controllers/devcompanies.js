// @desc    Get all devcompanies
// @route   GET /api/v1/devcompanies
// @access  Public
exports.getDevcompanies = (req, res, next) => {
    res.json({ success: true, data: 'Show all dev companies' });
}

// @desc    Get single devcompanies
// @route   GET /api/v1/devcompanies/:id
// @access  Public
exports.getDevcompany = (req, res, next) => {
    res.json({ success: true, data: `Show dev company ${req.params.id}` });
}

// @desc    Create new devcompanies
// @route   POST /api/v1/devcompanies
// @access  Private
exports.createDevcompany = (req, res, next) => {
    res.json({ success: true, data: 'Create dev company' });
}

// @desc    Update new devcompanies
// @route   PUT /api/v1/devcompanies/:id
// @access  Private
exports.updateDevcompany = (req, res, next) => {
    res.json({ success: true, data: `Update dev company ${req.params.id}` });
}

// @desc    Delete new devcompanies
// @route   DELETE /api/v1/devcompanies/:id
// @access  Private
exports.deleteDevcompany = (req, res, next) => {
    res.json({ success: true, data: `Delete dev company ${req.params.id}` });
}