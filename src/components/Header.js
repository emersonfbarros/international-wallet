import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TrybeWalletTitle from './TrybeWalletTitle';
import styles from './Header.module.css';
import coins from '../assests/coins.svg';
import userLogo from '../assests/user-logo.svg';

class Header extends Component {
  render() {
    const { email } = this.props;
    return (
      <header>
        <TrybeWalletTitle />
        <p className={ styles.expanse }>
          <img src={ coins } alt="coins icons" />
          Total de despesas:
          <span className={ styles.total } data-testid="total-field">0</span>
          <span
            className={ styles.currency }
            data-testid="header-currency-field"
          >
            BRL
          </span>
        </p>
        <p className={ styles.email } data-testid="email-field">
          <img src={ userLogo } alt="user avatar" />
          { email }
        </p>
      </header>
    );
  }
}

Header.propTypes = {
  email: PropTypes.string.isRequired,
};

const mapStateToProps = ({ user }) => ({ email: user.email });

export default connect(mapStateToProps)(Header);
