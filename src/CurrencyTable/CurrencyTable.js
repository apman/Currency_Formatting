import React, { Component } from 'react';
import {Link, Tooltip} from '@shopify/polaris';
import autoBind from 'react-autobind';
import styles from './CurrencyTable.scss';
import countryCodes from '../Resources/CountryCodes.json';
import languageCodes from '../Resources/LanguageCodes.json';
import FilterPane from '../FilterPane/FilterPane.js';


class CurrencyTable extends Component {
  constructor (props) {
    super(props);
    autoBind(this);

    const maxCols = props.locales.length;
    const maxRows = props.currencies.length

    this.state = {
      formattedValues: this.formatAll(),
      showFields: Array(maxRows).fill(Array(maxCols).fill(true)),
      showColumns: Array(maxCols).fill(maxRows),
      showRows: Array(maxRows).fill(maxCols),
      numFields: maxCols * maxRows,
      numRows: maxRows,
      numColumns: maxCols,
    }
  }

  formatAll() {
    const {currencies} = this.props;
    const rows = currencies.map(this.formatRow);
    return rows;
  }

  formatRow(currency) {
    const {locales, amount} = this.props;
    const rowItems = locales.map((locale) => ({
        currency: currency.code,
        locale: locale,
        value: new Intl.NumberFormat(locale, {style: 'currency', currency: currency.code}).format(amount),
      })
    );
    return rowItems;
  }

  filter(show) {
    const {currencies, locales, amount} = this.props;
    
    const showFields = [];
    // const showFields = Array(currencies.length).fill(Array(locales.length).fill(false));  // REMEMBER  NOT WORKING! probably takes too long and gets confused when you start writing to it before finished ...
    const showRows = Array(currencies.length).fill(0);
    const showColumns = Array(locales.length).fill(0);
    let numFields = 0;
    let numRows = 0;
    let numColumns = 0;
    const westernNumerals = /\d/g;
    const decimalPoint = /[.]/g;
    const decimalComma = /[,]/g;
    const weirdDecimalSign = /\u{2396}/g; // not in use
    const weirdDecimalSign2 = /\u{066B}/g;  // not in use
    const decimals = new RegExp(`${amount.toString().split('.')[1]}`);  // TODO:  set up at top
    const decimalPointOrComma = new RegExp(`[,.]`);
    const dollar = /\$/g;
    const euro = /€/g;
    for (let i = 0; i < currencies.length; i++) {
      const showFieldsInRow = Array(locales.length).fill(false);
      //  TODO:  add row condition (only for decimal related filters):
      // if (this.state.formattedValues[i][0].value.search(decimals) === -1) continue;
      
      for (let j = 0; j < locales.length; j++) {
        const value = this.state.formattedValues[i][j].value;
        const filterResult = value.search(euro) > -1;
        // const filterResult = value.search(decimals) > -1;
        // const filterResult = ((j === 119) || (j === 120)) ;
        //       this.state.formattedValues[i][j].value.indexOf(',') >  -1 || .indexOf('10') > -1);
        if ((filterResult && show) || (!filterResult && !show)) {
          numFields++;
          if (!showRows[i]) numRows++;
          if (!showColumns[j]) numColumns++;
          showRows[i]++;
          showColumns[j]++;

          // showFields[i][j] = true;   // REMEMBER  NOT WORKING! this will override the whole array in one fell-swoop for some reason ...
          showFieldsInRow[j] = true;
        } 
      }
      showFields.push(showFieldsInRow);
    }
    this.setState({showFields, showRows, showColumns, numFields, numRows, numColumns});
  }  

  tableRows() {
    return this.state.formattedValues.map(this.tableRow);
  }
  
  tableRow(currencyRow, currencyIndex) {
    if (this.state.showRows.length <= currencyIndex || !this.state.showRows[currencyIndex]) {  // TODO:  remove length test
      return;
    }
    let prevLanguage = '';
    let colouredColumn = true;
    const tableCells = currencyRow.map((formattedValue, localeIndex) => {
        if (this.state.showColumns.length <= localeIndex || !this.state.showColumns[localeIndex]) {  // TODO:  remove length test
          return null;
        }
  
        // Colour coding of language groups  //  TODO:  make separate fct ??
        const thirdLetter = formattedValue.locale.substr(2, 1);
        const language = (thirdLetter === ' ' || thirdLetter === '-') 
          ? formattedValue.locale.substr(0, 2)
          : formattedValue.locale.substr(0, 3);
        if (language !== prevLanguage) {
          prevLanguage = language;
          colouredColumn = !colouredColumn;
        }
        const colourClass = (colouredColumn) ? 'coloured-column' : '';

        const textColourClass = (this.state.showFields[currencyIndex][localeIndex]) ? '' : 'hide'
        return (
          <span key={`val_${currencyIndex}/${localeIndex}`} className={`${colourClass} ${textColourClass}`}>
            {formattedValue.value}
          </span>
        );
      }
    );
    return <div className="trow" key={`row_${currencyIndex}`}>{tableCells}</div>;
  }


  currencyHeadings() {
    const {currencies} = this.props;
    return (currencies.map((currency, currencyIndex) => {
        if (this.state.showRows.length <= currencyIndex || !this.state.showRows[currencyIndex]) {  // TODO:  remove length test
          return null;
        }

        const colourClass = (this.state.showRows[currencyIndex] < this.state.numColumns) ? 'mixedValues' : '';

        return (
          <div className="trow" key={`cur_${currencyIndex}`}>
            <span className={colourClass}>
              <Tooltip content={currency.countries}>
                <Link><b>{currency.code}</b><br />{currency.name}</Link>
              </Tooltip>
            </span>
          </div>
        )
      })
    );
  }

  localeHeadings() {
    const {locales} = this.props;   
    
    return (locales.map((locale, localeIndex) => {
      if (this.state.showColumns.length <= localeIndex || !this.state.showColumns[localeIndex]) {  // TODO:  remove length test
        return null;
      }
    
      // Country & Language rollover info   //  TODO:  make separate fct ??
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

      const colourClass = (this.state.showColumns[localeIndex] < this.state.numRows) ? 'mixedValues' : '';

      return (<span key={`loc_${localeIndex}`} className={colourClass}>{tooltip || locale}</span>);
    }));
  }

  async componentDidMount() {
    const fixedColsBody = document.querySelector(".fix-column > .tbody");
    const restColsBody = document.querySelector(".rest-columns > .tbody");
    const restColsHead = document.querySelector(".rest-columns > .thead");
    restColsBody.addEventListener("scroll", function() {
          fixedColsBody.scrollTop = this.scrollTop;
          restColsHead.scrollLeft = this.scrollLeft;
      }, { passive: true }
    );
  }

  render() {
    const {currencies, locales} = this.props;
    const rows = this.tableRows(); 
    const columnHeadings = this.localeHeadings();
    const rowHeadings = this.currencyHeadings();

    return (
      <div>
        <FilterPane onSubmit={this.filter} />
        <div>
          {
            `Showing ${this.state.numRows} of ${currencies.length} currencies, 
             and ${this.state.numColumns} of ${locales.length} locales,
             ${this.state.numFields} of ${this.state.numColumns * this.state.numRows} possible pairs`
          }
        </div>

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
