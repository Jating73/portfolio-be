const mongoose = require('mongoose');

const mongoUrl = process.env.MONGODB_URL;

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

mongoose.connect(mongoUrl, options);

const connection = mongoose.connection

connection.on("error", () => {
    console.error("Error connecting mongoDB");
});

connection.on("connected", () => {
    console.log("MongoDB connected successfully");
});

module.exports = mongoose;  