import { Component } from 'react';
import './FormTitle.module.css';

export default class FormTitle extends Component {
  render() {
    return (
      <h1>
        Trybe
        { ' ' }
        <span>Wallet</span>
      </h1>
    );
  }
}
