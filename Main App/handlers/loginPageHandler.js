const mongoose = require('mongoose');
const {dialog} = require('electron');

const AdminModel = require('../models/adminModel.js');


exports.authenticate = async function(win, loginCredentials) {
    let result = false;
    try {
        let admin = await AdminModel.find({
            username: loginCredentials.username,
            password: loginCredentials.password
        });
        
        if(admin.length == 1) {
            result = true;
            dialog.showMessageBoxSync(win, {title: 'Login', type: 'info', message: "Login Successful"});
        }else {
            dialog.showMessageBoxSync(win, {title: 'Login', type: 'info', message: "Username and password doesn't match. Please try again."});
        }
        
    } catch (error) {
        dialog.showMessageBoxSync(win, {title: 'Login', type: 'error', message: "An error occured while loggin in. Please contact the developer."});
    }

    return result;
}