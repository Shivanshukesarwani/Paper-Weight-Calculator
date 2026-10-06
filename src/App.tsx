import React, { useState } from 'react';
import { 
  PriceCalculatorInput, 
  WeightCalculatorInput 
} from './types/paper';
import { calculatePaperPrice, calculatePaperWeight } from './utils/paperCalculator';
import { Header } from './components/Header';
import { PaperWeightSection } from './components/PaperWeightSection';
import { PaperPriceSection } from './components/PaperPriceSection';
import { WeightResultsCard } from './components/WeightResultsCard';
import { PriceResultsCard } from './components/PriceResultsCard';
import { FarmaCuttingSection } from './components/FarmaCuttingSection';
import { BasisReferenceModal } from './components/BasisReferenceModal';
import { QuotationModal } from './components/QuotationModal';
import { ThemeBulbToggle } from './components/ThemeBulbToggle';
import { CustomCursor } from './components/CustomCursor';
import { CalculatorLoader } from './components/CalculatorLoader';
import { FileCheck, Sparkles, Scissors } from 'lucide-react';

const DEFAULT_INDIAN_WEIGHT_INPUT: WeightCalculatorInput = {
  sizeId: 'in_23_36', // 23 x 36 in Double Demy
  customWidth: 23,
  customHeight: 36,
  customUnit: 'in',
  weightInputType: 'gsm',
  gsm: 70,
  basisWeightLbs: 20,
  basisGrade: 'book_text',
  quantityValue: 10,
  quantityUnit: 'reams',
  bulkFactor: 1.25,
};

