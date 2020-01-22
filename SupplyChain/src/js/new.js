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

    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
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

  // Listen for events emitted from the contract
/*  listenForEvents: function() {
    App.contracts.SupplyChain.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.orderSent({}, {
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.displayDetails();
      });
    });
  }, */

  displayDetails: function() {
      var content = $("#content");

      var qs= window.location.search;
      //var v1=qs.get("role");

      console.log(qs);

      const urlParams = new URLSearchParams(qs);

      const v1= urlParams.get('role');

      console.log(v1);

      web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }

      App.contracts.SupplyChain.deployed().then(function(instance) {

        instance.adds(v1).then(function(role_add){

         
        
        
        instance.weekNo().then(function(weeks){
          //console.log(weeks.c[0]);
          //console.log(numWeeks);

        var table = document.getElementById("DetailsTable");
        for(var i=0; i<weeks.c[0]; i++)
          var row = table.insertRow();

        for(i=0; i<weeks.c[0]; i++) {
            instance.weekDetails(role_add,i).then(function(player){
              var pos = player[0].c[0];
              console.log(pos);
              var row = table.rows[pos];
              for(var j = 0;j<player.length;j++){
                var cell = row.insertCell(j);
                //console.log(j);
                cell.innerHTML = player[j].c[0];  
              }

            });
          }
            
        });
       });
      })
    });

       //content.show();
    }
  };

  
$(function() {
  $(window).load(function() {
    App.init();
  });
});