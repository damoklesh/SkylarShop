import React, { Component } from "react";
//import SimpleStorageContract from "./contracts/SimpleStorage.json";
import ShopContract from "./contracts/Shop.json";
import PoTokenContract from "./contracts/PoToken.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, shopContract: null , tokenAmount: 0, recipientAddress: "0x0000000000000000000000000000000000000000"};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log("accounts" + accounts);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ShopContract.networks[networkId];
      //console.log("network" + JSON.stringify(deployedNetwork, null, 4))
      const shopInstance = new web3.eth.Contract(
        ShopContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const poTokenInstance = new web3.eth.Contract(
        PoTokenContract.abi,
        PoTokenContract.networks[networkId] && PoTokenContract.networks[networkId].address,
      );

      const shopContractAddress = ShopContract.networks[networkId].address;

      // Get connected account current balanceOf
      const accountBalance = await poTokenInstance.methods.balanceOf(accounts[0]).call();
      const owner = await poTokenInstance.methods.totalSupply().call();
      console.log("owner: "+owner);

      // Get the connected account owned items
      const ownedItems = await shopInstance.methods.ownedItems(accounts[0],1).call();
        console.log(ownedItems);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, shopContract: shopInstance, poTokenContract: poTokenInstance, shopContractAddress: shopContractAddress, accountBalance: accountBalance , currentHeldItems: ownedItems}, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  /**
   * Handles the click on the add item button.
   * It calls the addItem function from the shop contract to add a new item.
   * @param {*} event 
   */
  handleAddItem = async (event) => {
    const { accounts, shopContract, itemName, itemWeight, itemValue } = this.state;
    console.log("calling add item");
    const result = await shopContract.methods.addItem(itemName, itemWeight, itemValue).send({from: accounts[0]});
    console.log("done add item");
  }
  
  /**
   * This function handles the give po tokens function.
   * @param {*} event 
   */
  handleGivePoTokens = async (event) => {
    const { accounts, poTokenContract } = this.state;
    const recipient = this.state.recipientAddress;
    const tokenAmount = this.state.tokenAmount;
    await poTokenContract.methods.transfer(recipient,tokenAmount).send({from: accounts[0]});
  }

  /**
   * Handles the approval of funds to be spent by the shop contract.
   * @param {*} event 
   */
  handleApproveFunds = async (event) => {
    const { accounts, itemPaidAmount, shopContractAddress, poTokenContract} = this.state;
    // Approve funds for the contract to use on behalf the user
    await poTokenContract.methods.approve(shopContractAddress, itemPaidAmount).send({from: accounts[0]});
  }
  /**
   * Handles the items buy functionality. The user can buy a item providing the item id.
   * @param {*} event 
   */
  handleBuyItem = async (event) => {
    const { accounts, shopContract, poTokenContract, itemId , itemPaidAmount} = this.state;
    console.log("calling buy item");
    const result = await shopContract.methods.buyItem(itemId, itemPaidAmount).send({from: accounts[0]});
    this.setState({currentHeldItems: await shopContract.methods.ownedItems(accounts[0],itemId).call()});
    console.log("done buy item");
  }

  /**
   * Handle Changes on inputs
   */

  handleTokenAmountChange = (event) => {
    this.setState({tokenAmount: event.target.value});
    console.log("tokenAmount value: " + event.target.value);
  }

  handleRecipientAddressChange = (event) => {
    this.setState({recipientAddress: event.target.value});
    console.log("recipientAddress value: " + event.target.value);
  }

  handleItemNameChange = (event) => {
    this.setState({itemName: event.target.value});
    console.log("itemName value: " + event.target.value);
  }

  handleItemWeightChange = (event) => {
    this.setState({itemWeight: event.target.value});
    console.log("itemWeight value: " + event.target.value);
  }

  handleItemValueChange = (event) => {
    this.setState({itemValue: event.target.value});
    console.log("itemValue value: " + event.target.value);
  }

  handleItemIdChange = (event) => {
    this.setState({itemId: event.target.value});
    console.log("itemid value: " + event.target.value);
  } 

  handleItemPaidAmountChange = (event) => {
    this.setState({itemPaidAmount: event.target.value});
    console.log("itemPaidAmount value: " + event.target.value);
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Caldero Shopping Center</h1>
        <h2>Skylar's Shop</h2>
        <div>Your Gold piece Balance: {this.state.accountBalance}</div>
        <div>
          <p>Give some POs to an account (only for PoToken Contract owner)</p>
            <input type="text" name="tokenAmount" value={this.state.tokenAmount} onChange={this.handleTokenAmountChange}/>
            <input type="text" name="recipientAddress" value={this.state.recipientAddress} onChange={this.handleRecipientAddressChange}/>
            <button type="button" onClick={this.handleGivePoTokens}>Give Tokens</button>
        </div>
        <div>
          <input type="text" name="itemName" value={this.state.itemName} onChange={this.handleItemNameChange}/>
          <input type="text" name="itemWeight" value={this.state.itemWeight} onChange={this.handleItemWeightChange}/>
          <input type="text" name="itemValue" value={this.state.itemValue} onChange={this.handleItemValueChange}/>
          <button type="button" onClick={this.handleAddItem}>Add item</button>
        </div>
        <div>
          <p>Buy Items</p>
          <input type="text" name="itemId" value={this.state.itemId} onChange={this.handleItemIdChange}/>
          <input type="text" name="itemPaidAmount" value={this.state.itemPaidAmount} onChange={this.handleItemPaidAmountChange}/>
          <button type="button" onClick={this.handleApproveFunds}>Approve</button><button type="button" onClick={this.handleBuyItem}>Buy item</button>
        </div>
        <div>
          <p>Your current items: </p>
          <p>Slot 1: {this.state.currentHeldItems.name}</p>
        </div>
      </div>
    );
  }
}

export default App;
