import React, { Component } from 'react';
import {Card, DataTable, Link, Tooltip} from '@shopify/polaris';

class CurrencyTable extends Component {
  
    render() {
        const rows = [
        [<Tooltip content={JSON.stringify(this.props.currencies[0].countries, null, 1)}><Link>{this.props.currencies[0].code} - {this.props.currencies[0].name}</Link></Tooltip>, new Intl.NumberFormat(this.props.locales[0], {style: 'currency', currency: this.props.currencies[0].code}).format(9.99), 124689, 140, '$122,500.00'],
        [<Tooltip content={JSON.stringify(this.props.currencies[1].countries, null, 1)}><Link>{this.props.currencies[1].code} - {this.props.currencies[1].name}</Link></Tooltip>, new Intl.NumberFormat(this.props.locales[0], {style: 'currency', currency: this.props.currencies[1].code}).format(9.99), 124689, 140, '$122,500.00'],
        [<Tooltip content={JSON.stringify(this.props.currencies[2].countries, null, 1)}><Link>{this.props.currencies[2].code} - {this.props.currencies[2].name}</Link></Tooltip>, '$875.00', 124689, 140, '$122,500.00'],
        [<Tooltip content={JSON.stringify(this.props.currencies[3].countries, null, 1)}><Link>{this.props.currencies[3].code} - {this.props.currencies[3].name}</Link></Tooltip>, '$875.00', 124689, 140, '$122,500.00'],
      ];
      const columnContentTypes = [
        'text',
        'numeric',
        'numeric',
        'numeric',
        'numeric',
      ];
  
      const headings = [
        'Currencies/Locales',
        this.props.locales[0],
        this.props.locales[1],
        this.props.locales[2],
        this.props.locales[3],
      ];
  
      return (
        <Card>
          <DataTable
            columnContentTypes={columnContentTypes}
            headings={headings}
            rows={rows}
            footerContent={`Showing ${rows.length} of ${rows.length} results`}
          />
        </Card>
      );
  }

}

export default CurrencyTable;
