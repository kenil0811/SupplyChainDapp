
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
        players[0x13A72135525FE16DcECb0C0BF59F1f730aF00e27] = Details(1, 10, 5, 0, 0xBF43C96c307B2c822fbc6Ae3fC6cf203D1c8062D, 0x13A72135525FE16DcECb0C0BF59F1f730aF00e27);
        players[0xBF43C96c307B2c822fbc6Ae3fC6cf203D1c8062D] = Details(2, 20, 15, 0, 0xFe536dc6ef2167B9184946FF21D084E16e5EAd67, 0x13A72135525FE16DcECb0C0BF59F1f730aF00e27);
        players[0xFe536dc6ef2167B9184946FF21D084E16e5EAd67] = Details(3, 30, 25, 0, 0x99C230F42Da0F5391cf4EA4dc4e2e6310eFDadB9, 0xBF43C96c307B2c822fbc6Ae3fC6cf203D1c8062D);
        players[0x99C230F42Da0F5391cf4EA4dc4e2e6310eFDadB9] = Details(4, 40, 35, 0, 0x99C230F42Da0F5391cf4EA4dc4e2e6310eFDadB9, 0xFe536dc6ef2167B9184946FF21D084E16e5EAd67);
    }

    function orderUp(uint _amt) public {
       address upAddreess = players[msg.sender].upstream;
       players[upAddreess].orderReceived = _amt;
 //       emit orderPlaced(_orderAmount);
    }

    function orderDown(uint _amt) public {

        require(_amt <= players[msg.sender].inventory && _amt<= players[msg.sender].orderReceived);

        address downAddress = players[msg.sender].downstream;
        players[downAddress].inventory += _amt;
        players[msg.sender].inventory -= _amt;
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
