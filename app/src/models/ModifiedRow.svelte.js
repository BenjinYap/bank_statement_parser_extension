export class ModifiedRow {
  entries = $state([]);

  constructor(parsed_row) {
    this.parsed_row = parsed_row;

    this.entries = [{
      category: this.parsed_row.category,
      item: this.parsed_row.item,
      amount: this.parsed_row.amount,
    }];
  }
}
