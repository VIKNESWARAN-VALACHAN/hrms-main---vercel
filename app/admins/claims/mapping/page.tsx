'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../../../utils/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface MappingRow {
  id: number;
  employee_id: number;
  employee_name: string;
  department_name: string;
  company_name: string;
  benefit_type: string;
  is_active: number;
  claimed: number;
  balance: number;
  frequency: string;
  effective_from: string;
  effective_to: string;
}

interface Option {
  id: number;
  name: string;
}

export default function UserEntitlementMappingPage() {
  const [rows, setRows] = useState<MappingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);

  const [formData, setFormData] = useState({
    employee_id: '',
    benefit_type_id: '',
    is_active: '1',
    amount: '0.00',
    frequency: 'Yearly',
    effective_from: '',
    effective_to: ''
  });

  const [groupData, setGroupData] = useState({
    company_id: '',
    benefit_type_id: '',
    amount: '0.00',
    frequency: 'Yearly',
    effective_from: '',
    effective_to: '',
    is_active: '1'
  });

  const [employees, setEmployees] = useState<Option[]>([]);
  const [benefitTypes, setBenefitTypes] = useState<Option[]>([]);
  const [companies, setCompanies] = useState<Option[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);


  const fetchMappingData = async () => {
  setLoading(true);
  try {
    const res = await api.get(`/api/employee-benefits`);
    const data = res.data || [];

    const enriched = data.map((item: any) => {
      // Safely parse numeric values with fallbacks
      const amount = parseFloat(item.amount) || 0;
      const claimed = parseFloat(item.claimed) || 0;
      const balance = amount - claimed;

      // Debug log for each item
      console.log('Item values:', {
        id: item.id,
        rawAmount: item.amount,
        rawClaimed: item.claimed,
        parsedAmount: amount,
        parsedClaimed: claimed,
        calculatedBalance: balance
      });

      return {
        id: item.id,
        employee_id: item.employee_id,
        employee_name: item.employee_name,
        department_name: item.department_name || '-',
        company_name: item.company_name || '-',
        benefit_type: item.benefit_name,
        is_active: parseInt(item.is_active) || 0,
        claimed: claimed,
        balance: balance,
        frequency: item.frequency || '-',
        effective_from: item.effective_from 
          ? new Date(item.effective_from).toISOString().split('T')[0] 
          : '-',
        effective_to: item.effective_to 
          ? new Date(item.effective_to).toISOString().split('T')[0] 
          : '-'
      };
    });

    setRows(enriched);
  } catch (err: any) {
    console.error('Error fetching mapping data:', err);
    toast.error(err.message || 'Failed to fetch mapping data.');
  } finally {
    setLoading(false);
  }
};

  const fetchMappingData1 = async () => {
  setLoading(true);
  try {
    const res = await api.get(`/api/employee-benefits`);
    const data = res.data || []; // assuming data is in res.data
    
console.log('Raw values:', {
  amount: data.item.amount,
  claimed: data.item.claimed,
  parsedAmount: parseFloat(data.item.amount),
  parsedClaimed: parseFloat(data.item.claimed)
});

    const enriched = data.map((item: any) => ({
      id: item.id,
      employee_id: item.employee_id,
      employee_name: item.employee_name,
      department_name: item.department_name || '-',
      company_name: item.company_name || '-',
      benefit_type: item.benefit_name,
      is_active: parseInt(item.is_active),
      claimed: parseFloat(item.claimed || '0'),
      balance: parseFloat(item.amount) - parseFloat(item.claimed || '0'),
      frequency: item.frequency || '-',
      effective_from: item.effective_from ? new Date(item.effective_from).toISOString().split('T')[0] : '-',
      effective_to: item.effective_to ? new Date(item.effective_to).toISOString().split('T')[0] : '-'
    
    
    }));
    
    
    setRows(enriched);

    
  } catch (err: any) {
    toast.error(err.message || 'Failed to fetch mapping data.');
  } finally {
    setLoading(false);
  }
};

  const fetchDropdowns = async () => {
    try {
      const empRes = await api.get(`/api/admin/employees`);
      const benefitRes = await api.get(`/api/benefits`);
      const companyRes = await api.get(`/api/companies`);

      const mappedCompanies = companyRes.map((c: any) => ({
        id: c.id ?? c.company_id,
        name: c.name ?? c.company_name ?? `Company ${c.id || c.company_id}`
      }));

      setEmployees(empRes);
      setBenefitTypes(benefitRes);
      setCompanies(mappedCompanies);
    } catch (err: any) {
      toast.error('Failed to fetch dropdown data');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setGroupData({ ...groupData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.employee_id || !formData.benefit_type_id) {
      toast.error('Employee and Benefit Type are required');
      return;
    }

    try {
      const payload = {
        ...formData,
        is_active: parseInt(formData.is_active),
        amount: parseFloat(formData.amount),
        effective_from: formData.effective_from || null,
        effective_to: formData.effective_to || null
      };

      if (editingId) {
        await api.put(`/api/employee-benefits/${editingId}`, payload);
        toast.success('Mapping updated successfully');
      } else {
        await api.post(`/api/employee-benefits`, payload);
        toast.success('Mapping added successfully');
      }

      setShowAddModal(false);
      setEditingId(null);
      fetchMappingData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save mapping');
    }
  };

  const handleGroupSave = async () => {
    if (!groupData.company_id || !groupData.benefit_type_id) {
      toast.error('Company and Benefit Type are required');
      return;
    }

    try {
      const payload = {
        ...groupData,
        amount: parseFloat(groupData.amount),
        is_active: parseInt(groupData.is_active),
        effective_from: groupData.effective_from || null,
        effective_to: groupData.effective_to || null
      };

      await api.post(`/api/employee-benefits/group-by-company`, payload);
      toast.success('Group mapping added successfully');
      setShowGroupModal(false);
      fetchMappingData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save group mapping');
    }
  };

  const handleEdit = (row: MappingRow) => {
    setFormData({
      employee_id: row.employee_id.toString(),
      benefit_type_id: benefitTypes.find(bt => bt.name === row.benefit_type)?.id.toString() || '',
      is_active: row.is_active.toString(),
      amount: row.balance.toFixed(2),
      frequency: row.frequency,
      effective_from: row.effective_from !== '-' ? row.effective_from : '',
      effective_to: row.effective_to !== '-' ? row.effective_to : ''
    });
    setEditingId(row.id);
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this mapping?')) {
      try {
        await api.delete(`/api/employee-benefits/${id}`);
        toast.success('Mapping deleted successfully');
        fetchMappingData();
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete mapping');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      employee_id: '',
      benefit_type_id: '',
      is_active: '1',
      amount: '0.00',
      frequency: 'Yearly',
      effective_from: '',
      effective_to: ''
    });
    setEditingId(null);
  };

  useEffect(() => {
    fetchMappingData();
    fetchDropdowns();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employee Benefit Entitlement Mapping</h1>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>+ Add Mapping</button>
          <button className="btn btn-secondary" onClick={() => setShowGroupModal(true)}>+ Group Mapping</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Employee</th>
                {/* <th>Company</th>
                <th>Department</th> */}
                <th>Benefit</th>
                <th>Status</th>
                <th>Claimed</th>
                <th>Balance</th>
                <th>Frequency</th>
                <th>Effective From</th>
                <th>Effective To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td>{row.employee_name}</td>
                  {/* <td>{row.company_name}</td>
                  <td>{row.department_name}</td> */}
                  <td>{row.benefit_type}</td>
                  <td>{row.is_active ? 'Active' : 'Inactive'}</td>
                  <td>RM {row.claimed.toFixed(2)}</td>
                  <td className="font-bold text-green-600">
                    RM {!isNaN(row.balance) ? row.balance.toFixed(2) : '0.00'}
                  </td>
                  <td>{row.frequency}</td>
                  <td>{row.effective_from}</td>
                  <td>{row.effective_to}</td>
                  <td>
                    <div className="dropdown dropdown-bottom">
                      <button tabIndex={0} className="btn btn-sm">Action</button>
                      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
                        <li><a onClick={() => handleEdit(row)}>Edit</a></li>
                        <li><a onClick={() => handleDelete(row.id)}>Delete</a></li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center text-gray-500 py-4">No data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Mapping Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[500px]">
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Mapping' : 'Add Mapping'}</h2>
            <div className="space-y-3">
              <select name="employee_id" value={formData.employee_id} onChange={handleInputChange} className="select select-bordered w-full">
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>

              <select name="benefit_type_id" value={formData.benefit_type_id} onChange={handleInputChange} className="select select-bordered w-full">
                <option value="">Select Benefit Type</option>
                {benefitTypes.map(bt => (
                  <option key={bt.id} value={bt.id}>{bt.name}</option>
                ))}
              </select>

              <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="Amount" className="input input-bordered w-full" />

              <select name="frequency" value={formData.frequency} onChange={handleInputChange} className="select select-bordered w-full">
                <option value="Yearly">Yearly</option>
                <option value="Monthly">Monthly</option>
              </select>

              <select name="is_active" value={formData.is_active} onChange={handleInputChange} className="select select-bordered w-full">
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>

              <DatePicker selected={formData.effective_from ? new Date(formData.effective_from) : null} onChange={(date: Date | null) => {
                setFormData(prev => ({ ...prev, effective_from: date ? date.toISOString().split('T')[0] : '' }));
              }} placeholderText="Effective From" className="input input-bordered w-full" />

              <DatePicker selected={formData.effective_to ? new Date(formData.effective_to) : null} onChange={(date: Date | null) => {
                setFormData(prev => ({ ...prev, effective_to: date ? date.toISOString().split('T')[0] : '' }));
              }} placeholderText="Effective To" className="input input-bordered w-full" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Group Mapping Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[500px]">
            <h2 className="text-xl font-semibold mb-4">Group Mapping by Company</h2>
            <div className="space-y-3">
              <select name="company_id" value={groupData.company_id} onChange={handleGroupChange} className="select select-bordered w-full">
                <option value="">Select Company</option>
                {companies.map((comp, index) => (
                  <option key={comp.id ? `company-${comp.id}` : `company-fallback-${index}`} value={comp.id}>
                    {comp.name ?? `Unnamed Company ${index + 1}`}
                  </option>
                ))}
              </select>

              <select name="benefit_type_id" value={groupData.benefit_type_id} onChange={handleGroupChange} className="select select-bordered w-full">
                <option value="">Select Benefit Type</option>
                {benefitTypes.map((bt) => (
                  <option key={`bt-${bt.id}`} value={bt.id}>{bt.name}</option>
                ))}
              </select>

              <input name="amount" type="number" value={groupData.amount} onChange={handleGroupChange} placeholder="Amount" className="input input-bordered w-full" />

              <select name="frequency" value={groupData.frequency} onChange={handleGroupChange} className="select select-bordered w-full">
                <option value="Yearly">Yearly</option>
                <option value="Monthly">Monthly</option>
              </select>

              <select name="is_active" value={groupData.is_active} onChange={handleGroupChange} className="select select-bordered w-full">
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>

              <DatePicker selected={groupData.effective_from ? new Date(groupData.effective_from) : null} onChange={(date: Date | null) => {
                setGroupData(prev => ({ ...prev, effective_from: date ? date.toISOString().split('T')[0] : '' }));
              }} placeholderText="Effective From" className="input input-bordered w-full" />

              <DatePicker selected={groupData.effective_to ? new Date(groupData.effective_to) : null} onChange={(date: Date | null) => {
                setGroupData(prev => ({ ...prev, effective_to: date ? date.toISOString().split('T')[0] : '' }));
              }} placeholderText="Effective To" className="input input-bordered w-full" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-ghost" onClick={() => setShowGroupModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleGroupSave}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
