const express = require('express');
const {
    getCompanies,
    getCompany,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompaniesInRadius
} = require('../controllers/companies');

const router = express.Router();

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