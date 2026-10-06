export type UnitSystem = 'metric' | 'imperial';

export type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft';

export type WeightUnit = 'g' | 'kg' | 't' | 'oz' | 'lb' | 'cwt' | 'ton_us';

export type PaperCategory = 
  | 'indian_standard' 
  | 'iso_a' 
  | 'iso_b' 
  | 'north_american' 
  | 'cards_stationery' 
  | 'envelopes' 
  | 'custom';

export interface PaperSize {
  id: string;
  name: string;
  category: PaperCategory;
  widthMm: number;
  heightMm: number;
  widthIn: number;
  heightIn: number;
  description?: string;
}

export type BasisGradeType = 
  | 'bond'       // 17" x 22" (374 sq in) - Factor ~3.76
  | 'book_text'  // 25" x 38" (950 sq in) - Factor ~1.48
  | 'cover'      // 20" x 26" (520 sq in) - Factor ~2.708
  | 'index'      // 25.5" x 30.5" (777.75 sq in) - Factor ~1.808
  | 'tag'        // 24" x 36" (864 sq in) - Factor ~1.627
  | 'bristol'    // 22.5" x 28.5" (641.25 sq in) - Factor ~2.193
  | 'newsprint'; // 24" x 36" (864 sq in) - Factor ~1.627

export interface BasisGradeInfo {
  type: BasisGradeType;
  name: string;
  basicWidthIn: number;
  basicHeightIn: number;
  basicAreaSqIn: number;
  gsmFactor: number; // GSM = lbs * gsmFactor
  commonPounds: number[];
  typicalUses: string;
}

export type QuantityUnit = 'sheets' | 'reams' | 'cartons' | 'gross' | 'daste' | 'packets_100' | 'bundles' | 'bales';

export type PriceMode = 
  | 'per_unit_weight' // e.g. ₹/kg
  | 'per_ream'        // e.g. ₹/ream
  | 'per_sheet'       // e.g. ₹/sheet
  | 'per_thousand_m'  // e.g. ₹/1,000 sheets
  | 'total_batch_fixed';

export interface WeightCalculatorInput {
  sizeId: string;
  customWidth: number;
  customHeight: number;
  customUnit: LengthUnit;
  weightInputType: 'gsm' | 'basis';
  gsm: number;
  basisWeightLbs: number;
  basisGrade: BasisGradeType;
  quantityValue: number;
  quantityUnit: QuantityUnit;
  bulkFactor: number; // Microns per GSM (typically 1.2 to 1.35)
}

export interface PriceCalculatorInput {
  priceMode: PriceMode;
  currencySymbol: string;
  pricePerWeightUnit: number;
  weightPriceUnit: 'kg' | 'lb' | 't' | 'ton_us';
  pricePerReam: number;
  pricePerThousand: number;
  pricePerSheet: number;
  fixedBatchPrice: number;
  
  // GST Inclusion on entered rate
  rateGstMode: 'exclusive' | 'inclusive';

  // Printing press & finishing charges
  trimmingCost: number; // Cutting / Katayi charges
  printingCostPerSheet: number; // Impression rate
  finishingSetupFee: number; // CTP Plate & Bindery setup
  laminationCostPerSheet: number; // Thermal / Gloss / Matt lamination
  
  // Shipping & Local Freight
  shippingMode: 'free' | 'flat' | 'by_weight';
  flatShippingFee: number;
  shippingRatePerLb: number;
  shippingRatePerKg: number;
  freeShippingOverAmount: number;
  
  // Discounts & Indian GST
  volumeDiscountPercent: number;
  taxRatePercent: number; // 0, 5, 12, 18, 28%
  gstType: 'intra_state' | 'inter_state'; // CGST+SGST vs IGST
  
  // Commercial Resale
  marginType: 'margin' | 'markup';
  targetMarginPercent: number; // e.g. 20% or 30% margin
}

export interface WeightCalculationResult {
  sheetAreaSqM: number;
  sheetAreaSqIn: number;
  effectiveGsm: number;
  effectiveBasisLbs: { [key in BasisGradeType]: number };
  
  widthIn: number;
  heightIn: number;
  widthMm: number;
  heightMm: number;
  
  totalSheets: number;
  totalReams: number;
  
  singleSheetGrams: number;
  singleSheetOz: number;
  singleSheetLbs: number;
  
  reamWeightKg: number; // exact physical ream weight
  reamWeightLbs: number;
  
  // Indian Press Standard Formulas
  indianReamWeightKg3100: number; // (L_in * W_in * GSM) / 3100
  
  mWeightLbs: number; // weight of 1000 sheets in lbs
  
  totalWeightGrams: number;
  totalWeightKg: number;
  totalWeightTonnes: number;
  totalWeightOz: number;
  totalWeightLbs: number;
  totalWeightUsTons: number;
  
  singleSheetThicknessMm: number;
  singleSheetThicknessCaliperPt: number;
  stackHeightMm: number;
  stackHeightInches: number;
}

export interface PriceCalculationResult {
  rateGstMode: 'exclusive' | 'inclusive';
  enteredPaperTotalGross: number;
  basePaperCost: number;
  paperGstPortion: number;
  effectiveNetRatePerUnit: number;
  effectiveGrossRatePerUnit: number;
  paperCostPerSheet: number;
  paperCostPerReam: number;
  paperCostPer1000: number;
  paperCostPerKg: number;
  paperCostPerLb: number;
  
  trimmingCostTotal: number;
  printingCostTotal: number;
  finishingSetupFee: number;
  laminationCostTotal: number;
  totalManufacturingCost: number;
  
  discountAmount: number;
  discountedCost: number;
  
  shippingCost: number;
  taxAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  
  totalAllInCost: number;
  allInCostPerSheet: number;
  allInCostPerReam: number;
  
  // Resale & Margin
  suggestedSellingPrice: number;
  sellingPricePerSheet: number;
  sellingPricePerReam: number;
  grossProfit: number;
  effectiveMarginPercent: number;
  effectiveMarkupPercent: number;
}

export interface FarmaCutResult {
  parentName: string;
  parentWidthIn: number;
  parentHeightIn: number;
  cutWidthIn: number;
  cutHeightIn: number;
  upsNormal: number;
  upsRotated: number;
  bestUps: number;
  orientationUsed: 'normal' | 'rotated';
  sheetWastagePercent: number;
  totalParentSheetsNeeded: number;
  totalParentReamsNeeded: number;
}
