const express = require("express");
const path = require("path");
const url = require("url");
const fs = require("fs");
const { Pool } = require("pg");
const PORT = process.env.PORT || 8100;
const app = express();
'use strict';
const request = require('request');
var stream;
const connnectionString = "postgres://stockdev:stockdev@localhost:5432/stockmanger";
const pool = new Pool({ connectionString: connnectionString });

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


function work(req, res, callBack) {
    //console.log("query " + isquery);
    var search;
    if (false) {
        search = symbol;
    } else {
        search = req.query.search;
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
        const button = '<input type="button" name="' + obj.symbol + '" value="Track Stock">';
        sData = "<tr><td>" + obj.symbol + "</td><td>" + obj.latestPrice + "</td><td>" + ((obj.latestVolume / 1000000).toFixed(2)) + "</td><td>"+button+"</td></tr>";
        fs.appendFile('sResults.txt', sData, function (err) {
            if (err) { console.log("writing file error"); console.log(err); }
            console.log('Saved!');
            callBack(res);
        });

    });
    wait();

}

function writeTable(obj) {
    var hTable = "<table><tr><th>symbol</th><th>price</th><th>volume</th></tr>";
    var fTable = "</table>";
    var sData = "<\ tr \><\ td \>" + obj.symbol + "<\ /td \><td>" + obj.latestPrice+"</td><td>"+obj.latestVolume+"</td></tr>";
    console.log(hTable + sData + fTable);
}

function updateSearch(req, res) {
    var hTable = "<table><tr><th>symbol</th><th>price</th><th>volume</th><th>Track Stock</th></tr>";
    var fTable = "</table>";
    var sData;
    work(req, res, getFile);
}

function getFile(res) {
    var hTable = "<table><tr><th>symbol</th><th>price</th><th>volume</th><th>Track Stock</th></tr>";
    var fTable = "</table>";
    fs.readFile("sResults.txt", "utf-8", (err, data) => {
        if (err) console.log(err);
        console.log("reading file  ");
        console.log(data);
        res.render("pages/sDisplay", function () {
            res.send(hTable + data + fTable);
        });
    });
    
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
function insertIntoTable(table, symbol, callBack) {
    console.log("inserting")

    var sql = ("INSERT INTO " + table + " (user_id, symbol) VALUES ($1::int, $2::text)")
    var params = [1, symbol]
    console.log(sql);
    pool.query(sql, params, function (error, result) {
        if (error) console.log(error);

        console.log("found DB " + JSON.stringify(result.rows))
        callBack(null, result.rows);
    });
}
function getAllFromTable(table, column, callBack) {
    console.log("geting")

    var sql = ("SELECT symbol FROM "+ table +" WHERE user_id = $1::int")
    var params = [1]
    console.log(sql);
    pool.query(sql, params, function (error, result) {
        if (error) console.log(error);

        console.log("found DB " + JSON.stringify(result.rows))
        
        callBack(null, result.rows);
    });
}
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(express.static("stylesheets"));
app.get('/', (req, res) => res.render("pages/jobs"))
app.get('/errSymbol', (req, res) => res.render("pages/errSymbol"))

app.get('/search', updateSearch)
//app.get('/add/:stock', updateLife)

app.listen(PORT, () => console.log(`Listening on ${PORT}`))