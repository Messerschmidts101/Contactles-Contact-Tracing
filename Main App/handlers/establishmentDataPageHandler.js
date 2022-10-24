const mongoose = require('mongoose');
const { dialog } = require('electron');


const EstablishmentModel = require('../models/establishmentModel.js');
const VisitorModel = require('../models/visitorModel.js');
const VisitModel = require('../models/visitModel.js');
const { findByIdAndUpdate } = require('../models/establishmentModel.js');



exports.getEstablishments = async function() {
    let establishments
    try{
        establishments = await EstablishmentModel.find({}, '_id name address contactNumber email dateRegistered').exec();
        console.log('Establishment Data successfully loaded!');
    } catch (err) {
        dialog.showMessageBoxSync(win, { type: 'error', message: `An error has occured while getting the establishment data!\nPlease contact the developer`});
        console.log(err);
    }
	
	return JSON.stringify(establishments);
    /*  
        *   @das:add -->    Make a query to the database to fetch all the establishment data
        *       Note: call the 'toObject' method of the result of the query before returning it.
        *           ex: result.toObject();
    */
}


exports.deleteEstablishment = async function (win, id) {
    for(let i = 0; i < id.length; ++i){
        try {
            await EstablishmentModel.findByIdAndDelete({_id : mongoose.Types.ObjectId(id[i])}).exec();
            dialog.showMessageBoxSync(win, { type: 'info', message: `Delete sucess!`});
        }catch(err) {
            console.log(err);
            dialog.showMessageBoxSync(win, { type: 'error', message: `Delete operation failed for id:${id[0]}. Please contact the developer.`});
        }
    }
}

exports.getEstablishment = async function (win, id) {
    let establishment;
    try {
        establishment = await EstablishmentModel.findById({_id : mongoose.Types.ObjectId(id)});
    } catch(err) {
        console.log(err);
        dialog.showMessageBoxSync(win, { type: 'warning', message: `Failed retrieving data with id: ${id}.\nPlease contact the developer.`});
    }
    return JSON.stringify(establishment);
}

exports.updateEstablishment = async function (win, id, obj) {
    try{
        // console.log(obj);
        await EstablishmentModel.findByIdAndUpdate(mongoose.Types.ObjectId(id), {
            $set: {
                name: obj.name,
                address: obj.address,
                owner: obj.owner,
                contactNumber: obj.contactNumber,
                email: obj.email,
                username: obj.username,
                password: obj.password
            }
            
        });
        dialog.showMessageBoxSync(win, { title: 'Update', type: 'info', message: `Update sucess!`});
    } catch (err) {
        console.log(err);
        dialog.showMessageBoxSync(win, { title: 'Update', type: 'error', message: `An error occured while updating obj with id: ${id}.\nPlease contact the developer.`});
    }
   
}