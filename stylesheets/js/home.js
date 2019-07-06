function apiSearch() {
    var search = document.getElementById("sStocks").value;

    var url = '/search?search=' + search;
    console.log('searching:  ' + search);
    console.log('url:  ' + url);
    var httpRequest = new XMLHttpRequest();
  
    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
            document.getElementById("sTable").innerHTML = this.responseText;

<<<<<<< HEAD
        }
    }
    httpRequest.open("GET", url, true);
    httpRequest.send();
}

function updateStocks(newStock){
    var url = '/update/' + newStock;
    console.log('searching:  ' + newStock);
    console.log('url:  ' + url);
    var httpRequest = new XMLHttpRequest();
  
    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
            document.getElementById("iTable").innerHTML = this.responseText;

=======
>>>>>>> f5c00ae815b2b6ff3a26de89b981b6ebfe6abea8
        }
    }
    httpRequest.open("GET", url, true);
    httpRequest.send();
}

function trackStock(button){
    var id = button.getAttribute("name");
    var row = document.getElementsByName(id);
    var stock = row[0].innerHTML;
    console.log(row[0].innerHTML);
    console.log(row[1].innerHTML);
    updateStocks(stock);
}

function investStock(button){
    var id = button.getAttribute("class");
    var row = document.getElementsByClassName(id);
    console.log(row[0].innerHTML);
    console.log(row[1].innerHTML);

}