var currentlyMining = false;
var genesisContent,genesisData;
$(document).ready(function(){
	
	var page1Buttons = [$("#createNewAccount button"), $("#startBlockchain button")];
	var page2Buttons = [$("#connectToPeer button"), $("#checkPeer button"), $("#checkBalanceForm button"), $("#startMiner"), $("#checkAddresses button"), $("#checkTransactionForm button"), $("#submitProject"), $("#copyScore")];
	//Getting Started with Ethereum Functions
	$("#createNewAccount").on('submit', function(e){
		e.preventDefault();
		var password = $("#passwordNode1").val();
		if(!password){
			alert("Please provide both the passwords!");
			enableButtons(page1Buttons);
			return
		}
		disableButtons(page1Buttons,$("#accountAddressNode1"), "Account creation in progress...");
		$.ajax({
		    url: 'api/configureEthereum:account', 
		    type: 'POST', 
		    contentType: 'application/json', 
		    data: JSON.stringify({"password1":password})}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				enableButtons(page1Buttons);
			}else if(resp.status == "complete"){
				$("#accountAddressNode1").val(resp.accountAddress1);	
				console.log(resp.accountAddress1);
				var addr = resp.accountAddress1.slice(2);
				console.log(addr);

				genesisContent = {"config": {"chainId": 5777, "homesteadBlock": 0, "eip150Block": 0, "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000", "eip155Block": 0, "eip158Block": 0, "byzantiumBlock": 0, "constantinopleBlock": 0, "petersburgBlock": 0, "istanbulBlock": 0, "clique": { "period": 0, "epoch": 30000 } }, "nonce": "0x0", "timestamp": "0x5f047250", "gasLimit": "0x47b76000", "difficulty": "0x1", "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000", "coinbase": "0x0000000000000000000000000000000000000000", "alloc": {}, "number": "0x0", "gasUsed": "0x0", "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"};
				genesisContent["extraData"] = "0x0000000000000000000000000000000000000000000000000000000000000000" + addr + "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
				genesisContent.alloc[addr] = { "balance": "0x200000000000000000000000000000000000000000000000000000000000000" };				
				

				enableButtons(page1Buttons);
				disableButton($("#createNewAccount button"));
			}
		});
	});
	
	$("#startBlockchain").on('submit', function(e){
		e.preventDefault();

		var ip1 = $("#ip1").val();
		var ip2 = $("#ip2").val();
		var ip3 = $("#ip3").val();
		var ip4 = $("#ip4").val();

		if(!isValidIP(ip1) /* || !isValidIP(ip2) || !isValidIP(ip3) || !isValidIP(ip4) */) {
			alert("Invalid Ip address(es)");
			enableButtons(page1Buttons);
			return;
		}

		$.ajax({
			url: '/api/configureEthereum:setIP',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({"ip1":ip1, "ip2":ip2, "ip3":ip3, "ip4":ip4})
		})
		
		if(!genesisContent){
			alert("Please create admin account first");
			enableButtons(page1Buttons);
			return
		}

		genesisContent.config.clique["period"] = parseInt($("#blockTime").val());
		genesisData = JSON.stringify(genesisContent, null, 4);

		disableButtons(page1Buttons,$("#genesisFileStatus"), "Starting the Blockchain...");

		var timeout = setTimeout(function(){
			$("#ethereumNodeStatus").val("Ethereum started successfully. Move to Step 2 now.");
			$("#nextStep").prop("disabled", false);
			$("#nextStep").removeClass("btn-dark");
			$("#nextStep").addClass("btn-primary");
		},5000);
		
		$.ajax({
		    url: '/api/configureEthereum:startAdmin', 
		    type: 'POST', 
		    contentType: 'application/json', 
		    data: JSON.stringify({"genesisData":genesisData})}
		).done(function(resp1){
			if(resp1.status== "error") {
				alert(resp1.errorDetails);
				enableButtons(page1Buttons);
				$("#blockchainStatus").val(resp1.errorDetails);
			}
		});

		$.ajax({
		    url: 'http://' + ip1 + ':3000/api/configureEthereum:startPlayer', 
		    type: 'POST', 
		    contentType: 'application/json', 
		    data: JSON.stringify({"genesisData":genesisData})}
		).done(function(resp2){
			if(resp2.status== "error") {
				alert(resp2.errorDetails);
				enableButtons(page1Buttons);
				$("#blockchainStatus").val(resp2.errorDetails);
			}
		});
		
		// $.ajax({
		//     url: 'http://' + ip2 + ':3000/api/configureEthereum:startPlayer', 
		//     type: 'POST', 
		//     contentType: 'application/json', 
		//     data: JSON.stringify({"genesisData":genesisData})}
		// ).done(function(resp3){

		// $.ajax({
		//     url: 'http://' + ip3 + ':3000/api/configureEthereum:startPlayer', 
		//     type: 'POST', 
		//     contentType: 'application/json', 
		//     data: JSON.stringify({"genesisData":genesisData})}
		// ).done(function(resp4){

		// $.ajax({
		//     url: 'http://' + ip4 + ':3000/api/configureEthereum:startPlayer', 
		//     type: 'POST', 
		//     contentType: 'application/json', 
		//     data: JSON.stringify({"genesisData":genesisData})}
		// ).done(function(resp5){

		
		setTimeout(function(){
			$("#blockchainStatus").val("Blockchain Started!!!");
		},1000);

		
		// });
		// });
		// });
	});

	$("#nextStep").on('click', function(e){
		window.location.href = './adminSetup2.html';
	});


	//Performing Ethereum Functions
	$("#connectToPeer").on('submit', function(e){
		e.preventDefault();		
		disableButtons(page2Buttons,$("#peerStatus"), "Connecting to peer...");
		$.ajax({
			url: '/api/configureEthereum:getIP',
			type: 'POST',
			contentType: 'application/json'
		}).done(function(resp) {
			// console.log(resp1.ip1);
			// body...
			$.ajax({
				url: 'http://' + resp.ip1 + ':3000/api/ethereum:getEnode',
				type: 'POST',
				contentType: 'application/json'
			}).done(function(resp1) {
				console.log(resp1);
			// $.ajax({
			// 	url: 'http://' + resp.ip2 + ':3000/api/ethereum:getEnode',
			// 	type: 'POST',
			// 	contentType: 'application/json'
			// }).done(function(resp2) {
			// $.ajax({
			// 	url: 'http://' + resp.ip3 + ':3000/api/ethereum:getEnode',
			// 	type: 'POST',
			// 	contentType: 'application/json'
			// }).done(function(resp3) {
			// $.ajax({
			// 	url: 'http://' + resp.ip4 + ':3000/api/ethereum:getEnode',
			// 	type: 'POST',
			// 	contentType: 'application/json'
			// }).done(function(resp4) {

				var index1 = resp1.enode.indexOf("@");
				var s1 = resp1.enode.substring(0, index1+1);
				s1 = s1.concat(resp.ip1 + ":30303");

				// var index2 = resp2.enode.indexOf("127");
				// var s2 = resp2.enode.substring(0, index2);
				// s2 = s2.concat(resp.ip2 + ":30303");

				// var index3 = resp3.enode.indexOf("127");
				// var s3 = resp3.enode.substring(0, index3);
				// s3 = s3.concat(resp.ip3 + ":30303");

				// var index4 = resp4.enode.indexOf("127");
				// var s4 = resp4.enode.substring(0, index4);
				// s4 = s4.concat(resp.ip4 + ":30303");


				var s = {"enode1": s1 /*, "enode2": s2, "enode3": s3, "enode4": s4 */}


				$.ajax({
			    url: '/api/ethereum:addPeer', 
			    type: 'POST', 
			    contentType: 'application/json',
			    data: JSON.stringify(s)
				}).done(function(resp2){
					console.log(resp2);
					if(resp2.status == "error"){
						alert(resp2.errorDetails);
						enableButtons(page2Buttons);
					}else if(resp2.status == "complete"){
						$("#peerStatus").val(resp2.addStatus);
						//showShortModal();
						setTimeout(function(){
							enableButtons(page2Buttons);
							//hideShortModal();
						},2000);
					}
				});
				// body...
			})
			// })
			// })
			// })
		})
	})
		

	$("#checkPeer").on('submit', function(e){
		e.preventDefault();		
		disableButtons(page2Buttons,$("#peerCount"), "Fetching peer count...");
		$.ajax({
		    url: '/api/ethereum:peerCount', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data:JSON.stringify({"node":1})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				enableButtons(page2Buttons);
			}else if(resp.status == "complete"){
				$("#peerCount").val(resp.count);
				//showShortModal();
				setTimeout(function(){
					enableButtons(page2Buttons);
					//hideShortModal();
				},2000);
			}
		});
	});

	$("#checkBalanceForm").on('submit', function(e){
		e.preventDefault();		
		disableButtons(page2Buttons,$("#balanceStatus"), "Fetching accounts and balances...");
		$.ajax({
		    url: '/api/ethereum:balance', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data:JSON.stringify({"node":1})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				$("#balanceStatus").val(resp.errorDetails);
				enableButtons(page2Buttons);
			}else if(resp.status == "complete"){
				addListAndBalance($("#accountList"),resp);
				$("#balanceStatus").val("Account and balances fetched.");
				//showShortModal();
				setTimeout(function(){
					enableButtons(page2Buttons);
					//hideShortModal();
				},2000);
			}
		});
	});

	$("#startMiner").on('click', function(e){
		e.preventDefault();		
		disableButtons(page2Buttons,$("#minerStatus"), "Miner starting...");
		$.ajax({
		    url: '/api/ethereum:minerStart', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data:JSON.stringify({"node":1})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				$("#minerStatus").val(resp.errorDetails);
				enableButtons(page2Buttons);
			}else if(resp.status == "complete"){
				$("#minerStatus").val(resp.message);
				currentlyMining = true;
				//showLongModal();
				// enableButtons(page2Buttons);
				setTimeout(function(){
					
					enableButtons(page2Buttons);
				},2000);
			}
		});
	});

	$("#checkAddresses").on('click', function(e){
		e.preventDefault();
		disableButtons(page2Buttons, $("checkAddressesStatus"), "Please Wait... Checking!");

		$.ajax({
			url: '/api/configureEthereum:getIP',
			type: 'POST',
			contentType: 'application/json'
		}).done(function(resp) {
			$.ajax({
				url: 'http://' + resp.ip1 + ':3000/api/checkAccountPresent',
				type: 'GET',
				contentType: 'application/json'
			}).done(function(resp1) {
			// $.ajax({
			// 	url: 'http://' + resp.ip2 + ':3000/api/checkAccountPresent',
			// 	type: 'GET',
			// 	contentType: 'application/json'
			// }).done(function(resp2) {
			// $.ajax({
			// 	url: 'http://' + resp.ip3 + ':3000/api/checkAccountPresent',
			// 	type: 'GET',
			// 	contentType: 'application/json'
			// }).done(function(resp3) {
			// $.ajax({
			// 	url: 'http://' + resp.ip4 + ':3000/api/checkAccountPresent',
			// 	type: 'GET',
			// 	contentType: 'application/json'
			// }).done(function(resp4) {
				var s="", c=0;
				if(resp1.status == "error") {
					s += "Retailer  ";
					c++;
				}
				// if(resp2.status == "error") {
				// 	s += "Wholesaler  ";
				// 	c++;
				// }
				// if(resp3.status == "error") {
				// 	s += "Distributer  ";
				// 	c++;
				// }
				// if(resp4.status == "error") {
				// 	s += "Factory  ";
				// 	c++;
				// }
				if(c==0) {
					s="All The players have generated their accounts. You can send ether now";
					enableButtons(page2Buttons);
					enableButtons([$("#sendTransactionButton")]);
				}
				else if(c==1) {
					s += "has not created an account yet";
				}
				else {
					s += "have not created accounts yet";
				}
				$("#checkAddressesStatus").val(s);

			// })
			// })
			// })	
			})
		})
	})


	$("#sendTransactionForm").on('submit', function(e){
		e.preventDefault();		
		var amount = $("#sendAmount").val();
		if(!amount){
			alert("Please enter amount to be sent!");
			$("#transactionStatus").val("Please enter amount to be sent!");
			return;
		}
		disableButtons(page2Buttons,$("#transactionStatus"), "Sending Transaction...");
		$.ajax({
			url: '/api/configureEthereum:getIP',
			type: 'POST',
			contentType: 'application/json'
		}).done(function(resp) {
			var addrs;
			$.ajax({
				url: 'http://' + resp.ip1 + ":3000/api/getAddress",
				type: 'GET',
				contentType: 'application/json'
			}).done(function(resp1) {
			// $.ajax({
			// 	url: 'http://' + resp.ip2 + ":3000/api/getAddress",
			// 	type: 'GET',
			// 	contentType: 'application/json'
			// }).done(function(resp2) {			
			// $.ajax({
			// 	url: 'http://' + resp.ip3 + ":3000/api/getAddress",
			// 	type: 'GET',
			// 	contentType: 'application/json'
			// }).done(function(resp3) {	
			// $.ajax({
			// 	url: 'http://' + resp.ip4 + ":3000/api/getAddress",
			// 	type: 'GET',
			// 	contentType: 'application/json'
			// }).done(function(resp4) {
		
				$.ajax({
				    url: '/api/ethereum:transaction', 
				    type: 'POST', 
				    contentType: 'application/json',
				    data: JSON.stringify({"addr1":resp1.addr, /* "addr2":resp2.addr, "addr3":resp3.addr, "addr4":resp4.addr, */ "amount":amount})
				}).done(function(resp){
					if(resp.status == "error"){
						alert(resp.errorDetails);
						$("#transactionStatus").val(resp.errorDetails);
						enableButtons(page2Buttons);
					}else if(resp.status == "complete"){
						$("#transactionStatus").val(resp.transactionStatus);
						setTimeout(function(){
							enableButtons(page2Buttons);
						},2000);
					}
				});
			});
			});
			// });
			// });
			// });
	});
	
	$("#checkTransactionForm").on('submit', function(e){
		e.preventDefault();		
		disableButtons(page2Buttons,$("#pendingTransactions"), "Fetching transaction status...");
		$.ajax({
		    url: '/api/ethereum:transactionStatus', 
		    type: 'POST', 
		    contentType: 'application/json'
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				$("#pendingTransactions").val(resp.errorDetails);
				enableButtons(page2Buttons);
			}else if(resp.status == "complete"){
				$("#pendingTransactions").val(resp.pending);
				$("#queuedTransactions").val(resp.queued);
				setTimeout(function(){
					enableButtons(page2Buttons);
				},2000);
			}
		});
	});


	$("#stopAllEthereum").on('click', function(e){
		e.preventDefault();
		$.ajax({
		    url: '/api/configureEthereum:stop', 
		    type: 'POST', 
		    contentType: 'application/json'}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				alert(resp.message);
			}
		});

	});

	$("#moveToStep2").on('click', function(e){
		e.preventDefault();
		window.location.href = './adminSetup2.html';
	});
	
	$("#deleteEverything").on('click', function(e){
		e.preventDefault();
		if(confirm("Are you sure you want to delete everything?")){
			$.ajax({
				url: '/api/deleteEverything', 
			    type: 'POST', 
			    contentType: 'application/json'
			}).done(function(resp){
				if(resp.status == "error"){
					alert(resp.errorDetails);
				}else if(resp.status == "complete"){
					alert(resp.message);
					window.location.href ='./adminSetup1.html';
				}
			});			
		}else{
			return;
		}

	});

	$("#submitProject").on('click', function(e){
		e.preventDefault();
		$.ajax({
			url: '/api/submitScore', 
		    type: 'GET', 
		    contentType: 'application/json'
		}).done(function(resp){
			$("#submitScore").val(resp.hash);
		});
	});

	$("#copyScore").on('click', function(e){
		e.preventDefault();
		var copy = document.getElementById("submitScore");
		if(!copy.value){
			alert("Please generate your score first!");
			return;
		}
		copy.select();
		document.execCommand("Copy");
		copy.selectionStart = copy.selectionEnd = -1;
		alert("Copied to Clipboard")
	});

});

