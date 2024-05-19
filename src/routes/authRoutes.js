const express = require('express');
const router = express.Router();
const { checkSchema } = require('express-validator');
const {
    registerUser,
    loginUser,
    getCurrentUserInfo,
} = require('../controllers/authController');
const validateToken = require('../middleware/validateTokenHandler');
const registerUserValidationSchema = require('../schemas/userSchema');

router.post('/register', checkSchema(registerUserValidationSchema), registerUser);
router.post('/login', loginUser);
router.get('/current-user', validateToken, getCurrentUserInfo);

module.exports = router;