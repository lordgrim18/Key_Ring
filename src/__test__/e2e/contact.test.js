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

const tempUser = {
    name: 'Mark Doe',
    email: "markdoe@email.com",
    password: "password123",
};

let token;
let contact;
let tempToken;

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

        token = login.body.data.token;

        const response = await request(app)
            .post("/api/v1/contacts/")
            .set('Authorization', `Bearer ${token}`)
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
            .set('Authorization', `Bearer ${token}`)
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
            .set('Authorization', `Bearer ${token}`)
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

describe("Get Contact by Id Tests", () => {
    
    it("should get a contact by id", async () => {

        contact = await request(app)
            .post("/api/v1/contacts/")
            .set('Authorization', `Bearer ${token}`)
            .send(contactData);

        const response = await request(app)
            .get(`/api/v1/contacts/${contact.body.data._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("msg", "Show contact");

        expect(response.body.data).toHaveProperty("name", contactData.name);
        expect(response.body.data).toHaveProperty("email", contactData.email);
        expect(response.body.data).toHaveProperty("phone", contactData.phone);
    });

    it("should fail if contact id is invalid", async () => {
        const response = await request(app)
            .get("/api/v1/contacts/6651f195c1664ed7dabfbac3")
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("title", "Not Found");
        expect(response.body).toHaveProperty("error", "Invalid contact id");

    });

    it("should fail if user other than created_by user access it", async () => {

        const register = await request(app)
            .post("/api/v1/auth/register")
            .send(tempUser);

        const login = await request(app)
            .post("/api/v1/auth/login")
            .send(tempUser);

        tempToken = login.body.data.token;


        const response = await request(app)
            .get(`/api/v1/contacts/${contact.body.data._id}`)
            .set('Authorization', `Bearer ${tempToken}`);
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("title", "Unauthorized");
        expect(response.body).toHaveProperty("error", "User dont have access to other users contacts");
    });
        
});