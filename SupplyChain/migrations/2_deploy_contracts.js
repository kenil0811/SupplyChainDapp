var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(SupplyChain,"0xB92D238ea91Ea398CdC2b885B8F4395Dd5C4Bf34","0x5a528ef100931de8dd12C08d09877ac038AF04eb","0xeb01d15D4C7B3c75bB801E8fFDE842E3a5e4D94C","0x777B061fB4C1eB1b5F745eBe45e0f462F1e298F8");
};