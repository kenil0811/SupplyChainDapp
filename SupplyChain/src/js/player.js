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

      App.contracts.SupplyChain.deployed().then(function(instance) {

        instance.players(web3.eth.accounts).then(function(player) {
          var role = player[0].c[0]-1;
          instance.orderState(role).then(function(state) {
            if(state.c[0] == 1) {
              document.getElementById("placeOrder").style.display = "none"; 
              document.getElementById("orderPlaced").style.display = "block";
            }
            else {
              document.getElementById("placeOrder").style.display = "block"; 
              document.getElementById("orderPlaced").style.display = "none";
            }
          });
        });
      });


    App.listenForEvents();
    App.getDetails();
    return App.displayDetails();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.SupplyChain.deployed().then(function(instance) {
        instance.weekEnd({}, {}).watch(function(error, event) {

              document.getElementById("placeOrder").style.display = "block"; 
              document.getElementById("orderPlaced").style.display = "none"; 
        App.getDetails();
        App.displayDetails();
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
      instance.weekNo().then(function(weekNo) {
      instance.weekDetails(web3.eth.accounts, weekNo.c[0]-1).then(function(details) {
      console.log(details);
      console.log(weekNo.c[0]);
        document.getElementById("demand").innerHTML = details[2].c[0];
        document.getElementById("prev_inv").innerHTML = details[1].c[0];
        document.getElementById("rec_inv").innerHTML = details[0].c[0];
        document.getElementById("ship_quan").innerHTML = details[3].c[0];
        document.getElementById("total_inv").innerHTML = details[5].c[0];                

      });
    });
    });
  },

  order: function() {
    
    var orderAmount = document.getElementById("order").value;
    console.log(orderAmount);
    App.contracts.SupplyChain.deployed().then(function(instance) {
        
        return instance.order(orderAmount, {from: App.account}); 
    }).then(function(result) {      
              document.getElementById("placeOrder").style.display = "none"; 
              document.getElementById("orderPlaced").style.display = "block";

    }).catch(function(err) {
      console.error(err);
    });
  },


};
  
$(function() {
  $(window).load(function() {
    App.init();
  });
});