const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("MongoDB connected: ", conn.connection.name);
    } catch (err) {
        console.log(`Error: ${err}`);
        process.exit(1);
    }
};

module.exports = connectDb;