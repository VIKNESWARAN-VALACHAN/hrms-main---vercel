// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import PayrollPolicyAssignmentForm, { PayrollPolicyAssignment } from '../../../components/payroll/PayrollPolicyAssignmentForm';
// import { API_BASE_URL } from '../../../config';
// import { api } from '../../../utils/api';

// export default function PayrollPolicyAssignmentDetailPage() {
//   const router = useRouter();
//   const params = useParams();
//   const id = params?.id as string;

//   const [assignment, setAssignment] = useState<PayrollPolicyAssignment | null>(null);
//   const [configs, setConfigs] = useState<{ id: number; pay_interval: string }[]>([]);
//   const [companies, setCompanies] = useState<{ id: number; name: string }[]>([]);
//   const [departments, setDepartments] = useState<{ id: number; department_name: string }[]>([]);
//   const [showForm, setShowForm] = useState(false);

//   // Move fetch logic into its own function
//   const fetchDetails = async () => {
//     if (!id) return;
//     setAssignment(await api.get(`/api/payroll-policy-assignments/${id}`));
//     const [c, co, d] = await Promise.all([
//       api.get(`${API_BASE_URL}/api/payroll-config/configs`),
//       api.get(`${API_BASE_URL}/api/admin/companies`),
//       api.get(`${API_BASE_URL}/api/admin/departments`),
//     ]);
//     setConfigs(c);
//     setCompanies(co);
//     setDepartments(d);
//   };

//   useEffect(() => {
//     fetchDetails();
//     // eslint-disable-next-line
//   }, [id]);

//   if (!assignment) return <div className="p-6">Loading...</div>;

//   return (
//     <div className="p-8 max-w-xl mx-auto">
//       <h1 className="text-xl font-bold mb-6">Payroll Policy Assignment Detail</h1>
//       <table className="table w-full mb-6">
//         <tbody>
//           <tr><td>ID</td><td>{assignment.id}</td></tr>
//           <tr>
//             <td>Payroll Config</td>
//             <td>{configs.find(c => c.id === assignment.payroll_config_id)?.pay_interval || '-'}</td>
//           </tr>
//           <tr>
//             <td>Company</td>
//             <td>{companies.find(c => c.id === assignment.company_id)?.name || '-'}</td>
//           </tr>
//           <tr>
//             <td>Department</td>
//             <td>{departments.find(d => d.id === assignment.department_id)?.department_name || '-'}</td>
//           </tr>
//           <tr><td>Start</td><td>{assignment.start_date}</td></tr>
//           <tr><td>End</td><td>{assignment.end_date}</td></tr>
//           <tr><td>Active</td><td>{assignment.is_active ? 'Yes' : 'No'}</td></tr>
//         </tbody>
//       </table>
//       <button className="btn btn-primary mr-2" onClick={() => setShowForm(true)}>
//         Edit
//       </button>
//       <button className="btn btn-secondary" onClick={() => router.push('./')}>
//         Back
//       </button>
//       {showForm && (
//         <PayrollPolicyAssignmentForm
//           mode="edit"
//           editId={id}
//           initialData={assignment}
//           configs={configs}
//           companies={companies}
//           departments={departments}
//           onSave={async () => {
//             setShowForm(false);
//             await fetchDetails(); // <-- Always get latest!
//           }}
//           onCancel={() => setShowForm(false)}
//         />
//       )}
//     </div>
//   );
// }

'use client';

import { useEffect, useState, useCallback  } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
// Corrected import path for PayrollPolicyAssignmentForm
import PayrollPolicyAssignmentForm, { PayrollPolicyAssignment } from '../../../components/payroll/PayrollPolicyAssignmentForm';
import { API_BASE_URL } from '../../../config';
import { api } from '../../../utils/api';

