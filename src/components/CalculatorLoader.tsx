import React, { useEffect, useState } from 'react';
import { Scale, Sparkles, CheckCircle2 } from 'lucide-react';

interface CalculatorLoaderProps {
  onComplete: () => void;
}

const LOADING_STAGES = [
  'Loading standard paper sizes (23×36", 25×38", 18×22", 13×19", 20×30", 30×40")...',
  'Calibrating Indian press 3100 ream weight formula...',
  'Configuring GST Inclusive & Exclusive tax rate engines...',
  'Finalizing Sheet Cutting & Farma calculation tools...',
  'Your calculator is ready to compute!',
];

export const CalculatorLoader: React.FC<CalculatorLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    // Smooth progress simulation over ~2.2 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        // Variable increments to feel like a real calculation engine loading
        let increment = 2.5;
        if (prev < 30) increment = 3.5;
        else if (prev < 70) increment = 2.0;
        else if (prev < 90) increment = 4.0;
        else increment = 5.0;

        const nextVal = Math.min(100, prev + increment);
        
        // Update stage based on progress
        const stage = Math.min(
          LOADING_STAGES.length - 1,
          Math.floor((nextVal / 100) * LOADING_STAGES.length)
        );
        setStageIndex(stage);

        return nextVal;
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        const finishTimer = setTimeout(() => {
          onComplete();
        }, 400);
        return () => clearTimeout(finishTimer);
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9990] flex flex-col items-center justify-center p-6 bg-stone-950 text-white transition-opacity duration-400 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Background Decorative Glow */}
      <div className="absolute w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-lg space-y-7 text-center">
        {/* Brand Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 border border-amber-500/40 text-amber-400 font-mono font-bold text-lg shadow-lg mb-1">
            SGD
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
            Shivanshu Graphic &amp; Design's Calculator
          </h1>
          <p className="text-xs text-stone-400 font-mono tracking-wide">
            Paper Weight &middot; Indian 3100 Formula &middot; GST Inclusive/Exclusive &middot; Farma Cuts
          </p>
        </div>

        {/* Center Card with Progress Slider */}
        <div className="p-6 sm:p-8 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-2xl space-y-6 backdrop-blur-sm">
          {/* Animated Icon & Status Text */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                {progress >= 100 ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-in zoom-in-50 duration-200" />
                ) : (
                  <Scale className="w-6 h-6 animate-pulse" />
                )}
              </div>
              <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-spin duration-3000" />
            </div>

            {/* Requested Exact Text */}
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-stone-100">
                Your calculator is loading...
              </h2>
              <p className="text-xs text-stone-400 font-mono min-h-[1.25rem] transition-all">
                {LOADING_STAGES[stageIndex]}
              </p>
            </div>
          </div>

          {/* Horizontal Progress Slider Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-400 font-sans">Progress</span>
              <span className="text-amber-400 font-bold tabular-nums">
                {Math.round(progress)}%
              </span>
            </div>

            {/* The Horizontal Slider Track */}
            <div className="relative w-full h-3.5 bg-stone-800 rounded-full border border-stone-700/80 p-0.5 overflow-hidden shadow-inner">
              {/* Progress Slider Fill */}
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-300 transition-all duration-75 relative shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                style={{ width: `${progress}%` }}
              >
                {/* Horizontal slider glare / sheen animation */}
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Simulated Slider Thumb / Indicator along the track */}
            <div className="relative w-full h-1">
              <div
                className="absolute top-[-14px] -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-amber-500 shadow-md transition-all duration-75 pointer-events-none"
                style={{ left: `${Math.max(2, Math.min(98, progress))}%` }}
              />
            </div>
          </div>

          {/* Quick Skip Option */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => onComplete()}
              className="text-[11px] text-stone-500 hover:text-stone-300 transition-colors underline underline-offset-4"
            >
              Skip Intro &amp; Start Immediately &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
