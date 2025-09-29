'use client';

import { useEffect, useState } from 'react';
import moment from 'moment';
import { API_BASE_URL } from '@/app/config';

interface CurrencyRate {
  id: number;
  bank_id: number;
  from_code: string;
  to_code: string;
  rate: string;
  effective_date: string;
  expiry_date: string;
  is_expired: number;
  bank_name: string;
  to_currency_name?: string;
}

export default function PublicCurrencyRateViewer() {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [filteredRates, setFilteredRates] = useState<CurrencyRate[]>([]);
  const [banks, setBanks] = useState<string[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [filters, setFilters] = useState({ bank: '', currency: '' });
  const [amount, setAmount] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/bank-currency/rates/active`);
        const data = await res.json();

        const validRates = (data as CurrencyRate[]).filter(r => r.is_expired === 0);
        validRates.sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate));

        setRates(validRates);
        setFilteredRates(validRates);
        setBanks([...new Set(validRates.map(r => r.bank_name))]);
        setCurrencies([...new Set(validRates.map(r => r.to_code))]);
      } catch {
        console.error('Failed to fetch rates');
      }
    };

    fetchRates();
  }, []);

  useEffect(() => {
    setFilteredRates(
      rates.filter(r =>
        (!filters.bank || r.bank_name === filters.bank) &&
        (!filters.currency || r.to_code === filters.currency)
      )
    );
  }, [filters, rates]);

const formatCurrency = (value: number, currencyCode: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2
  }).format(value);


  const colorMap: Record<string, string> = {
    THB: 'bg-blue-100',
    VND: 'bg-blue-200',
    PHP: 'bg-blue-300',
    USD: 'bg-blue-400',
    IDR: 'bg-blue-500',
    default: 'bg-blue-100'
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Currency Conversion Viewer</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          className="select select-bordered"
          value={filters.bank}
          onChange={e => setFilters({ ...filters, bank: e.target.value })}
        >
          <option value="">All Banks</option>
          {banks.map(b => (
            <option key={b}>{b}</option>
          ))}
        </select>

        <select
          className="select select-bordered"
          value={filters.currency}
          onChange={e => setFilters({ ...filters, currency: e.target.value })}
        >
          <option value="">All Currencies</option>
          {currencies.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          value={amount}
          onChange={e => setAmount(parseFloat(e.target.value) || 1)}
          className="input input-bordered"
          placeholder="Amount (e.g. 1)"
        />

        <button
          onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
          className="btn btn-outline"
        >
          {viewMode === 'table' ? 'Card View' : 'Table View'}
        </button>
      </div>

      {viewMode === 'table' ? (
        <table className="table table-zebra w-full mb-10">
          <thead>
            <tr>
              <th>Bank</th>
              <th>Conversion</th>
              <th>Rate</th>
              <th>Converted</th>
              <th>Valid From</th>
              <th>Until</th>
            </tr>
          </thead>
          <tbody>
            {filteredRates.map(rate => (
              <tr key={rate.id}>
                <td>{rate.bank_name}</td>
                <td>
                  {amount} {rate.from_code} → {rate.to_code}
                  {rate.to_currency_name ? ` (${rate.to_currency_name})` : ''}
                </td>
                <td>{rate.rate}</td>
                {/* <td>{(parseFloat(rate.rate) * amount).toFixed(2)}</td> */}
                <td>{formatCurrency(parseFloat(rate.rate) * amount, rate.to_code)}</td>

                <td>{moment(rate.effective_date).format('YYYY-MM-DD')}</td>
                <td>{moment(rate.expiry_date).format('YYYY-MM-DD')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredRates.map(rate => (
            <div
              key={rate.id}
              className={`rounded-xl p-4 text-black shadow-md ${colorMap[rate.to_code] || colorMap.default}`}
            >
              <div className="text-sm font-semibold text-gray-600 mb-1">{rate.bank_name}</div>
              <div className="text-lg font-bold">
                {amount} {rate.from_code} → {rate.to_code}
              </div>
              <div className="text-md">
                Rate: <span className="font-semibold">{rate.rate}</span>
              </div>
              {/* <div className="text-md">
                Converted: <span className="font-semibold">{(parseFloat(rate.rate) * amount).toFixed(2)}</span>
              </div> */}
              <div className="text-md">
                Converted: <span className="font-semibold">
                  {formatCurrency(parseFloat(rate.rate) * amount, rate.to_code)}
                </span>
              </div>

              <div className="text-sm mt-1">
                {moment(rate.effective_date).format('D MMM YYYY')} - {moment(rate.expiry_date).format('D MMM YYYY')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
