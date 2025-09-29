/**
 * Calculates the number of weekdays between two dates (excluding weekends)
 * @param startDate The start date
 * @param endDate The end date
 * @returns The number of weekdays between the dates
 */
export const calculateDuration = (startDate: Date, endDate: Date): number => {
  let count = 0;
  const curDate = new Date(startDate.getTime());
  while (curDate <= endDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sunday (0) and Saturday (6)
      count++;
    }
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
}; 

export function calculateAge(dob: string | undefined | null): number | "" {
  if (!dob) return "";
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export const hasRealDate = (v?: string | null) => {
  if (!v) return false;
  const s = String(v).trim();
  if (!s || s === '0000-00-00') return false;
  const d = new Date(s);
  return !Number.isNaN(d.getTime());
};




/**
 * Calculates the date in UTC time
 * @param date The date to calculate
 * @returns The date in UTC time
 */
export function calculateDateInUTC(date: Date): Date {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
}

/**
 * Pluralizes a word based on the value
 * @param value The value to pluralize
 * @returns The pluralized word
 */
export function pluralize(value: number | undefined | null): string {
  if (value === undefined || value === null) return '';
  if (typeof(value) === 'number' && value > 1) return 's';
  return '';
}

/**
 * Returns the badge class based on the status
 * @param status The status
 * @returns The badge class
 */
export const getBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved': return 'badge-success';
    case 'rejected': return 'badge-error';
    case 'cancelled': return 'bg-neutral-content';
    default: return 'badge badge-warning';
  }
};

/**
 * Returns the date and time in the format of day/month/year hour:minute AM/PM
 * @param date The date to format
 * @returns The formatted date and time
 */
export const getDateAndTime = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};
