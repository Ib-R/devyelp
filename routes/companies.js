const express = require('express');
const {
    getCompanies,
    getCompany,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompaniesInRadius,
    companyFileUpload
} = require('../controllers/companies');

const Company = require('../models/Company');
const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

const jobRouter = require('./jobs');

const router = express.Router();

// Re-route relations routes
router.use('/:companyId/jobs', jobRouter);

router.route('/:id/file').put(protect, companyFileUpload);

router
    .route('/radius/:coords/:distance')
    .get(getCompaniesInRadius);

router
    .route('/')
    .get(advancedResults(Company, 'jobs'), getCompanies)
    .post(protect, createCompany);

router
    .route('/:id')
    .get(getCompany)
    .put(protect, updateCompany)
    .delete(protect, deleteCompany);

module.exports = router;