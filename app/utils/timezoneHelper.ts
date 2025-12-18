// // utils/timezoneHelper.ts
// export interface TimezoneConfig {
//   malaysia: string;
//   dubai: string;
//   london: string;
//   newyork: string;
//   singapore: string;
//   tokyo: string;
//   [key: string]: string;
// }

// export class TimezoneHelper {
//   private static timezoneOffsets: Record<string, number> = {
//     // Asia
//     'Asia/Kuala_Lumpur': 8, // Malaysia
//     'Asia/Singapore': 8,    // Singapore
//     'Asia/Dubai': 4,        // UAE
//     'Asia/Tokyo': 9,        // Japan
//     'Asia/Shanghai': 8,     // China
//     'Asia/Seoul': 9,        // Korea
    
//     // Europe
//     'Europe/London': 0,     // UK (GMT/BST)
//     'Europe/Paris': 1,      // France
//     'Europe/Berlin': 1,     // Germany
    
//     // Americas
//     'America/New_York': -5, // US Eastern
//     'America/Los_Angeles': -8, // US Pacific
//     'America/Chicago': -6,  // US Central
    
//     // Australia
//     'Australia/Sydney': 10, // Australia
//   };

//   static convertUTCToTimezone(utcDateString: string | Date, timezone: string = 'Asia/Kuala_Lumpur'): Date {
//     if (!utcDateString) return new Date();
    
//     const utcDate = new Date(utcDateString);
//     const offsetHours = this.timezoneOffsets[timezone] || 0;
    
//     return new Date(utcDate.getTime() + (offsetHours * 60 * 60 * 1000));
//   }

//   static formatToMalaysiaTime(utcDateString: string | Date): string {
//     return this.formatToSpecificTimezone(utcDateString, 'Asia/Kuala_Lumpur');
//   }

//   static formatToSpecificTimezone(utcDateString: string | Date, timezone: string = 'Asia/Kuala_Lumpur'): string {
//     if (!utcDateString) return '';
    
//     const localDate = this.convertUTCToTimezone(utcDateString, timezone);
    
//     const year = localDate.getFullYear();
//     const month = String(localDate.getMonth() + 1).padStart(2, '0');
//     const day = String(localDate.getDate()).padStart(2, '0');
//     const hour = localDate.getHours();
//     const minute = String(localDate.getMinutes()).padStart(2, '0');
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const hour12 = hour % 12 || 12;
    
//     return `${year}-${month}-${day} ${hour12}:${minute}${ampm}`;
//   }

//   static formatDateOnly(utcDateString: string | Date, timezone: string = 'Asia/Kuala_Lumpur'): string {
//     if (!utcDateString) return '';
    
//     const localDate = this.convertUTCToTimezone(utcDateString, timezone);
    
//     const year = localDate.getFullYear();
//     const month = String(localDate.getMonth() + 1).padStart(2, '0');
//     const day = String(localDate.getDate()).padStart(2, '0');
    
//     return `${year}-${month}-${day}`;
//   }

//   static getUserTimezone(userRole?: string, userCountry?: string): string {
//     if (userRole === 'admin' || !userRole) {
//       return 'Asia/Kuala_Lumpur';
//     }
    
//     if (userCountry) {
//       const countryTimezoneMap: Record<string, string> = {
//         'Malaysia': 'Asia/Kuala_Lumpur',
//         'Singapore': 'Asia/Singapore',
//         'UAE': 'Asia/Dubai',
//         'Japan': 'Asia/Tokyo',
//         'UK': 'Europe/London',
//         'USA': 'America/New_York',
//       };
      
//       return countryTimezoneMap[userCountry] || 'Asia/Kuala_Lumpur';
//     }
    
//     return 'Asia/Kuala_Lumpur';
//   }

//   static getCurrentTimeInTimezone(timezone: string = 'Asia/Kuala_Lumpur'): Date {
//     const now = new Date();
//     return this.convertUTCToTimezone(now, timezone);
//   }

