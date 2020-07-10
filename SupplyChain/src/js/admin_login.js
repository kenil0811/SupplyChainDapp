var url = "http://localhost:3000/adminLogin";   
var request = new XMLHttpRequest();

request.onreadystatechange = function (){
    if (request.status == 200  && request.readyState == 4) {
    	console.log("jii");
   	window.location.href = 'adminSetup1.html';
    }
    else {
    	document.getElementById('invalid').style.display = "block";
    }
}

function login() {
	var password = document.getElementById("pass").value;
	console.log(password);
	request.open("GET", url+'/'+password, true);
	request.send();
}       

