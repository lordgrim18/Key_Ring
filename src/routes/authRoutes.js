const express = require('express');
const router = express.Router();
const { checkSchema } = require('express-validator');
const {
    registerUser,
    loginUser,
    getCurrentUserInfo,
} = require('../controllers/authController');
const validateToken = require('../middleware/validateTokenHandler');
const {
    registerUserValidationSchema,
    loginUserValidationSchema,
} = require('../schemas/userSchema');
const handleValidationErrors = require('../middleware/validateSchema');

router.post('/register', checkSchema(registerUserValidationSchema), handleValidationErrors, registerUser);
router.post('/login', checkSchema(loginUserValidationSchema), handleValidationErrors, loginUser);
router.get('/current-user', validateToken, getCurrentUserInfo);

module.exports = router;