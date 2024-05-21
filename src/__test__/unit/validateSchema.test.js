const { validationResult } = require('express-validator');
const handleValidationErrors = require('../../middleware/validateSchema'); // Adjust the path as necessary

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('handleValidationErrors middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next if there are no validation errors', () => {
    validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });

    handleValidationErrors(req, res, next);

    expect(validationResult).toHaveBeenCalledWith(req);
    expect(next).toHaveBeenCalled();
  });

  it('should return status 400 and validation errors if there are validation errors', () => {
    const validationError = {
      path: 'email',
      msg: 'Invalid email',
      value: 'invalidemail',
    };

    validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(false),
      array: jest.fn().mockReturnValue([validationError]),
    });

    handleValidationErrors(req, res, next);

    expect(validationResult).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledWith(400);

    const expectedError = new Error('Validation error');
    expectedError.errors = [
      {
        field: 'email',
        value: 'invalidemail',
        message: 'Invalid email',
      },
    ];

    expect(next).toHaveBeenCalledWith(expectedError);
  });

  it('should consolidate multiple errors for the same field and value', () => {
    const validationErrors = [
      { path: 'email', msg: 'Invalid email', value: 'invalidemail' },
      { path: 'email', msg: 'Email already in use', value: 'invalidemail' },
    ];

    validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(false),
      array: jest.fn().mockReturnValue(validationErrors),
    });

    handleValidationErrors(req, res, next);

    expect(validationResult).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledWith(400);

    const expectedError = new Error('Validation error');
    expectedError.errors = [
      {
        field: 'email',
        value: 'invalidemail',
        message: 'Invalid email, Email already in use',
      },
    ];

    expect(next).toHaveBeenCalledWith(expectedError);
  });
});
