import { Component } from '@angular/core';
import Web3 from 'web3';

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

  async isMetaMaskInstalled(){
    return Boolean((typeof window.ethereum) && (typeof window.ethereum.isMetaMask));
  }

  async isMetaMaskConnected(){
    return Boolean(this.accounts && this.accounts.length > 0);
  }

  async onClickConnect(){
    const MM = await this.isMetaMaskInstalled();
    const connected = await this.isMetaMaskConnected();
    if (MM === true && connected === false) {
      try {
        const newAccounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      this.handleNewAccounts(newAccounts);
      } catch (error) {
      console.error(error);
    }
    } else if (MM === false) {
      console.log('Please install MetaMask!');
    } else if (connected === true) {
      console.log('MetaMask already connected!');
    }
  }

  async handleNewAccounts (newAccounts: any) {
    if (this.isMetaMaskConnected()) {
      this.accounts = newAccounts;
    }
  }

  async sendETH() {
    await this.onClickConnect();
    if ((typeof window.ethereum !== 'undefined') || (typeof window.web3 !== 'undefined')) {
      const provider = window['ethereum'] || window.web3.currentProvider;
      this.web3 = new Web3(provider);
    } else {
      this.web3 = new Web3(new Web3.providers.WebsocketProvider(infuraWebsocket));
    }
    const contract = new this.web3.eth.Contract(contractAbi, contractAddress);
    const tx = await contract.methods.sendFunds().send({ from: this.accounts[0] });
    // const tx = await this.web3.eth.sendTransaction({
    //   from: this.accounts[0],
    //   to: '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
    //   value: '0',
    //   gas: 21000,
    //   gasPrice: 20000000000,
    // }, (result: any) => {
    //   console.log(result)
    // })
    // console.log(tx);
    return tx;
  }

}
