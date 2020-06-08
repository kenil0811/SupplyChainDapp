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
web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
web3 = new Web3(web3Provider);
let contract = "SupplyChain";
let jsonOutputName = path.parse(contract).name + '.json';
let jsonFile = './build/contracts/' + jsonOutputName;

let result = false;

result = fs.statSync(jsonFile);

let contractJsonContent = fs.readFileSync(jsonFile, 'utf8');
let jsonOutput = JSON.parse(contractJsonContent);

let abi = jsonOutput['abi'];
let bytecode = jsonOutput['bytecode'];

let myContract = new web3.eth.Contract(abi);


defaultAccount = "0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34";

app.use(express.static('src'));
app.use(express.static('build/contracts'));

app.listen(process.env.PORT || 3000, function(){
    console.log('Your node js server is running');
});

app.post('/deployGameWithFile', upload.single('uploadCsv'), deployGameWithFile);

app.get('/getPlayers', getPlayers);


var players = {retailer: {}, wholesaler: {}, distributer: {}, factory: {}};

function deployGameWithFile(req, res) {
  // open uploaded file

console.log("\n\n\n");
  const fileRows = [];
  csv.parseFile(req.file.path)
    .on("data", function (data) {
      fileRows.push(data); // push each row
    })
    .on("end", function () {
      console.log(fileRows)
      fs.unlinkSync(req.file.path);   // remove temp file
      //process "fileRows" and respond
    });
    console.log("\n");
    console.log(req.body);
    console.log("\n");
	var totalWeeks = Number(req.body.totalWeeks);
	var start = Number(req.body.start);
	var end = Number(req.body.end);
	var dLeadTime = Number(req.body.dLeadTime);
	var oLeadTime = Number(req.body.oLeadTime);

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
	console.log(hCost)
	

//retailer account
web3.eth.personal.newAccount("pass1").then(function(newAcc) {
	players.retailer["address"] = newAcc;
	players.retailer["password"] = "pass1";
	console.log(newAcc);
	web3.eth.sendTransaction({from:defaultAccount, to:newAcc, value:web3.utils.toWei('0.5', 'ether')});
	fs.appendFile('details', "Address: " + newAcc + "; Pass: pass1" + "\n" , function(err){});

//wholesaler account
web3.eth.personal.newAccount("pass2").then(function(newAcc) {
	players.wholesaler["address"] = newAcc;
	players.wholesaler["password"] = "pass2";
	console.log(newAcc);
	web3.eth.sendTransaction({from:defaultAccount, to:newAcc, value:web3.utils.toWei('0.5', 'ether')});
	fs.appendFile('details', "Address: " + newAcc + "; Pass: pass2" + "\n" , function(err){});

//distributer account
web3.eth.personal.newAccount("pass3").then(function(newAcc) {
	players.distributer["address"] = newAcc;
	players.distributer["password"] = "pass3";
	console.log(newAcc);
	web3.eth.sendTransaction({from:defaultAccount, to:newAcc, value:web3.utils.toWei('0.5', 'ether')});
	fs.appendFile('details', "Address: " + newAcc + "; Pass: pass3" + "\n" , function(err){});

//factory account
web3.eth.personal.newAccount("pass4").then(function(newAcc) {
	players.factory["address"] = newAcc;
	players.factory["password"] = "pass4";
	console.log(newAcc);
	web3.eth.sendTransaction({from:defaultAccount, to:newAcc, value:web3.utils.toWei('0.5', 'ether')});
	fs.appendFile('details', "Address: " + newAcc + "; Pass: pass4" + "\n" , function(err){});


web3.eth.getAccounts().then(function(accounts) {
len = accounts.length;

fs.appendFile('details', (len-1)/4 + '\n-----\n', function(err){});
console.log("Game id:" + (len-1)/4);

players["GameID"] = (len-1)/4;

myContract.deploy({
    data: bytecode,
    arguments: [accounts[len-4], accounts[len-3], accounts[len-2], accounts[len-1], totalWeeks, start, end, dLeadTime, oLeadTime, hCost, lsCost]
})
.send({
    from: '0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34',
    gas: 20000000,
}, function(error, transactionHash){})
.on('receipt', function(rec){
	console.log("Contract Address: "+rec.contractAddress);
	jsonOutput['networks']['5777']['address'] = rec.contractAddress;
	let formattedJson = JSON.stringify(jsonOutput, null, 4);
	fs.writeFileSync(jsonFile, formattedJson);

	web3.eth.personal.lockAccount(accounts[len-1]);
	web3.eth.personal.lockAccount(accounts[len-2]);
	web3.eth.personal.lockAccount(accounts[len-3]);
	web3.eth.personal.lockAccount(accounts[len-4]);

	console.log("Success");

});
});
});});});});

	res.status(200).send(players);
}

function getPlayers(req, res){
	console.log(players);
	res.status(200).send(players);
}
