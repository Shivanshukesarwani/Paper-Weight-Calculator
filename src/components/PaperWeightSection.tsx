import React, { useState } from 'react';
import { 
  BasisGradeType, 
  LengthUnit, 
  QuantityUnit, 
  WeightCalculatorInput 
} from '../types/paper';
import { PAPER_SIZES, INDIAN_POPULAR_SIZES } from '../data/paperSizes';
import { BASIS_GRADES, COMMON_GSM_PRESETS } from '../data/paperGrades';
import { ChevronDown, ChevronUp, Sliders, BookOpen } from 'lucide-react';

interface PaperWeightSectionProps {
  input: WeightCalculatorInput;
  onChange: (updated: Partial<WeightCalculatorInput>) => void;
  onOpenBasisGuide: () => void;
}

export const PaperWeightSection: React.FC<PaperWeightSectionProps> = ({
  input,
  onChange,
  onOpenBasisGuide,
}) => {
  const [showAdvancedBulk, setShowAdvancedBulk] = useState(false);
  const [showBasisComparison, setShowBasisComparison] = useState(false);

  const selectedSize = PAPER_SIZES.find((s) => s.id === input.sizeId);
  const isCustomSize = input.sizeId === 'custom';

  const selectedGradeInfo = BASIS_GRADES[input.basisGrade];

  // Effective GSM
  const effectiveGsm = input.weightInputType === 'gsm' 
    ? input.gsm 
    : input.basisWeightLbs * selectedGradeInfo.gsmFactor;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs p-5 space-y-6 transition-colors">
      {/* Section Title */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
        <div>
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            1. Paper Size & Stock Weight
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Select Indian press paper sheet dimensions (23×36, 25×38, 18×22, 13×19, 18×23, 19×25, 20×30, 30×40) and grammage (GSM).
          </p>
        </div>
        <button
          onClick={onOpenBasisGuide}
          className="text-xs text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white flex items-center gap-1 font-medium bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 px-2.5 py-1.5 rounded-md transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Paper Standards Guide</span>
        </button>
      </div>

      {/* 1. Paper Size Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            Paper Sheet Size
          </label>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Standard Indian Dimensions
          </span>
        </div>

        {/* Quick Select Buttons for Requested Indian Paper Sizes */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">
              Popular Indian Commercial Press Sizes (Click to Select):
            </span>
            <span className="text-[10px] text-stone-400 dark:text-stone-500">
              Inches & Millimeters
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-1.5">
            {INDIAN_POPULAR_SIZES.map((sz) => {
              const isSelected = input.sizeId === sz.id;
              return (
                <button
                  key={sz.id}
                  type="button"
                  onClick={() => onChange({ sizeId: sz.id })}
                  className={`px-2.5 py-2 rounded-lg text-xs transition-all border text-left flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-500 dark:border-amber-500 text-amber-950 dark:text-amber-200 font-bold shadow-xs ring-1 ring-amber-400/50'
                      : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  <span className="font-mono font-bold text-xs leading-tight">{sz.label}</span>
                  <span className="text-[10px] opacity-75 font-normal leading-tight mt-0.5">{sz.dimensions}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => onChange({ sizeId: 'custom' })}
              className={`px-2.5 py-2 rounded-lg text-xs transition-all border text-left flex flex-col justify-between ${
                input.sizeId === 'custom'
                  ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-500 dark:border-amber-500 text-amber-950 dark:text-amber-200 font-bold shadow-xs ring-1 ring-amber-400/50'
                  : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
            >
              <span className="font-bold text-xs leading-tight">Custom Size</span>
              <span className="text-[10px] opacity-75 font-normal leading-tight mt-0.5">Enter W × H</span>
            </button>
          </div>
        </div>

        {/* Dropdown selector for full library */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] text-stone-500 dark:text-stone-400 mb-1">
              Or Choose from Full Catalog:
            </label>
            <select
              value={input.sizeId}
              onChange={(e) => onChange({ sizeId: e.target.value })}
              className="w-full text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            >
              <optgroup label="Indian Commercial Printing & Mill Sheet Sizes">
                {PAPER_SIZES.filter((s) => s.category === 'indian_standard').map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </optgroup>

              <optgroup label="ISO 216 International Series">
                {PAPER_SIZES.filter((s) => s.category === 'iso_a').map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </optgroup>

              <optgroup label="North American Standard Sizes">
                {PAPER_SIZES.filter((s) => s.category === 'north_american').map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </optgroup>

              <optgroup label="Custom Dimensions">
                <option value="custom">Custom Dimensions (Enter Width × Height)</option>
              </optgroup>
            </select>
          </div>

          {/* Size Dimension Preview Indicator */}
          {!isCustomSize && selectedSize && (
            <div className="px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs mt-auto">
              <span className="text-stone-500 dark:text-stone-400 font-medium">Exact Dimension:</span>
              <span className="font-mono font-semibold text-stone-800 dark:text-stone-200">
                {selectedSize.widthIn}" × {selectedSize.heightIn}"
                <span className="text-stone-400 dark:text-stone-500 font-normal ml-1.5">
                  ({selectedSize.widthMm} × {selectedSize.heightMm} mm)
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Custom Dimensions Form */}
        {isCustomSize && (
          <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-3">
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
              Enter Custom Sheet Dimensions
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] text-stone-500 dark:text-stone-400 mb-1">Width</label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={input.customWidth}
                  onChange={(e) => onChange({ customWidth: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xs font-mono bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-500 dark:text-stone-400 mb-1">Height</label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={input.customHeight}
                  onChange={(e) => onChange({ customHeight: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xs font-mono bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-500 dark:text-stone-400 mb-1">Unit</label>
                <select
                  value={input.customUnit}
                  onChange={(e) => onChange({ customUnit: e.target.value as LengthUnit })}
                  className="w-full text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="in">Inches (in)</option>
                  <option value="mm">Millimeters (mm)</option>
                  <option value="cm">Centimeters (cm)</option>
                  <option value="m">Meters (m)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Weight Specification: GSM vs Basis Weight */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            Paper Grammage / GSM
          </label>

          {/* Segmented control: GSM vs Basis Weight */}
          <div className="flex items-center bg-stone-200/80 dark:bg-stone-800 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => onChange({ weightInputType: 'gsm' })}
              className={`px-3 py-1 rounded-md transition-all ${
                input.weightInputType === 'gsm'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              GSM (g/m²)
            </button>
            <button
              onClick={() => onChange({ weightInputType: 'basis' })}
              className={`px-3 py-1 rounded-md transition-all ${
                input.weightInputType === 'basis'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              US Basis (lbs #)
            </button>
          </div>
        </div>

        {/* GSM Input Flow */}
        {input.weightInputType === 'gsm' ? (
          <div className="space-y-3 p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="range"
                  min="40"
                  max="450"
                  step="5"
                  value={input.gsm}
                  onChange={(e) => onChange({ gsm: parseInt(e.target.value) || 80 })}
                  className="w-full accent-amber-600 dark:accent-amber-500"
                />
              </div>

              <div className="flex items-center gap-1.5 w-32 shrink-0">
                <input
                  type="number"
                  min="20"
                  max="1000"
                  value={input.gsm}
                  onChange={(e) => onChange({ gsm: Math.max(1, parseFloat(e.target.value) || 1) })}
                  className="w-20 text-sm font-mono font-bold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1 text-center text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">GSM</span>
              </div>
            </div>

            {/* Popular Paper Grade Presets */}
            <div>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium block mb-1.5">
                Popular Paper Grades & Grammage Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_GSM_PRESETS.map((preset) => (
                  <button
                    key={preset.gsm}
                    type="button"
                    onClick={() => onChange({ gsm: preset.gsm })}
                    className={`px-2 py-1 rounded text-xs font-mono transition-colors border ${
                      input.gsm === preset.gsm
                        ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-600 text-amber-900 dark:text-amber-200 font-semibold'
                        : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                    }`}
                    title={preset.label}
                  >
                    <span>{preset.gsm}g</span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 ml-1">({preset.category})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Basis Weight (lbs) Input Flow */
          <div className="space-y-3 p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                  Basis Grade Category
                </label>
                <select
                  value={input.basisGrade}
                  onChange={(e) => onChange({ basisGrade: e.target.value as BasisGradeType })}
                  className="w-full text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-stone-900 dark:text-stone-100 font-medium"
                >
                  {Object.entries(BASIS_GRADES).map(([key, grade]) => (
                    <option key={key} value={key}>
                      {grade.name} ({grade.basicWidthIn}×{grade.basicHeightIn}")
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                  Basis Weight (lbs #)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="10"
                    max="200"
                    step="1"
                    value={input.basisWeightLbs}
                    onChange={(e) => onChange({ basisWeightLbs: parseFloat(e.target.value) || 20 })}
                    className="w-24 text-sm font-mono font-bold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1 text-center text-stone-900 dark:text-stone-100"
                  />
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">lbs</span>
                  <span className="text-xs text-amber-700 dark:text-amber-400 font-mono font-semibold ml-auto">
                    ≈ {effectiveGsm.toFixed(1)} GSM
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Quantity Specification */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
          Quantity (Sheets, Reams, Cartons)
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={input.quantityValue}
              onChange={(e) =>
                onChange({ quantityValue: Math.max(1, parseInt(e.target.value) || 1) })
              }
              className="w-full text-sm font-mono font-bold bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />

            <select
              value={input.quantityUnit}
              onChange={(e) => onChange({ quantityUnit: e.target.value as QuantityUnit })}
              className="w-56 text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            >
              <option value="reams">Reams (500 Sheets)</option>
              <option value="cartons">Carton Boxes (2,500 Sheets / 5 Reams)</option>
              <option value="sheets">Single Sheets</option>
              <option value="gross">Gross (144 Sheets)</option>
              <option value="daste">Daste / Quires (25 Sheets)</option>
              <option value="packets_100">Board Packets (100 Sheets)</option>
              <option value="bundles">Bundles (1,000 Sheets / 2 Reams)</option>
              <option value="bales">Bales (5,000 Sheets / 10 Reams)</option>
            </select>
          </div>

          {/* Quick Quantity Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {[
              { val: 1, unit: 'reams', label: '1 Ream' },
              { val: 5, unit: 'reams', label: '1 Carton (5R)' },
              { val: 10, unit: 'reams', label: '10 Reams' },
              { val: 20, unit: 'reams', label: '20 Reams' },
            ].map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  onChange({ quantityValue: q.val, quantityUnit: q.unit as QuantityUnit })
                }
                className="px-2 py-1.5 rounded-md bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-[11px] font-medium text-stone-700 dark:text-stone-300 whitespace-nowrap transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Caliper & Bulk Factor Drawer */}
      <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
        <button
          onClick={() => setShowAdvancedBulk(!showAdvancedBulk)}
          className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1.5 font-medium transition-colors"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Paper Bulk & Caliper Thickness Settings</span>
          {showAdvancedBulk ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvancedBulk && (
          <div className="mt-3 p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-700 dark:text-stone-300 font-medium">Bulk Factor:</span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                {input.bulkFactor.toFixed(2)} microns per GSM
              </span>
            </div>
            <input
              type="range"
              min="0.9"
              max="2.0"
              step="0.05"
              value={input.bulkFactor}
              onChange={(e) => onChange({ bulkFactor: parseFloat(e.target.value) || 1.25 })}
              className="w-full accent-amber-600 dark:accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-stone-400 dark:text-stone-500">
              <span>0.95 (Art Paper Coated Gloss)</span>
              <span>1.25 (Copier & Maplitho)</span>
              <span>1.45 (High-Bulk Novel & Duplex Board)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
