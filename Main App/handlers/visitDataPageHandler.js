const mongoose = require('mongoose');
const { dialog } = require('electron');

const EstablishmentModel = require('../models/establishmentModel.js');
const VisitorModel = require('../models/visitorModel.js');
const VisitModel = require('../models/visitModel.js');



exports.getVisits = async function() {
	var visits = await VisitModel.find({}, 'establishment visitor covidStatus entered exited')
    .populate({path: 'establishment', select: 'name'})
    .populate({path: 'visitor', select: 'name'})
    .sort({ entered: -1}).exec();

    // console.log(visits);
	return JSON.stringify(visits);

    /*  
        *   @das:add -->    Make a query to the database to fetch all the establishment data
        *       Note: call the 'toObject' method of the result of the query before returning it.
        *           ex: result.toObject();
    */
}

exports.showSelectionError = function (win, length){
    dialog.showMessageBoxSync(win, { type: 'warning', message: `Invalid selection: length -> ${length}.\nYou can only select a single data for tracing.`});
}

exports.deleteVisit = async function (win, id) {
    for(let i = 0; i < id.length; ++i){
        try {
            await VisitModel.findByIdAndDelete({_id : mongoose.Types.ObjectId(id[i])}).exec();
            dialog.showMessageBoxSync(win, { type: 'warning', message: `Delete sucess!`});
        }catch(err) {
            console.log(err);
            dialog.showMessageBoxSync(win, { type: 'warning', message: `Delete operation failed for id:${id[0]}. Please contact the developer.`});
        }
    }
}