//   static calculateDurationInTimezone(
//     startDate: string | Date, 
//     endDate: string | Date, 
//     timezone: string = 'Asia/Kuala_Lumpur'
//   ): number {
//     const start = this.convertUTCToTimezone(startDate, timezone);
//     const end = this.convertUTCToTimezone(endDate, timezone);
    
//     const diffTime = Math.abs(end.getTime() - start.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     return diffDays;
//   }

//   static isTodayInTimezone(dateString: string | Date, timezone: string = 'Asia/Kuala_Lumpur'): boolean {
//     const inputDate = this.convertUTCToTimezone(dateString, timezone);
//     const today = this.getCurrentTimeInTimezone(timezone);
    
//     return (
//       inputDate.getDate() === today.getDate() &&
//       inputDate.getMonth() === today.getMonth() &&
//       inputDate.getFullYear() === today.getFullYear()
//     );
//   }

//   static getAvailableTimezones(): Array<{ value: string; label: string; offset: number }> {
//     return Object.entries(this.timezoneOffsets).map(([timezone, offset]) => ({
//       value: timezone,
//       label: `${timezone.split('/')[1]} (UTC${offset >= 0 ? '+' : ''}${offset})`,
//       offset
//     })).sort((a, b) => b.offset - a.offset);
//   }
// }

// const formatDateOnly = (dateString: string): string => {
//   const utcDate = new Date(dateString);
//   const malaysiaTime = new Date(utcDate.getTime() + (8 * 60 * 60 * 1000));
  
//   const year = malaysiaTime.getFullYear();
//   const month = String(malaysiaTime.getMonth() + 1).padStart(2, '0');
//   const day = String(malaysiaTime.getDate()).padStart(2, '0');
  
//   return `${year}-${month}-${day}`;
// };

// export const formatToMalaysiaTime = (utcDateString: string | Date): string => {
//   return TimezoneHelper.formatToMalaysiaTime(utcDateString);
// };

// export const formatToUserTimezone = (utcDateString: string | Date, userRole?: string, userCountry?: string): string => {
//   const timezone = TimezoneHelper.getUserTimezone(userRole, userCountry);
//   return TimezoneHelper.formatToSpecificTimezone(utcDateString, timezone);
// };

// export const getMalaysiaTime = (utcDateString: string | Date): Date => {
//   return TimezoneHelper.convertUTCToTimezone(utcDateString, 'Asia/Kuala_Lumpur');
// };

// export const formatDateOnlyMalaysia = (utcDateString: string | Date): string => {
//   return TimezoneHelper.formatDateOnly(utcDateString, 'Asia/Kuala_Lumpur');
// };


// export const formatDateReadable = (utcDateString: string | Date): string => {
//   const localDate = TimezoneHelper.convertUTCToTimezone(utcDateString, 'Asia/Kuala_Lumpur');
//   return localDate.toLocaleDateString('en-GB', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric'
//   });
// };


// utils/timezoneHelper.ts
export interface TimezoneConfig {
  malaysia: string;
  dubai: string;
  london: string;
  newyork: string;
  singapore: string;
  tokyo: string;
  [key: string]: string;
}

