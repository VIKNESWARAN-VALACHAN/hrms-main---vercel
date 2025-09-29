
import React from 'react';
import { Dependent } from './types';
import { NATIONALITIES } from '../../utils/countryData';

interface DependentsTabProps {
  dependents: Dependent[];
  dependentForm: Dependent;
  editingDependentId: number | string | null;
  onDependentFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onAddDependent: (e: React.FormEvent) => void;
  onUpdateDependent: (e: React.FormEvent) => void;
  onEditDependent: (dependent: Dependent) => void;
  onDeleteDependent: (id: number | string) => void;
  onCancelEditDependent: () => void;
}

const DependentsTab: React.FC<DependentsTabProps> = ({
  dependents,
  dependentForm,
  editingDependentId,
  onDependentFormChange,
  onAddDependent,
  onUpdateDependent,
  onEditDependent,
  onDeleteDependent,
  onCancelEditDependent,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg">Dependents</h3>

      {/* Dependent Form */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h4 className="card-title text-md mb-4">
            {editingDependentId ? 'Edit Dependent' : 'Add New Dependent'}
          </h4>
          <form onSubmit={editingDependentId ? onUpdateDependent : onAddDependent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name <span className="text-error">*</span></label>
                <input
                  type="text"
                  name="full_name"
                  value={dependentForm.full_name}
                  onChange={onDependentFormChange}
                  className="input input-bordered w-full"
                  placeholder="Dependent's full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Relationship <span className="text-error">*</span></label>
                <select
                  name="relationship"
                  value={dependentForm.relationship}
                  onChange={onDependentFormChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select Relationship</option>
                  <option value="Child">Child</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Birth Date <span className="text-error">*</span></label>
                <input
                  type="date"
                  name="birth_date"
                  value={dependentForm.birth_date}
                  onChange={onDependentFormChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  name="gender"
                  value={dependentForm.gender}
                  onChange={onDependentFormChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nationality</label>
                <select
                  name="nationality"
                  value={dependentForm.nationality}
                  onChange={onDependentFormChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Nationality</option>
                  {NATIONALITIES.map((nat, index) => (
                    <option key={index} value={nat}>{nat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Identification No.</label>
                <input
                  type="text"
                  name="identification_no"
                  value={dependentForm.identification_no}
                  onChange={onDependentFormChange}
                  className="input input-bordered w-full"
                  placeholder="ID or Passport number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Child Relief Percent</label>
                <input
                  type="number"
                  name="child_relief_percent"
                  value={dependentForm.child_relief_percent || ''}
                  onChange={onDependentFormChange}
                  className="input input-bordered w-full"
                  placeholder="e.g., 50 (for 50%)"
                />
              </div>
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  name="is_disabled"
                  checked={Boolean(dependentForm.is_disabled)}
                  onChange={onDependentFormChange}
                  className="checkbox checkbox-primary"
                />
                <label className="ml-2 text-sm font-medium">Is Disabled</label>
              </div>
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  name="is_studying"
                  checked={Boolean(dependentForm.is_studying)}
                  onChange={onDependentFormChange}
                  className="checkbox checkbox-primary"
                />
                <label className="ml-2 text-sm font-medium">Is Studying</label>
              </div>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                name="notes"
                value={dependentForm.notes}
                onChange={onDependentFormChange}
                className="textarea textarea-bordered w-full"
                placeholder="Any additional notes"
                rows={2}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              {editingDependentId && (
                <button type="button" className="btn btn-ghost" onClick={onCancelEditDependent}>
                  Cancel Edit
                </button>
              )}
              <button type="submit" className="btn btn-primary">
                {editingDependentId ? 'Update Dependent' : 'Add Dependent'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Dependents List */}
      <h4 className="font-bold text-md mt-6">Current Dependents ({dependents.length})</h4>
      {dependents.length === 0 ? (
        <div className="alert alert-info">
          No dependents added yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Relationship</th>
                <th>Birth Date</th>
                <th>Gender</th>
                <th>Nationality</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dependents.map((dep) => (
                <tr key={dep.id}>
                  <td>{dep.full_name}</td>
                  <td>{dep.relationship}</td>
                  <td>{dep.birth_date}</td>
                  <td>{dep.gender}</td>
                  <td>{dep.nationality}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => onEditDependent(dep)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm text-error"
                      onClick={() => dep.id && onDeleteDependent(dep.id)}
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

export default DependentsTab;


