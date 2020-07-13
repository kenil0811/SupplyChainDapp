'use strict';
var fs = require('fs');
const { exec } = require('child_process');
var crypto = require('crypto');
const Web3 = require('web3');
var web3, admin, txPool;
const web3Admin = require('web3-eth-admin');
const web3txPool = require('web3-eth-txpool');
const path = require('path');
var directoryNode1;
exec('pwd', (err,stdout,stderr) => {
	var s = stdout.substring(6);
	var i = s.indexOf('/');
	directoryNode1 = "/home/" + s.substring(0,i) + "/Node_1";
	console.log(directoryNode1);
});

var connected = false;
var enode1;
var enode2;
var coinbase1;
var coinbase2;
var killing = false;
var ips;
var addrs;
var deployed = false;
var amountSent = false;
let contract = "SupplyChain";
let jsonOutputName = path.parse(contract).name + '.json';
let jsonFile = './build/contracts/' + jsonOutputName;
let contractJsonContent = fs.readFileSync(jsonFile, 'utf8');
let jsonOutput = JSON.parse(contractJsonContent);

module.exports = {
	checkEthereum: function(req, resp){
		fs.readdir(directoryNode1, function(err, list){
			if(err){
				resp.json({"status":"complete", "message":"Instance of Ethereum not found at that location."});
				return;									
			}else{
				resp.json({"status":"error","errorDetails":"You have already configured Ethereum. Please choose options below."});
			}
		});
	},
	deleteEverything: function(req,resp){
		
		killing = true;
		exec('pkill geth', (err,stdout,stderr) =>{	
			exec('rm -rf ' + directoryNode1, (err,stdout,stderr) =>{
				if(err){
					killing = false
					resp.json({"status":"error", "errorDetails":"Unable to delete both the directories"});
					return;
				}				
				resp.json({"status":"complete", "message":"Deleted everything successfully."});
			});
		});
	},
	configureEthereum: function(req, resp){
		var type = req.params.type;
		if(type == ":account"){

			var accountAddress1;
			// var accountAddress2;
			exec('mkdir '+directoryNode1, (err,stdout,stderr) => {
				if(err){
					exec('geth --datadir ' + directoryNode1 + ' account list' , (err,stdout, stderr) => {
						var index = stdout.indexOf("{");
						var index2 = stdout.indexOf("}");
						if(index==-1) {
							fs.writeFile(directoryNode1 + "/password.txt", req.body.password1, function(err){
								if(err){
									resp.json({"status":"error","errorDetails":"Unable to create a new account right now!"});		
									return;
								}
								exec('geth account new --password ' + directoryNode1 + '/password.txt --datadir '+ directoryNode1 , (err,stdout,stderr) =>{
									if(err){
										resp.json({"status":"error","errorDetails":"Error Creating your Account right now"});
										return;
									}
									var index1 = stdout.indexOf("0x");
									var index2 = stdout.indexOf("Path")
									accountAddress1 = stdout.substring(index1, index2-1);
									console.log(accountAddress1);
									
									resp.json({"status":"complete","accountAddress1":accountAddress1});						
								});
							});
						}
						else {
							resp.json({"status":"already", "accountAddress1":"0x"+stdout.substring(index+1, index2)});
							return;
						}
					})
				}else {
				fs.writeFile(directoryNode1 + "/password.txt", req.body.password1, function(err){
					if(err){
						resp.json({"status":"error","errorDetails":"Unable to create a new account right now!"});		
						return;
					}
					exec('geth account new --password ' + directoryNode1 + '/password.txt --datadir '+ directoryNode1 , (err,stdout,stderr) =>{
						if(err){
							resp.json({"status":"error","errorDetails":"Error Creating your Account right now"});
							return;
						}
						var index1 = stdout.indexOf("0x");
						var index2 = stdout.indexOf("Path")
						accountAddress1 = stdout.substring(index1, index2-1);
						console.log(accountAddress1);
						
						resp.json({"status":"complete","accountAddress1":accountAddress1});						
					});
				});
				}
			});
		}else if(type == ":setIP"){
			ips = {"ip1":req.body.ip1, "ip2":req.body.ip2, "ip3":req.body.ip3, "ip4":req.body.ip4};
			console.log(ips);
		}else if(type == ":getIP"){
			resp.json(ips);
		}else if(type == ":startAdmin"){
			exec('mkdir '+directoryNode1, (err,stdout,stderr) => {

				fs.writeFile(directoryNode1 + "/customGenesis.json", req.body.genesisData, function(err){
					if(err){
						resp.json({"status":"error","errorDetails":"Unable to create the Genesis file1."});		
						return;
					}
					exec('geth init '+ directoryNode1 + '/customGenesis.json --datadir '+directoryNode1, (err,stdout,stderr) =>{
						if(err){
							console.log(err);
							resp.json({"status":"error","errorDetails":"Unable to initialize Ethereum. Invalid Genesis file found."});
							return;	
						}
						fs.readdir(directoryNode1, function(err, list){
							if(err){
								resp.json({"status":"error", "errorDetails":"Ethereum has not been configured right now."});
								return;
							}
							exec('geth --mine --datadir '+ directoryNode1 + ' --networkid 5777 --rpc --rpcport 8545 --rpccorsdomain "*" --nat "any" --rpcapi="txpool,db,eth,net,web3,personal,admin,miner" --unlock 0 --password ' + directoryNode1 + '/password.txt --allow-insecure-unlock', (err, stdout, stderr) =>{});
						});
					});
				});
			});
		}else if(type == ":startPlayer"){
			exec('mkdir '+directoryNode1, (err,stdout,stderr) => {

				fs.writeFile(directoryNode1 + "/customGenesis.json", req.body.genesisData, function(err){
					if(err){
						resp.json({"status":"error","errorDetails":"Unable to create the Genesis file1."});		
						return;
					}
					exec('geth init '+ directoryNode1 + '/customGenesis.json --datadir '+directoryNode1, (err,stdout,stderr) =>{
						if(err){
							console.log(err);
							resp.json({"status":"error","errorDetails":"Unable to initialize Ethereum. Invalid Genesis file found."});
							return;	
						}
						fs.readdir(directoryNode1, function(err, list){
							if(err){
								resp.json({"status":"error", "errorDetails":"Ethereum has not been configured right now."});
								return;
							}
							exec('geth --datadir '+ directoryNode1 + ' --networkid 5777 --rpc --rpcport 8545 --rpccorsdomain "*" --nat "any" --rpcapi="txpool,db,eth,net,web3,personal,admin,miner" --allow-insecure-unlock', (err, stdout, stderr) =>{});
						});
					});
				});
			});
		}		
	},
	startWeb3: function(req, resp){
		if(connected == false){
			web3  = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
			setTimeout(function(){
				try{
					admin = web3Admin.Admin(web3.currentProvider);
					txPool = web3txPool.TxPool(web3.currentProvider);
					web3.eth.net.isListening();
					admin.getNodeInfo().then(function(r){
						web3.eth.getAccounts().then(function(acc){
							coinbase1 = acc[0];
							enode1=r.enode;
							resp.json({"status":"complete", "message":"Connected with Ethereum node", "enode1":enode1, "coinbase1":coinbase1});
						});
					});				
				}catch(e){
					console.log(e);
					console.log("hmm");
					resp.json({"status":"error", "errorDetails":"Unable to connect to Ethereum. Please go back and start it."});	
					return;
				}
				
			}, 3000);
			connected = true;
		}
		else{
			try{
				admin = web3Admin.Admin(web3.currentProvider);
				web3.eth.net.isListening();
				admin.getNodeInfo().then(function(r){enode1=r.enode});
				web3.eth.getAccounts().then(function(acc){coinbase1 = acc[0]});

			}catch(e){
				resp.json({"status":"error", "errorDetails":"Unable to connect to Ethereum. Please go back and start it."});	
				return;
			}
			resp.json({"status":"complete", "message":"Connected with Ethereum node", "enode1":enode1, "coinbase1":coinbase1});

		}	
	},
	ethereum: function(req,resp){
		var type = req.params.type;
		if(connected == false) {
			web3  = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
			admin = web3Admin.Admin(web3.currentProvider);
			admin.getNodeInfo().then(function(r){enode1=r.enode});
		}
		if(type == ":getEnode"){
			admin.getNodeInfo().then(function(r){
				enode1=r.enode;
				resp.json({"enode":enode1});
			});
		}else if(type == ":addPeer"){
			console.log(req.body.enode1);
			var result;
			try{
				result = admin.addPeer(req.body.enode1);
				// result = admin.addPeer(req.body.enode2);
				// result = admin.addPeer(req.body.enode3);
				// result = admin.addPeer(req.body.enode4);
			}catch(e){
				var index = e.toString().indexOf("invalid enode");
				if(index!=1){
					resp.json({"status":"error", "errorDetails":"Invalid enode provided. Please check enode and try again."});
					return;
				}
			}
			resp.json({"status":"complete", "addStatus":"Enode added. You can check the connectivity using peer count or peers."})
		}else if(type == ":peerCount"){
			var node = req.body.node;
			var count;
			admin.getPeers().then(function(peers){
				resp.json({"status":"complete", "count":peers.length});
			});
			
		}else if(type == ":balance"){
			var balanceWei;
			var balanceEther;
			web3.eth.getAccounts().then(function(acc){
				web3.eth.getBalance(acc[0]).then(function(bal){
					balanceWei=bal;
					balanceEther = web3.utils.fromWei(balanceWei, "ether");			
					resp.json({"status":"complete", "account":acc[0], "wei":balanceWei, "ether":balanceEther});
				});	
			});
					
		}else if(type == ":transaction"){
			var amount = req.body.amount;
			if(addrs==null)
				addrs = {"coinbase":coinbase1, "addr1": req.body.addr1 /*, "addr2": req.body.addr2, "addr3": req.body.addr3, "addr4": req.body.addr4 */};

			var transactionObj1 = {from:coinbase1, to:req.body.addr1, value:web3.utils.toWei(amount, "ether")};
			// var transactionObj2 = {from:coinbase1, to:req.body.addr2, value:web3.utils.toWei(amount, "ether")};
			// var transactionObj3 = {from:coinbase1, to:req.body.addr3, value:web3.utils.toWei(amount, "ether")};
			// var transactionObj4 = {from:coinbase1, to:req.body.addr4, value:web3.utils.toWei(amount, "ether")};

			var status;
			try{
				var status1 = web3.eth.sendTransaction(transactionObj1);
				// var status2 = web3.eth.sendTransaction(transactionObj2);
				// var status3 = web3.eth.sendTransaction(transactionObj3);
				// var status4 = web3.eth.sendTransaction(transactionObj4);
				// console.log(status);
			}catch(e){
				var index = e.toString().indexOf("authentication needed");
				if(index != -1){
					resp.json({"status":"complete", "transactionStatus":"Your account is locked. Can not initiate transaction."});
					return;
				}
				index = e.toString().indexOf("insufficient funds");
				if(index != -1){
					resp.json({"status":"complete", "transactionStatus":"Your account has insufficient funds for gas * price + amount that you want to send."});
					return;
				}
				resp.json({"status":"complete", "transactionStatus":"An unknown error occured."});
				return;
			}
			amountSent = true;
			resp.json({"status":"complete", "transactionStatus":"Transactions successfully submitted."});
		}else if(type == ":transactionStatus"){
			txPool.getStatus().then(function(status) {
				resp.json({"status":"complete", "pending":status.pending, "queued":status.queued});	
			})	
		}
	},
	checkDAG: function(req, resp){
		var number = web3.eth.blockNumber;
		if(number>0){
			resp.json({"status":"complete", "dagStatus":true});
		}else{
			resp.json({"status":"complete", "dagStatus":false});
		}
	},
	check: function(req, resp){
		resp.json({"status":"complete"});
	},
	getAddress: function(req, resp){
		resp.json({"addr": coinbase1});
	},
	checkDeployed: function(req, resp){
		resp.json({"deployed": deployed});
	},
	checkAccountPresent: function(req, resp){
		exec('geth --datadir ' + directoryNode1 + ' account list' , (err,stdout, stderr) => {
			if(err) {
				resp.json({"status":"error", "accountAddress1":"null"});
			}else{
				var index = stdout.indexOf("{");
				var index2 = stdout.indexOf("}");
				if(index==-1) {
					resp.json({"status":"error", "accountAddress1":"null"});
				}
				else {
					coinbase1="0x"+stdout.substring(index+1, index2);
					resp.json({"status":"correct", "accountAddress1":"0x"+stdout.substring(index+1, index2)});
					return;
				}
			}
		})
	},
	checkAccountSent: function(req, resp){
		resp.json({"status": amountSent});
	},
	getAddresses: function(req, resp){
		resp.json({"addrs":addrs});
	},
	setContractAddress: function(req, resp){
		jsonOutput['networks']['5777']['address'] = req.body.contractAddress;
		let formattedJson = JSON.stringify(jsonOutput, null, 4);
		fs.writeFile(jsonFile, formattedJson, function(err) {
			if(err)
				resp.json({"status": "error"});
			else {
				deployed = true;
				resp.json({"status": "correct"});
			}
		});

	}

}


function hashed(data){
	return crypto.createHash('md5').update(data).digest("hex");
}
