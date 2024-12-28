const mongoose = require("mongoose");
var mongoURL = "mongodb+srv://dbmanasa:dbsree@cluster0.muzlc.mongodb.net/has?retryWrites=true&w=majority&appName=Cluster0";
//var mongoURL = process.env.MONGO_URL;
mongoose.connect(mongoURL, { useUnifiedTopology: true, useNewUrlParser: true });

var connection = mongoose.connection;

connection.on("error", () => {
	console.log("Mongo DB Connection Failed");
});

connection.on("connected", () => {
	console.log("Mongo DB Connection Successful");
});

module.exports = mongoose;
