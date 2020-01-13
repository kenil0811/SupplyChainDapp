
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
        mapping (uint => Details) week;
    }


    // Store accounts that have voted
    mapping(address => Player) public players;


    uint[4] public inventory;

    // voted event
    event orderPlaced (
        uint indexed _orderAmount
    );

    event orderSent (
        uint indexed _amt
    );

    constructor () public {
        setRoles();
    }


    function setRoles() private {
        players[0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34] = Player(1, 0x5a528ef100931de8dd12C08d09877ac038AF04eb, 0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34);
        players[0x5a528ef100931de8dd12C08d09877ac038AF04eb] = Player(2, 0xeb01d15D4C7B3c75bB801E8fFDE842E3a5e4D94C, 0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34);
        players[0xeb01d15D4C7B3c75bB801E8fFDE842E3a5e4D94C] = Player(3,0x777B061fB4C1eB1b5F745eBe45e0f462F1e298F8, 0x5a528ef100931de8dd12C08d09877ac038AF04eb);
        players[0x777B061fB4C1eB1b5F745eBe45e0f462F1e298F8] = Player(4, 0x777B061fB4C1eB1b5F745eBe45e0f462F1e298F8, 0xeb01d15D4C7B3c75bB801E8fFDE842E3a5e4D94C);

        players[0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34].week[0] = Details(0, 40, 0, 0, 0, 0);
        players[0x5a528ef100931de8dd12C08d09877ac038AF04eb].week[0] = Details(0, 40, 0, 0, 0, 0);
        players[0xeb01d15D4C7B3c75bB801E8fFDE842E3a5e4D94C].week[0] = Details(0, 40, 0, 0, 0, 0);
        players[0x777B061fB4C1eB1b5F745eBe45e0f462F1e298F8].week[0] = Details(0, 40, 0, 0, 0, 0);

        inventory = [100, 20, 30, 40];
    }

/*    function orderUp(uint _amt) public {
       address upAddreess = players[msg.sender].upstream;
       players[upAddreess].orderReceived += _amt;
 //       emit orderPlaced(_orderAmount);
    }

    function fillStock(uint _amt) public {
        players[msg.sender].inventory += _amt;
        inventory[players[msg.sender].role - 1] += _amt;
        emit orderSent(_amt);
    }

    function clearStock(uint _amt) public {
        require(_amt <= players[msg.sender].inventory && _amt<= players[msg.sender].orderReceived);
        players[msg.sender].inventory -= _amt;
        inventory[players[msg.sender].role-1] -= _amt;

        players[msg.sender].orderReceived -= _amt;
        emit orderSent(_amt);
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
