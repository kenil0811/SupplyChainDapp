App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  role:null,

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

    //if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
    //  App.web3Provider = web3.currentProvider;
    //  web3 = new Web3(web3.currentProvider);
    //} else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    //}
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("SupplyChain.json", function(supplyChain) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.SupplyChain = TruffleContract(supplyChain);
      // Connect provider to interact with contract
      App.contracts.SupplyChain.setProvider(App.web3Provider);

      var content = $("#content");
      var qs= window.location.search;
      const urlParams = new URLSearchParams(qs);
      App.role= urlParams.get('role');
      console.log(App.role);

      web3.eth.getAccounts().then(function(acc) {
        console.log(acc);
        console.log(App.role);

        App.account = acc[acc.length - 5 + parseInt(App.role)];
        console.log(App.account);
        console.log(acc[5]);

      switch(App.role) {
        case '1': document.getElementById('player').innerHTML = "Retailer";
                  document.getElementById('downstream').innerHTML = "Customer Demand";
                  break;
        case '2': document.getElementById('player').innerHTML = "Wholesaler";
                  document.getElementById('downstream').innerHTML = "Retailer Demand";
                  break;
        case '3': document.getElementById('player').innerHTML = "Distributer";
                  document.getElementById('downstream').innerHTML = "Wholesaler Demand";
                  break;
        case '4': document.getElementById('player').innerHTML = "Factory";
                  document.getElementById('downstream').innerHTML = "Distributer Demand";
                  break;
      }

      App.contracts.SupplyChain.deployed().then(function(instance) {

        instance.players(App.account).then(function(player) {
          var role = player.role.words[0]-1;
          instance.orderState(role).then(function(state) {
            console.log(state.words[0]);
            if(state.words[0] == 1) {
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
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.SupplyChain.deployed().then(function(instance) {
      console.log(instance);
        instance.weekEnd().on("data", function(error, event) {

              document.getElementById("placeOrder").style.display = "block"; 
              document.getElementById("orderPlaced").style.display = "none"; 
        App.getDetails();
        App.displayDetails();
      });
    });
  }, 

  displayDetails: function() {
      var content = $("#content");

      $("#accountAddress").html(App.account);


      App.contracts.SupplyChain.deployed().then(function(instance) {
        instance.weekNo().then(function(weekNo) {
          document.getElementById("currentWeek").innerHTML = weekNo;
        })

        instance.orderLeadTime().then(function(orderLeadTime) {
          document.getElementById("orderLeadTime").innerHTML = orderLeadTime;
        });

        instance.deliveryLeadTime().then(function(deliveryLeadTime) {
          document.getElementById("deliveryLeadTime").innerHTML = deliveryLeadTime;
        });

        instance.inventory(0).then(function(array) {
          $("#ret_inv").html(array.words[0]);
        });
        instance.inventory(1).then(function(array) {
          $("#who_inv").html(array.words[0]);
        });
        instance.inventory(2).then(function(array) {
          $("#dis_inv").html(array.words[0]);
        });
        instance.inventory(3).then(function(array) {
          $("#fac_inv").html(array.words[0]);
        });


      });


       //content.show();
    },

  getDetails: function() {
    App.contracts.SupplyChain.deployed().then(function(instance) {
      instance.weekNo().then(function(weekNo) {
      instance.weekDetails(App.account, weekNo.words[0]-1).then(function(details) {
      console.log(details);
      console.log(weekNo.words[0]);
      console.log(details[3].words[0]);
        document.getElementById("demand").innerHTML = details[4].words[0];
        document.getElementById("backorder").innerHTML = details[11].words[0];
        document.getElementById("totalDemand").innerHTML = details[4].words[0] + details[11].words[0];
        document.getElementById("rec_back").innerHTML = details[1].words[0];
        document.getElementById("rec_inv").innerHTML = details[2].words[0];
        document.getElementById("ship_quan_back").innerHTML = details[5].words[0];
        document.getElementById("ship_quan_demand").innerHTML = details[6].words[0];
        document.getElementById("exp_quan").innerHTML = details[8].words[0];
        document.getElementById("exp_back").innerHTML = details[9].words[0];

        });
        });
                        

      });

  },

  order: function() {
    
    var orderAmount = document.getElementById("order").value;
    console.log(orderAmount);
    App.contracts.SupplyChain.deployed().then(function(instance) {

      const contract = new web3.eth.Contract(instance.abi);
        const fabi = contract.methods.order(orderAmount).encodeABI();
        console.log(fabi);

        web3.eth.sendTransaction({
          from:App.account,
          gasPrice: "20000000000",
          gas: "2000000",
          to: instance.address,
          data: fabi
        }, "rfjk")
        
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