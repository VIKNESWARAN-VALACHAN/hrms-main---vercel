'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

// Interfaces for props
interface Employee {
  id: number;
  name: string;
}

interface ReliefOption {
  id: number;
  name: string;
  amount: number | string | null; // Allow amount to be number, string, or null from API
}

interface AddEmployeeReliefFormProps {
  employees: Employee[];
  reliefOptions: ReliefOption[];
  onSave: (data: { employee_id: number; relief_id: number }) => Promise<void> | void;
  onCancel: () => void;
}

export default function AddEmployeeReliefForm({
  employees,
  reliefOptions,
  onSave,
  onCancel,
}: AddEmployeeReliefFormProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | ''>('');
  // Changed to an array to store multiple selected relief IDs
  const [selectedReliefIds, setSelectedReliefIds] = useState<number[]>([]);

  // Handler for individual relief checkbox changes
  const handleReliefCheckboxChange = (reliefId: number, isChecked: boolean) => {
    setSelectedReliefIds(prev =>
      isChecked
        ? [...prev, reliefId] // Add reliefId if checked
        : prev.filter(id => id !== reliefId) // Remove reliefId if unchecked
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployeeId) {
      toast.error('Please select an employee.');
      return;
    }
    if (selectedReliefIds.length === 0) {
      toast.error('Please select at least one relief category.');
      return;
    }

    // Since your backend's POST /api/employee-reliefs endpoint
    // expects a single { employee_id, relief_id }, we will make
    // an individual API call for each selected relief.
    let successCount = 0;
    let errorCount = 0;

    for (const reliefId of selectedReliefIds) {
      try {
        await onSave({
          employee_id: selectedEmployeeId as number,
          relief_id: reliefId,
        });
        successCount++;
      } catch (error) {
        // The onSave function already handles toast.error,
        // but we can count errors here if needed for a summary.
        console.error(`Failed to add relief ${reliefId}:`, error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      // The parent component's onSave handles the success toast and modal close.
      // No need for an additional toast here unless summarizing multiple adds.
      // For now, let's rely on the parent's toast.
    }
    if (errorCount > 0) {
      toast.error(`Successfully added ${successCount} reliefs, but ${errorCount} failed.`);
    }

    // The parent component's onSave is responsible for closing the modal and refreshing.
    // We don't close it here directly as onSave might be an async operation.
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Employee Relief(s)</h2>

        <div className="mb-3">
          <label htmlFor="employeeSelect" className="block font-medium mb-1">Employee</label>
          <select
            id="employeeSelect"
            className="input input-bordered w-full"
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(parseInt(e.target.value, 10) || '')}
            required
          >
            <option value="">-- Select Employee --</option>
            {/* Ensure employees is an array before mapping */}
            {employees && employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block font-medium mb-1">Relief Categories</label>
          <div className="border rounded p-2 max-h-40 overflow-y-auto">
            {reliefOptions && reliefOptions.length > 0 ? (
              reliefOptions.map((relief) => (
                <div key={relief.id} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={`relief-${relief.id}`}
                    className="checkbox checkbox-primary mr-2"
                    checked={selectedReliefIds.includes(relief.id)}
                    onChange={(e) => handleReliefCheckboxChange(relief.id, e.target.checked)}
                  />
                  <label htmlFor={`relief-${relief.id}`} className="flex-1 cursor-pointer">
                    {relief.name} (RM{' '}
                    {/* Safely parse and format amount, handling potential string or null values */}
                    {typeof relief.amount === 'number' && !isNaN(relief.amount)
                      ? relief.amount.toFixed(2)
                      : (typeof relief.amount === 'string' && !isNaN(parseFloat(relief.amount)))
                        ? parseFloat(relief.amount).toFixed(2)
                        : 'N/A'}
                    )
                  </label>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No relief options available.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Add Relief(s)
          </button>
        </div>
      </form>
    </div>
  );
}