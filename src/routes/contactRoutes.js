const express = require('express');
const router = express.Router();
const { checkSchema } = require('express-validator');
const { 
    getContact, 
    createContact,
    getContactById,
    updateContact,
    deleteContact
} = require('../controllers/contactController');
const validateToken = require('../middleware/validateTokenHandler');
const { 
    getContactsSchema,
    ContactSchema,
} = require('../schemas/contactSchema');
const handleValidationErrors = require('../middleware/validateSchema');

router.use(validateToken);
router
  .route('/')
  .get(
    checkSchema(getContactsSchema, ['query']),
    handleValidationErrors,
    getContact
  )
  .post(
    checkSchema(ContactSchema),
    handleValidationErrors,
    createContact
  );
router
    .route("/:id")
    .get(getContactById)
    .put(
        checkSchema(ContactSchema),
        handleValidationErrors,
        updateContact
    )
    .delete(deleteContact);


module.exports = router;