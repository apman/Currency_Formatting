import React, { Component } from 'react';
import {AppProvider, Page} from '@shopify/polaris';
import loadCurrencies from './Resources/CurrencyLoader';
import loadLocales from './Resources/LocalesLoader';
import CurrencyTable from './CurrencyTable/CurrencyTable.js'
// import locales from '../node_modules/i18n-locales';
import autoBind from 'react-autobind';

class App extends Component {
  constructor () {
    super();
    autoBind(this);

    this.state = {
      currencies: [],
      locales: [], 
      amount: 7.30,
    }
  }

  async componentDidMount() {
    loadCurrencies(this.getCurrencies);
    this.setState({locales: loadLocales()}) //  TODO:  allow generic/country-specific/all - add to UI
  }

  getCurrencies(currencyList) {
    this.setState({currencies: currencyList});
  }

  render() {
    const currencyTable = (this.state.currencies.length !== 0) 
      ? <CurrencyTable currencies={this.state.currencies} locales={this.state.locales} amount={this.state.amount}/> 
      : <div>Just a minute! Formatting takes a while ...</div>;
    return (
      <AppProvider>
        <Page>
          {currencyTable}
        </Page>
      </AppProvider>
    );
  }
}

export default App;
