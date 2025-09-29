import { useState, useEffect, useCallback } from 'react';
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useTheme } from '../components/ThemeProvider';

interface LeaveApplication {
  id: number;
  employee_name: string;
  leave_type_name: string;
  start_date: Date;
  end_date: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FIRST_APPROVED' | 'CANCELLED';
  reason: string;
  company_id: number;
}

interface CalendarEvent {
  id: number;
  name: string;
  time: string;
  datetime: string;
  href: string;
  status: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  leaveApplications: LeaveApplication[];
}

interface CalendarDay {
  date: string;
  isCurrentMonth: boolean;
  isToday?: boolean;
  isSelected?: boolean;
  events: CalendarEvent[];
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Company {
  id: string;
  name: string;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const LeaveCalendar = () => {
  const { theme } = useTheme();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([]);
  const [filteredLeaveApplications, setFilteredLeaveApplications] = useState<LeaveApplication[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - 5 + i);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('hrms_user');

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Move these operations to a separate useEffect that depends on user state
        if (parsedUser.role === 'admin') {
          fetchCompanies();
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  // Separate useEffect for operations that depend on user state
  useEffect(() => {
    if (user) {
      fetchLeaveApplications();
      if (user.role === 'admin') {
        fetchCompanies();
      }
    }
  }, [user]);

  // Effect for month/year/company changes
  useEffect(() => {
    if (user) {
      fetchLeaveApplications();
    }
  }, [selectedMonth, selectedYear, selectedCompany]);

  const fetchCompanies =  async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/companies`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      setCompanies(response.data.map((company: any) => ({
        id: company.id.toString(),
        name: company.company_name || company.name
      })));
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchLeaveApplications = useCallback(async () => {//async () => {
    try {
      const startDate = new Date(selectedYear, selectedMonth, 1).toISOString().split('T')[0];
      const endDate = new Date(selectedYear, selectedMonth + 1, 0).toISOString().split('T')[0];
      
      let response;
      if (user?.role === 'admin') {
        response = await axios.get(`${API_BASE_URL}/api/v1/leaves`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          }
        });
      }
      else {
        response = await axios.get(`${API_BASE_URL}/api/v1/leaves/leaves-for-calendar-by-employee-id`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          },
          params: {
            employeeId: user?.id
          }
        });
      }
      
      let leaveApplications = response.data.filter((leave: LeaveApplication) => leave.status === 'APPROVED').map((leave: LeaveApplication) => ({ 
        id: leave.id,
        employee_name: leave.employee_name,
        leave_type_name: leave.leave_type_name,
        start_date: new Date(new Date(leave.start_date).toDateString()),
        end_date: new Date(new Date(leave.end_date).toDateString()),
        status: leave.status,
        reason: leave.reason,
        company_id: leave.company_id
      }));
      
      setLeaveApplications(leaveApplications);
    } catch (error) {
      console.error('Error fetching leave applications:', error);
    }
    }, [user, selectedMonth, selectedYear]);//};

  useEffect(() => {
    if (selectedCompany === 'all') {
      setFilteredLeaveApplications(leaveApplications);
    } else {
      setFilteredLeaveApplications(leaveApplications.filter(leave => leave.company_id === parseInt(selectedCompany)));
    }
  }, [selectedCompany, leaveApplications]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'FIRST_APPROVED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDayOfMonth = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days: CalendarDay[] = [];

    // Helper function to check if a date falls within a leave period
    const isDateInLeavePeriod = (date: string, leave: LeaveApplication) => {
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      
      const startDate = new Date(leave.start_date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(leave.end_date);
      endDate.setHours(23, 59, 59, 999);

      return checkDate >= startDate && checkDate <= endDate;
    };

    // Helper function to group leaves by status
    const groupLeavesByStatus = (leaves: LeaveApplication[]) => {
      return leaves.reduce((acc, leave) => {
        if (!acc[leave.status]) {
          acc[leave.status] = [];
        }
        acc[leave.status].push(leave);
        return acc;
      }, {} as Record<string, LeaveApplication[]>);
    };

    // Add days from previous month
    const prevMonthDays = getDaysInMonth(selectedMonth - 1, selectedYear);
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const date = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(prevMonthDays - i).padStart(2, '0')}`;
      const dayLeaves = filteredLeaveApplications.filter(leave => isDateInLeavePeriod(date, leave));
      const groupedLeaves = groupLeavesByStatus(dayLeaves);

      days.push({
        date,
        isCurrentMonth: false,
        events: Object.entries(groupedLeaves).map(([status, leaves]) => ({
          id: leaves[0].id,
          name: status,
          time: '',
          datetime: date,
          href: '#',
          status,
          employeeName: leaves.map(l => l.employee_name).join(', '),
          leaveType: leaves.map(l => l.leave_type_name).join(', '),
          startDate: leaves[0].start_date.toISOString(),
          endDate: leaves[0].end_date.toISOString(),
          leaveApplications: leaves
        }))
      });
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isToday = new Date().getDate() === i && 
                     new Date().getMonth() === selectedMonth && 
                     new Date().getFullYear() === selectedYear;
      
      const dayLeaves = filteredLeaveApplications.filter(leave => isDateInLeavePeriod(date, leave));
      const groupedLeaves = groupLeavesByStatus(dayLeaves);

      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        events: Object.entries(groupedLeaves).map(([status, leaves]) => ({
          id: leaves[0].id,
          name: status,
          time: '',
          datetime: date,
          href: '#',
          status,
          employeeName: leaves.map(l => l.employee_name).join(', '),
          leaveType: leaves.map(l => l.leave_type_name).join(', '),
          startDate: leaves[0].start_date.toISOString(),
          endDate: leaves[0].end_date.toISOString(),
          leaveApplications: leaves
        }))
      });
    }

