'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

interface BulkTransferProps {
  employees: any[];
  selectedEmployees: string[];
  setSelectedEmployees: (ids: string[]) => void;
  companies: {id: string; name: string}[];
  fetchEmployees: () => void;
  onClose: () => void;
}

interface Position {
  id: string;
  title: string;
  job_level: string;
}

export default function BulkTransfer({
  employees,
  selectedEmployees,
  setSelectedEmployees,
  companies,
  fetchEmployees,
  onClose
}: BulkTransferProps) {
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferFormData, setTransferFormData] = useState<{
    company_id: string;
    department_id: string;
    position: string;
    job_level: string;
    position_id: string;
  }>({
    company_id: '',
    department_id: '',
    position: '',
    job_level: '',
    position_id: ''
  });
  const [departments, setDepartments] = useState<{id: string; department_name: string}[]>([]);
  const [positionsData, setPositionsData] = useState<Position[]>([]);
  const [uniquePositionTitles, setUniquePositionTitles] = useState<string[]>([]);
  const [jobLevels, setJobLevels] = useState<string[]>([]);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState<any[]>([]);

  // Get selected employee details for display
  useEffect(() => {
    const selectedDetails = employees.filter(emp => 
      selectedEmployees.includes(emp.id)
    ).map(emp => ({
      id: emp.id,
      name: emp.name,
      position: emp.position,
      department_name: emp.department_name
    }));
    
    setSelectedEmployeeDetails(selectedDetails);
  }, [employees, selectedEmployees]);

  // Handle transfer form changes
  const handleTransferChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTransferFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Handle position selection (now by title instead of id)
    if (name === 'position') {
      // Reset job level when position changes
      setTransferFormData(prev => ({
        ...prev,
        position: value,
        job_level: '', 
        position_id: '' // Reset position_id until job level is selected
      }));
      
      // Update job levels based on selected position title
      const relevantJobLevels = positionsData
        .filter(p => p.title === value)
        .map(p => p.job_level)
        .filter(Boolean); // Remove any empty job levels
        
      setJobLevels([...new Set(relevantJobLevels)]); // Remove duplicates
    }

    // When job level is selected, update the position_id
    if (name === 'job_level') {
      // Find matching position with the selected title and job level
      const matchingPosition = positionsData.find(
        p => p.title === transferFormData.position && p.job_level === value
      );
      
      if (matchingPosition) {
        setTransferFormData(prev => ({
          ...prev,
          position_id: matchingPosition.id,
          job_level: value
        }));
      }
    }
  };

  // Fetch departments for transfer when company changes
  useEffect(() => {
    const fetchDepartmentsForTransfer = async () => {
      if (!transferFormData.company_id) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/employees/companies/${transferFormData.company_id}/departments`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch departments: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // For transfer we only want departments from the selected company
        setDepartments(data);
        
        // Clear the department selection when company changes
        setTransferFormData(prev => ({...prev, department_id: '', position: '', job_level: '', position_id: ''}));
        setJobLevels([]); // Reset job levels
        setUniquePositionTitles([]);
      } catch (error) {
        console.error('Error fetching departments for transfer:', error);
      }
    };
    
    fetchDepartmentsForTransfer();
  }, [transferFormData.company_id]);

  // Handle transfer form department changes
  useEffect(() => {
    if (!transferFormData.department_id) {
      setPositionsData([]);
      setJobLevels([]);
      setUniquePositionTitles([]);
      return;
    }
    
    const fetchPositionsForTransfer = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/departments/${transferFormData.department_id}/positions`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch positions: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // If we get positions from the API
        if (data && data.success && Array.isArray(data.positions)) {
          const positionsList = data.positions.map((pos: any) => ({
            id: pos.id,
            title: pos.title || '',
            job_level: pos.job_level || ''
          }));
          setPositionsData(positionsList);
          
          // Extract unique position titles
          const uniqueTitles = [...new Set(positionsList.map((p: Position) => p.title))].filter(title => !!title) as string[];
          setUniquePositionTitles(uniqueTitles);
          
          // Reset position and job level when department changes
          setTransferFormData(prev => ({...prev, position: '', job_level: '', position_id: ''}));
          setJobLevels([]); // Reset job levels when department changes
          return;
        }
        
      } catch (error) {
        console.error('Error fetching positions for transfer:', error);
      }
    };
    
    fetchPositionsForTransfer();
  }, [transferFormData.department_id]);

  // Handle transfer submission
  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployees.length === 0) return;
    
    try {
      setTransferLoading(true);
      
      // Extract the necessary data for transfer
      const transferData = {
        company_id: transferFormData.company_id,
        department_id: transferFormData.department_id,
        position: transferFormData.position,
        job_level: transferFormData.job_level,
        position_id: transferFormData.position_id
      };
      
      // Create an array of promises for each employee transfer
      const transferPromises = selectedEmployees.map(employeeId => {
        return fetch(`${API_BASE_URL}/api/admin/employees/${employeeId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(transferData)
        });
      });
      
      // Execute all transfers in parallel
      const responses = await Promise.all(transferPromises);
      
      // Check if all transfers were successful
      const allSuccessful = responses.every(response => response.ok);
      
      if (!allSuccessful) {
        throw new Error('Failed to transfer one or more employees');
      }
      
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'toast toast-middle toast-center';
      successMsg.innerHTML = `
        <div class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>${selectedEmployees.length} employees transferred successfully!</span>
        </div>
      `;
      document.body.appendChild(successMsg);
      setTimeout(() => {
        document.body.removeChild(successMsg);
      }, 3000);
      
      // Reset the selected employees list
      setSelectedEmployees([]);
      
      // Refresh the employee list
      fetchEmployees();
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error transferring employees:', error);
      
      // Show error message
      const errorMsg = document.createElement('div');
      errorMsg.className = 'toast toast-middle toast-center';
      errorMsg.innerHTML = `
        <div class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Failed to transfer employees. Please try again.</span>
        </div>
      `;
      document.body.appendChild(errorMsg);
      setTimeout(() => {
        document.body.removeChild(errorMsg);
      }, 3000);
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <div>
      <dialog open className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-3xl">
          <h3 className="font-bold text-lg mb-4">Bulk Transfer Employees</h3>
          {selectedEmployees.length === 0 ? (
            <div className="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>No employees selected for transfer. Please select at least one employee.</span>
            </div>
          ) : (
            <div className="mb-4">
              <div className="alert alert-info mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>You have selected {selectedEmployees.length} employee(s) for transfer.</span>
              </div>
              
              {/* Show selected employees */}
              <div className="bg-base-200 p-3 rounded-lg mb-4 max-h-48 overflow-y-auto">
                <h4 className="font-medium mb-2">Selected Employees:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedEmployeeDetails.map(emp => (
                    <div key={emp.id} className="flex items-center p-2 bg-white rounded shadow-sm">
                      <div>
                        <div className="font-medium">{emp.name}</div>
                        <div className="text-xs text-gray-500">{emp.position} • {emp.department_name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <form onSubmit={handleTransferSubmit}>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 font-medium">Transfer To:</div>
                  </div>
                  <div>
                    <div className="mb-2">Company</div>
                    <select 
                      name="company_id" 
                      value={transferFormData.company_id} 
                      onChange={handleTransferChange} 
                      className="select select-bordered w-full" 
                      required
                    >
                      <option value="" disabled>Select company</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <div className="mb-2">Department</div>
                    <select 
                      name="department_id" 
                      value={transferFormData.department_id} 
                      onChange={handleTransferChange} 
                      className="select select-bordered w-full" 
                      required
                      disabled={!transferFormData.company_id}
                    >
                      <option value="" disabled>Select department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <div className="mb-2">Position</div>
                    <select 
                      name="position" 
                      value={transferFormData.position} 
                      onChange={handleTransferChange} 
                      className="select select-bordered w-full" 
                      required
                      disabled={!transferFormData.department_id}
                    >
                      <option value="" disabled>Select position</option>
                      {uniquePositionTitles.map(title => (
                        <option key={title} value={title}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="mb-2">Job Level</div>
                    <select 
                      name="job_level" 
                      value={transferFormData.job_level} 
                      onChange={handleTransferChange} 
                      className="select select-bordered w-full" 
                      required
                      disabled={!transferFormData.position}
                    >
                      <option value="" disabled>Select Job Level</option>
                      {jobLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="modal-action">
                  <button type="button" className="btn" onClick={onClose}>Cancel</button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={transferLoading || !transferFormData.company_id || !transferFormData.department_id || !transferFormData.position_id || selectedEmployees.length === 0}
                  >
                    {transferLoading ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Transferring...
                      </>
                    ) : (
                      'Transfer'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={onClose}>close</button>
        </form>
      </dialog>
    </div>
  );
}




