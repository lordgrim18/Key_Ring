const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const validation_errors = validationResult(req);
  if (!validation_errors.isEmpty()) {
    // Extract and consolidate errors
    const extractedErrors = validation_errors.array().reduce((acc, err) => {
      const existingError = acc.find(e => e.field === err.path && e.value === err.value);
      if (existingError) {
        existingError.message += `, ${err.msg}`;
      } else {
        acc.push({
          field: err.path,
          value: err.value,
          message: err.msg
        });
      }
      return acc;
    }, []);

    res.status(400);
    const error = new Error('Validation error');
    error.errors = extractedErrors;
    return next(error);
  }
  next();
};

module.exports = handleValidationErrors;
