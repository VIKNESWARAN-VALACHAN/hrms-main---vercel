'use client';

import React from 'react';

export interface PayrollConfig {
  id: number;
  pay_interval: string;
  cutoff_day: number;
  payment_day: number;
  late_penalty_type: string;
  late_penalty_amount: number;
  ot_multiplier: number;
  default_currency: string;
  auto_carry_forward: boolean | number;
}

interface Props {
  data: PayrollConfig[];
  onEdit: (config: PayrollConfig) => void;
  onDelete: (id: number) => void;
}

export default function PayrollConfigTable({ data, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Interval</th>
            <th>Cutoff Day</th>
            <th>Payment Day</th>
            <th>Late Penalty</th>
            <th>OT Multiplier</th>
            <th>Currency</th>
            <th>Carry Forward</th>
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
                <td>{item.pay_interval}</td>
                <td>{item.cutoff_day}</td>
                <td>{item.payment_day}</td>
                <td>
                  {item.late_penalty_type} {item.late_penalty_amount}%
                </td>
                <td>{item.ot_multiplier}</td>
                <td>{item.default_currency}</td>
                <td>
                  {item.auto_carry_forward ? (
                    <span className="badge bg-green-100 text-green-800">Yes</span>
                  ) : (
                    <span className="badge bg-gray-100 text-gray-800">No</span>
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
