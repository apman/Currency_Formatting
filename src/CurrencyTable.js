import React, { Component } from 'react';
import {Card, DataTable, Link, Tooltip} from '@shopify/polaris';
import autoBind from 'react-autobind';


class CurrencyTable extends Component {
  constructor () {
    super();
    autoBind(this);

    this.state = {
      showColumns: [10, 15, 109, 355]  // TODO:   set dynamically ...
    }
  
  }

  currencyRows() {
    const {currencies} = this.props;
    const rows = currencies.map(this.currencyRow);
    return rows;
  }

  currencyRow(currency) {
    const {locales} = this.props;
    const rowHeading = <Tooltip content={JSON.stringify(currency.countries, null, 1)}><Link>{currency.code}<br />{currency.name}</Link></Tooltip>
    const formattedValues = locales.map(locale => new Intl.NumberFormat(locale, {style: 'currency', currency: currency.code}).format(9.99));
    return [rowHeading].concat(formattedValues);
    //  ???  would it be preferable to use a for loop to push individual formatted values onto [rowHeading] to avoid
    //        the reshuffle ?
  }

  localeHeadings() {
    const {locales} = this.props;
    return ['Currency'].concat(locales);
  }
  
  render() {
    const {currencies, locales} = this.props;
      const rows = this.currencyRows(); 
    const columnContentTypes = ['text'].concat(Array(this.state.showColumns.length).fill('numeric'));

    const headings = this.localeHeadings();

    return (
      <Card>
        <DataTable
          columnContentTypes={columnContentTypes}
          headings={headings}
          rows={rows}
          footerContent={`Showing ${rows.length} of ${currencies.length} currencies, and ${headings.length - 1} of ${locales.length} locales`}
        />
      </Card>
    );
  }

}

export default CurrencyTable;
