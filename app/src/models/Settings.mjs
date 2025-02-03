const NAMESPACE = 'awdawd';

export class Settings {
  constructor() {
    if (chrome.runtime) {
      this.storage_area = chrome.storage.local;
    } else {
      this.storage = window.localStorage;
    }
    
    this.category_replacements = {
  'Food': [
    'drinks to go',
    'drinks for home',
    'eating out',
    'groceries',
    "haniya's fridge",
    'snacks',
  ],
  'Bills': [
    'amazon web services',
    'phone',
    'internet',
  ],
  'Subscriptions': [
    'spotify',
    'jetbrains',
    'netflix',
  ],
  'Eunice': [
    'Food',
  ],
  'Haniya': [
    'Adventures',
  ],
  'Transportation': [
    'fuel',
  ],
};
    this.category_replacements = {};
    this.item_replacements = {};
  }
  
  async load () {
    if (this.storage_area) {
      raw = await this.storage_area.get(NAMESPACE);
    } else {
      const json = JSON.parse(this.storage.getItem(NAMESPACE));
      console.log(json, this.storage.getItem(NAMESPACE));
      this.category_replacements = json.category_replacements;
      this.item_replacements = json.item_replacements;
      console.log(this);
    }
  }
  
  async save () {
    const obj = {
      cr: this.category_replacements,
      ir: this.item_replacements,
    };
    
    if (this.storage_area) {
      await this.storage_area.set({NAMESPACE: obj});
    } else {
      this.storage.setItem(NAMESPACE, JSON.stringify(obj));
    }
  }
}