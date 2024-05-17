const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getCurrentUserInfo,
} = require('../controllers/authController');
const validateToken = require('../middleware/validateTokenHandler');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/current-user', validateToken, getCurrentUserInfo);

module.exports = router;