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
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

const jobRouter = require('./jobs');
const reviewRouter = require('./reviews');

const router = express.Router();

// Re-route relations routes
router.use('/:companyId/jobs', jobRouter);
router.use('/:companyId/reviews', reviewRouter);

router.route('/:id/file').put(protect, authorize('admin', 'publisher'), companyFileUpload);

router
    .route('/radius/:coords/:distance')
    .get(getCompaniesInRadius);

router
    .route('/')
    .get(advancedResults(Company, 'jobs'), getCompanies)
    .post(protect, authorize('admin', 'publisher'), createCompany);

router
    .route('/:id')
    .get(getCompany)
    .put(protect, authorize('admin', 'publisher'), updateCompany)
    .delete(protect, authorize('admin', 'publisher'), deleteCompany);

module.exports = router;