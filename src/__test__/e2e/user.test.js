const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

const app = require('../../app');

describe('User API Tests', () => {
    beforeAll(() => {
        return mongoose.connect(process.env.MONGO_URI)
            .then(() => console.log("Connected to Test Database"))
            .catch((err) => console.log(`Error: ${err}`));
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    const data = {
        name: 'John Doe',
        email: "johndoe@email.com",
        password: "password123",
    };

    describe("Register Tests", () => {

        it("should fail if required fields are missing", async () => {
            const response = await request(app)
                .post("/api/v1/auth/register")
                .send({});
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("title", "Validation Error");
            expect(response.body.error).toHaveLength(3);

            const error = response.body.error[0];
            expect(error).toHaveProperty("field", "email");
            expect(error).toHaveProperty("message", "Email is required, Enter proper email address");

            const error1 = response.body.error[1];
            expect(error1).toHaveProperty("field", "name");
            expect(error1).toHaveProperty("message", "Name is required, Name should be at least 3 chars long");

            const error2 = response.body.error[2];
            expect(error2).toHaveProperty("field", "password");
            expect(error2).toHaveProperty("message", "Password is required, Password should be at least 6 chars long");
        });

        it("should fail if entered fields are invalid", async () => {
            const response = await request(app)
                .post("/api/v1/auth/register")
                .send({
                    name: "Jo",
                    email: "johndoe",
                    password: "pass",
                });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("title", "Validation Error");
            expect(response.body.error).toHaveLength(3);

            const error = response.body.error[0];
            expect(error).toHaveProperty("field", "email");
            expect(error).toHaveProperty("message", "Enter proper email address");

            const error1 = response.body.error[1];
            expect(error1).toHaveProperty("field", "name");
            expect(error1).toHaveProperty("message", "Name should be at least 3 chars long");

            const error2 = response.body.error[2];
            expect(error2).toHaveProperty("field", "password");
            expect(error2).toHaveProperty("message", "Password should be at least 6 chars long");
        });

        it("should create a new user", async () => {
            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(data);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body).toHaveProperty("msg", "User created successfully");
            expect(response.body.data).toHaveProperty("_id");
            expect(response.body.data).toHaveProperty("email", data.email);
        });

        it("should fail if user already exists", async () => {
            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(data);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("title", "Validation Error");

            const error = response.body.error[0];
            expect(error).toHaveProperty("field", "email");
            expect(error).toHaveProperty("value", data.email);
            expect(error).toHaveProperty("message", "Email already in use");
        });
    });

    describe("Login Tests", () => {

        it("should login a user", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send(data);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty("token");
            expect(response.body.data).toHaveProperty("email", data.email);
        });

        it("should fail if user does not exist", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "john@email.com",
                    password: "password123",
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("title", "Validation Error");
            expect(response.body).toHaveProperty("error", "No User with this email found!");
        });

        it("should fail if password is incorrect", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: data.email,
                    password: "password",
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("title", "Validation Error");
            expect(response.body).toHaveProperty("error", "Invalid Password for given user!");
        });

        it("should fail if required fields are missing", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({});
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("title", "Validation Error");
            expect(response.body.error).toHaveLength(2);

            const error = response.body.error[0];
            expect(error).toHaveProperty("field", "email");
            expect(error).toHaveProperty("message", "Email is required, Enter proper email address");

            const error1 = response.body.error[1];
            expect(error1).toHaveProperty("field", "password");
            expect(error1).toHaveProperty("message", "Password is required");
        });
    });

    describe("Current User Tests", () => {

        it('should return current user info if token is valid', async () => {
            const loginResponse = await request(app)
                .post('/api/v1/auth/login')
                .send(data);

            // Ensure login was successful and we received a token
            expect(loginResponse.status).toBe(200);
            expect(loginResponse.body.data).toHaveProperty('token');
            const token = loginResponse.body.data.token;

            // Step 2: Use the token to access the /current-user endpoint
            const currentUserResponse = await request(app)
                .get('/api/v1/auth/current-user')
                .set('Authorization', `Bearer ${token}`);

            // Step 3: Verify the response
            expect(currentUserResponse.status).toBe(200);
            expect(currentUserResponse.body).toHaveProperty('success', true);
            expect(currentUserResponse.body).toHaveProperty('data');
            expect(currentUserResponse.body.data).toHaveProperty('email', data.email);
            // Add more assertions as needed to verify the returned user info
        });

        it('should fail if token is invalid', async () => {
            const invalidTokenResponse = await request(app)
                .get('/api/v1/auth/current-user')
                .set('Authorization', 'Bearer invalidtoken');

            expect(invalidTokenResponse.status).toBe(401);
            expect(invalidTokenResponse.body).toHaveProperty('success', false);
            expect(invalidTokenResponse.body).toHaveProperty('title', 'Unauthorized');
            expect(invalidTokenResponse.body).toHaveProperty('error', 'Not authorized, token failed');
        });

        it('should fail if token is missing', async () => {
            const missingTokenResponse = await request(app)
                .get('/api/v1/auth/current-user');

            expect(missingTokenResponse.status).toBe(401);
            expect(missingTokenResponse.body).toHaveProperty('success', false);
            expect(missingTokenResponse.body).toHaveProperty('title', 'Unauthorized');
            expect(missingTokenResponse.body).toHaveProperty('error', 'Not authorized, no token');
        });
    });
});
