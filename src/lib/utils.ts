import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number in Indian numbering system (lakhs/crores)
 * @example formatINR(500000) → "₹5,00,000"
 */
export function formatINR(amount: number, locale: 'en' | 'hi' = 'en'): string {
  return new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a cost range for display
 * @example formatCostRange(15000, 200000, 'en') → "₹15,000 – ₹2,00,000"
 */
export function formatCostRange(min: number, max: number, locale: 'en' | 'hi' = 'en'): string {
  if (min === max) return formatINR(min, locale);
  return `${formatINR(min, locale)} – ${formatINR(max, locale)}`;
}

/**
 * Get the door status badge CSS class
 */
export function getDoorBadgeClass(status: string): string {
  const map: Record<string, string> = {
    open: 'door-badge-open',
    conditional: 'door-badge-conditional',
    harder: 'door-badge-harder',
    closed: 'door-badge-closed',
    reopenable: 'door-badge-reopenable',
    unverified: 'door-badge-unverified',
  };
  return map[status] ?? 'door-badge-unverified';
}
