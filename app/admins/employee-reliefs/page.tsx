// 'use client';

// import { useEffect, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { api } from '../../utils/api';
// import { API_BASE_URL } from '../../config';
// import { useRouter } from 'next/navigation';

// interface ReliefItem {
//   id: number;
//   relief_id: number;
//   relief_name: string;
//   relief_amount: number;
// }

// interface EmployeeReliefRow {
//   employee_id: number;
//   employee_name: string;
//   reliefs: ReliefItem[];
// }

// export default function EmployeeReliefsPage() {
//   const [rows, setRows] = useState<EmployeeReliefRow[]>([]);
//   const [filteredRows, setFilteredRows] = useState<EmployeeReliefRow[]>([]);
//   const [search, setSearch] = useState('');
//   const router = useRouter();

//   const fetchData = async () => {
//     try {
//       const data = (await api.get(`${API_BASE_URL}/api/employee-reliefs`)) as any[];
//       // Group by employee_id
//       const grouped: Record<number, EmployeeReliefRow> = {};
//       data.forEach((curr) => {
//         const id = curr.employee_id;
//         if (!grouped[id]) {
//           grouped[id] = {
//             employee_id: id,
//             employee_name: curr.employee_name,
//             reliefs: [],
//           };
//         }
//         grouped[id].reliefs.push({
//           id: curr.id,
//           relief_id: curr.relief_id,
//           relief_name: curr.relief_name,
//           relief_amount: parseFloat(curr.relief_amount),
//         });
//       });

