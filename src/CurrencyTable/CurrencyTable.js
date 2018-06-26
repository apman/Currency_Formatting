import React, { Component } from 'react';
import {Link, Tooltip} from '@shopify/polaris';
import autoBind from 'react-autobind';
import styles from './CurrencyTable.scss';
import countryCodes from '../Resources/CountryCodes.json';
import languageCodes from '../Resources/LanguageCodes.json';


class CurrencyTable extends Component {
  constructor () {
    super();
    autoBind(this);

    this.state = {
      showColumns: [10, 15, 109, 355],  // TODO:   set dynamically ...
      showRows: [10, 15, 109, 120, 130],  // TODO:   set dynamically ...
    }
  
  }

  currencyRows() {
    const {currencies} = this.props;
    const rows = currencies.map(this.currencyRow);
    return rows;
  }

  currencyRow(currency, index) {
    const {locales} = this.props;
    let prevLanguage = '';
    let colouredColumn = true;
    const formattedValues = locales.map((locale, index) => {

      // Colour coding of language groups  //  TODO:  make separate fct ??
      const thirdLetter = locale.substr(2, 1);
      const language = (thirdLetter === ' ' || thirdLetter === '-') 
        ? locale.substr(0, 2)
        : locale.substr(0, 3);
      if (language !== prevLanguage) {
        prevLanguage = language;
        colouredColumn = !colouredColumn;
      }
      const colourClass = (colouredColumn) ? 'coloured-column' : '';

      return (
        <span key={`val_${index}`} className={`${colourClass}`}>
          {new Intl.NumberFormat(locale, {style: 'currency', currency: currency.code}).format(9.99)}
        </span>
      );
    }
    );
    return <div className="trow" key={`row_${index}`}>{formattedValues}</div>;
    //  ???  would it be preferable to use a for loop to push individual formatted values onto [rowHeading] to avoid
    //        the reshuffle ?
  }

  currencyHeadings() {
    const {currencies} = this.props;
    return (currencies.map((currency, index) => (
          <div className="trow" key={`cur_${index}`}>
            <span>
              <Tooltip content={JSON.stringify(currency.countries, null, 1)
                  .replace('[', '')
                  .replace(']', '')
                  .replace(/"/g, '')
                }
              >
                <Link><b>{currency.code}</b><br />{currency.name}</Link>
              </Tooltip>
            </span>
          </div>
        )
      )
    );
  }

  localeHeadings() {
    const {locales} = this.props;   
    
    return (locales.map((locale, index) => {
      
      // Country & Language rollover info
      const countryCodeMatch = locale.match(/[A-Z][A-Z]/);
      const countryCode = (countryCodeMatch) ? countryCodeMatch[0] : null;
      const languageCodeMatch = locale.match(/\w\w\w?/);
      const languageCode = (languageCodeMatch) ? languageCodeMatch[0] : null;
      let tooltip;
      const country = (countryCode) ? countryCodes.Countries[countryCode] : null;
      const countryName = (country) ? `(${country.name})` : '';
      const countryFile = (country) ? country.file : null;
      const language = (languageCode) ? languageCodes.Languages[languageCode].name : null;
      if (language || countryName) {
        const link = 
          <Link 
            url={(countryFile) ? `http://www.nationsonline.org/oneworld/${countryFile}` : '#'} 
            external={true}>
              {locale}
          </Link>;
        tooltip = <Tooltip content={`${language} ${countryName}`}>{link}</Tooltip>;
      }

      return (<span key={`loc_${index}`}>{tooltip || locale}</span>);
    }));
  }

  componentDidMount() {
    const fcBody = document.querySelector(".fix-column > .tbody");
    const rcBody = document.querySelector(".rest-columns > .tbody");
    const rcHead = document.querySelector(".rest-columns > .thead");
    rcBody.addEventListener("scroll", function() {
          fcBody.scrollTop = this.scrollTop;
          rcHead.scrollLeft = this.scrollLeft;
      }, { passive: true });
  }
  // const test = 'hello';
  
  render() {
    const {currencies, locales} = this.props;
    const rows = this.currencyRows(); 
    const columnHeadings = this.localeHeadings();
    const rowHeadings = this.currencyHeadings();

    return (
      <div>
        <div>{`Showing ${this.state.showRows.length} of ${currencies.length} currencies, and ${this.state.showColumns.length} of ${locales.length} locales`}</div>


        <div>
          <div className="fix-column">
              <div className="thead">
                  <span>Currency</span>
              </div>
              <div className="tbody">{rowHeadings}</div>
          </div>
          <div className="rest-columns">
              <div className="thead">{columnHeadings}</div>
              <div className="tbody">{rows}</div>
          </div>
        </div>
      </div>
    );
  }

}

export default CurrencyTable;
