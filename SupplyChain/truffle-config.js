var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "shrimp you govern offer disagree sing stumble music swamp advice embrace dirt";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
  	development: {
  		host: "127.0.0.1",
  		port: 7545,
  		network_id: "*"
  	},
  	develop: {
  		port: 7545
  	}
 	/*ropsten: {
		provider: function() {
		return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/1d295188684b4875ad30072bcae83100")
		},*/
}
};
