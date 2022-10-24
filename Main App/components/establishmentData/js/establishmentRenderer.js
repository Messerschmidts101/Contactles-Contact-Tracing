/*
    This file contains all the javascript codes for the establishment data page
*/

const { ipcMain } = require("electron/main");

/*
        *     @clar:add --> display all the establishment data to the table
        *             Tasks:
        *                     @clar: 1. call the .ready method to ensure that the DOM is ready before trying to access it
        *                             work on inside its function parameter
        *                             @micaela:add --> emit an event just before clar iterate through the data,
        *                                                                        it would be an event that asks for the establishment data;
        *                                                                             use the ipcRenderer.invoke and check the documentation 
        *                                                                             for that to check its syntax (they have a good example there)
        *                                                             Store the data in a variable        
        * 
        *                     @clar: 2. Use the dummy data below and display them on the table: (headers and data)
        *                     Note: duplicate the data in the array to ensure that they are added 
        *                                     row by row and not go in a horizontal way
        *                             [
                                                {
                                                        _id: 60b64d198873311ec41b43f3,
                                                        name: 'Jollibee',
                                                        address: 'Sta.Mesa',
                                                        owner: 'John Doe',
                                                        contactNumber: '09123456789',
                                                        email: 'info@email.com',
                                                        dateRegistered: 2021-06-01T15:07:05.655Z,
                                                        __v: 0
                                                }
                                        ]

*/
let selectedElements = [];
let dataArr;
let tableName = 'establishment';

async function getData(request, msg) {
    return await ipcRenderer.invoke(request, msg);
}

function byName(obj) {
    return obj.name.toUpperCase();
}

function byDate(obj) {
    let date = new Date(obj.dateRegistered)
    return date.getTime();
}

function selectField(field) {
    if(field == 'name'){
        return byName;
    }else {
        return byDate;
    }
}

function buildCondition(obj1, obj2, field, order) {
    if(order == 'ascending') {
        return selectField(field)(obj1) < selectField(field)(obj2);
    }else {
        return selectField(field)(obj1) > selectField(field)(obj2);
    }
}


function partition (arr, l , r, field, order) {
    pivot = arr[r];// get the pivot
    i = l - 1;// less the i by 1 to make it less than j
    
    for (let j = l; j < r; ++j) {// navigate through the arra
        if (buildCondition(arr[j], pivot, field, order)){// if the current element is less than the pivot
            i += 1;// increment the index i
            [arr[i], arr[j]] = [arr[j], arr[i]];// swap elements in index i and j
        }
    }

    [arr[i + 1], arr[r]] = [arr[r], arr[i + 1]];// place the pivot in the center of the array;
    return i + 1;// return the index of the pivot
}


async function sort (arr, l, r, field, order) {
    if(l >= r)    return;// exit if there is only one element or no element

    let p = partition(arr, l, r, field, order);// partition the array into two

    sort(arr, l, p-1, field, order);// do the quick sort for the elements less than the pivot
    sort(arr, p+1, r, field, order);// do the quick sort for the elements greater than or equal to the pivot
}

$('establishment.ejs').ready(async function(event){
    // Setup the search functionality
    $('#traceBtn').hide();
    
    let msg = "requesting estabishment data..";
    // Asks for data in the main process
    let result = await getData('reqEstabData', msg);
    dataArr = JSON.parse(result);
    let field = $('#field').children('option:selected').val();
    let order = $('#order').children('option:selected').val();
    sort(dataArr, 0, dataArr.length-1, field, order);

    displayTable(getTableName(), dataArr);


});

function displayHeaders(tableName, data) {
    let addHeaders = `<tr><th scope="col">#</th></tr>`
    $('thead').append(addHeaders);
    for(const key of Object.keys(data)){
        addHeaders = `<th>${key}</th>`;
        $(`#${getTableName()}TBL thead th:last-child`).after(addHeaders);
    }
}

function displayTable(tableName, dataArr) {
    // add headers for the table
    
    displayHeaders(tableName, dataArr[0]);

    let counter = 1;
    for (const obj of Object.values(dataArr)) { // add rows 
        let addNewRow;
        
        let id = obj._id;// get the _id property of the object for use in tr element id
        let name = obj.name;
        addNewRow = `<tr id=${id}></tr>`;// add new row for the current object
        $(`#${getTableName()}TBL > tbody`).append(addNewRow);

        let addNumberColumn = `<td><input type="checkbox" name=${name} value=${id}>${counter++}</td>`;// add new column for the number row
        $(`#${getTableName()}TBL tbody tr#${id}`).append(addNumberColumn);

        
        // add the columns
        for(const [key, value] of Object.entries(obj)){// add columns for the object attributes
            let addNewColumn;
            if (value){// if the property is not null
                if(key == 'dateRegistered'){// if date, format
                    let date = new Date(value);
                    let formattedDate = `${date.toDateString()} - ${date.toLocaleTimeString()}`;
                    addNewColumn = `<td>${formattedDate}</td>`
                } else { // common case
                    addNewColumn = `<td>${value}</td>`
                }
            } else { // display none
                addNewColumn = `<td>None</td>`
            }
            
            $(`#${getTableName()}TBL tbody tr#${id}`).append(addNewColumn);
        }
    }

    $("input[type='checkbox']").click( function () {
        getChecked();//update the list of checked element whenever the user checks a checkbox
    });
}

$('#searchInput').keyup( function () {
    let input = $('input#searchInput').val();
    
    $(`tbody tr:not(:contains('${input}'))`).hide();
    $(`tbody tr:contains('${input}')`).show();
});




$('#deleteBtn').click( function (event) {// set the event handler for the delete button
    event.preventDefault();
    if(selectedElements.length != 0){
        ipcRenderer.send('reqDeleteEstablishment', selectedElements);
    }
    
});

function getChecked () {
    selectedElements = [];
    $('tbody').find(':checked').each( function () {
        selectedElements.push($(this).val());
    });
}

function getDataArr() {
    return dataArr;
}

function getTableName() {
    return tableName;
}


$('#sortBtn').click( function (event) {
    event.preventDefault();
    
    let field = $('#field').children('option:selected').val();
    let order = $('#order').children('option:selected').val();
    sort(getDataArr(), 0, dataArr.length - 1, field, order);
    clearTable();
    displayTable(getTableName(), getDataArr());

});

function clearTable() {
    $('thead').empty();
    $('tbody').empty();
}

function getSelectedElements() {
    return selectedElements;
}

$('#editBtn').click( function (event) {
    event.preventDefault();
    if(getSelectedElements().length == 1){
        ipcRenderer.send('reqEditEstablishment', getSelectedElements()[0]);
    }
    
});



    

