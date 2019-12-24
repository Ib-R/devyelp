const express = require('express');
const {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
} = require('../controllers/jobs');

const Job = require('../models/Job');
const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(advancedResults(Job, { path: 'company', select: 'name desc' }), getJobs)
    .post(protect, createJob);

router
    .route('/:id')
    .get(getJob)
    .put(protect, updateJob)
    .delete(protect, deleteJob);

module.exports = router;