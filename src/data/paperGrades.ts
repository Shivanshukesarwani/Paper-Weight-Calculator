import { BasisGradeInfo, BasisGradeType } from '../types/paper';

export interface IndianPaperGrade {
  id: string;
  name: string;
  category: string;
  typicalGsm: number[];
  defaultGsm: number;
  popularBrands: string;
  description: string;
  hsnCode: string;
  standardGst: number; // 12 or 18%
  bulkFactor: number;
}

export const INDIAN_PAPER_GRADES: IndianPaperGrade[] = [
  {
    id: 'copier_office',
    name: 'Copier / Multipurpose Office Paper',
    category: 'Office & Stationery',
    typicalGsm: [65, 70, 75, 80],
    defaultGsm: 75,
    popularBrands: 'JK Copier, Century Star, BILT Copy Power, TNPL, Andhra Paper',
    description: 'High brightness, smooth office paper for daily photocopying and laser/inkjet printing',
    hsnCode: '4802',
    standardGst: 12,
    bulkFactor: 1.25,
  },
  {
    id: 'maplitho_book',
    name: 'Maplitho Paper (Book & Commercial Printing)',
    category: 'Publishing',
    typicalGsm: [54, 58, 60, 70, 80, 90, 100],
    defaultGsm: 70,
    popularBrands: 'Ballarpur BILT, West Coast Paper, Star Paper, Trident, Emami',
    description: 'Uncoated writing and printing paper for textbooks, novel interiors, registers, diaries, and government publications',
    hsnCode: '4802',
    standardGst: 12,
    bulkFactor: 1.30,
  },
  {
    id: 'art_paper_gloss_matt',
    name: 'Art Paper (Gloss / Matt Coated)',
    category: 'Commercial Offset',
    typicalGsm: [90, 100, 120, 130, 150, 170],
    defaultGsm: 130,
    popularBrands: 'BILT Royal, ITC Art Paper, Nevia, Sinar Mas, APP Gold East',
    description: 'Clay-coated ultra-smooth paper for multicolor brochures, flyers, magazines, posters, and company profiles',
    hsnCode: '4810',
    standardGst: 18,
    bulkFactor: 0.95,
  },
  {
    id: 'art_card',
    name: 'Art Card (Heavy Cardstock)',
    category: 'Cards & Covers',
    typicalGsm: [210, 250, 300, 350],
    defaultGsm: 300,
    popularBrands: 'ITC Cyber XL, BILT Royal Art Card, Moorim, Hansol',
    description: 'Double-side coated cardstock for visiting cards, book covers, presentation folders, and wedding cards',
    hsnCode: '4810',
    standardGst: 18,
    bulkFactor: 1.05,
  },
  {
    id: 'duplex_board_grey',
    name: 'Duplex Board (Grey Back / White Back)',
    category: 'Packaging Board',
    typicalGsm: [230, 250, 300, 350, 400],
    defaultGsm: 300,
    popularBrands: 'Gayatrishree, Khanna Paper, Devashray, Emami Paper Mills',
    description: 'Recycled multi-ply board for packaging sweet boxes, garment cartons, and pharmaceutical medicine mono cartons',
    hsnCode: '4810',
    standardGst: 12,
    bulkFactor: 1.35,
  },
  {
    id: 'fbb_sbs_board',
    name: 'FBB / SBS Board (Virgin Food Grade)',
    category: 'Premium Packaging',
    typicalGsm: [230, 250, 280, 300, 350],
    defaultGsm: 280,
    popularBrands: 'ITC Cyber Propel / Safire, Century OBA Free, Stora Enso',
    description: 'Virgin bleached sulfate pulp board for luxury cosmetics, food boxes, FMCG packaging, and high-end cartons',
    hsnCode: '4810',
    standardGst: 18,
    bulkFactor: 1.40,
  },
  {
    id: 'kraft_paper',
    name: 'Kraft Paper (Packaging & Bags)',
    category: 'Corrugation & Bags',
    typicalGsm: [80, 100, 120, 140, 150, 180, 200],
    defaultGsm: 120,
    popularBrands: 'Genau, Kuantum, Naini Papers, Shreyans, Ruchira',
    description: 'High tensile strength ribbed/plain brown paper for carry bags, e-commerce envelopes, and corrugated boxes (16 BF to 32 BF)',
    hsnCode: '4804',
    standardGst: 12,
    bulkFactor: 1.25,
  },
  {
    id: 'newsprint_india',
    name: 'Newsprint Paper',
    category: 'Newspaper & Flyers',
    typicalGsm: [42, 45, 48],
    defaultGsm: 45,
    popularBrands: 'TNPL Newsprint, Rama Newsprint, Emami Paper, Glatfelter',
    description: 'Economical high-opacity lightweight paper for daily morning newspapers, weekly gazettes, and handbills',
    hsnCode: '4801',
    standardGst: 5,
    bulkFactor: 1.50,
  },
];

