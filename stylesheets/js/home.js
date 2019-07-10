
function apiSearch(symbol, callBack) {
    //var search = document.getElementById("sStocks").value;

    var url = '/search?search=' + symbol;
    console.log('url:  ' + url);
    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            if (callBack == searchStock) {
                callBack(obj);
            } else {
                console.log('look below');
                console.log(this.responseText);
                callBack(obj);
            }
        }
    }
    httpRequest.open("GET", url, true);
    httpRequest.send();
}

function getSearch() {
    var search = document.getElementById("sStocks").value;
    apiSearch(search, searchStock);
}

function getAllStock(stock) {

    var stringObj;
    var obj;
    var table = document.getElementById('iTable').innerHTML;
    var button;
    var symbol_list = "";
    var length;
    var i = 0;
    if(document.getElementById('iTable').children != null){
        symbol_list = document.getElementById('iTable').children;
    }
  
    console.log(symbol_list)
    console.log('look at i ');
    console.log(symbol_list.length);
    if(symbol_list.length == 0){
        length = 0;
        i = -1;
    }else{
        length = symbol_list.length;
        i = -1;
    }
    for (let j = i; j < length; j++) {
        console.log('i: ' + i + " j: " + j);
        if (j == -1) {
            console.log('we made is in the loop');
            // console.log('before');
            // console.log(stock);
            apiSearch(stock, displayTable);
            // console.log('after');
            // obj = stock;
            // button = '<input type="button" name="' + obj.symbol + '" value="Track Stock" onclick="investStock(this)">';
            // table += '<tr class=' + obj.symbol + '"><td name="' + obj.symbol + '">' + obj.symbol + '</td><td name="' + obj.symbol + '">' + obj.latestPrice + '</td><td name="' + obj.symbol + '">' + ((obj.latestVolume / 1000000).toFixed(2)) + "</td><td>" + button + "</td></tr>";
       // next();
        }
        else{
             console.log('we made it in the 2 loop');
            // console.log(symbol_list[j].className);
             apiSearch(symbol_list[j].className, displayTable);
            // obj = stock
            // button = '<input type="button" name="' + obj.symbol + '" value="Track Stock" onclick="investStock(this)">';
            // table += '<tr class=' + obj.symbol + '"><td name="' + obj.symbol + '">' + obj.symbol + '</td><td name="' + obj.symbol + '">' + obj.latestPrice + '</td><td name="' + obj.symbol + '">' + ((obj.latestVolume / 1000000).toFixed(2)) + "</td><td>" + button + "</td></tr>";
        }
        //runInNewContext();
    }
    console.log("**table ** " + table);
    document.getElementById("iTable").innerHTML = table;
}

function searchStock(obj) {
    var hTable = '<table><tr><th>symbol</th><th>price</th><th>volume</th><th>Action</th></tr>';
    var table = "";
    var fTable = '</table>';
    var button = '<input type="button" name="' + obj.symbol + '" value="Track Stock" onclick="trackStock(this)">';
    table = '<tr class=' + obj.symbol + '"><td name="' + obj.symbol + '">' + obj.symbol + '</td><td name="' + obj.symbol + '">' + obj.latestPrice + '</td><td name="' + obj.symbol + '">' + ((obj.latestVolume / 1000000).toFixed(2)) + "</td><td>" + button + "</td></tr>";
    document.getElementById("sTable").innerHTML = hTable + table + fTable;
}

function displayTable(obj) {

    var hTable = '<table><tr><th>symbol</th><th>price</th><th>volume</th><th>Action</th></tr>';
    var table = document.getElementById('iTable').innerHTML;
    var fTable = '</table>';
    button = '<input type="button" name="' + obj.symbol + '" value="Track Stock" onclick="investStock(this)">';
    table += '<tr class=' + obj.symbol + '"><td name="' + obj.symbol + '">' + obj.symbol + '</td><td name="' + obj.symbol + '">' + obj.latestPrice + '</td><td name="' + obj.symbol + '">' + ((obj.latestVolume / 1000000).toFixed(2)) + '</td><td><input type="decimal" name="'+obj.symbol+'"></td><td>' + button + "</td></tr>";

    document.getElementById("iTable").innerHTML = table;
}

function updateStocks(newStock) {
    var url = '/update?newStock=' + newStock;
    console.log('searching:  ' + newStock);
    console.log('url:  ' + url);
    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
            document.getElementById("iTable").innerHTML = this.responseText;

        }
    }
    httpRequest.open("GET", url, true);
    httpRequest.send();
}

function trackStock(button) {
    var id = button.getAttribute("name");
    var row = document.getElementsByName(id);
    var stock = row[0].innerHTML;
    console.log(row[0].innerHTML);
    console.log(row[1].innerHTML);
    getAllStock(stock);
}

function investStock(button) {
    var id = button.getAttribute("class");
    var row = document.getElementsByClassName(id);
    console.log(row[0].innerHTML);
    console.log(row[1].innerHTML);

}