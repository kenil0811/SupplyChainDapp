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
     return App.displayDetails();
    });
  },


  displayDetails: function() {

    var table = document.getElementById("DetailsTable");
    for(i=0; i<7; i++) 
      var row = table.insertRow();  


    App.contracts.SupplyChain.deployed().then(function(instance) {

      for(rolee=1; rolee<=4; rolee++) {
        var role=1;
        var totalCost=0;
      instance.adds(rolee).then(function(role_add){                 
        instance.weekNo().then(function(weeks){

          var order_det=[], demand=[], backorder=[], shippingQuantityDemand=[], inventoryLeft=[];
          for(i=0; i<10; i++) {
            instance.weekDetails(role_add,i).then(function(player){  
              order_det.push(player[10].words[0]);
              demand.push(player[4].words[0]);
              backorder.push(player[11].words[0]);
              shippingQuantityDemand.push(player[6].words[0]);
              inventoryLeft.push(player[7].words[0]*(1-player[7].negative));

              var val,r,c;
              if(order_det.length == 10) {
                //console.log(inventoryLeft);
                val = App.variance(order_det);
                r = table.rows[1];
                c = r.insertCell(role);
                c.innerHTML = Math.round(val*100)/100;

                val = App.sum(demand);
                r = table.rows[2];
                c = r.insertCell(role);
                c.innerHTML = val;

                val = App.sum(backorder);
                r = table.rows[3];
                c = r.insertCell(role);
                c.innerHTML = val;

                val = App.sum(shippingQuantityDemand)/App.sum(demand);
                r = table.rows[4];
                c = r.insertCell(role);
                c.innerHTML = Math.round(val*100)/100;

                val = App.sum(inventoryLeft);
                r = table.rows[5];
                c = r.insertCell(role);
                c.innerHTML = val;

                val = App.sum(backorder);
                r = table.rows[6];
                c = r.insertCell(role);
                // console.log(val);
                switch(role) {
                  case 1: c.innerHTML = "Rs " + val*10; totalCost+=val*10; break;
                  case 2: c.innerHTML = "Rs " + val*8; totalCost+=val*8; break;
                  case 3: c.innerHTML = "Rs " + val*6; totalCost+=val*6; break;
                  case 4: c.innerHTML = "Rs " + val*2; totalCost+=val*2; break;
                }

                val = App.sum(inventoryLeft);
                r = table.rows[7];
                c = r.insertCell(role);
                switch(role) {
                  case 1: c.innerHTML = "Rs " + val*5; totalCost+=val*5; break;
                  case 2: c.innerHTML = "Rs " + val*4; totalCost+=val*4; break;
                  case 3: c.innerHTML = "Rs " + val*3; totalCost+=val*3; break;
                  case 4: c.innerHTML = "Rs " + val*1; totalCost+=val*1; break;
                }

                role++;
                console.log(totalCost);
                if(role==5) {
                  var cost = document.getElementById("totalCost");
                  cost.innerHTML = "Total Supply Chain Cost = Rs " + totalCost;

                }
                console.log(role);
              }


            });
          }

        });
       });
    }
      });
    },

    variance: function(arr) {
      let sum = App.sum(arr);
      
      //console.log(sum);
      let mean = sum/arr.length;
      //console.log(mean);

      let sum2=0;
      for(i=0; i<arr.length; i++) {
        sum2 += (arr[i]-mean)*(arr[i]-mean);
      }
      return sum2/(arr.length-1);
    },

    max: function(a,b) {
      return a>b ? a : b;
    },

    sum: function(arr) {
      let s=0;
      for(i=0; i<arr.length; i++)
        s += arr[i];
      return s;
    }


  };

  
$(function() {
  $(window).load(function() {
    App.init();
  });
});