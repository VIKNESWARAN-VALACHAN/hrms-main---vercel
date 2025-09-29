// File: app/admins/payroll/tabs/DetailTab.tsx
"use client";

import { useEffect, useState, useCallback  } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from '../../../config';

interface PayrollVersion {
  version_id: number;
  version_number: number;
  snapshot: any;
  created_at: string;
  created_by_name: string;
}

interface PayrollDetail {
  id: number;
  employee_name: string;
  gross_salary: number;
  net_salary: number;
  status_code: string;
  created_at: string;
}

export default function DetailTab() {
  const searchParams = useSearchParams();
  const payrollId = searchParams.get("payrollId");

  const [payroll, setPayroll] = useState<PayrollDetail | null>(null);
  const [versions, setVersions] = useState<PayrollVersion[]>([]);
  const [loading, setLoading] = useState(true);



  const fetchData = useCallback(async () => {//async () => {
    try {
      const [payrollRes, versionsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/payroll/${payrollId}`),
        axios.get(`${API_BASE_URL}/api/payroll/${payrollId}/versions`),
      ]);
      setPayroll(payrollRes.data);
      setVersions(versionsRes.data);
    } catch (error) {
      console.error("Failed to fetch payroll detail or versions", error);
    } finally {
      setLoading(false);
    }
    }, [payrollId]); //};

  // useEffect(() => {
  //   if (payrollId) {
  //     fetchData();
  //   }
  // }, [payrollId]);

    useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRollback = async (versionId: number) => {
    const confirm = window.confirm("Are you sure you want to rollback to this version?");
    if (!confirm) return;

    try {
      await axios.post(`${API_BASE_URL}/api/payroll/${payrollId}/rollback/${versionId}`);
      alert("Rollback successful");
      fetchData();
    } catch (error) {
      alert("Rollback failed");
      console.error("Rollback error", error);
    }
  };

  if (loading) return <div>Loading payroll detail...</div>;
  if (!payroll) return <div>No payroll detail found.</div>;

  return (
    <div className="card bg-white shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Payroll Detail</h2>
      <div className="mb-4">
        <p><strong>Employee:</strong> {payroll.employee_name}</p>
        <p><strong>Status:</strong> {payroll.status_code}</p>
        <p><strong>Gross Salary:</strong> RM {payroll.gross_salary}</p>
        <p><strong>Net Salary:</strong> RM {payroll.net_salary}</p>
        <p><strong>Created At:</strong> {payroll.created_at}</p>
      </div>

      <h3 className="text-xl font-semibold mb-2">Version History</h3>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Version</th>
            <th>Created By</th>
            <th>Timestamp</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {versions.map((v) => (
            <tr key={v.version_id}>
              <td>{v.version_number}</td>
              <td>{v.created_by_name}</td>
              <td>{new Date(v.created_at).toLocaleString()}</td>
              <td>
                <button className="btn btn-xs btn-warning" onClick={() => handleRollback(v.version_id)}>
                  Rollback
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
