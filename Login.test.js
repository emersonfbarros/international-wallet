import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from './src/App';
import mockFetch from './src/tests/helpers/mockFetch.test';
import { renderWithRouterAndRedux } from './src/tests/helpers/renderWith';

describe('Testa o componente Login', () => {
  it('É renderizado na rota "/"', () => {
    const { history } = renderWithRouterAndRedux(<App />);

    const { location: { pathname } } = history;

    expect(pathname).toBe('/');
  });

  it('Existe um header com o texto "trybe wallet"', () => {
    renderWithRouterAndRedux(<App />);
    const h1Header = screen.getByRole('heading', { level: 1 });
    expect(h1Header).toBeVisible();
    expect(screen.getByText(/trybe/i)).toBeVisible();
    expect(screen.getByText(/wallet/i)).toBeVisible();
  });

  it('Existe os inputs de email, senha e o botão para entrar', () => {
    renderWithRouterAndRedux(<App />);

    const emailInput = screen.getByPlaceholderText('E-mail');
    const passwdInput = screen.getByPlaceholderText('Senha');
    const loginBtn = screen.getByText('Entrar');

    expect(emailInput).toBeVisible();
    expect(passwdInput).toBeVisible();
    expect(loginBtn).toBeVisible();
  });

  it('O botão de entrar só é ativado se email e senha passarem pelas validações', () => {
    const wrongEmails = ['testeemail', 'teste@email', '@testeemail.com'];
    const correctEmail = 'teste@email.com';
    const wrongPasswds = ['123', 'zsh42', 'f0rt3'];
    const correctPasswd = 's3cretW4IIet';

    renderWithRouterAndRedux(<App />);

    const emailInput = screen.getByPlaceholderText('E-mail');
    const passwdInput = screen.getByPlaceholderText('Senha');
    const loginBtn = screen.getByText('Entrar');

    expect(loginBtn).toBeDisabled();

    wrongEmails.forEach((wrongEmail, index) => {
      userEvent.type(emailInput, wrongEmail);
      expect(loginBtn).toBeDisabled();
      userEvent.type(passwdInput, wrongPasswds[index]);
      expect(loginBtn).toBeDisabled();
      userEvent.clear(emailInput);
      expect(loginBtn).toBeDisabled();
      userEvent.clear(passwdInput);
    });

    userEvent.type(emailInput, correctEmail);
    userEvent.type(passwdInput, correctPasswd);
    expect(loginBtn).toBeEnabled();
  });

  it('Após ser feito o login a rota é "/carteira"', async () => {
    mockFetch();

    const userInput = ['teste@email.com', 't3stingRe4ct'];
    const [email, passwd] = userInput;

    const { history } = renderWithRouterAndRedux(<App />);

    const emailInput = screen.getByPlaceholderText('E-mail');
    const passwdInput = screen.getByPlaceholderText('Senha');
    const loginBtn = screen.getByText('Entrar');

    act(() => {
      userEvent.type(emailInput, email);
      userEvent.type(passwdInput, passwd);
      userEvent.click(loginBtn);
    });

    expect(await screen.findByText(/usd/i)).toBeInTheDocument();

    const { location: { pathname } } = history;

    expect(pathname).toBe('/carteira');
  });
});
