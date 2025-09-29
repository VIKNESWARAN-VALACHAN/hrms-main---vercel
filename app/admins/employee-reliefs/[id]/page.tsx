'use client';

import { useEffect, useState,useCallback  } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api } from '../../../utils/api';
import { API_BASE_URL } from '../../../config';

interface ReliefItem {
  id?: number;
  relief_id: number;
  relief_name?: string;
  relief_amount?: number;
}

interface Employee {
  id: number;
  name: string;
}

interface ReliefOption {
  id: number;
  name: string;
  amount: number;
}

export default function EmployeeReliefDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [employeeId, setEmployeeId] = useState<number>(0);
  const [reliefs, setReliefs] = useState<ReliefItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [reliefOptions, setReliefOptions] = useState<ReliefOption[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {//async () => {
    try {
      const res = await api.get(`${API_BASE_URL}/api/employee-reliefs/${id}`);
      if (res.length > 0) {
        setEmployeeId(res[0].employee_id);
        setReliefs(
          res.map((r: any) => ({
            id: r.id,
            relief_id: r.relief_id,
            relief_name: r.relief_name,
            relief_amount: parseFloat(r.relief_amount),
          }))
        );
      }

      const emps = await api.get(`${API_BASE_URL}/api/admin/employees`);
      const rels = await api.get(`${API_BASE_URL}/api/master-data/reliefs`);
      setEmployees(emps);
      setReliefOptions(rels);
    } catch (err: any) {
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, [id]);//};

  useEffect(() => {
    if (id) fetchData();
  }, [id,fetchData]);

  const handleSave = async () => {
    try {
      await api.put(`${API_BASE_URL}/api/employee-reliefs/${id}`, {
        employee_id: employeeId,
        reliefs: reliefs.map((r) => ({
          id: r.id,
          relief_id: r.relief_id,
        })),
      });
      toast.success('Updated successfully!');
      setEditing(false);
      fetchData(); // refresh after save
    } catch (err: any) {
      toast.error('Failed to update.');
    }
  };

  const handleAddRelief = () => {
    setReliefs([...reliefs, { relief_id: reliefOptions[0]?.id || 0 }]);
  };

  const handleReliefChange = (index: number, value: number) => {
    const updated = [...reliefs];
    updated[index].relief_id = value;
    const reliefDetail = reliefOptions.find((r) => r.id === value);
    if (reliefDetail) {
      updated[index].relief_name = reliefDetail.name;
      updated[index].relief_amount = reliefDetail.amount;
    }
    setReliefs(updated);
  };

  const handleDeleteRelief = (index: number) => {
    const updated = [...reliefs];
    updated.splice(index, 1);
    setReliefs(updated);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Employee Relief Detail</h1>

      <div className="mb-4">
        <label className="block font-medium mb-1">Employee</label>
        <select className="input input-bordered w-full" value={employeeId} disabled>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Assigned Reliefs</label>
        {reliefs.length === 0 && <div className="text-gray-500">No reliefs assigned.</div>}
        {reliefs.map((relief, index) => (
          <div key={index} className="flex gap-2 mb-2 items-center">
            <select
              className="input input-bordered w-full"
              value={relief.relief_id}
              disabled={!editing}
              onChange={(e) => handleReliefChange(index, parseInt(e.target.value))}
            >
              {reliefOptions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (RM {r.amount})
                </option>
              ))}
            </select>
            {editing && (
              <button
                className="btn btn-sm btn-error"
                onClick={() => handleDeleteRelief(index)}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {editing && (
          <button className="btn btn-sm btn-outline mt-2" onClick={handleAddRelief}>
            + Add Relief
          </button>
        )}
      </div>

      <div className="flex gap-2 mt-6">
        {editing ? (
          <>
            <button className="btn btn-success" onClick={handleSave}>
              Save All
            </button>
            <button className="btn btn-secondary" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-primary" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => router.push('/admins/employee-reliefs')}
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}