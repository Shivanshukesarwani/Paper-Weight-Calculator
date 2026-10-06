import { ScratchpadLineResult } from '../types';

interface Scope {
  [key: string]: number;
}

export function parseScratchpad(text: string, currencySymbol = '$'): ScratchpadLineResult[] {
  const lines = text.split('\n');
  const scope: Scope = {};
  const previousValues: number[] = [];
  let lastEvaluatedValue = 0;

  return lines.map((rawLine, idx): ScratchpadLineResult => {
    const trimmed = rawLine.trim();

    // Empty line
    if (!trimmed) {
      return {
        lineNumber: idx + 1,
        rawText: rawLine,
        isComment: false,
        isHeading: false,
        hasError: false,
      };
    }

    // Markdown Heading: # Title or ## Subtitle
    if (trimmed.startsWith('#')) {
      return {
        lineNumber: idx + 1,
        rawText: rawLine,
        isComment: true,
        isHeading: true,
        hasError: false,
      };
    }

    // Single-line comment: // or --
    if (trimmed.startsWith('//') || trimmed.startsWith('--')) {
      return {
        lineNumber: idx + 1,
        rawText: rawLine,
        isComment: true,
        isHeading: false,
        hasError: false,
      };
    }

    // Check if line is variable assignment: identifier = expression
    let varName: string | undefined;
    let expr = trimmed;

    // Split on first '=' that isn't == or != or <= or >=
    const equalMatch = trimmed.match(/^([a-zA-Z_\u00C0-\u017F][a-zA-Z0-9_\s\u00C0-\u017F]*?)\s*=\s*(.+)$/);
    if (equalMatch && !equalMatch[1].includes('==') && !equalMatch[1].includes('!=')) {
      varName = sanitizeVariableName(equalMatch[1]);
      expr = equalMatch[2];
    }

    // Safe evaluate expression
    const evalResult = evaluateExpression(expr, scope, lastEvaluatedValue, previousValues);

    if (evalResult.error) {
      // If it looks like plain conversational text or note without math, treat as comment instead of jarring error
      const isLikelyNote = !containsMathOperator(trimmed) && !/^\d/.test(trimmed) && !varName;
      if (isLikelyNote) {
        return {
          lineNumber: idx + 1,
          rawText: rawLine,
          isComment: true,
          isHeading: false,
          hasError: false,
        };
      }

      return {
        lineNumber: idx + 1,
        rawText: rawLine,
        isComment: false,
        isHeading: false,
        hasError: true,
        errorMessage: evalResult.error,
        variableName: varName,
      };
    }

    const value = evalResult.value;
    lastEvaluatedValue = value;
    previousValues.push(value);

    if (varName) {
      scope[varName] = value;
      // also normalize without spaces and lowercase
      scope[varName.toLowerCase()] = value;
      scope[varName.replace(/\s+/g, '')] = value;
      scope[varName.replace(/\s+/g, '_')] = value;
      scope[varName.replace(/\s+/g, '_').toLowerCase()] = value;
    }

    // Format output
    const formatted = formatScratchpadValue(value, currencySymbol);

    return {
      lineNumber: idx + 1,
      rawText: rawLine,
      isComment: false,
      isHeading: false,
      hasError: false,
      variableName: varName,
      value,
      formattedResult: formatted,
    };
  });
}

function containsMathOperator(str: string): boolean {
  return /[\+\-\*\/\^\%=\<\>]/.test(str) || /\b(sum|total|avg|average|prev|ans|of|off|tax)\b/i.test(str);
}

function sanitizeVariableName(raw: string): string {
  return raw.trim().replace(/^[^a-zA-Z_]+/, '');
}

function formatScratchpadValue(val: number, currency = '$'): string {
  if (isNaN(val) || !isFinite(val)) return 'NaN';
  const abs = Math.abs(val);
  const formatted = abs.toLocaleString(undefined, {
    minimumFractionDigits: Number.isInteger(abs) ? 0 : 2,
    maximumFractionDigits: 4,
  });

  const sign = val < 0 ? '-' : '';
  return `${sign}${currency}${formatted}`;
}

interface EvalResult {
  value: number;
  error?: string;
}

