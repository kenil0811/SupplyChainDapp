
pragma solidity ^0.5.0;

contract SupplyChain {

    struct Details {
        uint weekNo;
        int inventoryReceivedBackOrder;
        int inventoryReceivedDemand;
        int inventoryPrevious;
        int demand;
        int shippingQuantityBackOrder;
        int shippingQuantityDemand;
        int inventoryLeft;
        int expectedQuantity;
        int expectedQuantityBackOrder;        
        int orderPlaced;
        int backOrder;
        int blockNumber;
        }

    struct Player {
        uint role;
        address upstream;
        address downstream;
    }

    uint public weekNo;
    uint public maxWeeks;
    uint public startWeek; 
    uint public endWeek;
    uint public deliveryLeadTime;
    uint public orderLeadTime;
    uint[4] public orderState;
    int[4] public inventory;
    uint[4] public holdingCost;
    uint[4] public backOrderCost;
    int[] private customerDemand;

    mapping(address => Player) public players;
    mapping(address => Details[]) public weekDetails;

    mapping(uint => address) public adds;
    

    event weekEnd (
    );



    constructor (address add1, address add2, address add3, address add4, uint totalWeeks, uint start, uint end, uint dLeadTime, uint oLeadTime, int initialInv, uint[4] memory hCost, uint[4] memory boCost, int[] memory distribution) public {
        players[add1] = Player(1, add2, add1);
        players[add2] = Player(2, add3, add1);
        players[add3] = Player(3,add4, add2);
        players[add4] = Player(4, add4, add3);

        if(initialInv>=distribution[0])
            weekDetails[add1].push(Details(1, 0, 0, initialInv, distribution[0], 0, distribution[0], initialInv-distribution[0], 0, 0, 0, 0, 0));
        else
            weekDetails[add1].push(Details(1, 0, 0, initialInv, distribution[0], 0, initialInv, initialInv-distribution[0], 0, 0, 0, distribution[0]-initialInv, 0));
        weekDetails[add2].push(Details(1, 0, 0, initialInv, 0, 0, 0, initialInv, 0, 0, 0, 0, 0));
        weekDetails[add3].push(Details(1, 0, 0, initialInv, 0, 0, 0, initialInv, 0, 0, 0, 0, 0));
        weekDetails[add4].push(Details(1, 0, 0, initialInv, 0, 0, 0, initialInv, 0, 0, 0, 0, 0));

        adds[1] = add1;
        adds[2] = add2;
        adds[3] = add3;
        adds[4] = add4;

        weekNo = 1;
        deliveryLeadTime = 1;
        orderLeadTime = 0;
        inventory = [initialInv-distribution[0], initialInv, initialInv, initialInv];
        orderState = [0,0,0,0];
        retailerDemand = [87,77,76,80,88,67,95,81,85,77,75,88,87,80,103,96,97,88,66,67,79,84,90,79,81]; 
    }


    function checkWeekEnd() private {

        if(players[msg.sender].role == 1) {
            weekDetails[msg.sender][weekNo].demand = retailerDemand[weekNo];
        }

        

        if(orderState[0]==1 && orderState[1]==1 && orderState[2]==1 && orderState[3]==1 ) {
            orderState = [0, 0, 0, 0];

            updateDetails(1, adds[1], adds[2]);
            updateDetails(2, adds[2], adds[3]);
            updateDetails(3, adds[3], adds[4]);
            updateDetails(4, adds[4], adds[4]);

            weekNo++;
            emit weekEnd();
        }
    }

    function updateDetails (uint role, address add, address upAdd) private{

        // setting inventory received
        if(role != 4) {
            if(weekNo - orderLeadTime - deliveryLeadTime >= 0) {
                weekDetails[add][weekNo].inventoryReceivedBackOrder = weekDetails[upAdd][weekNo-orderLeadTime-deliveryLeadTime].shippingQuantityBackOrder;
                weekDetails[add][weekNo].inventoryReceivedDemand = weekDetails[upAdd][weekNo-orderLeadTime-deliveryLeadTime].shippingQuantityDemand;
            }
            //setting demand
            if(int(weekNo-1-orderLeadTime) >= 0)
                weekDetails[upAdd][weekNo].demand = weekDetails[add][weekNo-1-orderLeadTime].orderPlaced;

        }
        else {
            if(int(weekNo-orderLeadTime-1-deliveryLeadTime) >= 0)
                weekDetails[add][weekNo].inventoryReceivedDemand = weekDetails[add][weekNo-orderLeadTime-1-deliveryLeadTime].orderPlaced;
        }
        //previous inventory
        weekDetails[add][weekNo].inventoryPrevious = weekDetails[add][weekNo-1].inventoryLeft;

        int beginInventory = weekDetails[add][weekNo].inventoryReceivedBackOrder + weekDetails[add][weekNo].inventoryReceivedDemand + max(0, weekDetails[add][weekNo].inventoryPrevious);
        int prevInventory = weekDetails[add][weekNo].inventoryPrevious;

        //shipping quantity BackOrder
        if(prevInventory > 0)
            weekDetails[add][weekNo].shippingQuantityBackOrder = 0;
        else if(beginInventory >= 0) {
            if(beginInventory >= abs(prevInventory))
                weekDetails[add][weekNo].shippingQuantityBackOrder = abs(prevInventory);
            else
                weekDetails[add][weekNo].shippingQuantityBackOrder = beginInventory;
        }

        //shipping quantity demand
        if(beginInventory - weekDetails[add][weekNo].shippingQuantityBackOrder >= weekDetails[add][weekNo].demand) {
            weekDetails[add][weekNo].shippingQuantityDemand = weekDetails[add][weekNo].demand;       
        }
        else { 
                weekDetails[add][weekNo].shippingQuantityDemand = beginInventory - weekDetails[add][weekNo].shippingQuantityBackOrder;
        }

        //inventory left
        weekDetails[add][weekNo].inventoryLeft = beginInventory - weekDetails[add][weekNo].shippingQuantityBackOrder - weekDetails[add][weekNo].demand;

        //expected quantity
        if(weekNo-orderLeadTime-deliveryLeadTime >= 0)
            weekDetails[add][weekNo].expectedQuantity = weekDetails[add][weekNo-orderLeadTime-deliveryLeadTime].orderPlaced;

        //expected quantity BackOrder
        if(role != 4) {
            if(weekNo-orderLeadTime-deliveryLeadTime >= 0)
                weekDetails[add][weekNo].expectedQuantityBackOrder = weekDetails[upAdd][weekNo-orderLeadTime-deliveryLeadTime].backOrder;                
        }

        //backOrder
        weekDetails[add][weekNo].backOrder = abs(min(0, int(weekDetails[add][weekNo].inventoryLeft)));

        inventory[players[add].role-1] = max(0,weekDetails[add][weekNo].inventoryLeft);

    }


    function order(int _amt) public {
        weekDetails[msg.sender].push(Details(weekNo+1,0,0,0,0,0,0,0,0,0,0,0));
        weekDetails[msg.sender][weekNo-1].orderPlaced = _amt;

        orderState[players[msg.sender].role - 1] = 1;
        checkWeekEnd(); 
    }

    function max(int a, int b) private pure returns (int){
        return a>b ? a : b;
    }

    function min(int a, int b) private pure returns (int){
        return a<b ? a : b;
    }

    function abs(int a) private pure returns (int){
        return a>0 ? int(a) : int(0-a);
    }

}
