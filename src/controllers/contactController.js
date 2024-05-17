const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');

// @desc Get all contacts
// @route GET /api/v1/contacts
// @access private

const getContact = asyncHandler(async (req, res) => {
    const contacts = await Contact.find(
        { created_by: req.user.id }
    );
    res.status(200).json({ success: true, msg: 'Show all contacts', data: contacts });
});

// @desc Create a contact
// @route POST /api/v1/contacts
// @access private
const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error('Please fill all fields!!');
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        created_by: req.user.id
    });
    res.status(201).json({ success: true, msg: 'Created new contact', data: contact});
});


// @desc Get a contact
// @route GET /api/v1/contacts/:id
// @access private
const getContactById = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error('Contact not found');
    }
    if (contact.created_by.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User dont have access to other users contacts');
    }
    res.status(200).json({ success: true, msg: 'Show contact', data: contact });
});

// @desc Update a contact
// @route PUT /api/v1/contacts/:id
// @access private

const updateContact = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error('Contact not found');
    }

    if (contact.created_by.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User dont have access to other users contacts');
    }

    contact.name = name || contact.name;
    contact.email = email || contact.email;
    contact.phone = phone || contact.phone;

    const updatedContact = await contact.save();
    res.status(200).json({ success: true, msg: 'Updated contact', data: updatedContact });
});

// @desc Delete a contact
// @route DELETE /api/v1/contacts/:id
// @access private

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error('Contact not found');
    }

    if (contact.created_by.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User dont have access to other users contacts');
    }

    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, msg: 'Contact removed', data: contact});
});


module.exports = { 
    getContact, 
    createContact,
    getContactById,
    updateContact,
    deleteContact
};