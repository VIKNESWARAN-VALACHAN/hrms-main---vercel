
import React, { useState, useEffect } from 'react';
import { EmployeeData, Position, JobLevel } from './types';

interface PositionLevelTabProps {
  formData: EmployeeData;
  onFormDataChange: (patch: Partial<EmployeeData>) => void;
  positions: Position[];
  filteredJobLevels: JobLevel[];
  onPositionChange: (positionId: string, jobLevel: string) => void;
  onPromotionConfirm: (effectiveDate: string) => void;
  onPromotionCancel: () => void;
  showPromotionConfirmation: boolean;
  promotionEffectiveDate: string;
  setPromotionEffectiveDate: (date: string) => void;
  newPositionTitle: string;
  newJobLevel: string;
}

const PositionLevelTab: React.FC<PositionLevelTabProps> = ({
  formData,
  onFormDataChange,
  positions,
  filteredJobLevels,
  onPositionChange,
  onPromotionConfirm,
  onPromotionCancel,
  showPromotionConfirmation,
  promotionEffectiveDate,
  setPromotionEffectiveDate,
  newPositionTitle,
  newJobLevel,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "position_id") {
      const selectedPosition = positions.find(p => p.id === value);
      if (selectedPosition) {
        onPositionChange(value, formData.job_level); // Pass current job_level
      }
    } else if (name === "job_level") {
      onPositionChange(formData.position_id, value); // Pass current position_id
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Position & Level</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Position <span className="text-error">*</span></label>
          <select
            name="position_id"
            value={formData.position_id}
            onChange={handleInputChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Position</option>
            {positions.map(pos => (
              <option key={pos.id} value={pos.id}>{pos.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Job Level <span className="text-error">*</span></label>
          <select
            name="job_level"
            value={formData.job_level}
            onChange={handleInputChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Job Level</option>
            {filteredJobLevels.map(level => (
              <option key={level.job_level} value={level.job_level}>{level.job_level}</option>
            ))}
          </select>
        </div>
      </div>

      {showPromotionConfirmation && (
        <div className="alert alert-info mt-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <h3 className="font-bold">Confirm Promotion/Transfer</h3>
            <p className="text-sm">
              You are changing the employee's position to <strong>{newPositionTitle}</strong> and job level to <strong>{newJobLevel}</strong>.
            </p>
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">Effective Date <span className="text-error">*</span></label>
              <input
                type="date"
                value={promotionEffectiveDate}
                onChange={(e) => setPromotionEffectiveDate(e.target.value)}
                className="input input-bordered w-full max-w-xs"
                required
              />
            </div>
            <div className="modal-action mt-4">
              <button type="button" className="btn btn-sm btn-ghost" onClick={onPromotionCancel}>Cancel</button>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => onPromotionConfirm(promotionEffectiveDate)}
                disabled={!promotionEffectiveDate}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionLevelTab;


