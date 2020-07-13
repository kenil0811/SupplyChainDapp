$(document).ready(function(){

var url = "http://localhost:3000/deployGame";   
var request = new XMLHttpRequest();
    request.onreadystatechange = function (){
        if (request.status == 200  && request.readyState == 4) {
        var data = JSON.parse(request.responseText);
        console.log(data);
        console.log(request.responseText);
        console.log(data.contractAddress);

        $.ajax({
            url: '/api/configureEthereum:getIP',
            type: 'POST',
            contentType: 'application/json'
        }).done(function(resp) {

            $.ajax({
                url: 'http://' + resp.ip1 + ':3000/api/setContractAddress', 
                type: 'POST', 
                contentType: 'application/json',
                data: JSON.stringify({"contractAddress": data.contractAddress.address})
            }).done(function(resp1){
            // $.ajax({
            //     url: 'http://' + resp.ip2 + ':3000/api/setContractAddress', 
            //     type: 'POST', 
            //     contentType: 'application/json',
            //     data: JSON.stringify({"contractAddress": data.contractAddress.address})
            // }).done(function(resp2){
            // $.ajax({
            //     url: 'http://' + resp.ip3 + ':3000/api/setContractAddress', 
            //     type: 'POST', 
            //     contentType: 'application/json',
            //     data: JSON.stringify({"contractAddress": data.contractAddress.address})
            // }).done(function(resp3){
            // $.ajax({
            //     url: 'http://' + resp.ip4 + ':3000/api/setContractAddress', 
            //     type: 'POST', 
            //     contentType: 'application/json',
            //     data: JSON.stringify({"contractAddress": data.contractAddress.address})
            // }).done(function(resp4){
                if(resp1.status=="error" /*|| resp2.status=="error" || resp3.status=="error" || resp4.status=="error" */)
                    document.getElementById("players").innerHTML = "Error in setting contract address on player's systems";
                else
                    document.getElementById("players").innerHTML = "Contract successfully deployed!!!";
            })
            // })
            // })
            // })
        })

        
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

$("#deployContract").on('click', function(e){
        e.preventDefault();

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

    var rlCost = document.getElementById("rlCost").value;
    var wlCost = document.getElementById("wlCost").value;
    var dlCost = document.getElementById("dlCost").value;
    var flCost = document.getElementById("flCost").value;
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

        formData.append("rlCost", rlCost);
        formData.append("wlCost", wlCost);
        formData.append("dlCost", dlCost);
        formData.append("flCost", flCost);

        formData.append("mean", mean);
        formData.append("stdDev", stdDev);
        formData.append("distribution", distribution);

        $.ajax({
            url: '/api/getAddresses', 
            type: 'GET', 
            contentType: 'application/json'
        }).done(function(resp){
            console.log(resp);
            formData.append("coinbase", resp.addrs.coinbase);
            formData.append("addr1", resp.addrs.addr1);
            formData.append("addr2", "0xF94DAdBCA5220f889f1CDb7b82285eA992893730");
            formData.append("addr3", "0xFd38D67c35cb1A662CbA4F718336815067d9A5A1");
            formData.append("addr4", "0x6D8591C2592b306cf6d792c6CB96CC093ffcF4F6");

            request.open("POST","http://localhost:3000/deployGameWithFile", true);
            request.send(formData);
        });

        
    }
});
});