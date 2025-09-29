export type TodayMeta = {
  kind: 'holiday' | 'leave' | 'off' | 'working' | 'event';
  label: string;
  icon: string;
  color: string;
  bg: string;
};

export const useTodayStatus = (
  schedule_date: string | null,
  work_status: string | null,
  leave_status: string | null,
  holidayTitles: string | null,
  holidaysToday: any[] | string | null = null,
  eventsToday: any[] | string | null = null,
  workBreak: number = 0
): TodayMeta => {
  // Parse JSON strings if they are passed as strings
  const parsedHolidays = typeof holidaysToday === 'string' 
    ? JSON.parse(holidaysToday) 
    : holidaysToday;
  
  const parsedEvents = typeof eventsToday === 'string' 
    ? JSON.parse(eventsToday) 
    : eventsToday;

  // 1. Holiday (check both the string and array formats)
  const hasHoliday = holidayTitles || (parsedHolidays && parsedHolidays.length > 0);
  if (hasHoliday) {
    let holidayLabel = 'Public Holiday';
    if (holidayTitles) {
      holidayLabel = holidayTitles.split(',')[0].trim();
    } else if (parsedHolidays && parsedHolidays.length > 0) {
      holidayLabel = parsedHolidays[0].title || 'Public Holiday';
    }
    
    return {
      kind: 'holiday',
      label: holidayLabel,
      icon: '🎉',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    };
  }
  
  // 2. Event
  const hasEvent = parsedEvents && parsedEvents.length > 0;
  if (hasEvent) {
    const eventLabel = parsedEvents[0].title || 'Company Event';
    return {
      kind: 'event',
      label: eventLabel,
      icon: '📅',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    };
  }
  
  // 3. Approved leave
  if (leave_status === 'APPROVED') {
    return {
      kind: 'leave',
      label: 'On Leave',
      icon: '🌴',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    };
  }
  
  // 4. Off day
  if (work_status === 'off') {
    return {
      kind: 'off',
      label: 'Off Day',
      icon: '🏖️',
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    };
  }
  
  // 5. Working (with break info if applicable)
  const workingLabel = workBreak > 0 ? `Working (${workBreak}h break)` : 'Working Day';
  
  return {
    kind: 'working',
    label: workingLabel,
    icon: '💼',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  };
};