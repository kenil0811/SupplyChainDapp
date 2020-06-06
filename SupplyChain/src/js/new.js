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
    
      var content = $("#content");
      var qs= window.location.search;
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
        $("#accountAddress").html("Your Account: " + account);
      }



      App.contracts.SupplyChain.deployed().then(function(instance) {

        instance.adds(v1).then(function(role_add){ 
        
        
        instance.weekNo().then(function(weeks){
          //console.log(weeks.words[0]);
          //console.log(numWeeks);

          document.getElementById("currentWeek").innerHTML = role_add ;

        var table = document.getElementById("DetailsTable");
        console.log(weeks.words[0]);
        for(var i=0; i<weeks.words[0]; i++)
          var row = table.insertRow();

        for(i=0; i<weeks.words[0]; i++) {
            instance.weekDetails(role_add,i).then(function(player){
              var pos = player[0].words[0];
              console.log(pos);
              console.log(pos);
              var row = table.rows[pos];
              console.log(player);
              for(var j = 0;j<7;j++){
                var cell = row.insertCell(j);
                //console.log(j);
                console.log(player[j]);
                console.log(player[j].words[0]);
                cell.innerHTML = player[j].words[0];  
              }
              var cell1= row.insertCell(j);
              cell1.innerHTML= Math.abs(player[3].words[0]-player[4].words[0]); 
              j++;
              var cell1= row.insertCell(j);
              cell1.innerHTML= Math.abs(player[7].words[0]);
              //cell1.setAttribute('href','hello');
              cell1.style.color = 'blue';
              var blockNumber = cell1.innerHTML;
              cell1.setAttribute('type','button')
              cell1.setAttribute('onclick','App.showTransaction('+blockNumber+','+v1+')')
            });
          }
           


        });
       });
      })
    });

    },


    showTransaction: function(blockNumber,role) {
      //alert('Hello');
      var modal = document.getElementById("transactionModal");
       if(blockNumber!=0){
          modal.style.display = "block"; 
       }
       

      var closeBtn1 = document.getElementById("closeBtn");
      //var closeBtn2 = document.getElementById("closeBtn2");

       closeBtn1.onclick = function() {
          modal.style.display = "none";
        } 

        var player;
        if(role==1){
             player = "Retailer";          
        }
        else if(role==2){
             player = "Wholesaler";    
        }
        else if(role==3){
            player = "Distributer"; 
        }
        else if(role==4){
            player = "Factory"; 
        }

        //fetch data from the block
        web3.eth.getBlock(blockNumber).then(function(block){

            web3.eth.getTransaction(block.transactions[0]).then(function(tx) {
            console.log(tx);

            var num = tx.blockNumber;
            var hash = tx.hash;
            var time = block.timestamp;
            var from = tx.from;

            document.getElementById("bnumber").innerHTML = num;
            document.getElementById("hash").innerHTML = hash;
            document.getElementById("timestamp").innerHTML = time;
            document.getElementById("creater").innerHTML = from+"   ("+player+")";            
            });

        })
    }

  };

  
$(function() {
  $(window).load(function() {
    App.init();
  });
});