const express = require('express');
const {
    getCompanies,
    getCompany,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompaniesInRadius
} = require('../controllers/companies');
const jobRouter = require('./jobs');

const router = express.Router();

// Re-route relations routes
router.use('/:companyId/jobs', jobRouter);

router
    .route('/radius/:coords/:distance')
    .get(getCompaniesInRadius);

router
    .route('/')
    .get(getCompanies)
    .post(createCompany);

router
    .route('/:id')
    .get(getCompany)
    .put(updateCompany)
    .delete(deleteCompany);

module.exports = router;