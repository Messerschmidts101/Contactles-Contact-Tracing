const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    name: String,
    address: String,
    contactNumber: String,
    email: String,
    username: String,
    password: String,
    dateRegistered: { type: Date, default: Date.now }
});



module.exports = mongoose.model('Admin', AdminSchema);
