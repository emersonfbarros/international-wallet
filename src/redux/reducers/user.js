import { GET_EMAIL_ON_LOGIN } from '../actions';

const INITIAL_STATE = { email: '' };

const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case GET_EMAIL_ON_LOGIN:
    return { ...state, email: action.payload };
  default: return state;
  }
};

export default user;
