import {
  BasisGradeType,
  FarmaCutResult,
  LengthUnit,
  PriceCalculationResult,
  PriceCalculatorInput,
  QuantityUnit,
  WeightCalculationResult,
  WeightCalculatorInput,
} from '../types/paper';
import { BASIS_GRADES } from '../data/paperGrades';
import { PAPER_SIZES } from '../data/paperSizes';

export function lengthToMm(val: number, unit: LengthUnit): number {
  switch (unit) {
    case 'mm': return val;
    case 'cm': return val * 10;
    case 'm': return val * 1000;
    case 'in': return val * 25.4;
    case 'ft': return val * 304.8;
    default: return val;
  }
}

export function lengthToInches(val: number, unit: LengthUnit): number {
  switch (unit) {
    case 'in': return val;
    case 'mm': return val / 25.4;
    case 'cm': return val / 2.54;
    case 'm': return (val * 1000) / 25.4;
    case 'ft': return val * 12;
    default: return val;
  }
}

export function quantityToSheets(quantity: number, unit: QuantityUnit): number {
  switch (unit) {
    case 'sheets': return quantity;
    case 'reams': return quantity * 500; // 1 ream = 500 sheets
    case 'cartons': return quantity * 2500; // 1 carton = 5 reams = 2,500 sheets
    case 'gross': return quantity * 144; // 1 gross = 144 sheets
    case 'daste': return quantity * 25; // 1 dasta (quire) = 25 sheets (or 24 in traditional)
    case 'packets_100': return quantity * 100; // 100 sheets (standard board packet)
    case 'bundles': return quantity * 1000; // 1 bundle = 1,000 sheets
    case 'bales': return quantity * 5000; // 1 bale = 5,000 sheets
    default: return quantity;
  }
}

/**
 * Format numbers according to Indian numbering system (Lakhs, Crores)
 * e.g. 1,50,000 instead of 150,000
 */
export function formatIndianNumber(val: number, maxDecimals = 2, minDecimals = 0): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  return val.toLocaleString('en-IN', {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: minDecimals,
  });
}

