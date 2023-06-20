import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import { renderWithRedux, renderWithRouterAndRedux } from './helpers/renderWith';
import mockData from './helpers/mockData';
import { mockExpenses } from './helpers/mockExpenses';
import WalletForm from '../components/WalletForm';
import Wallet from '../pages/Wallet';

export function mockFetch(resOk = true, resStatus = 200) {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockData),
    ok: resOk,
    status: resStatus,
  });
}

describe('Testa todos os comportamentos do componente Wallet e seus filhos', () => {
  beforeEach(() => { mockFetch(); });

  afterEach(() => { global.fetch.mockClear(); });

  const [firstCurrency] = Object.keys(mockData);
  const testEmail = 'teste@email.com';
  const testPassword = 'myS3CRetW4IIet';

  it('Existe o texto "total de despesas", o texto "BRL", o valor "0" e o email do usuário no componente Header', async () => {
    renderWithRouterAndRedux(<App />);
    act(() => {
      userEvent.type(screen.getByPlaceholderText(/e-mail/i), testEmail);
      userEvent.type(screen.getByPlaceholderText(/senha/i), testPassword);
      userEvent.click(screen.getByText(/entrar/i));
    });
    await screen.findByText(firstCurrency);
    expect(screen.getByText(/total de despesas/i)).toBeVisible();
    expect(screen.getByText('0')).toBeVisible();
    expect(screen.getByText(/brl/i)).toBeVisible();
    expect(screen.getByText(testEmail)).toBeVisible();
  });

  it('Existem todos os inputs necessários para o usuário adicionar uma despesa', async () => {
    const inputLabels = [/descrição/i, /categoria/i, /valor/i, /método/i, /moeda/i];
    renderWithRedux(<WalletForm />);
    await screen.findByText(firstCurrency);
    inputLabels.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeVisible();
    });
    expect(screen.getByText(/adicionar/i)).toBeVisible();
  });

  it('A mensagem "serviço indisponível" é exibida e botão de adicionar é desativado quando a requisição para a API falha', async () => {
    const errorCode = 500;
    mockFetch(false, errorCode);
    renderWithRedux(<WalletForm />);
    expect(await screen.findByText(`Serviço indisponível: ${errorCode}`)).toBeVisible();
    expect(screen.getByText(/adicionar despesa/i)).toBeDisabled();
  });

  it('Ao ser renderizado é adicionado ao estado global um array com nome "currencies" com as siglas das moedas vindas da chamada da API excluindo "USDT"', async () => {
    const { store } = renderWithRedux(<WalletForm />);
    await screen.findByText(firstCurrency);
    expect(global.fetch).toHaveBeenCalled();
    const { wallet: { currencies } } = store.getState();
    expect(currencies).toEqual(Object.keys(mockData)
      .filter((currency) => currency !== 'USDT'));
  });

  it('Os selects de categoria e método de pagamento do formulário têm as options necessárias para o usuário adicionar uma despesa', async () => {
    const categories = ['Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];
    const methods = ['Dinheiro', 'Cartão de crédito', 'Cartão de débito'];
    renderWithRedux(<WalletForm />);
    await screen.findByText(firstCurrency);

    categories.forEach((category) => {
      expect(screen.getByRole('option', { name: category })).toBeInTheDocument();
    });

    methods.forEach((method) => {
      expect(screen.getByRole('option', { name: method })).toBeInTheDocument();
    });
  });

  it('Existem as options com todas as siglas das moedas trazidas pela API e guardadas no estado global', async () => {
    const { store } = renderWithRedux(<WalletForm />);
    await screen.findByText(firstCurrency);
    const { wallet: { currencies } } = store.getState();
    currencies.forEach((currency) => {
      expect(screen.getByRole('option', { name: currency })).toBeInTheDocument();
    });
  });

  it('O botão "Adicionar despesa" só é ativado quando os inputs são todos preenchidos', async () => {
    renderWithRedux(<WalletForm />);
    await screen.findByText(firstCurrency);
    const addBtn = screen.getByText(/adicionar despesa/i);
    const descriptionInput = screen.getByLabelText(/descrição/i);
    const valueInput = screen.getByLabelText(/valor/i);
    expect(addBtn).toBeDisabled();
    act(() => { userEvent.type(descriptionInput, 'compra para teste'); });
    expect(addBtn).toBeDisabled();
    act(() => { userEvent.type(valueInput, '60'); });
    expect(addBtn).toBeEnabled();
  });

  it('Adiconar despesas clicando no botão é criado um array de objetos no formato especificado no estado global', async () => {
    const { store } = renderWithRedux(<WalletForm />);
    await screen.findByText(firstCurrency);
    const addBtn = screen.getByText(/adicionar despesa/i);

    mockExpenses.forEach(({ description, tag, value, method, currency }) => {
      act(() => {
        userEvent.type(screen.getByLabelText(/descrição/i), description);
        userEvent.selectOptions(screen.getByLabelText(/categoria da despesa/i), tag);
        userEvent.type(screen.getByLabelText(/valor/i), value);
        userEvent.selectOptions(screen.getByLabelText(/método de pagamento/i), method);
        userEvent.selectOptions(screen.getByLabelText(/moeda/i), currency);
        userEvent.click(addBtn);
      });
    });
    await waitFor(() => {
      const { wallet: { expenses } } = store.getState();
      expect(expenses).toEqual(mockExpenses);
    });
  });

  it('Ao adicionar despesas é exibido no header a soma do total das despesas convertidas em BRL', async () => {
    renderWithRedux(<Wallet />);
    await screen.findByText(firstCurrency);
    const addBtn = screen.getByText(/adicionar despesa/i);
    const expensesSum = mockExpenses
      .reduce((total, { value, currency, exchangeRates }) => {
        const exchange = exchangeRates[currency].ask;
        return total + (value * exchange);
      }, 0).toFixed(2);

    mockExpenses.forEach(({ description, tag, value, method, currency }) => {
      act(() => {
        userEvent.type(screen.getByLabelText(/descrição/i), description);
        userEvent.selectOptions(screen.getByLabelText(/categoria da despesa/i), tag);
        userEvent.type(screen.getByLabelText(/valor/i), value);
        userEvent.selectOptions(screen.getByLabelText(/método de pagamento/i), method);
        userEvent.selectOptions(screen.getByLabelText(/moeda/i), currency);
        userEvent.click(addBtn);
      });
    });

    const sumInHeader = await screen.findByText(expensesSum);

    expect(sumInHeader).toBeVisible();
    expect(sumInHeader.innerHTML).toBe(expensesSum);
  });
});
