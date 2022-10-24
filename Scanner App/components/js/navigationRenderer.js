/*
  #navigationBar
  * This file contains all the handlers that is similar to all the page like the navigation bar 
  * Check out the elements in the header page
*/

// Note: you may want to modify the id's of the elements

// @clar:add --> get all the buttons and store them in variables
let indexPageBtn = $('a#indexPageButton');
let logoBtn = $('a#indexPageButtonLogo');
let scanPageBtn = $('a#scanPageButton');

let testBtn = $('a#testButton');


// @clar:add --> setup the click event for the "to index page" button
indexPageBtn.click(function(event){
  event.preventDefault();
  console.log('index page');
  ipcRenderer.send('reqIndex', 'access to Index page successful.');
});

logoBtn.click(function(event){
  event.preventDefault();
  console.log('index page');
  ipcRenderer.send('reqIndex', 'access to Index page successful.');
});

// @clar:add --> setup the click event for the "to scan page" button
scanPageBtn.click(function(event){
  event.preventDefault();
  console.log('scan page');
  ipcRenderer.send('reqScan', 'access to Scan page successful.');
});
  
  