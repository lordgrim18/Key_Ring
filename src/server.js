const connectDb = require('./config/dbConnection');
const app = require('./app');
const dotenv = require('dotenv').config();

connectDb();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });