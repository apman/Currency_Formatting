import React, { Component } from 'react';
import {Card, Form, FormLayout, ChoiceList, TextField, Select, Button} from '@shopify/polaris';


class FilterPane extends Component {
    state = {
      showHide: 'show',
      filter: '',
      customFilter: '',
      amount: this.props.amount,
    };
  
    render() {
      const {showHide, filter, customFilter, amount} = this.state;
      //   TODO:  add test if the amount string is even long enough and has a '.' otherwise only over basic filters 
      const numbers = amount.toString().split('.');  
      console.log('%cDebug: %o %s', 'color: green', numbers, 'numbers');      // TEMP ..
      const firstDecimal = `${numbers[1][0]}`;  
      const intPortion = `${numbers[0]}`; 
      const roundedInt = `${Math.round(amount).toString()}`;
      var start = intPortion.slice(0, -3);
      var mid = intPortion.slice(-3, intPortion.length-1);
      var end1 = intPortion.slice(intPortion.length-1);
      var end2 = roundedInt.slice(roundedInt.length-1);

      const options = [
        {label: 'All', value: '\\S'},
        {label: 'Western Arabic Numerals', value: '\\d'},
        {label: 'No Decimals', value: `^[^9]*[${roundedInt}.,][^9]*$`},
        {label: 'Decimals', value: firstDecimal},
        {label: '1 Decimal only', value: `${firstDecimal}[^\\d]*$`},
        {label: '2 Decimals', value: `${firstDecimal}\\d{1}[^\\\d]*$`},
        {label: '3 Decimals', value: `${firstDecimal}\\d{2}[^\\d]*$`},
        {label: '4 Decimals', value: `${firstDecimal}\\d{3}[^\\d]*$`},
        {label: 'Decimal mark: "."', value: `[.]${firstDecimal}`},
        {label: 'Decimal mark: ","', value: `[,]${firstDecimal}`},
        {label: 'Decimal mark: "." or ","', value: '[.,]'},
        {label: 'Symbols other than $', value: `[^A-Za-z0-9\\\s,.\\$].*\\d|\\d.*[^A-Za-z0-9\\s,.\\$]`},
        {label: 'No grouping', value: `[(${intPortion})(${roundedInt})]`},
        {label: 'Grouping 3 digits with ,', value: `${start}[,]${mid}[${end1}${end2}]`},
        {label: 'Grouping 3 digits with .', value: `${start}[.]${mid}[${end1}${end2}]`},
        {label: '$ sign', value: '\\$'},
        {label: '€ sign', value: '€'},
        {label: 'Custom:', value: 'custom'},
      ];
      
      return (
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <FormLayout>
              <FormLayout.Group condensed>
                <TextField
                  value={amount}
                  onChange={this.handleAmountChange('amount')}
                  label="Amount"
                  type="text"
                  helpText={
                    <span>
                      (Requires re-formatting)
                    </span>
                  }
                />

                <ChoiceList 
                  title={'Show/Hide'} 
                  choices={[{ label: 'Hide', value: 'hide' }, { label: 'Show only', value: 'show' }]} 
                  selected={showHide} onChange={this.handleHideShowChange} 
                  allowMultiple={false} 
                  titleHidden={true} 
                />
      
                <Select
                  label="Filter"
                  options={options}
                  onChange={this.handleFilterChange}
                  value={filter}
                />

                <TextField
                  value={customFilter}
                  onChange={this.handleCustomFilterChange('customFilter')}
                  label="Custom Filter"
                  type="text"
                  helpText={
                    <span>
                      Type a regular expression to create custom filter.
                    </span>
                  }
                />

                <Button primary submit>Submit</Button>
    
              </FormLayout.Group>
            </FormLayout>
          </Form>
        </Card>
      );
    }
  
    handleSubmit = (event) => {
      const {showHide, customFilter, amount} = this.state
      const show = (showHide == 'show');  // won't work with ===  //  TODO:  make showHide boolean everywhere if you won't implement match highlights
      this.props.onSubmit(show, customFilter, Number(amount));
    };
  
    handleAmountChange = field => {
      return (value) => this.setState({[field]: value});
    };

    handleCustomFilterChange = field => {
      return (value) => this.setState({[field]: value, filter: 'custom'});
    };

    handleFilterChange = newValue => {
      this.setState({filter: newValue, customFilter: (newValue == 'custom') ? '' : newValue});
    };
  
    handleHideShowChange = value => {
      this.setState({ showHide: value });
    };
  
  }

  export default FilterPane;
