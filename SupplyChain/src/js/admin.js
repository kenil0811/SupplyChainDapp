var xhttp = new XMLHttpRequest();
var url = "http://localhost:3000/deployGame";
console.log(xhttp);

xhttp.onreadystatechange = function() {
    if (xhttp.status == 200  && xhttp.readyState == 4) {
        console .log(xhttp.responseText);
        var data = JSON.parse(xhttp.responseText);
        var retailer = data.retailer;
        var wholesaler = data.wholesaler;
        var distributer = data.distributer;
        var factory = data.factory;
        document.getElementById("players").innerHTML = "Contract successfully deployed!!!";
        document.getElementById("gameID").innerHTML = "Game ID: " + data.GameID;
        document.getElementById("retailer").innerHTML = "Retailer:<br>&emsp;Address: " + retailer.address + "<br>&emsp;Password: " + retailer.password;
        document.getElementById("wholesaler").innerHTML =  "Wholesaler:<br>&emsp;Address: " + wholesaler.address + "<br>&emsp;Password: " + wholesaler.password;
        document.getElementById("distributer").innerHTML =  "Distributer:<br>&emsp;Address: " + distributer.address + "<br>&emsp;Password: " + distributer.password;
        document.getElementById("factory").innerHTML =  "Factory:<br>&emsp;Address: " + factory.address + "<br>&emsp;Password: " + factory.password;



    }
    else {
    	console.log("Error!!!!!!!1");
        console.log(xhttp.status);
    	document.getElementById("players").innerHTML = "Error!!!!!" + xhttp.status;
    }
}


function deployContract() {
    var weeks = document.getElementById("weeks").value;
    if(weeks != ""){
	   xhttp.open("GET", url+"/"+weeks, true);
	   xhttp.send();
    }
}
