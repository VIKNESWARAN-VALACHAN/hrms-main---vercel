// File: app/admins/bank-currency/Tabs/OverviewTab.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { API_BASE_URL } from '@/app/config';
import { FiDollarSign, FiTrendingUp, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';
import { BsBank } from 'react-icons/bs';

type ActiveRate = {
  id: number;
  bank_id: number;
  from_code: string;   // e.g. MYR
  to_code: string;     // e.g. USD
  rate: string;        // keep as string from API, parse when needed
  effective_date: string; // ISO
  expiry_date: string;    // ISO
  updated_by: string | null;
  updated_at: string;     // ISO
  is_expired: 0 | 1;
  bank_name: string;
  to_currency_name: string;
};

export default function OverviewTab() {
  const [data, setData] = useState<ActiveRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [amountMYR, setAmountMYR] = useState<string>('1'); // quick converter input

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`${API_BASE_URL}/api/bank-currency/rates/active`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: ActiveRate[] = await res.json();
        if (mounted) setData(json);
      } catch (e: any) {
        if (mounted) setErr(e?.message || 'Failed to load active rates');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

const kpis = useMemo(() => {
  const baseNow = Date.now(); 
  const total = data.length;
  const active = data.filter(r => r.is_expired === 0).length;

  const daysLeft = (r: ActiveRate) => {
    const expiry = new Date(r.expiry_date).getTime();
    return Math.ceil((expiry - baseNow) / (1000 * 60 * 60 * 24));
  };

  const expiringSoon = data.filter(r => r.is_expired === 0 && daysLeft(r) <= 14).length;
  const uniqueBanks = new Set(data.map(r => r.bank_id)).size;

  return { total, active, expiringSoon, uniqueBanks };
}, [data]); 

  const tickerItems = useMemo(() => {
    // Build compact strings like "MYR→USD 0.2400 (Bank of China)"
    return data
      .filter(r => r.is_expired === 0)
      .map(r => ({
        key: r.id,
        text: `${r.from_code}→${r.to_code} ${Number(r.rate).toFixed(4)} • ${r.bank_name}`,
        updated_at: r.updated_at,
      }))
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }, [data]);

  const groupedByBank = useMemo(() => {
    // Optional: group for nicer layout later if needed
    const map = new Map<number, ActiveRate[]>();
    data.forEach(r => {
      const arr = map.get(r.bank_id) || [];
      arr.push(r);
      map.set(r.bank_id, arr);
    });
    return map;
  }, [data]);

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString();
};

const daysRemaining = (iso: string, baseNow = Date.now()) => {
  const expiry = new Date(iso).getTime();
  return Math.ceil((expiry - baseNow) / (1000 * 60 * 60 * 24));
};

const statusBadge = (r: any) => {
  const left = daysRemaining(r.expiry_date);
  const expired = r.is_expired || left < 0;

  const base =
    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap leading-none border shadow-sm";
  if (expired) return <span className={`${base} bg-red-100 text-red-800 border-red-200`}>Expired</span>;
  if (left <= 7) return <span className={`${base} bg-amber-100 text-amber-800 border-amber-200`}>Expiring ≤ {left}d</span>;
  if (left <= 14) return <span className={`${base} bg-sky-100 text-sky-800 border-sky-200`}>Expiring ≤ 14d</span>;
  return <span className={`${base} bg-emerald-100 text-emerald-800 border-emerald-200`}>Active</span>;
};


  const parseMYR = (val: string) => {
    const n = Number(val);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };

  return (
    <div className="p-6 space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow">
          <div className="card-body flex flex-row items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Active Rates</div>
              <div className="text-3xl font-bold">{kpis.active}</div>
            </div>
            <div className="p-3 rounded-2xl bg-blue-100 text-blue-600">
              <FiDollarSign size={22} />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body flex flex-row items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Expiring Soon (≤14d)</div>
              <div className="text-3xl font-bold">{kpis.expiringSoon}</div>
            </div>
            <div className="p-3 rounded-2xl bg-yellow-100 text-yellow-600">
              <FiAlertTriangle size={22} />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body flex flex-row items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Banks Covered</div>
              <div className="text-3xl font-bold">{kpis.uniqueBanks}</div>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-600">
              <BsBank size={22} />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body flex flex-row items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Rates (All)</div>
              <div className="text-3xl font-bold">{kpis.total}</div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-600">
              <FiTrendingUp size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Live Ticker */}
      <div className="card bg-base-100 shadow">
        <div className="card-body py-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="font-semibold">Currency Rates (as of today)</div>
          </div>

          <div className="overflow-hidden">
            <div className="flex gap-6 animate-[marquee_25s_linear_infinite] whitespace-nowrap">
              {loading && <div className="text-sm text-gray-500">Loading...</div>}
              {err && <div className="text-sm text-error">Error: {err}</div>}
              {!loading && !err && tickerItems.length === 0 && (
                <div className="text-sm text-gray-500">No active rates found.</div>
              )}
              {!loading && !err && tickerItems.map(item => (
                <span
                  key={item.key}
                  className="text-sm px-3 py-1 rounded-full bg-base-200"
                  title={`Updated: ${formatDate(item.updated_at)}`}
                >
                  {item.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Converter (MYR → pick a rate) */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex-1">
              <label className="label">
                <span className="label-text font-medium">Amount in MYR</span>
              </label>
              <input
                type="number"
                min={0}
                className="input input-bordered w-full"
                value={amountMYR}
                onChange={(e) => setAmountMYR(e.target.value)}
              />
            </div>

            <button
              className="btn btn-xm bg-blue-600 hover:bg-blue-700 text-white border-0"
              onClick={() => {
                // Kept as CTA; individual cards also show conversion result
              }}
            >
              Convert
              <FiArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Rate Cards Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
  {loading &&
    Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="card bg-base-100 shadow animate-pulse">
        <div className="card-body">
          <div className="h-5 w-1/2 bg-base-200 rounded" />
          <div className="h-4 w-1/3 bg-base-200 rounded mt-2" />
          <div className="h-10 w-2/5 bg-base-200 rounded mt-4" />
          <div className="h-4 w-1/4 bg-base-200 rounded mt-4" />
        </div>
      </div>
    ))}

  {!loading &&
    !err &&
    data
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .map((r) => {
        const left = daysRemaining(r.expiry_date);
        const myr = parseMYR(amountMYR);
        const converted = myr * Number(r.rate || "0");

        return (
          <div key={r.id} className="card bg-base-100 shadow hover:shadow-lg transition-shadow">
            {/* Make body relative so we can pin the badge */}
            <div className="card-body relative">
              {/* Pinned badge */}
              <div className="absolute top-4 right-4">{statusBadge(r)}</div>

              {/* Header (add right padding so text never sits under the badge) */}
              <div className="flex items-start gap-3 pr-20">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <BsBank size={18} />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{r.bank_name}</div>
                  <div className="text-xs text-gray-500">Updated {formatDate(r.updated_at)}</div>
                </div>
              </div>

              {/* Pair + Rate */}
              <div className="mt-4">
                <div className="text-sm text-gray-500">Pair</div>
                <div className="text-lg font-semibold">
                  {r.from_code} → {r.to_code}{" "}
                  <span className="badge badge-outline ml-2">{r.to_currency_name?.trim()}</span>
                </div>
              </div>

              <div className="mt-2">
                <div className="text-sm text-gray-500">Rate</div>
                <div className="text-3xl font-bold tracking-tight">{Number(r.rate).toFixed(4)}</div>
              </div>

              {/* Converter */}
              <div className="mt-4 p-3 rounded-lg bg-base-200">
                <div className="text-sm text-gray-600">If you convert</div>
                <div className="text-lg font-semibold">
                  {myr.toLocaleString(undefined, { maximumFractionDigits: 2 })} MYR
                  <span className="mx-2">→</span>
                  {Number.isFinite(converted)
                    ? converted.toLocaleString(undefined, { maximumFractionDigits: 2 })
                    : "—"}{" "}
                  {r.to_code}
                </div>
              </div>

              {/* Validity */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="text-gray-500">
                  Valid until: <span className="font-medium">{formatDate(r.expiry_date)}</span>
                </div>
                <div
                  className={`font-semibold ${
                    r.is_expired ? "text-error" : left <= 7 ? "text-warning" : "text-success"
                  }`}
                >
                  {r.is_expired ? "Expired" : `${left} day${left === 1 ? "" : "s"} left`}
                </div>
              </div>
            </div>
          </div>
        );
      })}
</div>

      {/* Error state */}
      {err && (
        <div className="alert alert-error">
          <span>Failed to load rates: {err}</span>
        </div>
      )}

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
