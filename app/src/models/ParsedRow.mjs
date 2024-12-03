export class ParsedRow {
  constructor(date, category, item, amount, original_item) {
    this.date = date;
    this.category = category;
    this.item = item;
    this.amount = amount;
    this.original_item = original_item;
  }
}
