const {constants} = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode;
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({ 
                success: false,
                title: 'Validation Error',
                error: err.errors || err.message,
              });
            break;
        case constants.NOT_FOUND:
            res.json({ 
                success: false,
                title: 'Not Found',
                error: err.message,
            });
            break;
        case constants.SERVER_ERROR:
            res.json({ 
                success: false,
                title: 'Server Error',
                error: err.message,
            });
            break;
        case constants.UNAUTHORIZED:
            res.json({ 
                success: false,
                title: 'Unauthorized',
                error: err.message,
            });
            break;
        case constants.FORBIDDEN:
            res.json({ 
                success: false,
                title: 'Forbidden',
                error: err.message,
            });
            break;
        default:
            res.status(constants.SERVER_ERROR);
            res.json({ 
                success: false,
                title: 'Server Error',
                error: err.message,
            });
    }
};

module.exports = errorHandler;