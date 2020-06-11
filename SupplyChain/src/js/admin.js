var url = "http://localhost:3000/deployGame";   
var request = new XMLHttpRequest();
    request.onreadystatechange = function (){
        if (request.status == 200  && request.readyState == 4) {
        console .log(request.response);
        var data = JSON.parse(request.responseText);
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
    else if(request.status==0) {
        document.getElementById("players").innerHTML = "Please Wait ....";
    }
    else {
        console.log("Error!!!!!!!1");
        console.log(request.status);
        document.getElementById("players").innerHTML = "Error!!!";
    }
    }
function deployContractWithFile() {

    var weeks = document.getElementById("totalWeeks").value;
    var start = document.getElementById("start").value;
    var end = document.getElementById("end").value;
    var dLeadTime = document.getElementById("dLeadTime").value;
    var oLeadTime = document.getElementById("oLeadTime").value;
    var initialInv = document.getElementById("initialInv").value;

    var rhCost = document.getElementById("rhCost").value;
    var whCost = document.getElementById("whCost").value;
    var dhCost = document.getElementById("dhCost").value;
    var fhCost = document.getElementById("fhCost").value;

    var rbCost = document.getElementById("rbCost").value;
    var wbCost = document.getElementById("wbCost").value;
    var dbCost = document.getElementById("dbCost").value;
    var fbCost = document.getElementById("fbCost").value;
    var distributionName = document.getElementById("distribution");
    var distribution = distributionName.options[distributionName.selectedIndex].text;
    var stdDev = document.getElementById("stdDev").value;
    var mean = document.getElementById("mean").value;

    if(weeks != "" ){
        var csv=document.getElementById('inputFile').files[0];
        var formData = new FormData();
        formData.append("uploadCsv",csv);
        formData.append("totalWeeks", weeks);
        formData.append("start", start);
        formData.append("end", end);
        formData.append("dLeadTime", dLeadTime);
        formData.append("oLeadTime", oLeadTime);
        formData.append("initialInv", initialInv);

        formData.append("rhCost", rhCost);
        formData.append("whCost", whCost);
        formData.append("dhCost", dhCost);
        formData.append("fhCost", fhCost);

        formData.append("rbCost", rlCost);
        formData.append("wbCost", wlCost);
        formData.append("dbCost", dlCost);
        formData.append("fbCost", flCost);

        formData.append("mean", mean);
        formData.append("stdDev", stdDev);
        formData.append("distribution", distribution);



        request.open("POST","http://localhost:3000/deployGameWithFile", true);
        request.send(formData);
    }
}