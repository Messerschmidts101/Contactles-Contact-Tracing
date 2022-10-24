/*
  #establishmentRegistrationForm
  * This file contains the javascript instructions for the activities in the visitor registration form page
  * Check out the elements in establishmentRegistration.ejs
*/


//  @clar:add --> Setup the submition of the form and collect all the inputs in an object
//      step1:  Store the form element in a variable. Get it using jQuery
let formEstablishment = $('#establishmentForm');

function getInputs() {
    let establishment = {
        name: $('#nameInput').val(),
        address: $('#addressInput').val(),
        owner: $('#ownerInput').val(),
        contactNumber: $('#contactNumberInput').val(),
        email: $('#emailInput').val(),
        username: $('#usernameInput').val(),
        password: $('#passwordInput').val()
    }
    return establishment;
}

formEstablishment.submit(function(event){
    event.preventDefault();
    
    //      step2:  Setup the submit event of the form. Then add the function parameter
    //      step3:  Add the event.preventDefault() line in the function.

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
    ipcRenderer.send('writeEstabData', getInputs());
});



ipcRenderer.on('establishmentData', function (event, data) {
    data = JSON.parse(data);
    $('#nameInput').val(data.name);
    $('#addressInput').val(data.address);
    $('#ownerInput').val(data.owner);
    $('#contactNumberInput').val(data.contactNumber);
    $('#emailInput').val(data.email);
    $('#usernameInput').val(data.username);
    $('#passwordInput').val(data.password);
    $('#submitEstablishment').val('Update');
    
    formEstablishment.off('submit');
    formEstablishment.submit( function (event) {
        event.preventDefault();
        let id = data._id;
        ipcRenderer.send('reqUpdateEstablishment', id, getInputs());
    })
});





  