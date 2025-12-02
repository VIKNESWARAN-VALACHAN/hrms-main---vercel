// /**
//  * Calculates the number of weekdays between two dates (excluding weekends)
//  * @param startDate The start date
//  * @param endDate The end date
//  * @returns The number of weekdays between the dates
//  */
// export const calculateDuration_excludingWeekends2711 = (startDate: Date, endDate: Date): number => {
//   let count = 0;
//   const curDate = new Date(startDate.getTime());
//   while (curDate <= endDate) {
//     const dayOfWeek = curDate.getDay();
//     if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sunday (0) and Saturday (6)
//       count++;
//     }
//     curDate.setDate(curDate.getDate() + 1);
//   }
//   return count;
// }; 

// export const calculateDuration = (startDate: Date, endDate: Date): number => {
//   let count = 0;
//   const curDate = new Date(startDate.getTime());
//   while (curDate <= endDate) {
//     count++;
//     curDate.setDate(curDate.getDate() + 1);
//   }
//   return count;
// };

// export function calculateAge(dob: string | undefined | null): number | "" {
//   if (!dob) return "";
//   const birthDate = new Date(dob);
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const m = today.getMonth() - birthDate.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// }

// export const hasRealDate = (v?: string | null) => {
//   if (!v) return false;
//   const s = String(v).trim();
//   if (!s || s === '0000-00-00') return false;
//   const d = new Date(s);
//   return !Number.isNaN(d.getTime());
// };




// /**
//  * Calculates the date in UTC time
//  * @param date The date to calculate
//  * @returns The date in UTC time
//  */
// export function calculateDateInUTC(date: Date): Date {
//   return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
// }

// /**
//  * Pluralizes a word based on the value
//  * @param value The value to pluralize
//  * @returns The pluralized word
//  */
// export function pluralize(value: number | undefined | null): string {
//   if (value === undefined || value === null) return '';
//   if (typeof(value) === 'number' && value > 1) return 's';
//   return '';
// }

// /**
//  * Returns the badge class based on the status
//  * @param status The status
//  * @returns The badge class
//  */
// export const getBadgeClass = (status: string) => {
//   switch (status.toLowerCase()) {
//     case 'approved': return 'badge-success';
//     case 'rejected': return 'badge-error';
//     case 'cancelled': return 'bg-neutral-content';
//     default: return 'badge badge-warning';
//   }
// };

// /**
//  * Returns the date and time in the format of day/month/year hour:minute AM/PM
//  * @param date The date to format
//  * @returns The formatted date and time
//  */ 
// export const getDateAndTime = (date: string) => {
//   return new Date(date).toLocaleDateString('en-GB', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
//     hour: 'numeric',
//     minute: '2-digit',
//     hour12: true
//   });
// };


//0212

// /**
//  * Calculates the number of weekdays between two dates (excluding weekends)
//  * @param startDate The start date
//  * @param endDate The end date
//  * @returns The number of weekdays between the dates
//  */
// export const calculateDuration_excludingWeekends = (startDate: Date, endDate: Date): number => {
//   let count = 0;
//   const curDate = new Date(startDate.getTime());
//   while (curDate <= endDate) {
//     const dayOfWeek = curDate.getDay();
//     if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sunday (0) and Saturday (6)
//       count++;
//     }
//     curDate.setDate(curDate.getDate() + 1);
//   }
//   return count;
// }; 

// export const calculateDuration = (startDate: Date, endDate: Date): number => {
//   let count = 0;
//   const curDate = new Date(startDate.getTime());
//   while (curDate <= endDate) {
//     count++;
//     curDate.setDate(curDate.getDate() + 1);
//   }
//   return count;
// };

// export function calculateAge(dob: string | undefined | null): number | "" {
//   if (!dob) return "";
//   const birthDate = new Date(dob);
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const m = today.getMonth() - birthDate.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// }

// export const hasRealDate = (v?: string | null) => {
//   if (!v) return false;
//   const s = String(v).trim();
//   if (!s || s === '0000-00-00') return false;
//   const d = new Date(s);
//   return !Number.isNaN(d.getTime());
// };




// /**
//  * Calculates the date in UTC time
//  * @param date The date to calculate
//  * @returns The date in UTC time
//  */
// export function calculateDateInUTC(date: Date): Date {
//   return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
// }

// /**
//  * Pluralizes a word based on the value
//  * @param value The value to pluralize
//  * @returns The pluralized word
//  */
// export function pluralize(value: number | undefined | null): string {
//   if (value === undefined || value === null) return '';
//   if (typeof(value) === 'number' && value > 1) return 's';
//   return '';
// }

// /**
//  * Returns the badge class based on the status
//  * @param status The status
//  * @returns The badge class
//  */
// export const getBadgeClass = (status: string) => {
//   switch (status.toLowerCase()) {
//     case 'approved': return 'badge-success';
//     case 'rejected': return 'badge-error';
//     case 'cancelled': return 'bg-neutral-content';
//     default: return 'badge badge-warning';
//   }
// };

// /**
//  * Returns the date and time in the format of day/month/year hour:minute AM/PM
//  * @param date The date to format
//  * @returns The formatted date and time
//  */
// export const getDateAndTime = (date: string) => {
//   return new Date(date).toLocaleDateString('en-GB', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
//     hour: 'numeric',
//     minute: '2-digit',
//     hour12: true
//   });
// };


