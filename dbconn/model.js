var mongoose = require("mongoose");

let dbURI = "mongodb+srv://dbjahan:dbjahan@cluster0.8ric4.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', function () {
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) { //any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});

var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phone: String,
    role: String,
    createdOn: { "type": Date, "default": Date.now },
    activeSince: Date
});

var UserModel = mongoose.model("parkingUser", userSchema);

var bookingSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    location: String,
    slot: String,
    startDate: Date,
    endDate: Date,
});

var bookingModel = mongoose.model("parking", bookingSchema);

var areaSchema = new mongoose.Schema({
    location: String,
    desc: String,
    slots: Number,
    imgUrl: String,
    createdOn: { "type": Date, "default": Date.now },
});

var areaModel = mongoose.model("arealocation", areaSchema);
module.exports = {
    UserModel: UserModel,
    bookingModel: bookingModel,
    areaModel: areaModel
}