import {
  ADD_EXPENSE,
  CALC_TOTAL,
  GET_CURRENCIES_FAIL,
  GET_CURRENCIES_SUCCESS,
} from '../actions';

const INITIAL_STATE = {
  currencies: null,
  error: '',
  expenses: [],
  total: '0',
};

const wallet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case GET_CURRENCIES_SUCCESS:
    return {
      ...state,
      currencies: action.payload
        .filter(([code]) => code !== 'USDT')
        .map(([currency]) => currency) };
  case GET_CURRENCIES_FAIL:
    return { ...state, error: action.payload };
  case ADD_EXPENSE:
    return { ...state, expenses: [...state.expenses, action.payload] };
  case CALC_TOTAL:
    return {
      ...state,
      total: state.expenses.reduce((total, { value, currency, exchangeRates }) => {
        const multiplicator = exchangeRates[currency].ask;
        return total + (value * multiplicator);
      }, 0).toFixed(2),
    };
  default: return state;
  }
};

export default wallet;
