const { app, BrowserWindow, ipcMain } = require('electron');
const path              = require('path');
const fs                = require('fs');
const ejse              = require('ejs-electron');
const os                = require('os')

const EstablishmentModel = require('./models/establishmentModel.js');
const VisitorModel = require('./models/visitorModel.js');
const VisitModel = require('./models/visitModel.js');

// import of handlers
const treePageHandler = require('./handlers/treePageHandler.js');
const scannerPageHandler = require('./handlers/scannerPageHandler.js');
const establishmentDataPageHandler = require('./handlers/establishmentDataPageHandler.js');
const visitDataPageHandler = require('./handlers/visitDataPageHandler.js');
const visitorDataPageHandler = require('./handlers/visitorDataPageHandler.js');
const loginPageHandler = require('./handlers/loginPageHandler.js');
// import the registration handlers

const adminRegistrationHandler = require('./handlers/adminRegistrationHandler.js');
const establishmentRegistrationHandler = require('./handlers/establishmentRegistrationHandler.js');
const visitorRegistrationHandler = require('./handlers/visitorRegistrationHandler.js');

// import the qr generator handler
const qrGeneratorHandler = require('./handlers/QrGeneratorHandler.js');

// setup mongodb database connection
const mongoose = require('mongoose');

// declare variables to hold the database data
let visitors,  visits, establishments;

mongoose.connect('mongodb+srv://admin123:password.123@cluster0.riqsbpv.mongodb.net/?retryWrites=true&w=majority',
                {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function () {
    //connected
    loadData(establishments, visitors, visits);
});

async function getVisitors() {
    return visitorDataPageHandler.getVisitors();
}

async function getVisits() {
    return visitDataPageHandler.getVisits();
}

async function getEstablishments(establishments) {
    return establishmentDataPageHandler.getEstablishments();
}

async function loadData() {
    try {
        establishments = await getEstablishments();
        visitors = await getVisitors();
        visits = await getVisits();
    } catch (err) {
        console.log(err);
    }
    console.log('Database setup Sucessful');
}

let win = null;// for reference to the window
let contactTracingTableWindow = null;

/*
    Create the window
*/
function createWindow (folder, file) {
    window = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      fullscreen: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: false,
        nodeIntegration: true
      }
    });
    
    window.loadURL(path.join('file://', __dirname, 'components', folder, 'html', file));
    return window;
}



app.whenReady().then(() => {
    win = createWindow('login', 'login.ejs');
    
    win.once('ready-to-show', () => {
        win.show()
    });

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow('login', 'login.ejs');
    });
    // console.log('window: ', win);
});


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('reqLogin', async function (event, loginCredentials) {
    let matched = await loginPageHandler.authenticate(win, loginCredentials);

    if(matched) {
        // console.log(win)
        win.loadURL(path.join('file://', __dirname, 'components', 'index', 'html', 'index.ejs'));
    }
});

ipcMain.on('reqPrint', async function (event) {

    await qrGeneratorHandler.printPage(win);
});

ipcMain.on('reqPrintContactTracingTable', async function (event) {

    await qrGeneratorHandler.printPage(contactTracingTableWindow);
});

/*
    #navigationBar (templateRenderer.js)
    @unfinished
    Below are the handlers for the navigation bar 
*/

ipcMain.on('reqIndex', (event, msg)=>{
    console.log(msg);
    win.loadURL(path.join('file://', __dirname, 'components', 'index', 'html', 'index.ejs'));
});

ipcMain.on('reqData', (event, msg)=>{
    console.log(msg);
    win.loadURL(path.join('file://', __dirname, 'components', 'establishmentData', 'html', 'establishment.ejs'));
});

// ipcMain.on('reqTree', (event, msg)=>{
//     console.log(msg);
//     win.loadURL(`file://${__dirname}/views/tree.ejs`)
// });

// for directing to register page
ipcMain.on('reqRegister', (event, msg)=>{
    console.log(msg);
    win.loadURL(path.join('file://', __dirname, 'components', 'registration', 'html', 'registration.ejs'));
});

ipcMain.on('test',visitorDataPageHandler.getVisitors);



