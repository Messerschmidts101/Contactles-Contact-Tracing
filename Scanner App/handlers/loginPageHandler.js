const mongoose = require('mongoose');
const {dialog} = require('electron');

const EstablishmentModel = require('../models/establishmentModel.js');


exports.authenticate = async function(win, loginCredentials) {
    let result = false;
    let establishment;
    try {
        establishment = await EstablishmentModel.find({
        username: loginCredentials.username,
        password: loginCredentials.password
        });
    
        if(establishment.length == 1) {
            result = establishment[0]._id;
            dialog.showMessageBoxSync(win, {title: 'Login', type: 'info', message: "Login Successful"});
        }else {
            result = false;
            dialog.showMessageBoxSync(win, {title: 'Login', type: 'info', message: "Username and password doesn't match. Please try again."});
        }
        
    } catch (error) {
        result = false;
        dialog.showMessageBoxSync(win, {title: 'Login', type: 'error', message: "An error occured while loggin in. Please contact the developer."});
    }

    return result;
}