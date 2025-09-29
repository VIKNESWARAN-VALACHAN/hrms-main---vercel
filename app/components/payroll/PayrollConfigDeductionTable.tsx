
'use client';

import React from 'react';
import { FiEdit, FiEye, FiTrash2, FiMoreHorizontal, FiCheckCircle } from 'react-icons/fi';

export interface PayrollConfigDeductionRow {
  id?: number;
  payroll_config_id?: number;
  deduction_id?: number;
  is_default?: number;
  amount?: number;
  company_id?: number;
  department_id?: number;
  branch_id?: number;
  deduction_name?: string;
  company_name?: string;
  department_name?: string;
  branch_name?: string;
  cycle_start_month?: string | null;
  cycle_end_month?: string | null;
  remark: string | null | undefined; //remark?: string | null;
}


interface Props {
  rows: PayrollConfigDeductionRow[];
  onEdit: (row: PayrollConfigDeductionRow) => void;
  onDelete: (id: number) => void;
  onView?: (id: number) => void;
}

const PayrollConfigDeductionTable: React.FC<Props> = ({ rows, onEdit, onDelete, onView }) => {
  
  const formatDateForDisplay = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString ?? '';
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="table w-full">
        <thead>
          <tr>
            {/* <th>ID</th> */}
            <th>Deduction</th>
            <th>Amount</th>
            <th>Default</th>
            <th>Company</th>
            <th>Department</th>
            {/* <th>Branch</th> */}
          
            <th>Start Month</th>
              <th>End Month</th>
            <th>Remark</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={11} className="text-center">
                No deductions assigned.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                {/* <td>{row.id}</td> */}
                <td>{row.deduction_name || row.deduction_id}</td>
                <td>{row.amount !== undefined ? `RM ${Number(row.amount).toFixed(2)}` : '-'}</td>
                <td>
                  {row.is_default ? (
                    <span className="badge badge-success">Yes</span>
                  ) : (
                    <span className="badge badge-ghost">No</span>
                  )}
                </td>
                <td>{row.company_name || row.company_id || '-'}</td>
                <td>{row.department_name || row.department_id || '-'}</td>
                {/* <td>{row.branch_name || row.branch_id || '-'}</td> */}
                
                <td>{formatDateForDisplay(row.cycle_start_month)}</td>
                <td>{formatDateForDisplay(row.cycle_end_month)}</td>
                <td>{row.remark ?? '-'}</td>
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
                        onClick={() => onDelete(row.id!)}
                        className="flex items-center text-red-600 hover:bg-red-100 rounded px-2 py-1"
                      >
                        <FiTrash2 className="mr-2" /> Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollConfigDeductionTable;
