import { Component } from 'react';
import Header from '../components/Header';
import Table from '../components/Table';
import WalletForm from '../components/WalletForm';
import css from './Wallet.module.css';

export default class Wallet extends Component {
  render() {
    return (
      <>
        <Header />
        <main className={ css.main }>
          <WalletForm />
          <Table />
        </main>
      </>
    );
  }
}
