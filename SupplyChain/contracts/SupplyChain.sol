
pragma solidity ^0.5.0;

contract SupplyChain {

    struct Details {
        uint role;
        uint inventory;
        uint orderReceived;
        uint orderSent;
        address upstream;
    }

    // Store accounts that have voted
    mapping(address => Details) public players;

    // voted event
    event orderPlaced (
        uint indexed _orderAmount
    );

    constructor () public {
        setRoles();
    }


    function setRoles() private {
        players[0xe54F19D76FA26AA456cd59Df78DE136fEB4e4B13] = Details(1, 10, 5, 0, 0x981e807DbDEDB2C32B1f60C0Bda24c088F768D74);
        players[0x981e807DbDEDB2C32B1f60C0Bda24c088F768D74] = Details(2, 20, 15, 0, 0xF322A90f6345f27349A22d0022B986775eB7A105);
        players[0xF322A90f6345f27349A22d0022B986775eB7A105] = Details(3, 30, 25, 0, 0xCE4d47CCD7F50EE76dD69F22Ff9E9eB0ac33D25d);
        players[0xCE4d47CCD7F50EE76dD69F22Ff9E9eB0ac33D25d] = Details(4, 40, 35, 0, 0xCE4d47CCD7F50EE76dD69F22Ff9E9eB0ac33D25d);
    }

    function order1(uint _amt) public {
       address upAddreess = players[msg.sender].upstream;
       players[upAddreess].orderReceived = _amt;
 //       emit orderPlaced(_orderAmount);
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
