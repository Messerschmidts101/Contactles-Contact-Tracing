/*
  This file contains all the javascript codes for the scanner page 
*/
// Setup the scanner
const QrScanner = require('qr-scanner');
QrScanner.WORKER_PATH = path.normalize(path.join(__dirname, '..', '..', '..', '/node_modules/qr-scanner/qr-scanner-worker.min.js'));

// cache all the elements needed
let videoElement        = $('video#video');
let entryScanBtn        = $('#entryScanBtn');
let exitScanBtn         = $('#exitScanBtn');
let stopScanBtn         = $('#stopScanBtn');


/*
  * @ done
  * Instantiate the exit scanner
*/

const QrScannerEntry = new QrScanner(document.getElementById('video'), (result) => {
    console.log('result: ', result);
    QrScannerEntry.stop();
    console.log('stopped');

    //send the data to the main process
    ipcRenderer.send('entry:detected', result);
});

/*
    @modify:clar --> use jQuery for getting the element and adding eventhandlers
    * Start the scanner when the entrace button is clicked
*/
entryScanBtn.click(function(event){
    event.preventDefault();
    console.log('scanning');
    if(!QrScannerEntry._active){
      QrScannerEntry.start();
    }
});


/*
  * @ done
  *  Instantiate the exit scanner
*/
QrScannerExit = new QrScanner(document.getElementById('video'), (result) => {
    console.log('result: ', result);
    QrScannerExit.stop();
    console.log('stopped');

    //send the data to the main process
    ipcRenderer.send('exit:detected', result);
  });

/*
    @modify:clar --> use jQuery for getting the element and adding eventhandlers
    * Start the scanner when the exit button is clicked
*/
exitScanBtn.click(function(event){
    event.preventDefault();
    console.log('scanning');
    if(!QrScannerExit._active){
      QrScannerExit.start();
    }
});

/*
    @done
    stop any QrScanner from running
*/
stopScanBtn.click((event) => {
    event.preventDefault();
    console.log('stopped');

    if(QrScannerEntry._active){// stop the entry scanner if active
      QrScannerEntry.stop();
    }else if (QrScannerExit._active) {// stop the exit scanner if active
      QrScannerExit.stop();
    }else {// log the console if clicked while there's no active scanner
      console.log('No scanner is active');
    }
});


