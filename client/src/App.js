import React, { Component } from "react";
//import SimpleStorageContract from "./contracts/SimpleStorage.json";
import ShopContract from "./contracts/Shop.json";
import PoTokenContract from "./contracts/PoToken.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, shopContract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ShopContract.networks[networkId];
      const shopInstance = new web3.eth.Contract(
        ShopContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, shopContract: shopInstance }, this.runExample);
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
    await this.state.shopContract.methods.addItem("Flaming Bastard Sword", 5, 40);
  }

  runExample = async () => {
    const { accounts, shopContract } = this.state;

    // Stores a given value, 5 by default.
    //await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    //const response = await contract.methods.get().call();

    // Update state with the result.
    //this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <div>
        <button type="button" onClick={this.handleAdditem}>Add item</button>
        </div>
      </div>
    );
  }
}

export default App;
