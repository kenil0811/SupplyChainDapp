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



var request = new XMLHttpRequest();
    request.onreadystatechange = function (){
        if(request.readyState == 4 && request.status == 200) {
        console.log("yey");

        setTimeout(function () {
            xhttp.open("GET", "http://localhost:3000/getPlayers", true);
            xhttp.send();
        }, 2000);
        
    }
    }
function deployContractWithFile() {

    var weeks = document.getElementById("totalWeeks").value;
    var start = document.getElementById("start").value;
    var end = document.getElementById("end").value;
    var dLeadTime = document.getElementById("dLeadTime").value;
    var oLeadTime = document.getElementById("oLeadTime").value;

    var rhCost = document.getElementById("rhCost").value;
    var whCost = document.getElementById("whCost").value;
    var dhCost = document.getElementById("dhCost").value;
    var fhCost = document.getElementById("fhCost").value;

    var rlCost = document.getElementById("rlCost").value;
    var wlCost = document.getElementById("wlCost").value;
    var dlCost = document.getElementById("dlCost").value;
    var flCost = document.getElementById("flCost").value;
    if(weeks != "" && document.getElementById('inputFile').files.length != 0){
        var csv=document.getElementById('inputFile').files[0];
        var formData = new FormData();
        formData.append("uploadCsv",csv);
        formData.append("totalWeeks", weeks);
        formData.append("start", start);
        formData.append("end", end);
        formData.append("dLeadTime", dLeadTime);
        formData.append("oLeadTime", oLeadTime);

        formData.append("rhCost", rhCost);
        formData.append("whCost", whCost);
        formData.append("dhCost", dhCost);
        formData.append("fhCost", fhCost);

        formData.append("rlCost", rlCost);
        formData.append("wlCost", wlCost);
        formData.append("dlCost", dlCost);
        formData.append("flCost", flCost);

        request.open("POST","http://localhost:3000/deployGameWithFile", true);
        request.send(formData);
    }
}