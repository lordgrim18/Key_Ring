const express = require('express');
const router = express.Router();
const { 
    getContact, 
    createContact,
    getContactById,
} = require('../controllers/contactController');

router.route('/').get(getContact).post(createContact);
router.route("/:id").get(getContactById)


module.exports = router;