// Re-exporting interfaces for clarity if this file were standalone,
// but they are typically imported from a central types file or the form component itself.
export interface Company { id: number; name: string; }
export interface Department { id: number; department_name: string; }
export interface PayrollConfig { id: number; pay_interval: string; }


export default function PayrollPolicyAssignmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string; // `id` from URL params

  const [assignment, setAssignment] = useState<PayrollPolicyAssignment | null>(null);
  const [configs, setConfigs] = useState<PayrollConfig[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  // Helper function to format date for display in the table
  const formatDateForDisplay = (dateString: string | null | undefined): string => {
    if (!dateString) {
      return '-'; // Or 'N/A'
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid
      }
      return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD for table display
    } catch (error) {
      console.error("Error formatting date for display:", error);
      return dateString;
    }
  };

  // Function to fetch all necessary details
  const fetchDetails =  useCallback(async () => {//async () => {
    // Ensure ID exists and is a valid number before fetching
    const numericId = parseInt(id, 10);
    if (!id || isNaN(numericId)) {
      setLoading(false);
      toast.error('Invalid Assignment ID provided.');
      return;
    }
    setLoading(true);
    try {
      // Fetch the specific assignment details
      const fetchedAssignment: PayrollPolicyAssignment = await api.get(`${API_BASE_URL}/api/payroll-policy-assignments/${id}`);
      setAssignment(fetchedAssignment);

      // Fetch all related lookup data concurrently
      const [c, co, d] = await Promise.all([
        api.get(`${API_BASE_URL}/api/payroll-config/configs`),
        api.get(`${API_BASE_URL}/api/admin/companies`),
        api.get(`${API_BASE_URL}/api/admin/departments`),
      ]);
      setConfigs(c);
      setCompanies(co);
      setDepartments(d);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load assignment details.');
      console.error('Failed to load details:', err);
      setAssignment(null); // Set to null if fetch fails to show "not found"
    } finally {
      setLoading(false);
    }
  }, [id]); //};

  // Fetch data on component mount or when 'id' param changes
  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]); //}, [id]); 

  // Display loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-2 text-white">Loading assignment details...</p>
      </div>
    );
  }

  // If ID is available but assignment is null after loading, it means not found
  if (!assignment) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Payroll policy assignment not found or an error occurred.</p>
        <button className="btn btn-secondary mt-4" onClick={() => router.push('../')}>
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-6">Payroll Policy Assignment Detail</h1>
      <table className="table w-full mb-6">
        <tbody>
          <tr><td>ID</td><td>{assignment.id}</td></tr>
          <tr>
            <td>Payroll Config</td>
            <td>{configs.find(c => c.id === assignment.payroll_config_id)?.pay_interval || '-'}</td>
          </tr>
          <tr>
            <td>Company</td>
            <td>{companies.find(c => c.id === assignment.company_id)?.name || '-'}</td>
          </tr>
          <tr>
            <td>Department</td>
            <td>{departments.find(d => d.id === assignment.department_id)?.department_name || '-'}</td>
          </tr>
          <tr><td>Start Date</td><td>{formatDateForDisplay(assignment.start_date)}</td></tr>
          <tr><td>End Date</td><td>{formatDateForDisplay(assignment.end_date)}</td></tr>
          <tr><td>Active</td><td>{assignment.is_active ? 'Yes' : 'No'}</td></tr>
        </tbody>
      </table>
      <button className="btn btn-primary mr-2" onClick={() => setShowForm(true)}>
        Edit
      </button>
      <button className="btn btn-secondary" onClick={() => router.push('../')}> {/* Go back to parent directory */}
        Back
      </button>
      {showForm && (
        <PayrollPolicyAssignmentForm
          mode="edit"
          // Pass the entire fetched assignment object which contains the ID
          initialData={assignment} // The ID for editing is taken from initialData.id
          configs={configs}
          companies={companies}
          departments={departments}
          onSave={async () => {
            setShowForm(false);
            await fetchDetails(); // Re-fetch to display updated data
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}