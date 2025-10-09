// 'use client';

// import { useState, useEffect, useRef , useCallback } from 'react';
// import { differenceInMilliseconds } from 'date-fns';
// import { toZonedTime } from 'date-fns-tz';
// import { useTheme } from './ThemeProvider';

// // Singapore timezone
// const timeZone = 'Asia/Seoul';//'Asia/Singapore';

// // Convert date to Singapore timezone
// const toSingaporeTime = (date: Date | null): Date | null => {
//   if (!date) return null;
//   return toZonedTime(date, timeZone);
// };

// export interface Session {
//   id?: string;
//   checkIn: Date | null;
//   checkOut: Date | null;
// }

// interface WorkingTimeCounterProps {
//   sessions: Session[];
//   isCheckedIn: boolean;
//   className?: string;
//   displayFormat?: 'digital' | 'compact' | 'verbose';
// }

// /**
//  * Component that calculates and displays total working time
//  * Uses setInterval for reliable updates in production
//  */
// const WorkingTimeCounter: React.FC<WorkingTimeCounterProps> = ({
//   sessions,
//   isCheckedIn,
//   className = '',
//   displayFormat = 'digital',
// }) => {
//   const { theme } = useTheme();

//   const [displayTime, setDisplayTime] = useState<string>('00:00:00');
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   // Calculate total working time across all sessions
//   const calculateTotalWorkingTime = useCallback((): string => {//(): string => {
//     if (sessions.length === 0) return '00:00:00';
    
//     let totalMs = 0;
//     // const diffMs = endTime ? endTime.getTime() - startTime.getTime() : 0;
//     // Process each session
//     sessions.forEach(session => {
//       // Skip invalid sessions
//       if (!session.checkIn) return;
      
//       const checkInTime = toSingaporeTime(session.checkIn);
      
//       // Determine end time (checkout time or current time if still checked in)
//       const endTime = session.checkOut
//         ? toSingaporeTime(session.checkOut)
//         : isCheckedIn 
//           ? toSingaporeTime(new Date()) 
//           : checkInTime;
      
//       if (!checkInTime || !endTime) return;
      
//       // Calculate duration in milliseconds
//       const sessionMs = differenceInMilliseconds(endTime, checkInTime);
      
//       // Ensure positive value
//       totalMs += Math.max(0, sessionMs);
//     });
    
//     // Format time as HH:MM:SS
//     const hours = Math.floor(totalMs / (1000 * 60 * 60)).toString().padStart(2, '0');
//     const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
//     const seconds = Math.floor((totalMs % (1000 * 60)) / 1000).toString().padStart(2, '0');
    
//     return `${hours}:${minutes}:${seconds}`;
//   }, [sessions, isCheckedIn]);//};
  
//   // Update time display
//   const updateTimeDisplay = useCallback(() => {//() => {
//     setDisplayTime(calculateTotalWorkingTime());
//   }, [calculateTotalWorkingTime]);//};
  
//   // Start the timer

  
//   // Stop the timer
//   const stopTimer = useCallback(() => {//() => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//   }, []);//};

//     const startTimer = useCallback(() => {//() => {
//     // Clean up any existing interval
//     stopTimer();
    
//     // Create new interval that updates every second
//     intervalRef.current = setInterval(() => {
//       updateTimeDisplay();
//     }, 1000);
//   }, [updateTimeDisplay, stopTimer]);//};

//   // Initialize time display immediately
//   useEffect(() => {
//     updateTimeDisplay();
//     }, [updateTimeDisplay]);
//  // }, [sessions]);
  
//   // Start/stop timer based on check-in status
//   useEffect(() => {
//     // If checked in, start the timer
//     if (isCheckedIn) {
//       startTimer();
//     } else {
//       // Update one last time and stop the timer
//       updateTimeDisplay();
//       stopTimer();
//     }
    
//     // Clean up on unmount
//     return () => {
//       stopTimer();
//     };
//   }, [isCheckedIn, sessions, startTimer, stopTimer, updateTimeDisplay]);//}, [isCheckedIn, sessions]);

//   // Format the display time based on the requested format
//   const formatDisplayTime = (timeString: string): React.ReactNode => {
//     const [hours, minutes, seconds] = timeString.split(':');
    
//     switch (displayFormat) {
//       case 'compact':
//         return <span>{hours}h {minutes}m</span>;
        
//       case 'verbose':
//         return (
//           <span>
//             {hours !== '00' && `${parseInt(hours)}h `}
//             {minutes !== '00' && `${parseInt(minutes)}m `}
//             {seconds}s
//           </span>
//         );
        
//       case 'digital':
//       default:
//         return (
//           <div className="font-mono">
//             <span className="font-semibold">{hours}</span>
//             <span className="opacity-70">:</span>
//             <span className="font-semibold">{minutes}</span>
//             <span className="opacity-70">:</span>
//             <span className="font-semibold">{seconds}</span>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className={`${className} ${isCheckedIn ? `${theme === 'light' ? 'text-green-600' : 'text-green-400'} animate-pulse transition-all duration-1000` : ''}`}>
//       {formatDisplayTime(displayTime)}
//     </div>
//   );
// };'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTheme } from './ThemeProvider';

export interface Session {
  id?: string;
  checkIn: Date | null;
  checkOut: Date | null;
}

interface WorkingTimeCounterProps {
  sessions: Session[];
  isCheckedIn: boolean;
  className?: string;
  displayFormat?: 'digital' | 'compact' | 'verbose';
  timeZone?: string;
}

