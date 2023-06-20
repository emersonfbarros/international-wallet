import { fetchCurrencies } from '../../services/apiCall';

export const GET_EMAIL_ON_LOGIN = 'GET_EMAIL_ON_LOGIN';
export const GET_CURRENCIES_SUCCESS = 'GET_CURRENCIES_SUCCESS';
export const GET_CURRENCIES_FAIL = 'GET_CURRENCIES_FAIL';
export const ADD_EXPENSE = 'ADD_EXPENSE';
export const CALC_TOTAL = 'CALC_TOTAL';
export const DELETE_EXPENSE = 'DELETE_EXPENSE';
export const START_EDITING = 'START_EDITING';
export const SAVE_EDIT = 'SAVE_EDIT';

export const getEmailOnLogin = (email) => ({ type: GET_EMAIL_ON_LOGIN, payload: email });

const getCurrenciesFail = (error) => ({
  type: GET_CURRENCIES_FAIL,
  payload: error.message,
});

const getCurrenciesSuccess = (currencies) => ({
  type: GET_CURRENCIES_SUCCESS,
  payload: currencies,
});

const addExpanse = (expanse) => ({
  type: ADD_EXPENSE,
  payload: expanse,
});

export const calcTotal = () => ({ type: CALC_TOTAL });

export const actionFetchCurrencies = () => async (dispatch) => {
  try {
    const currencies = await fetchCurrencies();
    dispatch(getCurrenciesSuccess(currencies));
  } catch (error) {
    dispatch(getCurrenciesFail(error));
  }
};

export const actionAddExpense = (localState) => async (dispatch) => {
  const currencies = await fetchCurrencies();
  const exchangeRates = {};
  currencies.forEach(([code, infos]) => {
    exchangeRates[code] = infos;
  });
  dispatch(addExpanse({ ...localState, exchangeRates }));
  dispatch(calcTotal());
};

export const deleteExpense = (id) => ({ type: DELETE_EXPENSE, payload: id });

export const startEdintig = (index) => ({ type: START_EDITING, payload: index });

export const saveEdit = (updatedExpenses) => ({
  type: SAVE_EDIT,
  payload: updatedExpenses,
});
