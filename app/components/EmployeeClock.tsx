import * as React from 'react';
import { format, toZonedTime } from 'date-fns-tz';

// // export const EmployeeClock = () => {
// //   const [tz, setTz] = React.useState('');
// //   React.useEffect(() => {
// //     const zone = document.documentElement.getAttribute('data-employee-tz') || 'UTC';
// //     setTz(zone);
// //   }, []);

// //   const [time, setTime] = React.useState('');
// //   React.useEffect(() => {
// //     if (!tz) return;
// //     const tick = () => setTime(format(new Date(), 'EEEE, dd MMM yyyy ‑ hh:mm:ss a', { timeZone: tz }));
// //     tick();
// //     const id = setInterval(tick, 1000);
// //     return () => clearInterval(id);
// //   }, [tz]);

// //   return <span className="font-mono text-xs sm:text-sm">{time || <>&nbsp;</>}</span>;
// // };

// interface EmployeeClockProps {
//   showDate?: boolean;
// }

// export const EmployeeClock = ({ showDate = true }: EmployeeClockProps) => {
//   const [tz, setTz] = React.useState('');
//   React.useEffect(() => {
//     const zone = document.documentElement.getAttribute('data-employee-tz') || 'UTC';
//     setTz(zone);
//   }, []);

//   const [time, setTime] = React.useState('');
//   React.useEffect(() => {
//     if (!tz) return;
//     const formatString = showDate 
//       ? 'EEEE, dd MMM yyyy ‑ hh:mm:ss a' 
//       : 'hh:mm:ss a';
//     const tick = () => setTime(format(new Date(), formatString, { timeZone: tz }));
//     tick();
//     const id = setInterval(tick, 1000);
//     return () => clearInterval(id);
//   }, [tz, showDate]);

//   return <span className="font-mono text-xs sm:text-sm">{time || <>&nbsp;</>}</span>;
// };

interface EmployeeClockProps {
  showDate?: boolean;
  timeZone?: string; // Add timeZone prop
}

export const EmployeeClock = ({ showDate = true, timeZone }: EmployeeClockProps) => {
  const [currentTime, setCurrentTime] = React.useState<Date>(new Date());
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Use the provided timeZone or fallback to Singapore
  const effectiveTimeZone = timeZone || '';// || 'Asia/Singapore';
  
  const formatString = showDate 
    ? 'EEEE, dd MMM yyyy ‑ hh:mm:ss a' 
    : 'hh:mm:ss a';
  
  const formattedTime = format(toZonedTime(currentTime, effectiveTimeZone), formatString);

  return <span className="font-mono text-xs sm:text-sm">{formattedTime}</span>;
};