// utils/utils.ts
import { TimezoneHelper, formatToMalaysiaTime, formatToUserTimezone } from './timezoneHelper';

// Re-export timezone functions for backward compatibility
export { TimezoneHelper, formatToMalaysiaTime, formatToUserTimezone };

/**
 * Calculates the number of weekdays between two dates (excluding weekends)
 * @param startDate The start date
 * @param endDate The end date
 * @returns The number of weekdays between the dates
 */
export const calculateDuration_excludingWeekends = (startDate: Date, endDate: Date): number => {
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

/**
 * Calculates duration between two dates (including all days)
 * @param startDate The start date
 * @param endDate The end date
 * @returns The number of days between the dates
 */
export const calculateDuration = (startDate: Date, endDate: Date): number => {
  let count = 0;
  const curDate = new Date(startDate.getTime());
  while (curDate <= endDate) {
    count++;
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
};

/**
 * Enhanced calculateDuration with timezone support
 * @param startDate The start date
 * @param endDate The end date
 * @param timezone Timezone for calculation (default: Malaysia)
 * @returns The number of days between the dates in specified timezone
 */
export const calculateDurationWithTimezone = (
  startDate: Date, 
  endDate: Date, 
  timezone: string = 'Asia/Kuala_Lumpur'
): number => {
  const start = TimezoneHelper.convertUTCToTimezone(startDate, timezone);
  const end = TimezoneHelper.convertUTCToTimezone(endDate, timezone);
  
  let count = 0;
  const curDate = new Date(start.getTime());
  while (curDate <= end) {
    count++;
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
};

/**
 * Calculate age from date of birth
 * @param dob Date of birth string
 * @returns Age in years or empty string if invalid
 */
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

/**
 * Enhanced calculateAge with timezone support
 * @param dob Date of birth string
 * @param timezone Timezone for calculation (default: Malaysia)
 * @returns Age in years or empty string if invalid
 */
export function calculateAgeWithTimezone(
  dob: string | undefined | null, 
  timezone: string = 'Asia/Kuala_Lumpur'
): number | "" {
  if (!dob) return "";
  
  const birthDate = TimezoneHelper.convertUTCToTimezone(new Date(dob), timezone);
  const today = TimezoneHelper.getCurrentTimeInTimezone(timezone);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Check if a string represents a valid date
 * @param v Date string to check
 * @returns Boolean indicating if it's a valid date
 */
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
 * Enhanced UTC calculation with timezone conversion
 * @param date The date to calculate
 * @param fromTimezone Original timezone of the date (default: Malaysia)
 * @returns The date in UTC time
 */
export function calculateDateInUTCFromTimezone(
  date: Date, 
  fromTimezone: string = 'Asia/Kuala_Lumpur'
): Date {
  const localDate = TimezoneHelper.convertUTCToTimezone(date, fromTimezone);
  return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
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
 * @param timezone Timezone for formatting (default: Malaysia)
 * @returns The formatted date and time
 */
export const getDateAndTime = (date: string, timezone: string = 'Asia/Kuala_Lumpur'): string => {
  return TimezoneHelper.formatToSpecificTimezone(date, timezone);
};

/**
 * Legacy getDateAndTime - uses Malaysia timezone by default
 * @param date The date to format
 * @returns The formatted date and time in Malaysia timezone
 */
export const getDateAndTimeLegacy = (date: string): string => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Format date only (without time) in specific timezone
 * @param date The date to format
 * @param timezone Timezone for formatting (default: Malaysia)
 * @returns Formatted date string (YYYY-MM-DD)
 */
export const formatDateOnly = (date: string | Date, timezone: string = 'Asia/Kuala_Lumpur'): string => {
  return TimezoneHelper.formatDateOnly(date, timezone);
};


/**
 * Format date in "DD MMM YYYY" format (e.g., 29 Nov 2025) in specific timezone
 * @param date The date to format
 * @param timezone Timezone for formatting (default: Malaysia)
 * @returns Formatted date string (DD MMM YYYY)
 */
export const formatDateDDMMMYYYY = (date: string | Date, timezone: string = 'Asia/Kuala_Lumpur'): string => {
  if (!date) return '';
  
  const localDate = TimezoneHelper.convertUTCToTimezone(date, timezone);
  
  return localDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Check if a date is today in specific timezone
 * @param dateString The date to check
 * @param timezone Timezone for checking (default: Malaysia)
 * @returns Boolean indicating if the date is today
 */
export const isTodayInTimezone = (dateString: string | Date, timezone: string = 'Asia/Kuala_Lumpur'): boolean => {
  return TimezoneHelper.isTodayInTimezone(dateString, timezone);
};

/**
 * Get user's appropriate timezone based on role and country
 * @param userRole User role (admin, employee, etc.)
 * @param userCountry User's country
 * @returns Timezone string
 */
export const getUserTimezone = (userRole?: string, userCountry?: string): string => {
  return TimezoneHelper.getUserTimezone(userRole, userCountry);
};

/**
 * Get all available timezones for dropdowns
 * @returns Array of timezone options
 */
export const getAvailableTimezones = (): Array<{ value: string; label: string; offset: number }> => {
  return TimezoneHelper.getAvailableTimezones();
};
