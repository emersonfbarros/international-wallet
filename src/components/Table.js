import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { deleteExpense, calcTotal, startEdintig } from '../redux/actions';
import css from './Table.module.css';

class Table extends Component {
  onDeleteBtnClick = (id) => {
    const { dispatch } = this.props;
    dispatch(deleteExpense(id));
    dispatch(calcTotal());
  };

  render() {
    const { expenses, dispatch } = this.props;
    return (
      <div className={ css.wrapper }>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tag</th>
              <th>Método de pagamento</th>
              <th>Valor</th>
              <th>Moeda</th>
              <th>Câmbio utilizado</th>
              <th>Valor convertido</th>
              <th>Moeda de conversão</th>
              <th>Editar/Excluir</th>
            </tr>
          </thead>
          <tbody>
            {
              expenses
                .map(({
                  id,
                  description,
                  tag,
                  method,
                  value,
                  currency,
                  exchangeRates,
                }, index) => (
                  <tr key={ value }>
                    <td>{ description }</td>
                    <td>{ tag }</td>
                    <td>{ method }</td>
                    <td>{ Number(value).toFixed(2) }</td>
                    <td>{ exchangeRates[currency].name }</td>
                    <td>{ Number(exchangeRates[currency].ask).toFixed(2) }</td>
                    <td>{ (value * exchangeRates[currency].ask).toFixed(2) }</td>
                    <td>Real</td>
                    <td>
                      <button
                        type="button"
                        aria-label="Editar"
                        data-testid="edit-btn"
                        onClick={ () => dispatch(startEdintig(index)) }
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        aria-label="Excluir"
                        data-testid="delete-btn"
                        onClick={ () => this.onDeleteBtnClick(id) }
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

Table.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      tag: PropTypes.string.isRequired,
      method: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      currency: PropTypes.string.isRequired,
      exchangeRates: PropTypes.objectOf(
        PropTypes.shape({
          name: PropTypes.string,
          ask: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = ({ wallet }) => ({ expenses: wallet.expenses });

export default connect(mapStateToProps)(Table);
