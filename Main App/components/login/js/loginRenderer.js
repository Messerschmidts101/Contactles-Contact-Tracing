let formAdmin = $('#loginForm');


  formAdmin.submit(function(event){

    event.preventDefault();
    let userNameAdmin = $('#usernameInput').val();
    let passwordAdmin = $('#passwordInput').val();

    let loginCredentials = {
      username: userNameAdmin,
      password: passwordAdmin
    };
    //      @micaela:add --> setup the emitter for writing the data to the database
    //                          and pass the object made by @clar as a parameter to the event.
    ipcRenderer.send('reqLogin', loginCredentials);
  });