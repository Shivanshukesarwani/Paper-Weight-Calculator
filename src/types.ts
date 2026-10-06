export type OperatorType = '+' | '-' | '*' | '/' | '=' | 'tax+' | 'tax-' | '%' | 'subtotal' | 'total' | 'gt';

export type ItemType = 'entry' | 'subtotal' | 'total' | 'grand_total' | 'tax' | 'discount' | 'comment' | 'clear';

export interface TapeLine {
  id: string;
  type: ItemType;
  operator: string;
  rawInput?: string;
  value: number; // numeric value of this entry
  runningBalance: number; // running balance after this entry
  label: string; // optional note e.g. "Lunch", "State Tax"
  timestamp: string;
  isChecked?: boolean; // reconciliation tick
  taxRate?: number; // if tax entry
}

export type PaperTheme = 
  | 'classic-thermal' 
  | 'accounting-ledger' 
  | 'college-ruled' 
  | 'grid-blueprint' 
  | 'slate-dark';

export type NegativeDisplay = 'minus' | 'parentheses' | 'credit-cr';

export interface AppSettings {
  paperTheme: PaperTheme;
  currencySymbol: string;
  decimals: 'float' | '0' | '2' | '3' | '4';
  taxRate: number; // percentage e.g. 8.25
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  negativeDisplay: NegativeDisplay;
  showRunningBalance: boolean;
  twoColorRibbon: boolean; // red for negative debits, black for positive
  autoScroll: boolean;
}

export interface SavedTape {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  items: TapeLine[];
  grandTotal: number;
  itemCount: number;
  theme: PaperTheme;
  notes?: string;
}

export interface ScratchpadLineResult {
  lineNumber: number;
  rawText: string;
  isComment: boolean;
  isHeading: boolean;
  hasError: boolean;
  errorMessage?: string;
  variableName?: string;
  value?: number;
  formattedResult?: string;
}
