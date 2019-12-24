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
const advancedResults = require('../middleware/advancedResults');

const jobRouter = require('./jobs');

const router = express.Router();

// Re-route relations routes
router.use('/:companyId/jobs', jobRouter);

router.route('/:id/file').put(companyFileUpload);

router
    .route('/radius/:coords/:distance')
    .get(getCompaniesInRadius);

router
    .route('/')
    .get(advancedResults(Company, 'jobs'), getCompanies)
    .post(createCompany);

router
    .route('/:id')
    .get(getCompany)
    .put(updateCompany)
    .delete(deleteCompany);

module.exports = router;