const DEFAULT_INDIAN_PRICE_INPUT: PriceCalculatorInput = {
  priceMode: 'per_unit_weight',
  currencySymbol: '₹',
  pricePerWeightUnit: 82, // ₹82 / kg wholesale
  weightPriceUnit: 'kg',
  pricePerReam: 1533,
  pricePerThousand: 3066,
  pricePerSheet: 3.07,
  fixedBatchPrice: 15330,
  rateGstMode: 'exclusive',
  trimmingCost: 0,
  printingCostPerSheet: 0,
  finishingSetupFee: 0,
  laminationCostPerSheet: 0,
  shippingMode: 'free',
  flatShippingFee: 150,
  shippingRatePerLb: 5,
  shippingRatePerKg: 3, // ₹3 / kg local tempo
  freeShippingOverAmount: 2000,
  volumeDiscountPercent: 0,
  taxRatePercent: 12, // 12% standard GST on paper (HSN 4802)
  gstType: 'intra_state',
  marginType: 'margin',
  targetMarginPercent: 20,
};

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<'calculator' | 'farma'>('calculator');
  const [weightInput, setWeightInput] = useState<WeightCalculatorInput>(DEFAULT_INDIAN_WEIGHT_INPUT);
  const [priceInput, setPriceInput] = useState<PriceCalculatorInput>(DEFAULT_INDIAN_PRICE_INPUT);

  const [showBasisGuide, setShowBasisGuide] = useState(false);
  const [showQuotation, setShowQuotation] = useState(false);

  // Compute live calculations
  const weightResult = calculatePaperWeight(weightInput);
  const priceResult = calculatePaperPrice(weightResult, priceInput);

  const handleUpdateWeight = (updated: Partial<WeightCalculatorInput>) => {
    setWeightInput((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdatePrice = (updated: Partial<PriceCalculatorInput>) => {
    setPriceInput((prev) => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setWeightInput(DEFAULT_INDIAN_WEIGHT_INPUT);
    setPriceInput(DEFAULT_INDIAN_PRICE_INPUT);
  };

  // Indian Printing Presets
  const applyIndianPreset = (presetName: string) => {
    switch (presetName) {
      case 'double_demy_book':
        // Indian book publishing on Double Demy 23"x36"
        setWeightInput({
          ...weightInput,
          sizeId: 'in_23_36',
          weightInputType: 'gsm',
          gsm: 70, // 70 GSM Maplitho
          quantityValue: 20,
          quantityUnit: 'reams',
        });
        setPriceInput({
          ...priceInput,
          priceMode: 'per_unit_weight',
          pricePerWeightUnit: 78, // ₹78 / kg
          weightPriceUnit: 'kg',
          rateGstMode: 'exclusive',
          taxRatePercent: 12,
          trimmingCost: 350,
        });
        break;

      case 'double_crown_duplex':
        // 20x30 in Double Crown 300 GSM Grey Back Duplex board sweet box
        setWeightInput({
          ...weightInput,
          sizeId: 'in_20_30',
          weightInputType: 'gsm',
          gsm: 300,
          quantityValue: 10,
          quantityUnit: 'packets_100', // 1,000 sheets
        });
        setPriceInput({
          ...priceInput,
          priceMode: 'per_unit_weight',
          pricePerWeightUnit: 64, // ₹64 / kg duplex board
          weightPriceUnit: 'kg',
          rateGstMode: 'inclusive',
          taxRatePercent: 12,
        });
        break;

      case 'digital_13_19_color':
        // 13x19 in Super A3 300 GSM Art Card Digital Print
        setWeightInput({
          ...weightInput,
          sizeId: 'in_13_19',
          weightInputType: 'gsm',
          gsm: 300,
          quantityValue: 500,
          quantityUnit: 'sheets',
        });
        setPriceInput({
          ...priceInput,
          priceMode: 'per_sheet',
          pricePerSheet: 6.5,
          rateGstMode: 'inclusive',
          taxRatePercent: 18,
          printingCostPerSheet: 4.5,
          laminationCostPerSheet: 2.0,
          targetMarginPercent: 30,
        });
        break;

      case 'jk_copier_carton':
        setWeightInput({
          ...weightInput,
          sizeId: 'in_a4',
          weightInputType: 'gsm',
          gsm: 75,
          quantityValue: 5,
          quantityUnit: 'reams', // 1 carton box
        });
        setPriceInput({
          ...priceInput,
          priceMode: 'per_ream',
          pricePerReam: 330,
          pricePerWeightUnit: 82,
          rateGstMode: 'inclusive',
          taxRatePercent: 12,
        });
        break;

      case 'art_paper_brochure':
        // 130 GSM Gloss Art Paper for A4 catalog / brochures
        setWeightInput({
          ...weightInput,
          sizeId: 'in_25_38',
          weightInputType: 'gsm',
          gsm: 130,
          quantityValue: 5,
          quantityUnit: 'reams',
        });
        setPriceInput({
          ...priceInput,
          priceMode: 'per_unit_weight',
          pricePerWeightUnit: 98, // ₹98 / kg Art paper
          weightPriceUnit: 'kg',
          rateGstMode: 'exclusive',
          taxRatePercent: 18, // 18% GST on commercial print
          targetMarginPercent: 25,
        });
        break;
    }
  };

  const handleApplyFarmaSheet = (sizeId: string, quantitySheets: number) => {
    setWeightInput((prev) => ({
      ...prev,
      sizeId,
      quantityValue: quantitySheets,
      quantityUnit: 'sheets',
    }));
    setCurrentView('calculator');
  };

  return (
    <div className="min-h-screen bg-stone-100/90 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-amber-200 dark:selection:bg-amber-900 transition-colors">
      {/* Circle Dot Under a Circle Custom Mouse Cursor */}
      <CustomCursor />

      {/* Horizontal Progress Slider Loader */}
      {isLoading && <CalculatorLoader onComplete={() => setIsLoading(false)} />}

      {/* Navigation Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        currencySymbol={priceInput.currencySymbol}
        onCurrencyChange={(sym) => handleUpdatePrice({ currencySymbol: sym })}
        onOpenBasisGuide={() => setShowBasisGuide(true)}
        onOpenQuotation={() => setShowQuotation(true)}
        onReset={handleReset}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Editorial Subheader & Quick Workflow Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Shivanshu Graphic &amp; Design's Calculator
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              Built on Indian press standards: Double Demy (23×36"), 25×38", 18×22", 13×19", 20×30", 30×40", 3100 Ream Weight Rule, Rate/kg, and GST (Inclusive & Exclusive).
            </p>
          </div>

          {/* Quick Indian Market Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Presets:
            </span>
            <button
              onClick={() => applyIndianPreset('double_demy_book')}
              className="px-2.5 py-1 text-xs rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 font-medium transition-colors"
            >
              23×36" Book (70g)
            </button>
            <button
              onClick={() => applyIndianPreset('double_crown_duplex')}
              className="px-2.5 py-1 text-xs rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 font-medium transition-colors"
            >
              20×30" Duplex (300g)
            </button>
            <button
              onClick={() => applyIndianPreset('digital_13_19_color')}
              className="px-2.5 py-1 text-xs rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 font-medium transition-colors"
            >
              13×19" Digital (300g)
            </button>
            <button
              onClick={() => applyIndianPreset('jk_copier_carton')}
              className="px-2.5 py-1 text-xs rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 font-medium transition-colors"
            >
              JK Copier (A4 75g)
            </button>
            <button
              onClick={() => applyIndianPreset('art_paper_brochure')}
              className="px-2.5 py-1 text-xs rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 font-medium transition-colors"
            >
              25×38" Art (130g)
            </button>
          </div>
        </div>

        {/* View 1: Main Calculator (Weight + Price Engine) */}
        {currentView === 'calculator' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (Inputs): 7 cols */}
              <div className="lg:col-span-7 space-y-6">
                <PaperWeightSection
                  input={weightInput}
                  onChange={handleUpdateWeight}
                  onOpenBasisGuide={() => setShowBasisGuide(true)}
                />

                <PaperPriceSection
                  priceInput={priceInput}
                  weightResult={weightResult}
                  onChange={handleUpdatePrice}
                />
              </div>

              {/* Right Column (Results): 5 cols */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-4">
                <WeightResultsCard
                  result={weightResult}
                  currencySymbol={priceInput.currencySymbol}
                />

                <PriceResultsCard
                  priceResult={priceResult}
                  weightResult={weightResult}
                  priceInput={priceInput}
                />

                {/* Quick Action Buttons */}
                <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs transition-colors">
                  <button
                    onClick={() => setCurrentView('farma')}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 font-semibold rounded-lg transition-colors"
                  >
                    <Scissors className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Open Sheet Cutting (Farma) Tool</span>
                  </button>

                  <button
                    onClick={() => setShowQuotation(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-semibold rounded-lg transition-colors shadow-xs"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
                    <span>Create GST Quotation Slip</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Sheet Cutting & Farma (Ups) Calculator */}
        {currentView === 'farma' && (
          <div className="space-y-6">
            <FarmaCuttingSection onApplyParentSheet={handleApplyFarmaSheet} />
          </div>
        )}
      </main>

      {/* GSM vs Basis Weight Reference Modal */}
      {showBasisGuide && (
        <BasisReferenceModal onClose={() => setShowBasisGuide(false)} />
      )}

      {/* Formal Job Quotation Modal */}
      {showQuotation && (
        <QuotationModal
          weightInput={weightInput}
          priceInput={priceInput}
          weightResult={weightResult}
          priceResult={priceResult}
          onClose={() => setShowQuotation(false)}
        />
      )}

      {/* Bottom-left side bulb icon for Dark / Light / System theme selection */}
      <ThemeBulbToggle />
    </div>
  );
}
