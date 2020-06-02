const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.options('*', cors());
const path = require('path');
const fs = require('fs');
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


app.get('/deployGame', deployGame);

app.listen(process.env.PORT || 5000, function(){
    console.log('Your node js server is running');
});

function deployGame(req, res) {
	var players = {retailer: {}, wholesaler: {}, distributer: {}, factory: {}};

//retailer account
web3.eth.personal.newAccount("pass1").then(function(newAcc) {
	players.retailer["address"] = newAcc;
	players.retailer["password"] = "pass1";
	console.log(newAcc);
	console.log(players);
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

myContract.deploy({
    data: bytecode,
    arguments: [accounts[len-4], accounts[len-3], accounts[len-2], accounts[len-1]]
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
	res.status(200).send(players);

});
});
});});});});
}