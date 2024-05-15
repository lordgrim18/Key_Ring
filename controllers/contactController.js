// @desc Get all contacts
// @route GET /api/v1/contacts
// @access Public

const getContact = (req, res) => {
    res.status(200).json({ success: true, msg: 'Show all contacts' });
};

// @desc Create a contact
// @route POST /api/v1/contacts
// @access Public
const createContact = (req, res) => {
    console.log(req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error('Please fill all fields!!');
    }
    res.status(201).json({ success: true, msg: 'Create new contact' });
};

module.exports = { getContact, createContact };