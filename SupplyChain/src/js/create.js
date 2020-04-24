
const fs = require('browserify-fs');
const Web3 = require('web3');
web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
web3 = new Web3(web3Provider);

let jsonFile = './build/contracts/SupplyChain.json'

let contractJsonContent = fs.readFile(jsonFile, 'utf8');
console.log(contractJsonContent);
let jsonOutput = JSON.parse(contractJsonContent);

let abi = jsonOutput['abi'];
let bytecode = jsonOutput['bytecode'];

let myContract = new web3.eth.Contract(abi);

defaultAccount = "0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34";

i=1;
while(i<=4) {
	var newAcc; 
	web3.eth.personal.newAccount("pass"+i).then(function(acc) {
		newAcc=acc;
		console.log(acc);
		web3.eth.sendTransaction({from:defaultAccount, to:newAcc, value:web3.utils.toWei('2', 'ether')});
	});
	i++;
}


web3.eth.getAccounts().then(function(accounts) {

var len = accounts.length;

myContract.deploy({
    data: bytecode,
    arguments: [accounts[len-4], accounts[len-3], accounts[len-2], accounts[len-1]]
})
.send({
    from: '0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34',
    gas: 20000000,
}, function(error, transactionHash){})
.on('receipt', function(rec){
	console.log(rec.contractAddress);
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
