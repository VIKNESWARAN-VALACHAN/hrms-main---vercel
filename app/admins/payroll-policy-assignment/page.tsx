'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import PayrollPolicyAssignmentForm, { PayrollPolicyAssignment } from './form';
import { API_BASE_URL } from '../../config';
import { api } from '../../utils/api';

export interface Company { id: number; name: string; }
export interface Department { id: number; department_name: string; }
export interface PayrollConfig { id: number; pay_interval: string; }

export default function PayrollPolicyAssignmentPage() {
  const [assignments, setAssignments] = useState<PayrollPolicyAssignment[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [configs, setConfigs] = useState<PayrollConfig[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<PayrollPolicyAssignment> | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // Use the api util (all endpoints are relative!)
      const [a, c, d, p] = await Promise.all([
        api.get(`${API_BASE_URL}/api/payroll-policy-assignments`),
        api.get(`${API_BASE_URL}/api/admin/companies`),
        api.get(`${API_BASE_URL}/api/admin/departments`),
        api.get(`${API_BASE_URL}/api/payroll-config/configs`),
      ]);
      setAssignments(a);
      setCompanies(c);
      setDepartments(d);
      setConfigs(p);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load data');
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSave = () => {
    setShowModal(false); setFormData(null); setEditId(null); fetchAll();
  };

  const handleEdit = (item: PayrollPolicyAssignment) => {
    setFormData(item); 
    setEditId(item.id!); 
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this assignment?')) return;
    try {
      await api.delete(`${API_BASE_URL}/api/payroll-policy-assignments/${id}`);
      toast.success('Deleted!');
      fetchAll();
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const filtered = assignments.filter(a =>
    (a.company_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.department_name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payroll Policy Assignments</h1>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setFormData(null); setEditId(null); }}>
          + Add Assignment
        </button>
      </div>
      <input
        className="input input-bordered w-full mb-4"
        placeholder="Search company/department"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Payroll Config</th>
              <th>Company</th>
              <th>Department</th>
              <th>Start</th>
              <th>End</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{configs.find(c => c.id === a.payroll_config_id)?.pay_interval || '-'}</td>
                <td>{companies.find(c => c.id === a.company_id)?.name || '-'}</td>
                <td>{departments.find(d => d.id === a.department_id)?.department_name || '-'}</td>
                <td>{a.start_date}</td>
                <td>{a.end_date}</td>
                <td>{a.is_active ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn btn-xs btn-warning mr-2" onClick={() => handleEdit(a)}>Edit</button>
                  <a className="btn btn-xs btn-info mr-2" href={`payroll-policy-assignment/${a.id}`}>View</a>
                  <button className="btn btn-xs btn-error" onClick={() => handleDelete(a.id!)}>Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="text-center">No data</td></tr>}
          </tbody>
        </table>
      </div>
      {showModal && (
        <PayrollPolicyAssignmentForm
          mode={editId ? 'edit' : 'add'}
          initialData={formData || undefined}
          configs={configs}
          companies={companies}
          departments={departments}
          onSave={handleSave}
          onCancel={() => { setShowModal(false); setEditId(null); setFormData(null); }}
        />
      )}
    </div>
  );
}
