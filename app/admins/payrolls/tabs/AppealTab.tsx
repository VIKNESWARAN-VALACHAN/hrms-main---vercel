// File: app/admins/payroll/tabs/AppealTab.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../../../config';

interface AppealRecord {
  id: number;
  employee_name: string;
  appeal_reason: string;
  status: string;
  created_at: string;
}

export default function AppealTab() {
  const [appeals, setAppeals] = useState<AppealRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppeals = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/payroll/appeals`);
      setAppeals(res.data);
    } catch (error) {
      console.error("Failed to fetch appeals", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, action: "approved" | "rejected") => {
    const confirm = window.confirm(`Are you sure you want to ${action} this appeal?`);
    if (!confirm) return;
    try {
      await axios.put(`${API_BASE_URL}/api/payroll/appeals/${id}/status`, { status: action });
      fetchAppeals();
    } catch (error) {
      console.error("Failed to update appeal status", error);
    }
  };

  useEffect(() => {
    fetchAppeals();
  }, []);

  if (loading) return <div>Loading appeals...</div>;

  return (
    <div className="card bg-white shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Payroll Appeals</h2>
      {appeals.length === 0 ? (
        <p>No appeal records found.</p>
      ) : (
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Submitted At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appeals.map((a) => (
              <tr key={a.id}>
                <td>{a.employee_name}</td>
                <td>{a.appeal_reason}</td>
                <td>{a.status}</td>
                <td>{new Date(a.created_at).toLocaleString()}</td>
                <td>
                  {a.status === "pending" && (
                    <>
                      <button
                        className="btn btn-xs btn-success mr-2"
                        onClick={() => handleAction(a.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => handleAction(a.id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