function evaluateExpression(
  exprStr: string,
  scope: Scope,
  lastVal: number,
  prevValues: number[]
): EvalResult {
  let cleaned = exprStr.trim();

  // Strip trailing notes/annotations like "Rent: $1,200 (includes water)"
  cleaned = cleaned.replace(/\/\*.*?\*\//g, '');
  cleaned = cleaned.replace(/\/\/.*$/, '');

  // Handle special functions: sum or total
  if (/^(sum|total)(\(\))?$/i.test(cleaned)) {
    const sum = prevValues.reduce((acc, curr) => acc + curr, 0);
    return { value: sum };
  }

  // Handle average / avg
  if (/^(avg|average)(\(\))?$/i.test(cleaned)) {
    if (prevValues.length === 0) return { value: 0 };
    const avg = prevValues.reduce((acc, curr) => acc + curr, 0) / prevValues.length;
    return { value: avg };
  }

  // Handle "X% of Y" pattern: e.g. "15% of 2400" or "8.5% of total"
  const ofMatch = cleaned.match(/^([\d\.]+)\s*%\s+of\s+(.+)$/i);
  if (ofMatch) {
    const percent = parseFloat(ofMatch[1]);
    const targetExpr = ofMatch[2];
    const subEval = evaluateExpression(targetExpr, scope, lastVal, prevValues);
    if (subEval.error) return subEval;
    return { value: (percent / 100) * subEval.value };
  }

  // Handle "X + Y% tax" or "X + Y%" pattern: e.g. "100 + 8.25%"
  const plusPercentMatch = cleaned.match(/^(.+?)\s*\+\s*([\d\.]+)\s*%\s*(tax)?$/i);
  if (plusPercentMatch) {
    const baseExpr = plusPercentMatch[1];
    const pct = parseFloat(plusPercentMatch[2]);
    const baseEval = evaluateExpression(baseExpr, scope, lastVal, prevValues);
    if (baseEval.error) return baseEval;
    return { value: baseEval.value * (1 + pct / 100) };
  }

  // Handle "X - Y% discount" or "X - Y%" pattern: e.g. "120 - 20%"
  const minusPercentMatch = cleaned.match(/^(.+?)\s*\-\s*([\d\.]+)\s*%\s*(discount|off)?$/i);
  if (minusPercentMatch) {
    const baseExpr = minusPercentMatch[1];
    const pct = parseFloat(minusPercentMatch[2]);
    const baseEval = evaluateExpression(baseExpr, scope, lastVal, prevValues);
    if (baseEval.error) return baseEval;
    return { value: baseEval.value * (1 - pct / 100) };
  }

  // Replace words 'prev' or 'ans' with last value
  cleaned = cleaned.replace(/\b(prev|ans)\b/gi, String(lastVal));

  // Replace 'sum' or 'total' inside expressions with sum of prevValues
  if (/\b(sum|total)\b/i.test(cleaned)) {
    const sumVal = prevValues.reduce((a, b) => a + b, 0);
    cleaned = cleaned.replace(/\b(sum|total)\b/gi, String(sumVal));
  }

  // Strip common currency symbols: $, €, £, ¥, ₹
  cleaned = cleaned.replace(/[\$\€\£\¥\₹]/g, '');

  // Strip unit words after numbers: e.g. "140 hrs * 85 / hr" -> "140 * 85 / 1"
  cleaned = cleaned.replace(/(\d+)\s*(hrs?|hours?|days?|months?|weeks?|mins?|minutes?|secs?|seconds?|kg|lbs?|meters?|cm|km|miles?|units?|items?|users?|seats?|mo|yr|k)\b/gi, (_, num, unit) => {
    if (unit.toLowerCase() === 'k') {
      return String(parseFloat(num) * 1000);
    }
    return num;
  });
  cleaned = cleaned.replace(/\/\s*(hr|hour|day|month|week|min|sec|kg|lb|user|seat|unit)\b/gi, '/ 1');

  // Replace variable identifiers from scope
  // Sort keys by descending length so "monthly_income" gets replaced before "income"
  const keys = Object.keys(scope).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    if (regex.test(cleaned)) {
      cleaned = cleaned.replace(regex, `(${scope[k]})`);
    }
  }

  // Handle percentage sign directly e.g. "500 * 20%" -> "500 * 0.2"
  cleaned = cleaned.replace(/([\d\.]+)\s*%/g, '($1 / 100)');

  // Safely evaluate math expression
  try {
    const evaluated = safeMathEvaluate(cleaned);
    if (typeof evaluated !== 'number' || isNaN(evaluated) || !isFinite(evaluated)) {
      return { value: 0, error: 'Invalid expression' };
    }
    return { value: evaluated };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Evaluation error';
    return { value: 0, error: msg };
  }
}

