function parseDate(row:string):Date {
  let date:Date = new Date(row.split('\t')[0]);
  if (date.toString() === 'Invalid Date') {
    date = new Date('0001-01-01');
  }
  return date;
}

// Sort by first date col then converts into commas
export function sortRows(rows:string[]):string[] {
  return [...rows].filter(r => r).sort((a, b) => {
    const date1:Date = parseDate(a);
    const date2:Date = parseDate(b);
    return date1.getTime() - date2.getTime();
  }).map(r => r.split('\t').join(','));
}