export const BASIS_GRADES: Record<BasisGradeType, BasisGradeInfo> = {
  bond: {
    type: 'bond',
    name: 'Bond / Writing / Ledger',
    basicWidthIn: 17,
    basicHeightIn: 22,
    basicAreaSqIn: 374,
    gsmFactor: 1406.14 / 374,
    commonPounds: [16, 20, 24, 28, 32],
    typicalUses: 'Everyday office copy, letterheads, business stationery',
  },
  book_text: {
    type: 'book_text',
    name: 'Book / Text / Offset',
    basicWidthIn: 25,
    basicHeightIn: 38,
    basicAreaSqIn: 950,
    gsmFactor: 1406.14 / 950,
    commonPounds: [50, 60, 70, 80, 100],
    typicalUses: 'Book publishing, commercial brochures, catalog pages',
  },
  cover: {
    type: 'cover',
    name: 'Cover / Cardstock',
    basicWidthIn: 20,
    basicHeightIn: 26,
    basicAreaSqIn: 520,
    gsmFactor: 1406.14 / 520,
    commonPounds: [60, 65, 80, 100, 120],
    typicalUses: 'Book covers, report titles, visiting cards, folders',
  },
  index: {
    type: 'index',
    name: 'Index',
    basicWidthIn: 25.5,
    basicHeightIn: 30.5,
    basicAreaSqIn: 777.75,
    gsmFactor: 1406.14 / 777.75,
    commonPounds: [90, 110, 140],
    typicalUses: 'Index cards, tabs, divider sheets, file folders',
  },
  tag: {
    type: 'tag',
    name: 'Tag',
    basicWidthIn: 24,
    basicHeightIn: 36,
    basicAreaSqIn: 864,
    gsmFactor: 1406.14 / 864,
    commonPounds: [100, 125, 150, 175, 200],
    typicalUses: 'Luggage tags, retail garment price tags',
  },
  bristol: {
    type: 'bristol',
    name: 'Bristol',
    basicWidthIn: 22.5,
    basicHeightIn: 28.5,
    basicAreaSqIn: 641.25,
    gsmFactor: 1406.14 / 641.25,
    commonPounds: [67, 80, 100, 120],
    typicalUses: 'Greeting cards, drawing paper, tickets',
  },
  newsprint: {
    type: 'newsprint',
    name: 'Newsprint',
    basicWidthIn: 24,
    basicHeightIn: 36,
    basicAreaSqIn: 864,
    gsmFactor: 1406.14 / 864,
    commonPounds: [30, 32, 35],
    typicalUses: 'Daily newspapers, advertising circulars',
  },
};

export interface GsmPreset {
  gsm: number;
  label: string;
  category: string;
  equivalentBondLb: number;
}

export const COMMON_GSM_PRESETS: GsmPreset[] = [
  { gsm: 45, label: '45 GSM — Indian Newsprint', category: 'Newsprint', equivalentBondLb: 12 },
  { gsm: 58, label: '58 GSM — Textbook Maplitho', category: 'Publishing', equivalentBondLb: 15 },
  { gsm: 70, label: '70 GSM — Standard Copier (TNPL / Century)', category: 'Copy / Multiuse', equivalentBondLb: 19 },
  { gsm: 75, label: '75 GSM — JK Copier Office Standard', category: 'Copy / Multiuse', equivalentBondLb: 20 },
  { gsm: 80, label: '80 GSM — Century Star Executive Copier', category: 'Copy / Multiuse', equivalentBondLb: 21 },
  { gsm: 100, label: '100 GSM — Executive Letterhead / Super Maplitho', category: 'Stationery', equivalentBondLb: 27 },
  { gsm: 130, label: '130 GSM — Art Paper (Brochures & Flyers)', category: 'Art Paper', equivalentBondLb: 35 },
  { gsm: 170, label: '170 GSM — Heavy Art Paper / Catalog Pages', category: 'Art Paper', equivalentBondLb: 45 },
  { gsm: 210, label: '210 GSM — Magazine Cover Art Card', category: 'Art Card', equivalentBondLb: 56 },
  { gsm: 250, label: '250 GSM — Sweet Box / Duplex Board', category: 'Duplex Board', equivalentBondLb: 66 },
  { gsm: 300, label: '300 GSM — Indian Visiting Cards & Covers', category: 'Cards & Board', equivalentBondLb: 80 },
  { gsm: 350, label: '350 GSM — Rigid Luxury Board / Heavy Cards', category: 'Rigid Board', equivalentBondLb: 93 },
];
