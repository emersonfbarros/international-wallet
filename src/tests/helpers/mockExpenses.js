import mockData from './mockData';

const mockExpenses = [
  {
    id: 0,
    description: 'Banana nanica',
    tag: 'Alimentação',
    value: '2',
    method: 'Dinheiro',
    currency: 'CAD',
    exchangeRates: mockData,
  },
  {
    id: 1,
    description: 'Novo strap para smartband',
    tag: 'Lazer',
    value: '5',
    method: 'Cartão de crédito',
    currency: 'USD',
    exchangeRates: mockData,
  },
  {
    id: 2,
    description: 'Escova de dentes',
    tag: 'Saúde',
    value: '360',
    method: 'Cartão de débito',
    currency: 'JPY',
    exchangeRates: mockData,
  },
];

export default mockExpenses;
