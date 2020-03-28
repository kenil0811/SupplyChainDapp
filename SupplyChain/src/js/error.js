$(function() {
  $(window).load(function() {

    var content = $("#content");
    var qs= window.location.search;
    const urlParams = new URLSearchParams(qs);
    const val= urlParams.get('val');

    if(val==1)
    	document.getElementById('error').innerHTML = "Incorrect address for the given role!!";
    else if(val==2)
    	document.getElementById('error').innerHTML = "Incorrect Password!!";

  });
});