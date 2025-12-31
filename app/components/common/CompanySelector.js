// frontend/components/common/CompanySelector.js
"use client";

import { useCompany } from '../../hooks/useCompanyContext';

export default function CompanySelector() {
  const { currentCompany, userCompanies, loading, switchCompany } = useCompany();

  if (loading || userCompanies.length <= 1) {
    return null;
  }

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-sm gap-2">
        <div className="avatar placeholder">
          <div className="bg-primary text-primary-content rounded-full w-6 h-6">
            <span className="text-xs">{currentCompany?.name?.charAt(0) || 'C'}</span>
          </div>
        </div>
        <span className="hidden md:inline">{currentCompany?.name || 'Select Company'}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </label>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2">
        {userCompanies.map(company => (
          <li key={company.id}>
            <button
              onClick={() => switchCompany(company)}
              className={`flex items-center gap-3 ${currentCompany?.id === company.id ? 'active' : ''}`}
            >
              <div className="avatar placeholder">
                <div className={`${currentCompany?.id === company.id ? 'bg-primary' : 'bg-neutral'} text-neutral-content rounded-full w-6 h-6`}>
                  <span className="text-xs">{company.name.charAt(0)}</span>
                </div>
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">{company.name}</div>
                {company.is_own_company && (
                  <div className="text-xs text-gray-500">Own Company</div>
                )}
              </div>
              {currentCompany?.id === company.id && (
                <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
