const express = require('express');
const app = express();
const path = require('path');
app.use(express.static('src'));		// to add the static routes
app.use(express.static('build/contracts'))	//to add the static routes

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname,'/src', 'index.html')); 	//add the start page
});

app.listen(process.env.PORT || 4000, function(){
    console.log('Your node js server is running');
});