// jest.e2e.setup.js
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app'); // Adjust the path as necessary
require('dotenv').config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI)
            .then(() => console.log("Connected to Test Database"))
            .catch((err) => console.log(`Error: ${err}`));
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});