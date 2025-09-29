'use client';

import { useTheme } from '../components/ThemeProvider';
import Link from 'next/link';

export default function AdminAccessSettings() {
  const { theme } = useTheme();

  return (
    <div className={`container mx-auto px-4 py-8 ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
      <div className="mb-8 flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Admin Access Settings
        </h1>
        <Link href="/" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-6">
        <label className={`block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Select Admin Account:
        </label>
        <select className="select select-bordered w-full max-w-xs">
          <option value="">Select an admin</option>
          <option value="admin1">Admin 1</option>
          <option value="admin2">Admin 2</option>
          <option value="admin3">Admin 3</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Employment Info */}
        <div className={`card ${theme === 'light' ? 'bg-base-100' : 'bg-slate-800'} shadow-lg`}>
          <div className="card-body">
            <h2 className="card-title mb-4">Employment Info</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Salary View</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Training Record</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Disciplinary Record</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Passport/IC Info</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Related Documents</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Address</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Emergency Contact</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Compensation</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Payment Details</span>
              </div>
            </div>
          </div>
        </div>

        {/* Claim Module */}
        <div className={`card ${theme === 'light' ? 'bg-base-100' : 'bg-slate-800'} shadow-lg`}>
          <div className="card-body">
            <h2 className="card-title mb-4">Claim Module</h2>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="checkbox checkbox-primary" />
              <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Full Access</span>
            </div>
          </div>
        </div>

        {/* Asset Module */}
        <div className={`card ${theme === 'light' ? 'bg-base-100' : 'bg-slate-800'} shadow-lg`}>
          <div className="card-body">
            <h2 className="card-title mb-4">Asset Module</h2>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="checkbox checkbox-primary" />
              <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Full Access</span>
            </div>
          </div>
        </div>

        {/* Leave Module */}
        <div className={`card ${theme === 'light' ? 'bg-base-100' : 'bg-slate-800'} shadow-lg`}>
          <div className="card-body">
            <h2 className="card-title mb-4">Leave Module</h2>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="checkbox checkbox-primary" />
              <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Full Access</span>
            </div>
          </div>
        </div>

        {/* Payroll Module */}
        <div className={`card ${theme === 'light' ? 'bg-base-100' : 'bg-slate-800'} shadow-lg`}>
          <div className="card-body">
            <h2 className="card-title mb-4">Payroll Module</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Statutory</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>EA Form</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Allowance Module</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Module */}
        <div className={`card ${theme === 'light' ? 'bg-base-100' : 'bg-slate-800'} shadow-lg`}>
          <div className="card-body">
            <h2 className="card-title mb-4">Attendance Module</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Master Amend/Approve</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Scheduler</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className={`card ${theme === 'light' ? 'bg-base-100' : 'bg-slate-800'} shadow-lg`}>
          <div className="card-body">
            <h2 className="card-title mb-4">Module Settings</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Leave Settings</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Claim Settings</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>EA Form Settings</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Payroll Components</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Bank/Currency Settings</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Organization Settings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Other Modules */}
        <div className={`card ${theme === 'light' ? 'bg-base-100' : 'bg-slate-800'} shadow-lg`}>
          <div className="card-body">
            <h2 className="card-title mb-4">Announcement Module</h2>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="checkbox checkbox-primary" />
              <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Full Access</span>
            </div>
          </div>
        </div>

        <div className={`card ${theme === 'light' ? 'bg-base-100' : 'bg-slate-800'} shadow-lg`}>
          <div className="card-body">
            <h2 className="card-title mb-4">Employee Listing</h2>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="checkbox checkbox-primary" />
              <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Full Access</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button className="btn btn-primary">Save Changes</button>
      </div>
    </div>
  );
} 