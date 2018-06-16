import React, { Component } from 'react';
import {AppProvider, Page} from '@shopify/polaris';
import loadCurrencies from './Resources/CurrencyLoader';
import CurrencyTable from './CurrencyTable.js'
import locales from '../node_modules/i18n-locales';
import autoBind from 'react-autobind';

class App extends Component {
  constructor () {
    super();
    autoBind(this);

    this.state = {
      currencies: [],
      locales: locales,
    }
  }

  async componentDidMount() {
    loadCurrencies(this.getCurrencies);
  }

  render() {
    const currencyTable = (this.state.currencies.length !== 0) ? <CurrencyTable currencies={this.state.currencies} locales={locales} /> : <div>Just a sec ...</div>;
    return (
      <AppProvider>
        <Page>
          {currencyTable}
        </Page>
      </AppProvider>
    );
  }

  getCurrencies(currencyList) {
    this.setState({currencies: currencyList});
  }
}

export default App;
