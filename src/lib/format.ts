export function formatJPY(amount: number | null): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('ja-JP').format(amount);
}

export function formatUSD(amount: number | null): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export function formatKm(km: number | null): string {
  if (km == null) return '—';
  return new Intl.NumberFormat('en-US').format(km);
}

export const statusStyles: Record<string, string> = {
  Available: 'bg-green-50 text-status-success border-green-200',
  Reserved: 'bg-amber-50 text-status-warning border-amber-200',
  Sold: 'bg-red-50 text-status-danger border-red-200',
  'In Transit': 'bg-blue-50 text-status-info border-blue-200',
  Delivered: 'bg-green-50 text-status-success border-green-200',
};

export const statusDot: Record<string, string> = {
  Available: 'bg-status-success',
  Reserved: 'bg-status-warning',
  Sold: 'bg-status-danger',
  'In Transit': 'bg-status-info',
  Delivered: 'bg-status-success',
};
