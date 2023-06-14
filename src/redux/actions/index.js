export const GET_EMAIL_ON_LOGIN = 'GET_EMAIL_ON_LOGIN';

export const getEmailOnLogin = (email) => ({ type: GET_EMAIL_ON_LOGIN, payload: email });
