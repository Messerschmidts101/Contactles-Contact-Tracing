const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VisitorSchema = new Schema({
    name: String,
    address: String,
    contactNumber: String,
    email: String,
    dateRegistered: { type: Date, default: Date.now },
    covidStatus: String,
    vaccine: String
});



module.exports = mongoose.model('Visitor', VisitorSchema);
