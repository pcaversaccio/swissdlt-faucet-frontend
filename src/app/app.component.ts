import { Component } from '@angular/core';
import Web3 from 'web3';
import { MatSnackBar } from '@angular/material/snack-bar';

declare let window: any;
declare var require: any;

const infuraWebsocket = 'wss://rinkeby.infura.io/ws/v3/506b137aa0d543268e847d6affb7963c';
const contractAbi = require('./services/FaucetContract.json');
const contractAddress = '0xeaBf236272A02c9587634261AF526EdacE27eb85';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Swiss DLT Faucet Frontend';
  accounts: any;
  web3: any;
  durationInSeconds = 5;

  constructor(private _snackBar: MatSnackBar) {
    if ((typeof window.ethereum !== 'undefined') || (typeof window.web3 !== 'undefined')) {
      const provider = window['ethereum'] || window.web3.currentProvider;
      this.web3 = new Web3(provider);
    } else {
      this.web3 = new Web3(new Web3.providers.WebsocketProvider(infuraWebsocket));
    }
  }

  async isMetaMaskInstalled(){
    return Boolean((typeof window.ethereum) && (typeof window.ethereum.isMetaMask));
  }

  async isMetaMaskConnected(){
    return Boolean(this.accounts && this.accounts.length > 0);
  }

  async onClickConnect(){
    const MM = await this.isMetaMaskInstalled();
    const connected = await this.isMetaMaskConnected();
    const chainId = await this.web3.eth.getChainId();
    
    if (MM === true && connected === false && chainId === 4) {
      try {
        const newAccounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      this.handleNewAccounts(newAccounts);
      } catch (error) {
      console.error(error);
    }
    } else if (chainId !== 4) {
      this._snackBar.open('Please select the Rinkeby network in MetaMask.', undefined, { duration: 5000 });
    } else if (MM === false) {
      this._snackBar.open('Please install MetaMask!', undefined, { duration: 5000 });
    } else if (connected === true) {
      this._snackBar.open('MetaMask already connected!', undefined, { duration: 5000 });
    }
  }

  async handleNewAccounts (newAccounts: any) {
    if (this.isMetaMaskConnected()) {
      this.accounts = newAccounts;
    }
  }

  async sendETH() {
    await this.onClickConnect();
    const contract = new this.web3.eth.Contract(contractAbi, contractAddress);
    const tx = await contract.methods.sendFunds().send({ from: this.accounts[0] });
    return tx;
  }

  async fundFaucet() {
    await this.onClickConnect();
    const tx = await this.web3.eth.sendTransaction({
      from: this.accounts[0],
      to: contractAddress,
      value: 2*10**18,
      gas: 21000,
      gasPrice: 20000000000,
    }, (result: any) => {
      console.log(result)
    })
    return tx;
  }

}
