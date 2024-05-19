const User = require('../models/userModel');

checkIfEmailExists = async (email) => {
    const user = await User.findOne({ email });
    return !!user;
};

module.exports = { checkIfEmailExists };