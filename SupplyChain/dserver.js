const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.options('*', cors());
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const csv = require('fast-csv');
const upload = multer({ dest: 'tmp/csv/' });

const Web3 = require('web3');
let contract = "SupplyChain";
let jsonOutputName = path.parse(contract).name + '.json';
let jsonFile = './build/contracts/' + jsonOutputName;

let result = false;

result = fs.statSync(jsonFile);

let contractJsonContent = fs.readFileSync(jsonFile, 'utf8');
let jsonOutput = JSON.parse(contractJsonContent);

let abi = jsonOutput['abi'];
let bytecode = jsonOutput['bytecode'];




app.use(express.static('src'));
app.use(express.static('build/contracts'));

app.listen(process.env.PORT || 3000, function(){
    console.log('Your node js server is running');
});

app.get('/gameInfo', function(req, res) {
	fs.readFile('gameInfo.json', (err, data)=> {
		if (err) throw err;
    var gameInfo = JSON.parse(data);
    //console.log(gameInfo);
    res.status(200).send(gameInfo);
	});
});

app.get('/adminLogin/:password', function(req, res) {
	var pass = String(req.params.password);
	console.log(pass);
	if(pass == "admin") {
		res.status(200).send();
	}
	else {
		res.status(401).send();
	}
})

app.post('/deployGameWithFile', upload.single('uploadCsv'), deployGameWithFile);


var players = {retailer: {}, wholesaler: {}, distributer: {}, factory: {}};

function deployGameWithFile(req, res) {
 
	web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
	web3 = new Web3(web3Provider);
	let myContract = new web3.eth.Contract(abi);

	console.log("\n\n\n");
  var fileRows = [];
  if(req.file){
  	//file is uploaded
  	csv.parseFile(req.file.path)
    	.on("data", function (data) {
      	fileRows.push(data); // push each row
    	})
    	.on("end", function () {
      	console.log(fileRows)
      	fs.unlinkSync(req.file.path);   // remove temp file
     	 //process "fileRows" and respond
    	});

	}
	else {
		fileRows = [79, 64, 91, 95, 70, 82, 79, 74, 86, 104, 75, 88, 87, 80, 103, 96, 97, 88, 66, 67, 79, 84, 90, 79, 81];
		//file not found
	}
    // console.log("\n");
    // console.log(req.body);
    // console.log("\n");
    var defaultAccount = req.body.coinbase;
    console.log(defaultAccount);

    var retailerAddress = req.body.addr1;
    var wholesalerAddress = req.body.addr2;
    var distributerAddress = req.body.addr3;
    var factoryAddress = req.body.addr4;

	console.log(retailerAddress+'\n'+wholesalerAddress+'\n'+distributerAddress+'\n'+factoryAddress);    

	var totalWeeks = Number(req.body.totalWeeks);
	var start = Number(req.body.start);
	var end = Number(req.body.end);
	var dLeadTime = Number(req.body.dLeadTime);
	var oLeadTime = Number(req.body.oLeadTime);
	var initialInv = Number(req.body.initialInv);

	var rhCost = Number(req.body.rhCost);
	var whCost = Number(req.body.whCost);
	var dhCost = Number(req.body.dhCost);
	var fhCost = Number(req.body.fhCost);
	var hCost = [rhCost,whCost,dhCost,fhCost];

	var rlCost = Number(req.body.rlCost);
	var wlCost = Number(req.body.wlCost);
	var dlCost = Number(req.body.dlCost);
	var flCost = Number(req.body.flCost);
	var lsCost = [rlCost,wlCost,dlCost,flCost];

	console.log("Number of weeks: " + totalWeeks);
	// console.log(hCost)
	
	var distribution = req.body.distribution;
	var stdDev = Number(req.body.stdDev);
	var mean = Number(req.body.mean);

	var gameInfo = {};
	gameInfo.distribution = distribution;
	gameInfo.mean = mean;
	gameInfo.stdDev = stdDev;
	
	// console.log(gameInfo);

	var data = JSON.stringify(gameInfo);
	fs.writeFileSync('gameInfo.json', data);

console.log("wait!!");

myContract.deploy({
    data: bytecode,
    arguments: [retailerAddress, wholesalerAddress, distributerAddress, factoryAddress, totalWeeks, start, end, dLeadTime, oLeadTime, initialInv, hCost, lsCost, fileRows]
})
.send({
    from: defaultAccount,
    gas: 20000000,
}, function(error, transactionHash){})
.on('receipt', function(rec){
	console.log("Contract Address: "+rec.contractAddress);
	jsonOutput['networks']['5777']['address'] = rec.contractAddress;
	let formattedJson = JSON.stringify(jsonOutput, null, 4);
	fs.writeFileSync(jsonFile, formattedJson);

	web3.eth.personal.lockAccount(retailerAddress);
	web3.eth.personal.lockAccount(wholesalerAddress);
	web3.eth.personal.lockAccount(distributerAddress);
	web3.eth.personal.lockAccount(factoryAddress);

	console.log("Success");
	routes.deployed=true;
	res.status(200).send();
});


	
}


const routes = require("./routes");
const bodyParser = require('body-parser');


var port = 3000;

'use strict';

app.disable('etag');

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


app.post('/api/configureEthereum:type', routes.configureEthereum);
app.post('/api/ethereum:type', routes.ethereum);
app.post('/api/startWeb3', routes.startWeb3);
app.post('/api/checkEthereum', routes.checkEthereum);
app.post('/api/deleteEverything', routes.deleteEverything);
app.get('/api/checkDAG', routes.checkDAG);
app.get('/api/check', routes.check);
app.get('/api/getAddress', routes.getAddress);
app.get('/api/checkDeployed', routes.checkDeployed);
app.get('/api/checkAccountPresent', routes.checkAccountPresent);
app.get('/api/checkAccountSent', routes.checkAccountSent);
app.get('/api/getAddresses', routes.getAddresses);

console.log("Script started. Head over to http://localhost:"+port+ " on your browser");