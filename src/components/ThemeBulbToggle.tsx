import React, { useEffect, useRef, useState } from 'react';
import { Lightbulb, Monitor, Moon, Sun, Check } from 'lucide-react';

export type ThemeMode = 'system' | 'light' | 'dark';

export const ThemeBulbToggle: React.FC = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('folio_theme') as ThemeMode | null;
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    }
    return 'system';
  });

  const [resolvedDark, setResolvedDark] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let isDark = false;
      if (themeMode === 'dark') {
        isDark = true;
      } else if (themeMode === 'light') {
        isDark = false;
      } else {
        // System preference
        isDark = mediaQuery.matches;
      }

      setResolvedDark(isDark);
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    localStorage.setItem('folio_theme', themeMode);

    const handleSystemChange = () => {
      if (themeMode === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [themeMode]);

  // Close menu on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const cycleTheme = () => {
    setThemeMode((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  return (
    <div ref={menuRef} className="fixed bottom-5 left-5 z-50 select-none">
      {/* Floating Theme Options Popover Menu */}
      {isOpen && (
        <div 
          className="absolute bottom-14 left-0 mb-2 w-56 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl p-2 space-y-1 text-xs animate-in fade-in slide-in-from-bottom-2 duration-150 backdrop-blur-md"
          role="menu"
          aria-label="Theme selection"
        >
          <div className="px-2.5 py-1.5 border-b border-stone-100 dark:border-stone-800/80 mb-1">
            <span className="font-semibold text-stone-900 dark:text-stone-100 block">Appearance Theme</span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              Active: {themeMode === 'system' ? `System (${resolvedDark ? 'Dark' : 'Light'})` : themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>

          {/* Option: Light */}
          <button
            onClick={() => {
              setThemeMode('light');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-left ${
              themeMode === 'light'
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-semibold'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light Theme</span>
            </div>
            {themeMode === 'light' && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
          </button>

          {/* Option: Dark */}
          <button
            onClick={() => {
              setThemeMode('dark');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-left ${
              themeMode === 'dark'
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-semibold'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Dark Theme</span>
            </div>
            {themeMode === 'dark' && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
          </button>

          {/* Option: System */}
          <button
            onClick={() => {
              setThemeMode('system');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-left ${
              themeMode === 'system'
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-semibold'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-stone-500 dark:text-stone-400" />
              <div className="flex flex-col">
                <span>System Default</span>
                <span className="text-[10px] text-stone-400 dark:text-stone-500 font-normal">
                  Matches OS ({mediaQuerySummary()})
                </span>
              </div>
            </div>
            {themeMode === 'system' && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
          </button>
        </div>
      )}

      {/* Bottom-left Bulb Icon Button */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          onContextMenu={(e) => {
            e.preventDefault();
            cycleTheme();
          }}
          title={`Theme: ${themeMode.toUpperCase()} (Click to choose, Right-click to toggle)`}
          aria-label="Change application theme"
          className={`relative group flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-200 shadow-md backdrop-blur-md active:scale-95 ${
            resolvedDark
              ? 'bg-stone-900/90 hover:bg-stone-800 border-amber-500/40 text-stone-100 shadow-amber-500/10'
              : 'bg-white/95 hover:bg-stone-50 border-stone-200 text-stone-800 shadow-stone-300/40'
          }`}
        >
          {/* Bulb Icon with Animated Glow Effect */}
          <div className="relative flex items-center justify-center">
            <Lightbulb
              className={`w-5 h-5 transition-transform group-hover:scale-110 duration-200 ${
                resolvedDark
                  ? 'text-amber-400 fill-amber-400/30 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]'
                  : 'text-amber-500 fill-amber-400 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]'
              }`}
            />
            {/* Pulsing subtle aura */}
            <span className="absolute -inset-1 rounded-full bg-amber-400/20 blur-xs -z-10 animate-pulse pointer-events-none" />
          </div>

          {/* Mode Pill Label */}
          <span className="text-xs font-semibold tracking-wide">
            {themeMode === 'system' ? (
              <span className="flex items-center gap-1">
                <span>Auto</span>
                <span className="text-[10px] font-normal opacity-70">
                  ({resolvedDark ? 'Dark' : 'Light'})
                </span>
              </span>
            ) : themeMode === 'dark' ? (
              'Dark'
            ) : (
              'Light'
            )}
          </span>

          {/* Tooltip trigger indicator */}
          <span className="text-[10px] opacity-60 ml-0.5">▾</span>
        </button>
      </div>
    </div>
  );
};

function mediaQuerySummary(): string {
  if (typeof window === 'undefined') return 'Auto';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light';
}
