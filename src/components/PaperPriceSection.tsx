import React, { useState } from 'react';
import { PriceCalculatorInput, PriceMode, WeightCalculationResult } from '../types/paper';
import { formatIndianCurrency } from '../utils/paperCalculator';
import { DollarSign, Percent, Scissors, Sparkles, Tag, Truck, ReceiptText, ShieldCheck } from 'lucide-react';

interface PaperPriceSectionProps {
  priceInput: PriceCalculatorInput;
  weightResult: WeightCalculationResult;
  onChange: (updated: Partial<PriceCalculatorInput>) => void;
}

export const PaperPriceSection: React.FC<PaperPriceSectionProps> = ({
  priceInput,
  weightResult,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<'paper' | 'finishing' | 'gst_shipping' | 'resale'>('paper');

  const currency = priceInput.currencySymbol || '₹';
  const taxRatePercent = Math.max(0, priceInput.taxRatePercent);
  const taxMultiplier = 1 + taxRatePercent / 100;

  // Calculate live values for entered paper rate
  let enteredRate = 0;
  let rateUnitLabel = '/ kg';

  switch (priceInput.priceMode) {
    case 'per_unit_weight':
      enteredRate = priceInput.pricePerWeightUnit;
      rateUnitLabel = `/ ${priceInput.weightPriceUnit === 't' ? 'MT' : priceInput.weightPriceUnit === 'lb' ? 'lb' : 'kg'}`;
      break;
    case 'per_ream':
      enteredRate = priceInput.pricePerReam;
      rateUnitLabel = '/ ream (500s)';
      break;
    case 'per_sheet':
      enteredRate = priceInput.pricePerSheet;
      rateUnitLabel = '/ sheet';
      break;
    case 'per_thousand_m':
      enteredRate = priceInput.pricePerThousand;
      rateUnitLabel = '/ 1,000 sheets';
      break;
    case 'total_batch_fixed':
      enteredRate = priceInput.fixedBatchPrice;
      rateUnitLabel = 'lump-sum bill';
      break;
  }

  const isInclusive = priceInput.rateGstMode === 'inclusive';
  const effectiveNetRate = isInclusive
    ? (taxMultiplier > 0 ? enteredRate / taxMultiplier : enteredRate)
    : enteredRate;
  const gstPortionPerUnit = isInclusive
    ? enteredRate - effectiveNetRate
    : enteredRate * (taxRatePercent / 100);
  const effectiveGrossRate = isInclusive ? enteredRate : enteredRate + gstPortionPerUnit;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs p-5 space-y-6 transition-colors">
      {/* Section Title */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
        <div>
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            2. Commercial Pricing & Job Cost Estimator
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Quote paper by Rate/kg or Rate/ream with GST inclusive/exclusive options, cutting fees, printing impressions, and resale margins.
          </p>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-stone-500 dark:text-stone-400">Currency:</span>
          <select
            value={priceInput.currencySymbol}
            onChange={(e) => onChange({ currencySymbol: e.target.value })}
            className="text-xs font-mono font-bold bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2 py-1 text-stone-900 dark:text-stone-100 focus:outline-none"
          >
            <option value="₹">₹ (INR - Indian Rupee)</option>
            <option value="$">$ (USD)</option>
            <option value="€">€ (EUR)</option>
            <option value="£">£ (GBP)</option>
            <option value="AED">AED</option>
          </select>
        </div>
      </div>

      {/* Internal Sub-navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-stone-200 dark:border-stone-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('paper')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'paper'
              ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Paper Stock Rate & GST</span>
        </button>

        <button
          onClick={() => setActiveTab('finishing')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'finishing'
              ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Printing & Bindery</span>
        </button>

        <button
          onClick={() => setActiveTab('gst_shipping')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'gst_shipping'
              ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Transport & Freight</span>
        </button>

        <button
          onClick={() => setActiveTab('resale')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'resale'
              ? 'bg-emerald-800 dark:bg-emerald-600 text-white font-semibold shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Profit Margin Quote</span>
        </button>
      </div>

      {/* Tab 1: Paper Base Pricing & GST Treatment */}
      {activeTab === 'paper' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
              Select Quotation Basis (Paper Rate Mode)
            </label>

            {/* Pricing Mode Segmented Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs font-medium">
              {[
                { id: 'per_unit_weight', label: 'Rate / kg (Wholesale)' },
                { id: 'per_ream', label: 'Rate / Ream (Pack of 500)' },
                { id: 'per_sheet', label: 'Rate / Sheet' },
                { id: 'per_thousand_m', label: 'Per 1,000 (M-Rate)' },
                { id: 'total_batch_fixed', label: 'Total Flat Bill' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => onChange({ priceMode: m.id as PriceMode })}
                  className={`py-1.5 px-2 rounded-md transition-all text-center ${
                    priceInput.priceMode === m.id
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-semibold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing input by mode */}
          <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            {/* Mode 1: Rate per kg */}
            {priceInput.priceMode === 'per_unit_weight' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      Paper Stock Rate per Kilogram
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-stone-500 dark:text-stone-400">{currency}</span>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={priceInput.pricePerWeightUnit}
                        onChange={(e) =>
                          onChange({ pricePerWeightUnit: parseFloat(e.target.value) || 0 })
                        }
                        className="w-32 text-base font-mono font-bold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <select
                        value={priceInput.weightPriceUnit}
                        onChange={(e) =>
                          onChange({
                            weightPriceUnit: e.target.value as 'kg' | 'lb' | 't' | 'ton_us',
                          })
                        }
                        className="text-xs font-semibold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-2 text-stone-900 dark:text-stone-100"
                      >
                        <option value="kg">per Kilogram (kg)</option>
                        <option value="t">per Metric Tonne (MT)</option>
                        <option value="lb">per Pound (lb)</option>
                      </select>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {[
                        { rate: 72, label: '₹72 (Maplitho)' },
                        { rate: 82, label: '₹82 (Copier)' },
                        { rate: 95, label: '₹95 (Art Paper)' },
                        { rate: 110, label: '₹110 (Art Card)' },
                        { rate: 65, label: '₹65 (Duplex Board)' },
                      ].map((p) => (
                        <button
                          key={p.rate}
                          type="button"
                          onClick={() => onChange({ pricePerWeightUnit: p.rate, weightPriceUnit: 'kg' })}
                          className="px-2 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[11px] font-mono text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800/90 p-3 rounded border border-stone-200 dark:border-stone-700 font-mono space-y-1">
                    <span className="text-stone-500 dark:text-stone-400 block font-sans">Calculated Ream Price:</span>
                    <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                      {currency}{(weightResult.reamWeightKg * priceInput.pricePerWeightUnit).toFixed(2)} / Ream
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 font-sans">
                      Based on {weightResult.reamWeightKg.toFixed(2)} kg physical weight per ream
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: Rate per Ream */}
            {priceInput.priceMode === 'per_ream' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Rate per Ream (500 Sheets)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-stone-500 dark:text-stone-400">{currency}</span>
                    <input
                      type="number"
                      step="5"
                      min="0"
                      value={priceInput.pricePerReam}
                      onChange={(e) => onChange({ pricePerReam: parseFloat(e.target.value) || 0 })}
                      className="w-32 text-base font-mono font-bold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">/ ream</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {[
                      { r: 280, label: '₹280 (A4 70g)' },
                      { r: 330, label: '₹330 (JK Copier 75g)' },
                      { r: 360, label: '₹360 (A4 80g)' },
                      { r: 1850, label: '₹1,850 (Double Demy)' },
                    ].map((p) => (
                      <button
                        key={p.r}
                        type="button"
                        onClick={() => onChange({ pricePerReam: p.r })}
                        className="px-2 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[11px] font-mono text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800/90 p-3 rounded border border-stone-200 dark:border-stone-700">
                  <span className="block font-medium text-stone-700 dark:text-stone-300">Equivalent Rates:</span>
                  <div className="mt-1 font-mono text-[11px] text-stone-600 dark:text-stone-400 space-y-0.5">
                    <div>
                      Per sheet: {currency}{(priceInput.pricePerReam / 500).toFixed(3)}
                    </div>
                    <div>
                      Per kg: {currency}
                      {weightResult.reamWeightKg > 0
                        ? (priceInput.pricePerReam / weightResult.reamWeightKg).toFixed(2)
                        : '0.00'} / kg
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 3: Rate per Sheet */}
            {priceInput.priceMode === 'per_sheet' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Rate per Individual Sheet
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-stone-500 dark:text-stone-400">{currency}</span>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      value={priceInput.pricePerSheet}
                      onChange={(e) =>
                        onChange({ pricePerSheet: parseFloat(e.target.value) || 0 })
                      }
                      className="w-32 text-base font-mono font-bold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-1.5 text-stone-900 dark:text-stone-100"
                    />
                    <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">/ sheet</span>
                  </div>
                </div>

                <div className="text-xs text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800/90 p-3 rounded border border-stone-200 dark:border-stone-700">
                  <span className="text-stone-500 dark:text-stone-400 block">Full ream (500 sheets):</span>
                  <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {formatIndianCurrency(priceInput.pricePerSheet * 500, currency)}
                  </span>
                </div>
              </div>
            )}

            {/* Mode 4: Per 1,000 sheets */}
            {priceInput.priceMode === 'per_thousand_m' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Rate per 1,000 Sheets (M-Rate)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-stone-500 dark:text-stone-400">{currency}</span>
                    <input
                      type="number"
                      step="10"
                      min="0"
                      value={priceInput.pricePerThousand}
                      onChange={(e) =>
                        onChange({ pricePerThousand: parseFloat(e.target.value) || 0 })
                      }
                      className="w-32 text-base font-mono font-bold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-1.5 text-stone-900 dark:text-stone-100"
                    />
                    <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">/ 1,000 sheets</span>
                  </div>
                </div>

                <div className="text-xs text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800/90 p-3 rounded border border-stone-200 dark:border-stone-700">
                  <span className="text-stone-500 dark:text-stone-400 block">Ream rate (500 sheets):</span>
                  <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {formatIndianCurrency(priceInput.pricePerThousand / 2, currency)} / ream
                  </span>
                </div>
              </div>
            )}

            {/* Mode 5: Fixed bill */}
            {priceInput.priceMode === 'total_batch_fixed' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Total Lump-sum Paper Bill
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-stone-500 dark:text-stone-400">{currency}</span>
                    <input
                      type="number"
                      step="50"
                      min="0"
                      value={priceInput.fixedBatchPrice}
                      onChange={(e) =>
                        onChange({ fixedBatchPrice: parseFloat(e.target.value) || 0 })
                      }
                      className="w-36 text-base font-mono font-bold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-1.5 text-stone-900 dark:text-stone-100"
                    />
                    <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">total</span>
                  </div>
                </div>

                <div className="text-xs text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800/90 p-3 rounded border border-stone-200 dark:border-stone-700">
                  <span className="text-stone-500 dark:text-stone-400 block">Per sheet rate:</span>
                  <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {formatIndianCurrency(
                      weightResult.totalSheets > 0 ? priceInput.fixedBatchPrice / weightResult.totalSheets : 0,
                      currency,
                      3
                    )} / sheet
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* USER REQUESTED: GST INCLUSIVE AND EXCLUSIVE OPTION AFTER THE RATE BLOCK   */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70 space-y-3.5 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/70 dark:border-emerald-800/50 pb-2.5">
              <div>
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 uppercase tracking-wider">
                  <ReceiptText className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  GST Treatment on Entered Rate
                </span>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                  Choose whether your entered rate ({currency}{enteredRate} {rateUnitLabel}) is GST Inclusive or GST Exclusive (+ Tax).
                </p>
              </div>

              {/* Segmented GST Inclusive vs Exclusive Selector */}
              <div className="flex items-center p-0.5 bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-700 rounded-lg text-xs font-semibold shrink-0">
                <button
                  type="button"
                  onClick={() => onChange({ rateGstMode: 'exclusive' })}
                  className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                    priceInput.rateGstMode !== 'inclusive'
                      ? 'bg-emerald-700 text-white shadow-xs font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>GST Exclusive (+ GST Added)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ rateGstMode: 'inclusive' })}
                  className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                    priceInput.rateGstMode === 'inclusive'
                      ? 'bg-emerald-700 text-white shadow-xs font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  <span>GST Inclusive (All-Inclusive)</span>
                </button>
              </div>
            </div>

            {/* GST Slab Selection & State Jurisdiction */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* GST Slab */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Applicable GST Slab:
                </label>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { r: 12, label: '12% (HSN 4802 - Maplitho, Kraft, Duplex)' },
                    { r: 18, label: '18% (HSN 4810 - Coated Art Paper & Board)' },
                    { r: 5, label: '5% (Newsprint)' },
                    { r: 0, label: '0% (Exempt)' },
                  ].map((s) => (
                    <button
                      key={s.r}
                      type="button"
                      onClick={() => onChange({ taxRatePercent: s.r })}
                      className={`px-2.5 py-1 rounded text-xs transition-colors border ${
                        priceInput.taxRatePercent === s.r
                          ? 'bg-emerald-700 text-white border-emerald-800 font-bold'
                          : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                      }`}
                    >
                      {s.r}%
                    </button>
                  ))}

                  <div className="flex items-center gap-1 ml-auto">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={priceInput.taxRatePercent}
                      onChange={(e) => onChange({ taxRatePercent: parseFloat(e.target.value) || 0 })}
                      className="w-14 text-xs font-mono bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-1.5 py-1 text-center font-bold text-stone-900 dark:text-stone-100"
                    />
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-bold">% Custom</span>
                  </div>
                </div>
              </div>

              {/* State Jurisdiction Split */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  GST Jurisdiction Split:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onChange({ gstType: 'intra_state' })}
                    className={`py-1.5 px-2 rounded text-xs text-center border transition-colors ${
                      priceInput.gstType === 'intra_state'
                        ? 'bg-emerald-700 text-white border-emerald-800 font-bold'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                    }`}
                  >
                    Intra-State (CGST {(taxRatePercent / 2).toFixed(1)}% + SGST {(taxRatePercent / 2).toFixed(1)}%)
                  </button>

                  <button
                    type="button"
                    onClick={() => onChange({ gstType: 'inter_state' })}
                    className={`py-1.5 px-2 rounded text-xs text-center border transition-colors ${
                      priceInput.gstType === 'inter_state'
                        ? 'bg-emerald-700 text-white border-emerald-800 font-bold'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                    }`}
                  >
                    Inter-State (IGST {taxRatePercent}%)
                  </button>
                </div>
              </div>
            </div>

            {/* Instant Live GST Math Breakdown */}
            <div className="p-3 rounded-lg bg-white dark:bg-stone-900/90 border border-emerald-200/90 dark:border-emerald-800/70 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <span className="text-stone-500 dark:text-stone-400 font-sans text-[11px] block">
                  {isInclusive ? '✓ Calculated Net Rate (Before GST):' : '✓ Calculated Gross Rate (With GST):'}
                </span>
                <div className="text-stone-900 dark:text-stone-100 font-bold text-xs font-sans mt-0.5">
                  {isInclusive ? (
                    <span>
                      Net Base Rate: <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-sm">{formatIndianCurrency(effectiveNetRate, currency, 2)}</strong> {rateUnitLabel} + {taxRatePercent}% GST (<strong className="font-mono text-emerald-800 dark:text-emerald-300">{formatIndianCurrency(gstPortionPerUnit, currency, 2)}</strong>) = Entered Rate <strong className="font-mono">{formatIndianCurrency(enteredRate, currency, 2)}</strong>
                    </span>
                  ) : (
                    <span>
                      Base Rate: <strong className="font-mono text-sm">{formatIndianCurrency(enteredRate, currency, 2)}</strong> {rateUnitLabel} + {taxRatePercent}% GST (<strong className="text-emerald-700 dark:text-emerald-400 font-mono">{formatIndianCurrency(gstPortionPerUnit, currency, 2)}</strong>) = Effective Gross <strong className="text-emerald-800 dark:text-emerald-300 font-mono">{formatIndianCurrency(effectiveGrossRate, currency, 2)}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="text-[10px] text-stone-400 dark:text-stone-500 font-sans block">GST Classification:</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-300 font-mono">
                  {taxRatePercent}% {priceInput.gstType === 'intra_state' ? `(CGST ${taxRatePercent/2}% + SGST ${taxRatePercent/2}%)` : `(IGST ${taxRatePercent}%)`}
                </span>
              </div>
            </div>
          </div>

          {/* Volume Bulk Discount */}
          <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <div>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  Volume / Wholesale Discount:
                </span>
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                  Supplier bulk purchase discount
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={priceInput.volumeDiscountPercent}
                onChange={(e) =>
                  onChange({ volumeDiscountPercent: parseFloat(e.target.value) || 0 })
                }
                className="w-28 accent-amber-600 dark:accent-amber-500"
              />
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100 w-12 text-right">
                {priceInput.volumeDiscountPercent}% off
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Printing & Bindery */}
      {activeTab === 'finishing' && (
        <div className="space-y-4">
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Include press finishing operations: Cutting & trimming, CTP Plate setup, impression charges, and thermal lamination.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Cutting & Trimming */}
            <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Cutting & Trimming (Katayi)
              </label>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400">{currency}</span>
                <input
                  type="number"
                  min="0"
                  step="20"
                  value={priceInput.trimmingCost}
                  onChange={(e) => onChange({ trimmingCost: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xs font-mono bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-stone-900 dark:text-stone-100"
                />
              </div>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 block">Guillotine cutting charge per job</span>
            </div>

            {/* Printing Impression Per Sheet */}
            <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Print Impression / Sheet
              </label>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400">{currency}</span>
                <input
                  type="number"
                  min="0"
                  step="0.05"
                  value={priceInput.printingCostPerSheet}
                  onChange={(e) =>
                    onChange({ printingCostPerSheet: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full text-xs font-mono bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-stone-900 dark:text-stone-100"
                />
              </div>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 block">Per impression printing rate</span>
            </div>

            {/* CTP Plate & Setup */}
            <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                CTP Plates & Setup
              </label>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400">{currency}</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={priceInput.finishingSetupFee}
                  onChange={(e) => onChange({ finishingSetupFee: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xs font-mono bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-stone-900 dark:text-stone-100"
                />
              </div>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 block">CTP plate making and setup fee</span>
            </div>

            {/* Lamination */}
            <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Thermal Lamination
              </label>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400">{currency}</span>
                <input
                  type="number"
                  min="0"
                  step="0.2"
                  value={priceInput.laminationCostPerSheet}
                  onChange={(e) =>
                    onChange({ laminationCostPerSheet: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full text-xs font-mono bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-stone-900 dark:text-stone-100"
                />
              </div>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 block">Per sheet gloss/matt film rate</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Transport & Freight */}
      {activeTab === 'gst_shipping' && (
        <div className="space-y-4">
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Configure delivery transport, local tempo freight, or client self-pickup options.
          </p>

          <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              Transport & Local Delivery Mode
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'free', label: 'Self Pickup / Free' },
                { id: 'flat', label: 'Flat Tempo / Local Delivery' },
                { id: 'by_weight', label: 'By Weight Rate (per kg)' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() =>
                    onChange({ shippingMode: s.id as 'free' | 'flat' | 'by_weight' })
                  }
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                    priceInput.shippingMode === s.id
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {priceInput.shippingMode === 'flat' && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">Flat Transport / Delivery:</span>
                <span className="text-xs font-mono text-stone-500 dark:text-stone-400 font-bold">{currency}</span>
                <input
                  type="number"
                  min="0"
                  value={priceInput.flatShippingFee}
                  onChange={(e) => onChange({ flatShippingFee: parseFloat(e.target.value) || 0 })}
                  className="w-24 text-xs font-mono bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2 py-1 text-stone-900 dark:text-stone-100"
                />
              </div>
            )}

            {priceInput.shippingMode === 'by_weight' && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">Transport Rate per kg:</span>
                <span className="text-xs font-mono text-stone-500 dark:text-stone-400 font-bold">{currency}</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={priceInput.shippingRatePerKg}
                  onChange={(e) =>
                    onChange({ shippingRatePerKg: parseFloat(e.target.value) || 0 })
                  }
                  className="w-24 text-xs font-mono bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2 py-1 text-stone-900 dark:text-stone-100"
                />
                <span className="text-xs text-stone-500 dark:text-stone-400">/ kg</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Commercial Resale & Margin */}
      {activeTab === 'resale' && (
        <div className="space-y-4">
          <p className="text-xs text-stone-600 dark:text-stone-400">
            For commercial print shops, paper brokers, and publishers: set profit margin percentage to generate customer quotations.
          </p>

          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onChange({ marginType: 'margin' })}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    priceInput.marginType === 'margin'
                      ? 'bg-emerald-800 dark:bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-200'
                  }`}
                >
                  Gross Margin %
                </button>
                <button
                  onClick={() => onChange({ marginType: 'markup' })}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    priceInput.marginType === 'markup'
                      ? 'bg-emerald-800 dark:bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-200'
                  }`}
                >
                  Markup on Cost %
                </button>
              </div>

              <div className="flex items-center gap-1.5 font-mono">
                <input
                  type="number"
                  min="0"
                  max="90"
                  step="1"
                  value={priceInput.targetMarginPercent}
                  onChange={(e) =>
                    onChange({ targetMarginPercent: parseFloat(e.target.value) || 0 })
                  }
                  className="w-16 font-bold text-center bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-700 rounded px-2 py-1 text-emerald-950 dark:text-emerald-100 text-sm"
                />
                <span className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">%</span>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="80"
              step="1"
              value={priceInput.targetMarginPercent}
              onChange={(e) =>
                onChange({ targetMarginPercent: parseFloat(e.target.value) || 0 })
              }
              className="w-full accent-emerald-700 dark:accent-emerald-500"
            />

            <div className="flex justify-between text-[11px] text-emerald-800 dark:text-emerald-300 font-mono">
              <span>0% (At Cost)</span>
              <span>15% (Wholesale Commercial)</span>
              <span>25% (Standard Print Shop)</span>
              <span>40%+ (Luxury Packaging & Cards)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
