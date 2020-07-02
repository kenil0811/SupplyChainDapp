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
    for(i=1; i<=7; i++) {
      for(j=1; j<=4; j++) {
        table.rows[i].insertCell(j);
      }
    }


    App.contracts.SupplyChain.deployed().then(function(instance) {

      instance.startWeek().then(function(startWeek) {
      instance.endWeek().then(function(endWeek) {
      instance.holdingCost(0).then(function(rhCost) {
      instance.holdingCost(1).then(function(whCost) {
      instance.holdingCost(2).then(function(dhCost) {
      instance.holdingCost(3).then(function(fhCost) {
      instance.lostSalesCost(0).then(function(rlCost) {
      instance.lostSalesCost(1).then(function(wlCost) {
      instance.lostSalesCost(2).then(function(dlCost) {
      instance.lostSalesCost(3).then(function(flCost) {     

      var customer_det=[];
      for(rolee=1; rolee<=4; rolee++) {
        var role=1;
        var totalCost=0;
      instance.adds(rolee).then(function(role_add){    

          instance.players(role_add).then(function(p) {
              k=p[0].words[0];
              console.log(k);
              console.log("-----");
              
          var order_det=[], demand=[], lostSales=[], shippingQuantity=[], inventoryLeft=[];
          for(i=startWeek.words[0]-1; i<endWeek.words[0]; i++) {
            var k;
            
            

            instance.weekDetails(role_add,i).then(function(player){ 
              if(k==1) {
              //console.log(player[3].words[0]);
                customer_det.push(player[3].words[0]);
              }
              order_det.push(player[7].words[0]);      
              demand.push(player[3].words[0]);
              lostSales.push(player[8].words[0]);
              shippingQuantity.push(player[4].words[0]);
              inventoryLeft.push(player[5].words[0]);

              var val,r,c;
              if(order_det.length == endWeek.words[0]-startWeek.words[0]+1) {

                App.displayGraph(order_det,k,startWeek.words[0],endWeek.words[0]);

                document.getElementById('download_btn').style.display = 'block';

                //console.log(inventoryLeft);
                val = App.variance(order_det);
                r = table.rows[1];
                c = r.cells[k];
                c.innerHTML = Math.round(val*100)/100;

                val = App.sum(demand);
                r = table.rows[2];
                c = r.cells[k];
                c.innerHTML = val;

                val = App.sum(lostSales);
                r = table.rows[3];
                c = r.cells[k];
                c.innerHTML = val;

                val = (App.sum(demand) - App.sum(lostSales))/App.sum(demand);
                r = table.rows[4];
                c = r.cells[k];
                c.innerHTML = Math.round(val*100)/100;

                val = App.sum(inventoryLeft);
                r = table.rows[5];
                c = r.cells[k];
                c.innerHTML = val;

                 val = App.sum(lostSales);
                 r = table.rows[6];
                 c = r.cells[k];
                 //console.log(val);
                 switch(k) {
                   case 1: c.innerHTML = "Rs " + val*rlCost; totalCost+=val*rlCost; break;
                   case 2: c.innerHTML = "Rs " + val*wlCost; totalCost+=val*wlCost; break;
                   case 3: c.innerHTML = "Rs " + val*dlCost; totalCost+=val*dlCost; break;
                   case 4: c.innerHTML = "Rs " + val*flCost; totalCost+=val*flCost; break;
                 }

                 val = App.sum(inventoryLeft);
                 r = table.rows[7];
                 c = r.cells[k];
                 switch(k) {
                   case 1: c.innerHTML = "Rs " + val*rhCost; totalCost+=val*rhCost; break;
                   case 2: c.innerHTML = "Rs " + val*whCost; totalCost+=val*whCost; break;
                   case 3: c.innerHTML = "Rs " + val*dhCost; totalCost+=val*dhCost; break;
                   case 4: c.innerHTML = "Rs " + val*fhCost; totalCost+=val*fhCost; break;
                 }

                role++;
                 //console.log(totalCost);
                 if(role==5) {
                   c = table.rows[9].cells[1];
                   //console.log(customer_det);
                   c.innerHTML ="<center>" + Math.round(App.variance(customer_det)*100)/100 + "</center>";

                   c = table.rows[10].cells[1];
                   c.innerHTML ="<center>" + Math.round((table.rows[1].cells[4].innerHTML / table.rows[9].cells[1].innerText)*100)/100 + "</center>";

                   c = table.rows[11].cells[1];
                   c.innerHTML ="<center>" + table.rows[4].cells[1].innerHTML + "</center>";

                   c = table.rows[12].cells[1];
                   c.innerHTML ="<center>" + "Rs. " + totalCost + "</center>";
                 }
                console.log(role);
              }


            });
          }
          });

        });
    }
    })  
      })  
      })  
      })  
      })  
      })  
      })        
      })
    })
      })
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
    },

    displayGraph: function(data,role,startWk,endWk){

      if(role<5){

      var container="";
      var title="";

        if(role==1)
           {container="chartContainer1";
            title="Retailer"}
         if(role==2)
           {container="chartContainer2";
            title="Wholesaler"}
         if(role==3)
           {container="chartContainer3";
            title="Distributor"}
         if(role==4)
           {container="chartContainer4";
            title="Factory"}

        //console.log(startWk);
        //console.log(endWk);

      
      //console.log(data);
      
      var dataPoints = [];

      for (var i = startWk; i <=endWk; i++) {
        dataPoints.push({
          x: i,
          y: data[i-startWk]
        });
      }
      var chart = new CanvasJS.Chart(container, {
        title: {
          text: title
        },
         axisX:{
       title: "Week",
       interval:1
      },
       axisY:{
       title: "Order Quantity",
       interval: 10
      },
        data: [{
          type: "line",
          indexLabel: "{y}",
          dataPoints: dataPoints
        }],
        options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
      });

      chart.render();


    }
  },

  exportTableToExcel: function(tableID){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    var filename = 'performance.xls';


    
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