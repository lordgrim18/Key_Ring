const request = require('supertest');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Contact = require('../../../models/contactModel');

require('dotenv').config();

const app = require('../../../app');

console.log(__dirname);
const testData = JSON.parse(fs.readFileSync(path.join(__dirname, 'contactTestData.json'), 'utf8'));

console.log(testData);

const { userData, tempUser, contacts, updateData } = testData;


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
            .send(contacts[0]);

        contact = response;

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("msg", "Created new contact");

        expect(response.body.data).toHaveProperty("name", contacts[0].name);
        expect(response.body.data).toHaveProperty("email", contacts[0].email);
        expect(response.body.data).toHaveProperty("phone", contacts[0].phone);
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

        const response = await request(app)
            .get(`/api/v1/contacts/${contact.body.data._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("msg", "Show contact");

        expect(response.body.data).toHaveProperty("name", contacts[0].name);
        expect(response.body.data).toHaveProperty("email", contacts[0].email);
        expect(response.body.data).toHaveProperty("phone", contacts[0].phone);
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

describe("Get All Contacts Tests", () => {
        
    it("should get all contacts", async () => {

        const createContact = await request(app)
            .post("/api/v1/contacts/")
            .set('Authorization', `Bearer ${token}`)
            .send(contacts[1]);

        const response = await request(app)
            .get("/api/v1/contacts/")
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("msg", "Show all contacts");

        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveLength(2);
        expect(response.body.data[0]).toHaveProperty("name", contacts[1].name);
        expect(response.body.data[0]).toHaveProperty("email", contacts[1].email);
        expect(response.body.data[0]).toHaveProperty("phone", contacts[1].phone);

        expect(response.body.data[1]).toHaveProperty("name", contacts[0].name);
        expect(response.body.data[1]).toHaveProperty("email", contacts[0].email);
        expect(response.body.data[1]).toHaveProperty("phone", contacts[0].phone);

        expect(response.body).toHaveProperty("pagination");
        expect(response.body.pagination).toHaveProperty("page", 1);
        expect(response.body.pagination).toHaveProperty("limit", 10);
        expect(response.body.pagination).toHaveProperty("totalPages", 1);
    });

    it("should return empty array if no contacts found", async () => {
            
        const response = await request(app)
            .get("/api/v1/contacts/")
            .set('Authorization', `Bearer ${tempToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("msg", "Show all contacts");

        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveLength(0);

        expect(response.body).toHaveProperty("pagination");
        expect(response.body.pagination).toHaveProperty("page", 1);
        expect(response.body.pagination).toHaveProperty("limit", 10);
        expect(response.body.pagination).toHaveProperty("totalPages", 0);
    });

    it("should return separate contacts for different users", async () => {
            
        const response1 = await request(app)
            .get("/api/v1/contacts/")
            .set('Authorization', `Bearer ${token}`);

        const createContact = await request(app)
            .post("/api/v1/contacts/")
            .set('Authorization', `Bearer ${tempToken}`)
            .send(contacts[2]);

        const response2 = await request(app)
            .get("/api/v1/contacts/")
            .set('Authorization', `Bearer ${tempToken}`);

        expect(response1.status).toBe(200);
        expect(response1.body).toHaveProperty("success", true);
        expect(response1.body).toHaveProperty("msg", "Show all contacts");

        expect(response1.body).toHaveProperty("data");
        expect(response1.body.data).toHaveLength(2);
        expect(response1.body.data[0]).toHaveProperty("name", contacts[1].name);
        expect(response1.body.data[0]).toHaveProperty("email", contacts[1].email);
        expect(response1.body.data[0]).toHaveProperty("phone", contacts[1].phone);

        expect(response1.body.data[1]).toHaveProperty("name", contacts[0].name);
        expect(response1.body.data[1]).toHaveProperty("email", contacts[0].email);
        expect(response1.body.data[1]).toHaveProperty("phone", contacts[0].phone);

        expect(response1.body).toHaveProperty("pagination");
        expect(response1.body.pagination).toHaveProperty("page", 1);
        expect(response1.body.pagination).toHaveProperty("limit", 10);
        expect(response1.body.pagination).toHaveProperty("totalPages", 1);

        expect(response2.status).toBe(200);
        expect(response2.body).toHaveProperty("success", true);
        expect(response2.body).toHaveProperty("msg", "Show all contacts");
        
        expect(response2.body).toHaveProperty("data");
        expect(response2.body.data).toHaveLength(1);
        expect(response2.body.data[0]).toHaveProperty("name", contacts[2].name);
        expect(response2.body.data[0]).toHaveProperty("email", contacts[2].email);
        expect(response2.body.data[0]).toHaveProperty("phone", contacts[2].phone);

        expect(response2.body).toHaveProperty("pagination");
        expect(response2.body.pagination).toHaveProperty("page", 1);
        expect(response2.body.pagination).toHaveProperty("limit", 10);
        expect(response2.body.pagination).toHaveProperty("totalPages", 1);

    });

});

