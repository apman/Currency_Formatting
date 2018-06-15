import React, { Component } from 'react';
import './App.css';
import CurrencyScraper from './Resources/CurrencyScraper';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Currency Formatting</h1>
        </header>
        <CurrencyScraper whenDone={this.getCurrencies} />
      </div>
    );
  }

  getCurrencies(currencyList) {
    console.log('currencyList');
    console.log(currencyList);
  }
}

export default App;
