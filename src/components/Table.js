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
        <table className={ css.table } role="table">
          <thead className={ css.thead }>
            <tr className={ css.tr } role="row">
              <th className={ css.th } role="columnheader">Descrição</th>
              <th className={ css.th } role="columnheader">Tag</th>
              <th className={ css.th } role="columnheader">Método de pagamento</th>
              <th className={ css.th } role="columnheader">Valor</th>
              <th className={ css.th } role="columnheader">Moeda</th>
              <th className={ css.th } role="columnheader">Câmbio utilizado</th>
              <th className={ css.th } role="columnheader">Valor convertido</th>
              <th className={ css.th } role="columnheader">Moeda de conversão</th>
              <th className={ css.th } role="columnheader">Editar/Excluir</th>
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
                  <tr key={ value } className={ css.tr }>
                    <td
                      role="cell"
                      className={ css.td }
                      data-cell="descrição"
                    >
                      { description }
                    </td>
                    <td
                      role="cell"
                      className={ css.td }
                      data-cell="tag"
                    >
                      { tag }
                    </td>
                    <td
                      role="cell"
                      className={ css.td }
                      data-cell="método de pagamento"
                    >
                      { method }
                    </td>
                    <td
                      role="cell"
                      className={ css.td }
                      data-cell="valor"
                    >
                      { Number(value).toFixed(2) }
                    </td>
                    <td
                      role="cell"
                      className={ css.td }
                      data-cell="moeda"
                    >
                      { exchangeRates[currency].name }
                    </td>
                    <td
                      role="cell"
                      className={ css.td }
                      data-cell="câmbio utilizado"
                    >
                      { Number(exchangeRates[currency].ask).toFixed(2) }
                    </td>
                    <td
                      role="cell"
                      className={ css.td }
                      data-cell="valor convertido"
                    >
                      { (value * exchangeRates[currency].ask).toFixed(2) }
                    </td>
                    <td
                      role="cell"
                      className={ css.td }
                      data-cell="moeda de conversão"
                    >
                      Real
                    </td>
                    <td
                      className={ `${css.td} ${css.buttons}` }
                      role="cell"
                      data-cell="editar/excluir"
                    >
                      <button
                        className={ css.edit }
                        type="button"
                        aria-label="Editar"
                        data-testid="edit-btn"
                        onClick={ () => dispatch(startEdintig(index)) }
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={ css.delete }
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
