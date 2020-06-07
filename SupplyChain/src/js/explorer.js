App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {

    if (window.ethereum) {
      console.log(Web3);
      web3 = new Web3(window.ethereum);
      try { 
        window.ethereum.enable().then(function() {
      });
      } catch(e) {
    }
}

    // if (typeof web3 !== 'undefined') {
    //   // If a web3 instance is already provided by Meta Mask.
    //   App.web3Provider = web3.currentProvider;
    //   web3 = new Web3(web3.currentProvider);
    // } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    // }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("SupplyChain.json", function(supplyChain) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.SupplyChain = TruffleContract(supplyChain);
      // Connect provider to interact with contract
      App.contracts.SupplyChain.setProvider(App.web3Provider);

    //App.listenForEvents();
     return App.displayDetails();
      //return App.render();
    });
  },


  displayDetails: function() {
    
      web3.eth.getBlockNumber().then(function(latestBlock){
      console.log(latestBlock);
      console.log(web3);

      for(i=0; i<10; i++) {
         web3.eth.getBlock(latestBlock-i).then(function(block){
        

        web3.eth.getTransaction(block.transactions[0]).then(function(tx) {
          console.log(tx);

var num = tx.blockNumber;
        var hash = tx.hash;
        var time = block.timestamp;
        var from = tx.from;

        var table = document.getElementById("DetailsTable");
        var row = table.insertRow();
        var cell = row.insertCell();
        cell.innerHTML = num;
        var cell = row.insertCell();
        cell.innerHTML = hash;
        var cell = row.insertCell();
        cell.innerHTML = time;
        var cell = row.insertCell();
        cell.innerHTML = from;
        });
        });
      }

    }
    );
    }


  };

  
$(function() {
  $(window).load(function() {
    App.init();
  });
});