/**
 * Safe math expression evaluator supporting +, -, *, /, ^, parentheses, and Math functions.
 * No arbitrary JS execution or eval of objects/functions.
 */
function safeMathEvaluate(expr: string): number {
  // Allow only math symbols, digits, parentheses, decimal points, and allowed math functions
  const sanitized = expr.replace(/\s+/g, '');
  if (!sanitized) return 0;

  // Verify that only valid characters exist
  const validCharsRegex = /^[0-9\+\-\*\/\^\(\)\.\,]|(sqrt|round|floor|ceil|abs|min|max|pow|sin|cos|tan|log|exp|PI|E)/;
  
  // Custom tokenizer and recursive descent parser
  const parser = new MathParser(sanitized);
  return parser.parse();
}

class MathParser {
  private pos = 0;
  private str: string;

  constructor(str: string) {
    this.str = str;
  }

  parse(): number {
    const result = this.parseExpression();
    if (this.pos < this.str.length) {
      throw new Error(`Unexpected character '${this.str[this.pos]}'`);
    }
    return result;
  }

  private parseExpression(): number {
    let result = this.parseTerm();

    while (this.pos < this.str.length) {
      const char = this.str[this.pos];
      if (char === '+') {
        this.pos++;
        result += this.parseTerm();
      } else if (char === '-') {
        this.pos++;
        result -= this.parseTerm();
      } else {
        break;
      }
    }

    return result;
  }

  private parseTerm(): number {
    let result = this.parseFactor();

    while (this.pos < this.str.length) {
      const char = this.str[this.pos];
      if (char === '*') {
        this.pos++;
        result *= this.parseFactor();
      } else if (char === '/') {
        this.pos++;
        const divisor = this.parseFactor();
        if (divisor === 0) throw new Error('Division by zero');
        result /= divisor;
      } else {
        break;
      }
    }

    return result;
  }

  private parseFactor(): number {
    let result = this.parsePrimary();

    while (this.pos < this.str.length && this.str[this.pos] === '^') {
      this.pos++;
      const exponent = this.parsePrimary();
      result = Math.pow(result, exponent);
    }

    return result;
  }

  private parsePrimary(): number {
    if (this.pos >= this.str.length) {
      throw new Error('Unexpected end of line');
    }

    const char = this.str[this.pos];

    // Unary plus or minus
    if (char === '+') {
      this.pos++;
      return this.parsePrimary();
    }
    if (char === '-') {
      this.pos++;
      return -this.parsePrimary();
    }

    // Parentheses
    if (char === '(') {
      this.pos++;
      const val = this.parseExpression();
      if (this.pos >= this.str.length || this.str[this.pos] !== ')') {
        throw new Error('Unclosed parenthesis');
      }
      this.pos++;
      return val;
    }

    // Math functions
    const funcMatch = this.str.slice(this.pos).match(/^(sqrt|round|floor|ceil|abs|min|max|pow|sin|cos|tan|log|exp)\(/i);
    if (funcMatch) {
      const funcName = funcMatch[1].toLowerCase();
      this.pos += funcMatch[0].length;
      const args: number[] = [];

      if (this.str[this.pos] !== ')') {
        while (true) {
          args.push(this.parseExpression());
          if (this.str[this.pos] === ',') {
            this.pos++;
          } else {
            break;
          }
        }
      }

      if (this.str[this.pos] !== ')') {
        throw new Error(`Expected ')' after ${funcName}`);
      }
      this.pos++;

      switch (funcName) {
        case 'sqrt': return Math.sqrt(args[0]);
        case 'round': return Math.round(args[0]);
        case 'floor': return Math.floor(args[0]);
        case 'ceil': return Math.ceil(args[0]);
        case 'abs': return Math.abs(args[0]);
        case 'min': return Math.min(...args);
        case 'max': return Math.max(...args);
        case 'pow': return Math.pow(args[0], args[1] ?? 1);
        case 'sin': return Math.sin(args[0]);
        case 'cos': return Math.cos(args[0]);
        case 'tan': return Math.tan(args[0]);
        case 'log': return Math.log(args[0]);
        case 'exp': return Math.exp(args[0]);
        default: return args[0];
      }
    }

    // Number
    const numMatch = this.str.slice(this.pos).match(/^(\d+(\.\d+)?|\.\d+)/);
    if (numMatch) {
      this.pos += numMatch[0].length;
      return parseFloat(numMatch[0]);
    }

    throw new Error(`Unknown token near '${this.str.slice(this.pos, this.pos + 8)}'`);
  }
}
