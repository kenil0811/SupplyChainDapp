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
     return App.displayDetails();
    });
  },


  displayDetails: function() {
      var content = $("#content");

      var qs= window.location.search;
      //var v1=qs.get("role")
      console.log(qs);
      const urlParams = new URLSearchParams(qs);
      const v1= urlParams.get('role');
      console.log(v1);


      if(v1==1){
            document.getElementById("roleDetails").innerHTML = "Retailer Details"
          }
          else if(v1==2){
            document.getElementById("roleDetails").innerHTML = "Wholesaler Details" 
          }
          else if(v1==3){
            document.getElementById("roleDetails").innerHTML = "Distributer Details" 
          }
          else if(v1==4){
            document.getElementById("roleDetails").innerHTML = "Factory Details" 
          }

      web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
      }



      App.contracts.SupplyChain.deployed().then(function(instance) {

        instance.adds(v1).then(function(role_add){ 
        
        
        instance.weekNo().then(function(weeks){
          //console.log(weeks.c[0]);
          //console.log(numWeeks);

          document.getElementById("accountAddress").innerHTML = role_add;
          document.getElementById("currentWeek").innerHTML = weeks.c[0];
          

        var table = document.getElementById("DetailsTable");
        for(var i=0; i<weeks.c[0]; i++)
          var row = table.insertRow();

        var a=0;
        for(i=0; i<weeks.c[0]; i++) {
              var pos, row;
            instance.weekDetails(role_add,i).then(function(player){   

            console.log(player);
            console.log("---");           
              pos = player[0].c[0];
              console.log(pos);
              row = table.rows[pos];

              for(var j=0; j<4; j++){
                var cell = row.insertCell(j);
                cell.innerHTML = player[j].c[0] * player[j].s;  
              }

              var cell = row.insertCell(4);
              cell.innerHTML = 0;
              if(a!=0) {
                console.log(a);
                instance.weekDetails(role_add,a-1).then(function(player_old){
                  var cell = row.cells[4];
                  console.log(player_old[8].c[0]);
                  cell.innerHTML = player_old[8].c[0] * player_old[j].s; 
                });
              }

              for(var j=5; j<=player.length; j++){
                var cell = row.insertCell(j);
                console.log(player.length);
                cell.innerHTML = player[j-1].c[0] * player[j-1].s;  
              }
              a++;
            });
          }
            
        });
       });
      })
    });

    }


  };

  
$(function() {
  $(window).load(function() {
    App.init();
  });
});