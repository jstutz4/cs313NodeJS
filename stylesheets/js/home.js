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

        }
    }
    httpRequest.open("GET", url, true);
    httpRequest.send();
}