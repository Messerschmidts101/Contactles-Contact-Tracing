// import dependencies 

const { app, BrowserWindow, ipcMain } = require('electron');
const ejse              = require('ejs-electron');
const path              = require('path');
const fs                = require('fs');
const os                = require('os');

// import mongoose models
const EstablishmentModel = require('./models/establishmentModel.js');
const VisitorModel = require('./models/visitorModel.js');
const VisitModel = require('./models/visitModel.js');

// import the scanner page handler
const scannerPageHandler = require('./handlers/scannerPageHandler.js');
const loginPageHandler = require('./handlers/loginPageHandler.js');
// setup mongodb database connection
const mongoose = require('mongoose');
const visitorModel = require('./models/visitorModel.js');
const { WSAEINVAL } = require('constants');
mongoose.connect('mongodb+srv://admin123:password.123@cluster0.riqsbpv.mongodb.net/?retryWrites=true&w=majority',
{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

// setup mongodb connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function () {
    //connected
    try {
        visitors = await VisitorModel.find({}).exec()
        console.log('visitor found');
        // console.log(visitors);
        establishments = await EstablishmentModel.find({}).exec();
        // console.log(establishments);
        visits = await VisitModel.find({}).exec();
        // console.log(visits);
    } catch (err) {
        console.log(err);
    }
    console.log('Database setup Sucessful');

});

let win = null; // initialize a variable that will hold the main window
let establishmentID = null;

// declare variables to hold the database data
let visitors,  visits, establishments;

function createWindow (folder, file) {
    window = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
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

});


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});


ipcMain.on('reqLogin', async function (event, loginCredentials) {
    establishmentID = await loginPageHandler.authenticate(win, loginCredentials);
    // console.log(establishmentID)
    if(establishmentID != false) {
        win.loadURL(path.join('file://', __dirname, 'components', 'index', 'html', 'index.ejs'));
    }
});

ipcMain.on('reqScan', function (event, msg) {
    console.log(msg);
    win.loadURL(path.join('file://', __dirname, 'components', 'scanner', 'html', 'scanner.ejs'));
});

ipcMain.on('reqIndex', (event, msg)=>{
    console.log(msg);
    win.loadURL(path.join('file://', __dirname, 'components', 'index', 'html', 'index.ejs'));
});

// setup the event handlers for the scanner events

ipcMain.on('entry:detected', async function (event, id) {
    scannerPageHandler.entrance(event, establishmentID, id);
});

ipcMain.on('exit:detected', scannerPageHandler.exit);


