import React, { useState } from 'react';
import { WeightCalculationResult } from '../types/paper';
import { formatIndianNumber } from '../utils/paperCalculator';
import { Layers, Mail, Package, Scale, Calculator } from 'lucide-react';

interface WeightResultsCardProps {
  result: WeightCalculationResult;
  currencySymbol: string;
}

export const WeightResultsCard: React.FC<WeightResultsCardProps> = ({ result }) => {
  const [preferredUnit, setPreferredUnit] = useState<'metric' | 'trade'>('metric');
  const [postalSheets, setPostalSheets] = useState(3);
  const [includeEnvelope, setIncludeEnvelope] = useState(true);

  // Standard Indian official envelope 9x4 in is approx 5.0 grams
  const envelopeWeightGrams = includeEnvelope ? 5.0 : 0;
  const mailGrams = (result.singleSheetGrams * postalSheets) + envelopeWeightGrams;

  // Indian Postal Slabs
  const isIndiaPost20g = mailGrams <= 20.0;
  const isSpeedPost50g = mailGrams <= 50.0;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden transition-colors">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-800/50">
        <div className="flex items-center gap-2.5">
          <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            Paper Weight & Ream Specification
          </h3>
        </div>

        {/* Segmented Metric / Indian Trade Formula toggle */}
        <div className="flex items-center bg-stone-200/80 dark:bg-stone-800 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setPreferredUnit('metric')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              preferredUnit === 'metric'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Metric (kg / g)
          </button>
          <button
            onClick={() => setPreferredUnit('trade')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              preferredUnit === 'trade'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            3100 Press Formula
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Dominant Total Weight Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-stone-900 to-stone-850 dark:from-stone-950 dark:to-stone-900 text-white relative overflow-hidden border border-stone-800/80">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">
                Total Batch Weight ({formatIndianNumber(result.totalSheets)} sheets / {formatIndianNumber(result.totalReams, 2)} reams)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight tabular-nums text-amber-400">
                  {result.totalWeightKg >= 1
                    ? `${formatIndianNumber(result.totalWeightKg, 2, 2)} kg`
                    : `${formatIndianNumber(result.totalWeightGrams, 1, 1)} g`}
                </span>
                <span className="text-xs font-mono text-stone-400 tabular-nums">
                  ({(result.totalWeightKg / 100).toFixed(2)} Quintals / {result.totalWeightTonnes.toFixed(3)} MT)
                </span>
              </div>
            </div>

            {/* Indian Ream Weight Formula Callout */}
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-stone-400 block font-sans">Trade Ream Weight:</span>
              <span className="font-mono text-sm font-bold text-amber-300">
                {result.indianReamWeightKg3100.toFixed(2)} kg / ream
              </span>
              <span className="text-[10px] text-stone-400 block font-mono">
                via (L" × W" × GSM) / 3100
              </span>
            </div>
          </div>
        </div>

        {/* 4-Grid Key Specifications */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Single Sheet */}
          <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700">
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block">1 Sheet Weight</span>
            <div className="mt-1 font-mono font-bold text-stone-900 dark:text-stone-100 text-lg tabular-nums">
              {result.singleSheetGrams.toFixed(2)} <span className="text-xs font-normal text-stone-600 dark:text-stone-400">g</span>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-mono tabular-nums">
              {(result.singleSheetGrams / 1000).toFixed(5)} kg
            </span>
          </div>

          {/* 1 Ream (500 Sheets) Weight */}
          <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700">
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block">
              1 Ream (500 Sheets)
            </span>
            <div className="mt-1 font-mono font-bold text-stone-900 dark:text-stone-100 text-lg tabular-nums">
              {result.reamWeightKg.toFixed(2)} <span className="text-xs font-normal text-stone-600 dark:text-stone-400">kg</span>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-mono tabular-nums">
              Exact physical wt
            </span>
          </div>

          {/* Trade 3100 Metric */}
          <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700">
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block flex items-center justify-between">
              <span>Press 3100 Formula</span>
              <Calculator className="w-3.5 h-3.5 text-stone-400" />
            </span>
            <div className="mt-1 font-mono font-bold text-stone-900 dark:text-stone-100 text-lg tabular-nums">
              {result.indianReamWeightKg3100.toFixed(2)} <span className="text-xs font-normal text-stone-600 dark:text-stone-400">kg</span>
            </div>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono tabular-nums">
              Merchant standard
            </span>
          </div>

          {/* Stack Caliper / Height */}
          <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700">
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block flex items-center justify-between">
              <span>Stack Height</span>
              <Layers className="w-3.5 h-3.5 text-stone-400" />
            </span>
            <div className="mt-1 font-mono font-bold text-stone-900 dark:text-stone-100 text-lg tabular-nums">
              {result.stackHeightMm >= 10
                ? `${(result.stackHeightMm / 10).toFixed(1)} cm`
                : `${result.stackHeightMm.toFixed(1)} mm`}
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-mono tabular-nums">
              {result.stackHeightInches.toFixed(2)} inches
            </span>
          </div>
        </div>

        {/* Trade Formula Explanation Box */}
        <div className="p-3.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-bold flex items-center gap-1.5">
              <span>Indian Paper Trade Ream Weight Formula:</span>
            </span>
            <span className="font-mono font-bold">
              ({result.widthIn.toFixed(2)}" × {result.heightIn.toFixed(2)}" × {result.effectiveGsm} GSM) ÷ 3100 = {result.indianReamWeightKg3100.toFixed(2)} kg
            </span>
          </div>
          <p className="text-[11px] text-amber-800 dark:text-amber-300">
            Paper merchants across wholesale hubs (Chawri Bazar, Nai Sarak, Sivakasi, Ahmedabad, Mumbai Fort) calculate ream weights and wholesale rates per kg using this 3100 divisor rule.
          </p>
        </div>

        {/* Dimensions & Specifications */}
        <div className="p-3.5 rounded-lg bg-stone-50/80 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-y-2 text-stone-700 dark:text-stone-300">
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
              <span>Sheet Area:</span>
              <span className="font-mono font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
                {result.sheetAreaSqM.toFixed(4)} m² ({result.sheetAreaSqIn.toFixed(1)} sq in)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>Effective Grammage:</span>
              <span className="font-mono font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
                {result.effectiveGsm.toFixed(1)} GSM (g/m²)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>Single Sheet Caliper:</span>
              <span className="font-mono font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
                {result.singleSheetThicknessMm.toFixed(3)} mm / {result.singleSheetThicknessCaliperPt.toFixed(1)} pt
              </span>
            </div>
          </div>
        </div>

        {/* Postal Weight Estimator */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
              <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                Postal & Speed Post Weight Estimator
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-stone-600 dark:text-stone-300 select-none">
                <input
                  type="checkbox"
                  checked={includeEnvelope}
                  onChange={(e) => setIncludeEnvelope(e.target.checked)}
                  className="rounded border-stone-300 text-stone-900 focus:ring-0"
                />
                Include 9×4" Envelope (5g)
              </label>
              <div className="flex items-center gap-1">
                <span className="text-stone-500 dark:text-stone-400">Sheets:</span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={postalSheets}
                  onChange={(e) => setPostalSheets(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 px-1.5 py-0.5 font-mono text-center text-xs bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-stone-600 dark:text-stone-400">Total Envelope Package Weight:</span>
              <div className="font-mono font-semibold text-stone-900 dark:text-stone-100 text-sm tabular-nums mt-0.5">
                {mailGrams.toFixed(1)} grams
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Ordinary Mail tier */}
              <div className={`px-2.5 py-1 rounded text-xs font-medium border ${
                isIndiaPost20g
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
              }`}>
                {isIndiaPost20g ? 'Ordinary Post (≤ 20g)' : 'Ordinary Post > 20g (+₹5 slab)'}
              </div>

              {/* Speed Post slab */}
              <div className={`px-2.5 py-1 rounded text-xs font-medium border ${
                isSpeedPost50g
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
              }`}>
                {isSpeedPost50g ? 'Speed Post Base (≤ 50g)' : 'Speed Post Slab 50g–200g'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
