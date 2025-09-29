'use client';

import { useState, useEffect, useRef , useCallback } from 'react';
import { differenceInMilliseconds } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useTheme } from './ThemeProvider';

// Singapore timezone
const timeZone = 'Asia/Seoul';//'Asia/Singapore';

// Convert date to Singapore timezone
const toSingaporeTime = (date: Date | null): Date | null => {
  if (!date) return null;
  return toZonedTime(date, timeZone);
};

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
}

/**
 * Component that calculates and displays total working time
 * Uses setInterval for reliable updates in production
 */
const WorkingTimeCounter: React.FC<WorkingTimeCounterProps> = ({
  sessions,
  isCheckedIn,
  className = '',
  displayFormat = 'digital',
}) => {
  const { theme } = useTheme();

  const [displayTime, setDisplayTime] = useState<string>('00:00:00');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate total working time across all sessions
  const calculateTotalWorkingTime = useCallback((): string => {//(): string => {
    if (sessions.length === 0) return '00:00:00';
    
    let totalMs = 0;
    // const diffMs = endTime ? endTime.getTime() - startTime.getTime() : 0;
    // Process each session
    sessions.forEach(session => {
      // Skip invalid sessions
      if (!session.checkIn) return;
      
      const checkInTime = toSingaporeTime(session.checkIn);
      
      // Determine end time (checkout time or current time if still checked in)
      const endTime = session.checkOut
        ? toSingaporeTime(session.checkOut)
        : isCheckedIn 
          ? toSingaporeTime(new Date()) 
          : checkInTime;
      
      if (!checkInTime || !endTime) return;
      
      // Calculate duration in milliseconds
      const sessionMs = differenceInMilliseconds(endTime, checkInTime);
      
      // Ensure positive value
      totalMs += Math.max(0, sessionMs);
    });
    
    // Format time as HH:MM:SS
    const hours = Math.floor(totalMs / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((totalMs % (1000 * 60)) / 1000).toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  }, [sessions, isCheckedIn]);//};
  
  // Update time display
  const updateTimeDisplay = useCallback(() => {//() => {
    setDisplayTime(calculateTotalWorkingTime());
  }, [calculateTotalWorkingTime]);//};
  
  // Start the timer

  
  // Stop the timer
  const stopTimer = useCallback(() => {//() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);//};

    const startTimer = useCallback(() => {//() => {
    // Clean up any existing interval
    stopTimer();
    
    // Create new interval that updates every second
    intervalRef.current = setInterval(() => {
      updateTimeDisplay();
    }, 1000);
  }, [updateTimeDisplay, stopTimer]);//};

  // Initialize time display immediately
  useEffect(() => {
    updateTimeDisplay();
    }, [updateTimeDisplay]);
 // }, [sessions]);
  
  // Start/stop timer based on check-in status
  useEffect(() => {
    // If checked in, start the timer
    if (isCheckedIn) {
      startTimer();
    } else {
      // Update one last time and stop the timer
      updateTimeDisplay();
      stopTimer();
    }
    
    // Clean up on unmount
    return () => {
      stopTimer();
    };
  }, [isCheckedIn, sessions, startTimer, stopTimer, updateTimeDisplay]);//}, [isCheckedIn, sessions]);

  // Format the display time based on the requested format
  const formatDisplayTime = (timeString: string): React.ReactNode => {
    const [hours, minutes, seconds] = timeString.split(':');
    
    switch (displayFormat) {
      case 'compact':
        return <span>{hours}h {minutes}m</span>;
        
      case 'verbose':
        return (
          <span>
            {hours !== '00' && `${parseInt(hours)}h `}
            {minutes !== '00' && `${parseInt(minutes)}m `}
            {seconds}s
          </span>
        );
        
      case 'digital':
      default:
        return (
          <div className="font-mono">
            <span className="font-semibold">{hours}</span>
            <span className="opacity-70">:</span>
            <span className="font-semibold">{minutes}</span>
            <span className="opacity-70">:</span>
            <span className="font-semibold">{seconds}</span>
          </div>
        );
    }
  };

  return (
    <div className={`${className} ${isCheckedIn ? `${theme === 'light' ? 'text-green-600' : 'text-green-400'} animate-pulse transition-all duration-1000` : ''}`}>
      {formatDisplayTime(displayTime)}
    </div>
  );
};

export default WorkingTimeCounter; 