var stop = false;
var stop2 = false;
function apiSearch(symbol, callBack, investing) {
    //var search = document.getElementById("sStocks").value;

    var url = '/search?search=' + symbol;
    console.log('url:  ' + url);
    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            //console.log(investing);
            console.log(typeof(investing));

           if(typeof(investing) === "undefined"){
            console.log('running well');
            callBack(obj);
           }
           else{
            console.log('investing running')
            callBack(obj.latestPrice, investing);
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
    var table = document.getElementById('tTable').innerHTML;
    var button;
    var symbol_list = "";
    var length;
    var i = 0;
   
    if(document.getElementById('tTable').children != null){
        symbol_list = document.getElementById('tTable').children;
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
    document.getElementById("tTable").innerHTML = table;
}

function searchStock(obj) {
    var hTable = '<table><tr><th>symbol</th><th>price</th><th>volume (M)</th><th>High</th><th>Low</th><th>Change (%)</th><th>Action</th></tr>';
    var table = "";
    var fTable = '</table>';
    var button = '<input type="button" name="' + obj.symbol + '" value="Track Stock" onclick="trackStock(this)">';
    table = '<tr class=' + obj.symbol + '"><td name="' + obj.symbol + '">' + obj.symbol + '</td><td name="' + obj.symbol + '">$ ' + obj.latestPrice + '</td><td name="' + obj.symbol + '">' + ((obj.avgTotalVolume / 1000000).toFixed(2)) + '</td><td>$ '+ obj.high+'</td><td>$ '+obj.low+'</td><td>'+(obj.changePercent*100).toFixed(3)+' %</td><td>' + button + "</td></tr>";
    document.getElementById("sTable").innerHTML = hTable + table + fTable;
}

function displayTable(obj) {

    var hTable = '';
    var table = document.getElementById('tTable').innerHTML;
    console.log(table);
    var fTable = '</table>';
    var remove = '<input type="button" value="delete stock" class="'+obj.symbol+'" onclick="removeStock(this)">';

    button = '<input type="button" name="' + obj.symbol + '" value="Invest Stock" onclick="investStock(this)">';
    table += '<tr class=' + obj.symbol + '"><td name="' + obj.symbol + '">' + obj.symbol + '</td><td name="' + obj.symbol + '">$' + obj.latestPrice + '</td><td name="' + obj.symbol + '">' + ((obj.avgTotalVolume / 1000000).toFixed(2)) + '</td><td>$'+ obj.high+'</td><td>$'+obj.low+'</td><td>'+(obj.changePercent*100).toFixed(3)+'%</td><td><input id="price'+obj.symbol+ '" placeholder="$100" type="decimal" name="'+obj.symbol+'"></td><td>' + button + "</td><td>"+remove+"</td></tr>";

    document.getElementById("tTable").innerHTML = table;
}

function updateStocks(newStock) {
    var url = '/update?newStock=' + newStock;
    console.log('searching:  ' + newStock);
    console.log('url:  ' + url);
    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
            document.getElementById("tTable").innerHTML = this.responseText;

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
    var url = '/insert?stock=' + stock;
    var httpRequest = new XMLHttpRequest();
    //inserting into the db
    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("we insertStock")
            console.log(this.responseText)
            
           

        }
    }
    httpRequest.open("GET", url, true);
    httpRequest.send();
    getAllStock(stock);
}

function investStock(button) {
    var id = button.getAttribute("name");
    var row = document.getElementById('price'+id);
    apiSearch(id, getInvest);
}

