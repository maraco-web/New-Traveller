import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, differenceInDays, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'TWD'): string {
  const symbols: Record<string, string> = {
    TWD: 'NT$',
    USD: '$',
    JPY: '¥',
    EUR: '€',
    GBP: '£',
    KRW: '₩',
    THB: '฿',
    SGD: 'S$',
    HKD: 'HK$',
  };
  const symbol = symbols[currency] || currency;
  return `${symbol}${amount.toLocaleString()}`;
}

export function formatDate(date: Date | string, fmt: string = 'MMM dd, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, fmt);
}

export function getTripDuration(start: Date | string, end: Date | string): number {
  const s = typeof start === 'string' ? parseISO(start) : start;
  const e = typeof end === 'string' ? parseISO(end) : end;
  return differenceInDays(e, s) + 1;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    planning: 'bg-blue-100 text-blue-700',
    upcoming: 'bg-yellow-100 text-yellow-700',
    ongoing: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    transport: '✈️',
    accommodation: '🏨',
    food: '🍽️',
    activity: '🎯',
    sightseeing: '🏛️',
    rest: '😴',
  };
  return icons[type] || '📍';
}

export const CURRENCIES = [
  { code: 'TWD', name: '新台幣', symbol: 'NT$' },
  { code: 'USD', name: '美元', symbol: '$' },
  { code: 'JPY', name: '日圓', symbol: '¥' },
  { code: 'EUR', name: '歐元', symbol: '€' },
  { code: 'GBP', name: '英鎊', symbol: '£' },
  { code: 'KRW', name: '韓元', symbol: '₩' },
  { code: 'THB', name: '泰銖', symbol: '฿' },
  { code: 'SGD', name: '新加坡幣', symbol: 'S$' },
  { code: 'HKD', name: '港幣', symbol: 'HK$' },
];

export const EXCHANGE_RATES: Record<string, number> = {
  TWD: 1,
  USD: 32.5,
  JPY: 0.22,
  EUR: 35.2,
  GBP: 41.0,
  KRW: 0.024,
  THB: 0.9,
  SGD: 24.0,
  HKD: 4.15,
};

export function convertToTWD(amount: number, currency: string): number {
  return amount * (EXCHANGE_RATES[currency] || 1);
}
