export class ParsedRow {
  constructor(date, category, item, amount, original_item) {
    this.date = date;
    this.category = category;
    this.item = item;
    this.amount = amount;
    this.original_item = original_item;
  }

  getDate() {
    return this.date;
  }

  getCategory() {
    return this.category;
  }

  getItem() {
    return this.item;
  }

  getAmount() {
    return this.amount;
  }
}
