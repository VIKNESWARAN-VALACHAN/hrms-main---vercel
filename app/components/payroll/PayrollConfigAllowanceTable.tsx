'use client';

import React, { useState } from 'react';
import { PayrollConfigAllowanceRow } from './PayrollConfigAllowanceForm';
import { FiEdit, FiEye, FiTrash2, FiMoreHorizontal, FiCheckCircle } from 'react-icons/fi';
import { API_BASE_URL } from '../../config';

interface Props {
  rows: PayrollConfigAllowanceRow[];
  onEdit: (row: PayrollConfigAllowanceRow) => void;
  onDelete: (id: number) => Promise<void>;
}

const PayrollConfigAllowanceTable: React.FC<Props> = ({ 
  rows, 
  onEdit, 
  onDelete = async () => {}
}) => {
  const [deleteTarget, setDeleteTarget] = useState<PayrollConfigAllowanceRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formatDateForDisplay = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
      }).format(date);
    } catch {
      return dateString || '-';
    }
  };

  const handleDeleteClick = (row: PayrollConfigAllowanceRow) => {
    setDeleteTarget(row);
    setError(null);
    setSuccessMessage(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) {
      setError('No record selected for deletion');
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await fetch(`${API_BASE_URL}/api/payroll-config-allowance/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete record');
      }

      setSuccessMessage('Record deleted successfully!');
      setDeleteTarget(null);
      
      if (onDelete) {
        await onDelete(deleteTarget.id);
      }
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Delete error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'An unexpected error occurred during deletion'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      {/* Success Message Toast */}
      {successMessage && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success">
            <FiCheckCircle className="text-xl" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      <table className="table w-full">
        <thead>
          <tr>
            <th>Payroll Config</th>
            <th>Allowance</th>
            <th>Default?</th>
            <th>Amount</th>
            <th>Company</th>
            <th>Department</th>
            <th>Start Month</th>
            <th>End Month</th>
            <th>Remark</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.payroll_config_name || row.payroll_config_id}</td>
              <td>{row.allowance_name || row.allowance_id}</td>
              <td>{row.is_default ? 'Yes' : 'No'}</td>
              <td>RM {row.amount}</td>
              <td>{row.company_name || row.company_id || '-'}</td>
              <td>{row.department_name || row.department_id || '-'}</td>
              <td>{formatDateForDisplay(row.cycle_start_month)}</td>
              <td>{formatDateForDisplay(row.cycle_end_month)}</td>
              <td>{row.remark || '-'}</td>
              <td className="relative text-right">
                <div className="dropdown dropdown-left md:dropdown-end">
                  <label tabIndex={0} className="btn btn-xs btn-primary flex items-center gap-1">
                    <FiMoreHorizontal /> Actions
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow-md bg-white rounded-box w-40 text-sm z-[100]"
                  >
                    <li>
                      <button
                        onClick={() => onEdit(row)}
                        className="flex items-center text-blue-700 hover:bg-blue-100 rounded px-2 py-1"
                      >
                        <FiEdit className="mr-2" /> Edit
                      </button>
                    </li>
                    {/* <li>
                      <a
                        href={`/admins/payroll-config-allowance/${row.id}`}
                        className="flex items-center text-blue-700 hover:bg-blue-100 rounded px-2 py-1"
                      >
                        <FiEye className="mr-2" /> View
                      </a>
                    </li> */}
                    <li>
                      <button
                        onClick={() => handleDeleteClick(row)}
                        className="flex items-center text-red-600 hover:bg-red-100 rounded px-2 py-1"
                      >
                        <FiTrash2 className="mr-2" /> Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={10} className="text-center">No data</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 text-red-600">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete this record:
              <br />
              <strong>{deleteTarget.allowance_name || `ID ${deleteTarget.id}`}</strong>?
            </p>
            
            {error && (
              <div className="alert alert-error mb-4 p-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn btn-sm"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn btn-sm btn-error text-white"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollConfigAllowanceTable;