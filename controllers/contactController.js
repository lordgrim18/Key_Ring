// @desc Get all contacts
// @route GET /api/v1/contacts
// @access Public

const getContact = (req, res) => {
    res.status(200).json({ success: true, msg: 'Show all contacts' });
};

module.exports = { getContact };