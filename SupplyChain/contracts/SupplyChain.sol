
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
    uint public leadTime;
    uint[4] public orderState;
    uint[4] public inventory;

    mapping(address => Player) public players;
    mapping(address => Details[]) public weekDetails;

    mapping(uint => address) public adds;
    

    event weekEnd (
    );



    constructor () public {
        setRoles();
    }


    function setRoles() private {
        players[0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34] = Player(1, 0x5a528ef100931de8dd12C08d09877ac038AF04eb, 0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34);
        players[0x5a528ef100931de8dd12C08d09877ac038AF04eb] = Player(2, 0xeb01d15D4C7B3c75bB801E8fFDE842E3a5e4D94C, 0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34);
        players[0xeb01d15D4C7B3c75bB801E8fFDE842E3a5e4D94C] = Player(3,0x777B061fB4C1eB1b5F745eBe45e0f462F1e298F8, 0x5a528ef100931de8dd12C08d09877ac038AF04eb);
        players[0x777B061fB4C1eB1b5F745eBe45e0f462F1e298F8] = Player(4, 0x777B061fB4C1eB1b5F745eBe45e0f462F1e298F8, 0xeb01d15D4C7B3c75bB801E8fFDE842E3a5e4D94C);

        weekDetails[0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34].push(Details(0, 50, 20, 20, 0, 30));
        weekDetails[0x5a528ef100931de8dd12C08d09877ac038AF04eb].push(Details(0, 50, 0, 0, 0, 50));
        weekDetails[0xeb01d15D4C7B3c75bB801E8fFDE842E3a5e4D94C].push(Details(0, 50, 0, 0, 0, 50));
        weekDetails[0x777B061fB4C1eB1b5F745eBe45e0f462F1e298F8].push(Details(0, 50, 0, 0, 0, 50));


        adds[1] = 0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34;
        adds[2] = 0x5a528ef100931de8dd12C08d09877ac038AF04eb;
        adds[3] = 0xeb01d15D4C7B3c75bB801E8fFDE842E3a5e4D94C;
        adds[4] = 0x777B061fB4C1eB1b5F745eBe45e0f462F1e298F8;


        weekNo = 1;
        leadTime = 1;
        inventory = [50, 50, 50, 50];
        orderState = [0,0,0,0];
    }


    function checkWeekEnd() private {

        if(players[msg.sender].role == 1) {
            weekDetails[msg.sender][weekNo].demand = (uint(keccak256(abi.encode(block.difficulty, block.timestamp)))%100);
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
            weekDetails[add][weekNo].inventoryReceived = weekDetails[upAdd][weekNo-leadTime].shippingQuantity;
            weekDetails[upAdd][weekNo].demand = weekDetails[add][weekNo-1].orderPlaced;
        }
        else
            weekDetails[add][weekNo].inventoryReceived = weekDetails[add][weekNo-leadTime].orderPlaced;

        weekDetails[add][weekNo].inventoryPrevious = weekDetails[add][weekNo-1].inventoryLeft;

        uint totalInventory = weekDetails[add][weekNo].inventoryReceived + weekDetails[add][weekNo].inventoryPrevious;

        if(weekDetails[add][weekNo].demand < totalInventory) {
                weekDetails[add][weekNo].shippingQuantity = weekDetails[add][weekNo].demand;
                weekDetails[add][weekNo].inventoryLeft = totalInventory - weekDetails[add][weekNo].demand;       
        }
        else {
            weekDetails[add][weekNo].shippingQuantity = totalInventory;
            weekDetails[add][weekNo].inventoryLeft = 0;
        }

        inventory[players[add].role-1] = weekDetails[add][weekNo].inventoryLeft;

    }


    function order(uint _amt) public {

        weekDetails[msg.sender].push(Details(0,0,0,0,0,0));
        weekDetails[msg.sender][weekNo-1].orderPlaced = _amt;

/*        address upAddreess = players[msg.sender].upstream;
        address downAddress = players[msg.sender].downstream;

        weekDetails[msg.sender][weekNo-1].orderPlaced = _amt;

        if(weekDetails[msg.sender].length <= weekNo)
            weekDetails[msg.sender].push(Details(0,0,0,0,0,0));

        if(weekDetails[upAddreess].length <= weekNo)
            weekDetails[upAddreess].push(Details(0,0,0,0,0,0));    

        weekDetails[msg.sender][weekNo].inventoryPrevious = weekDetails[msg.sender][weekNo-1].inventoryLeft;

        if(players[msg.sender].role != 4) {
            weekDetails[msg.sender][weekNo].inventoryReceived = weekDetails[upAddreess][weekNo-leadTime].shippingQuantity;
            weekDetails[upAddreess][weekNo].demand = weekDetails[msg.sender][weekNo-1].orderPlaced;
        }
        else {
            weekDetails[msg.sender][weekNo].inventoryReceived = weekDetails[msg.sender][weekNo-leadTime].orderPlaced;
        }

        uint totalInventory = weekDetails[msg.sender][weekNo].inventoryReceived + weekDetails[msg.sender][weekNo].inventoryPrevious;



        if(weekDetails[downAddress][weekNo-1].demand < totalInventory) {
            weekDetails[msg.sender][weekNo].shippingQuantity = weekDetails[downAddress][weekNo-1].orderPlaced;
            weekDetails[msg.sender][weekNo].inventoryLeft = totalInventory - weekDetails[downAddress][weekNo-1].demand;
        }
        else {
            weekDetails[msg.sender][weekNo].shippingQuantity = totalInventory;
            weekDetails[msg.sender][weekNo].inventoryLeft = 0;
        }
*/

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
