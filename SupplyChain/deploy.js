const fs = require('fs');
const Web3 = require('web3');
const path = require('path');
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

web3.eth.getAccounts().then(function(accounts) {

myContract.deploy({
    data: bytecode,
    arguments: [accounts[1], accounts[2], accounts[3], accounts[4]]
})
.send({
    from: '0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34',
    gas: 20000000,
}, function(error, transactionHash){})
.on('receipt', function(rec){
	jsonOutput['networks']['5777']['address'] = rec.contractAddress;
	let formattedJson = JSON.stringify(jsonOutput, null, 4);
	fs.writeFileSync(jsonFile, formattedJson);

	web3.eth.personal.lockAccount(accounts[1]);
	web3.eth.personal.lockAccount(accounts[2]);
	web3.eth.personal.lockAccount(accounts[3]);
	web3.eth.personal.lockAccount(accounts[4]);
	console.log("hey");

});
});


return;