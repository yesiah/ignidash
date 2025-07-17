import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, fractionDigits: number = 2) {
  if (num >= 1000000000) return (num / 1000000000).toFixed(fractionDigits) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(fractionDigits) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(fractionDigits) + 'k';
  return num.toString();
}
