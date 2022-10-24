const mongoose = require('mongoose');
const { dialog } = require('electron');
const EstablishmentModel = require('../models/establishmentModel.js');
const VisitorModel = require('../models/visitorModel.js');
const VisitModel = require('../models/visitModel.js');

exports.buildTree = async function (root, level) {

    if(!level && level!=''){// set the level as default [1] if no level is indicated
        level = 1;
    }
    let currLevel = 1;// counter
    
    let puis = await VisitModel.find({// get all the possibly infected individuals
        establishment: root.establishment._id,
        $or : [
            {
                entered: {
                    $gt: root.entered,
                    $lt: root.exited
                }
            },
            {
                exited: {
                    $gt: root.entered,
                    $lt: root.exited
                }
            },
        ]
    })
    .populate('visitor name covidStatus')
    .populate('establishment name')
    .exec();

    
    // let root = transform(visitor);// tranform the object to be mutable
    setObject(root);// set the name and title property of the root node
    let exists = [root];// add the root to the repetition tracker array
    
    puis = transform(puis);// transform the objects to be mutable
    setObjects(puis);// set the name and title property of the objects
    exists = exists.concat(puis);// add the two objects to the repetition tracker array
    // console.log(puis);

    root.children = puis;// add the two puis as children of the root


    let visitors = puis;// set the array for looping
    while(currLevel++ != level){// Create the tree while haven't reach the level input of user
        let tempVisitors = [];
        for(let i = 0; i < visitors.length; ++i){// create the tree
            visitors[i].children = [];// add the children property for the current visitor
            
            // get the latest visit data for the possibly infected visitor
            let latestVisit = await VisitModel.findOne({ // get the latest visit data of the current visitor
                visitor: mongoose.Types.ObjectId(visitors[i].visitor._id)
            })
            .sort({ entered: -1})
            .populate('visitor')
            .populate('establishment')
            .exec();
            
            // get the possibly infected individuals (pii) of the current visitor
            let piis = await VisitModel.find({
                entered: {
                    $gt: latestVisit.entered,
                    $lt: latestVisit.exited
                }
            })
            .populate('visitor')
            .populate('establishment')
            .exec();

            // setup the objects for processing
            piis = transform(piis);// transform the objects to be mutable
            setObjects(piis);// set the name and title property of the objects
            
            // verify if the child is not yet in the tree before adding as a child
            for(let j = 0; j < piis.length; ++j){ 
                if(!exists.find(element => element.visitor._id == piis[j].visitor._id)){
                    visitors[i].children.push(piis[j]);
                    exists.push(piis[j]);

                    tempVisitors.push(piis[j]);
                    }
            }
        }
        visitors = tempVisitors;// set the new visitors to iterate

        
    }
    return JSON.stringify(root);// return the resulting tree
}


function transform(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function setObject(obj) {
    // console.log('obj: ', obj);
    //set the name property of the object
    // console.log('est: ', obj.establishment.name);
    obj.title = obj.establishment.name;
    obj.name = obj.visitor.name;
    // console.log('success');
    return;
}

function setObjects(objs){
    for(let i = 0; i < objs.length; ++i){
        objs[i].title = objs[i].establishment.name;
        objs[i].name = objs[i].visitor.name;
    }
}

exports.showLevelError = function (win, level){
    dialog.showMessageBoxSync(win, { type: 'warning', message: `Invalid input: ${level}.\nOnly values from 1 - 5 are valid.`});
}

