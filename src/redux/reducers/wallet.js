import { GET_CURRENCIES_FAIL, GET_CURRENCIES_SUCCESS } from '../actions';

const INITIAL_STATE = {
  currencies: null,
  error: '',
};

const wallet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case GET_CURRENCIES_SUCCESS:
    return { ...state, currencies: action.payload };
  case GET_CURRENCIES_FAIL:
    return { ...state, error: action.payload };
  default: return state;
  }
};

export default wallet;
