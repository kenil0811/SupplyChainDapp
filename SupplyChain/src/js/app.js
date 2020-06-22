App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  role: null,

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

      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("SupplyChain.json", function(supplyChain) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.SupplyChain = TruffleContract(supplyChain);
      // Connect provider to interact with contract
      App.contracts.SupplyChain.setProvider(App.web3Provider);

    //App.listenForEvents();
    var content = $("#content");
    var qs= window.location.search;
    const urlParams = new URLSearchParams(qs);
    App.role= urlParams.get('role');
    console.log(App.role);

    const v1=App.role;
    
    if(v1==1){
      document.getElementById("player").innerHTML = "Retailer login"
    }
    else if(v1==2){
      document.getElementById("player").innerHTML = "Wholesaler login" 
    }
    else if(v1==3){
      document.getElementById("player").innerHTML = "Distributer login" 
    }
    else if(v1==4){
      document.getElementById("player").innerHTML = "Factory login" 
    }
    });
  },

  
  checkValidity: function() {

    var password = document.getElementById("password").value;

    App.contracts.SupplyChain.deployed().then(function(instance) {

      instance.adds(App.role).then(function(exp_add) {
        console.log(exp_add);
        // if(exp_add !== address) {
        //   //window.location.href = "error.html?val=1";
        //     console.log("incorrect");
        //     return;
        // }

      web3.eth.personal.unlockAccount(exp_add, password, function(error, res){
      if(error){
        window.location.href = "error.html?val=2";
        console.log("incorrect");
        return;
      }
      else if(res==true) {
        window.location.href = "player.html?role=" + App.role;

      }
      })
      })

    })
  }
};
  
$(function() {
  $(window).load(function() {
    App.init();
  });
});