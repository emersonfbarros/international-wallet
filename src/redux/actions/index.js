import { fetchCurrencies } from '../../services/apiCalls';

export const GET_EMAIL_ON_LOGIN = 'GET_EMAIL_ON_LOGIN';
export const GET_CURRENCIES_SUCCESS = 'GET_CURRENCIES_SUCCESS';
export const GET_CURRENCIES_FAIL = 'GET_CURRENCIES_FAIL';

export const getEmailOnLogin = (email) => ({ type: GET_EMAIL_ON_LOGIN, payload: email });

const getCurrenciesFail = (error) => ({
  type: GET_CURRENCIES_FAIL,
  payload: error.message,
});

const getCurrenciesSuccess = (currencies) => ({
  type: GET_CURRENCIES_SUCCESS,
  payload: currencies,
});

export const actionFetchCurrencies = () => async (dispatch) => {
  try {
    const currencies = await fetchCurrencies();
    dispatch(getCurrenciesSuccess(currencies));
  } catch (error) {
    dispatch(getCurrenciesFail(error));
  }
};
