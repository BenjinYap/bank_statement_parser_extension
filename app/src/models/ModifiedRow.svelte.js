export class ModifiedRow {
  entries = $state([]);

  constructor(parsed_row) {
    this.parsed_row = parsed_row;

    this.entries = [{
      category: this.parsed_row.category,
      item: this.parsed_row.item,
      amount: this.parsed_row.amount,
      applied_tax: true,
    },{category:'Bbobbly flay', item:'loud noises aaaa', amount:23456.47, applied_tax: true}];
  }
  
  static clone(row) {
    // noinspection PointlessBooleanExpressionJS
    if (row instanceof ModifiedRow === false) {
      throw new Error('aaaa');
    }
    
    const c = new ModifiedRow(row.parsed_row);
    c.entries = row.entries.map((a) => {return {...a}});
    return c;
  }
}
