const CURRENCIES_URL = 'https://economia.awesomeapi.com.br/json/all';

export const fetchCurrencies = async () => {
  const res = await fetch(CURRENCIES_URL);
  if (!res.ok) throw new Error(`Serviço indisponível: ${res.status}`);
  const currenciesRaw = await res.json();
  const currenciesFiltered = Object.keys(currenciesRaw)
    .filter((code) => code !== 'USDT');
  return currenciesFiltered;
};