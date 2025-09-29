// File: app/admins/bank-currency/page.tsx
'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy-load tabs to keep page fast
const OverviewTab = dynamic(() => import('./Tabs/OverviewTab'));
const BanksTab = dynamic(() => import('./Tabs/BanksTab'));
const CurrencyCodesTab = dynamic(() => import('./Tabs/CurrencyCodesTab'));
const CurrencyRatesTab = dynamic(() => import('./Tabs/CurrencyRatesTab.tsx'));

export type TabKey = 'overview' | 'banks' | 'codes' | 'rates';

export default function BankCurrencyPage() {
  const [tab, setTab] = useState<TabKey>('overview');

  const tabs = useMemo(
    () => ([
      { key: 'overview', title: 'Main Overview' },
      { key: 'banks', title: 'Banks' },
      { key: 'codes', title: 'Currency Codes' },
      { key: 'rates', title: 'Currency Rates' },
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
      d="M12 14l9-5-9-5-9 5 9 5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 14l6.16-3.422a12.083 12.083 0 01.72 6.185L12 20.5l-6.88-3.737a12.083 12.083 0 01.72-6.185L12 14z"
    />
  </svg>

  {/* Title */}
  <h1 className="text-3xl font-bold">
    Bank &amp; Currency Settings
  </h1>
</div>


      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed bg-base-200">
        {tabs.map(t => (
          <button
            key={t.key}
            role="tab"
            className={`tab ${tab === t.key ? 'tab-active' : ''}`}
            onClick={() => setTab(t.key as TabKey)}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body p-0">
          {tab === 'overview' && <OverviewTab />}
          {tab === 'banks' && <BanksTab />}
          {tab === 'codes' && <CurrencyCodesTab />}
          {tab === 'rates' && <CurrencyRatesTab />}
        </div>
      </div>
    </div>
  );
}
