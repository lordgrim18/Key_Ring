const {constants} = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : constants.SERVER_ERROR;
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({ 
                title: err.message ? 'Error' : 'Validation Error',
                message: 'Validation error',
                errors: err.errors || err.message,
              });
            break;
        case constants.NOT_FOUND:
            res.json({ 
                title: 'Not Found',
                message: err.message,
            });
            break;
        case constants.SERVER_ERROR:
            res.json({ 
                title: 'Server Error',
                message: err.message,
            });
            break;
        case constants.UNAUTHORIZED:
            res.json({ 
                title: 'Unauthorized',
                message: err.message,
            });
            break;
        case constants.FORBIDDEN:
            res.json({ 
                title: 'Forbidden',
                message: err.message,
            });
            break;
        default:
            break;
    }

};

module.exports = errorHandler;