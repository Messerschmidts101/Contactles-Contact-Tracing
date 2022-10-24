/*
  #adminRegistrationForm
  * This file contains the javascript instructions for the activities in the visitor registration form page
  * Check out the elements in adminRegistration.ejs
*/


//  @clar:add --> Setup the submition of the form and collect all the inputs in an object
//      step1:  Store the form element in a variable. Get it using jQuery
  let formAdmin = $('#adminForm');


  formAdmin.submit(function(event){
    //      step2:  Setup the submit event of the form. Then add the function parameter
    //      step3:  Add the event.preventDefault() line in the function.
    event.preventDefault();
    let nameAdmin = $('#nameInput').val();
    let addressAdmin = $('#addressInput').val();
    let contactNumAdmin = $('#contactNumberInput').val();
    let emailAdmin = $('#emailInput').val();
    let userNameAdmin = $('#usernameInput').val();
    let passwordAdmin = $('#passwordInput').val();
    //      step4:  Get all the data from the input elements and create an object from them
    //              It would be something like the statements below:
    //              {
    //                  name: $('input#nameInput').val(),
    //                  email: $('input#emailInput').val(),
    //                  .......(etc).
    //              }
    //              then store it in a variable. That would be used by @micaela.
    let adminCredentials = {
      name: nameAdmin,
      address: addressAdmin,
      contactNumber: contactNumAdmin,
      email: emailAdmin,
      username: userNameAdmin,
      password: passwordAdmin
    };
    //      @micaela:add --> setup the emitter for writing the data to the database
    //                          and pass the object made by @clar as a parameter to the event.
    ipcRenderer.send('writeAdminData', adminCredentials);
  });


  




