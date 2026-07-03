export interface ParsedTransaction {
  date:string;
  category:string;
  item:string;
  amount:number;
  originalItem?:string;
}
