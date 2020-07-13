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

	$("#nextStep").on('click', function(e) {
		e.preventDefault();
		var content = $("#content");
		var qs = window.location.search;
		var urlparams = new URLSearchParams(qs);
		var role = urlparams.get('role');
		window.location.href = './login.html?role=' + role;
	})
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
					$("#id3").innerHTML = "Create an account for the Retailer";
					$("#id4").innerHTML = "Public address of the Retailer";
					break;
			case '2': $("#id1").innerHTML = "Create Wholesaler Account";
					$("#id2").innerHTML = "Create Wholesaler Account";
					$("#id3").innerHTML = "Create an account for the Wholesaler";
					$("#id4").innerHTML = "Public address of the Wholesaler";
					break;
			case '3': $("#id1").innerHTML = "Create Distributer Account";
					$("#id2").innerHTML = "Create Distributer Account";
					$("#id3").innerHTML = "Create an account for the Distributer";
					$("#id4").innerHTML = "Public address of the Distributer";
					break;
			case '4': $("#id1").innerHTML = "Create Factory Account";
					$("#id2").innerHTML = "Create Factory Account";
					$("#id3").innerHTML = "Create an account for the Factory";
					$("#id4").innerHTML = "Public address of the Factory";
					break;
		}

		$.ajax({
			url: '/api/checkAccountPresent',
			type: 'GET',
			contentType: 'application/json'
		}).done(function(resp){
			console.log(resp);
			if(resp.status == "error") {
				enableButtons($("#createNewAccount1"));
			}
			else if(resp.status == "correct") {
				$("#accountAddressNode1").val(resp.accountAddress1);
			}
		})

		var interval = setInterval(function() {
			console.log("hey");
			$.ajax({
			    url: 'api/checkDeployed', 
			    type: 'GET', 
			    contentType: 'application/json'}
			).done(function(resp){
				if(resp.deployed == true)
					enableButtons($("#nextStep"));
			});
		}, 10000);


	})

