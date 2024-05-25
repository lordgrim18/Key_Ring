const request = require('supertest');
const mongoose = require('mongoose');

require('dotenv').config();

const app = require('../../app');

describe("create user and login", () => {
	beforeAll(() => {
		mongoose
			.connect(process.env.MONGO_URI)
			.then(() => console.log("Connected to Test Database"))
			.catch((err) => console.log(`Error: ${err}`));

	});

    data = {
        name: "John Doe",
        email: "johndoe@email.com",
        password: "password123",
    };

    it("should create a new user", async () => {
        const response = await request(app)
            .post("/api/v1/auth/register")
            .send( data );
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body).toHaveProperty("msg", "User created successfully");
            expect(response.body.data).toHaveProperty("_id");
            expect(response.body.data).toHaveProperty("email", data.email);
    });

    it("should login a user", async () => {
        const response = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: data.email,
                password: data.password,
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty("token");
    });


    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

});