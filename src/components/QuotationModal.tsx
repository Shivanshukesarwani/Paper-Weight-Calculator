import React, { useState } from 'react';
import { 
  PriceCalculatorInput, 
  PriceCalculationResult, 
  WeightCalculatorInput, 
  WeightCalculationResult 
} from '../types/paper';
import { PAPER_SIZES } from '../data/paperSizes';
import { formatIndianCurrency, formatIndianNumber } from '../utils/paperCalculator';
import { Check, Copy, Printer, X } from 'lucide-react';

interface QuotationModalProps {
  weightInput: WeightCalculatorInput;
  priceInput: PriceCalculatorInput;
  weightResult: WeightCalculationResult;
  priceResult: PriceCalculationResult;
  onClose: () => void;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({
  weightInput,
  priceInput,
  weightResult,
  priceResult,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [clientName, setClientName] = useState('M/s ABC Enterprises / Client');
  const [projectName, setProjectName] = useState('Commercial Print / Paper Stock Order');
  const [gstin, setGstin] = useState('07AAAAA0000A1Z5');

  const selectedSize = PAPER_SIZES.find((s) => s.id === weightInput.sizeId);
  const currency = priceInput.currencySymbol || '₹';
  const isInclusive = priceResult.rateGstMode === 'inclusive';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const summary = `
======================================================
COMMERCIAL PAPER SPECIFICATION & GST ESTIMATE
======================================================
Customer / Party: ${clientName}
GSTIN: ${gstin}
Project: ${projectName}
Date: ${new Date().toLocaleDateString('en-IN')}

PAPER & STOCK SPECIFICATIONS:
- Sheet Size: ${selectedSize?.name || 'Custom'} (${weightResult.widthIn.toFixed(2)}" × ${weightResult.heightIn.toFixed(2)}" / ${weightResult.widthMm} × ${weightResult.heightMm} mm)
- Paper Grammage: ${weightResult.effectiveGsm.toFixed(1)} GSM
- Total Volume: ${formatIndianNumber(weightResult.totalSheets)} Sheets (${formatIndianNumber(weightResult.totalReams, 2)} Reams)
- Single Sheet Weight: ${weightResult.singleSheetGrams.toFixed(2)} grams
- Trade Ream Weight (3100 Formula): ${weightResult.indianReamWeightKg3100.toFixed(2)} kg / ream
- Total Batch Weight: ${formatIndianNumber(weightResult.totalWeightKg, 2)} kg (${(weightResult.totalWeightKg / 100).toFixed(2)} Quintals)
- Stack Caliper Height: ${weightResult.stackHeightMm >= 10 ? `${(weightResult.stackHeightMm / 10).toFixed(1)} cm` : `${weightResult.stackHeightMm.toFixed(1)} mm`}

COMMERCIAL COST & GST BREAKDOWN:
- Paper Stock Rate Mode: ${isInclusive ? 'GST Inclusive' : 'GST Exclusive (+Tax)'}
- Raw Paper Stock: ${formatIndianCurrency(priceResult.basePaperCost, currency)}
- Cutting & Trimming: ${formatIndianCurrency(priceResult.trimmingCostTotal, currency)}
- Printing Impressions: ${formatIndianCurrency(priceResult.printingCostTotal, currency)}
- CTP Plates & Setup: ${formatIndianCurrency(priceResult.finishingSetupFee, currency)}
- Thermal Lamination: ${formatIndianCurrency(priceResult.laminationCostTotal, currency)}
- Transport / Local Freight: ${formatIndianCurrency(priceResult.shippingCost, currency)}
- GST (${priceInput.taxRatePercent}%): ${formatIndianCurrency(priceResult.taxAmount, currency)}
  ${priceInput.gstType === 'intra_state' 
    ? `(CGST ${(priceInput.taxRatePercent / 2)}%: ${formatIndianCurrency(priceResult.cgstAmount, currency)} + SGST ${(priceInput.taxRatePercent / 2)}%: ${formatIndianCurrency(priceResult.sgstAmount, currency)})` 
    : `(IGST ${priceInput.taxRatePercent}%: ${formatIndianCurrency(priceResult.igstAmount, currency)})`}
------------------------------------------------------
TOTAL ALL-IN NET COST: ${formatIndianCurrency(priceResult.totalAllInCost, currency)}
PROPOSED CLIENT QUOTE: ${formatIndianCurrency(priceResult.suggestedSellingPrice, currency)}
Rate per Sheet: ${formatIndianCurrency(priceResult.sellingPricePerSheet, currency, 3)} / sheet
Rate per Ream: ${formatIndianCurrency(priceResult.sellingPricePerReam, currency)} / ream
======================================================
Terms: 50% Advance with PO, Balance on Dispatch. Subject to mill rate fluctuations.
`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800 transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-800/60 no-print">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Paper Quotation & GST Specification Slip
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Paper Quote Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-stone-800 dark:text-stone-200 font-sans print:p-0 print:text-black">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-stone-900 dark:border-stone-700 pb-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                PAPER STOCK ESTIMATE & QUOTATION
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-mono mt-0.5">
                EST/IN-#{Date.now().toString().slice(-6)} · Date: {new Date().toLocaleDateString('en-IN')}
              </p>
            </div>

            <div className="text-right text-xs">
              <span className="font-bold text-stone-900 dark:text-stone-100 block">Shivanshu Graphic &amp; Design</span>
              <span className="text-stone-500 dark:text-stone-400">Paper Weight &amp; Commercial Valuation</span>
            </div>
          </div>

          {/* Client & Project fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs no-print">
            <div>
              <label className="block text-stone-500 dark:text-stone-400 font-medium mb-1">Customer / Party Name:</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded font-medium text-stone-900 dark:text-stone-100"
              />
            </div>
            <div>
              <label className="block text-stone-500 dark:text-stone-400 font-medium mb-1">Job / Book Title:</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded font-medium text-stone-900 dark:text-stone-100"
              />
            </div>
            <div>
              <label className="block text-stone-500 dark:text-stone-400 font-medium mb-1">Client GSTIN (Optional):</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded font-mono text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          {/* Paper Technical Specifications */}
          <div className="rounded-lg bg-stone-50 dark:bg-stone-800/60 p-4 border border-stone-200 dark:border-stone-700 space-y-3 text-xs">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px] border-b border-stone-200 dark:border-stone-700 pb-1">
              Technical Paper Specifications
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[10px] font-sans">Sheet Size</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">{selectedSize?.name || 'Custom'}</span>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[10px] font-sans">Grammage / GSM</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">{weightResult.effectiveGsm.toFixed(1)} GSM</span>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[10px] font-sans">Total Volume</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {formatIndianNumber(weightResult.totalSheets)} Sheets ({formatIndianNumber(weightResult.totalReams, 2)} Reams)
                </span>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[10px] font-sans">Trade Ream Wt (3100)</span>
                <span className="font-bold text-amber-900 dark:text-amber-400">{weightResult.indianReamWeightKg3100.toFixed(2)} kg / ream</span>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[10px] font-sans">Total Batch Weight</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {formatIndianNumber(weightResult.totalWeightKg, 2)} kg ({(weightResult.totalWeightKg / 100).toFixed(2)} Q)
                </span>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[10px] font-sans">Stack Caliper</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">{weightResult.stackHeightMm.toFixed(1)} mm</span>
              </div>
            </div>
          </div>

          {/* Price & GST Table */}
          <div className="rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold border-b border-stone-200 dark:border-stone-700">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">HSN / Metric</th>
                  <th className="p-3 text-right">Total ({currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-mono">
                <tr>
                  <td className="p-3 font-sans font-medium text-stone-900 dark:text-stone-100">
                    Raw Paper Stock ({isInclusive ? 'Entered GST Inclusive' : 'Net Base'})
                  </td>
                  <td className="p-3 text-right text-stone-600 dark:text-stone-400">
                    HSN 4802 · {formatIndianNumber(weightResult.totalReams, 1)} reams
                  </td>
                  <td className="p-3 text-right font-bold text-stone-900 dark:text-stone-100">
                    {formatIndianCurrency(priceResult.basePaperCost, currency)}
                  </td>
                </tr>
                {priceResult.trimmingCostTotal > 0 && (
                  <tr>
                    <td className="p-3 font-sans text-stone-700 dark:text-stone-300">Paper Cutting & Trimming</td>
                    <td className="p-3 text-right text-stone-600 dark:text-stone-400">1 Job</td>
                    <td className="p-3 text-right">{formatIndianCurrency(priceResult.trimmingCostTotal, currency)}</td>
                  </tr>
                )}
                {priceResult.printingCostTotal > 0 && (
                  <tr>
                    <td className="p-3 font-sans text-stone-700 dark:text-stone-300">Printing Impressions</td>
                    <td className="p-3 text-right text-stone-600 dark:text-stone-400">{formatIndianNumber(weightResult.totalSheets)} sheets</td>
                    <td className="p-3 text-right">{formatIndianCurrency(priceResult.printingCostTotal, currency)}</td>
                  </tr>
                )}
                {priceResult.finishingSetupFee > 0 && (
                  <tr>
                    <td className="p-3 font-sans text-stone-700 dark:text-stone-300">CTP Plates & Machine Setup</td>
                    <td className="p-3 text-right text-stone-600 dark:text-stone-400">Make-ready</td>
                    <td className="p-3 text-right">{formatIndianCurrency(priceResult.finishingSetupFee, currency)}</td>
                  </tr>
                )}
                {priceResult.laminationCostTotal > 0 && (
                  <tr>
                    <td className="p-3 font-sans text-stone-700 dark:text-stone-300">Thermal Lamination (Gloss / Matt)</td>
                    <td className="p-3 text-right text-stone-600 dark:text-stone-400">{formatIndianNumber(weightResult.totalSheets)} sheets</td>
                    <td className="p-3 text-right">{formatIndianCurrency(priceResult.laminationCostTotal, currency)}</td>
                  </tr>
                )}
                {priceResult.shippingCost > 0 && (
                  <tr>
                    <td className="p-3 font-sans text-stone-700 dark:text-stone-300">Transport / Local Delivery Freight</td>
                    <td className="p-3 text-right text-stone-600 dark:text-stone-400">{formatIndianNumber(weightResult.totalWeightKg, 1)} kg</td>
                    <td className="p-3 text-right">{formatIndianCurrency(priceResult.shippingCost, currency)}</td>
                  </tr>
                )}
                {priceResult.taxAmount > 0 && (
                  <>
                    {priceInput.gstType === 'intra_state' ? (
                      <>
                        <tr className="bg-stone-50/50 dark:bg-stone-800/40">
                          <td className="p-2.5 font-sans pl-6 text-stone-600 dark:text-stone-300">CGST @ {(priceInput.taxRatePercent / 2).toFixed(1)}%</td>
                          <td className="p-2.5 text-right font-sans text-stone-500 dark:text-stone-400">Intra-State</td>
                          <td className="p-2.5 text-right">{formatIndianCurrency(priceResult.cgstAmount, currency)}</td>
                        </tr>
                        <tr className="bg-stone-50/50 dark:bg-stone-800/40">
                          <td className="p-2.5 font-sans pl-6 text-stone-600 dark:text-stone-300">SGST @ {(priceInput.taxRatePercent / 2).toFixed(1)}%</td>
                          <td className="p-2.5 text-right font-sans text-stone-500 dark:text-stone-400">Intra-State</td>
                          <td className="p-2.5 text-right">{formatIndianCurrency(priceResult.sgstAmount, currency)}</td>
                        </tr>
                      </>
                    ) : (
                      <tr className="bg-stone-50/50 dark:bg-stone-800/40">
                        <td className="p-2.5 font-sans pl-6 text-stone-600 dark:text-stone-300">IGST @ {priceInput.taxRatePercent}%</td>
                        <td className="p-2.5 text-right font-sans text-stone-500 dark:text-stone-400">Inter-State</td>
                        <td className="p-2.5 text-right">{formatIndianCurrency(priceResult.igstAmount, currency)}</td>
                      </tr>
                    )}
                  </>
                )}
                <tr className="bg-stone-50 dark:bg-stone-800 font-bold text-stone-900 dark:text-stone-100 border-t-2 border-stone-300 dark:border-stone-700">
                  <td className="p-3 font-sans">Total Proposed Customer Quote (GST Inclusive)</td>
                  <td className="p-3 text-right">{formatIndianCurrency(priceResult.sellingPricePerSheet, currency, 3)}/sheet</td>
                  <td className="p-3 text-right text-base text-emerald-800 dark:text-emerald-400">
                    {formatIndianCurrency(priceResult.suggestedSellingPrice, currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-[11px] text-stone-500 dark:text-stone-400 italic space-y-1">
            <p>1. Rates quoted are strictly valid for 15 days from date of issue due to paper mill price fluctuations.</p>
            <p>2. Payment Terms: 50% Advance with purchase order, remaining 50% on proof approval / before dispatch.</p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 flex items-center justify-between no-print">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Estimate!' : 'Copy Summary'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-lg text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print GST Estimate</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg text-xs font-medium hover:bg-stone-800 dark:hover:bg-white transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
