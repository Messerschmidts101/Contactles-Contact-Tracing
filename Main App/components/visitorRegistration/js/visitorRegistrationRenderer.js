/*
  #visitorRegistrationForm
  * This file contains the javascript instructions for the activities in the visitor registration form page
  * Check out the elements in visitorRegistration.ejs
*/


//  @clar:add --> Setup the submition of the form and collect all the inputs in an object
//      step1:  Store the form element in a variable. Get it using jQuery
let formVisitor = $('#visitorForm');

//      step2:  Setup the submit event of the form. Then add the function parameter
//      step3:  Add the event.preventDefault() line in the function.

function getInputs() {
    let visitor = {
        name: $('input#nameInput').val(),
        address: $('#addressInput').val(),
        contact: $('#contactNumberInput').val(),
        email: $('#emailInput').val(),
        covidStatus: $('#covidStatusInput').val(),
        vaccine: $('#vaccineInput').val()
    }
    return visitor;
}


formVisitor.submit(function(event){

    event.preventDefault();

    //      step4:  Get all the data from the input elements and create an object from them
    //              It would be something like the statements below:
    //              {
    //                  name: $('input#nameInput').val(),
    //                  email: $('input#emailInput').val(),
    //                  .......(etc).
    //              }
    //              then store it in a variable. That would be used by @micaela.

//      @micaela:add --> setup the emitter for writing the data to the database
//                          and pass the object made by @clar as a parameter to the event.
    ipcRenderer.send('writeVisitorData',  getInputs());

});

ipcRenderer.on('visitorData', function (event, data) {
    data = JSON.parse(data);
    $('input#nameInput').val(data.name);
    $('#addressInput').val(data.address);
    $('#contactNumberInput').val(data.contactNumber);
    $('#emailInput').val(data.email);
    $('#covidStatusInput').val(data.covidStatus);
    $('#vaccineInput').val(data.vaccine);

    $('#submitVisitor').val('Update');

    formVisitor.off('submit');
    formVisitor.submit( function (event) {
        event.preventDefault();
        let id = data._id;
        ipcRenderer.send('reqUpdateVisitor', id, getInputs());
    })
});


  

