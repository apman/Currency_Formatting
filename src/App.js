import React, { Component } from 'react';
import './App.css';
import CurrencyScraper from './Resources/CurrencyScraper';
import locales from '../node_modules/i18n-locales';

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

    console.log(JSON.stringify(locales, null, 2));
  }
}

export default App;
