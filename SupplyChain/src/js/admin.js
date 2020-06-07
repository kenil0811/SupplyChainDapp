var xhttp = new XMLHttpRequest();
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
        document.getElementById("retailer").innerHTML = "Retailer:\n 		Address: " + retailer.address + "\n 		Password: " + retailer.password;
        document.getElementById("wholesaler").innerHTML =  "\nWholesaler:\n 		Address: " + wholesaler.address + "\n 		Password: " + wholesaler.password;
        document.getElementById("distributer").innerHTML =  "\nDistributer:\n 		Address: " + distributer.address + "\n 		Password: " + distributer.password;
        document.getElementById("factory").innerHTML =  "\nFactory:\n 		Address: " + factory.address + "\n 		Password: " + factory.password;



    }
    else {
    	console.log("Error!!!!!!!1");
        console.log(xhttp.status);
    	document.getElementById("players").innerHTML = "Error!!!!!" + xhttp.status;
    }
}


function deployContract() {
	xhttp.open("GET", "http://localhost:5000/deployGame", true);
	xhttp.send();
}
