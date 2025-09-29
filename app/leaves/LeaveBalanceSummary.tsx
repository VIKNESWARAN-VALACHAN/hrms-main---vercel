'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../components/ThemeProvider';

interface LeaveBalance {
  leave_type_id: string;
  leave_type_name: string;
  total_days: number;
  used_days: number;
  remaining_days: number;
}

interface LeaveBalanceSummaryProps {
  leaveBalances: LeaveBalance[];
}

const LeaveBalanceSummary = ({ leaveBalances }: LeaveBalanceSummaryProps) => {
  const { theme } = useTheme();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBalance, setSelectedBalance] = useState<LeaveBalance | null>(null);

  // Filter leave balances based on user gender
  const getFilteredLeaveBalances = () => {
    // Get user role and check if admin
    const userFromStorage = localStorage.getItem('hrms_user');
    if (!userFromStorage) return leaveBalances;
    
    try {
      const parsedUser = JSON.parse(userFromStorage);
      
      // Don't apply gender filtering for admin users
      if (parsedUser?.role?.toLowerCase() === 'admin') {
        return leaveBalances;
      }

      const gender = parsedUser?.gender;
      if (!gender) return leaveBalances;

      return leaveBalances.filter(balance => {
        const leaveTypeName = balance.leave_type_name.toLowerCase();
        
        // Hide paternity leave for non-male users
        if (leaveTypeName.includes('paternity') && gender !== 'Male') {
          return false;
        }
        
        // Hide maternity leave for non-female users
        if (leaveTypeName.includes('maternity') && gender !== 'Female') {
          return false;
        }
        
        // If gender is 'Other', hide both paternity and maternity
        if (gender === 'Other' && 
            (leaveTypeName.includes('paternity') || leaveTypeName.includes('maternity'))) {
          return false;
        }
        
        return true;
      });
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return leaveBalances;
    }
  };

  const handleViewBalance = (balance: LeaveBalance) => {
    setSelectedBalance(balance);
    setIsViewModalOpen(true);
  };

  return (
    <>
      <div className="mt-6 sm:mt-8 flow-root">
        {/* Leave History */}
        <div className={`card ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg`}>
          <div className="card-body p-3 sm:p-4 lg:p-6">
            <h2 className={`card-title flex items-center gap-2 mb-4 sm:mb-6 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="hidden sm:inline">My Leave Balance Summary</span>
              <span className="sm:hidden">Leave Balance</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="table w-full min-w-full">
                <thead className={`${theme === 'light' ? 'bg-blue-50 text-slate-700' : 'bg-slate-700 text-slate-200'}`}>
                  <tr>
                    <th className="text-xs sm:text-sm min-w-[120px]">Leave Type</th>
                    <th className="text-xs sm:text-sm min-w-[60px]">Total</th>
                    <th className="text-xs sm:text-sm min-w-[60px]">Used</th>
                    <th className="text-xs sm:text-sm min-w-[80px]">Remaining</th>
                    <th className="text-center text-xs sm:text-sm min-w-[80px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredLeaveBalances().map(balance => (
                    <tr key={balance.leave_type_id} className={`${theme === 'light' ? 'hover:bg-blue-50' : 'hover:bg-slate-700'}`}>
                      <td>
                        <div className={`font-medium text-xs sm:text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{balance.leave_type_name}</div>
                      </td>
                      <td className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{balance.total_days} days</td>
                      <td className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{balance.used_days} days</td>
                      <td className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{balance.remaining_days} days</td>
                      <td className='text-center'>
                        <button 
                          onClick={() => handleViewBalance(balance)}
                          className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
                        >
                          View 
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <dialog
        id="view_balance_modal"
        className={`modal ${isViewModalOpen ? 'modal-open' : ''}`}
      >
        <div className={`modal-box w-full max-w-sm sm:max-w-lg lg:max-w-4xl xl:max-w-5xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-2 sm:mx-auto h-auto max-h-[95vh] sm:max-h-[90vh] flex flex-col`}>
          {/* Modal Header */}
          <div className={`${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b flex justify-between items-center z-10`}>
            <h3 className={`font-bold text-lg sm:text-xl flex items-center gap-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="truncate">Leave Balance Details</span>
            </h3>
            <button 
              className={`btn btn-sm btn-circle btn-ghost ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-600'}`}
              onClick={() => setIsViewModalOpen(false)}
            >✕</button>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="p-3 sm:p-4 lg:p-6 overflow-y-auto">
            {selectedBalance && (
              <div className="space-y-4 sm:space-y-5">
                {/* Balance Summary Card */}
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-8 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'} p-3 sm:p-4 rounded-lg`}>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-wider mb-1`}>Leave Type</h4>
                    <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{selectedBalance.leave_type_name}</p>
                  </div>
                  
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-wider mb-1`}>Total Allocation</h4>
                    <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{selectedBalance.total_days} days</p>
                  </div>
                  
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-wider mb-1`}>Remaining</h4>
                    <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{selectedBalance.remaining_days} days</p>
                  </div>
                </div>

                {/* Usage Details */}
                <div className={`border ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'} rounded-lg`}>
                  <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-700 text-slate-100'} px-3 sm:px-4 py-2 rounded-t-lg`}>Leave Usage</h4>
                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="flex-1">
                        <h4 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mb-1`}>Days Used</h4>
                        <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{selectedBalance.used_days} days</p>
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mb-1`}>Days Remaining</h4>
                        <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{selectedBalance.remaining_days} days</p>
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mb-1`}>Usage Percentage</h4>
                        <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                          {((selectedBalance.used_days / selectedBalance.total_days) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-2">
                      <h4 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mb-2`}>Usage Visualization</h4>
                      <div className={`w-full ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-600'} rounded-full h-2.5 sm:h-3`}>
                        <div 
                          className={`h-2.5 sm:h-3 rounded-full ${selectedBalance.remaining_days < 0 ? 'bg-red-500' : selectedBalance.remaining_days <= 2 ? 'bg-red-500' : selectedBalance.remaining_days <= 5 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.max(0, Math.min(100, (selectedBalance.remaining_days / selectedBalance.total_days) * 100))}%` }}
                        ></div>
                      </div>
                      <div className={`flex justify-between text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-1`}>
                        <span>0 days</span>
                        <span>{selectedBalance.total_days} days</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Leave Summary Card */}
                <div className={`border ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'} rounded-lg`}>
                  <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-700 text-slate-100'} px-3 sm:px-4 py-2 rounded-t-lg`}>Allocation Summary</h4>
                  <div className="p-3 sm:p-4">
                    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-2 sm:p-3 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'} rounded-md`}>
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <div className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                          <span className="font-medium">Total allocation: </span>
                          <span>{selectedBalance.total_days} days per year</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex flex-col gap-1">
                        <span className="text-xs sm:text-sm">
                          <span className="font-medium text-green-500">{selectedBalance.remaining_days}</span> days remaining
                        </span>
                        <span className="text-xs text-gray-500">
                          <span className="font-medium text-red-500">{selectedBalance.used_days}</span> days used
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className={`${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'} px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border-t flex justify-end mt-auto z-10`}>
            <button 
              className={`btn btn-sm sm:btn-md w-full sm:w-auto ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsViewModalOpen(false)}>close</button>
        </form>
      </dialog>
    </>
  );
}

export default LeaveBalanceSummary