describe("Update Contact Tests and check if the value has actually changed", () => {
        
    it("should update a contact", async () => {

        originalContact = await Contact.findById(contact.body.data._id)

        const response = await request(app)
            .put(`/api/v1/contacts/${contact.body.data._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("msg", "Updated contact");

        expect(response.body.data).toHaveProperty("name", updateData.name);
        expect(response.body.data).toHaveProperty("email", updateData.email);
        expect(response.body.data).toHaveProperty("phone", updateData.phone);

        updatedContact = await Contact.findById(contact.body.data._id)

        expect(originalContact.name).not.toBe(updatedContact.name);
        expect(originalContact.email).not.toBe(updatedContact.email);
        expect(originalContact.phone).not.toBe(updatedContact.phone);

    });

    it("should fail if contact id is invalid", async () => {
        const response = await request(app)
            .put("/api/v1/contacts/6651f195c1664ed7dabfbac3")
            .set('Authorization', `Bearer ${token}`)
            .send(updateData);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("title", "Not Found");
        expect(response.body).toHaveProperty("error", "Contact not found");

    });

    it("should fail if user other than created_by user access it", async () => {

        const response = await request(app)
            .put(`/api/v1/contacts/${contact.body.data._id}`)
            .set('Authorization', `Bearer ${tempToken}`)
            .send(updateData);
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("title", "Unauthorized");
        expect(response.body).toHaveProperty("error", "User dont have access to other users contacts");
    });

});

describe("Delete Contact Tests", () => {

    it("should fail if contact id is invalid", async () => {
        const response = await request(app)
            .delete("/api/v1/contacts/6651f195c1664ed7dabfbac3")
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("title", "Not Found");
        expect(response.body).toHaveProperty("error", "Contact not found");

    });

    it("should fail if user other than created_by user access it", async () => {

        const response = await request(app)
            .delete(`/api/v1/contacts/${contact.body.data._id}`)
            .set('Authorization', `Bearer ${tempToken}`);
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("title", "Unauthorized");
        expect(response.body).toHaveProperty("error", "User dont have access to other users contacts");
    });
            
    it("should delete a contact", async () => {

        const response = await request(app)
            .delete(`/api/v1/contacts/${contact.body.data._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("msg", "Contact removed");

        const deletedContact = await Contact.findById(contact.body.data._id);
        expect(deletedContact).toBeNull();
    });

});

describe("Pagination Tests", () => {
    
    it("should return paginated contacts with default limit", async () => {

        // Empty the Contact collection
        await Contact.deleteMany({});

        // Create 15 contacts
        for (let i = 0; i < 15; i++) {
            const contact = {
                name: `Contact${i}`,
                email: `Email${i}@email.com`,
                phone: i < 10 ? `865789456${i}` : `86578945${i}`,
            };
            await request(app)
                .post("/api/v1/contacts/")
                .set('Authorization', `Bearer ${token}`)
                .send(contact);
        }

        // Request the first page of contacts
        const responsePage1 = await request(app)
            .get("/api/v1/contacts?page=1")
            .set('Authorization', `Bearer ${token}`);

        expect(responsePage1.status).toBe(200);
        expect(responsePage1.body).toHaveProperty("success", true);
        expect(responsePage1.body).toHaveProperty("msg", "Show all contacts");

        expect(responsePage1.body).toHaveProperty("data");
        expect(responsePage1.body.data).toHaveLength(10);
        expect(responsePage1.body).toHaveProperty("pagination");
        expect(responsePage1.body.pagination).toHaveProperty("page", 1);
        expect(responsePage1.body.pagination).toHaveProperty("limit", 10);
        expect(responsePage1.body.pagination).toHaveProperty("totalPages", 2);

        // Request the second page of contacts
        const responsePage2 = await request(app)
            .get("/api/v1/contacts?page=2")
            .set('Authorization', `Bearer ${token}`);

        expect(responsePage2.status).toBe(200);
        expect(responsePage2.body).toHaveProperty("success", true);
        expect(responsePage2.body).toHaveProperty("msg", "Show all contacts");

        expect(responsePage2.body).toHaveProperty("data");
        expect(responsePage2.body.data).toHaveLength(5); // Only 5 contacts should be on the second page
        expect(responsePage2.body).toHaveProperty("pagination");
        expect(responsePage2.body.pagination).toHaveProperty("page", 2);
        expect(responsePage2.body.pagination).toHaveProperty("limit", 10);
        expect(responsePage2.body.pagination).toHaveProperty("totalPages", 2);
    });

    it("should return paginated contacts with specified limit", async () => {
        // Request the first page of contacts with limit 5
        const responsePage1 = await request(app)
            .get("/api/v1/contacts?page=1&limit=5")
            .set('Authorization', `Bearer ${token}`);

        expect(responsePage1.status).toBe(200);
        expect(responsePage1.body).toHaveProperty("success", true);
        expect(responsePage1.body).toHaveProperty("msg", "Show all contacts");

        expect(responsePage1.body).toHaveProperty("data");
        expect(responsePage1.body.data).toHaveLength(5); // Only 5 contacts should be on the first page
        expect(responsePage1.body).toHaveProperty("pagination");
        expect(responsePage1.body.pagination).toHaveProperty("page", 1);
        expect(responsePage1.body.pagination).toHaveProperty("limit", 5);
        expect(responsePage1.body.pagination).toHaveProperty("totalPages", 3);

        // Request the second page of contacts with limit 5
        const responsePage2 = await request(app)
            .get("/api/v1/contacts?page=2&limit=5")
            .set('Authorization', `Bearer ${token}`);

        expect(responsePage2.status).toBe(200);
        expect(responsePage2.body).toHaveProperty("success", true);
        expect(responsePage2.body).toHaveProperty("msg", "Show all contacts");

        expect(responsePage2.body).toHaveProperty("data");
        expect(responsePage2.body.data).toHaveLength(5); // Only 5 contacts should be on the second page
        expect(responsePage2.body).toHaveProperty("pagination");
        expect(responsePage2.body.pagination).toHaveProperty("page", 2);
        expect(responsePage2.body.pagination).toHaveProperty("limit", 5);
        expect(responsePage2.body.pagination).toHaveProperty("totalPages", 3);

        // Request the third page of contacts with limit 5
        const responsePage3 = await request(app)
            .get("/api/v1/contacts?page=3&limit=5")
            .set('Authorization', `Bearer ${token}`);

        expect(responsePage3.status).toBe(200);
        expect(responsePage3.body).toHaveProperty("success", true);
        expect(responsePage3.body).toHaveProperty("msg", "Show all contacts");

        expect(responsePage3.body).toHaveProperty("data");
        expect(responsePage3.body.data).toHaveLength(5); // Only 5 contacts should be on the third page
        expect(responsePage3.body).toHaveProperty("pagination");
        expect(responsePage3.body.pagination).toHaveProperty("page", 3);
        expect(responsePage3.body.pagination).toHaveProperty("limit", 5);
        expect(responsePage3.body.pagination).toHaveProperty("totalPages", 3);
    });

    it("should return empty array when page number is invalid", async () => {
        const response = await request(app)
            .get("/api/v1/contacts?page=4")
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("msg", "Show all contacts");

        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveLength(0);
        expect(response.body).toHaveProperty("pagination");
        expect(response.body.pagination).toHaveProperty("page", 4);
        expect(response.body.pagination).toHaveProperty("limit", 10);
        expect(response.body.pagination).toHaveProperty("totalPages", 2);
    });

    it("should return error when limit or page is non integer", async () => {
        const response = await request(app)
            .get("/api/v1/contacts?page=a&limit=b")
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("title", "Validation Error");

        expect(response.body.error).toHaveLength(2);
        expect(response.body.error[0]).toHaveProperty("field", "page");
        expect(response.body.error[0]).toHaveProperty("message", "Page must be a positive integer");

        expect(response.body.error[1]).toHaveProperty("field", "limit");
        expect(response.body.error[1]).toHaveProperty("message", "Limit must be a positive integer");
    });

    it("should return error when limit or page is less than 1", async () => {
        const response = await request(app)
            .get("/api/v1/contacts?page=0&limit=0")
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("title", "Validation Error");

        expect(response.body.error).toHaveLength(2);
        expect(response.body.error[0]).toHaveProperty("field", "page");
        expect(response.body.error[0]).toHaveProperty("message", "Page must be a positive integer");

        expect(response.body.error[1]).toHaveProperty("field", "limit");
        expect(response.body.error[1]).toHaveProperty("message", "Limit must be a positive integer");
    });

});

describe("Search and Sort Contact Tests", () => {

    it("should return contacts with search query", async () => {

        const addContact = await request(app)
            .post("/api/v1/contacts/")
            .set('Authorization', `Bearer ${token}`)
            .send(contacts[3]);

        const addContact1 = await request(app)
            .post("/api/v1/contacts/")
            .set('Authorization', `Bearer ${token}`)
            .send(contacts[4]);

        const response1 = await request(app)
            .get("/api/v1/contacts?search=an")
            .set('Authorization', `Bearer ${token}`);

        expect(response1.status).toBe(200);
        expect(response1.body).toHaveProperty("success", true);
        expect(response1.body).toHaveProperty("msg", "Show all contacts");

        expect(response1.body.data).toHaveLength(2);
        expect(response1.body.data[0]).toHaveProperty("name", "Xander Thayne");
        expect(response1.body.data[1]).toHaveProperty("name", "Annie Thayne");

    });

    it("should return contacts with sort query in descending order", async () => {
        const response = await request(app)
            .get("/api/v1/contacts?sortBy=name&orderBy=desc")
            .set('Authorization', `Bearer ${token}`);


        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("msg", "Show all contacts");

        expect(response.body.data).toHaveLength(10);

        expect(response.body.data[0]).toHaveProperty("name", "Xander Thayne");
        expect(response.body.data[1]).toHaveProperty("name", "Contact14");
        expect(response.body.data[9]).toHaveProperty("name", "Contact6");
        expect(response.body.pagination).toHaveProperty("totalPages", 2);

        const response1 = await request(app)
            .get("/api/v1/contacts?sortBy=name&orderBy=desc&page=2")
            .set('Authorization', `Bearer ${token}`);

        expect(response1.status).toBe(200);
        expect(response1.body).toHaveProperty("success", true);
        expect(response1.body).toHaveProperty("msg", "Show all contacts");

        expect(response1.body.data).toHaveLength(7);

        expect(response1.body.data[0]).toHaveProperty("name", "Contact5");
        expect(response1.body.data[6]).toHaveProperty("name", "Annie Thayne");
        expect(response1.body.pagination).toHaveProperty("totalPages", 2);

    });

    it("should return contacts with sort query in ascending order", async () => {
        const response = await request(app)
            .get("/api/v1/contacts?sortBy=name&orderBy=asc")
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("msg", "Show all contacts");

        expect(response.body.data).toHaveLength(10);

        expect(response.body.data[0]).toHaveProperty("name", "Annie Thayne");
        expect(response.body.data[1]).toHaveProperty("name", "Contact0");
        expect(response.body.data[9]).toHaveProperty("name", "Contact8");
        expect(response.body.pagination).toHaveProperty("totalPages", 2);

        const response1 = await request(app)
            .get("/api/v1/contacts?sortBy=name&orderBy=asc&page=2")
            .set('Authorization', `Bearer ${token}`);

        expect(response1.status).toBe(200);
        expect(response1.body).toHaveProperty("success", true);
        expect(response1.body).toHaveProperty("msg", "Show all contacts");

        expect(response1.body.data).toHaveLength(7);

        expect(response1.body.data[0]).toHaveProperty("name", "Contact9");
        expect(response1.body.data[6]).toHaveProperty("name", "Xander Thayne");
        expect(response1.body.pagination).toHaveProperty("totalPages", 2);

    });

    it("should return contacts with sort done on search result", async () => {
        const response = await request(app)
            .get("/api/v1/contacts?sortBy=name&orderBy=asc&search=1")
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);

        expect(response.body.data).toHaveLength(6);

        expect(response.body.data[0]).toHaveProperty("name", "Contact1");
        expect(response.body.data[1]).toHaveProperty("name", "Contact10");
        expect(response.body.data[5]).toHaveProperty("name", "Contact14");
        expect(response.body.pagination).toHaveProperty("totalPages", 1);
    });

    it("should return error if sortBy or orderBy field is invalid", async () => {
        const response = await request(app)
            .get("/api/v1/contacts?sortBy=invalid&orderBy=invalid")
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("title", "Validation Error");

        expect(response.body.error).toHaveLength(2);
        expect(response.body.error[0]).toHaveProperty("field", "sortBy");
        expect(response.body.error[0]).toHaveProperty("message", "Invalid sort by field, must be one of [name, email, createdAt]");
        expect(response.body.error[1]).toHaveProperty("field", "orderBy");
        expect(response.body.error[1]).toHaveProperty("message", "Invalid order by field, must be one of [asc, desc]");
    });

    it("should return empty array if no contacts found with search query", async () => {
        const response = await request(app)
            .get("/api/v1/contacts?search=xyz")
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("msg", "Show all contacts");

        expect(response.body.data).toHaveLength(0);
    });

});