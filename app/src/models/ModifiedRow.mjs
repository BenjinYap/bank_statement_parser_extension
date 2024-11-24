export class ModifiedRow {
  constructor(parsed_row) {
    this.parsed_row = parsed_row;
  }

  getDate() {
    return this.parsed_row.date;
  }

  getCategory() {
    return this.parsed_row.category;
  }

  getItem() {
    return this.parsed_row.item;
  }

  getAmount() {
    return this.parsed_row.amount;
  }
}
