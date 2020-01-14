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

     // App.listenForEvents();

      //return App.render();
    });
  },

  // Listen for events emitted from the contract
 /* listenForEvents: function() {
    App.contracts.SupplyChain.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.orderPlaced({}, {
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.getDetails();
      });
    });
  }, */

  /*render: function() {
    var supplyChainInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.SupplyChain.deployed().then(function(instance) {
      supplyChainInstance = instance;
      console.log(supplyChainInstance);
      return supplyChainInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        supplyChainInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);
        });
      }
      return supplyChainInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  }, */


  checkValidity: function(num) {
    App.contracts.SupplyChain.deployed().then(function(instance) {
      instance.players(web3.eth.accounts).then(function(player) {
        
        var id = player[0].c[0];
        console.log(num);
        console.log(web3.eth.accounts);
        console.log(id);
        if(num !== id) {
            window.location.href = "error.html";
            console.log("incorrect");
            return;
          }
        if(num===1)
            window.location.href = "retailer.html";
        else if(num===2)
            window.location.href = "wholesaler.html";
        else if(num===3)
            window.location.href = "distributer.html";
        else if(num===4)
            window.location.href = "factory.html";
      })
    })
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

  submitOrder: function() {
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {App.account = account;}
    });

    var orderAmount = document.getElementById("amount").value;
    console.log(orderAmount);
    App.contracts.SupplyChain.deployed().then(function(instance) {
        
        instance.players(App.account).then(function(player) {
          var role = player[0].c[0];
        });

        return instance.order1(orderAmount, {from: App.account}); 
    }).then(function(result) {
      document.getElementById("postOrder").style.display = 'none';
      document.getElementById("orderPlaced").style.display = 'block';
    }).catch(function(err) {
      console.error(err);
    });
  }
};
  
$(function() {
  $(window).load(function() {
    App.init();
  });
});