// app/config/bank-currency/rates/public.tsx

'use client';

import { useEffect, useState } from 'react';
import moment from 'moment';
import { API_BASE_URL } from '@/app/config';
import { toast } from 'react-hot-toast';

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

interface Bank {
  id: number;
  bank_name: string;
}

interface Currency {
  code: string;
  name: string;
}

// Utility function for expiry status
const getExpiryStatus = (expiryDate: string) => {
  const daysLeft = moment(expiryDate).diff(moment(), 'days');
  
  if (daysLeft < 0) {
    return { status: 'expired', class: 'bg-red-50', badge: 'Expired', badgeClass: 'badge-error' };
  }
  if (daysLeft <= 3) {
    return { 
      status: 'critical', 
      class: 'bg-red-100', 
      badge: `Expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`, 
      badgeClass: 'badge-error' 
    };
  }
  if (daysLeft <= 7) {
    return { 
      status: 'warning', 
      class: 'bg-yellow-50', 
      badge: `Expires in ${daysLeft} days`, 
      badgeClass: 'badge-warning' 
    };
  }
  return { status: 'ok', class: '', badge: '', badgeClass: '' };
};

export default function PublicCurrencyRateViewer() {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [filteredRates, setFilteredRates] = useState<CurrencyRate[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [filters, setFilters] = useState({ bank: '', currency: '' });
  const [amount, setAmount] = useState<number>(1);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRate, setSelectedRate] = useState<CurrencyRate | null>(null);
  const [rateHistory, setRateHistory] = useState<CurrencyRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newRate, setNewRate] = useState({
    bank_id: 0,
    to_code: '',
    rate: '',
    effective_date: moment().format('YYYY-MM-DD'),
    expiry_date: moment().add(1, 'month').format('YYYY-MM-DD'),
    updated_by: 'admin@example.com'
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [ratesRes, banksRes, currenciesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/bank-currency/rates/active`),
          fetch(`${API_BASE_URL}/api/bank-currency/banks`),
          fetch(`${API_BASE_URL}/api/bank-currency/currencies`)
        ]);

        if (!ratesRes.ok || !banksRes.ok || !currenciesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const ratesData = await ratesRes.json();
        const banksData = await banksRes.json();
        const currenciesData = await currenciesRes.json();

        const validRates = Array.isArray(ratesData) 
          ? ratesData.filter((r: CurrencyRate) => r.is_expired === 0)
          : [];

        setRates(validRates);
        setFilteredRates(validRates);
        setBanks(Array.isArray(banksData) ? banksData : []);
        setCurrencies(Array.isArray(currenciesData) ? currenciesData : []);
      } catch (error: any) {
        console.error('Failed to fetch data:', error);
        toast.error(error.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setFilteredRates(
      rates.filter(r =>
        (!filters.bank || r.bank_name === filters.bank) &&
        (!filters.currency || r.to_code === filters.currency)
      )
    );
  }, [filters, rates]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNewModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setShowHistoryModal(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAdd = async () => {
    if (!newRate.bank_id || !newRate.to_code || !newRate.rate) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        bank_id: newRate.bank_id,
        from_code: 'USD',
        to_code: newRate.to_code,
        rate: parseFloat(newRate.rate),
        effective_date: newRate.effective_date,
        expiry_date: newRate.expiry_date,
        updated_by: newRate.updated_by
      };

      console.log(payload);
      const response = await fetch(`${API_BASE_URL}/api/bank-currency/rates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add rate');
      }

      toast.success('Rate added successfully');
      setShowNewModal(false);
      
      // Refresh rates
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/rates/active`);
      const data = await res.json();
      setRates(data.filter((r: CurrencyRate) => r.is_expired === 0));
      
      // Reset form
      setNewRate({
        bank_id: 0,
        to_code: '',
        rate: '',
        effective_date: moment().format('YYYY-MM-DD'),
        expiry_date: moment().add(1, 'month').format('YYYY-MM-DD'),
        updated_by: 'admin@example.com'
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add rate');
      console.error('Add rate error:', error);
    }
  };

  const handleEdit = async () => {
    if (!selectedRate) return;
    
    try {
      const payload = {
        bank_id: selectedRate.bank_id,
        rate: parseFloat(selectedRate.rate),
        effective_date: moment(selectedRate.effective_date).format('YYYY-MM-DD'),
        expiry_date: moment(selectedRate.expiry_date).format('YYYY-MM-DD'),
        is_expired: selectedRate.is_expired,
        updated_by: 'admin@example.com'
      };

      const response = await fetch(`${API_BASE_URL}/api/bank-currency/rates/${selectedRate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update rate');
      }

      toast.success('Rate updated successfully');
      setShowEditModal(false);
      
      // Refresh rates
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/rates/active`);
      const newRates = await res.json();
      setRates(newRates.filter((r: CurrencyRate) => r.is_expired === 0));
    } catch (error: any) {
      console.error('Update rate error:', error);
      toast.error(error.message || 'Failed to update rate');
    }
  };

  const fetchRateHistory = async (bankId: number, currencyCode: string) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/bank-currency/rates/history?bank_id=${bankId}&to_code=${currencyCode}`
      );
      
      if (!res.ok) {
        throw new Error('Failed to fetch history');
      }

      const data = await res.json();
      setRateHistory(Array.isArray(data) ? data : []);
      setShowHistoryModal(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch rate history');
      console.error('Fetch history error:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedRate) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/bank-currency/rates/${selectedRate.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete rate');
      }

      toast.success('Rate deleted successfully');
      setShowDeleteModal(false);
      
      // Refresh rates
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/rates/active`);
      const data = await res.json();
      setRates(data.filter((r: CurrencyRate) => r.is_expired === 0));
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete rate');
      console.error('Delete rate error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-gray-600">Loading currency rates...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white-800">Currency Conversion Viewer</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowNewModal(true)}
        >
          Add New Currency Rate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          className="select select-bordered bg-white text-gray-800"
          value={filters.bank}
          onChange={e => setFilters({ ...filters, bank: e.target.value })}
        >
          <option value="">All Banks</option>
          {banks.map(b => (
            <option key={b.id} value={b.bank_name}>{b.bank_name}</option>
          ))}
        </select>

        <select
          className="select select-bordered bg-white text-gray-800"
          value={filters.currency}
          onChange={e => setFilters({ ...filters, currency: e.target.value })}
        >
          <option value="">All Currencies</option>
          {currencies.map(c => (
            <option key={c.code} value={c.code}>{c.code}</option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          value={amount}
          onChange={e => setAmount(parseFloat(e.target.value) || 1)}
          className="input input-bordered bg-white text-gray-800"
          placeholder="Amount (e.g. 1)"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="py-3 px-4">Bank</th>
              <th className="py-3 px-4">Conversion</th>
              <th className="py-3 px-4">Rate</th>
              <th className="py-3 px-4">Converted</th>
              <th className="py-3 px-4">Valid From</th>
              <th className="py-3 px-4">Until</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredRates.length > 0 ? (
              filteredRates.map(rate => {
                const expiryStatus = getExpiryStatus(rate.expiry_date);
                
                return (
                  <tr 
                    key={rate.id} 
                    className={`hover:bg-gray-50 ${expiryStatus.class}`}
                  >
                    <td className="py-3 px-4">{rate.bank_name}</td>
                    <td className="py-3 px-4">
                      {amount} {rate.from_code} → {rate.to_code}
                      {rate.to_currency_name ? ` (${rate.to_currency_name})` : ''}
                    </td>
                    <td className="py-3 px-4">{parseFloat(rate.rate).toFixed(4)}</td>
                    <td className="py-3 px-4">{(parseFloat(rate.rate) * amount).toFixed(4)}</td>
                    <td className="py-3 px-4">{moment(rate.effective_date).format('DD MMM YYYY')}</td>
                    <td className="py-3 px-4">
                      {moment(rate.expiry_date).format('DD MMM YYYY')}
                      {expiryStatus.badge && (
                        <span className={`ml-2 badge ${expiryStatus.badgeClass} text-white text-xs`}>
                          {expiryStatus.badge}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-xs btn-info text-white"
                          onClick={() => {
                            setSelectedRate(rate);
                            setShowEditModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-xs btn-warning text-white"
                          onClick={() => fetchRateHistory(rate.bank_id, rate.to_code)}
                        >
                          History
                        </button>
                        <button 
                          className="btn btn-xs btn-error text-white"
                          onClick={() => {
                            setSelectedRate(rate);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No rates found</h3>
                    <p className="mt-1 text-gray-500">
                      {filters.bank || filters.currency 
                        ? "Try adjusting your filters" 
                        : "No currency rates are currently available"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Rate Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Currency Rate</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Bank*</label>
                  <select
                    className="select select-bordered w-full bg-white text-gray-800"
                    value={newRate.bank_id}
                    onChange={(e) => setNewRate({ ...newRate, bank_id: parseInt(e.target.value) })}
                  >
                    <option value={0}>Select Bank</option>
                    {banks.map((b) => (
                      <option key={b.id} value={b.id}>{b.bank_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Currency*</label>
                  <select
                    className="select select-bordered w-full bg-white text-gray-800"
                    value={newRate.to_code}
                    onChange={async (e) => {
                      const selectedCode = e.target.value;
                      setNewRate({ ...newRate, to_code: selectedCode });

                      if (newRate.bank_id && selectedCode) {
                        try {
                          const res = await fetch(
                            `${API_BASE_URL}/api/bank-currency/rates/history?bank_id=${newRate.bank_id}&to_code=${selectedCode}`
                          );
                          const data = await res.json();
                          if (data?.rate) {
                            setNewRate(prev => ({ ...prev, rate: data.rate }));
                          }
                        } catch {
                          toast.error('Failed to fetch exchange rate');
                        }
                      }
                    }}
                  >
                    <option value="">Select Currency</option>
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Exchange Rate*</label>
                  <input
                    type="number"
                    step="0.0001"
                    className="input input-bordered w-full bg-white text-gray-800"
                    placeholder="Exchange Rate"
                    value={newRate.rate}
                    onChange={(e) => setNewRate({ ...newRate, rate: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Effective Date*</label>
                    <input
                      type="date"
                      className="input input-bordered w-full bg-white text-gray-800"
                      value={newRate.effective_date}
                      onChange={(e) => setNewRate({ ...newRate, effective_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Expiry Date*</label>
                    <input
                      type="date"
                      className="input input-bordered w-full bg-white text-gray-800"
                      value={newRate.expiry_date}
                      onChange={(e) => setNewRate({ ...newRate, expiry_date: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  className="btn btn-ghost text-gray-700"
                  onClick={() => setShowNewModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-success text-white"
                  onClick={handleAdd}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Rate Modal */}
      {showEditModal && selectedRate && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Currency Rate</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Bank</label>
                  <div className="input input-bordered w-full bg-gray-100 text-gray-800 py-2 px-4">
                    {selectedRate.bank_name}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Currency</label>
                  <div className="input input-bordered w-full bg-gray-100 text-gray-800 py-2 px-4">
                    {selectedRate.from_code} → {selectedRate.to_code}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Exchange Rate*</label>
                  <input
                    type="number"
                    step="0.0001"
                    className="input input-bordered w-full bg-white text-gray-800"
                    value={selectedRate.rate}
                    onChange={(e) => setSelectedRate({
                      ...selectedRate,
                      rate: e.target.value
                    })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Effective Date*</label>
                    <input
                      type="date"
                      className="input input-bordered w-full bg-white text-gray-800"
                      value={moment(selectedRate.effective_date).format('YYYY-MM-DD')}
                      onChange={(e) => setSelectedRate({
                        ...selectedRate,
                        effective_date: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Expiry Date*</label>
                    <input
                      type="date"
                      className="input input-bordered w-full bg-white text-gray-800"
                      value={moment(selectedRate.expiry_date).format('YYYY-MM-DD')}
                      onChange={(e) => setSelectedRate({
                        ...selectedRate,
                        expiry_date: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  className="btn btn-ghost text-gray-700"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-success text-white"
                  onClick={handleEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRate && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete the rate for {selectedRate.bank_name} ({selectedRate.from_code} → {selectedRate.to_code})?
              </p>
              
              <div className="flex justify-end gap-3">
                <button 
                  className="btn btn-ghost text-gray-700"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-error text-white"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rate History Modal */}
      {showHistoryModal && selectedRate && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Rate History for {selectedRate.bank_name} ({selectedRate.from_code} → {selectedRate.to_code})
                </h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowHistoryModal(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-[60vh]">
                <table className="table w-full">
                  <thead className="bg-gray-100 text-gray-800 sticky top-0">
                    <tr>
                      <th className="py-3 px-4">Rate</th>
                      <th className="py-3 px-4">Change</th>
                      <th className="py-3 px-4">From Date</th>
                      <th className="py-3 px-4">To Date</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
               <tbody className="text-gray-700">
  {rateHistory.length > 0 ? (
    rateHistory.map((rate, index) => {
      const prevRate = rateHistory[index + 1];
      const change = prevRate 
        ? ((parseFloat(rate.rate) - parseFloat(prevRate.rate)) / parseFloat(prevRate.rate) * 100) : 0  // Added missing parenthesis and default value
      
      return (
        <tr key={rate.id} className="hover:bg-gray-50">
          <td className="py-3 px-4">{parseFloat(rate.rate).toFixed(4)}</td>
          <td className="py-3 px-4">
            {prevRate && (
              <span className={`text-xs ${
                change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
              }`}>
                {change > 0 ? '↑' : change < 0 ? '↓' : '→'} {Math.abs(change).toFixed(2)}%
              </span>
            )}
          </td>
          <td className="py-3 px-4">{moment(rate.effective_date).format('DD MMM YYYY')}</td>
          <td className="py-3 px-4">{moment(rate.expiry_date).format('DD MMM YYYY')}</td>
          <td className="py-3 px-4">
            {rate.is_expired ? (
              <span className="badge badge-error text-white">Expired</span>
            ) : (
              <span className="badge badge-success text-white">Active</span>
            )}
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={5} className="py-4 text-center text-gray-500">
        No historical rates found
      </td>
    </tr>
  )}
</tbody>
                </table>
              </div>

              <div className="flex justify-end mt-4">
                <button 
                  className="btn btn-ghost text-gray-700"
                  onClick={() => setShowHistoryModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}