/*
    #navigationBar (dataNavigationRenderer.js)
    @unfinished
    Below are the handlers for the navigation bar of the data pages
*/
//for directing to establishment page
ipcMain.on('reqEstablishment', (event, msg)=>{
    console.log(msg);
    win.loadURL(path.join('file://', __dirname, 'components', 'establishmentData', 'html', 'establishment.ejs'));

});
//for directing to visitor page
ipcMain.on('reqVisitor', (event, msg)=>{
    console.log(msg);
    win.loadURL(path.join('file://', __dirname, 'components', 'visitorData', 'html', 'visitor.ejs'));
    
});
//for directing to visit data page
ipcMain.on('reqVisit', (event, msg)=>{
    console.log(msg);
    win.loadURL(path.join('file://', __dirname, 'components', 'visitData', 'html', 'visit.ejs'));
});


/*
    #EstablishmentDataPage (establishmentDataPage.js)
    @unfinished
    Below are the handlers for the establishment data page
*/

// handler for request of establishment data
ipcMain.handle('reqEstabData', function () {
    return getEstablishments();
});

ipcMain.on('reqDeleteEstablishment', async function (event, id) {
    await establishmentDataPageHandler.deleteEstablishment(win, id);
    win.loadURL(path.join('file://', __dirname, 'components', 'establishmentData', 'html', 'establishment.ejs'));
});

ipcMain.on('reqEditEstablishment', async function (event, id) {
    let establishmentData = await establishmentDataPageHandler.getEstablishment(win, id);
    win.loadURL(path.join('file://', __dirname, 'components', 'establishmentRegistration', 'html', 'establishmentRegistration.ejs'));
    win.once('ready-to-show', () => {// wait for the window to be ready before showing it and firing the event
        win.webContents.send('establishmentData', establishmentData);
    });
});

ipcMain.on('reqUpdateEstablishment', async function (event, id, obj) {
    // console.log(obj);
    await establishmentDataPageHandler.updateEstablishment(win, id, obj);
    win.loadURL(path.join('file://', __dirname, 'components', 'establishmentData', 'html', 'establishment.ejs'));
})

/*
    #visitorDataPage (visitorDataPage.js)
    @unfinished
    Below are the handlers for the visitor data page
*/

// handler for the request of visitor data
ipcMain.handle('reqVisitorData', function () {
    return getVisitors();
});

ipcMain.on('reqDeleteVisitor', async function (event, id) {
    await visitorDataPageHandler.deleteVisitor(win, id);
    win.loadURL(path.join('file://', __dirname, 'components', 'visitorData', 'html', 'visitor.ejs'));
});

ipcMain.on('reqEditVisitor', async function (event, id) {

    let visitorData = await visitorDataPageHandler.getVisitor(win, id);
    win.loadURL(path.join('file://', __dirname, 'components', 'visitorRegistration', 'html', 'visitorRegistration.ejs'));
    win.once('ready-to-show', () => {// wait for the window to be ready before showing it and firing the event
        win.webContents.send('visitorData', visitorData);
    });
});

ipcMain.on('reqUpdateVisitor', async function (event, id, obj) {
    // console.log(obj);
    await visitorDataPageHandler.updateVisitor(win, id, obj);
    win.loadURL(path.join('file://', __dirname, 'components', 'visitorData', 'html', 'visitor.ejs'));
});

/*
    #visitDataPage (visitDataPage.js)
    @unfinished
    Below are the handlers for the visit data apge
*/

// handler for the request of visit data
ipcMain.handle('reqVisitData', function () {
    return getVisits();
});

ipcMain.on('reqDeleteVisit', async function (event, id) {
    await visitDataPageHandler.deleteVisit(win, id);
    win.loadURL(path.join('file://', __dirname, 'components', 'visitData', 'html', 'visit.ejs'));
})

/*
    #visitDataPage (visitDataPage.js)
    @unfinished
    Below are the handlers for the printing  of QRCode
*/

ipcMain.on('reqPrintQr', qrGeneratorHandler.generateQr);

/*
    #scannerPage (scannerPageRenderer.js)
    @joseph:modify --> think of how to set the establishment for the app

    Below are the handlers for the scanner page
*/

ipcMain.on('reqScan', function (event, msg) {
    console.log(msg);
    win.loadURL(`file://${__dirname}/views/scanner.ejs`);
})

ipcMain.on('entry:detected', async function (event, id) {
    await scannerPageHandler.entrance(id);
});

/*
    @das:modify --> rewrite the queries using the async await syntax
    Handle exit detection
*/
ipcMain.on('exit:detected', async function (event, id) {
    await scannerPageHandler.exit(id);
});


