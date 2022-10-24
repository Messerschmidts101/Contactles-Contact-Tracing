/*
  #navigationBar
  * This file contains all the handlers that is similar to all the page like the navigation bar 
  * Check out the elements in the header page
*/

// Note: you may want to modify the id's of the elements

// @clar:add --> get all the buttons and store them in variables
let indexPageBtn  =  $('a#indexPageButton');
let indexPageBtnLogo  =  $('a#indexPageButtonLogo');
let dataPageBtn   = $('a#dataPageButton');
let treePageBtn   = $('a#treePageButton');
let scanPageBtn   = $('a#scanPageButton');
let regiPageBtn   = $('a#registerPageButton');
let printBtn      = $('a#printBtn');
let testBtn       = $('a#testButton');


// @clar:add --> setup the click event for the "to index page" button
indexPageBtn.click(function(event){
  event.preventDefault();
  console.log('index page');
  ipcRenderer.send('reqIndex', 'access to Index page successful.');
});

indexPageBtnLogo.click(function(event){
  event.preventDefault();
  console.log('index page from logo');
  ipcRenderer.send('reqIndex', 'access to Index page from logo successful.');
});

// @clar:add --> setup the click event for the "to data page" button
dataPageBtn.click(function(event){
  event.preventDefault();
  console.log('data page');
  ipcRenderer.send('reqData', 'access to Data page successful.');
});
  

// @clar:add --> get the link button for the tree page and setup the click event
treePageBtn.click(function(event){
  event.preventDefault();
  console.log('tree page');
  ipcRenderer.send('reqTree', 'access to Tree page successful.');
});


// @clar:add --> setup the click event for the "to scan page" button
scanPageBtn.click(function(event){
  event.preventDefault();
  console.log('scan page');
  ipcRenderer.send('reqScan', 'access to Scan page successful.');
});
  
  
// @clar:add --> setup the click event for the "to register page" button
regiPageBtn.click(function(event){
  event.preventDefault();
  console.log('register page');
  ipcRenderer.send('reqRegister', 'access to Register page successful.');
});

testBtn.click(function(event){
  event.preventDefault();
  console.log('test');
  ipcRenderer.send('test', 'this is working.');
});

printBtn.click(function (event) {
  event.preventDefault();
  console.log('Printing...');
  ipcRenderer.send('reqPrint');
})


// @sep,@micai fr @clar :: search button click event [for data page]
// searchBtn.click(function(){
//   var searchTextField = $('#searchInput').val();
//   alert(searchTextField);
// });

/*
  *@micaela --> this is your area to test the handlers if it works, put your code inside the function below
*/

// $('a#testButton').click(function (event) {
//   event.preventDefault();// @clar:note always add this line inside the function of the click event
//   alert('It works!');
//   // place your event emitters here
// })




