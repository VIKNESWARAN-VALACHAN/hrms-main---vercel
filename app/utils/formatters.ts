// utils/formatters.ts

export function formatDateTime(datetime: string): string {
  const date = new Date(datetime);
  return date.toLocaleString('en-MY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}


export function toDateInputString(date: string | undefined | null) {
  if (!date) return '';
  // Handles both "2025-07-01" and "2025-07-01T16:00:00.000Z"
  const d = new Date(date);
  // If already yyyy-mm-dd just return
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  if (!isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10); // "yyyy-mm-dd"
  }
  return '';
}


export function toDisplayDate(date: string | undefined | null) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  // pad with zero
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
