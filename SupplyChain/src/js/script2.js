$(document).ready(function(){
	

	$("#createNewAccount").on('submit', function(e){
		e.preventDefault();
		var password = $("#passwordNode1").val();
		if(!password){
			alert("Please provide both the passwords!");
			enableButtons($("#createNewAccount button"));
			return
		}
		disableButtons($("#createNewAccount1 button"),$("#accountAddressNode1"), "Account creation in progress...");
		$.ajax({
		    url: 'api/configureEthereum:account', 
		    type: 'POST', 
		    contentType: 'application/json', 
		    data: JSON.stringify({"password1":password})}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				enableButtons($("#createNewAccount button"));
			}else if(resp.status == "already"){
				alert("An account was already created before!!");
				$("#accountAddressNode1").val(resp.accountAddress1);
			}else if(resp.status == "complete"){
				$("#accountAddressNode1").val(resp.accountAddress1);	
				console.log(resp.accountAddress1);
				var addr = resp.accountAddress1.slice(2);
				console.log(addr);
			}
		});
	});
});

function disableButtons(element, messageElement, message){

	element.prop("disabled", true);
	element.removeClass("btn-dark");
	element.removeClass("btn-primary");
	messageElement.val(message);
}

function disableButton(element){
	element.prop("disabled", true);
	element.removeClass("btn-dark");
	element.removeClass("btn-primary");
}

function enableButtons(element){

	element.prop("disabled", false);
	element.removeClass("btn-dark");
	element.addClass("btn-primary");

}

	$(window).on('load', function() {
		console.log("lol");
		disableButton($("#nextStep"));
		disableButton($("#createNewAccount1"))
		var content = $("#content");
		var qs = window.location.search;
		var urlparams = new URLSearchParams(qs);
		var role = urlparams.get('role');

		switch(role) {
			case '1': $("#id1").innerHTML = "Create Retailer Account";
					$("#id2").innerHTML = "Create Retailer Account";
					$("#id3").innerHTML = "Create Retailer Account";
					break;
			case '2': $("#id1").innerHTML = "Create Wholesaler Account";
					$("#id2").innerHTML = "Create Wholesaler Account";
					$("#id3").innerHTML = "Create Wholesaler Account";
					break;
			case '3': $("#id1").innerHTML = "Create Distributer Account";
					$("#id2").innerHTML = "Create Distributer Account";
					$("#id3").innerHTML = "Create Distributer Account";
					break;
			case '4': $("#id1").innerHTML = "Create Factory Account";
					$("#id2").innerHTML = "Create Factory Account";
					$("#id3").innerHTML = "Create Factory Account";
					break;
		}

		$.ajax({
			url: '/api/checkAccountPresent',
			type: 'GET',
			contentType: 'application/json'
		}).done(function(resp){
			console.log(resp);
			if(resp.status == "error") {
				console.log("lol");
				enableButtons($("#createNewAccount1"));
			}
			else if(resp.status == "correct") {
				console.log("lol2");
				console.log(resp);
				$("#accountAddressNode1").val(resp.accountAddress1);
			}
		})

		// var interval = setInterval(function() {
		// 	console.log("hey");
		// 	$.ajax({
		// 	    url: 'api/checkDeployed', 
		// 	    type: 'GET', 
		// 	    contentType: 'application/json'}
		// 	).done(function(resp){
		// 		if(resp.deployed == true)
		// 			enableButtons($("#nextStep"));
		// 	});
		// }, 10000);


	})