export function formatIndianCurrency(val: number, symbol = '₹', maxDecimals = 2): string {
  if (isNaN(val) || !isFinite(val)) return `${symbol}0.00`;
  const formatted = val.toLocaleString('en-IN', {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
}

export function calculatePaperWeight(input: WeightCalculatorInput): WeightCalculationResult {
  // 1. Resolve dimensions in mm and inches
  let widthMm = 210; // default A4
  let heightMm = 297;
  let widthIn = 8.27;
  let heightIn = 11.69;

  if (input.sizeId === 'custom') {
    widthMm = lengthToMm(input.customWidth, input.customUnit);
    heightMm = lengthToMm(input.customHeight, input.customUnit);
    widthIn = lengthToInches(input.customWidth, input.customUnit);
    heightIn = lengthToInches(input.customHeight, input.customUnit);
  } else {
    const found = PAPER_SIZES.find((s) => s.id === input.sizeId);
    if (found) {
      widthMm = found.widthMm;
      heightMm = found.heightMm;
      widthIn = found.widthIn;
      heightIn = found.heightIn;
    }
  }

  // Safety checks
  widthMm = Math.max(0.1, widthMm);
  heightMm = Math.max(0.1, heightMm);
  widthIn = Math.max(0.01, widthIn);
  heightIn = Math.max(0.01, heightIn);

  // Sheet area
  const sheetAreaSqM = (widthMm * heightMm) / 1_000_000;
  const sheetAreaSqIn = widthIn * heightIn;

  // 2. Resolve GSM
  let effectiveGsm = input.gsm;
  if (input.weightInputType === 'basis') {
    const grade = BASIS_GRADES[input.basisGrade];
    effectiveGsm = input.basisWeightLbs * grade.gsmFactor;
  }
  effectiveGsm = Math.max(0.1, effectiveGsm);

  // Equivalent basis weights across all 7 grades
  const effectiveBasisLbs = {} as { [key in BasisGradeType]: number };
  (Object.keys(BASIS_GRADES) as BasisGradeType[]).forEach((key) => {
    const g = BASIS_GRADES[key];
    effectiveBasisLbs[key] = effectiveGsm / g.gsmFactor;
  });

  // 3. Resolve total sheets
  const totalSheets = Math.max(1, Math.round(quantityToSheets(input.quantityValue, input.quantityUnit)));
  const totalReams = totalSheets / 500;

  // 4. Weight of single sheet
  const singleSheetGrams = sheetAreaSqM * effectiveGsm;
  const singleSheetOz = singleSheetGrams / 28.349523;
  const singleSheetLbs = singleSheetGrams / 453.59237;

  // 5. Total weight
  const totalWeightGrams = singleSheetGrams * totalSheets;
  const totalWeightKg = totalWeightGrams / 1000;
  const totalWeightTonnes = totalWeightKg / 1000;
  const totalWeightOz = singleSheetOz * totalSheets;
  const totalWeightLbs = singleSheetLbs * totalSheets;
  const totalWeightUsTons = totalWeightLbs / 2000;

  // 6. Indian Press Ream Weight Formula
  // Ream Weight (in kg) = (Length_in * Width_in * GSM) / 3100
  const indianReamWeightKg3100 = (widthIn * heightIn * effectiveGsm) / 3100;

  // Exact physical ream weight
  const reamWeightKg = (singleSheetGrams * 500) / 1000;
  const reamWeightLbs = (singleSheetLbs * 500);

  // 7. M-Weight (weight of 1,000 cut sheets in pounds)
  const mWeightLbs = singleSheetLbs * 1000;

  // 8. Caliper & Stack thickness
  const bulk = Math.max(0.8, Math.min(2.5, input.bulkFactor || 1.25));
  const singleSheetThicknessMm = (effectiveGsm * bulk) / 1000; // in mm
  const singleSheetThicknessCaliperPt = singleSheetThicknessMm / 0.0254; // in points/mils

  const stackHeightMm = singleSheetThicknessMm * totalSheets;
  const stackHeightInches = stackHeightMm / 25.4;

  return {
    sheetAreaSqM,
    sheetAreaSqIn,
    effectiveGsm,
    effectiveBasisLbs,
    widthIn,
    heightIn,
    widthMm,
    heightMm,
    totalSheets,
    totalReams,
    singleSheetGrams,
    singleSheetOz,
    singleSheetLbs,
    reamWeightKg,
    reamWeightLbs,
    indianReamWeightKg3100,
    mWeightLbs,
    totalWeightGrams,
    totalWeightKg,
    totalWeightTonnes,
    totalWeightOz,
    totalWeightLbs,
    totalWeightUsTons,
    singleSheetThicknessMm,
    singleSheetThicknessCaliperPt,
    stackHeightMm,
    stackHeightInches,
  };
}

export function calculatePaperPrice(
  weightResult: WeightCalculationResult,
  priceInput: PriceCalculatorInput
): PriceCalculationResult {
  const { totalSheets, totalReams, totalWeightKg, totalWeightLbs } = weightResult;
  const rateGstMode = priceInput.rateGstMode || 'exclusive';
  const taxRate = Math.max(0, priceInput.taxRatePercent) / 100;

  // 1. Calculate raw paper stock amount & unit rate from inputs
  let rawEnteredPaperTotal = 0;
  let rawRate = 0;

  switch (priceInput.priceMode) {
    case 'per_unit_weight': {
      // In India, ₹/kg is the standard mill rate
      let weightInSelectedUnit = totalWeightKg;
      if (priceInput.weightPriceUnit === 'lb') {
        weightInSelectedUnit = totalWeightLbs;
      } else if (priceInput.weightPriceUnit === 't') {
        weightInSelectedUnit = totalWeightKg / 1000; // Metric Tonne (MT)
      } else if (priceInput.weightPriceUnit === 'ton_us') {
        weightInSelectedUnit = totalWeightLbs / 2000;
      }
      rawRate = priceInput.pricePerWeightUnit;
      rawEnteredPaperTotal = weightInSelectedUnit * rawRate;
      break;
    }
    case 'per_ream': {
      rawRate = priceInput.pricePerReam;
      rawEnteredPaperTotal = totalReams * rawRate;
      break;
    }
    case 'per_sheet': {
      rawRate = priceInput.pricePerSheet;
      rawEnteredPaperTotal = totalSheets * rawRate;
      break;
    }
    case 'per_thousand_m': {
      rawRate = priceInput.pricePerThousand;
      rawEnteredPaperTotal = (totalSheets / 1000) * rawRate;
      break;
    }
    case 'total_batch_fixed': {
      rawRate = priceInput.fixedBatchPrice;
      rawEnteredPaperTotal = priceInput.fixedBatchPrice;
      break;
    }
  }

  rawEnteredPaperTotal = Math.max(0, rawEnteredPaperTotal);
  rawRate = Math.max(0, rawRate);

  // 2. GST Inclusive vs Exclusive Resolution for Paper Stock
  let basePaperCost = 0;
  let enteredPaperTotalGross = 0;
  let paperGstPortion = 0;
  let effectiveNetRatePerUnit = 0;
  let effectiveGrossRatePerUnit = 0;

  if (rateGstMode === 'inclusive') {
    // Entered rate already includes GST
    enteredPaperTotalGross = rawEnteredPaperTotal;
    effectiveGrossRatePerUnit = rawRate;

    if (taxRate > 0) {
      basePaperCost = enteredPaperTotalGross / (1 + taxRate);
      paperGstPortion = enteredPaperTotalGross - basePaperCost;
      effectiveNetRatePerUnit = rawRate / (1 + taxRate);
    } else {
      basePaperCost = enteredPaperTotalGross;
      paperGstPortion = 0;
      effectiveNetRatePerUnit = rawRate;
    }
  } else {
    // Entered rate is exclusive of GST (+ GST added)
    basePaperCost = rawEnteredPaperTotal;
    effectiveNetRatePerUnit = rawRate;
    paperGstPortion = basePaperCost * taxRate;
    enteredPaperTotalGross = basePaperCost + paperGstPortion;
    effectiveGrossRatePerUnit = rawRate * (1 + taxRate);
  }

  // Derived unit paper costs (Net before tax)
  const paperCostPerSheet = totalSheets > 0 ? basePaperCost / totalSheets : 0;
  const paperCostPerReam = totalReams > 0 ? basePaperCost / totalReams : 0;
  const paperCostPer1000 = paperCostPerSheet * 1000;
  const paperCostPerKg = totalWeightKg > 0 ? basePaperCost / totalWeightKg : 0;
  const paperCostPerLb = totalWeightLbs > 0 ? basePaperCost / totalWeightLbs : 0;

  // 3. Indian Printing & Finishing Charges
  const trimmingCostTotal = Math.max(0, priceInput.trimmingCost); // Katayi (Cutting) charges
  const printingCostTotal = Math.max(0, priceInput.printingCostPerSheet * totalSheets); // Impression / Chhapayi
  const finishingSetupFee = Math.max(0, priceInput.finishingSetupFee); // CTP Plate & Bindery setup
  const laminationCostTotal = Math.max(0, (priceInput.laminationCostPerSheet || 0) * totalSheets); // Thermal lamination

  const totalManufacturingCost = 
    basePaperCost + trimmingCostTotal + printingCostTotal + finishingSetupFee + laminationCostTotal;

  // 4. Volume discount
  const discountRate = Math.max(0, Math.min(100, priceInput.volumeDiscountPercent)) / 100;
  const discountAmount = totalManufacturingCost * discountRate;
  const discountedCost = totalManufacturingCost - discountAmount;

  // 5. Shipping & Freight
  let shippingCost = 0;
  if (priceInput.shippingMode === 'flat') {
    shippingCost = Math.max(0, priceInput.flatShippingFee);
  } else if (priceInput.shippingMode === 'by_weight') {
    shippingCost = Math.max(0, totalWeightKg * priceInput.shippingRatePerKg);
  } else if (priceInput.shippingMode === 'free') {
    shippingCost = 0;
  }

  if (
    priceInput.freeShippingOverAmount > 0 &&
    discountedCost >= priceInput.freeShippingOverAmount
  ) {
    shippingCost = 0;
  }

  // 6. Indian GST Calculation (CGST+SGST vs IGST)
  const taxableSubtotal = discountedCost + shippingCost;
  const taxAmount = taxableSubtotal * taxRate;

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (priceInput.gstType === 'intra_state') {
    cgstAmount = taxAmount / 2;
    sgstAmount = taxAmount / 2;
  } else {
    igstAmount = taxAmount;
  }

  // 7. Total All-In Cost
  const totalAllInCost = taxableSubtotal + taxAmount;
  const allInCostPerSheet = totalSheets > 0 ? totalAllInCost / totalSheets : 0;
  const allInCostPerReam = totalReams > 0 ? totalAllInCost / totalReams : 0;

  // 8. Commercial Resale / Markup
  let suggestedSellingPrice = totalAllInCost;
  const targetPct = Math.max(0, priceInput.targetMarginPercent);

  if (priceInput.marginType === 'markup') {
    suggestedSellingPrice = totalAllInCost * (1 + targetPct / 100);
  } else {
    const clampedMargin = Math.min(99.9, targetPct) / 100;
    suggestedSellingPrice = totalAllInCost / (1 - clampedMargin);
  }

  const grossProfit = Math.max(0, suggestedSellingPrice - totalAllInCost);
  const sellingPricePerSheet = totalSheets > 0 ? suggestedSellingPrice / totalSheets : 0;
  const sellingPricePerReam = totalReams > 0 ? suggestedSellingPrice / totalReams : 0;

  const effectiveMarginPercent = suggestedSellingPrice > 0 ? (grossProfit / suggestedSellingPrice) * 100 : 0;
  const effectiveMarkupPercent = totalAllInCost > 0 ? (grossProfit / totalAllInCost) * 100 : 0;

  return {
    rateGstMode,
    enteredPaperTotalGross,
    basePaperCost,
    paperGstPortion,
    effectiveNetRatePerUnit,
    effectiveGrossRatePerUnit,
    paperCostPerSheet,
    paperCostPerReam,
    paperCostPer1000,
    paperCostPerKg,
    paperCostPerLb,
    trimmingCostTotal,
    printingCostTotal,
    finishingSetupFee,
    laminationCostTotal,
    totalManufacturingCost,
    discountAmount,
    discountedCost,
    shippingCost,
    taxAmount,
    cgstAmount,
    sgstAmount,
    igstAmount,
    totalAllInCost,
    allInCostPerSheet,
    allInCostPerReam,
    suggestedSellingPrice,
    sellingPricePerSheet,
    sellingPricePerReam,
    grossProfit,
    effectiveMarginPercent,
    effectiveMarkupPercent,
  };
}

/**
 * Indian Print Press Sheet Cutting (Farma / Ups) Optimization Calculator
 * Given a parent mill sheet (e.g. Double Demy 23"x36") and target cut piece (e.g. 5.5"x8.5" book or A4),
 * calculates how many Ups you get per sheet with minimum wastage.
 */
export function calculateFarmaCuts(
  parentName: string,
  parentWidthIn: number,
  parentHeightIn: number,
  cutWidthIn: number,
  cutHeightIn: number,
  targetQuantitySheets = 1000
): FarmaCutResult {
  const pW = Math.max(0.1, parentWidthIn);
  const pH = Math.max(0.1, parentHeightIn);
  const cW = Math.max(0.1, cutWidthIn);
  const cH = Math.max(0.1, cutHeightIn);

  // Normal orientation: cut width fits along parent width, cut height along parent height
  const upsAcross1 = Math.floor(pW / cW);
  const upsDown1 = Math.floor(pH / cH);
  const upsNormal = upsAcross1 * upsDown1;

  // Rotated 90 deg: cut height along parent width, cut width along parent height
  const upsAcross2 = Math.floor(pW / cH);
  const upsDown2 = Math.floor(pH / cW);
  const upsRotated = upsAcross2 * upsDown2;

  let bestUps = Math.max(1, Math.max(upsNormal, upsRotated));
  let orientationUsed: 'normal' | 'rotated' = upsNormal >= upsRotated ? 'normal' : 'rotated';

  const parentArea = pW * pH;
  const cutAreaUsed = bestUps * (cW * cH);
  const sheetWastagePercent = Math.max(0, Math.min(100, ((parentArea - cutAreaUsed) / parentArea) * 100));

  const totalParentSheetsNeeded = Math.ceil(targetQuantitySheets / bestUps);
  const totalParentReamsNeeded = totalParentSheetsNeeded / 500;

  return {
    parentName,
    parentWidthIn: pW,
    parentHeightIn: pH,
    cutWidthIn: cW,
    cutHeightIn: cH,
    upsNormal,
    upsRotated,
    bestUps,
    orientationUsed,
    sheetWastagePercent,
    totalParentSheetsNeeded,
    totalParentReamsNeeded,
  };
}
