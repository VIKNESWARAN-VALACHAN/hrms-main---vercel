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
    // Asia
    'Asia/Kuala_Lumpur': 8, // Malaysia
    'Asia/Singapore': 8,    // Singapore
    'Asia/Dubai': 4,        // UAE
    'Asia/Tokyo': 9,        // Japan
    'Asia/Shanghai': 8,     // China
    'Asia/Seoul': 9,        // Korea
    
    // Europe
    'Europe/London': 0,     // UK (GMT/BST)
    'Europe/Paris': 1,      // France
    'Europe/Berlin': 1,     // Germany
    
    // Americas
    'America/New_York': -5, // US Eastern
    'America/Los_Angeles': -8, // US Pacific
    'America/Chicago': -6,  // US Central
    
    // Australia
    'Australia/Sydney': 10, // Australia
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

const formatDateOnly = (dateString: string): string => {
  const utcDate = new Date(dateString);
  const malaysiaTime = new Date(utcDate.getTime() + (8 * 60 * 60 * 1000));
  
  const year = malaysiaTime.getFullYear();
  const month = String(malaysiaTime.getMonth() + 1).padStart(2, '0');
  const day = String(malaysiaTime.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

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