function getInvest(obj){
    var amount = document.getElementById("price"+obj.symbol).value;
    var numStocks = (amount/obj.latestPrice.toFixed(2)).toFixed(3);
    var symbol = obj.symbol;
    var duplicate = false;
    //get information
    // re-calulate information
    // insert it into the db
    var url = '/addinvest?symbol=' + symbol + '&numstocks=' + numStocks + '&amount=' + amount;
    console.log('url:  ' + url);
    var httpRequest = new XMLHttpRequest();
    
    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var obj2 = JSON.parse(this.responseText);
            sell = '<input type="button" value="Sell Stock" class="'+symbol+'" onclick="sellInvest(this)">';
            //then display table
            
            //insertStock({'symbol': symbol, 'numStocks':numStocks, 'amount':amount});
            var table = document.getElementById('iTable').innerHTML;
            var rows = document.getElementById('iTable').children;
            console.log(rows);
            if(rows.length > 0){
                for(let i = 0; i < rows.length; i++){
                    if(rows[i].className == symbol){
                        console.log('duplicate addition')
                        let tempNumStock = obj2.numstocks.toFixed(2);
                        let tempPrice = obj.latestPrice.toFixed(2);
                        tempNumStock
                        document.getElementById('ns' + symbol).innerHTML = obj2.numstocks;
                        document.getElementById('a'+ symbol).innerHTML = obj2.amount;
                        document.getElementById('dollar'+ symbol).innerHTML = '$'+((tempNumStock*tempPrice)-obj2.amount).toFixed(2);
                        console.log('list info ');
                        console.log(tempNumStock,obj2.amount, tempPrice);
                        document.getElementById('pre'+ symbol).innerHTML = ((((Number(tempNumStock)*Number(tempPrice))/Number(obj2.amount))-1)*100).toFixed(2) + '%';
                        duplicate = true;
                    }
                }
            }
            if(!duplicate){
                table += '<tr class="'+symbol +'" ><td>'+symbol+'</td><td id="ns'+symbol+'">'+numStocks+'</td><td id="a'+symbol + '">'+amount+'</td><td id="dollar'+symbol+'">$'+0.00+'</td><td id="pre'+symbol+'">0.00%</td><td>'+sell+'</td></tr>';
                console.log(numStocks);
                console.log(obj.latestPrice);
                console.log(amount);
                document.getElementById('iTable').innerHTML = table;
            }
        }
    }
    httpRequest.open("GET", url, true);
    httpRequest.send();

    
}


function insertStock(params){
    console.log("listing info to insert into db");
    console.log(params.symbol);
    console.log(params.numStocks);
    console.log(params.amount);
    var url = '/update?amount=' + params.amount + '&numStocks=' + params.numStocks +'&symbol=' + params.symbol;

    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function () {
        var row = JSON.parse(this.responseText);
        displayInvest(obj);
    }
    httpRequest.open("GET", url, true);
    httpRequest.send();
}

function displayInvest(obj){
    var data = document.getElementById('iTable').innerHTML;
    console.log('out put from the db');
    console.log(obj.symbol);
    console.log(obj.numStocks);
    console.log(obj.amount);
}

function getStocksTracked(callBack){
    //read from the data base
    var url = '/allstocks'
    //stop = false;
    
        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function () {
           console.log('stop = ', stop);
            if(!stop){
                console.log(this.responseText);
                var row = JSON.parse(this.responseText);
                console.log(row);
                console.log('db has stocks ');
                for(let i = 0; i < row.length; i++){
                    apiSearch(row[i].symbol, displayTable);
                    stop = true;
                }
                stop = true;
                callBack();
            }

            // row.forEach(element => {
            //     console.log(element.symbol);
            //     apiSearch(element.symbol, displayTable);
            // });
        }
        httpRequest.open("GET", url, true);
        httpRequest.send();
            //call back to new function
                //call apiseach with display
}

function getStocksTracked2(){
    //read from the data base
    var url = '/allstocks'
    //stop = false;
    
        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function () {
           console.log('stop = ', stop);
            if(!stop){
                stop = true;
                console.log(this.responseText);
                var row = JSON.parse(this.responseText);
                console.log(row);
                console.log('db has stocks ');
                 document.getElementById('tTable').innerHTML = "";
                console.log('row ' + row.length);
                for(let i = 0; i < row.length; i++){
                    apiSearch(row[i].symbol, displayTable);
                    stop = true;
                }
            }

            // row.forEach(element => {
            //     console.log(element.symbol);
            //     apiSearch(element.symbol, displayTable);
            // });
        }
        httpRequest.open("GET", url, true);
        httpRequest.send();
            //call back to new function
                //call apiseach with display
}

