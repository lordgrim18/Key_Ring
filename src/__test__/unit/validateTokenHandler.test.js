const jwt = require("jsonwebtoken");
const validateToken = require('../../middleware/validateTokenHandler');
const asyncHandler = require("express-async-handler");

jest.mock("jsonwebtoken");

describe("validateToken middleware", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it("should call next if token is valid", async () => {
        req.headers.authorization = "Bearer validtoken";
        const decoded = { user: { id: "123" } };
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, decoded);
        });

        await validateToken(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith("validtoken", process.env.ACCESS_TOKEN_SECRET, expect.any(Function));
        expect(req.user).toEqual(decoded.user);
        expect(next).toHaveBeenCalled();
    });

    it("should return 401 if token is missing", async () => {
        await validateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next.mock.calls[0][0].message).toBe("Not authorized, no token");
    });

    it("should return 401 if token is invalid", async () => {
        req.headers.authorization = "Bearer invalidtoken";
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error("Invalid token"), null);
        });

        await validateToken(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith("invalidtoken", process.env.ACCESS_TOKEN_SECRET, expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next.mock.calls[0][0].message).toBe("Not authorized, token failed");
    });
});
