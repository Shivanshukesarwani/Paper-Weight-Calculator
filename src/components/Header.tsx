import React from 'react';
import { 
  BookOpen, 
  Scale, 
  RotateCcw,
  FileText,
  Scissors
} from 'lucide-react';

interface HeaderProps {
  currentView: 'calculator' | 'farma';
  setCurrentView: (view: 'calculator' | 'farma') => void;
  currencySymbol: string;
  onCurrencyChange: (symbol: string) => void;
  onOpenBasisGuide: () => void;
  onOpenQuotation: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  currencySymbol,
  onCurrencyChange,
  onOpenBasisGuide,
  onOpenQuotation,
  onReset,
}) => {
  return (
    <header className="w-full bg-stone-900 text-stone-100 border-b border-stone-800 no-print select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/30 to-amber-600/10 text-amber-400 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-xs tracking-wider shadow-inner">
            SGD
          </div>
          <span className="text-sm sm:text-base font-semibold tracking-tight text-white font-sans">
            Shivanshu Graphic &amp; Design's Calculator
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden sm:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setCurrentView('calculator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              currentView === 'calculator'
                ? 'bg-stone-800 text-amber-400 shadow-sm border border-stone-700/60'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Weight &amp; Price</span>
          </button>

          <button
            onClick={() => setCurrentView('farma')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              currentView === 'farma'
                ? 'bg-stone-800 text-amber-400 shadow-sm border border-stone-700/60'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Sheet Cutting / Farma</span>
          </button>

          <button
            onClick={onOpenBasisGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800/50 transition-colors whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mill Standards &amp; 3100 Formula</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Currency Selector */}
          <select
            value={currencySymbol}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="bg-stone-800 text-stone-200 text-xs font-mono font-semibold rounded px-2 py-1.5 border border-stone-700 focus:outline-none"
            title="Currency"
          >
            <option value="₹">₹ INR</option>
            <option value="$">$ USD</option>
            <option value="€">€ EUR</option>
            <option value="£">£ GBP</option>
            <option value="AED">AED</option>
          </select>

          <button
            onClick={onOpenQuotation}
            title="Generate Quotation & Print Spec Sheet"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-md transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">GST Quote</span>
          </button>

          <button
            onClick={onReset}
            title="Reset to default 75 GSM A4 paper"
            className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
