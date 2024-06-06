const { get } = require("mongoose");
const { options } = require("../app");

const getContactsSchema = {
    search: {
        isString: {
            errorMessage: 'Search query must be a string',
        },
        optional: true,
    },
    sortBy: {
        isString: {
            errorMessage: 'Sort by field must be a string',
        },
        isIn: {
            options: [['name', 'email', 'createdAt']],
            errorMessage: 'Invalid sort by field, must be one of [name, email, createdAt]',
        },
        optional: true,
    },
    orderBy: {
        isString: {
            errorMessage: 'Order by field must be a string',
        },
        isIn: {
            options: [['asc', 'desc']],
            errorMessage: 'Invalid order by field, must be one of [asc, desc]',
        },
        optional: true,
    },
    page: {
        isInt: {
            errorMessage: 'Page must be a positive integer',
            options: { min: 1 },
        },
        toInt: true,
        optional: true,
    },
    limit: {
        isInt: {
            errorMessage: 'Limit must be a positive integer',
            options: { min: 1 },
        },
        toInt: true,
        optional: true,
    },
};

// Create and Update contact schema
const ContactSchema = {
    name: {
        notEmpty: {
            errorMessage: 'Name is required'
        },
        isString: {
            errorMessage: 'Name must be a string',
        },
    },
    email: {
        notEmpty: {
            errorMessage: 'Email is required'
        },
        isEmail: {
            errorMessage: 'Enter proper email address',
        },
    },
    phone: {
        notEmpty: {
            errorMessage: 'Phone number is required'
        },
        isMobilePhone: {
            options: ['en-IN'],
            errorMessage: 'Enter proper phone number',
        },
    },
};

module.exports = { 
    getContactsSchema,
    ContactSchema,
}