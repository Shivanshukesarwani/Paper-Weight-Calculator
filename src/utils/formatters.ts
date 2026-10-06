import { AppSettings, NegativeDisplay, TapeLine } from '../types';

export function formatNumber(
  num: number,
  settings: AppSettings,
  includeSymbol = false
): string {
  if (isNaN(num) || !isFinite(num)) return 'Error';

  const isNeg = num < 0;
  const absNum = Math.abs(num);

  let formattedNum: string;
  if (settings.decimals === 'float') {
    // float up to 6 decimal places, trim trailing zeroes
    formattedNum = absNum.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  } else {
    const dec = parseInt(settings.decimals, 10);
    formattedNum = absNum.toLocaleString(undefined, {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    });
  }

  const symbol = includeSymbol && settings.currencySymbol ? `${settings.currencySymbol} ` : '';

  if (!isNeg) {
    return `${symbol}${formattedNum}`;
  }

  // Handle negative styling
  switch (settings.negativeDisplay) {
    case 'parentheses':
      return `(${symbol}${formattedNum})`;
    case 'credit-cr':
      return `${symbol}${formattedNum} CR`;
    case 'minus':
    default:
      return `-${symbol}${formattedNum}`;
  }
}

export function formatSimpleNumber(num: number, decimals: 'float' | '0' | '2' | '3' | '4' = '2'): string {
  if (isNaN(num) || !isFinite(num)) return 'Error';
  if (decimals === 'float') {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  }
  const dec = parseInt(decimals, 10);
  return num.toLocaleString(undefined, {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });
}

export function formatDateTime(timestamp: number | string): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function exportTapeToText(items: TapeLine[], title: string, settings: AppSettings): string {
  const divider = '------------------------------------------';
  const lines: string[] = [];

  lines.push('==========================================');
  lines.push(`       ${title.toUpperCase()}`);
  lines.push(`       Date: ${new Date().toLocaleString()}`);
  lines.push('==========================================');
  lines.push('');

  let step = 1;
  items.forEach((item) => {
    const symbol = item.operator;
    const label = item.label ? ` [${item.label}]` : '';
    const formattedVal = formatNumber(item.value, settings, true);
    const balance = settings.showRunningBalance
      ? `  (Bal: ${formatNumber(item.runningBalance, settings, true)})`
      : '';

    if (item.type === 'subtotal') {
      lines.push(divider);
      lines.push(` ◇ SUBTOTAL             ${formattedVal}${label}`);
      lines.push(divider);
    } else if (item.type === 'total' || item.type === 'grand_total') {
      lines.push('==========================================');
      lines.push(` * TOTAL                ${formattedVal}${label}`);
      lines.push('==========================================');
    } else if (item.type === 'comment') {
      lines.push(`// ${item.label}`);
    } else {
      const stepStr = String(step++).padStart(3, ' ');
      const opStr = symbol.padEnd(2, ' ');
      lines.push(`${stepStr}  ${opStr} ${formattedVal.padStart(16, ' ')}${label}${balance}`);
    }
  });

  lines.push('');
  lines.push(`Printed from FolioCalc Paper Tape`);
  lines.push('==========================================');
  return lines.join('\n');
}

export function exportTapeToCSV(items: TapeLine[], settings: AppSettings): string {
  const rows: string[][] = [
    ['Step', 'Operator', 'Value', 'Label', 'Running Balance', 'Reconciled', 'Timestamp']
  ];

  let step = 1;
  items.forEach((item) => {
    rows.push([
      item.type === 'entry' ? String(step++) : item.type.toUpperCase(),
      `"${item.operator}"`,
      String(item.value),
      `"${(item.label || '').replace(/"/g, '""')}"`,
      String(item.runningBalance),
      item.isChecked ? 'YES' : 'NO',
      `"${item.timestamp}"`
    ]);
  });

  return rows.map((r) => r.join(',')).join('\n');
}
