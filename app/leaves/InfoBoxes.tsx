import React from 'react'
import Link from 'next/link';
import { FaRegCalendarCheck } from "react-icons/fa";
import { FaRegHourglass } from "react-icons/fa";
import { LiaUserSlashSolid } from "react-icons/lia";
import { useTheme } from '../components/ThemeProvider';

type InfoBoxesProps = {
  availableLeave: string,
  pendingRequest: string,
  onLeaveToday: string
}

const InfoBoxes = ({
    availableLeave,
    pendingRequest,
    onLeaveToday
  }: InfoBoxesProps) => {
  const { theme } = useTheme();
  
  return (
    <dl className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div className={`overflow-hidden rounded-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} px-4 py-5 shadow-sm sm:p-6`}>
        <FaRegCalendarCheck className={`h-8 w-8 inline mb-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
        <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>Available Leaves</h2>
        <p className={`mt-2 mb-4 ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
          Average {availableLeave} days per employee
        </p>
        <Link
          href="/"
          className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
        >
          View Details
        </Link>
      </div>
      <div className={`overflow-hidden rounded-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} px-4 py-5 shadow-sm sm:p-6`}>
        <FaRegHourglass className={`h-8 w-8 inline mb-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
        <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>Pending Requests</h2>
        <p className={`mt-2 mb-4 ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
          {pendingRequest} requests awaiting approval
        </p>
        <Link
          href="/"
          className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
        >
          Review All
        </Link>
      </div>
      <div className={`overflow-hidden rounded-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} px-4 py-5 shadow-sm sm:p-6`}>
        <LiaUserSlashSolid className={`h-8 w-8 inline mb-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
        <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>On Leave Today</h2>
        <p className={`mt-2 mb-4 ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
          {onLeaveToday} employees
        </p>
        <Link
          href="/"
          className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
        >
          View Details
        </Link>
      </div>
    </dl>
  )
}

export default InfoBoxes