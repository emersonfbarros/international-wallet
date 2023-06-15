import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrybeWalletTitle from '../components/TrybeWalletTitle';
import css from './Login.module.css';
import { actionFetchCurrencies, getEmailOnLogin } from '../redux/actions';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    enableBtn: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(actionFetchCurrencies());
  }

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
      <main className={ css.main }>
        <form onSubmit={ this.customSubmit } className={ css.form }>
          <TrybeWalletTitle />
          <input
            className={ css.email }
            type="text"
            name="email"
            onChange={ this.onInputChange }
            data-testid="email-input"
            placeholder="E-mail"
          />
          <input
            className={ css.passwd }
            type="password"
            name="password"
            onChange={ this.onInputChange }
            onSubmit={ this.customSubmit }
            data-testid="password-input"
            placeholder="Senha"
          />
          <button
            className={ css.btn }
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

// const mapDispatchToProps = (dispatch) => ({
//   getCurrencies: () => dispatch(actionFetchCurrencies()),
// });

export default connect()(Login);
