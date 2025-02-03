export const STORAGE_TYPE_CHROME_LOCAL = 1;
export const STORAGE_TYPE_LOCAL_STORAGE = 2;

const NAMESPACE = 'awdawd';

export class StorageLayer {
  constructor(type) {
    this.type = type;
    
    switch (this.type) {
      case STORAGE_TYPE_CHROME_LOCAL:
        this.obj = chrome.storage.local;
        this.obj.setItem = (key, value) => {
          return this.obj.set({key: value});
        };
        this.obj.getItem = (key) => {
          return this.obj.get(key);
        };
        break;
      case STORAGE_TYPE_LOCAL_STORAGE:
        this.obj = window.localStorage;
        const the_set = this.obj.setItem.bind(this.obj);
        const the_get = this.obj.getItem.bind(this.obj);
        this.obj.setItem = (key, value) => {
          return the_set(key, value);
        };
        this.obj.getItem = (key) => {
          return the_get(key);
        };
        break;
    }
  }
  
  async get () {
    return await this.obj.getItem(NAMESPACE);
  }
  
  async set (obj) {
    await this.obj.setItem(NAMESPACE, obj);
  }
}