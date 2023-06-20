import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import { mockFetch } from './Wallet.test';
import { renderWithRouterAndRedux } from './helpers/renderWith';

describe('Testa o componente Login', () => {
  const correctEmail = 'teste@email.com';
  const correctPassword = 'myS3CRetw4IIeT';

  it('É renderizado na rota "/"', () => {
    const { history } = renderWithRouterAndRedux(<App />);

    const { location: { pathname } } = history;

    expect(pathname).toBe('/');
  });

  it('Existe um header com o texto" trybe wallet"', () => {
    renderWithRouterAndRedux(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toBeVisible();
    expect(screen.getByText(/trybe/i)).toBeVisible();
    expect(screen.getByText(/wallet/i)).toBeVisible();
  });

  it('Existe os inputs de email e senha, e existe o botão de entrar', () => {
    renderWithRouterAndRedux(<App />);

    const loginElements = [
      screen.getByPlaceholderText(/e-mail/i),
      screen.getByPlaceholderText(/senha/i),
      screen.getByText(/entrar/i),
    ];

    loginElements.forEach((element) => { expect(element).toBeVisible(); });
  });

  it('O botão de entrar só é ativado se email e senha passarem pelas validações', () => {
    const wrongEmails = ['testeemail', 'teste@email', '@testeemail.com'];
    const wrongPasswords = ['123', 'zsh42', 'f0rt3'];

    renderWithRouterAndRedux(<App />);

    const emailInput = screen.getByPlaceholderText(/e-mail/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    const loginBtn = screen.getByText(/entrar/i);

    expect(loginBtn).toBeDisabled();

    wrongEmails.forEach((wrongEmail, index) => {
      userEvent.type(emailInput, wrongEmail);
      expect(loginBtn).toBeDisabled();
      userEvent.type(passwordInput, wrongPasswords[index]);
      expect(loginBtn).toBeDisabled();
      userEvent.clear(emailInput);
      expect(loginBtn).toBeDisabled();
      userEvent.clear(passwordInput);
    });

    userEvent.type(emailInput, correctEmail);
    userEvent.type(passwordInput, correctPassword);

    expect(loginBtn).toBeEnabled();
  });

  it('Após ser feito o login a rota é "/carteira"', async () => {
    mockFetch();

    const { history } = renderWithRouterAndRedux(<App />);

    const emailInput = screen.getByPlaceholderText(/e-mail/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    const loginBtn = screen.getByText(/entrar/i);

    userEvent.type(emailInput, correctEmail);
    userEvent.type(passwordInput, correctPassword);

    act(() => { userEvent.click(loginBtn); });

    expect(await screen.findByText(/usd/i)).toBeInTheDocument();

    const { location: { pathname } } = history;

    expect(pathname).toBe('/carteira');
  });
});
