
pragma solidity ^0.5.0;

contract SupplyChain {

    struct Details {
        uint role;
        uint inventory;
        uint orderReceived;
        uint orderSent;
        address upstream;
        address downstream;
    }

    // Store accounts that have voted
    mapping(address => Details) public players;

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
        players[0x4Fa7a4ffDe1a72b3921aC2EfCCadF22EDb146F5D] = Details(1, 100, 20, 0, 0xa778E73d7081fF7f48269f535dcE0974d3572168, 0x4Fa7a4ffDe1a72b3921aC2EfCCadF22EDb146F5D);
        players[0xa778E73d7081fF7f48269f535dcE0974d3572168] = Details(2, 20, 15, 0, 0xFd74191fb585b9e0c10Ffc2c0b45F574773eA2Cf, 0x4Fa7a4ffDe1a72b3921aC2EfCCadF22EDb146F5D);
        players[0xFd74191fb585b9e0c10Ffc2c0b45F574773eA2Cf] = Details(3, 30, 25, 0, 0x976281a8daE01Db0029007681E61Bc3b5C22a6F4, 0xa778E73d7081fF7f48269f535dcE0974d3572168);
        players[0x976281a8daE01Db0029007681E61Bc3b5C22a6F4] = Details(4, 40, 35, 0, 0x976281a8daE01Db0029007681E61Bc3b5C22a6F4, 0xFd74191fb585b9e0c10Ffc2c0b45F574773eA2Cf);

        inventory = [100, 20, 30, 40];
    }

    function orderUp(uint _amt) public {
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



    /*
    function vote (uint _DetailsId) public {
        // require that they haven't voted before
        //require(!voters[msg.sender]);

        // require a valid Details
        //require(_DetailsId > 0 && _DetailsId <= DetailssCount);

        // record that voter has voted
        //voters[msg.sender] = true;

        // update Details vote Count
      //  Detailss[_DetailsId].voteCount ++;

        // trigger voted event
        //emit votedEvent(_DetailsId);
    } */
}
