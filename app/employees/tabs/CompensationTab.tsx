
import React from 'react';
import { EmployeeData } from './types';

interface CompensationTabProps {
  formData: EmployeeData;
  onFormDataChange: (patch: Partial<EmployeeData>) => void;
}

const CompensationTab: React.FC<CompensationTabProps> = ({
  formData,
  onFormDataChange,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Compensation Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Salary <span className="text-error">*</span></label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter salary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Currency <span className="text-error">*</span></label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            className="select select-bordered w-full"
            required
          >
            <option value="MYR">MYR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Payment Company</label>
          <input
            type="text"
            name="payment_company"
            value={formData.payment_company}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter payment company"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Pay Interval</label>
          <select
            name="pay_interval"
            value={formData.pay_interval}
            onChange={handleInputChange}
            className="select select-bordered w-full"
          >
            <option value="">Select Pay Interval</option>
            <option value="Monthly">Monthly</option>
            <option value="Bi-Weekly">Bi-Weekly</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Payment Method <span className="text-error">*</span></label>
          <select
            name="payment_method"
            value={formData.payment_method}
            onChange={handleInputChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Payment Method</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
            <option value="Check">Check</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bank Name</label>
          <input
            type="text"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter bank name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bank Currency</label>
          <input
            type="text"
            name="bank_currency"
            value={formData.bank_currency}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter bank currency"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bank Account Name</label>
          <input
            type="text"
            name="bank_account_name"
            value={formData.bank_account_name}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter bank account name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bank Account No.</label>
          <input
            type="text"
            name="bank_account_no"
            value={formData.bank_account_no}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter bank account number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Income Tax No.</label>
          <input
            type="text"
            name="income_tax_no"
            value={formData.income_tax_no}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter income tax number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SOCSO Account No.</label>
          <input
            type="text"
            name="socso_account_no"
            value={formData.socso_account_no}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter SOCSO account number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">EPF Account No.</label>
          <input
            type="text"
            name="epf_account_no"
            value={formData.epf_account_no}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter EPF account number"
          />
        </div>
      </div>
    </div>
  );
};

export default CompensationTab;