function addListAndBalance(element, resp){
	element.empty();
	for(var i = 0; i <resp.account.length; i++){
		var temp = '<div class="col-6"><input type="text" class="form-control" id="accountAddress" placeholder="Account Address" readonly value='+ resp.account[i] +'></div><div class="col-3"><input type="text" class="form-control" id="balanceWei" placeholder="Balance (in Weis)" readonly value='+ resp.wei[i] +'></div><div class="col-3"><input type="text" class="form-control" id="balanceEther" placeholder="Balance (in Ether)" readonly value='+ resp.ether[i] +'></div>';
		element.append(temp);
	}
	
}

function disableButtons(elements, messageElement, message){
	for(i=0; i<elements.length; i++){
		element = elements[i];
		element.prop("disabled", true);
		element.removeClass("btn-dark");
		element.removeClass("btn-primary");
	}
	messageElement.val(message);
}

function disableButton(element){
	element.prop("disabled", true);
	element.removeClass("btn-dark");
	element.removeClass("btn-primary");
}

function enableButtons(elements){
	for(i=0; i<elements.length; i++){
		element = elements[i];
		element.prop("disabled", false);
		element.removeClass("btn-dark");
		element.addClass("btn-primary");
	}
	if(currentlyMining == true){
		element = $("#startMiner");
		element.prop("disabled", true);
		element.removeClass("btn-dark");
		element.removeClass("btn-primary");
	}
}

