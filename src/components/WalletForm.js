import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actionAddExpense, actionFetchCurrencies } from '../redux/actions';
import css from './WalletForm.module.css';

class WalletForm extends Component {
  state = {
    id: 0,
    description: '',
    tag: 'Alimentação',
    value: '',
    method: 'Dinheiro',
    currency: '',
    addBtnDisabled: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(actionFetchCurrencies());
  }

  componentDidUpdate(prevProps) {
    const { currencies, expenses } = this.props;
    if (prevProps.currencies !== currencies) {
      const [firstCurrency] = (currencies);
      this.setState({ currency: firstCurrency, id: expenses.length });
    }
  }

  onIputChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value }, () => this.validateAddBtn());
  };

  onAddBtnClick = () => {
    const { dispatch } = this.props;
    const { id, description, tag, value, method, currency } = this.state;
    dispatch(actionAddExpense({ id, description, tag, value, method, currency }));
    this.setState((prev) => ({
      description: '',
      value: '',
      id: prev.id + 1,
    }), () => this.validateAddBtn());
  };

  validateAddBtn = () => {
    const { description, value } = this.state;
    const { error } = this.props;
    const isValid = !description || !value;
    this.setState({ addBtnDisabled: isValid });
    if (error) this.setState({ addBtnDisabled: true });
  };

  render() {
    const { currencies, error } = this.props;
    const {
      description,
      tag,
      value,
      method,
      currency,
      addBtnDisabled,
    } = this.state;
    return (
      <form className={ css.form }>
        <label htmlFor="description" className={ css.label }>
          Descrição da despesa
          <input
            data-testid="description-input"
            id="description"
            name="description"
            type="text"
            onChange={ this.onIputChange }
            value={ description }
            className={ `${css.input} ${css.description}` }
          />
        </label>
        <label htmlFor="tag" className={ css.label }>
          Categoria da despesa
          <select
            data-testid="tag-input"
            id="tag"
            name="tag"
            onChange={ this.onIputChange }
            value={ tag }
            className={ `${css.input} ${css.tag}` }
          >
            <option value="Alimentação" className={ css.option }>Alimentação</option>
            <option value="Lazer" className={ css.option }>Lazer</option>
            <option value="Trabalho" className={ css.option }>Trabalho</option>
            <option value="Transporte" className={ css.option }>Transporte</option>
            <option value="Saúde" className={ css.option }>Saúde</option>
          </select>
        </label>
        <label htmlFor="value" className={ css.label }>
          Valor
          <input
            data-testid="value-input"
            id="value"
            name="value"
            type="number"
            min="0"
            onChange={ this.onIputChange }
            value={ value }
            className={ `${css.input} ${css.value}` }
          />
        </label>
        <label htmlFor="method" className={ css.label }>
          Método de pagamento
          <select
            data-testid="method-input"
            id="method"
            name="method"
            onChange={ this.onIputChange }
            value={ method }
            className={ `${css.input} ${css.method}` }
          >
            <option className={ css.option } value="Dinheiro">Dinheiro</option>
            <option
              className={ css.option }
              value="Cartão de crédito"
            >
              Cartão de crédito
            </option>
            <option
              className={ css.option }
              value="Cartão de débito"
            >
              Cartão de débito
            </option>
          </select>
        </label>
        <label htmlFor="currency" className={ css.label }>
          Moeda
          {
            error
              ? <span className={ css.error }>{ error }</span>
              : (
                <select
                  data-testid="currency-input"
                  id="currency"
                  name="currency"
                  onChange={ this.onIputChange }
                  value={ currency }
                  className={ `${css.input} ${css.currency}` }
                >
                  {
                    currencies.map((currencyEl) => (
                      <option
                        key={ currencyEl }
                        value={ currencyEl }
                        className={ css.option }
                      >
                        { currencyEl }
                      </option>
                    ))
                  }
                </select>
              )
          }
        </label>
        <button
          type="button"
          className={ css.btn }
          onClick={ this.onAddBtnClick }
          disabled={ addBtnDisabled }
        >
          Adicionar despesa
        </button>
      </form>
    );
  }
}

WalletForm.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  error: PropTypes.string.isRequired,
  expenses: PropTypes.instanceOf(Array).isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = ({ wallet }) => ({
  currencies: wallet.currencies,
  error: wallet.error,
  expenses: wallet.expenses,
});

export default connect(mapStateToProps)(WalletForm);
