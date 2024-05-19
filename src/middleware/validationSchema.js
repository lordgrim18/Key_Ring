const { checkIfEmailExists } = require('../utils/validatorUtils');


const registerUserValidationSchema = {
    email: {
        notEmpty: {
            errorMessage: 'Email is required'
        },
        isEmail: {
            errorMessage: 'Enter proper email address'
        },
        custom: {
            options: (value) => {
                return checkIfEmailExists(value).then(user => {
                    if (user) {
                        return Promise.reject('Email already in use');
                    }
                });
            }
        },
    },
    name: {
        notEmpty: {
            errorMessage: 'Name is required'
        },
        isLength: {
            errorMessage: 'Name should be at least 3 chars long',
            options: { min: 3 }
        },
    },
    password: {
        notEmpty: {
            errorMessage: 'Password is required'
        },
        isLength: {
            errorMessage: 'Password should be at least 6 chars long',
            options: { min: 6 }
        },
    },
};

module.exports = registerUserValidationSchema;