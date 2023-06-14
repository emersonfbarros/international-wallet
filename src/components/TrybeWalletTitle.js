import { Component } from 'react';
import './TrybeWalletTitle.module.css';
import logo from '../assests/logo.png';

export default class TrybeWalletTitle extends Component {
  render() {
    return (
      <h1>
        <img src={ logo } alt="logo" />
        { ' ' }
        Trybe
        { ' ' }
        <span>Wallet</span>
      </h1>
    );
  }
}
