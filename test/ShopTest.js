const { assert } = require("chai");
const shopContract = artifacts.require("./Shop.sol");
const poTokenStorage = artifacts.require("./PoToken.sol");
const itemDndContract = artifacts.require("./ItemDndNFT.sol");

contract("Shop", accounts => {
    it("should add a product", async () => {

        ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
        // Get accounts
        const [ initialHolder, recipient, anotherAccount ] = accounts;

        // Deploy contract
        const shopContractInstance = await shopContract.deployed();
        const itemDndNFTInstance = await itemDndContract.deployed();

        // Then
        const obj = await shopContractInstance.addItem("Flaming Bastard Sword", 5, 8400,{from : initialHolder});
        
        // TODO this element is always a default item.
        //const item = await shopContractInstance.ownedItems.call(ZERO_ADDRESS,8400);
        console.log("address: " + initialHolder);

        // expect
        // The shop address should own one item
        
        //assert.equal(item.value.toNumber(),8400,"The item value doesnt match");
    });

    it("buy a product", async () => {

        // Get accounts
        const [ initialHolder, recipient, anotherAccount ] = accounts;
        const itemPrice = 8400;

        // Deploy contract
        const poTokenInstance = await poTokenStorage.deployed();
        const shopContractInstance = await shopContract.deployed();
        const itemDndNFTInstance = await itemDndContract.deployed();

        // Then
        // Add a new item to the shop
        await shopContractInstance.addItem("Flaming Bastard Sword", 5, itemPrice,{from : initialHolder});

        // Give tokens to testing user
        await poTokenInstance.transfer(recipient,8400);

        // Approve the shop contract to manage funds.
        await poTokenInstance.approve(shopContract.address, itemPrice, {from: recipient});

        const obj = await shopContractInstance.buyItem(1, 8400,{from : recipient});
        
        // expect
        // recipient should have the item now
        const recipientBalance = await itemDndNFTInstance.balanceOf(recipient);

        assert.equal(1,recipientBalance);

    });

});