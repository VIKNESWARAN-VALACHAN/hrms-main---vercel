"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from '../../../config';
import { useTheme } from '../../../components/ThemeProvider'; // Make sure this path is correct

interface AmendTabProps {
  filters: {
    fromDate: string;
    toDate: string;
    company: string;
    status: string;
  };
  searchTerm: string;
}

interface PayslipItem {
  id?: number;
  payroll_id: number;
  type: string;
  label: string;
  amount: number;
  remarks?: string;
}

export default function AmendTab({ filters, searchTerm }: AmendTabProps) {
  const { theme } = useTheme();
  const [newItem, setNewItem] = useState<PayslipItem>({
    payroll_id: 0,
    type: "ALLOWANCE",
    label: "",
    amount: 0,
    remarks: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof PayslipItem, value: any) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!newItem.payroll_id || !newItem.label || !newItem.amount) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/api/payroll/manual-adjustment`, newItem);
      toast.success("Payslip item added successfully");
      setNewItem({
        payroll_id: 0,
        type: "ALLOWANCE",
        label: "",
        amount: 0,
        remarks: ""
      });
    } catch (err) {
      toast.error("Failed to add payslip item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 rounded shadow ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
        Manual Payslip Adjustment
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`label ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Payroll ID
          </label>
          <input
            type="number"
            className={`input w-full ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600 text-white'}`}
            value={newItem.payroll_id}
            onChange={(e) => handleChange("payroll_id", parseInt(e.target.value))}
          />
        </div>

        <div>
          <label className={`label ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Type
          </label>
          <select
            className={`select w-full ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600 text-white'}`}
            value={newItem.type}
            onChange={(e) => handleChange("type", e.target.value)}
          >
            <option value="ALLOWANCE">Allowance</option>
            <option value="DEDUCTION">Deduction</option>
            <option value="BONUS">Bonus</option>
          </select>
        </div>

        <div>
          <label className={`label ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Label
          </label>
          <input
            type="text"
            className={`input w-full ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600 text-white'}`}
            value={newItem.label}
            onChange={(e) => handleChange("label", e.target.value)}
          />
        </div>

        <div>
          <label className={`label ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Amount
          </label>
          <input
            type="number"
            className={`input w-full ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600 text-white'}`}
            value={newItem.amount}
            onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
          />
        </div>

        <div className="md:col-span-2">
          <label className={`label ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Remarks (optional)
          </label>
          <textarea
            className={`textarea w-full ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600 text-white'}`}
            value={newItem.remarks}
            onChange={(e) => handleChange("remarks", e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="mt-6">
        <button
          className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : "Submit Adjustment"}
        </button>
      </div>
    </div>
  );
}