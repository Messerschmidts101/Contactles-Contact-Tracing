/*
  This file contains all the javascript codes for the tree page
*/


let root;
let previouslySelected;
let data;

ipcRenderer.on('createTree', function (event, obj) {
    console.log('im invoked');
    root = obj;
    
    displayTree(root, 1);
    console.log('finished hehehe');
});// end of on() method


async function displayTree(obj, level){
    let datasource = await getData(obj, level);
    // render the tree
    createTree(datasource);

    // add handlers for the click function of nodes
    $('#chart-container').find('.node').on('click', function () {
        alert(JSON.stringify($(this).data('nodeData')));
        // console.log($(this).data('nodeData'));
    });

    

}// end of display tree



$('#levelInputForm').submit( function (event) {
    event.preventDefault();
    let level = $('#levelInput').val();
    if(level < 1 || level >5){
        // alert("invalid input")
        ipcRenderer.send('invalidLevelInput', level);
        return;
    }
    displayTree(root, level);
});// end of level input submit() method


$('#searchInputForm').submit( function (event) {
    event.preventDefault();
    let name = $('#searchInput').val();

    let found = searchName(name);

    if(found){
        $(found).css('background', 'blue');
    } else {
        // alert('Name does not exist!');
        // console.log('does not exist');
    }
});// end of search submit() method





$('#searchInput').keyup( async function () {// select the element on keyup
  // alert('hey');
    let name = $('#searchInput').val();
    console.log(name);

    let selected = searchName(name);

    if(selected && selected.length != 0){
        $(getNode(selected)).css('background', 'blue');
        previouslySelected = selected;
    } else {
        // alert('Name does not exist!');
        $(getNode(previouslySelected)).css('background', '');
    }
});//end of keyup() method



async function getData (obj, level) {
    // console.log(obj);
    let datasource = await ipcRenderer.invoke('treePage:getData', obj, level);
    // console.log('result: ',datasource);
    data = datasource;
    datasource = JSON.parse(datasource);
    console.log(datasource);
    return datasource;
}// end of getData()

function createTree(datasource) {
    $('#chart-container').empty();// clear the div element
    $('#chart-container').orgchart({
        'data' : datasource,
        'nodeContent': 'title',
        'exportButton': true,
        'exportFilename': 'MyOrgChart'
    });

}// end of createTree()



function getChildren(element) {
    return $(element).children('ul').children('li').toArray();
}// end of getChildren()


function getName(element) {
    return $(element).children('div').children('div.title').text();
}// end of getName();

function getNode(element) {
    // console.log($(element).children('div').toArray());
    return $(element).children('div').toArray();
}// end of getNode()


function getRoot() {
    var $chart = $(".orgchart");
    return $chart.children().children()[0];
}// end of getRoot()

function searchName(name) {
    let root = getRoot();// get the root of the tree

    if(name != null && name != '') {
        let queue = [];
        queue.unshift(root);// add the root of the tree to the queue

        while(queue.length != 0) {// execute while there is a node in the queue
            let node = queue.shift()// get the node from the front of the queue

            if(getName(node).toUpperCase() == name.toUpperCase()){// check if that current node is the one that is to be found
                // alert('ye');
                return node;
            }

            let children = getChildren(node);// get the children of the current node

            for(let i = 0; i < children.length; ++i) {// push all the children to the queue
                queue.push(children[i]);
            }
        }
    }
    return [];// return an empty array if found nothing

}// end of searchName()

$('button#tableBtn').click( function () {// setup the click event handler for tree table request

  ipcRenderer.send('reqTreeTable', data);
});

