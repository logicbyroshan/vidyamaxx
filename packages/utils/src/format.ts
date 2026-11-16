/**
 * @vidyafloww/utils — Formatting Utilities
 */

/**
 * Format currency with locale and symbol (defaults to INR / ₹)
 */
export function formatCurrency(
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string {
  if (isNaN(amount)) return '₹0.00';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format standard percentage (e.g. 98.4%)
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format numbers with Indian / standard thousand grouping
 */
export function formatNumber(value: number, locale: string = 'en-IN'): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format date into readable string (e.g., "15 Aug 2026")
 */
export function formatDate(
  date: string | number | Date,
  options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' },
  locale: string = 'en-IN'
): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    if (isNaN(d.getTime())) return String(date);
    return new Intl.DateTimeFormat(locale, options).format(d);
  } catch {
    return String(date);
  }
}