//       const groupedArray = Object.values(grouped);
//       setRows(groupedArray);
//       setFilteredRows(groupedArray);
//     } catch (err: any) {
//       toast.error(err.message || 'Failed to fetch data');
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (!search) {
//       setFilteredRows(rows);
//     } else {
//       const keyword = search.toLowerCase();
//       setFilteredRows(
//         rows.filter((row) =>
//           row.employee_name.toLowerCase().includes(keyword)
//         )
//       );
//     }
//   }, [search, rows]);

//   return (
//     <div className="p-8">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Employee Reliefs</h1>
//         <input
//           type="text"
//           placeholder="Search employee..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="input input-bordered w-64"
//         />
//       </div>

//       <div className="overflow-x-auto">
//         <table className="table w-full">
//           <thead>
//             <tr>
//               <th>Employee Name</th>
//               <th>Reliefs</th>
//               <th>Total Relief Amount</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredRows.map((row) => (
//               <tr key={row.employee_id} className="align-top">
//                 <td>{row.employee_name}</td>
//                 <td>
//                   {row.reliefs.map((relief) => (
//                     <div key={relief.id} className="text-sm">
//                       {relief.relief_name} (RM {relief.relief_amount.toFixed(2)})
//                     </div>
//                   ))}
//                 </td>
//                 <td className="font-semibold">
//                   RM {row.reliefs.reduce((sum, r) => sum + r.relief_amount, 0).toFixed(2)}
//                 </td>
//                 <td>
//                   <button
//                     className="btn btn-sm btn-primary"
//                     onClick={() => router.push(`/admins/employee-reliefs/${row.employee_id}`)}
//                   >
//                     Edit
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {filteredRows.length === 0 && (
//               <tr>
//                 <td colSpan={4} className="text-center text-gray-500 py-4">
//                   No records found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { api } from '../../utils/api';
// import { API_BASE_URL } from '../../config';
// import { useRouter } from 'next/navigation';
// import AddEmployeeReliefForm from '../../components/payroll/AddEmployeeReliefForm'; // New component import

// // Interface for a single relief item as returned from the backend's grouped data
// interface ReliefItem {
//   id: number; // ID of the employee_reliefs entry
//   relief_id: number; // ID of the relief_category
//   relief_name: string;
//   relief_amount: number; // Parsed as number
// }

// // Interface for a single row in the Employee Reliefs table (grouped by employee)
// interface EmployeeReliefRow {
//   employee_id: number;
//   employee_name: string;
//   reliefs: ReliefItem[];
// }

// // Interface for Employee data (for dropdown in Add form)
// interface Employee {
//   id: number;
//   name: string;
// }

// // Interface for Relief Category data (for dropdown in Add form)
// interface ReliefOption {
//   id: number;
//   name: string;
//   amount: number;
// }

// export default function EmployeeReliefsPage() {
//   const [rows, setRows] = useState<EmployeeReliefRow[]>([]);
//   const [filteredRows, setFilteredRows] = useState<EmployeeReliefRow[]>([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [showAddModal, setShowAddModal] = useState(false); // State to control add modal visibility

//   // States for dropdown options in the add form
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [reliefOptions, setReliefOptions] = useState<ReliefOption[]>([]);

//   const router = useRouter();

//   // Function to fetch and group employee relief data for the table
//   const fetchTableData = async () => {
//     setLoading(true);
//     try {
//       const data: any[] = await api.get(`${API_BASE_URL}/api/employee-reliefs`);

//       const grouped: Record<number, EmployeeReliefRow> = {};
//       data.forEach((curr) => {
//         const id = curr.employee_id;
//         if (!grouped[id]) {
//           grouped[id] = {
//             employee_id: id,
//             employee_name: curr.employee_name,
//             reliefs: [],
//           };
//         }
//         grouped[id].reliefs.push({
//           id: curr.id,
//           relief_id: curr.relief_id,
//           relief_name: curr.relief_name,
//           relief_amount: parseFloat(curr.relief_amount),
//         });
//       });

//       const groupedArray = Object.values(grouped);
//       setRows(groupedArray);
//       setFilteredRows(groupedArray);
//     } catch (err: any) {
//       toast.error(err.message || 'Failed to fetch employee reliefs data.');
//       console.error("Fetch table data error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to fetch all employees and relief categories for the add form
//   const fetchOptionsData = async () => {
//     try {
//       const [empRes, reliefRes] = await Promise.all([
//         api.get(`${API_BASE_URL}/api/admin/employees`),
//         api.get(`${API_BASE_URL}/api/master-data/reliefs`), // Assuming this endpoint provides all relief categories
//       ]);
//       setEmployees(empRes);
//       setReliefOptions(reliefRes);
//     } catch (err: any) {
//       toast.error(err.message || 'Failed to fetch options data.');
//       console.error("Fetch options data error:", err);
//     }
//   };

//   // Initial data fetch on component mount
//   useEffect(() => {
//     fetchTableData();
//     fetchOptionsData(); // Fetch options when the page loads
//   }, []);

//   // Filter rows based on search input
//   useEffect(() => {
//     if (!search) {
//       setFilteredRows(rows);
//     } else {
//       const keyword = search.toLowerCase();
//       setFilteredRows(
//         rows.filter((row) =>
//           row.employee_name.toLowerCase().includes(keyword)
//         )
//       );
//     }
//   }, [search, rows]);

//   // Handle saving a new relief from the AddEmployeeReliefForm modal
//   const handleSaveNewRelief = async (data: { employee_id: number; relief_id: number }) => {
//     try {
//       await api.post(`${API_BASE_URL}/api/employee-reliefs`, data);
//       toast.success('New employee relief added successfully!');
//       setShowAddModal(false); // Close the modal
//       fetchTableData(); // Refresh the table data
//     } catch (err: any) {
//       toast.error(err.message || 'Failed to add new employee relief.');
//       console.error("Add new relief error:", err);
//     }
//   };

//   return (
//     <div className="p-8">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Employee Reliefs</h1>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             placeholder="Search employee..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="input input-bordered w-64"
//           />
//           <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
//             + Add New Relief
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="text-center py-8">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="mt-2">Loading employee reliefs...</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto bg-white rounded shadow">
//           <table className="table w-full">
//             <thead>
//               <tr>
//                 <th>Employee Name</th>
//                 <th>Reliefs</th>
//                 <th>Total Relief Amount</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredRows.length === 0 ? (
//                 <tr>
//                   <td colSpan={4} className="text-center text-gray-500 py-4">
//                     No employee reliefs found.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredRows.map((row) => (
//                   <tr key={row.employee_id} className="align-top">
//                     <td>{row.employee_name}</td>
//                     <td>
//                       {row.reliefs.length === 0 ? (
//                         <span className="text-gray-500">No reliefs assigned</span>
//                       ) : (
//                         row.reliefs.map((relief) => (
//                           <div key={relief.id} className="text-sm">
//                             {relief.relief_name} (RM {relief.relief_amount.toFixed(2)})
//                           </div>
//                         ))
//                       )}
//                     </td>
//                     <td className="font-semibold">
//                       RM {row.reliefs.reduce((sum, r) => sum + r.relief_amount, 0).toFixed(2)}
//                     </td>
//                     <td>
//                       <button
//                         className="btn btn-sm btn-primary"
//                         onClick={() => router.push(`/admins/employee-reliefs/${row.employee_id}`)}
//                       >
//                         Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* New Add Relief Modal */}
//       {showAddModal && (
//         <AddEmployeeReliefForm
//           employees={employees}
//           reliefOptions={reliefOptions}
//           onSave={handleSaveNewRelief}
//           onCancel={() => setShowAddModal(false)}
//         />
//       )}
//     </div>
//   );
// }


//**************************** */


'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../../utils/api';
import { API_BASE_URL } from '../../config';
import { useRouter } from 'next/navigation';
import AddEmployeeReliefForm from '../../components/payroll/AddEmployeeReliefForm'; // New component import

// Interface for a single relief item as returned from the backend's grouped data
interface ReliefItem {
  id: number; // ID of the employee_reliefs entry
  relief_id: number; // ID of the relief_category
  relief_name: string;
  relief_amount: number; // Parsed as number
}

// Interface for a single row in the Employee Reliefs table (grouped by employee)
interface EmployeeReliefRow {
  employee_id: number;
  employee_name: string;
  reliefs: ReliefItem[];
}

// Interface for Employee data (for dropdown in Add form)
interface Employee {
  id: number;
  name: string;
}

// Interface for Relief Category data (for dropdown in Add form)
interface ReliefOption {
  id: number;
  name: string;
  amount: number;
}

export default function EmployeeReliefsPage() {
  const [rows, setRows] = useState<EmployeeReliefRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<EmployeeReliefRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false); // State to control add modal visibility

  // States for dropdown options in the add form
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [reliefOptions, setReliefOptions] = useState<ReliefOption[]>([]);

  const router = useRouter();

  // Function to fetch and group employee relief data for the table
  const fetchTableData = async () => {
    setLoading(true); // Set loading true when fetching starts
    try {
      const data: any[] = await api.get(`${API_BASE_URL}/api/employee-reliefs`);

      const grouped: Record<number, EmployeeReliefRow> = {};
      data.forEach((curr) => {
        const id = curr.employee_id;
        if (!grouped[id]) {
          grouped[id] = {
            employee_id: id,
            employee_name: curr.employee_name,
            reliefs: [],
          };
        }
        // Push each relief item, ensuring relief_amount is a number
        grouped[id].reliefs.push({
          id: curr.id, // This is the ID from the employee_reliefs table
          relief_id: curr.relief_id, // This is the ID from relief_categories
          relief_name: curr.relief_name,
          relief_amount: parseFloat(curr.relief_amount), // Ensure it's parsed as float
        });
      });

      const groupedArray = Object.values(grouped);
      setRows(groupedArray);
      setFilteredRows(groupedArray); // Initialize filtered rows with all data
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch employee reliefs data.');
      console.error("Fetch table data error:", err);
    } finally {
      setLoading(false); // Set loading false when fetching completes
    }
  };

  // Function to fetch all employees and relief categories for the add form
  const fetchOptionsData = async () => {
    try {
      const [empRes, reliefRes] = await Promise.all([
        api.get(`${API_BASE_URL}/api/admin/employees`),
        api.get(`${API_BASE_URL}/api/master-data/reliefs`), // Assuming this endpoint provides all relief categories
      ]);
      setEmployees(empRes);
      setReliefOptions(reliefRes);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch options data.');
      console.error("Fetch options data error:", err);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchTableData();
    fetchOptionsData(); // Fetch options when the page loads
  }, []);

  // Filter rows based on search input
  useEffect(() => {
    if (!search) {
      setFilteredRows(rows);
    } else {
      const keyword = search.toLowerCase();
      setFilteredRows(
        rows.filter((row) =>
          row.employee_name.toLowerCase().includes(keyword)
        )
      );
    }
  }, [search, rows]); // Depend on search and rows state

  // Handle saving a new relief from the AddEmployeeReliefForm modal
  const handleSaveNewRelief = async (data: { employee_id: number; relief_id: number }) => {
    try {
      await api.post(`${API_BASE_URL}/api/employee-reliefs`, data);
      toast.success('New employee relief added successfully!');
      setShowAddModal(false); // Close the modal
      fetchTableData(); // Refresh the table data
    } catch (err: any) {
      toast.error(err.message || 'Failed to add new employee relief.');
      console.error("Add new relief error:", err);
    }
  };

  // Handle deleting all reliefs for a specific employee
  const handleDeleteEmployeeReliefs = async (employeeIdToDelete: number) => {
    if (!confirm(`Are you sure you want to delete ALL reliefs for this employee? This action cannot be undone.`)) {
      return;
    }
    try {
      // Assuming a backend endpoint like DELETE /api/employee-reliefs/employee/:employee_id
      await api.delete(`${API_BASE_URL}/api/employee-reliefs/${employeeIdToDelete}`);
      toast.success('All reliefs for employee deleted successfully!');
      fetchTableData(); // Refresh the table data
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete employee reliefs.');
      console.error("Delete employee reliefs error:", err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employee Reliefs</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-64"
          />
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + Add New Relief
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-2">Loading employee reliefs...</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Reliefs</th>
                <th>Total Relief Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-4">
                    No employee reliefs found.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.employee_id} className="align-top">
                    <td>{row.employee_name}</td>
                    <td>
                      {row.reliefs.length === 0 ? (
                        <span className="text-gray-500">No reliefs assigned</span>
                      ) : (
                        row.reliefs.map((relief) => (
                          <div key={relief.id} className="text-sm">
                            {relief.relief_name} (RM {relief.relief_amount.toFixed(2)})
                          </div>
                        ))
                      )}
                    </td>
                    <td className="font-semibold">
                      RM {row.reliefs.reduce((sum, r) => sum + r.relief_amount, 0).toFixed(2)}
                    </td>
                    <td>
                      <div className="flex gap-2"> {/* Use flex to align buttons */}
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => router.push(`/admins/employee-reliefs/${row.employee_id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => handleDeleteEmployeeReliefs(row.employee_id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* New Add Relief Modal */}
      {showAddModal && (
        <AddEmployeeReliefForm
          employees={employees}
          reliefOptions={reliefOptions}
          onSave={handleSaveNewRelief}
          onCancel={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}