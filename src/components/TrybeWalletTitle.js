import { Component } from 'react';
import css from './TrybeWalletTitle.module.css';
import logo from '../assests/logo.png';

export default class TrybeWalletTitle extends Component {
  render() {
    return (
      <h1 className={ css.h1 }>
        <img src={ logo } alt="logo" className={ css.img } />
        { ' ' }
        International
        { ' ' }
        <span className={ css.span }>Wallet</span>
      </h1>
    );
  }
}
