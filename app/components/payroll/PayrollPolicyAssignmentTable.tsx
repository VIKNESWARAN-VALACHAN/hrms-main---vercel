'use client';

import React from 'react';

export interface PayrollPolicyAssignment {
  id: number;
  payroll_config_id: number;
  company_name?: string;
  department_name?: string;
  branch_name?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean | number;
}

interface Props {
  data: PayrollPolicyAssignment[];
  onEdit: (assignment: PayrollPolicyAssignment) => void;
  onDelete: (id: number) => void;
}

export default function PayrollPolicyAssignmentTable({ data, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Company</th>
            <th>Department</th>
            <th>Branch</th>
            <th>Policy</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center text-gray-500">No records found</td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.company_name || '-'}</td>
                <td>{item.department_name || '-'}</td>
                <td>{item.branch_name || '-'}</td>
                <td>{item.payroll_config_id}</td>
                <td>{item.start_date || '-'}</td>
                <td>{item.end_date || '-'}</td>
                <td>
                  {item.is_active ? (
                    <span className="badge bg-green-100 text-green-800">Active</span>
                  ) : (
                    <span className="badge bg-gray-100 text-gray-800">Inactive</span>
                  )}
                </td>
                <td>
                  <button className="btn btn-sm btn-warning mr-2" onClick={() => onEdit(item)}>Edit</button>
                  <button className="btn btn-sm btn-error" onClick={() => onDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
