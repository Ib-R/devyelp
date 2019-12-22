const express = require('express');
const {
    getDevcompanies,
    getDevcompany,
    createDevcompany,
    updateDevcompany,
    deleteDevcompany
} = require('../controllers/devcompanies');

const router = express.Router();

router
    .route('/')
    .get(getDevcompanies)
    .post(createDevcompany);

router
    .route('/:id')
    .get(getDevcompany)
    .put(updateDevcompany)
    .delete(deleteDevcompany);

module.exports = router;