export class TimezoneHelper {
  private static timezoneOffsets: Record<string, number> = {
           // Asia - Added more Indonesian timezones
        'Asia/Kuala_Lumpur': 8,
        'Asia/Singapore': 8,
        'Asia/Dubai': 4,
        'Asia/Tokyo': 9,
        'Asia/Shanghai': 8,
        'Asia/Seoul': 9,
        'Asia/Bangkok': 7,
        'Asia/Jakarta': 7,
        'Asia/Jayapura': 9, // Added - Papua, Indonesia (UTC+9)
        'Asia/Makassar': 8, // Added - Central Indonesia (UTC+8)
        'Asia/Manila': 8,
        'Asia/Hong_Kong': 8,
        'Asia/Taipei': 8,
        'Asia/Kolkata': 5.5,
        'Asia/Karachi': 5,
        'Asia/Dhaka': 6,
        'Asia/Riyadh': 3,
        'Asia/Tehran': 3.5,
        'Asia/Jerusalem': 2,
        'Asia/Saigon': 7, // Added - Vietnam (Ho Chi Minh City)
        'Asia/Ho_Chi_Minh': 7, // Added - Alternative for Vietnam
        'Asia/Hanoi': 7, // Added - Vietnam
        'Asia/Yangon': 6.5, // Added - Myanmar
        'Asia/Colombo': 5.5, // Added - Sri Lanka
        'Asia/Kathmandu': 5.75, // Added - Nepal
        'Asia/Calcutta': 5.5, // Added - Alternative for India
        'Asia/Brunei': 8, // Added - Brunei
        'Asia/Ulaanbaatar': 8, // Added - Mongolia
        
        // Europe
        'Europe/London': 0,
        'Europe/Paris': 1,
        'Europe/Berlin': 1,
        'Europe/Madrid': 1,
        'Europe/Rome': 1,
        'Europe/Amsterdam': 1,
        'Europe/Brussels': 1,
        'Europe/Zurich': 1,
        'Europe/Vienna': 1,
        'Europe/Prague': 1,
        'Europe/Warsaw': 1,
        'Europe/Stockholm': 1,
        'Europe/Oslo': 1,
        'Europe/Helsinki': 2,
        'Europe/Moscow': 3,
        'Europe/Istanbul': 3,
        'Europe/Athens': 2,
        'Europe/Lisbon': 0,
        'Europe/Dublin': 0, // Added - Ireland
        'Europe/Budapest': 1, // Added - Hungary
        'Europe/Bucharest': 2, // Added - Romania
        'Europe/Sofia': 2, // Added - Bulgaria
        
        // Americas
        'America/New_York': -5,
        'America/Los_Angeles': -8,
        'America/Chicago': -6,
        'America/Denver': -7,
        'America/Phoenix': -7,
        'America/Anchorage': -9,
        'America/Honolulu': -10,
        'America/Toronto': -5,
        'America/Vancouver': -8,
        'America/Mexico_City': -6,
        'America/Sao_Paulo': -3,
        'America/Buenos_Aires': -3,
        'America/Santiago': -4,
        'America/Bogota': -5,
        'America/Lima': -5,
        'America/Caracas': -4,
        'America/Montevideo': -3, // Added - Uruguay
        'America/Asuncion': -4, // Added - Paraguay (-3 in summer)
        'America/La_Paz': -4, // Added - Bolivia
        'America/Manaus': -4, // Added - Brazil (Amazon time)
        'America/Bahia': -3, // Added - Brazil
        'America/Argentina/Buenos_Aires': -3, // Added - Alternative
        
        // Australia/Oceania
        'Australia/Sydney': 10,
        'Australia/Melbourne': 10,
        'Australia/Brisbane': 10,
        'Australia/Adelaide': 9.5,
        'Australia/Perth': 8,
        'Australia/Darwin': 9.5,
        'Pacific/Auckland': 12,
        'Pacific/Fiji': 12,
        'Pacific/Guam': 10, // Added
        'Pacific/Port_Moresby': 10, // Added - Papua New Guinea
        'Pacific/Noumea': 11, // Added - New Caledonia
        'Pacific/Tahiti': -10, // Added - French Polynesia
        
        // Africa
        'Africa/Cairo': 2,
        'Africa/Johannesburg': 2,
        'Africa/Lagos': 1,
        'Africa/Nairobi': 3,
        'Africa/Casablanca': 0,
        'Africa/Tunis': 1,
        'Africa/Accra': 0,
        'Africa/Addis_Ababa': 3, // Added - Ethiopia
        'Africa/Algiers': 1, // Added - Algeria
        'Africa/Dar_es_Salaam': 3, // Added - Tanzania
        'Africa/Khartoum': 2, // Added - Sudan
        'Africa/Kampala': 3, // Added - Uganda
  };

  static convertUTCToTimezone(utcDateString: string | Date, timezone: string = 'Asia/Kuala_Lumpur'): Date {
    if (!utcDateString) return new Date();
    
    const utcDate = new Date(utcDateString);
    const offsetHours = this.timezoneOffsets[timezone] || 0;
    
    return new Date(utcDate.getTime() + (offsetHours * 60 * 60 * 1000));
  }

