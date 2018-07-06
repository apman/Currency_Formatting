import React, { Component } from 'react';
import {Card, Form, FormLayout, ChoiceList, TextField, Select, Button} from '@shopify/polaris';


class FilterPane extends Component {
    state = {
      showHide: 'show',
      filter: '',
      customFilter: '',
      amount: '9.99'
    };
  
    render() {
      const {showHide, filter, customFilter, amount} = this.state;
      const options = [
        {label: 'All', value: ''},
        {label: 'Western Arabic Numerals', value: 'westernNumerals'},
        {label: 'Decimal mark: "."', value: 'decimalPoint'},
        {label: 'Decimal mark: ","', value: 'decimalComma'},
        {label: 'Decimal mark: "." or ","', value: 'decimalPointOrComma'},
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
      const show = (this.state.showHide == 'show');  // won't work with ===
      this.props.onSubmit(show);
    };
  
    handleAmountChange = field => {
      return (value) => this.setState({[field]: value});
    };
    handleCustomFilterChange = field => {
      return (value) => this.setState({[field]: value});
    };

    handleFilterChange = newValue => {
      this.setState({selected: newValue});
    };
  
    handleHideShowChange = value => {
      this.setState({ showHide: value });
    };
  
  }

  export default FilterPane;
