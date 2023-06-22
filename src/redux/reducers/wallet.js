import {
  ADD_EXPENSE,
  CALC_TOTAL,
  GET_CURRENCIES_FAIL,
  GET_CURRENCIES_SUCCESS,
  DELETE_EXPENSE,
  START_EDITING,
  SAVE_EDIT,
} from '../actions';

const INITIAL_STATE = {
  currencies: [],
  error: '',
  expenses: [],
  total: '0',
  isEditing: false,
  indexOfWhichEdit: 0,
};

const wallet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case GET_CURRENCIES_SUCCESS:
    return {
      ...state,
      currencies: Object.keys(action.payload).filter((code) => code !== 'USDT'),
    };
  case GET_CURRENCIES_FAIL:
    return { ...state, error: action.payload };
  case ADD_EXPENSE:
    return { ...state, expenses: [...state.expenses, action.payload] };
  case CALC_TOTAL:
    return {
      ...state,
      total: state.expenses.reduce((total, { value, currency, exchangeRates }) => {
        const exchange = exchangeRates[currency].ask;
        return total + (value * exchange);
      }, 0).toFixed(2),
    };
  case DELETE_EXPENSE:
    return {
      ...state,
      expenses: state.expenses.filter((expense) => expense.id !== action.payload),
    };
  case START_EDITING:
    return { ...state, isEditing: true, indexOfWhichEdit: action.payload };
  case SAVE_EDIT:
    return { ...state, expenses: action.payload, isEditing: false };
  default: return state;
  }
};

export default wallet;
