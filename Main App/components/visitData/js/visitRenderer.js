/*
  This file contains all the javascript codes for the visit data page
*/


/*
    *   @clar:add --> display all the visit data to the table
    *       Tasks:
    *           @clar: 1. call the .ready method to ensure that the DOM is ready before trying to access it
    *               work on inside its function parameter
    *               @micaela:add --> emit an event just before clar iterate through the data,
    *                                    it would be an event that asks for the visit data;
    *                                       use the ipcRenderer.invoke and check the documentation 
    *                                       for that to check its syntax (it have a good example there)
    *                               Store the data in a variable 
    * 
    *           @clar: 2. Use the dummy data below and display them on the table: (headers and data)
    *                       and store it in a variable
    *           Note: duplicate the data in the array to ensure that they are added 
    *                   row by row and not go in a horizontal way
    *               [
                        {
                            _id: 60b66aa4b13db43de4d86e20,
                            establishment: 60b64d198873311ec41b43f3,
                            visitor: 60b655e296f43737186a8fa8,
                            entered: 2021-06-01T17:13:08.640Z,
                            __v: 0,
                            exited: 2021-06-01T17:31:08.962Z
                        }
                    ]

*/
let selectedElements = [];
let dataArr;
let tableName = 'visit';


$('visit.ejs').ready(async function(event){
    let msg = "requesting visit data..";
    let result = await getData('reqVisitData', msg);
    dataArr = JSON.parse(result);

    // add the headers for the table
    displayTable(getTableName(), getDataArr());

    
});

async function getData(request, msg) {
    return await ipcRenderer.invoke(request, msg);
}

function getDataArr() {
    return dataArr;
}

function getTableName() {
    return tableName;
}

function getSelectedElements() {
    return selectedElements;
}

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
        $(`#${getTableName()}TBL tbody tr#${id}`).append(addNumberColumn).data('obj', obj);

        
        // add the columns
        for(const [key, value] of Object.entries(obj)){// add columns for the object attributes
            let addNewColumn;
            if(value){
                if(key == 'establishment' || key == 'visitor'){
                    addNewColumn = `<td>${value.name}</td>`;
                } else if (key == 'entered' || key == 'exited') {
                    let date = new Date(value);
                    let formattedDate = `${date.toDateString()} - ${date.toLocaleTimeString()}`;
                    addNewColumn = `<td>${formattedDate}</td>`;
                } else {
                    addNewColumn = `<td>${value}</td>`;
                }
            }else {
                addNewColumn = `<td>None</td>`;
            }
            
            $(`#${getTableName()}TBL tbody tr#${id}`).append(addNewColumn);
        }
    }
    
    $("input[type='checkbox']").click( function () {
        getChecked();//update the list of checked element whenever the user checks a checkbox
    });
}

$('button#searchBtn').click( function () {
  let input = $('input#searchInput').val();
  
  $(`tbody tr:not(:contains('${input}'))`).hide();
  $(`tbody tr:contains('${input}')`).show();
});


$('#searchInput').keyup( function () {
  let input = $('input#searchInput').val();
  
  $(`tbody tr:not(:contains('${input}'))`).hide();
  $(`tbody tr:contains('${input}')`).show();
});



$('#deleteBtn').click( function (event) {// set the event handler for the delete button
  event.preventDefault();
  if(selectedElements.length != 0){
    ipcRenderer.send('reqDeleteVisit', selectedElements);
  }
});

function getChecked () {
  selectedElements = [];
  $('tbody').find(':checked').each( function () {
    selectedElements.push($(this).val());
  });
}



$('#traceBtn').click( function (event) {
  event.preventDefault();
  if(selectedElements.length == 1){
    let obj = $(`#${selectedElements[0]}`).data('obj');
    ipcRenderer.send('createTreeFromVisit', obj);
  } else {
    ipcRenderer.send('invalidSelectionForTrace', selectedElements.length);
  }

  // console.log(selectedElements);
});

function byName(obj) {
    return obj.visitor.name.toUpperCase();
}

function byDate(obj) {
    let date = new Date(obj.entered);
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


$('#editBtn').click( function (event) {
    event.preventDefault();
})