/*
    #treePage (treePageRenderer.js)
    Below are the handlers for the tree page
*/
ipcMain.handle('treePage:getData', async function (event, obj, level) {
    let datasource = await treePageHandler.buildTree(obj, level);// request for the data [structured as a tree]
    return datasource;// return the datasource
});

ipcMain.on('invalidLevelInput', function (event, level) {// warn the user for invalid level input
    treePageHandler.showLevelError(win, level);
})

ipcMain.on('createTreeFromVisit', function (event, obj) {// load the tree after clicking the row of visit data
    win.loadURL(path.join('file://', __dirname, 'components', 'tree', 'html', 'tree.ejs'));

    win.webContents.once('did-finish-load', () => {// wait for the file to load before firing the event
        // console.log('`this `should only happen once');
        win.webContents.send('createTree', obj);
        // console.log('this should only happen once');
    });
});

ipcMain.on('invalidSelectionForTrace', function (event, length) {
    visitDataPageHandler.showSelectionError(win, length);
});

function getContactTracingTableWindow () {
    return contactTracingTableWindow;
}

function setContactTracingTableWindow (window) {
    contactTracingTableWindow = window;
}
ipcMain.on('reqTreeTable', function (event, data) {// create a new window for displaying the table version of the tree
    // console.log('root: ', JSON.parse(data));
    data = JSON.parse(data);
    // console.log(data);
    
    let newWindow = framelessWindow('contactTracingTable', 'contactTracingTable.ejs');
    
    newWindow.once('ready-to-show', () => {// wait for the window to be ready before showing it and firing the event
        newWindow.show();
        newWindow.webContents.send('contactTracingData', data);
        setContactTracingTableWindow(newWindow);
    });

    

});

function framelessWindow (folder, file) {// for creating frameless window
    let newWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        // frame: false,// make window frameless
        titleBarStyle: 'customButtonsOnHover',
        fullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
            nodeIntegration: true
        }
    });

    newWindow.loadURL(path.join('file://', __dirname, 'components', folder, 'html', file));
    return newWindow;
}



/*
    #registration (registrationRenderer.js)
    Below are the handlers for the registration page
*/



/*
    #registration (registrationRenderer.js)
    Below are the handlers for the registration page
*/

// for directing to the visitor registration page
ipcMain.on('reqVisitorReg', (event, msg)=>{
    console.log(msg);
    win.loadURL(path.join('file://', __dirname, 'components', 'visitorRegistration', 'html', 'visitorRegistration.ejs'));
    // console.log('hey?');
});
// for directing to the establishment registration page
ipcMain.on('reqEstabReg', (event, msg)=>{
    console.log(msg);
    win.loadURL(path.join('file://', __dirname, 'components', 'establishmentRegistration', 'html', 'establishmentRegistration.ejs'));
});

// for directing to the admin registration page
ipcMain.on('reqAdminReg', (event, msg)=>{
    console.log(msg);
    win.loadURL(path.join('file://', __dirname, 'components', 'adminRegistration', 'html', 'adminRegistration.ejs'));
});


/*
    #visitorRegistration (visitorRegistrationRenderer.js)
    Below are the handlers for the visitor registration page
*/

// for the request of writing the visitor data into the database
ipcMain.on('writeVisitorData', async function (event, entity) {
    try{
        await visitorRegistrationHandler.registerVisitor(event, entity, win);
        win.loadURL(path.join('file://', __dirname, 'components', 'registration', 'html', 'registration.ejs'));
    } catch (err) {
        console.log(err);
    }
});

/*
    #establishmentRegistration (establishmentRegistrationRenderer.js)
    Below are the handlers for the establishment registration page
*/

// for the request of writing the establishment data into the database
ipcMain.on('writeEstabData', async function (event, entity) {
    try {
        await establishmentRegistrationHandler.registerEstablishment(event, entity, win);
        win.loadURL(path.join('file://', __dirname, 'components', 'registration', 'html', 'registration.ejs'));
    } catch (err) {
        console.log(err);
    }
});

/*
    #adminRegistration (adminRegistrationRenderer.js)
    Below are the handlers for the admin registration page
*/

// for the request of writing the admin data into the database
ipcMain.on('writeAdminData', function (event, entity) {
    try{
        adminRegistrationHandler.registerAdmin(event, entity, win);
        win.loadURL(path.join('file://', __dirname, 'components', 'registration', 'html', 'registration.ejs'));
    } catch (error) {
        console.log(error);
    }
    
});
