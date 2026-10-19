type ReplacementFilter = (date: Date, item: string, amount: number) => boolean;
type ReplacementCondition = string | [string, ReplacementFilter];
export type ReplacementMap = Record<string, ReplacementCondition[]>;

export const CATEGORY_REPLACEMENTS:ReplacementMap = {
  'Food': [
    'drinks to go',
    'drinks for home',
    'eating out',
    'groceries',
    "haniya's fridge",
    'snacks',
    'coffee shop',
    'delivery',
    'coco chicken',
  ],
  'Bills': [
    'amazon web services',
    'phone',
    'internet',
    'balance protection tax',
    'balance protection insurance',
  ],
  'Subscriptions': [
    'spotify',
    'jetbrains',
    'netflix',
    'anthropic',
    'amazon prime',
    'crunchyroll',
  ],
  'Haniya': [
    'Adventures',
  ],
  'Transportation': [
    'fuel',
    'parking',
  ],
  'Video Games': [
    'steamgames',
    'steam purchase',
  ],
  'Health': [
    'skincare',
  ],
  'Eunice': [
    'food',
  ],
};

export const ITEM_REPLACEMENTS:ReplacementMap = {
  'Eating out': [
    'noodlebox',
    'sams grill',
    'sam-s grill',
    'WOK BOX',
    'lazeez',
    'kibo market union',
    ['cherry blossom', (date, item, amount) => amount < 30],
  ],
  'Eating out Duo': [
    'mcdonald',
    'wendys',
    'marble slab',
    'a&w',
    'popeyes',
    'east side marios',
    'dominos pizza',
  ],
  'Delivery': [
    'skipthedishes',
    'ubereats',
  ],
  'Snacks': [
    'fluffy glaze',
  ],
  'Drinks to go': [
    'tim hortons',
    'coco fresh tea',
    'chatime',
    'gotcha bubble tea',
    'gongcha',
    'gong cha',
    'kung fu tea',
    ['esso circle', (date, item, amount) => amount < 10],
  ],
  'Drinks for home': [
    ['dollarama', (date, item, amount) => amount == 6.22],
  ],
  'Coffee shop': [
    'java beans',
    'centurion coffee',
    'wfc 108 guelph',
  ],
  'Internet': ['bell canada'],
  'Phone': ['virgin plus'],
  'Balance Protection Tax': ['Balance Protection Tax'],
  'Balance Protection Insurance': ['Balance Protection Ins'],
  'Spotify': ['Spotify'],
  'Netflix': ['netflix'],
  'JetBrains': ['jetbrains'],
  'Anthropic': ['anthropic'],
  'Amazon Prime': ['prime member'],
  'Crunchyroll': ['crunchyroll'],
  'Adventures': [
    'the round table',
    'activate cambridge',
    'exitus escape room',
    'sky zone',
    'claw me baby',
  ],
  'Fuel': [
    'mobil@',
    'canadian tire gas bar',
    'petro-canada',
  ],
  'Parking': [
    'honk parking',
  ],
  'Skincare': [
    'sephora',
  ],
  'Food': [
    'sp royal canin',
  ],
  'Toys': [
    ['pet valu', (date, item, amount) => amount < 10],
    'global pet foods',
  ],
};

export function doReplacement(date:Date, itemRaw:string, amount:number, replacements:ReplacementMap):string|null {
  for (const replacement in replacements) {
    for (const condition of replacements[replacement]) {
      if (typeof condition === 'string') {
        const re = new RegExp(`.*${condition}.*`, 'i');
        if (itemRaw.match(re)) {
          return replacement;
        }
      } else {
        const re = new RegExp(`.*${condition[0]}.*`, 'i');
        const filter = condition[1];
        if (filter(date, itemRaw, amount) && itemRaw.match(re)) {
          return replacement;
        }
      }
    }
  }
  return null;
}
