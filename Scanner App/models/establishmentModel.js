const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EstablishmentSchema = new Schema({
    name: String,
    address: String,
    owner: String,
    contactNumber: String,
    email: String,
    username: String,
    password: String,
    dateRegistered: { type: Date, default: Date.now }
});



module.exports = mongoose.model('Establishment', EstablishmentSchema);
