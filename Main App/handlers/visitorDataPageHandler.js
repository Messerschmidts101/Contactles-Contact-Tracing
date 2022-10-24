const mongoose = require('mongoose');
const { dialog } = require('electron');

const EstablishmentModel = require('../models/establishmentModel.js');
const VisitorModel = require('../models/visitorModel.js');
const VisitModel = require('../models/visitModel.js');



exports.getVisitors = async function() {
    let visitors;
    try {
	    visitors = await VisitorModel.find({}, 'name address contactNumber email covidStatus vaccine dateRegistered').exec();
        console.log('Visitors Data successfully loaded!');
    } catch (err) {
        dialog.showMessageBoxSync(win, { type: 'warning', message: `An error has occured while getting the visitors data!\nPlease contact the developer`});
        console.log(err);
    }
	return JSON.stringify(visitors);
    /*  
        *   @das:add -->    Make a query to the database to fetch all the visitor data
        *       Note: call the 'toObject' method of the result of the query before returning it.
        *           ex: result.toObject();
    */
}

exports.deleteVisitor = async function (win, id) {
    for(let i = 0; i < id.length; ++i){
        try {
            await VisitorModel.findByIdAndDelete({_id : mongoose.Types.ObjectId(id[i])}).exec();
            dialog.showMessageBoxSync(win, { type: 'info', message: `Delete sucess!`, title: `Delete`});
        }catch(err) {
            console.log(err);
            dialog.showMessageBoxSync(win, { type: 'error', message: `Delete operation failed for id:${id[0]}. Please contact the developer.`});
        }
    }
}

exports.getVisitor = async function (win, id) {
    let visitor;
    try {
        visitor = await VisitorModel.findById({_id : mongoose.Types.ObjectId(id)});
    } catch(err) {
        console.log(err);
        dialog.showMessageBoxSync(win, { type: 'error', message: `Failed retrieving data with id: ${id}.\nPlease contact the developer.`});
    }
    return JSON.stringify(visitor);
}

exports.updateVisitor = async function (win, id, obj) {
    try{
        // console.log(obj);
        await VisitorModel.findByIdAndUpdate(mongoose.Types.ObjectId(id), {
            $set : {
                name: obj.name,
                address: obj.address,
                email: obj.email,
                contactNumber: obj.contact,
                covidStatus: obj.covidStatus,
                vaccine: obj.vaccine
            }
            
        });
        dialog.showMessageBoxSync(win, { type: 'info', message: `Update sucess!`, title: `Update`});
    } catch (err) {
        console.log(err);
        dialog.showMessageBoxSync(win, { type: 'error', message: `An error occured while updating obj with id: ${id}.\nPlease contact the developer.`, title: `Update`});
    }
   
}