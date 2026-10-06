import React from 'react';
import { INDIAN_PAPER_GRADES } from '../data/paperGrades';
import { BookOpen, X, Calculator } from 'lucide-react';

interface BasisReferenceModalProps {
  onClose: () => void;
}

export const BasisReferenceModal: React.FC<BasisReferenceModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800 transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-800/60">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Indian Paper Standards & 3100 Ream Weight Formula Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700 dark:text-stone-300">
          {/* Key Formula Card */}
          <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
              <Calculator className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Standard Indian Paper Trade Ream Weight Formula:</span>
            </div>
            <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-amber-200 dark:border-amber-700/60 font-mono text-center text-sm font-bold text-amber-950 dark:text-amber-300">
              Ream Weight (kg) = (Length in inches × Width in inches × GSM) ÷ 3100
            </div>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
              If dimensions are measured in <strong>Centimeters (cm)</strong>, the corresponding formula is:
              <span className="font-mono font-bold block mt-0.5">
                Ream Weight (kg) = (Length cm × Width cm × GSM) ÷ 20000
              </span>
              This rule forms the foundation of all paper trading in commercial wholesale paper hubs (Chawri Bazar Delhi, Nai Sarak, Girish Park Kolkata, Fort Mumbai, Ahmedabad, and Sivakasi).
            </p>
          </div>

          {/* Standard Mill Sizes Table */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">
              1. Standard Commercial Printing & Mill Sheet Sizes
            </h3>
            <div className="overflow-x-auto rounded-lg border border-stone-200 dark:border-stone-800">
              <table className="w-full text-left">
                <thead className="bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold border-b border-stone-200 dark:border-stone-700">
                  <tr>
                    <th className="p-2.5">Sheet Name</th>
                    <th className="p-2.5">Size (Inches)</th>
                    <th className="p-2.5">Size (mm)</th>
                    <th className="p-2.5">Typical 70 GSM Ream Wt</th>
                    <th className="p-2.5">Primary Usage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-mono text-stone-800 dark:text-stone-200">
                  <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                    <td className="p-2.5 font-bold font-sans text-stone-900 dark:text-stone-100">Double Demy</td>
                    <td className="p-2.5">23" × 36"</td>
                    <td className="p-2.5">584 × 914 mm</td>
                    <td className="p-2.5 text-amber-800 dark:text-amber-400 font-bold">~18.7 kg</td>
                    <td className="p-2.5 font-sans text-[11px] text-stone-600 dark:text-stone-400">Standard for novels, textbooks, 8 A4s, 16 Demy Octavo book pages</td>
                  </tr>
                  <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                    <td className="p-2.5 font-bold font-sans text-stone-900 dark:text-stone-100">Demy</td>
                    <td className="p-2.5">17.5" × 22.5"</td>
                    <td className="p-2.5">445 × 572 mm</td>
                    <td className="p-2.5 text-amber-800 dark:text-amber-400 font-bold">~8.9 kg</td>
                    <td className="p-2.5 font-sans text-[11px] text-stone-600 dark:text-stone-400">Regional publications, stationery bill books, folders</td>
                  </tr>
                  <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                    <td className="p-2.5 font-bold font-sans text-stone-900 dark:text-stone-100">Double Crown</td>
                    <td className="p-2.5">20" × 30"</td>
                    <td className="p-2.5">508 × 762 mm</td>
                    <td className="p-2.5 text-amber-800 dark:text-amber-400 font-bold">~13.5 kg</td>
                    <td className="p-2.5 font-sans text-[11px] text-stone-600 dark:text-stone-400">Posters, sweet box duplex board, book wrappers</td>
                  </tr>
                  <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                    <td className="p-2.5 font-bold font-sans text-stone-900 dark:text-stone-100">Crown</td>
                    <td className="p-2.5">15" × 20"</td>
                    <td className="p-2.5">381 × 508 mm</td>
                    <td className="p-2.5 text-amber-800 dark:text-amber-400 font-bold">~6.8 kg</td>
                    <td className="p-2.5 font-sans text-[11px] text-stone-600 dark:text-stone-400">School notebooks, exercise copies, pocket books</td>
                  </tr>
                  <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                    <td className="p-2.5 font-bold font-sans text-stone-900 dark:text-stone-100">Royal</td>
                    <td className="p-2.5">20" × 25"</td>
                    <td className="p-2.5">508 × 635 mm</td>
                    <td className="p-2.5 text-amber-800 dark:text-amber-400 font-bold">~11.3 kg</td>
                    <td className="p-2.5 font-sans text-[11px] text-stone-600 dark:text-stone-400">Annual reports, corporate brochures, premium registers</td>
                  </tr>
                  <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                    <td className="p-2.5 font-bold font-sans text-stone-900 dark:text-stone-100">Double Royal</td>
                    <td className="p-2.5">25" × 40"</td>
                    <td className="p-2.5">635 × 1016 mm</td>
                    <td className="p-2.5 text-amber-800 dark:text-amber-400 font-bold">~22.6 kg</td>
                    <td className="p-2.5 font-sans text-[11px] text-stone-600 dark:text-stone-400">FMCG packaging cartons, large calendars, export cartons</td>
                  </tr>
                  <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                    <td className="p-2.5 font-bold font-sans text-stone-900 dark:text-stone-100">Imperial</td>
                    <td className="p-2.5">22" × 30"</td>
                    <td className="p-2.5">559 × 762 mm</td>
                    <td className="p-2.5 text-amber-800 dark:text-amber-400 font-bold">~14.9 kg</td>
                    <td className="p-2.5 font-sans text-[11px] text-stone-600 dark:text-stone-400">Drawing sheets, charts, wedding invitation card stock</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Paper Grades, Brands & GST Rates */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">
              2. Major Paper Grades, Mill Brands & GST Classifications
            </h3>
            <div className="overflow-x-auto rounded-lg border border-stone-200 dark:border-stone-800">
              <table className="w-full text-left">
                <thead className="bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold border-b border-stone-200 dark:border-stone-700">
                  <tr>
                    <th className="p-2.5">Paper Variety</th>
                    <th className="p-2.5">Typical GSM</th>
                    <th className="p-2.5">HSN Code</th>
                    <th className="p-2.5">GST Rate</th>
                    <th className="p-2.5">Leading Paper Mills / Brands</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
                  {INDIAN_PAPER_GRADES.map((g) => (
                    <tr key={g.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                      <td className="p-2.5 font-semibold text-stone-900 dark:text-stone-100">
                        {g.name}
                      </td>
                      <td className="p-2.5 font-mono">{g.typicalGsm.join(', ')} GSM</td>
                      <td className="p-2.5 font-mono">{g.hsnCode}</td>
                      <td className="p-2.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">{g.standardGst}%</td>
                      <td className="p-2.5 text-[11px] text-stone-600 dark:text-stone-400">{g.popularBrands}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg text-xs font-semibold hover:bg-stone-800 dark:hover:bg-white transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
