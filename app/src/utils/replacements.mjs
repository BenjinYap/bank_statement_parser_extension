export const CATEGORY_REPLACEMENTS = {
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
  ],
  'Subscriptions': [
    'spotify',
    'jetbrains',
    'netflix',
  ],
  'Haniya': [
    'Adventures',
  ],
  'Transportation': [
    'fuel',
  ],
  'Video Games': [
    'steamgames',
  ],
};
export const ITEM_REPLACEMENTS = {
  'Eating out': [
    'noodlebox',
    'sams grill',
    'sam-s grill',
    'WOK BOX',
    'lazeez',
    'kibo market union',
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
  'Delivery': ['skipthedishes'],
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
    ['esso circle', (d, i, a) => a < 10],
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
};

export function doReplacement(date, item_raw, amount, replacements) {
  for (const item_replace in replacements) {
    for (const condition of replacements[item_replace]) {
      // condition is just a regex string
      if (typeof condition === 'string') {
        const re = new RegExp(`.*${condition}.*`, 'i');
        if (item_raw.match(re)) {
          return item_replace;
        }
      } else {  // condition is a regex string plus a custom filter function
        const re = new RegExp(`.*${condition[0]}.*`, 'i');

        const filter = condition[1];
        if (filter(date, item_raw, amount) && item_raw.match(re)) {
          return item_replace;
        }
      }
    }
  }

  return null;
}
