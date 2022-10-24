const mongoose = require('mongoose');
const {dialog} = require('electron');

const EstablishmentModel = require('../models/establishmentModel.js');
const VisitorModel = require('../models/visitorModel.js');
const VisitModel = require('../models/visitModel.js');
const AdminModel = require('../models/adminModel.js')


exports.registerAdmin = async function (event,entity, win) {
    // console.log(entity);
	const Admin = new AdminModel({
        name: entity.name,
        address: entity.address,
        contactNumber: entity.contactNumber,
        email: entity.email,
        username: entity.username,
        password: entity.password
    });
    
    Admin.save(function (err) {
  		if (err) {  
            dialog.showMessageBoxSync(win, {title: 'registration', type: 'error', message: "Admin registered failed! Please contact the developer."});
        }else {
            console.log("Saved Admin");
 		    dialog.showMessageBoxSync(win, {title: 'registration', type: 'info', message: "Admin registered successfully!"});
        }
	});

    
}