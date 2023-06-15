import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TrybeWalletTitle from './TrybeWalletTitle';
import css from './Header.module.css';
import coins from '../assests/coins.svg';
import userLogo from '../assests/user-logo.svg';

class Header extends Component {
  render() {
    const { email } = this.props;
    return (
      <header className={ css.header }>
        <TrybeWalletTitle />
        <p className={ css.expanse }>
          <img src={ coins } alt="coins icons" className={ css.img } />
          Total de despesas:
          <span className={ css.total } data-testid="total-field">0</span>
          <span
            className={ css.currency }
            data-testid="header-currency-field"
          >
            BRL
          </span>
        </p>
        <p className={ css.email } data-testid="email-field">
          <img src={ userLogo } alt="user avatar" className={ css.img } />
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
