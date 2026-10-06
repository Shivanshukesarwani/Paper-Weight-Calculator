import React from 'react';
import { PriceCalculationResult, PriceCalculatorInput, WeightCalculationResult } from '../types/paper';
import { formatIndianCurrency, formatIndianNumber } from '../utils/paperCalculator';
import { BadgePercent, DollarSign, TrendingUp, Truck, ReceiptText, ShieldCheck } from 'lucide-react';

interface PriceResultsCardProps {
  priceResult: PriceCalculationResult;
  weightResult: WeightCalculationResult;
  priceInput: PriceCalculatorInput;
}

export const PriceResultsCard: React.FC<PriceResultsCardProps> = ({
  priceResult,
  weightResult,
  priceInput,
}) => {
  const currency = priceInput.currencySymbol || '₹';
  const isInclusive = priceResult.rateGstMode === 'inclusive';

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden transition-colors">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-800/50">
        <div className="flex items-center gap-2.5">
          <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            Commercial Pricing & GST Job Estimate
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${
            isInclusive
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300'
          }`}>
            {isInclusive ? 'Rate: GST Inclusive' : 'Rate: GST Exclusive (+Tax)'}
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-mono hidden sm:inline">
            {formatIndianNumber(weightResult.totalSheets)} Sheets
          </span>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* All-in Total Cost vs Resale Quote Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Net Cost */}
          <div className="p-4 rounded-xl bg-stone-900 dark:bg-stone-950 text-white relative border border-stone-800">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-medium block">
              Total Payable Bill (All-In Cost)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight tabular-nums text-white">
                {formatIndianCurrency(priceResult.totalAllInCost, currency)}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs font-mono text-stone-300 border-t border-stone-800 pt-2">
              <span>{formatIndianCurrency(priceResult.allInCostPerSheet, currency, 3)} / sheet</span>
              <span>·</span>
              <span>{formatIndianCurrency(priceResult.allInCostPerReam, currency)} / ream</span>
            </div>
          </div>

          {/* Suggested Customer Resale Price */}
          <div className="p-4 rounded-xl bg-emerald-950 dark:bg-emerald-950/80 text-emerald-50 border border-emerald-800/60 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-medium">
                Customer Selling Price (Quote)
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-300">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{priceResult.effectiveMarginPercent.toFixed(1)}% Margin</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight tabular-nums text-emerald-300">
                {formatIndianCurrency(priceResult.suggestedSellingPrice, currency)}
              </span>
              <span className="text-xs font-mono text-emerald-400">
                (+{formatIndianCurrency(priceResult.grossProfit, currency)} profit)
              </span>
            </div>

            <div className="flex items-center gap-3 mt-2 text-xs font-mono text-emerald-200 border-t border-emerald-900/60 pt-2">
              <span>{formatIndianCurrency(priceResult.sellingPricePerSheet, currency, 3)} / sheet</span>
              <span>·</span>
              <span>{formatIndianCurrency(priceResult.sellingPricePerReam, currency)} / ream</span>
            </div>
          </div>
        </div>

        {/* Unit Cost Grid */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Unit Rate Breakdown (Net Base Paper Stock)
            </span>
            <span className="text-[11px] text-stone-400 dark:text-stone-500 font-mono">
              Before GST & Finishing
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium block">Rate per kg</span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-base tabular-nums mt-0.5 block">
                {formatIndianCurrency(priceResult.paperCostPerKg, currency)}
              </span>
              <span className="text-[10px] text-stone-400 dark:text-stone-500">Wholesale mill rate</span>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium block">Rate per Ream</span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-base tabular-nums mt-0.5 block">
                {formatIndianCurrency(priceResult.paperCostPerReam, currency)}
              </span>
              <span className="text-[10px] text-stone-400 dark:text-stone-500">500 sheets pack</span>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium block">Rate per Sheet</span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-base tabular-nums mt-0.5 block">
                {formatIndianCurrency(priceResult.paperCostPerSheet, currency, 3)}
              </span>
              <span className="text-[10px] text-stone-400 dark:text-stone-500">Single raw sheet</span>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium block">Per 1,000 (M-Rate)</span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-base tabular-nums mt-0.5 block">
                {formatIndianCurrency(priceResult.paperCostPer1000, currency)}
              </span>
              <span className="text-[10px] text-stone-400 dark:text-stone-500">1,000 sheets (2 reams)</span>
            </div>
          </div>
        </div>

        {/* Detailed Itemized Line Items Table with Indian GST */}
        <div className="rounded-lg border border-stone-200/80 dark:border-stone-700 overflow-hidden text-xs">
          <div className="bg-stone-50 dark:bg-stone-800/80 px-4 py-2 border-b border-stone-200 dark:border-stone-700 font-semibold text-stone-700 dark:text-stone-300 flex justify-between">
            <span>Itemized Cost & Tax Bill</span>
            <span>Amount</span>
          </div>
          <div className="divide-y divide-stone-100 dark:divide-stone-800 bg-white dark:bg-stone-900">
            {/* Paper Stock */}
            <div className="px-4 py-2.5 flex justify-between items-center text-stone-800 dark:text-stone-200">
              <div className="flex flex-col">
                <span className="font-medium">
                  Paper Stock ({formatIndianNumber(weightResult.totalReams, 1)} reams / {formatIndianNumber(weightResult.totalWeightKg, 2)} kg)
                </span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">
                  {isInclusive
                    ? `Entered: ${formatIndianCurrency(priceResult.enteredPaperTotalGross, currency)} (GST Included)`
                    : `Base Rate before tax`}
                </span>
              </div>
              <span className="font-mono font-bold tabular-nums text-stone-900 dark:text-stone-100">
                {formatIndianCurrency(priceResult.basePaperCost, currency)}
              </span>
            </div>

            {/* Trimming */}
            {priceResult.trimmingCostTotal > 0 && (
              <div className="px-4 py-2 flex justify-between items-center text-stone-600 dark:text-stone-300">
                <span>Paper Cutting & Trimming (Katayi)</span>
                <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">
                  {formatIndianCurrency(priceResult.trimmingCostTotal, currency)}
                </span>
              </div>
            )}

            {/* Printing Impression */}
            {priceResult.printingCostTotal > 0 && (
              <div className="px-4 py-2 flex justify-between items-center text-stone-600 dark:text-stone-300">
                <span>Printing Impressions ({formatIndianNumber(weightResult.totalSheets)} sheets)</span>
                <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">
                  {formatIndianCurrency(priceResult.printingCostTotal, currency)}
                </span>
              </div>
            )}

            {/* CTP Plates & Setup */}
            {priceResult.finishingSetupFee > 0 && (
              <div className="px-4 py-2 flex justify-between items-center text-stone-600 dark:text-stone-300">
                <span>CTP Plate Making & Setup</span>
                <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">
                  {formatIndianCurrency(priceResult.finishingSetupFee, currency)}
                </span>
              </div>
            )}

            {/* Lamination */}
            {priceResult.laminationCostTotal > 0 && (
              <div className="px-4 py-2 flex justify-between items-center text-stone-600 dark:text-stone-300">
                <span>Thermal Lamination</span>
                <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">
                  {formatIndianCurrency(priceResult.laminationCostTotal, currency)}
                </span>
              </div>
            )}

            {/* Bulk discount */}
            {priceResult.discountAmount > 0 && (
              <div className="px-4 py-2 flex justify-between items-center text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20">
                <span className="flex items-center gap-1.5">
                  <BadgePercent className="w-3.5 h-3.5" />
                  Supplier Volume Discount ({priceInput.volumeDiscountPercent}%)
                </span>
                <span className="font-mono font-medium tabular-nums">
                  -{formatIndianCurrency(priceResult.discountAmount, currency)}
                </span>
              </div>
            )}

            {/* Freight */}
            <div className="px-4 py-2 flex justify-between items-center text-stone-600 dark:text-stone-300">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-stone-400" />
                Transport & Local Delivery
              </span>
              <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">
                {priceResult.shippingCost === 0 ? 'FREE / SELF PICKUP' : formatIndianCurrency(priceResult.shippingCost, currency)}
              </span>
            </div>

            {/* Subtotal before GST */}
            <div className="px-4 py-2 flex justify-between items-center bg-stone-50/50 dark:bg-stone-800/40 font-semibold text-stone-700 dark:text-stone-300">
              <span>Taxable Subtotal (Base Amount)</span>
              <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">
                {formatIndianCurrency(priceResult.discountedCost + priceResult.shippingCost, currency)}
              </span>
            </div>

            {/* Indian GST Breakdown */}
            {priceInput.taxRatePercent > 0 && (
              <>
                {priceInput.gstType === 'intra_state' ? (
                  <>
                    <div className="px-4 py-1.5 flex justify-between items-center text-stone-600 dark:text-stone-400">
                      <span className="pl-2">├─ CGST ({(priceInput.taxRatePercent / 2).toFixed(1)}%)</span>
                      <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">
                        {formatIndianCurrency(priceResult.cgstAmount, currency)}
                      </span>
                    </div>
                    <div className="px-4 py-1.5 flex justify-between items-center text-stone-600 dark:text-stone-400">
                      <span className="pl-2">└─ SGST ({(priceInput.taxRatePercent / 2).toFixed(1)}%)</span>
                      <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">
                        {formatIndianCurrency(priceResult.sgstAmount, currency)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-1.5 flex justify-between items-center text-stone-600 dark:text-stone-400">
                    <span className="pl-2">└─ IGST ({priceInput.taxRatePercent}%)</span>
                    <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">
                      {formatIndianCurrency(priceResult.igstAmount, currency)}
                    </span>
                  </div>
                )}
              </>
            )}

            {/* Total Grand Bill */}
            <div className="px-4 py-3 flex justify-between items-center bg-stone-100 dark:bg-stone-800 font-bold text-stone-900 dark:text-stone-100 text-sm">
              <span className="flex items-center gap-1.5">
                <ReceiptText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Total Job Amount (Incl. GST)
              </span>
              <span className="font-mono text-base tabular-nums text-emerald-700 dark:text-emerald-400">
                {formatIndianCurrency(priceResult.totalAllInCost, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
