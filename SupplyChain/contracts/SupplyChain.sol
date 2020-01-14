
pragma solidity ^0.5.0;

contract SupplyChain {

    struct Details {
        uint inventoryReceived;
        uint inventoryPrevious;
        uint demand;
        uint shippingQuantity;
        uint orderPlaced;
        uint inventoryLeft;         
        }

    struct Player {
        uint role;
        address upstream;
        address downstream;
    }

    uint public weekNo;
    uint private leadTime;
    uint[4] private orderState;
    uint[4] public inventory;

    mapping(address => Player) public players;
    mapping(address => Details[]) public weekDetails;

    

    event weekEnd (
    );



    constructor () public {
        leadTime = 1;
        setRoles();
    }


    function setRoles() private {
        players[0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34] = Player(1, 0x5a528ef100931de8dd12C08d09877ac038AF04eb, 0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34);
        players[0x5a528ef100931de8dd12C08d09877ac038AF04eb] = Player(2, 0xeb01d15D4C7B3c75bB801E8fFDE842E3a5e4D94C, 0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34);
        players[0xeb01d15D4C7B3c75bB801E8fFDE842E3a5e4D94C] = Player(3,0x777B061fB4C1eB1b5F745eBe45e0f462F1e298F8, 0x5a528ef100931de8dd12C08d09877ac038AF04eb);
        players[0x777B061fB4C1eB1b5F745eBe45e0f462F1e298F8] = Player(4, 0x777B061fB4C1eB1b5F745eBe45e0f462F1e298F8, 0xeb01d15D4C7B3c75bB801E8fFDE842E3a5e4D94C);

        weekDetails[0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34].push(Details(0, 40, 0, 0, 0, 0));
        weekDetails[0x5a528ef100931de8dd12C08d09877ac038AF04eb].push(Details(0, 40, 0, 0, 0, 0));
        weekDetails[0xeb01d15D4C7B3c75bB801E8fFDE842E3a5e4D94C].push(Details(0, 40, 0, 0, 0, 0));
        weekDetails[0x777B061fB4C1eB1b5F745eBe45e0f462F1e298F8].push(Details(0, 40, 0, 0, 0, 0));

        weekNo = 1;
        addWeeks(0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34);
        addWeeks(0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34);
        addWeeks(0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34);
        inventory = [100, 20, 30, 40];
        orderState = [0,0,0,0];
    }

    function addWeeks(address actor) public {
        weekDetails[actor].push(Details(5,20,10,34,20,10));
        weekNo++;
    }


    function checkWeekEnd() private {

        if(players[msg.sender].role == 1)  
            weekDetails[msg.sender][weekNo+1].demand = (uint(keccak256(abi.encode(block.difficulty, block.timestamp)))%100);

        if(orderState[0]==1 && orderState[1]==1 && orderState[2]==1 && orderState[3]==1 ) {
            orderState = [0, 0, 0, 0];
            weekNo++;
            emit weekEnd();
        }
    }

    function order(uint _amt) public {
        address upAddreess = players[msg.sender].upstream;
        address downAddreess = players[msg.sender].downstream;

        if(players[msg.sender].role == 4)
            weekDetails[msg.sender][weekNo].inventoryReceived = weekDetails[upAddreess][weekNo-leadTime].orderPlaced;
        else
            weekDetails[msg.sender][weekNo].inventoryReceived = weekDetails[upAddreess][weekNo-leadTime].shippingQuantity;
        
        weekDetails[msg.sender][weekNo].inventoryPrevious = weekDetails[msg.sender][weekNo-1].inventoryLeft;

        uint totalInventory = weekDetails[msg.sender][weekNo].inventoryReceived + weekDetails[msg.sender][weekNo].inventoryPrevious;

        if (players[msg.sender].role != 4) {
            if(weekNo-leadTime > 0)
                weekDetails[upAddreess][weekNo].demand = weekDetails[msg.sender][weekNo-leadTime].orderPlaced;
            else
                weekDetails[upAddreess][weekNo].demand = 0;
        }

        if(weekDetails[msg.sender][weekNo].demand < totalInventory) {
            weekDetails[msg.sender][weekNo].shippingQuantity = weekDetails[msg.sender][weekNo].demand;
            weekDetails[msg.sender][weekNo].inventoryLeft = totalInventory - weekDetails[msg.sender][weekNo].demand;
        }
        else {
            weekDetails[msg.sender][weekNo].shippingQuantity = totalInventory;
            weekDetails[msg.sender][weekNo].inventoryLeft = 0;
        }


        weekDetails[msg.sender][weekNo].orderPlaced = _amt;

        orderState[players[msg.sender].role - 1] = 1;

        checkWeekEnd();
    }

 /*   function fillStock(uint _amt) public {

        require(players[msg.sender].role==4);
        weekDetails[msg.sender][weekNo].inventoryPrevious = weekDetails[msg.sender][weekNo-1].inventoryLeft;
        weekDetails[msg.sender][weekNo].inventoryReceived = weekDetails[msg.sender][weekNo-leadTime].orderPlaced;
        weekDetails[msg.sender][weekNo].orderPlaced = _amt;
//        players[msg.sender].inventory += _amt;
//        inventory[players[msg.sender].role - 1] += _amt;
//        emit orderSent(_amt);
    }

/*function clearStock(uint _amt) public {
       // require(_amt <= players[msg.sender].inventory && _amt<= players[msg.sender].orderReceived);
        players[msg.sender].inventory -= _amt;
        inventory[players[msg.sender].role-1] -= _amt;

        players[msg.sender].orderReceived -= _amt;
        //emit orderSent(_amt);
    }


    function orderDown(uint _amt) public {

        require(_amt <= players[msg.sender].inventory && _amt<= players[msg.sender].orderReceived);

        address downAddress = players[msg.sender].downstream;
        players[downAddress].inventory += _amt;
        inventory[players[downAddress].role-1] += _amt;

        players[msg.sender].inventory -= _amt;
        inventory[players[msg.sender].role-1] -= _amt;

        players[msg.sender].orderReceived -= _amt;

        emit orderSent(_amt);
    }
*/
}
