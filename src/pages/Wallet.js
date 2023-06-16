import { Component } from 'react';
import Header from '../components/Header';
import WalletForm from '../components/WalletForm';

export default class Wallet extends Component {
  render() {
    return (
      <>
        <Header />
        <main>
          <WalletForm />
        </main>
      </>
    );
  }
}
