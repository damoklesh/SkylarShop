var PoToken = artifacts.require("./PoToken.sol");
var Shop = artifacts.require("./Shop.sol");

module.exports = async function(deployer) {
  await deployer.deploy(PoToken,1000000);
  console.log(PoToken.address);
  await deployer.deploy(Shop,PoToken.address);
};
