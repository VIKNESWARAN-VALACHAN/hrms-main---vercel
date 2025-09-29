'use client';

import React, { useState, useEffect } from 'react'
import LeaveOverview from './LeaveOverview';
import LeaveCalendar from './LeaveCalendar';
import LeaveRequest from './LeaveRequest';
import AdminLeaveRequest from './AdminLeaveRequest';
// The LeaveType import will only be used by admin users
import LeaveType from './LeaveType';
import { FaRegCalendarTimes } from "react-icons/fa";
import { useTheme } from '../components/ThemeProvider';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const LeavesPage = () => {
  const { theme } = useTheme();
  const [key, setKey] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [lastOpenedMenu, setLastOpenedMenu] = useState<string | null>('');
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('hrms_user');
    if (user) {
      const userData = JSON.parse(user);
      setUser(userData);
    }

    // Get last opened menu from localStorage
    const lastMenu = localStorage.getItem('lastOpenedMenu');
    setLastOpenedMenu(lastMenu);
  }, []);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    setKey(prev => prev + 1);
  };

  return (
    <div className={`container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
          <FaRegCalendarTimes className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 inline mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
          <span className="truncate">Manage Leaves</span>
        </h1>
      </div>

      <div className={`tabs tabs-border overflow-x-auto ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'}`}>
        {user?.role !== 'admin' && (
          <>
            <input
              type="radio"
              name="leaves_tabs"
              className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
              aria-label="Overview"
              defaultChecked
              onChange={() => handleTabChange('overview')}
            />
            <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
              <LeaveOverview key={`overview-${key}`} />
            </div>
            <input
              type="radio"
              name="leaves_tabs"
              className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
              aria-label="Leave Requests"
              defaultChecked={user?.role === 'admin'}
              onChange={() => handleTabChange('requests')}
            />
            <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
              <LeaveRequest key={`requests-${key}`} />
            </div>

            <input
              type="radio"
              name="leaves_tabs"
              className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
              aria-label="Calendar"
              onChange={() => handleTabChange('calendar')}
            />
            <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
              <LeaveCalendar key={`calendar-${key}`} />
            </div>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <input
              type="radio"
              name="leaves_tabs"
              className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
              aria-label="Leave Requests"
              defaultChecked
              onChange={() => handleTabChange('requests')}
            />
            <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
              <AdminLeaveRequest key={`requests-${key}`} />
            </div>

            <input
              type="radio"
              name="leaves_tabs"
              className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
              aria-label="Leave Types"
              onChange={() => handleTabChange('types')}
            />
            <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
              <LeaveType key={`types-${key}`} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LeavesPage