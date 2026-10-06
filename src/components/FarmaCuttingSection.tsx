import React, { useState } from 'react';
import { calculateFarmaCuts, formatIndianNumber } from '../utils/paperCalculator';
import { PAPER_SIZES } from '../data/paperSizes';
import { Scissors, Check } from 'lucide-react';

interface FarmaCuttingSectionProps {
  onApplyParentSheet: (sizeId: string, quantitySheets: number) => void;
}

export const FarmaCuttingSection: React.FC<FarmaCuttingSectionProps> = ({
  onApplyParentSheet,
}) => {
  const [parentSizeId, setParentSizeId] = useState('in_23_36'); // 23x36 in Double Demy
  const [targetCutSizeId, setTargetCutSizeId] = useState('in_book_demy_octavo'); // 5.5x8.5 in book
  const [jobQuantityCopies, setJobQuantityCopies] = useState(5000);

  const parentSize = PAPER_SIZES.find((s) => s.id === parentSizeId) || PAPER_SIZES[0];
  const cutSize = PAPER_SIZES.find((s) => s.id === targetCutSizeId) || PAPER_SIZES[12];

  const farmaResult = calculateFarmaCuts(
    parentSize.name,
    parentSize.widthIn,
    parentSize.heightIn,
    cutSize.widthIn,
    cutSize.heightIn,
    jobQuantityCopies
  );

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs p-5 space-y-5 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
        <div>
          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
            <Scissors className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Sheet Cutting & Farma (Ups) Calculator
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Calculate how many cuts (Ups / Farma) you get from full mill sheets (23×36, 25×38, 20×30, 30×40) and exact paper reams needed.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input 1: Parent Mill Sheet Size */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
            Full Parent Mill Sheet
          </label>
          <select
            value={parentSizeId}
            onChange={(e) => setParentSizeId(e.target.value)}
            className="w-full text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="in_23_36">23 × 36 in (Double Demy) — King of publishing and book printing</option>
            <option value="in_25_38">25 × 38 in (Double Crown / Text) — Book text & offset paper</option>
            <option value="in_20_30">20 × 30 in (Double Royal) — Posters and sweet box packaging</option>
            <option value="in_30_40">30 × 40 in (Quad Crown) — Calendars and large FMCG packaging</option>
            <option value="in_18_22">18 × 22 in (Demy / Small Demy) — Notepads and billing registers</option>
            <option value="in_18_23">18 × 23 in (Crown Variant) — Book covers and brochures</option>
            <option value="in_19_25">19 × 25 in (Double Foolscap) — Packaging sleeves & leaflets</option>
            <option value="in_13_19">13 × 19 in (Digital Super A3) — Digital press sheets</option>
            <option value="in_12_18">12 × 18 in (Digital Press) — Color commercial print</option>
          </select>
          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono mt-1 block">
            Size: {parentSize.widthIn}" × {parentSize.heightIn}" ({parentSize.widthMm} × {parentSize.heightMm} mm)
          </span>
        </div>

        {/* Input 2: Target Finished Cut Item */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
            Finished Target Cut Size
          </label>
          <select
            value={targetCutSizeId}
            onChange={(e) => setTargetCutSizeId(e.target.value)}
            className="w-full text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="in_book_demy_octavo">Demy 1/8 (5.5 × 8.5 in) — Standard college book and novel size</option>
            <option value="in_book_crown_octavo">Crown 1/8 (4.75 × 7.25 in) — Pocket books and paperbacks</option>
            <option value="in_a4">A4 Size (8.27 × 11.69 in / 210 × 297 mm)</option>
            <option value="in_a5">A5 Size (5.83 × 8.27 in / 148 × 210 mm)</option>
            <option value="in_pamphlet_flyer">1/8 Demy Handbill (4.37 × 7.0 in) — Pamphlets & circulars</option>
            <option value="in_visiting_card">Visiting Card (3.5 × 2.13 in / 89 × 54 mm)</option>
          </select>
          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono mt-1 block">
            Size: {cutSize.widthIn}" × {cutSize.heightIn}" ({cutSize.widthMm} × {cutSize.heightMm} mm)
          </span>
        </div>
      </div>

      {/* Target copies */}
      <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700 text-xs">
        <span className="font-semibold text-stone-700 dark:text-stone-300">Finished Copies Needed:</span>
        <input
          type="number"
          min="100"
          step="100"
          value={jobQuantityCopies}
          onChange={(e) => setJobQuantityCopies(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-28 text-sm font-mono font-bold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1 text-stone-900 dark:text-stone-100"
        />
        <span className="text-stone-500 dark:text-stone-400">copies / printed items</span>
      </div>

      {/* Calculation Outcome Grid */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-stone-50 to-amber-500/5 dark:from-amber-950/20 dark:via-stone-900 dark:to-stone-900 border border-amber-200/80 dark:border-amber-800/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 dark:border-amber-800/50 pb-3">
          <div>
            <span className="text-xs font-semibold text-amber-950 dark:text-amber-200 uppercase tracking-wider block">
              Optimal Cutting Yield
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold font-mono text-amber-950 dark:text-amber-300">
                {farmaResult.bestUps}-Up Farma
              </span>
              <span className="text-xs font-medium text-amber-800 dark:text-amber-400">
                ({farmaResult.bestUps} cut pieces per 1 parent sheet)
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-stone-500 dark:text-stone-400 block">Trimming Loss / Wastage</span>
            <span className={`font-mono text-sm font-bold ${
              farmaResult.sheetWastagePercent < 15 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-800 dark:text-amber-400'
            }`}>
              {farmaResult.sheetWastagePercent.toFixed(1)}% {farmaResult.sheetWastagePercent < 15 ? '(Optimal)' : '(Moderate trim)'}
            </span>
          </div>
        </div>

        {/* Reams Required for Job */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-sans block">Parent Sheets Needed</span>
            <span className="text-base font-bold text-stone-900 dark:text-stone-100">
              {formatIndianNumber(farmaResult.totalParentSheetsNeeded)}
            </span>
            <span className="text-[10px] text-stone-400 dark:text-stone-500 block font-sans">full mill sheets</span>
          </div>

          <div className="p-2.5 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-sans block">Full Reams to Order</span>
            <span className="text-base font-bold text-amber-900 dark:text-amber-400">
              {farmaResult.totalParentReamsNeeded.toFixed(2)}
            </span>
            <span className="text-[10px] text-stone-400 dark:text-stone-500 block font-sans">
              Reams (500 sheets/ream)
            </span>
          </div>

          <div className="p-2.5 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-sans block">Orientation</span>
            <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
              {farmaResult.orientationUsed === 'normal' ? 'Straight Grain' : 'Rotated 90°'}
            </span>
            <span className="text-[10px] text-stone-400 dark:text-stone-500 block font-sans">Minimum paper wastage</span>
          </div>
        </div>

        {/* Action Button: Apply to main calculator */}
        <div className="flex justify-end pt-1">
          <button
            onClick={() =>
              onApplyParentSheet(parentSizeId, farmaResult.totalParentSheetsNeeded)
            }
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 rounded-lg transition-colors shadow-xs"
          >
            <Check className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
            <span>Load {farmaResult.totalParentReamsNeeded.toFixed(2)} Reams of {parentSize.name} into Price Calculator</span>
          </button>
        </div>
      </div>
    </div>
  );
};
