const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

const app = require('../../app');

const userData = {
    name: 'John Doe',
    email: "johndoe@email.com",
    password: "password123",
};

const contactData = {
    name: 'Jane Doe',
    email: "janedoe@email.com",
    phone: "8657894561",
};

describe("Create Contact Tests", () => {

    it("should create a new contact", async () => {

        register = await request(app)
            .post("/api/v1/auth/register")
            .send(userData);

        login = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: userData.email,
                password: userData.password
            });

        global.token = login.body.data.token;

        const response = await request(app)
            .post("/api/v1/contacts/")
            .set('Authorization', `Bearer ${global.token}`)
            .send(contactData);

            // console.log(response.body);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("msg", "Created new contact");

        expect(response.body.data).toHaveProperty("name", contactData.name);
        expect(response.body.data).toHaveProperty("email", contactData.email);
        expect(response.body.data).toHaveProperty("phone", contactData.phone);
    });

    it("should fail if required fields are missing", async () => {
        const response = await request(app)
            .post("/api/v1/contacts/")
            .set('Authorization', `Bearer ${global.token}`)
            .send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("title", "Validation Error");
        expect(response.body.error).toHaveLength(3);

        const error = response.body.error[0];
        expect(error).toHaveProperty("field", "name");
        expect(error).toHaveProperty("message", "Name is required, Name must be a string");

        const error1 = response.body.error[1];
        expect(error1).toHaveProperty("field", "email");
        expect(error1).toHaveProperty("message", "Email is required, Enter proper email address");

        const error2 = response.body.error[2];
        expect(error2).toHaveProperty("field", "phone");
        expect(error2).toHaveProperty("message", "Phone number is required, Enter proper phone number");
    });

    it("should fail if entered fields are invalid", async () => {
        const response = await request(app)
            .post("/api/v1/contacts/")
            .set('Authorization', `Bearer ${global.token}`)
            .send({
                name: "Jo",
                email: "johndoe",
                phone: "123",
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("title", "Validation Error");
        expect(response.body.error).toHaveLength(2);

        const error = response.body.error[0];
        expect(error).toHaveProperty("field", "email");
        expect(error).toHaveProperty("message", "Enter proper email address");

        const error2 = response.body.error[1];
        expect(error2).toHaveProperty("field", "phone");
        expect(error2).toHaveProperty("message", "Enter proper phone number");
    });

});