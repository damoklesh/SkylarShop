const { assert } = require("chai");
const itemDndNFTStorage = artifacts.require("./ItemDndNFT.sol");

contract("ItemDndNFT", accounts => {
    it("should mint the first token to the owner address", async () => {

        // Get accounts
        const [ initialHolder, recipient, anotherAccount ] = accounts;

        // Deploy contract
        const itemDndNFTInstance = await itemDndNFTStorage.deployed();

        // Then
        await itemDndNFTInstance.mint(initialHolder,"Barstard sword",2,2000);
        const initialHolderSupply = await itemDndNFTInstance.balanceOf(initialHolder);

        // expect
        assert.equal(1,initialHolderSupply.toNumber(),"This account should have 1 token.");
    });

    it("should retrieve the token attributes after minting", async () => {

        const resultURI = "data:application/json;base64,eyJuYW1lIjogIkJhc3RhcmQgc3dvcmQiLCJpbWFnZV9kYXRhIjogIiIsImF0dHJpYnV0ZXMiOiBbeyJ0cmFpdF90eXBlIjogIlZhbHVlIiwgInZhbHVlIjogMjAwMH0seyJ0cmFpdF90eXBlIjogIldlaWdodCIsICJ2YWx1ZSI6IDJ9LHsidHJhaXRfdHlwZSI6ICJpZCIsICJ2YWx1ZSI6IDF9XX0=1";
        // Get accounts
        const [ initialHolder, recipient, anotherAccount ] = accounts;

        // Deploy contract
        const itemDndNFTInstance = await itemDndNFTStorage.deployed();

        // Then
        await itemDndNFTInstance.mint(initialHolder,"Bastard sword",2,2000);
        const tokenURI = await itemDndNFTInstance.tokenURI(1);

        // Decode Attributes
        const encodedAttributes = tokenURI.substr(tokenURI.indexOf(",")+1,tokenURI.length);
        const decodedAttributes = Buffer.from(encodedAttributes, 'base64').toString('binary');
        const attributes = JSON.parse(decodedAttributes);
  
        // expect
        assert.equal(resultURI,tokenURI,"This account should have 1 token.");
        assert.equal(attributes.attributes[0].value, 2000, "The Item value should match the Item value.");
        assert.equal(attributes.name,"Bastard sword","The item name should match.");
        assert.equal(attributes.attributes[1].value,2,"The item weight should match.");
        assert.equal(attributes.attributes[2].value,1,"The item id should match.");
    });
});;