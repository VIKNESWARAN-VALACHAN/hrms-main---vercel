// app/admins/claims/page.tsx
'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy-load tabs
const BenefitTypeTab = dynamic(() => import('./Tabs/BenefitTypeTab'));
const BenefitMappingTab = dynamic(() => import('./Tabs/BenefitMappingTab'));
const BenefitGroupTab = dynamic(() => import('./Tabs/BenefitGroupTab'));

export type ClaimTabKey = 'benefit-types' | 'mapping' | 'groups';

export default function ClaimsPage() {
  const [tab, setTab] = useState<ClaimTabKey>('benefit-types');

  const tabs = useMemo(
    () => ([
      { key: 'benefit-types', title: 'Benefit Types' },
      { key: 'mapping', title: 'Employee Mapping' },
      { key: 'groups', title: 'Benefit Groups' },
    ] as const),
    []
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        {/* Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        {/* Title */}
        <h1 className="text-3xl font-bold">Claim Benefits Management</h1>
      </div>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed bg-base-200">
        {tabs.map(t => (
          <button
            key={t.key}
            role="tab"
            className={`tab ${tab === t.key ? 'tab-active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body p-0">
          {tab === 'benefit-types' && <BenefitTypeTab />}
          {tab === 'mapping' && <BenefitMappingTab />}
          {tab === 'groups' && <BenefitGroupTab />}
        </div>
      </div>
    </div>
  );
}