function removeElement(buttonList,element){
	console.log(element);
	console.log(buttonList.indexOf(element));
	return buttonList.filter(function(e){
		return e!=element;
	});
}

function showShortModal(){
	$("#shortModal").modal({
		backdrop: 'static',
		keyboard: false
	});
	var countDown = new Date().getTime() + 6000;
	var testInterval = setInterval(function(){
		var now = new Date().getTime();
		var remain = countDown - now;

		var mins = Math.floor((remain %(1000*60*60))/(1000*60));
		var secs = Math.floor((remain % (1000*60)) / 1000);

		document.getElementById("shortTimer").innerHTML = mins + "m " + secs + "s ";

		if(remain<0){
			clearInterval(testInterval);
			document.getElementById("shortTimer").innerHTML = "0m 5s";
		}

	},1000);
}

function hideShortModal(){
	$("#shortModal").modal('hide');
}

function showLongModal(){
	$("#longModal").modal({
		backdrop: 'static',
		keyboard: false
	});
	var countDown = new Date().getTime() + (10 * 60 * 1000);
	var longInterval = setInterval(function(){
		var now = new Date().getTime();
		var remain = countDown - now;

		var mins = Math.floor((remain %(1000*60*60))/(1000*60));
		var secs = Math.floor((remain % (1000*60)) / 1000);

		document.getElementById("longTimer").innerHTML = mins + "m " + secs + "s ";

		if(remain<0){
			clearInterval(longInterval);
			clearInterval(DAGInterval);
			hideLongModal();
			document.getElementById("longTimer").innerHTML = "5m 0s";
		}

	},1000);
	var DAGInterval = setInterval(function(){
		//Contact the backend. If true, hideLongModal and clear the above interval and this interval
		$.ajax({
			url: '/api/checkDAG', 
			type: 'GET', 
			contentType: 'application/json'}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				if(resp.dagStatus == true){
					clearInterval(longInterval);
					clearInterval(DAGInterval);
					hideLongModal();
				}
			}
		});
	},15000);
}

function hideLongModal(){
	$("#longModal").modal('hide');
}

function isValidIP(ipaddress) {
	var isValid = false;
	if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
		$.ajax({
	      url: "http://" + ipaddress + ":3000/api/check",
	      type: "GET",
	      async: false,
	      dataType: "json",
	      success: function(data) {
	        isValid = true;
	      },
	      error: function(){
	        isValid = false;
	      }
	    });
	}
    return isValid;
}

$(window).on('load', function() {
	console.log("hey");
	disableButton($("#sendTransactionButton"));
	console.log("lol");
});