export const CATEGORY_REPLACEMENTS = {
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
export const ITEM_REPLACEMENTS = {
  'Eating out': [
    'noodlebox',
    'sams grill',
    'WOK BOX',
    'lazeez',
    'fluffy glaze',
    'kibo market union',
  ],
  'Eating out Duo': [
    'mcdonald',
    'wendys',
    'marble slab',
    'a&w',
    'popeyes',
    'east side marios',
  ],
  'Drinks to go': [
    ['tim hortons', (d, i, a) => a === 3.14],
    'coco fresh tea',
    'chatime',
    'gotcha bubble tea',
    'gongcha',
    'gong cha',
    ['centurion coffee', (d, i, a) => a === 5.59],
    ['esso circle', (d, i, a) => a === 2.51],
  ],
  'Coffee shop': [
    'java beans',
  ],
  'Internet': ['bell canada'],
  'Phone': ['virgin plus'],
  'Balance Protection Tax': ['Balance Protection Tax'],
  'Balance Protection Insurance': ['Balance Protection Ins'],
  'Spotify': ['Spotify'],
  'Netflix': ['netflix'],
  'JetBrains': ['jetbrains'],
  'Food': ['sp royal canin'],
  'Adventures': [
    'the round table',
    'activate cambridge',
    'exitus escape room',
    'sky zone',
    'claw me baby',
  ],
  'Fuel': [
    'mobil@',
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
