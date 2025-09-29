"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Tabs } from "../../../components/Tabs";
import { employeeApi, incrementApi, type Employee, type Increment, type CreateIncrementData, type IncrementStats } from "../../../utils/test";

export default function IncrementTabsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [increments, setIncrements] = useState<Increment[]>([]);
  const [allIncrements, setAllIncrements] = useState<Increment[]>([]);
  const [stats, setStats] = useState<IncrementStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState<CreateIncrementData>({
    increment_type: "percentage",
    increment_value: 0,
    increment_date: new Date().toISOString().split("T")[0],
    effective_date: new Date().toISOString().split("T")[0],
    reason: "",
  });

  useEffect(() => {
    fetchEmployees();
    fetchAllIncrements();
    fetchIncrementStats();
  }, []);

  useEffect(() => {
    if (selectedEmployeeId) {
      fetchEmployeeDetails(selectedEmployeeId);
      fetchEmployeeIncrements(selectedEmployeeId);
    } else {
      setSelectedEmployee(null);
      setIncrements([]);
    }
  }, [selectedEmployeeId]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeApi.getEmployees();
      setEmployees(data.employees || []);
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      toast.error(`Failed to fetch employees: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeDetails = async (employeeId: number) => {
    try {
      const data = await employeeApi.getEmployee(employeeId);
      setSelectedEmployee(data);
    } catch (error: any) {
      console.error("Error fetching employee details:", error);
      toast.error(`Failed to fetch employee details: ${error.message}`);
    }
  };

  const fetchEmployeeIncrements = async (employeeId: number) => {
    try {
      const data = await employeeApi.getEmployeeIncrements(employeeId);
      setIncrements(data.increments || []);
    } catch (error: any) {
      console.error("Error fetching increments:", error);
      toast.error(`Failed to fetch increments: ${error.message}`);
    }
  };

  const fetchAllIncrements = async () => {
    try {
      const data = await incrementApi.getAllIncrements();
      setAllIncrements(data.increments || []);
    } catch (error: any) {
      console.error("Error fetching all increments:", error);
      toast.error(`Failed to fetch all increments: ${error.message}`);
    }
  };

  const fetchIncrementStats = async () => {
    try {
      const data = await incrementApi.getIncrementStats();
      setStats(data);
    } catch (error: any) {
      console.error("Error fetching increment stats:", error);
      toast.error(`Failed to fetch increment stats: ${error.message}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'increment_value' ? parseFloat(value) || 0 : value,
    }));
  };

  const calculateNewSalary = () => {
    if (!selectedEmployee || !formData.increment_value) return null;

    const currentSalary = selectedEmployee.salary;
    const incrementValue = formData.increment_value;

    if (isNaN(incrementValue)) return null;

    let newSalary = currentSalary;
    if (formData.increment_type === "percentage") {
      newSalary = currentSalary * (1 + incrementValue / 100);
    } else if (formData.increment_type === "fixed_amount") {
      newSalary = currentSalary + incrementValue;
    } else if (formData.increment_type === "promotion") {
      newSalary = incrementValue; // For promotion, increment_value is the new salary
    }
    return newSalary.toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      toast.error("Please select an employee first.");
      return;
    }

    setFormLoading(true);
    try {
      await employeeApi.createEmployeeIncrement(selectedEmployeeId, formData);
      toast.success("Increment created successfully!");
      setFormData({
        increment_type: "percentage",
        increment_value: 0,
        increment_date: new Date().toISOString().split("T")[0],
        effective_date: new Date().toISOString().split("T")[0],
        reason: "",
      });
      fetchEmployeeDetails(selectedEmployeeId); // Refresh employee details
      fetchEmployeeIncrements(selectedEmployeeId); // Refresh increments list
      fetchAllIncrements(); // Refresh all increments
      fetchIncrementStats(); // Refresh stats
    } catch (error: any) {
      console.error("Error creating increment:", error);
      toast.error(`Failed to create increment: ${error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const newSalaryPreview = calculateNewSalary();

  // Tab 1: Create Increment
  const CreateIncrementTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1">
        <label htmlFor="employee-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Employee
        </label>
        <select
          id="employee-select"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedEmployeeId ?? ""}
          onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
          disabled={loading}
        >
          <option value="">-- Select an Employee --</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} ({emp.employee_no})
            </option>
          ))}
        </select>
        {loading && <p className="text-sm text-gray-500 mt-2">Loading employees...</p>}
      </div>

      {selectedEmployee && (
        <div className="col-span-2 bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Employee Details</h2>
          <p><strong>Name:</strong> {selectedEmployee.name}</p>
          <p><strong>Employee No:</strong> {selectedEmployee.employee_no}</p>
          <p><strong>Department:</strong> {selectedEmployee.department}</p>
          <p><strong>Position:</strong> {selectedEmployee.position}</p>
          <p><strong>Current Salary:</strong> {selectedEmployee.currency} {selectedEmployee.salary.toFixed(2)}</p>
        </div>
      )}

      {selectedEmployee && (
        <div className="col-span-3 bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Create New Increment</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="increment_type" className="block text-sm font-medium text-gray-700 mb-2">
                Increment Type
              </label>
              <select
                id="increment_type"
                name="increment_type"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={formData.increment_type}
                onChange={handleInputChange}
                required
              >
                <option value="percentage">Percentage Increase</option>
                <option value="fixed_amount">Fixed Amount</option>
                <option value="promotion">Promotion (New Salary)</option>
              </select>
            </div>

            <div>
              <label htmlFor="increment_value" className="block text-sm font-medium text-gray-700 mb-2">
                {formData.increment_type === "percentage" ? "Percentage (%)" : "Value"}
              </label>
              <input
                type="number"
                id="increment_value"
                name="increment_value"
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder={formData.increment_type === "percentage" ? "e.g., 10 (for 10%)" : "Enter value"}
                value={formData.increment_value || ""}
                onChange={handleInputChange}
                required
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="increment_date" className="block text-sm font-medium text-gray-700 mb-2">
                Increment Date
              </label>
              <input
                type="date"
                id="increment_date"
                name="increment_date"
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={formData.increment_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="effective_date" className="block text-sm font-medium text-gray-700 mb-2">
                Effective Date
              </label>
              <input
                type="date"
                id="effective_date"
                name="effective_date"
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={formData.effective_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={3}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={formData.reason}
                onChange={handleInputChange}
              ></textarea>
            </div>

            {newSalaryPreview && (
              <div className="md:col-span-2 p-3 bg-indigo-50 border border-indigo-200 rounded-md">
                <p className="text-sm font-medium text-indigo-700">Salary Preview:</p>
                <p className="text-lg font-bold text-indigo-900">
                  Current: {selectedEmployee.currency} {selectedEmployee.salary.toFixed(2)}
                </p>
                <p className="text-lg font-bold text-indigo-900">
                  New: {selectedEmployee.currency} {newSalaryPreview}
                </p>
                <p className="text-sm text-indigo-700">
                  Increase: {selectedEmployee.currency} {(parseFloat(newSalaryPreview) - selectedEmployee.salary).toFixed(2)}
                </p>
              </div>
            )}

            <div className="md:col-span-2">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={formLoading}
              >
                {formLoading ? "Creating..." : "Create Increment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  // Tab 2: Employee History
  const EmployeeHistoryTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="employee-select-history" className="block text-sm font-medium text-gray-700 mb-2">
          Select Employee
        </label>
        <select
          id="employee-select-history"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedEmployeeId ?? ""}
          onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
          disabled={loading}
        >
          <option value="">-- Select an Employee --</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} ({emp.employee_no})
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Increment History</h2>
        {increments.length === 0 ? (
          <p className="text-gray-500">No increment history found for this employee.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {increments.map((inc) => (
              <li key={inc.id} className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-900">{inc.increment_type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</p>
                    <p className="text-sm text-gray-500">{new Date(inc.increment_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {selectedEmployee?.currency} {inc.previous_salary.toFixed(2)} &rarr; {selectedEmployee?.currency} {inc.new_salary.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 text-right">
                      Value: {inc.increment_value}{inc.increment_type === "percentage" ? "%" : ""}
                    </p>
                  </div>
                </div>
                {inc.reason && (
                  <p className="text-sm text-gray-600 mt-2">Reason: {inc.reason}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  // Tab 3: All Increments
  const AllIncrementsTab = () => (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">All Salary Increments</h2>
      {allIncrements.length === 0 ? (
        <p className="text-gray-500">No increments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Previous Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allIncrements.map((inc) => (
                <tr key={inc.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {inc.employee_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inc.increment_type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inc.increment_value}{inc.increment_type === "percentage" ? "%" : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${inc.previous_salary.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${inc.new_salary.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(inc.increment_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Tab 4: Statistics
  const StatisticsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stats && (
        <>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total Increments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_increments}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Recent Increments (30 days)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recent_increments}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Budget Impact</p>
                <p className="text-2xl font-bold text-gray-900">${stats.total_budget_impact.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Increment Types</h2>
            <div className="space-y-2">
              {stats.increment_types.map((type) => (
                <div key={type.increment_type} className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {type.increment_type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{type.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Average Increment Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.average_increments.map((avg) => (
                <div key={avg.type} className="text-center">
                  <p className="text-sm text-gray-500">
                    {avg.type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {avg.type === "percentage" ? `${avg.avg_value.toFixed(1)}%` : `$${avg.avg_value.toFixed(2)}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Employee Salary Increment Management</h1>

      <Tabs>
        <Tabs.Tab label="Create Increment">
          <CreateIncrementTab />
        </Tabs.Tab>
        <Tabs.Tab label="Employee History">
          <EmployeeHistoryTab />
        </Tabs.Tab>
        <Tabs.Tab label="All Increments">
          <AllIncrementsTab />
        </Tabs.Tab>
        <Tabs.Tab label="Statistics">
          <StatisticsTab />
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}

