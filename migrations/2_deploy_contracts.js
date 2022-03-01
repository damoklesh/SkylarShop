var PoToken = artifacts.require("./PoToken.sol");
var Shop = artifacts.require("./Shop.sol");
var ItemDndNFT = artifacts.require("./ItemDndNFT.sol");

module.exports = async function(deployer) {
  await deployer.deploy(PoToken,1000000);
  await deployer.deploy(Shop,PoToken.address);
  await deployer.deploy(ItemDndNFT);
};
