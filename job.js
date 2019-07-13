const express = require("express");
const path = require("path");
const url = require("url");
const fs = require("fs");
const {
    Pool
} = require("pg");
const PORT = process.env.PORT || 8100;
const app = express();
'use strict';
const request = require('request');
var stream;
const connnectionString = process.env.DATABASE_URL || "postgres://stockdev:stockdev@localhost:5432/stockmanger";
const pool = new Pool({
    connectionString: connnectionString
});

function connect(search) {
    const TOKEN = 'sk_b5530272bb59484ca109ca4c5e819852';
    stream = request({
        url: 'https://cloud.iexapis.com/v1/stock/' + search + '/quote?token=' + TOKEN,
        //url: 'https://cloud.iexapis.com/v1/tops?token='+TOKEN+'&symbols='+ search,
        headers: {
            'Content-Type': 'text/event-stream'
        }
    })
}




function wait() {
    setTimeout(wait, 1000);
};


function work(req, res, callBack, stock, lastStock) {
    //console.log("query " + isquery);
    var search;
    console.log(callBack);
    if (callBack == getFile) {
        search = req.query.search;
    } else {
        search = stock;
    }
    console.log("gettting val " + search);
    connect(search);
    if (typeof stream.symbol == "undefined") {
        //res.render("pages/errSymbol", { "err": search });
        //return;
    }
    stream.on('socket', () => {
        console.log("Connected");
    });

    stream.on('end', () => {
        console.log("Reconnecting");
        connect();
    });

    stream.on('complete', () => {
        console.log("Reconnecting");
        connect();
    });

    stream.on('error', (err) => {
        console.log("Error", err);
        connect();
    });

    stream.on('data', (response) => {
        var str = response.toString();
        if (str == "Not Found" || str == "Unknown symbol") {
            console.log("reporting " + response.toString());
            //response.return;
            //connect();
            return;
        }

        var obj = JSON.parse(str.replace('data:', ''));
        //console.log("watching " + obj.latestPrice);
        //console.log(obj);

        //console.log("succuss " + obj);

        var sData = "<tr><td>what is goingon</td></tr>";
        //console.log(obj);
        /*
        fs.readFile("sResults.txt", "html", (err, data) => {
            if (err) console.log(err);
            sData = sData + data;
        });
        fs.writeFile("sResults.txt", sData, (err) => {
            if (err) console.log(err);
            console.log("Successfully Written to File.");
        });
        
        */
        if (callBack == getFile) {
           
            callBack(res, obj);
        } else {
            const button = '<input type="button" class="' + obj.symbol + '" value="Invest" onclick="investStock(this)">';
            sData = '<tr><td class="' + obj.symbol + '">' + obj.symbol + '</td><td class="' + obj.symbol + '">' + obj.latestPrice + '</td><td class="' + obj.symbol + '">' + ((obj.latestVolume / 1000000).toFixed(2)) + '</td><td><input name="' + obj.symbol + '" type="decimal"></td><td>' + button + "</td></tr>";
            fs.appendFile('trackStocks.txt', sData, function (err) {
                if (err) {
                    console.log("writing file error");
                    console.log(err);
                }
                console.log('trackStocks Saved!' + sData);
                wait();
                if (lastStock) {
                    console.log("last STock");
                    displayStocks(res);
                }
            });
        }


    });
    wait();

}

function writeTable(obj) {
    var hTable = "<table><tr><th>symbol</th><th>price</th><th>volume</th></tr>";
    var fTable = "</table>";
    var sData = "<\ tr \><\ td \>" + obj.symbol + "<\ /td \><td>" + obj.latestPrice + "</td><td>" + obj.latestVolume + "</td></tr>";
    console.log(hTable + sData + fTable);
}

function updateSearch(req, res) {
    // var hTable = "<table><tr><th>symbol</th><th>price</th><th>volume</th><th>Track Stock</th></tr>";
    // var fTable = "</table>";
    // var sData;
    work(req, res, getFile);
}

function updateStocks(req, res) {
    console.log('server says');
    //console.log({'symbol':req.query.symbol, 'numStocks':req.query.numStocks, 'amount': req.query.amount});
    var params = [1, req.query.symbol, req.query.numStocks, req.query.amount];
     insertIntoTable('stocks', params, function(req, res){
         res.render("pages/sDisplay", {'row':'we have inserted well'} );
     });
}

function getStocks(req, res, array) {

    for (let i = 0; i < array.length; i++) {
        console.log("***** " + array[i].symbol);
        if (i == array.length - 1) {
            work(req, res, displayStocks, array[i].symbol, true);
        } else {
            work(req, res, displayStocks, array[i].symbol, false);
        }
    }
}

