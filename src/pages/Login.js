import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrybeWalletTitle from '../components/TrybeWalletTitle';
import styles from './Login.module.css';
import { getEmailOnLogin } from '../redux/actions';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    enableBtn: true,
  };

  validateBtn = () => {
    const { email, password } = this.state;
    const minPasswdLength = 6;
    const passwdIsValid = password.length < minPasswdLength;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const emailIsvalid = !emailRegex.test(email);
    const btnIsValid = emailIsvalid || passwdIsValid;
    this.setState({ enableBtn: btnIsValid });
  };

  onInputChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value }, () => this.validateBtn());
  };

  customSubmit = (event) => {
    event.preventDefault();
    const { history, dispatch } = this.props;
    const { email } = this.state;
    dispatch(getEmailOnLogin(email));
    history.push('/carteira');
  };

  render() {
    const { enableBtn } = this.state;
    return (
      <main>
        <form onSubmit={ this.customSubmit }>
          <TrybeWalletTitle />
          <input
            className={ styles.email }
            type="text"
            name="email"
            onChange={ this.onInputChange }
            data-testid="email-input"
            placeholder="E-mail"
          />
          <input
            className={ styles.passwd }
            type="password"
            name="password"
            onChange={ this.onInputChange }
            onSubmit={ this.customSubmit }
            data-testid="password-input"
            placeholder="Senha"
          />
          <button
            className={ styles.btn }
            type="submit"
            disabled={ enableBtn }
          >
            Entrar
          </button>
        </form>
      </main>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Login);