    // Add days from next month
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = `${selectedYear}-${String(selectedMonth + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayLeaves = filteredLeaveApplications.filter(leave => isDateInLeavePeriod(date, leave));
      const groupedLeaves = groupLeavesByStatus(dayLeaves);

      days.push({
        date,
        isCurrentMonth: false,
        events: Object.entries(groupedLeaves).map(([status, leaves]) => ({
          id: leaves[0].id,
          name: status,
          time: '',
          datetime: date,
          href: '#',
          status,
          employeeName: leaves.map(l => l.employee_name).join(', '),
          leaveType: leaves.map(l => l.leave_type_name).join(', '),
          startDate: leaves[0].start_date.toISOString(),
          endDate: leaves[0].end_date.toISOString(),
          leaveApplications: leaves
        }))
      });
    }

    return days;
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleStatusClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const days = generateCalendarDays();

  return (
    <div className={`lg:flex lg:h-full lg:flex-col ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
      <header className={`flex items-center justify-between border-b px-6 py-4 lg:flex-none ${theme === 'light' ? 'border-gray-200 bg-white' : 'border-slate-600 bg-slate-800'}`}>
        <h1 className={`text-base font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
          {user?.role === 'admin' ? (
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className={`rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 ${
                theme === 'light' 
                  ? 'border-gray-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-blue-500' 
                  : 'border-slate-600 bg-slate-700 text-slate-100 focus:border-blue-400 focus:ring-blue-400'
              }`}
            >
              <option value="all">All Companies</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          ) : (
            <span className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Leave Calendar</span>
          )}
        </h1>
        <div className="flex items-center">
          <div className={`relative flex items-center rounded-md shadow-sm md:items-stretch ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>
            <button
              type="button"
              onClick={handlePreviousMonth}
              className={`flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l pr-1 focus:relative md:w-9 md:pr-0 ${
                theme === 'light'
                  ? 'border-gray-300 text-gray-400 hover:text-gray-500 hover:bg-gray-50'
                  : 'border-slate-600 text-slate-400 hover:text-slate-300 hover:bg-slate-600'
              }`}
            >
              <span className="sr-only">Previous month</span>
              <HiChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <div className={`hidden border-y px-3.5 text-sm font-semibold focus:relative md:block ${
              theme === 'light'
                ? 'border-gray-300 text-slate-900 hover:bg-gray-50'
                : 'border-slate-600 text-slate-100 hover:bg-slate-600'
            }`}>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className={`rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-blue-500'
                    : 'border-slate-600 bg-slate-700 text-slate-100 focus:border-blue-400 focus:ring-blue-400'
                }`}
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className={`hidden border-y px-3.5 text-sm font-semibold focus:relative md:block ${
              theme === 'light'
                ? 'border-gray-300 text-slate-900 hover:bg-gray-50'
                : 'border-slate-600 text-slate-100 hover:bg-slate-600'
            }`}>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className={`rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-blue-500'
                    : 'border-slate-600 bg-slate-700 text-slate-100 focus:border-blue-400 focus:ring-blue-400'
                }`}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className={`flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r pl-1 focus:relative md:w-9 md:pl-0 ${
                theme === 'light'
                  ? 'border-gray-300 text-gray-400 hover:text-gray-500 hover:bg-gray-50'
                  : 'border-slate-600 text-slate-400 hover:text-slate-300 hover:bg-slate-600'
              }`}
            >
              <span className="sr-only">Next month</span>
              <HiChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <div className={`shadow-sm ring-1 ring-black/5 lg:flex lg:flex-auto lg:flex-col ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
        <div className={`grid grid-cols-7 gap-px border-b text-center text-xs/6 font-semibold lg:flex-none ${
          theme === 'light' 
            ? 'border-gray-300 bg-gray-200 text-gray-700' 
            : 'border-slate-600 bg-slate-700 text-slate-300'
        }`}>
          <div className={`py-3 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            M<span className="sr-only sm:not-sr-only">on</span>
          </div>
          <div className={`py-3 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            T<span className="sr-only sm:not-sr-only">ue</span>
          </div>
          <div className={`py-3 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            W<span className="sr-only sm:not-sr-only">ed</span>
          </div>
          <div className={`py-3 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            T<span className="sr-only sm:not-sr-only">hu</span>
          </div>
          <div className={`py-3 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            F<span className="sr-only sm:not-sr-only">ri</span>
          </div>
          <div className={`py-3 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            S<span className="sr-only sm:not-sr-only">at</span>
          </div>
          <div className={`py-3 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            S<span className="sr-only sm:not-sr-only">un</span>
          </div>
        </div>
        <div className={`flex text-xs/6 lg:flex-auto ${
          theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-slate-700 text-slate-300'
        }`}>
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
            {days.map((day) => (
              <div
                key={day.date}
                className={classNames(
                  day.isCurrentMonth 
                    ? `${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-100'}` 
                    : `${theme === 'light' ? 'bg-gray-50 text-gray-500' : 'bg-slate-700 text-slate-400'}`,
                  'relative px-3 py-2 min-h-[120px]'
                )}
              >
                <time
                  dateTime={day.date}
                  className={
                    day.isToday
                      ? `flex size-6 items-center justify-center rounded-full font-semibold text-white ${
                          theme === 'light' ? 'bg-blue-600' : 'bg-blue-400'
                        }`
                      : undefined
                  }
                >
                  {day?.date?.split('-')?.pop()?.replace(/^0/, '')}
                </time>
                {day.events.length > 0 && (
                  <ol className="mt-2 space-y-1">
                    {day.events.map((event) => (
                      <li key={event.id}>
                        <button
                          onClick={() => handleStatusClick(event)}
                          className={`w-full text-left px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                            theme === 'light'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-green-900/30 text-green-300 hover:bg-green-800/40'
                          }`}
                        >
                          {event.leaveApplications.slice(0, 3).map((leave, index) => (
                            <div key={index} className="truncate">
                              {leave.employee_name}
                            </div>
                          ))}
                          {event.leaveApplications.length > 3 && (
                            <div className={`truncate ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                              +{event.leaveApplications.length - 3} more
                            </div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
          <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
            {days.map((day) => (
              <button
                key={day.date}
                type="button"
                className={classNames(
                  day.isCurrentMonth 
                    ? `${theme === 'light' ? 'bg-white' : 'bg-slate-800'}` 
                    : `${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700'}`,
                  (day.isSelected || day.isToday) && 'font-semibold',
                  day.isSelected && 'text-white',
                  !day.isSelected && day.isToday && `${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`,
                  !day.isSelected && day.isCurrentMonth && !day.isToday && `${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`,
                  !day.isSelected && !day.isCurrentMonth && !day.isToday && `${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`,
                  `flex h-20 flex-col px-4 py-3 focus:z-10 ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-slate-600'}`
                )}
              >
                <time
                  dateTime={day.date}
                  className={classNames(
                    day.isSelected && 'flex size-8 items-center justify-center rounded-full',
                    day.isSelected && day.isToday && `${theme === 'light' ? 'bg-blue-600' : 'bg-blue-400'}`,
                    day.isSelected && !day.isToday && `${theme === 'light' ? 'bg-gray-900' : 'bg-slate-600'}`,
                    'ml-auto text-lg'
                  )}
                >
                  {day.date.split('-')[2].replace(/^0/, '')}
                </time>
                <span className="sr-only">{day.events.length} events</span>
                {day.events.length > 0 && (
                  <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                    {day.events.map((event) => (
                      <span key={event.id} className={`mx-0.5 mb-1 size-2 rounded-full ${getStatusColor(event.status).split(' ')[0]}`} />
                    ))}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedEvent && (
        <dialog className="modal modal-open">
          <div className={`modal-box w-11/12 max-w-5xl p-0 overflow-hidden shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col ${
            theme === 'light' ? 'bg-white' : 'bg-slate-800'
          }`}>
            <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b flex justify-between items-center z-10 ${
              theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'
            }`}>
              <h3 className={`font-bold text-lg sm:text-xl flex items-center gap-2 ${
                theme === 'light' ? 'text-blue-600' : 'text-blue-400'
              }`}>
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ${
                  theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900/30 text-green-300'
                }`}>
                  {selectedEvent.name}
                </span>
              </h3>
              <button
                className={`btn btn-sm btn-circle btn-ghost ${
                  theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-600'
                }`}
                onClick={closeModal}
              >✕</button>
            </div>
            <div className="overflow-y-auto flex-1">
              <div className="p-4 sm:p-6">
                <div className="space-y-2">
                  {selectedEvent.leaveApplications
                    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
                    .map((leave, index) => (
                      <div key={index} className={`flex items-center justify-between py-2 border-b ${
                        theme === 'light' ? 'border-gray-100' : 'border-slate-600'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${
                            theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                          }`}>
                            {leave.employee_name} ({leave.leave_type_name})
                          </span>
                          <span className={`text-xs ${
                            theme === 'light' ? 'text-gray-500' : 'text-slate-400'
                          }`}>
                            ({new Date(leave.start_date).toLocaleDateString('en-GB')} - {new Date(leave.end_date).toLocaleDateString('en-GB')})
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={closeModal}>close</button>
          </form>
        </dialog>
      )}
    </div>
  )
}

export default LeaveCalendar