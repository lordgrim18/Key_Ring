const { constants } = require('../../utils/constants');
const errorHandler = require('../../middleware/errorHandler');

const mockRequest = {};
const mockResponse = {
    status: jest.fn(),
    json: jest.fn(),
};
const mockNext = jest.fn();

describe('Error Handler Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return validation error response', () => {
        const error = new Error('Validation error');
        error.errors = [{ msg: 'Invalid Field' }];
        mockResponse.statusCode = constants.VALIDATION_ERROR;

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
            title: 'Error',
            message: 'Validation error',
            errors: [{ msg: 'Invalid Field' }],
        });
    });

    it('should return not found error response', () => {
        const error = new Error('Resource not found');
        mockResponse.statusCode = constants.NOT_FOUND;

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
            title: 'Not Found',
            message: 'Resource not found',
        });
    });

    it('should return server error response', () => {
        const error = new Error('Internal server error');
        mockResponse.statusCode = constants.SERVER_ERROR;

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
            title: 'Server Error',
            message: 'Internal server error',
        });
    });

    it('should return unauthorized error response', () => {
        const error = new Error('Unauthorized access');
        mockResponse.statusCode = constants.UNAUTHORIZED;

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
            title: 'Unauthorized',
            message: 'Unauthorized access',
        });
    });

    it('should return forbidden error response', () => {
        const error = new Error('Forbidden access');
        mockResponse.statusCode = constants.FORBIDDEN;

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
            title: 'Forbidden',
            message: 'Forbidden access',
        });
    });

    it('should default to server error if status code is not set', () => {
        const error = new Error('Unknown error');
        mockResponse.statusCode = undefined; // Simulating no status code being set

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(constants.SERVER_ERROR);
        expect(mockResponse.json).toHaveBeenCalledWith({
            title: 'Server Error',
            message: 'Unknown error',
        });
    });
});
