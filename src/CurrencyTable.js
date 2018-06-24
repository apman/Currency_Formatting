import React, { Component } from 'react';
import {Card, Link, Tooltip} from '@shopify/polaris';
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
    const rowHeading = <th><Tooltip content={JSON.stringify(currency.countries, null, 1)}><Link>{currency.code}<br />{currency.name}</Link></Tooltip></th>
    const formattedValues = locales.map(locale => <td>{new Intl.NumberFormat(locale, {style: 'currency', currency: currency.code}).format(9.99)}</td>);
    return <tr>{rowHeading}{formattedValues}</tr>;
    //  ???  would it be preferable to use a for loop to push individual formatted values onto [rowHeading] to avoid
    //        the reshuffle ?
  }

  localeHeadings() {
    const {locales} = this.props;
    const headings = locales.map(locale => <th>{locale}</th>);
    return headings;
  }

  // const test = 'hello';
  
  render() {
    const {currencies, locales} = this.props;
    const rows = this.currencyRows(); 
    const headings = this.localeHeadings();

    return (
      <div>
        <table>
          <thead>
            <tr><th>Currency</th>{headings}</tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
        <div>{`Showing ${rows.length} of ${currencies.length} currencies, and ${headings.length - 1} of ${locales.length} locales`}</div>
      </div>
    );
  }

}

export default CurrencyTable;
