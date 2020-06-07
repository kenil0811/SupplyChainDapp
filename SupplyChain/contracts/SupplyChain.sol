
pragma solidity ^0.5.0;

contract SupplyChain {

    struct Details {
        uint weekNo;
        uint inventoryReceived;
        uint inventoryPrevious;
        uint demand;
        uint shippingQuantity;
        uint inventoryLeft;
        uint expextedQuantity;
        uint orderPlaced;
        uint lostSales;
        uint blockNumber;         
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
    uint[4] public inventory;
    uint[4] public holdingCost;
    uint[4] public lostSalesCost;

    mapping(address => Player) public players;
    mapping(address => Details[]) public weekDetails;

    mapping(uint => address) public adds;
    

    event weekEnd (
    );



    constructor(address add1, address add2, address add3, address add4, uint totalWeeks, uint start, uint end, uint dLeadTime, uint oLeadTime, uint[4] memory hCost, uint[4] memory lsCost) public{
        players[add1] = Player(1, add2, add1);
        players[add2] = Player(2, add3, add1);
        players[add3] = Player(3,add4, add2);
        players[add4] = Player(4, add4, add3);

        weekDetails[add1].push(Details(1, 0, 50, 30, 30, 20, 0, 0, 0, 0));
        weekDetails[add2].push(Details(1, 0, 50, 0, 0, 50, 0, 0, 0, 0));
        weekDetails[add3].push(Details(1, 0, 50, 0, 0, 50, 0, 0, 0, 0));
        weekDetails[add4].push(Details(1, 0, 50, 0, 0, 50, 0, 0, 0, 0));


        adds[1] = add1;
        adds[2] = add2;
        adds[3] = add3;
        adds[4] = add4;


        weekNo = 1;
        maxWeeks = totalWeeks;
        startWeek = start;
        endWeek = end;
        holdingCost = hCost;
        lostSalesCost = lsCost;

        deliveryLeadTime = dLeadTime;
        orderLeadTime = oLeadTime;

        inventory = [20, 50, 50, 50];
        orderState = [0,0,0,0];
    }


    function checkWeekEnd() private {

        if(players[msg.sender].role == 1) {
            weekDetails[msg.sender][weekNo].demand = uint(40 + (int(keccak256(abi.encode(block.difficulty, block.timestamp)))%15));
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

    function updateDetails (uint role, address add, address upAdd) public{
        weekDetails[add][weekNo].inventoryPrevious = weekDetails[add][weekNo-1].inventoryLeft;
        if(role != 4) {
            weekDetails[add][weekNo].inventoryReceived = weekDetails[upAdd][weekNo-deliveryLeadTime].shippingQuantity;
            if(weekNo-1-orderLeadTime >= 0)
                weekDetails[upAdd][weekNo].demand = weekDetails[add][weekNo-1-orderLeadTime].orderPlaced;
        }
        else
            if(int(weekNo-deliveryLeadTime-1) >= 0)
                weekDetails[add][weekNo].inventoryReceived = weekDetails[add][weekNo-deliveryLeadTime-1].orderPlaced;

        weekDetails[add][weekNo].inventoryPrevious = weekDetails[add][weekNo-1].inventoryLeft;

        uint beginInventory = weekDetails[add][weekNo].inventoryReceived + weekDetails[add][weekNo].inventoryPrevious;

        if(weekDetails[add][weekNo].demand < beginInventory)
                weekDetails[add][weekNo].shippingQuantity = weekDetails[add][weekNo].demand;

        else
            weekDetails[add][weekNo].shippingQuantity = beginInventory;

        weekDetails[add][weekNo].inventoryLeft = beginInventory - weekDetails[add][weekNo].shippingQuantity;

        weekDetails[add][weekNo].expextedQuantity = weekDetails[add][weekNo-1].orderPlaced;

        weekDetails[add][weekNo].lostSales = weekDetails[add][weekNo].demand - weekDetails[add][weekNo].shippingQuantity;

        inventory[players[add].role-1] = weekDetails[add][weekNo].inventoryLeft;

    }


    function order(uint _amt) public {

        require(weekNo<=maxWeeks);

        weekDetails[msg.sender].push(Details(weekNo+1,0,0,0,0,0,0,0,0,0));
        weekDetails[msg.sender][weekNo-1].orderPlaced = _amt;
        weekDetails[msg.sender][weekNo-1].blockNumber = block.number;

        orderState[players[msg.sender].role - 1] = 1;

        checkWeekEnd(); 
    }
}