function displayStocks(res) {
    var hTable = "<table><tr><th>symbol</th><th>price</th><th>volume</th><th>Amount</th><th>Action</th></tr>";
    var fTable = "</table>";
    fs.readFile("trackStocks.txt", "utf-8", (err, data) => {
        if (err) console.log(err);
        console.log("reading file  ");
        console.log(data);
        res.render("pages/sDisplay", function () {
            res.send(hTable + data + fTable);
        });
    });
}

function getFile(res, obj) {
    console.log('got obj ');
    console.log(obj);
  res.render("pages/sDisplay", {'row':JSON.stringify(obj)});
}

function addToDB(req, res) {
    var symbol = req.params.stock;
    console.log("we are looking up :symbol", symbol);
    /*
    insertIntoTable("stocks", symbol, function (error, result) {
        if (error) console.log(error);
        console.log("the results are in :result", result);
    });
    */
    getAllFromTable("stocks", "symbol", function (error, results) {
        if (error || results == null) console.log(error);
        console.log("this is what we got :result", results.length);

        addAllSymbols(results, function (results) {
            console.log("stooping all stuff");

            console.log("looking for all symbols");
            console.log(results);
            writeTable(results);
        });
        //res.render("pages/results", { "result": results[0] });
    });



}

function addAllSymbols(array, callBack) {
    var allSymbols = [];
    let i = 0;
    while (i < array.length - 1) {
        allSymbols.push(work(null, null, true, array[i].symbol));
        i = i + 1;
        console.log(allSymbols);
        isdone = true;
    }
    callBack(allSymbols);
}

function insertIntoTable(table, params, callBack) {
    console.log("inserting")

    var sql = ("INSERT INTO " + table + " (user_id, symbol, numstocks, amount) VALUES ($1::int, $2::text, $3::float, $4::float)")
    
    console.log(sql);
    pool.query(sql, params, function (error, result) {
        if (error) console.log(error);

        console.log("found DB " + JSON.stringify(result.rows))
        callBack();
    });
}

function getAllFromTable(table, column, callBack) {
    console.log("geting")

    var sql = ("SELECT symbol FROM " + table + " WHERE user_id = $1::int")
    var params = [1]
    console.log(sql);
    pool.query(sql, params, function (error, result) {
        if (error) console.log(error);

        console.log("found DB " + JSON.stringify(result.rows))

        callBack(null, result.rows);
    });
}

function readAllFromTable(req, res){
    const table = req.query.table
    getAllFromTable(table,'symbol', function(result){
        res.render('pages/sDisplay', {'row': result});
    });
}
function insert(req, res){
    //readAllFromTable(req,res);
    console.log("inserting")

    var sql = ("INSERT INTO stockstracked (user_id, symbol) VALUES ($1::int, $2::text)")
    params = [1, req.query.stock];
    console.log(sql);
    pool.query(sql, params, function (error, result) {
        if (error) console.log(error);

        console.log("found DB " + JSON.stringify(result.rows))
        res.render("pages/sDisplay", {'row':'we have inserted well'} );
        //callBack();
    });
}

function getAllTrackStocks(req, res){
    getAllFromTable('stockstracked', 'symbol', function(err, results){
        console.log('all stocks ');
        console.log(JSON.stringify(results));
        res.render('pages/sDisplay', {'row':JSON.stringify(results)});
    });
}

function addinvestment(req, res){
    var params = [1, req.query.symbol, req.query.numStocks, req.query.amount];
  
    console.log("geting")

    var sql = ("SELECT symbol, numstocks, amount FROM stocksinvested WHERE user_id = $1::int")
    var params = [1]
    console.log(sql);
    pool.query(sql, params, function (error, result) {
        console.log('stop here')
        //console.log(result);
        if (error) {
            console.log(error);
            res.render("pages/sDisplay", JSON.stringify({'row':error}) );
        }
        else if(result.rowCount == 0){
            console.log('why not working')
            res.render("pages/sDisplay", {'row':'empty'});

        }
        else{
            console.log("found DB " + JSON.stringify(result.rows))
            res.render("pages/sDisplay", JSON.stringify(result.row) );
        }
    });

    // insertIntoTable('stocksinvested', params, function(err){

    // })
}

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(express.static("stylesheets"));
app.get('/', (req, res) => res.render("html/stock"))
app.get('/errSymbol', (req, res) => res.render("pages/errSymbol"))
app.get('/search', updateSearch)
app.get('/update', updateStocks)
app.get('/read', readAllFromTable)
app.get('/insert', insert)
app.get('/addinvest', addinvestment)
app.get('/allstocks', getAllTrackStocks)

app.listen(PORT, () => console.log(`Listening on ${PORT}`))