const WorkingTimeCounter: React.FC<WorkingTimeCounterProps> = ({
  sessions,
  isCheckedIn,
  className = '',
  displayFormat = 'digital',
}) => {
  const { theme } = useTheme();
  const [display, setDisplay] = useState<string>('00:00:00');
  const intervalRef = useRef<number | null>(null);

  // Debug: Log incoming props
  // console.log('WorkingTimeCounter received:', {
  //   sessionsCount: sessions.length,
  //   isCheckedIn,
  //   sessions: sessions.map(s => ({
  //     id: s.id,
  //     checkIn: s.checkIn?.toISOString(),
  //     checkOut: s.checkOut?.toISOString(),
  //     checkInValid: s.checkIn instanceof Date && !isNaN(s.checkIn.getTime()),
  //     checkOutValid: s.checkOut instanceof Date && !isNaN(s.checkOut.getTime())
  //   }))
  // });

  // Normalize sessions with proper date handling
  const normalized = useMemo(() => {
    const normalizedSessions = sessions.map(s => {
      let checkIn: Date | null = null;
      let checkOut: Date | null = null;

      // Handle checkIn
      if (s.checkIn instanceof Date && !isNaN(s.checkIn.getTime())) {
        checkIn = s.checkIn;
      } else if (s.checkIn) {
        checkIn = new Date(s.checkIn);
        if (isNaN(checkIn.getTime())) checkIn = null;
      }

      // Handle checkOut
      if (s.checkOut instanceof Date && !isNaN(s.checkOut.getTime())) {
        checkOut = s.checkOut;
      } else if (s.checkOut) {
        checkOut = new Date(s.checkOut);
        if (isNaN(checkOut.getTime())) checkOut = null;
      }

      return {
        id: s.id || `session-${Math.random()}`,
        checkIn,
        checkOut
      };
    });

    //console.log('Normalized sessions:', normalizedSessions);
    return normalizedSessions;
  }, [sessions]);

  // Check if we have any open sessions
const hasOpen = useMemo(() => {
  // If isCheckedIn is true, we definitely have an open session
  if (isCheckedIn) {
    //console.log('Open session detected: isCheckedIn = true');
    return true;
  }
  
  // Check for sessions with checkIn but no checkOut
  const hasOpenSession = normalized.some(s => s.checkIn && !s.checkOut);
  // console.log('Open session check:', { 
  //   isCheckedIn, 
  //   sessions: normalized.length,
  //   openSessions: normalized.filter(s => s.checkIn && !s.checkOut).length,
  //   result: hasOpenSession 
  // });
  
  return hasOpenSession;
}, [isCheckedIn, normalized]);

  // Calculate total time
const calc = useCallback(() => {
  let totalMs = 0;
  const nowMs = Date.now();

  //console.log('Calculating time - isCheckedIn:', isCheckedIn, 'now:', new Date(nowMs).toISOString());
  
  for (const s of normalized) {
    if (!s.checkIn) {
      //console.log('Skipping session - no checkIn:', s.id);
      continue;
    }
    
    const start = s.checkIn.getTime();
    
    // CRITICAL FIX: If user is checked in, ALWAYS use current time regardless of checkOut
    let end: number;
    if (isCheckedIn) {
      // User is currently checked in - use current time for this session
      end = nowMs;
     //console.log('Using current time for session (user checked in)');
    } else if (s.checkOut) {
      // User is not checked in and session has checkOut - use the checkOut time
      end = s.checkOut.getTime();
      //console.log('Using checkOut time for session');
    } else {
      // User is not checked in and no checkOut - session not active
      end = start;
      //console.log('Session not active');
    }
    
    // console.log('Session timing:', {
    //   id: s.id,
    //   start: new Date(start).toISOString(),
    //   end: new Date(end).toISOString(),
    //   isCheckedIn,
    //   hasCheckOut: !!s.checkOut,
    //   duration: end - start
    // });
    
    if (end > start) {
      totalMs += (end - start);
    }
  }

  const totalSeconds = Math.floor(totalMs / 1000);
  const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const ss = String(totalSeconds % 60).padStart(2, '0');

  let result = '';
  if (displayFormat === 'compact') result = `${Number(hh)}h ${Number(mm)}m`;
  else if (displayFormat === 'verbose') result = `${Number(hh)} hours ${Number(mm)} minutes ${Number(ss)} seconds`;
  else result = `${hh}:${mm}:${ss}`;

  //console.log('Total calculated:', { totalMs, totalSeconds, result });
  return result;
}, [normalized, isCheckedIn, displayFormat]);
  useEffect(() => {
    // Calculate initial display
    const newDisplay = calc();
    setDisplay(newDisplay);
    //console.log('Initial display set to:', newDisplay);

    // Clear previous interval
    if (intervalRef.current) {
      //console.log('Clearing previous interval');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Set up new interval if we have open sessions
    if (hasOpen) {
      //console.log('Setting up timer interval (open session detected)');
      intervalRef.current = window.setInterval(() => {
        const updatedDisplay = calc();
        setDisplay(updatedDisplay);
        //console.log('Timer tick - display updated to:', updatedDisplay);
      }, 1000);
    } else {
      //console.log('No open sessions - timer not running');
    }

    // Cleanup
    return () => {
      if (intervalRef.current) {
        //console.log('Cleaning up interval');
        clearInterval(intervalRef.current);
      }
    };
  }, [calc, hasOpen]);

  //console.log('Rendering with display:', display);

  return (
    <span className={className} data-debug="working-time-counter">
      {display}
    </span>
  );
};

export default WorkingTimeCounter;
