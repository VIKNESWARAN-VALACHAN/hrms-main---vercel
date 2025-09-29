
import React, { useState } from 'react';
import { IncrementItem, IncrementType } from './types';
import { formatDate } from './utils';
import { toast } from 'react-hot-toast';

interface IncrementTabProps {
  increments: IncrementItem[];
  onAddIncrement: (increment: IncrementItem) => void;
  onUpdateIncrement: (increment: IncrementItem) => void;
  onDeleteIncrement: (id: number | string) => void;
}

const IncrementTab: React.FC<IncrementTabProps> = ({
  increments,
  onAddIncrement,
  onUpdateIncrement,
  onDeleteIncrement,
}) => {
  const [formState, setFormState] = useState<Partial<IncrementItem>>({
    type: 'Percent',
    value: 0,
    effective_date: '',
    remarks: '',
  });
  const [editingId, setEditingId] = useState<number | string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) : value,
    }));
  };

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.type || !formState.value || !formState.effective_date) {
      toast.error('Please fill in all required fields for the increment.');
      return;
    }

    if (formState.value <= 0) {
      toast.error('Increment value must be greater than 0.');
      return;
    }

    if (editingId) {
      onUpdateIncrement({ ...formState, id: editingId } as IncrementItem);
      setEditingId(null);
    } else {
      onAddIncrement({ ...formState, tempId: `inc_${Date.now()}` } as IncrementItem);
    }
    setFormState({
      type: 'Percent',
      value: 0,
      effective_date: '',
      remarks: '',
    });
  };

  const handleEdit = (increment: IncrementItem) => {
    setFormState(increment);
    setEditingId(increment.id || increment.tempId || null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormState({
      type: 'Percent',
      value: 0,
      effective_date: '',
      remarks: '',
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg">Salary Increments</h3>

      {/* Increment Form */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h4 className="card-title text-md mb-4">
            {editingId ? 'Edit Increment' : 'Add New Increment'}
          </h4>
          <form onSubmit={handleAddOrUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Increment Type <span className="text-error">*</span></label>
                <select
                  name="type"
                  value={formState.type}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="Percent">Percent</option>
                  <option value="Fixed">Fixed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Value <span className="text-error">*</span></label>
                <input
                  type="number"
                  name="value"
                  value={formState.value}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter value"
                  step={formState.type === 'Percent' ? "0.01" : "any"}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Effective Date <span className="text-error">*</span></label>
                <input
                  type="date"
                  name="effective_date"
                  value={formState.effective_date}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Remarks</label>
                <textarea
                  name="remarks"
                  value={formState.remarks}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full"
                  placeholder="Any additional remarks"
                  rows={2}
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              {editingId && (
                <button type="button" className="btn btn-ghost" onClick={handleCancelEdit}>
                  Cancel Edit
                </button>
              )}
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Increment' : 'Add Increment'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Increment History */}
      <h4 className="font-bold text-md mt-6">Increment History ({increments.length})</h4>
      {increments.length === 0 ? (
        <div className="alert alert-info">
          No increment history available.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Date (Effective)</th>
                <th>Type</th>
                <th>Value</th>
                {/* <th>Old Salary</th>
                <th>New Salary</th> */}
                <th>Entered By</th>
                <th>Created At</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {increments.sort((a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime()).map((inc) => (
                <tr key={inc.id || inc.tempId}>
                  <td>{formatDate(inc.effective_date)}</td>
                  <td>{inc.type}</td>
                  <td>{inc.value}{inc.type === 'Percent' ? '%' : ''}</td>
                  {/* <td>{inc.old_salary}</td>
                  <td>{inc.new_salary}</td> */}
                  <td>{inc.created_by_name || 'N/A'}</td>
                  <td>{inc.created_at ? formatDate(inc.created_at) : 'N/A'}</td>
                  <td>{inc.remarks || 'N/A'}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleEdit(inc)}
                    >
                      Edit
                    </button>
<button
  type="button"
  className="btn btn-ghost btn-sm text-error"
  onClick={() => {
    const idToDelete = inc.id || inc.tempId;
    if (idToDelete !== undefined) {
      onDeleteIncrement(idToDelete);
    }
  }}
>
  Delete
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IncrementTab;


