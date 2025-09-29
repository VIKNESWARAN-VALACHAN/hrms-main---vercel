'use client';

import { toZonedTime } from 'date-fns-tz';

// Singapore timezone
const timeZone = 'Asia/Singapore';

// Function to convert date to Singapore timezone
const toSingaporeTime = (date: Date): Date => {
  return toZonedTime(date, timeZone);
};

export default toSingaporeTime;
