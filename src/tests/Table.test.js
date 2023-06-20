import { screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import Table from '../components/Table';
import Wallet from '../pages/Wallet';
import { mockExpenses, mockExpensesUpdated } from './helpers/mockExpenses';
import { renderWithRedux } from './helpers/renderWith';
import { mockFetch } from './Wallet.test';
import mockData from './helpers/mockData';

const originalExpensesTotal = mockExpenses
  .reduce((total, { value, currency, exchangeRates }) => {
    const exchange = exchangeRates[currency].ask;
    return total + (value * exchange);
  }, 0).toFixed(2);

const updatedExpensesTotal = mockExpensesUpdated
  .reduce((total, { value, currency, exchangeRates }) => {
    const exchange = exchangeRates[currency].ask;
    return total + (value * exchange);
  }, 0).toFixed(2);

const INITIAL_STATE = { initialState: {
  wallet: {
    expenses: mockExpenses,
    error: '',
    total: originalExpensesTotal,
    isEditing: false,
    indexOfWhichEdit: 0,
    currencies: Object.entries(mockData)
      .filter(([code]) => code !== 'USDT').map(([currency]) => currency),
  } },
user: { email: 'teste@email.com' },
};

describe('Testa os comportamentos do componente Table', () => {
  it('Existe uma table na aplicação', () => {
    renderWithRedux(<Table />);
    expect(screen.getByRole('table')).toBeVisible();
  });

  it('Existem os headers corretos na tabela', () => {
    const headersNames = [
      /descrição/i,
      /^tag$/i,
      /método de pagamento/i,
      /^valor$/i,
      /^moeda$/i,
      /câmbio utilizado/i,
      /^valor convertido$/i,
      /^moeda de conversão$/i,
      /editar\/excluir/i,
    ];
    renderWithRedux(<Table />);
    headersNames.forEach((headerName) => {
      expect(screen.getByRole('columnheader', { name: headerName })).toBeVisible();
    });
  });

  it('Ao adicionar despesas suas informações são renderizadas na tabela junto dos botões de editar e exluir', () => {
    act(() => {
      renderWithRedux(<Table />, { initialState:
        { wallet: { expenses: mockExpenses } } });
    });

    mockExpenses.forEach((expense) => {
      const { description, tag, method, value, exchangeRates, currency } = expense;
      expect(screen.getByRole('cell', { name: description })).toBeVisible();
      expect(screen.getByRole('cell', { name: tag })).toBeVisible();
      expect(screen.getByRole('cell', { name: method })).toBeVisible();
      expect(screen.getByRole('cell', { name: Number(value).toFixed(2) })).toBeVisible();
      expect(screen.getByRole('cell', { name: exchangeRates[currency].name })).toBeVisible();
      expect(screen.getByRole('cell', { name: Number(exchangeRates[currency].ask).toFixed(2) })).toBeVisible();
      expect(screen.getByRole('cell', { name: (value * exchangeRates[currency].ask).toFixed(2) })).toBeVisible();
    });

    const currencyRealCells = screen.getAllByRole('cell', { name: 'Real' });
    expect(currencyRealCells).toHaveLength(mockExpenses.length);
    currencyRealCells.forEach((cell) => { expect(cell).toBeVisible(); });

    const editBtns = screen.getAllByRole('button', { name: 'Editar' });
    const deleteBtns = screen.getAllByRole('button', { name: 'Excluir' });
    expect(editBtns).toHaveLength(mockExpenses.length);
    expect(deleteBtns).toHaveLength(mockExpenses.length);
    editBtns.forEach((editBtn) => expect(editBtn).toBeVisible());
    deleteBtns.forEach((deleteBtn) => expect(deleteBtn).toBeVisible());
  });

  it('O botão excluir de uma despesa a remove da tabela, do estado global e subtrai a soma total do header', () => {
    mockFetch();

    const modifiedExpenses = mockExpenses.filter(({ id }) => id !== 0);

    const modifiedExpensesTotal = modifiedExpenses
      .reduce((total, { value, currency, exchangeRates }) => {
        const exchange = exchangeRates[currency].ask;
        return total + (value * exchange);
      }, 0).toFixed(2);

    let externalStore;

    act(() => {
      const { store } = renderWithRedux(<Wallet />, INITIAL_STATE);
      externalStore = store;
    });

    expect(screen.getByText(originalExpensesTotal)).toBeVisible();
    expect(screen.getAllByRole('row')).toHaveLength(mockExpenses.length + 1);

    const deleteBtns = screen.getAllByRole('button', { name: 'Excluir' });
    act(() => { userEvent.click(deleteBtns[0]); });

    expect(screen.getAllByRole('row')).toHaveLength(modifiedExpenses.length + 1);
    expect(screen.getByText(modifiedExpensesTotal)).toBeVisible();

    const { wallet: { expenses } } = externalStore.getState();
    expect(expenses).toEqual(modifiedExpenses);
  });

  it('O formulário entra no modo de edição após clicar no botão editar de alguma despesa', () => {
    mockFetch();
    const inputLabels = [/descrição/i, /categoria/i, /valor/i, /método/i, /moeda/i];
    const [{ description, tag, value, method, currency }] = mockExpenses;
    const inputValues = [description, tag, value, method, currency];

    act(() => {
      renderWithRedux(<Wallet />, INITIAL_STATE);
    });

    const editBtns = screen.getAllByRole('button', { name: 'Editar' });
    act(() => { userEvent.click(editBtns[0]); });

    expect(screen.getByText(/edite/i)).toBeVisible();
    expect(screen.getByRole('button', { name: 'Editar despesa' })).toBeVisible();
    inputLabels.forEach((label, index) => {
      expect(screen.getByLabelText(label).value).toBe(inputValues[index]);
    });
  });

  it('Após clicar no botão para salvar as edições as modifições refletirão na tabela, no Header e no estado global', () => {
    mockFetch();
    const {
      description,
      tag,
      value,
      method,
      currency,
      exchangeRates,
    } = mockExpensesUpdated[1];

    let externalStore;
    act(() => {
      const { store } = renderWithRedux(<Wallet />, INITIAL_STATE);
      externalStore = store;
    });

    const editBtns = screen.getAllByRole('button', { name: 'Editar' });
    act(() => { userEvent.click(editBtns[1]); });

    act(() => {
      userEvent.clear(screen.getByLabelText(/descrição/i));
      userEvent.clear(screen.getByLabelText(/valor/i));
      userEvent.type(screen.getByLabelText(/descrição/i), description);
      userEvent.type(screen.getByLabelText(/valor/i), value);
      userEvent.selectOptions(screen.getByLabelText(/categoria/i), tag);
      userEvent.selectOptions(screen.getByLabelText(/moeda/i), currency);
      userEvent.click(screen.getByRole('button', { name: 'Editar despesa' }));
    });

    expect(screen.getByText(updatedExpensesTotal)).toBeVisible();
    expect(screen.getByRole('cell', { name: description })).toBeVisible();
    expect(screen.getByRole('cell', { name: tag })).toBeVisible();
    expect(screen.getByRole('cell', { name: method })).toBeVisible();
    expect(screen.getByRole('cell', { name: Number(value).toFixed(2) })).toBeVisible();
    expect(screen.getByRole('cell', { name: exchangeRates[currency].name })).toBeVisible();
    expect(screen.getByRole('cell', { name: Number(exchangeRates[currency].ask).toFixed(2) })).toBeVisible();
    expect(screen.getByRole('cell', { name: (value * exchangeRates[currency].ask).toFixed(2) })).toBeVisible();

    const { wallet: { expenses } } = externalStore.getState();
    expect(expenses).toEqual(mockExpensesUpdated);
  });
});