  static formatToMalaysiaTime(utcDateString: string | Date): string {
    return this.formatToSpecificTimezone(utcDateString, 'Asia/Kuala_Lumpur');
  }

  static formatToSpecificTimezone(utcDateString: string | Date, timezone: string = 'Asia/Kuala_Lumpur'): string {
    if (!utcDateString) return '';
    
    const localDate = this.convertUTCToTimezone(utcDateString, timezone);
    
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    const hour = localDate.getHours();
    const minute = String(localDate.getMinutes()).padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${year}-${month}-${day} ${hour12}:${minute}${ampm}`;
  }

  static formatDateOnly(utcDateString: string | Date, timezone: string = 'Asia/Kuala_Lumpur'): string {
    if (!utcDateString) return '';
    
    const localDate = this.convertUTCToTimezone(utcDateString, timezone);
    
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  static getUserTimezone(userRole?: string, userCountry?: string): string {
    if (userRole === 'admin' || !userRole) {
      return 'Asia/Kuala_Lumpur';
    }
    
    if (userCountry) {
      const countryTimezoneMap: Record<string, string> = {
        'Malaysia': 'Asia/Kuala_Lumpur',
        'Singapore': 'Asia/Singapore',
        'UAE': 'Asia/Dubai',
        'Japan': 'Asia/Tokyo',
        'UK': 'Europe/London',
        'USA': 'America/New_York',
      };
      
      return countryTimezoneMap[userCountry] || 'Asia/Kuala_Lumpur';
    }
    
    return 'Asia/Kuala_Lumpur';
  }

  static getCurrentTimeInTimezone(timezone: string = 'Asia/Kuala_Lumpur'): Date {
    const now = new Date();
    return this.convertUTCToTimezone(now, timezone);
  }

  static calculateDurationInTimezone(
    startDate: string | Date, 
    endDate: string | Date, 
    timezone: string = 'Asia/Kuala_Lumpur'
  ): number {
    const start = this.convertUTCToTimezone(startDate, timezone);
    const end = this.convertUTCToTimezone(endDate, timezone);
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  static isTodayInTimezone(dateString: string | Date, timezone: string = 'Asia/Kuala_Lumpur'): boolean {
    const inputDate = this.convertUTCToTimezone(dateString, timezone);
    const today = this.getCurrentTimeInTimezone(timezone);
    
    return (
      inputDate.getDate() === today.getDate() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getFullYear() === today.getFullYear()
    );
  }

  static getAvailableTimezones(): Array<{ value: string; label: string; offset: number }> {
    return Object.entries(this.timezoneOffsets).map(([timezone, offset]) => ({
      value: timezone,
      label: `${timezone.split('/')[1]} (UTC${offset >= 0 ? '+' : ''}${offset})`,
      offset
    })).sort((a, b) => b.offset - a.offset);
  }
}

export const formatToMalaysiaTime = (utcDateString: string | Date): string => {
  return TimezoneHelper.formatToMalaysiaTime(utcDateString);
};

export const formatToUserTimezone = (utcDateString: string | Date, userRole?: string, userCountry?: string): string => {
  const timezone = TimezoneHelper.getUserTimezone(userRole, userCountry);
  return TimezoneHelper.formatToSpecificTimezone(utcDateString, timezone);
};

export const getMalaysiaTime = (utcDateString: string | Date): Date => {
  return TimezoneHelper.convertUTCToTimezone(utcDateString, 'Asia/Kuala_Lumpur');
};

export const formatDateOnlyMalaysia = (utcDateString: string | Date): string => {
  return TimezoneHelper.formatDateOnly(utcDateString, 'Asia/Kuala_Lumpur');
};


export const formatDateReadable = (utcDateString: string | Date): string => {
  const localDate = TimezoneHelper.convertUTCToTimezone(utcDateString, 'Asia/Kuala_Lumpur');
  return localDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

