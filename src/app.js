const express = require('express');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.use("/api/v1/contacts", require("./routes/contactRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));

app.use(errorHandler);

module.exports = app;