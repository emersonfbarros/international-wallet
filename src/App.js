import React from 'react';
import { Route, Switch } from 'react-router-dom';
import WalletForm from './components/WalletForm';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route path="/carteira" component={ WalletForm } />
    </Switch>
  );
}

export default App;
