const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/contacts", require("./routes/contactRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));

app.use(errorHandler);

module.exports = app;