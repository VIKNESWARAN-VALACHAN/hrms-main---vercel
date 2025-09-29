
import React from 'react';
import { EmployeeData, Company, Department } from './types';

interface EmploymentTabProps {
  formData: EmployeeData;
  onFormDataChange: (patch: Partial<EmployeeData>) => void;
  companies: Company[];
  departments: Department[];
  employeeNoValidation: {
    isValidating: boolean;
    isValid: boolean | null;
    message: string;
  };
  onEmployeeNoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmploymentTab: React.FC<EmploymentTabProps> = ({
  formData,
  onFormDataChange,
  companies,
  departments,
  employeeNoValidation,
  onEmployeeNoChange,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Employment Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Employee No. <span className="text-error">*</span></label>
          <input
            type="text"
            name="employee_no"
            value={formData.employee_no}
            onChange={onEmployeeNoChange}
            className="input input-bordered w-full"
            placeholder="Enter employee number"
            required
          />
          {employeeNoValidation.isValidating && (
            <span className="loading loading-spinner loading-xs"></span>
          )}
          {employeeNoValidation.isValid !== null && !employeeNoValidation.isValid && (
            <p className="text-error text-xs mt-1">{employeeNoValidation.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Joined Date <span className="text-error">*</span></label>
          <input
            type="date"
            name="joined_date"
            value={formData.joined_date}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Employment Type <span className="text-error">*</span></label>
          <select
            name="employment_type"
            value={formData.employment_type}
            onChange={handleInputChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Employment Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company <span className="text-error">*</span></label>
          <select
            name="company_id"
            value={formData.company_id}
            onChange={handleInputChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Company</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>{company.name || company.company_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Department <span className="text-error">*</span></label>
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleInputChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.department_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Education Level</label>
          <input
            type="text"
            name="education_level"
            value={formData.education_level}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="e.g., Bachelor's Degree"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Qualification</label>
          <input
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="e.g., Computer Science"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Resigned Date</label>
          <input
            type="date"
            name="resigned_date"
            value={formData.resigned_date}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirmation Date</label>
          <input
            type="date"
            name="confirmation_date"
            value={formData.confirmation_date}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default EmploymentTab;


