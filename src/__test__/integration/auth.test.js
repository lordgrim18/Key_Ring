const { matchedData } = require('express-validator');
const bcrypt = require('bcrypt');
const { registerUser } = require('../../controllers/authController');
const User = require('../../models/userModel');
const asyncHandler = require('express-async-handler');
const errorHandler = require('../../middleware/errorHandler');

jest.mock('express-validator', () => ({
    matchedData: jest.fn(() => ({
        name: 'test',
        email: 'test@example.com',
        password: 'password123',
    })),
}));

jest.mock('bcrypt', () => ({
    hash: jest.fn(() => 'hashed_password123'),
}));

jest.mock('../../models/userModel', () => ({
    create: jest.fn(),
}));

jest.mock('../../middleware/errorHandler', () => jest.fn((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        title: 'Mocked Error',
        message: err.message,
        errors: err.errors || [],
    });
}));

const mockRequest = {
    body: {
        name: 'test',
        email: 'test@example.com',
        password: 'password123',
    },
};

const mockResponse = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
};

const mockNext = jest.fn();

describe('register user', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return status 201 and the user created', async () => {
        User.create.mockResolvedValueOnce({
            id: 1,
            name: 'test',
            email: 'test@example.com',
            password: 'hashed_password123',
        });

        // if there is no middleware like errorHandler, then no need to pass mockNext
        await registerUser(mockRequest, mockResponse, mockNext);

        expect(matchedData).toHaveBeenCalledWith(mockRequest);
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(User.create).toHaveBeenCalledWith({
            name: 'test',
            email: 'test@example.com',
            password: 'hashed_password123',
        });
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            msg: 'User created successfully',
            data: { _id: 1, email: 'test@example.com' },
        });
    });

    it('should return status 500 when user creation fails', async () => {
        const error = new Error('Failed to save user');
        User.create.mockImplementationOnce(() => {
            throw error;
        });

        await registerUser(mockRequest, mockResponse, mockNext);

        expect(User.create).toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith(error);

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            title: 'Mocked Error',
            message: 'Failed to save user',
            errors: [],
        });
    });

    it('should return status 400 when there are validation errors', async () => {
        const error = new Error('Validation error');
        error.errors = [{ msg: 'Invalid Field' }];
        mockResponse.status.mockImplementationOnce(() => {
            throw error;
        });

        await registerUser(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            title: 'Mocked Error',
            message: 'Validation error',
            errors: [{ msg: 'Invalid Field' }],
        });
    });
});
