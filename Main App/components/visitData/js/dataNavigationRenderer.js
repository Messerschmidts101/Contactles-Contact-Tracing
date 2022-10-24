/*
  This file contains all the javascript codes for the navigation buttons of the data pages [establishment, visitor, visit]
*/

// @clar:add --> store all the buttons in a variable using jQuery and use that variables for adding the click events
let establishmentTblBtn = $('a#establishmentTableButton');
let visitorTblBtn = $('a#visitorTableButton');
let visitTblBtn = $('a#visitTableButton');

// @clar:add --> use the variable you made above and set up their click event for the "to establishment data page" button/link
establishmentTblBtn.click(function(event){
    event.preventDefault();
    // alert('Establishment Table');
    ipcRenderer.send('reqEstablishment', 'access to Establishment page successful.');
});
    

// @clar:add --> use the variable you made above and set up their click event for the "to visitor data page" button/link
visitorTblBtn.click(function(event){
    event.preventDefault();
    // alert('Visitor Table');
    ipcRenderer.send('reqVisitor', 'access to Visitor page successful.');
});
    

// @clar:add --> use the variable you made above and set up their click event for the "to visit data page" button/link
visitTblBtn.click(function(event){
    event.preventDefault();
    // alert('Visit Table');
    ipcRenderer.send('reqVisit', 'access to Visit Data page successful.');
});







