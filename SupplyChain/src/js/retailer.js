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
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
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

    App.listenForEvents();
     return App.displayDetails();
      //return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.SupplyChain.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.orderSent({}, {
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        //App.getDetails();
       // App.displayDetails();
      });
    });
  }, 

  displayDetails: function() {
      var content = $("#content");

      web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }

      App.contracts.SupplyChain.deployed().then(function(instance) {
        instance.inventory(0).then(function(array) {
          $("#ret_inv").html(array.c[0]);
        });
        instance.inventory(1).then(function(array) {
          $("#who_inv").html(array.c[0]);
        });
        instance.inventory(2).then(function(array) {
          $("#dis_inv").html(array.c[0]);
        });
        instance.inventory(3).then(function(array) {
          $("#fac_inv").html(array.c[0]);
        });


      })
    });

       //content.show();
    },

  getDetails: function() {
    App.contracts.SupplyChain.deployed().then(function(instance) {
      instance.players(web3.eth.accounts).then(function(player) {
        
        document.getElementById("id1").innerHTML = "<h2> Your Inventory: <b id=\"Inventory\"> </h2> <hr>";
        document.getElementById("Inventory").innerHTML = player[1].c[0];

        document.getElementById("id2").innerHTML = "<h2> Orders Received: <b id=\"Demand\"> </h2> <hr>";
        document.getElementById("Demand").innerHTML = player[2].c[0];

        document.getElementById("id3").innerHTML = "<h2> Order Placed: <b id=\"Req\"> </h2> <hr>";
        document.getElementById("Req").innerHTML = player[3].c[0];
      })
    })
  },

  order: function() {
    
    var orderAmount = document.getElementById("order").value;
    console.log(orderAmount);
    App.contracts.SupplyChain.deployed().then(function(instance) {
        
        return instance.order(orderAmount, {from: App.account}); 
    }).then(function(result) {
      document.getElementById("placeOrder").style.display = 'none';
      document.getElementById("orderPlaced").style.display = 'block';
    }).catch(function(err) {
      console.error(err);
    });
  },

  submitOrderDown: function() {
    
    var orderAmount = document.getElementById("amountDown").value;
    console.log(orderAmount);
    App.contracts.SupplyChain.deployed().then(function(instance) {
        
        instance.players(App.account).then(function(player) {
          var role = player[0].c[0];
        });

        return instance.clearStock(orderAmount, {from: App.account}); 
    }).then(function(result) {
      
    }).catch(function(err) {
      console.error(err);
      alert("Error!!!");
    });
  },





};
  
$(function() {
  $(window).load(function() {
    App.init();
  });
});