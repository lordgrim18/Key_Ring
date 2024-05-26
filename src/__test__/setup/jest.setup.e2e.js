// jest.e2e.setup.js
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app'); // Adjust the path as necessary
require('dotenv').config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI)
            .then(() => console.log("Connected to Test Database"))
            .catch((err) => console.log(`Error: ${err}`));

    // Create a user and log in to get a token
    const userData = {
        name: 'John Doe',
        email: "johndoe@email.com",
        password: "password123",
    };

    await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

    const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
            email: userData.email,
            password: userData.password,
        });

    global.token = loginResponse.body.data.token;
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});