import React from 'react'
import { Calendar } from 'react-date-range';
import { useTheme } from '../components/ThemeProvider';

const CalendarAndRecentRequests = () => {
    const { theme } = useTheme();

    // Mock leave data
    const mockLeaves = [
      {
        id: '1',
        type: 'Medical',
        startDate: new Date(2024, 5, 15),
        endDate: new Date(2024, 5, 17),
        reason: 'Doctor appointment',
        status: 'approved' as const
      },
      {
        id: '2',
        type: 'Annual',
        startDate: new Date(2024, 5, 20),
        endDate: new Date(2024, 5, 25),
        reason: 'Family vacation',
        status: 'pending' as const
      },
      {
        id: '3',
        type: 'Emergency',
        startDate: new Date(2024, 6, 12),
        endDate: new Date(2024, 6, 13),
        reason: 'Personal emergency',
        status: 'pending' as const
      }
    ];

    // Helper function to determine badge class based on status
    const getBadgeClass = (status: string) => {
      switch (status) {
        case 'approved': return 'badge-success';
        case 'rejected': return 'badge-error';
        default: return 'badge-warning';
      }
    };

  return (
  <>
    
        {/* Calendar and Recent Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className={`card shadow-lg lg:col-span-2 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            <div className="card-body">
              <h2 className={`card-title flex items-center gap-2 mb-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Leave Calendar
              </h2>
              <div className={`p-4 rounded-lg flex justify-center ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-700'}`}>
                <Calendar
                  date={new Date()}
                  onChange={() => { }}
                  className="custom-calendar"
                />
              </div>
            </div>
          </div>

          {/* Recent Requests */}
          <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            <div className="card-body">
              <h2 className={`card-title flex items-center gap-2 mb-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Recent Requests
              </h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead className={`${theme === 'light' ? 'bg-blue-50 text-gray-700' : 'bg-slate-700 text-slate-100'}`}>
                    <tr>
                      <th>Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLeaves.map(request => (
                      <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-blue-50' : 'hover:bg-slate-700'}`}>
                        <td>
                          <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{request.type}</div>
                          <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                            {request.startDate.toLocaleDateString()} - {request.endDate.toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${getBadgeClass(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Leave History */}
        <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
          <div className="card-body">
            <h2 className={`card-title flex items-center gap-2 mb-6 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Leave History
            </h2>

            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className={`${theme === 'light' ? 'bg-blue-50 text-gray-700' : 'bg-slate-700 text-slate-100'}`}>
                  <tr>
                    <th>Type</th>
                    <th>Dates</th>
                    <th>Duration</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeaves.map(request => {
                    // Calculate duration in days
                    const duration = Math.ceil(
                      (request.endDate.getTime() - request.startDate.getTime()) / (1000 * 60 * 60 * 24)
                    ) + 1;

                    return (
                      <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-blue-50' : 'hover:bg-slate-700'}`}>
                        <td>
                          <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{request.type}</div>
                        </td>
                        <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                          {request.startDate.toLocaleDateString()} - {request.endDate.toLocaleDateString()}
                        </td>
                        <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{duration} day{duration !== 1 ? 's' : ''}</td>
                        <td>
                          <div className={`whitespace-normal max-w-xs ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{request.reason}</div>
                        </td>
                        <td>
                          <span className={`badge ${getBadgeClass(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty state message when no data */}
            {mockLeaves.length === 0 && (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 mx-auto ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'} mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>No leave history found</h3>
                <p className={`mt-1 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                  Your leave requests will appear here once submitted.
                </p>
              </div>
            )}
          </div>
        </div>
  </>
  )
}

export default CalendarAndRecentRequests