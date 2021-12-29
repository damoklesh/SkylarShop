const { assert } = require("chai");
const poTokenStorage = artifacts.require("./PoToken.sol");

contract("PoToken", accounts => {
    it("should return the initial supply", async () => {

        // Get accounts
        const [ initialHolder, recipient, anotherAccount ] = accounts;

        // Deploy contract
        const poTokenInstance = await poTokenStorage.deployed();

        // Then
        const totalSupply = await poTokenInstance.totalSupply();
        const initialHolderSupply = await poTokenInstance.balanceOf(initialHolder);

        // expect
        assert.equal(totalSupply.toNumber(),initialHolderSupply.toNumber(),"the total supply should be tota Supply");
    });

    it("should send an amount of tokens", async () => {

        // Get accounts
        const [ initialHolder, recipient, anotherAccount ] = accounts;

        // Deploy contract
        const poTokenInstance = await poTokenStorage.deployed();

        // Then
        await poTokenInstance.transfer(recipient,3);
        const recipientSupply = await poTokenInstance.balanceOf(recipient);

        // expect
        assert.equal(3,recipientSupply.toNumber(),"the recipient supply should be 3");
    });

});