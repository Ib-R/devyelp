const express = require('express');
const { register, login, getCurrent } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current', protect, getCurrent);

module.exports = router;