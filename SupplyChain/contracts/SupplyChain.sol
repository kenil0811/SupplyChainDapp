
pragma solidity ^0.5.0;

contract SupplyChain {

    struct Details {
        uint weekNo;
        uint inventoryReceived;
        uint inventoryPrevious;
        uint demand;
        uint shippingQuantityDemand;
        uint shippingQuantityBackOrder;
        uint orderPlaced;
        uint inventoryLeft;         
        uint backOrder;
        }

    struct Player {
        uint role;
        address upstream;
        address downstream;
    }

    uint public weekNo;
    uint public deliveryLeadTime;
    uint public orderLeadTime;
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

        weekDetails[0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34].push(Details(1, 0, 50, 20, 20, 0, 0, 30, 0));
        weekDetails[0x5a528ef100931de8dd12C08d09877ac038AF04eb].push(Details(1, 0, 50, 0, 0, 0, 0, 50, 0));
        weekDetails[0xeb01d15D4C7B3c75bB801E8fFDE842E3a5e4D94C].push(Details(1, 0, 50, 0, 0, 0, 0, 50, 0));
        weekDetails[0x777B061fB4C1eB1b5F745eBe45e0f462F1e298F8].push(Details(1, 0, 50, 0, 0, 0, 0, 50, 0));


        adds[1] = 0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34;
        adds[2] = 0x5a528ef100931de8dd12C08d09877ac038AF04eb;
        adds[3] = 0xeb01d15D4C7B3c75bB801E8fFDE842E3a5e4D94C;
        adds[4] = 0x777B061fB4C1eB1b5F745eBe45e0f462F1e298F8;


        weekNo = 1;
        deliveryLeadTime = 1;
        orderLeadTime = 0;
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

        if(role != 4) {
            if(weekNo-deliveryLeadTime >= 0) 
                weekDetails[add][weekNo].inventoryReceived = weekDetails[upAdd][weekNo-deliveryLeadTime].shippingQuantityDemand + weekDetails[upAdd][weekNo-deliveryLeadTime].shippingQuantityBackOrder;

            if(weekNo-1-orderLeadTime >= 0)
                weekDetails[upAdd][weekNo].demand = weekDetails[add][weekNo-1-orderLeadTime].orderPlaced;

        }
        else
            if(weekNo-deliveryLeadTime >= 0)
                weekDetails[add][weekNo].inventoryReceived = weekDetails[add][weekNo-deliveryLeadTime].orderPlaced;

        weekDetails[add][weekNo].inventoryPrevious = weekDetails[add][weekNo-1].inventoryLeft;

        uint totalInventory = weekDetails[add][weekNo].inventoryReceived + weekDetails[add][weekNo].inventoryPrevious;

        if(totalInventory < weekDetails[add][weekNo].demand)
            weekDetails[add][weekNo].backOrder = weekDetails[add][weekNo].demand - totalInventory;

        if(totalInventory  >= 0)
            weekDetails[add][weekNo].shippingQuantityBackOrder = weekDetails[add][weekNo-1].backOrder;
        else
            weekDetails[add][weekNo].shippingQuantityBackOrder = weekDetails[add][weekNo].inventoryReceived;

        if(weekDetails[add][weekNo].demand < totalInventory)
                weekDetails[add][weekNo].shippingQuantityDemand = weekDetails[add][weekNo].demand;       
        else
            if(totalInventory >= 0)
                weekDetails[add][weekNo].shippingQuantityDemand = totalInventory;

        weekDetails[add][weekNo].inventoryLeft = totalInventory - weekDetails[add][weekNo].demand;

        inventory[players[add].role-1] = weekDetails[add][weekNo].inventoryLeft;

    }


    function order(uint _amt) public {

        weekDetails[msg.sender].push(Details(weekNo+1,0,0,0,0,0,0,0,0));
        weekDetails[msg.sender][weekNo-1].orderPlaced = _amt;

        orderState[players[msg.sender].role - 1] = 1;

        checkWeekEnd(); 
    }

}
