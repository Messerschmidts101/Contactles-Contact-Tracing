
let dataArr;
let tableName = 'visit';

ipcRenderer.on('contactTracingData', function (event, datasource) {
    dataArr = treeToArray(datasource);// translate the tree to array
    // build the table
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

function getChildren(node) {// get the children of the node
    return node.children;
}

function hasChildren(node) {// returns true is the node has a children; Otherwise, false
    return true && node.children;
}



function treeToArray (root) {// transform the tree to array using BFS
    let nodes = [];// initialize an array for storage of nodes to return

    if(root) {// if there is an element
        let stack = [];// initialize a stack for the traversal
        
        stack.push(root);// push the initial node

        while(stack.length != 0) {// while there is a node in the stack
            let node = stack.pop();// get the node from the top of the stack

            nodes.push(node);// push the visited node to the array;

            if(hasChildren(node)){// if the node has children
                let children = getChildren(node);// get the children of the node

                for(let i = children.length - 1; i >= 0; --i) {// push all the children of the current node to the stack
                    stack.push(children[i]);
                }
            }
            
        }
    }
    return nodes;
}// end of build table;



$('#printTblBtn').click(function (event) {
    event.preventDefault();
    ipcRenderer.send('reqPrintContactTracingTable');
})

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


$('#searchInput').keyup( function () {
    let input = $('input#searchInput').val();
    
    $(`tbody tr:not(:contains('${input}'))`).hide();
    $(`tbody tr:contains('${input}')`).show();
});


function displayHeaders(tableName, headers) {
    let addHeaders = `<tr><th scope="col">#</th></tr>`;
    $('thead').append(addHeaders);

    for(let i = 0; i < headers.length; ++i){// setup the header for the table
        let addHeaders = `<th>${headers[i]}</th>`;
        $(`#${tableName}TBL thead th:last-child`).after(addHeaders);
    }
}

function displayTable(tableName, dataArr) {
    // add headers for the table
    let headers = ['covidStatus', '_id', 'establishment', 'visitor', 'entered', 'exited'];
    displayHeaders(tableName, headers);

    let counter = 1;
    for (const node of Object.values(dataArr)) { // add rows 
        let id = node._id; // get the id of the object for the id of the row

        let addNewRow = `<tr id=${id}></tr>`// add new row for the current object
        $(`#${tableName}TBL > tbody`).append(addNewRow);

        let addNumberColumn = `<td>${counter++}</td>`
        $(`#${tableName}TBL > tbody tr#${id}`).append(addNumberColumn);

        for(let i = 0; i < headers.length; ++i){// display all the properties of the object to the table
            let addNewColumn;
            if(node[headers[i]]){
                if(headers[i] == 'establishment' || headers[i] == 'visitor'){
                    addNewColumn = `<td>${node[headers[i]].name}</td>`;
                } else if (headers[i] == 'entered' || headers[i] == 'exited') {
                    let date = new Date(node[headers[i]]);
                    let formattedDate = `${date.toDateString()} - ${date.toLocaleTimeString()}`;
                    addNewColumn = `<td>${formattedDate}</td>`;
                } else {
                    addNewColumn = `<td>${node[headers[i]]}</td>`;
                }
            }else {
            addNewColumn = `<td>None</td>`;
            }

            $(`#${tableName}TBL tbody tr#${id}`).append(addNewColumn);
        }
    }
    
    $("input[type='checkbox']").click( function () {
        getChecked();//update the list of checked element whenever the user checks a checkbox
    });
}