// function insertInvest(symbol, numstocks, amount){
//     var url = '/allstocks'
    
//         var httpRequest = new XMLHttpRequest();

//         httpRequest.onreadystatechange = function () {
//             console.log(this.responseText);
//             var row = JSON.parse(this.responseText);
//             console.log(row);
//             console.log('db has stocks ');
//             if(!stop){
//                 for(let i = 0; i < row.length; i++){
//                     apiSearch(row[i].symbol, displayTable);
//                     stop = true;
//                 }
//             }

//             // row.forEach(element => {
//             //     console.log(element.symbol);
//             //     apiSearch(element.symbol, displayTable);
//             // });
//         }
//         httpRequest.open("GET", url, true);
//         httpRequest.send();
// }

function getStocksInvested(){
    //read from the data base
    stop2=false;
    var url = '/allinvestments'
    var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function () {
            console.log(this.responseText);
            var row = JSON.parse(this.responseText);
            console.log(row.length);
            console.log("\nstarting reload investments\n" + stop2)
            console.log(row);
            if(!stop2){
            for(let i = 0; i < row.length; i++){
                apiSearch(row[i].symbol,getAllInvestCallback,row[i])
            }
            stop2 = true;
        }

            
        }
        httpRequest.open("GET", url, true);
        httpRequest.send();
            //call back to new function
                //call apiseach with display
}
function getAllInvestCallback(price, row){
    var table;
    var sell;
    console.log("we are in the invest call back");
    // if(!stop2){
    // console.log("we are loopuing in calback");

         table = document.getElementById('iTable').innerHTML;
            //console.log(table);
            //for(let i = 0; i < row.length; i++){
            sell = '<input type="button" value="Sell Stock" class="'+row.symbol+'" onclick="sellInvest(this)">';
            table += '<tr class="'+row.symbol +'" ><td>'+row.symbol+'</td><td id="ns'+row.symbol+'">'+row.numstocks+'</td><td id="a'+row.symbol + '">'+row.amount+'</td></tr>';
            //<td id="dollar'+row.symbol+'">$'+(row.numstocks*price)-row.amount+'</td><td id="pre'+row.symbol+'">0.00%</td><td>'+sell+'</td></tr>';
            //table += '<tr class="'+symbol +'" ><td>'+symbol+'</td><td id="ns'+symbol+'">'+numStocks+'</td><td id="a'+symbol + '">'+amount+'</td><td id="dollar'+symbol+'">$'+0.00+'</td><td id="pre'+symbol+'">0.00%</td><td>'+sell+'</td></tr>';
            
            document.getElementById('iTable').innerHTML = table;
    //}
}
function removeStock(button){
    var symbol = button.className;

    var url = '/removestock?symbol=' + symbol;
    var table;
        var httpRequest = new XMLHttpRequest();
        document.getElementById('tTable').innerHTML = "";

        httpRequest.onreadystatechange = function () {
            
            console.log('did it work');
            console.log(this.responseText);
            stop = false;
            console.log(stop);
            if(this.responseText == "we have deleted well"){
                getStocksTracked(null);
            }
            
        }
        httpRequest.open("GET", url, true);
        httpRequest.send();

}

function sellInvest(button){
    var symbol = button.className;
    //stop2 = false;
    document.getElementById('iTable').innerHTML = " ";
    var url = '/removeinvest?symbol=' + symbol;
    var table;
        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function () {
            
            console.log('did it work');
            console.log(this.responseText);
            if(this.responseText == "we have deleted well"){
                getStocksInvested();
            }
            
        }
        httpRequest.open("GET", url, true);
        httpRequest.send();

}

function runtwo(){
    //getStocksInvested();
    getStocksTracked(getStocksInvested);
}
runtwo();