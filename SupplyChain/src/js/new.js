App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  role: 0,

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
     return App.displayDetails();
    });
  },


  displayDetails: function() {
    
      var content = $("#content");
      var qs= window.location.search;
      console.log(qs);
      const urlParams = new URLSearchParams(qs);
      const v1= urlParams.get('role');
      console.log(v1);
      App.role = v1;


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

         App.account=role_add;
        
        
        instance.weekNo().then(function(weeks){

        instance.maxWeeks().then(function(maxWeeks) {


          //console.log(weeks.words[0]);
          //console.log(numWeeks);

          document.getElementById("currentWeek").innerHTML = role_add ;

        var table = document.getElementById("DetailsTable");
        var t=0;
        for(var i=0; i<weeks.words[0]; i++)
          var row = table.insertRow();

        for(i=0; i<weeks.words[0]; i++) {
            if(i==maxWeeks.words[0])
              continue;
            instance.weekDetails(role_add,i).then(function(player){
              t++;
              var pos = player[0].words[0];
              var row = table.rows[pos];
              var j;

              for(j=0;j<3;j++){
                var cell = row.insertCell(j);
                cell.innerHTML = player[j].words[0];  
              }

              var cell = row.insertCell(j);
              cell.innerHTML = player[1].words[0]+player[2].words[0];
              j++;

              for(var k=3; k<9; k++,j++) {
                var cell = row.insertCell(j);
                cell.innerHTML = player[k].words[0];    
              }            


              var cell1= row.insertCell(j);
              cell1.innerHTML= Math.abs(player[9].words[0]);
              //cell1.setAttribute('href','hello');
              cell1.style.color = 'blue';
              var blockNumber = cell1.innerHTML;
              cell1.setAttribute('type','button')
              cell1.setAttribute('onclick','App.showTransaction('+blockNumber+','+v1+')')

              if(t==weeks.words[0]-1) {
                 document.getElementById('download_btn').style.display = 'block';
                 console.log("lol");
                }
            });
          }
           


        });
      });
       });
      })
    });

    },


    showTransaction: function(blockNumber,role) {
      console.log("hey");
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
          console.log(block);

            for(var i=0; i<block.transactions.length; i++) {

              web3.eth.getTransaction(block.transactions[i]).then(function(tx) {

                if(tx.from == App.account) {
                  console.log(tx);

                  document.getElementById("bnumber").innerHTML = tx.blockNumber;
                  document.getElementById("hash").innerHTML = tx.hash;
                  document.getElementById("nonce").innerHTML = tx.nonce;
                  document.getElementById("gas").innerHTML = tx.gas;
                  document.getElementById("gas_price").innerHTML = tx.gasPrice;
                  document.getElementById("timestamp").innerHTML = new Date(block.timestamp*1000);
                  document.getElementById("creater").innerHTML = tx.from + "   ("+player+")";   
                  document.getElementById("receiver").innerHTML = tx.to + " (Smart Contract)";
                }         
              });
            }

        })
    },

    exportTableToExcel: function(tableID){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    var filename;
    console.log(App.role);
    switch(App.role) {
      case '1': filename = 'retailer_details.xls'; break;
      case '2': filename = 'wholesaler_details.xls'; break;
      case '3': filename = 'distributer_details.xls'; break;
      case '4': filename = 'factory_details.xls'; break;
    }

    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}

  };

  
$(function() {
  $(window).load(function() {
    App.init();
  });
});