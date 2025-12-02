// // // 'use client';

// // // import { useState, useEffect, ChangeEvent, FormEvent, useCallback  } from 'react';
// // // import { useRouter } from 'next/navigation';
// // // import Link from 'next/link';
// // // import { FaSave, FaArrowLeft, FaSearch, FaCheck } from 'react-icons/fa';
// // // import { API_BASE_URL, API_ROUTES } from '../../config';
// // // import TargetRowCard, { TargetRow } from './card';
// // // import EmployeeDocumentManager, { EmployeeDocument } from '../../components/EmployeeDocumentManager';
// // // import { useTheme } from '../../components/ThemeProvider';

// // // interface Company {
// // //   id: string;
// // //   name: string;
// // // }

// // // interface Department {
// // //   id: string;
// // //   department_name: string;
// // //   company_id: string;
// // //   company_name: string;
// // // }

// // // interface Position {
// // //   id: string;
// // //   title: string;
// // //   department_id: string;
// // //   company_name: string;
// // //   department_name: string;
// // // }

// // // interface Employee {
// // //   id: string;
// // //   name: string;
// // //   position_id: string;
// // //   department_id: string;
// // //   company_id: string;
// // //   company_name: string;
// // //   department_name: string;
// // //   position_title: string;
// // //   job_level: string;
// // // }

// // // interface FormDataType {
// // //   title: string;
// // //   content: string;
// // //   selectedCompanies: string[];
// // //   selectedDepartments: string[];
// // //   selectedPositions: string[];
// // //   selectedEmployees: string[];
// // //   activeCompanyId: string;
// // //   activeDepartmentId: string;
// // //   activePositionId: string;
// // //   companySearchTerm: string;
// // //   departmentSearchTerm: string;
// // //   positionSearchTerm: string;
// // //   employeeSearchTerm: string;
// // //   requireAcknowledgement: boolean;
// // //   forceAcknowledgeLogin: boolean;
// // //   autoExpire: boolean;
// // //   targetRows: TargetRow[];
// // //   scheduleEnabled: boolean;
// // //   scheduledAt: string;
// // //   attachments: EmployeeDocument[];
// // // }

// // // interface AnnouncementPayload {
// // //   title: string;
// // //   content: string;
// // //   targets: { target_type: string; target_id: string }[];
// // //   target_type?: string;
// // //   target_id?: number;
// // //   requireAcknowledgement: boolean;
// // //   forceAcknowledgeLogin: boolean;
// // //   autoExpire: boolean;
// // //   is_posted: boolean;
// // //   scheduled_at?: string | null;
// // // }

// // // export default function CreateAnnouncementPage() {
// // //   const { theme } = useTheme();
// // //   const router = useRouter();
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState('');
// // //   const [activeTab, setActiveTab] = useState('details');
// // //   const [recipientTab, setRecipientTab] = useState('companies');
// // //   const [companies, setCompanies] = useState<Company[]>([]);
// // //   const [departments, setDepartments] = useState<Department[]>([]);
// // //   const [positions, setPositions] = useState<Position[]>([]);
// // //   const [employees, setEmployees] = useState<Employee[]>([]);
// // //   const [showRequiredToast, setShowRequiredToast] = useState(false);
// // //   const [requiredToastMsg, setRequiredToastMsg] = useState('');
  
// // //   const [formData, setFormData] = useState<FormDataType>({
// // //     title: '',
// // //     content: '',
// // //     selectedCompanies: [],
// // //     selectedDepartments: [],
// // //     selectedPositions: [],
// // //     selectedEmployees: [],
// // //     activeCompanyId: '',
// // //     activeDepartmentId: '',
// // //     activePositionId: '',
// // //     companySearchTerm: '',
// // //     departmentSearchTerm: '',
// // //     positionSearchTerm: '',
// // //     employeeSearchTerm: '',
// // //     requireAcknowledgement: false,
// // //     forceAcknowledgeLogin: false,
// // //     autoExpire: false,
// // //     scheduleEnabled: false,
// // //     scheduledAt: '',
// // //     attachments: [],
// // //     targetRows: [{
// // //       id: Math.random().toString(36).substr(2, 9),
// // //       type: 'companies',
// // //       selectedCompanies: [],
// // //       selectedDepartments: [],
// // //       selectedPositions: [],
// // //       selectedEmployees: [],
// // //       isOpen: true,
// // //       activeTab: 'companies',
// // //       parentType: '',
// // //       selectedAll: false
// // //     }]
// // //   });

// // //   // Handle tab switching
// // //   const handleTabChange = (tab: string) => {
// // //     setActiveTab(tab);
// // //   };

// // //   const fetchCompanies = async () => {
// // //     try {
// // //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.companies}`);

// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         setCompanies(data);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error fetching companies:', error);
// // //     }
// // //   };

// // //   const fetchAllDepartments = useCallback(async () => {//async () => {
// // //     try {
// // //       const id = formData.activeCompanyId;
// // //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.departments}/${id}`);
// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         setDepartments(data);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error fetching departments:', error);
// // //     }
// // //   }, [formData.activeCompanyId]);//};

// // //   const fetchDepartmentsByCompany = async (companyId: string) => {
// // //     try {
// // //       const id = companyId;
// // //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.departments}/${id}`);

// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         setDepartments(data);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error fetching departments:', error);
// // //     }
// // //   };

// // //   const fetchAllPositions = useCallback(async () => {//async () => {
// // //     try {
// // //       const id = formData.activeDepartmentId;
// // //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.positions}`);
// // //       //const response = await fetch(`${API_BASE_URL}/admin/departments/${id}/positions`);
    
// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         setPositions(data);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error fetching positions:', error);
// // //     }
// // //   }, [formData.activeDepartmentId]); //}, []);//};

// // //   const fetchAllEmployees = async () => {
// // //     try {
// // //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.employees}`);
// // //       if (response.ok) {
// // //         const data = await response.json();

// // //         setEmployees(data);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error fetching employees:', error);
// // //     }
// // //   };

// // //   const handleSearchChange = (e: ChangeEvent<HTMLInputElement>, type: 'company' | 'department' | 'position' | 'employee') => {
// // //     const fieldName = `${type}SearchTerm` as 
// // //       'companySearchTerm' | 'departmentSearchTerm' | 'positionSearchTerm' | 'employeeSearchTerm';

// // //     setFormData(prev => ({
// // //       ...prev,
// // //       [fieldName]: e.target.value
// // //     }));
// // //   };

// // //   const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
// // //     const { name, value } = e.target;
// // //     setFormData(prev => ({
// // //       ...prev,
// // //       [name]: value
// // //     }));
// // //   };

// // //   const handleBooleanChange = (e: ChangeEvent<HTMLInputElement>) => {
// // //     const { name, checked } = e.target;
// // //     setFormData(prev => ({
// // //       ...prev,
// // //       [name]: checked
// // //     }));
// // //   };

// // //   // Handle file selection from EmployeeDocumentManager
// // //   const handleFilesSelected = (files: EmployeeDocument[]) => {
// // //     setFormData(prev => ({
// // //       ...prev,
// // //       attachments: files
// // //     }));
// // //   };

// // //   // Handle document deletion from EmployeeDocumentManager
// // //   const handleDocumentDeleted = (removedFile?: EmployeeDocument) => {
// // //     if (removedFile) {
// // //       setFormData(prev => ({
// // //         ...prev,
// // //         attachments: prev.attachments.filter(file => 
// // //           !(file.name === removedFile.name && 
// // //             file.documentType === removedFile.documentType && 
// // //             file.file === removedFile.file)
// // //         )
// // //       }));
// // //     }
// // //   };

// // //   // Remove a file from the selected files
// // //   const removeFile = (index: number) => {
// // //     setFormData(prev => ({
// // //       ...prev,
// // //       attachments: prev.attachments.filter((_, i) => i !== index)
// // //     }));
// // //   };

  
// // //   useEffect(() => {
// // //     fetchCompanies();
// // //     fetchAllDepartments();
// // //     fetchAllPositions();
// // //     fetchAllEmployees();
    
// // //     // Initialize with the first target row if none exists
// // //     if (formData.targetRows.length === 0) {
// // //       setFormData(prev => ({
// // //         ...prev,
// // //         targetRows: [{
// // //           id: Math.random().toString(36).substr(2, 9),
// // //           type: 'companies',
// // //           selectedCompanies: [],
// // //           selectedDepartments: [],
// // //           selectedPositions: [],
// // //           selectedEmployees: [],
// // //           isOpen: true,
// // //           activeTab: 'companies',
// // //           parentType: '',
// // //            selectedAll: false
// // //         }]
// // //       }));
// // //     }
// // //   }, [fetchAllDepartments, fetchAllPositions, formData.targetRows.length]);//}, []);


// // //   const handleSubmit = async (e: FormEvent<HTMLFormElement>, isPost: boolean = false) => {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setError('');

// // //     // Required field validation
// // //     if (!formData.title.trim() || !formData.content.trim()) {
// // //       setShowRequiredToast(true);
// // //       setLoading(false);
// // //       setTimeout(() => setShowRequiredToast(false), 3000);
// // //       setRequiredToastMsg( formData.title.trim() 
// // //       ? 'Content is required field. Please fill it in before submitting.' : formData.content.trim()
// // //       ? 'Title is required field. Please fill it in before submitting.' : 'Title and Content are required fields. Please fill them in before submitting.');
// // //       return;
// // //     }

// // //     try {
// // //       const { 
// // //         title, 
// // //         content,
// // //         requireAcknowledgement,
// // //         forceAcknowledgeLogin,
// // //         autoExpire,
// // //         targetRows,
// // //         scheduleEnabled,
// // //         scheduledAt,
// // //         attachments
// // //       } = formData;
      
// // //       // Create the base payload
// // //       const payload: AnnouncementPayload = {
// // //         title,
// // //         content,
// // //         targets: [],
// // //         requireAcknowledgement,
// // //         forceAcknowledgeLogin,
// // //         autoExpire,
// // //         is_posted: isPost,
// // //         scheduled_at: scheduleEnabled && scheduledAt ? scheduledAt : null
// // //       };
      
// // //       // Get all targets from target rows
// // //       const hasTargets = targetRows.some(row => 
// // //         row.selectedCompanies.length > 0 || 
// // //         row.selectedDepartments.length > 0 || 
// // //         row.selectedPositions.length > 0 || 
// // //         row.selectedEmployees.length > 0
// // //       );

      
// // //       if (!hasTargets) {
// // //         payload.target_type = 'all';
// // //         payload.target_id = 0; // A special ID to indicate all
// // //       } else {
// // //         // Process each target row
// // //         targetRows.forEach(row => {
// // //           const targetType = row.selectedEmployees.length > 0
// // //             ? 'employee' 
// // //             : row.selectedPositions.length > 0  
// // //               ? 'position' 
// // //               : row.selectedDepartments.length > 0 
// // //                 ? 'department' 
// // //                 : 'company';
                
// // //           // Process each collection based on type

// // //           if (row.selectedEmployees.length > 0 ) {
// // //             row.selectedEmployees.forEach(id => {
// // //               payload.targets.push({
// // //                 target_type: targetType,
// // //                 target_id: id
// // //               });
// // //             });
// // //           }else if (row.selectedPositions.length > 0 ) {
// // //             row.selectedPositions.forEach(id => {
// // //               payload.targets.push({
// // //                 target_type: targetType,
// // //                 target_id: id
// // //               });
// // //             });
// // //           }  else if (row.selectedDepartments.length > 0 ) {
// // //             row.selectedDepartments.forEach(id => {
// // //               payload.targets.push({
// // //                 target_type: targetType,
// // //                 target_id: id
// // //               });
// // //             });
// // //           }  
// // //           else if (row.selectedCompanies.length > 0) {
// // //             row.selectedCompanies.forEach(id => {
// // //               payload.targets.push({
// // //                 target_type: targetType,
// // //                 target_id: id
// // //               });
// // //             });
// // //           } 
// // //         });
// // //       }

      
// // //       // Create FormData for file uploads
// // //       const formDataToSend = new FormData();
      
// // //       // Add JSON payload as a string
// // //       formDataToSend.append('data', JSON.stringify({
// // //         ...payload, 
// // //         is_acknowledgement: requireAcknowledgement, 
// // //         is_force_login: forceAcknowledgeLogin,
// // //         is_expired: autoExpire
// // //       }));
      
// // //       // Add files from EmployeeDocument attachments if they have File objects
// // //       if (attachments.length > 0) {
// // //         attachments.forEach(doc => {
// // //           if (doc.file) {
// // //             formDataToSend.append('attachments[]', doc.file);
// // //           }
// // //         });
// // //       }
      
// // //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}`, {
// // //         method: 'POST',
// // //         body: formDataToSend,
// // //       }); 

// // //       if (!response.ok) {
// // //         throw new Error('Failed to create announcement');
// // //       }

// // //       router.push('/announcements');
// // //     } catch (error) {
// // //       console.error('Error creating announcement:', error);
// // //       setError('Failed to create announcement. Please try again.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };
   
// // //   // Toggle selection for an item in a target row
// // //   const toggleTargetRowItem = (rowId: string, itemId: string) => {
// // //     setFormData(prev => {
// // //       const targetRow = prev.targetRows.find(row => row.id === rowId);
// // //       if (!targetRow) return prev;
// // //       let isSelected = false;

// // //       let updatedItems: string[] = [];
// // //       if(targetRow.activeTab === 'companies') {
// // //         isSelected = targetRow.selectedCompanies.includes(itemId);
// // //         updatedItems = isSelected
// // //           ? targetRow.selectedCompanies.filter(id => id !== itemId)
// // //           : [...targetRow.selectedCompanies, itemId];
// // //       } else if(targetRow.activeTab === 'departments') {  
// // //         isSelected = targetRow.selectedDepartments.includes(itemId);
// // //         updatedItems = isSelected
// // //           ? targetRow.selectedDepartments.filter(id => id !== itemId)
// // //           : [...targetRow.selectedDepartments, itemId];
// // //       } else if(targetRow.activeTab === 'positions') {
// // //         isSelected = targetRow.selectedPositions.includes(itemId);
// // //         updatedItems = isSelected
// // //           ? targetRow.selectedPositions.filter(id => id !== itemId)
// // //           : [...targetRow.selectedPositions, itemId];
// // //       } else if(targetRow.activeTab === 'employees') {
// // //         isSelected = targetRow.selectedEmployees.includes(itemId);
// // //         updatedItems = isSelected
// // //           ? targetRow.selectedEmployees.filter(id => id !== itemId)
// // //           : [...targetRow.selectedEmployees, itemId];
// // //       }

// // //       const selectedCompanies = targetRow.activeTab === 'companies' ? updatedItems : prev.selectedCompanies;
// // //       const selectedDepartments = selectedCompanies.length === 0 ? [] : targetRow.activeTab === 'departments' ? updatedItems : prev.selectedDepartments;
// // //       const selectedPositions = selectedCompanies.length === 0 || selectedDepartments.length === 0 ? [] : targetRow.activeTab === 'positions' ? updatedItems : prev.selectedPositions;
// // //       const selectedEmployees = targetRow.selectedCompanies.length === 0 || targetRow.selectedDepartments.length === 0 || targetRow.selectedPositions.length === 0 ? [] : targetRow.activeTab === 'employees' ? updatedItems : prev.selectedEmployees;

// // //       if(targetRow.selectedCompanies.length === 0) {
// // //         targetRow.selectedDepartments = [];
// // //         targetRow.selectedPositions = [];
// // //         targetRow.selectedEmployees = [];
// // //       }

// // //       if(targetRow.selectedDepartments.length === 0) {
// // //         targetRow.selectedPositions = [];
// // //         targetRow.selectedEmployees = [];
// // //       }

// // //       if(targetRow.selectedPositions.length === 0) {
// // //         targetRow.selectedEmployees = [];
// // //       }

// // //       return {
// // //         ...prev,
// // //         selectedCompanies: selectedCompanies,
// // //         selectedDepartments: selectedDepartments,
// // //         selectedPositions: selectedPositions,
// // //         selectedEmployees: selectedEmployees,
// // //         targetRows: prev.targetRows.map(row =>
// // //           row.id === rowId
// // //             ? { 
// // //                 ...row, 
// // //                 selectedCompanies: targetRow.activeTab === 'companies' ? updatedItems : row.selectedCompanies,
// // //                 selectedDepartments: selectedCompanies.length === 0 ? [] : targetRow.activeTab === 'departments' ? updatedItems : row.selectedDepartments,
// // //                 selectedPositions: selectedDepartments.length === 0 || selectedDepartments.length === 0 ? [] : targetRow.activeTab === 'positions' ? updatedItems : row.selectedPositions,
// // //                 selectedEmployees: targetRow.selectedCompanies.length === 0 || targetRow.selectedDepartments.length === 0 || targetRow.selectedPositions.length === 0 ? [] : targetRow.activeTab === 'employees' ? updatedItems : row.selectedEmployees,
// // //                 parentType: targetRow.parentType 
// // //               }
// // //             : row
// // //         )
// // //       };
// // //     });
// // //   };
  
  
// // //   // Add function to check if a company is selected in any row
// // //   const isAnyCompanySelected = () => {
// // //     //onsole.log("isAnyCompanySelected", formData.targetRows);
// // //     const companyRows = formData.targetRows.some(row => 
// // //       (row.type === 'companies' || row.parentType === 'companies') && row.selectedCompanies.length > 0
// // //     );
    
// // //     return companyRows;
// // //   };

// // //   // Add function to check if a department is selected in any row
// // //   const isAnyDepartmentSelected = () => {

// // //     // return formData.targetRows.some(row => 
// // //     //   (row.type === 'departments' || row.activeTab === 'departments') && 
// // //     //   row.selectedItems.length > 0
// // //     // );

// // //     const departmentRows = formData.targetRows.some(row => 
// // //       (row.activeTab === 'departments' || row.parentType === 'departments' || row.selectedPositions.length > 0) && 
// // //       row.selectedDepartments.length > 0);

// // //      return departmentRows || formData.targetRows.some(row => row.activeTab !== 'departments' && row.selectedDepartments.length > 0);
// // //   };

// // //   // Add function to check if a position is selected in any row
// // //   const isAnyPositionSelected = () => {


// // //     const positionRows = formData.targetRows.some(row => 
// // //       (row.activeTab === 'positions' || row.parentType === 'positions'|| row.selectedEmployees.length > 0) && 
// // //       row.selectedPositions.length > 0
// // //     );

// // //     return positionRows || formData.targetRows.some(row => row.activeTab !== 'positions' && row.selectedPositions.length > 0);
// // //   };

// // //   // Change the active tab of a target row
// // //   const changeTargetRowTab = (rowId: string, newTab: 'companies' | 'departments' | 'positions' | 'employees', parentType: '' | 'companies' | 'departments' | 'positions') => {

// // //     // Check if the tab is allowed to be clicked
// // //     if (newTab === 'departments' && !isAnyCompanySelected()) {
// // //       return; // Don't allow switching to departments if no company selected
// // //     }
// // //     if (newTab === 'positions' && !isAnyDepartmentSelected()) {
// // //       return; // Don't allow switching to positions if no department selected
// // //     }
// // //     if (newTab === 'employees' && !isAnyPositionSelected()) {
// // //       return; // Don't allow switching to employees if no position selected
// // //     }
    
// // //     setFormData(prev => ({
// // //       ...prev,
// // //       targetRows: prev.targetRows.map(row =>
// // //         row.id === rowId
// // //           ? { ...row, activeTab: newTab, parentType: parentType }
// // //           : row
// // //       )
// // //     }));
// // //   };

// // //   // Define document types for announcements
// // //   const announcementDocumentTypes = [
// // //     {
// // //       type: 'AnnouncementAttachment',
// // //       label: 'Announcement Attachments',
// // //       description: 'Upload files to be included with this announcement (PDF, Word, Excel, images, etc.)'
// // //     }
// // //   ];

// // //   return (
// // //     <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
// // //       <div className="flex flex-col sm:flex-row justify-between mb-6">
// // //         <nav className="text-sm breadcrumbs">
// // //           <ul>
// // //             <li><Link href="/" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Dashboard</Link></li>
// // //             <li><Link href="/announcements" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Announcements</Link></li>
// // //             <li className="font-semibold">Create Announcement</li>
// // //           </ul>
// // //         </nav>
        
// // //         <div className="flex justify-end">
// // //           <Link href="/announcements" className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
// // //             <FaArrowLeft className="mr-2" /> Back
// // //           </Link>
// // //         </div>
// // //       </div>

// // //       <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Create New Announcement</h1>

// // //       {error && (
// // //         <div className={`alert mb-6 ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
// // //           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
// // //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
// // //           </svg>
// // //           <span>{error}</span>
// // //         </div>
// // //       )}
      
// // //       <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// // //         {/* Tab Navigation */}
// // //         <div className="tabs tabs-bordered mb-6">
// // //           <a 
// // //             className={`tab tab-bordered ${activeTab === 'details' ? 'tab-active' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`} 
// // //             onClick={() => handleTabChange('details')}
// // //           >
// // //             Announcement Details
// // //           </a>
// // //           <a 
// // //             className={`tab tab-bordered ${activeTab === 'recipients' ? 'tab-active' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}
// // //             onClick={() => handleTabChange('recipients')}
// // //           >
// // //             Recipients
// // //           </a>
// // //         </div>

// // //         {/* Announcement Details Tab */}
// // //         <div className={`tab-content ${activeTab === 'details' ? 'block' : 'hidden'}`}>
// // //           <div className="mb-8">
// // //             <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Announcement Details</h2>
            
// // //             <div className="grid grid-cols-1 gap-6 mb-6">
// // //               <div>
// // //                 <div className={`mb-2 font-medium flex items-center gap-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                   Title <span className="text-red-500">*</span>
// // //                 </div>
// // //                 <input
// // //                   type="text"
// // //                   name="title"
// // //                   value={formData.title}
// // //                   onChange={handleTextChange}
// // //                   className={`input w-full border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
// // //                   required
// // //                   placeholder="Enter announcement title"
// // //                 />
// // //               </div>

// // //               <div>
// // //                 <div className={`mb-2 font-medium flex items-center gap-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                   Content <span className="text-red-500">*</span>
// // //                 </div>
// // //                 <textarea
// // //                   name="content"
// // //                   value={formData.content}
// // //                   onChange={handleTextChange}
// // //                   className={`textarea w-full h-40 border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
// // //                   required
// // //                   placeholder="Enter announcement content"
// // //                 />
// // //               </div>
              
// // //               {/* Replace File Attachment Section with EmployeeDocumentManager */}
// // //               <div className="mt-4">
// // //                 <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Attachments</div>
// // //                 <EmployeeDocumentManager
// // //                   employeeId={null}
// // //                   mode="add"
// // //                   documentTypes={announcementDocumentTypes}
// // //                   onFilesSelected={handleFilesSelected}
// // //                   moduleName="announcement"
// // //                   customUploadEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents/upload-request`}
// // //                   customDeleteEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents`}
// // //                   customViewEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents/view-url`}
// // //                   initialDocuments={formData.attachments || []}
// // //                   onDocumentDeleted={handleDocumentDeleted}
// // //                 />
// // //               </div>
// // //             </div>
// // //           </div>
          
// // //           <div className="mt-4 flex justify-between">
// // //             <div></div> {/* Empty div for spacing */}
// // //             <button 
// // //               type="button" 
// // //               className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
// // //               onClick={() => handleTabChange('recipients')}
// // //             >
// // //               Next: Select Recipients
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* Recipients Tab */}
// // //         <div className={`tab-content ${activeTab === 'recipients' ? 'block' : 'hidden'}`}>
// // //           <div className="mb-8">
// // //             <div className="flex items-center mb-4">
// // //               <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Recipients</h2>
// // //               <div className={`badge ml-3 ${theme === 'light' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-blue-900 text-blue-200 border-blue-700'} border`}>Optional</div>
// // //             </div>
            
// // //             <div className={`alert mb-6 ${theme === 'light' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-blue-900 border-blue-700 text-blue-200'} border rounded-lg`}>
// // //               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
// // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
// // //               </svg>
// // //               <span>If no target rows are added, the announcement will be sent to all parties.</span>
// // //             </div>

// // //             {/* Target Rows Container */}
// // //             <div className="space-y-4 mb-6">
// // //               {formData.targetRows.map((row, index) => (
// // //                 <TargetRowCard
// // //                   key={row.id}
// // //                   row={row}
// // //                   index={index}
// // //                   companies={companies}
// // //                   departments={departments}
// // //                   positions={positions}
// // //                   employees={employees}
// // //                   companySearchTerm={formData.companySearchTerm}
// // //                   departmentSearchTerm={formData.departmentSearchTerm}
// // //                   positionSearchTerm={formData.positionSearchTerm}
// // //                   employeeSearchTerm={formData.employeeSearchTerm}
// // //                   targetRows={formData.targetRows}
// // //                   onChangeTab={changeTargetRowTab}
// // //                   onToggleItem={toggleTargetRowItem}
// // //                   onSearchChange={handleSearchChange}
// // //                   isAnyCompanySelected={isAnyCompanySelected}
// // //                   isAnyDepartmentSelected={isAnyDepartmentSelected}
// // //                   isAnyPositionSelected={isAnyPositionSelected}
// // //                 />
// // //               ))}
// // //             </div>

// // //             {/* Acknowledgement Options */}
// // //             <div className={`mb-8 p-4 rounded-lg mt-4 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
// // //               <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Acknowledgement Options</h3>
              
// // //               <div className="space-y-4">
// // //                 <div className="form-control">
// // //                   <label className="label cursor-pointer justify-start gap-3">
// // //                     <input 
// // //                       type="checkbox" 
// // //                       className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
// // //                       name="requireAcknowledgement"
// // //                       checked={formData.requireAcknowledgement}
// // //                       onChange={handleBooleanChange}
// // //                     />
// // //                     <div>
// // //                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Require Acknowledgement</span>
// // //                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients will need to acknowledge they have read this announcement</p>
// // //                     </div>
// // //                   </label>
// // //                 </div>
                
// // //                 <div className="form-control">
// // //                   <label className="label cursor-pointer justify-start gap-3">
// // //                     <input 
// // //                       type="checkbox" 
// // //                       className={`toggle ${theme === 'light' ? 'toggle-primary' : 'toggle-accent'}`}
// // //                       name="forceAcknowledgeLogin"
// // //                       checked={formData.forceAcknowledgeLogin}
// // //                       onChange={handleBooleanChange}
// // //                       disabled={!formData.requireAcknowledgement}
// // //                     />
// // //                     <div>
// // //                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Force Acknowledgement on Login</span>
// // //                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients will be required to acknowledge this announcement before they can proceed</p>
// // //                     </div>
// // //                   </label>
// // //                 </div>

// // //                 <div className="form-control">
// // //                   <label className="label cursor-pointer justify-start gap-3">
// // //                     <input 
// // //                       type="checkbox" 
// // //                       className="checkbox checkbox-primary" 
// // //                       name="autoExpire"
// // //                       checked={formData.autoExpire}
// // //                       onChange={handleBooleanChange}
// // //                       disabled={!formData.requireAcknowledgement}
// // //                     />
// // //                     <div>
// // //                       <span className="label-text font-medium">Auto-Expire After 7 Days</span>
// // //                       <p className="text-xs text-gray-500 mt-1">Announcement will be automatically deleted 7 days after all targeted employees have read it</p>
// // //                     </div>
// // //                   </label>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Schedule Options */}
// // //             <div className={`mb-8 p-4 rounded-lg mt-4 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
// // //               <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule Options</h3>
              
// // //               <div className="space-y-4">
// // //                 <div className="form-control">
// // //                   <label className="label cursor-pointer justify-start gap-3">
// // //                     <input 
// // //                       type="checkbox" 
// // //                       className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
// // //                       name="scheduleEnabled"
// // //                       checked={formData.scheduleEnabled}
// // //                       onChange={handleBooleanChange}
// // //                     />
// // //                     <div>
// // //                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule this announcement</span>
// // //                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>This announcement will be published automatically at the specified date and time</p>
// // //                     </div>
// // //                   </label>
// // //                 </div>
                
// // //                 {formData.scheduleEnabled && (
// // //                   <div className="form-control">
// // //                     <label className="label">
// // //                       <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Publication Date and Time</span>
// // //                     </label>
// // //                     <div className="flex items-center gap-2">
// // //                       <input 
// // //                         type="datetime-local" 
// // //                         className={`input border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-600 border-slate-500 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
// // //                         name="scheduledAt"
// // //                         value={formData.scheduledAt}
// // //                       onChange={(e) => setFormData(prev => ({
// // //                         ...prev,
// // //                         scheduledAt: e.target.value
// // //                       }))}
// // //                       min={new Date().toISOString().slice(0, 16)}
// // //                         required={formData.scheduleEnabled}
// // //                       />
// // //                     </div>
// // //                     <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Select the date and time when this announcement should be published</p>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>
          
// // //           <div className="mt-4 flex justify-between">
// // //             <button 
// // //               type="button" 
// // //               className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
// // //               onClick={() => handleTabChange('details')}
// // //             >
// // //               Back to Details
// // //             </button>
// // //             <div></div> {/* Empty div for spacing */}
// // //           </div>
// // //         </div>

// // //         {/* Submit buttons - only show on Recipients tab */}
// // //         <div className={`mt-8 pt-4 border-t flex justify-end ${activeTab === 'recipients' ? 'block' : 'hidden'} ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
// // //           <Link href="/announcements" className={`btn btn-outline mr-3 ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
// // //             Cancel
// // //           </Link>
// // //           {!formData.scheduleEnabled && (
// // //             <button
// // //               type="button"
// // //               className={`btn mr-3 ${theme === 'light' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-amber-400 hover:bg-amber-500'} text-white border-0`}
// // //               disabled={loading || (formData.scheduleEnabled && !formData.scheduledAt)}
// // //               onClick={() => {
// // //               const syntheticEvent = { 
// // //                 preventDefault: () => {} 
// // //               } as FormEvent<HTMLFormElement>;
// // //               handleSubmit(syntheticEvent, false);
// // //             }}
// // //           >
// // //             {loading ? (
// // //               <>
// // //                 <span className="loading loading-spinner loading-sm mr-2"></span>
// // //                 Saving...
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <FaSave className="mr-2" /> Save Draft
// // //               </>
// // //             )}
// // //           </button>
// // //           )}
// // //           <button
// // //             type="submit"
// // //             className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
// // //             disabled={loading || (formData.scheduleEnabled && !formData.scheduledAt)}
// // //             onClick={() => {
// // //               const syntheticEvent = { 
// // //                 preventDefault: () => {} 
// // //               } as FormEvent<HTMLFormElement>;
// // //               handleSubmit(syntheticEvent, formData.scheduleEnabled ? false : true);
// // //             }}
// // //           >
// // //             {loading ? (
// // //               <>
// // //                 <span className="loading loading-spinner loading-sm mr-2"></span>
// // //                 Saving...
// // //               </>
// // //             ) : formData.scheduleEnabled ? (
// // //               <>
// // //                 <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// // //                 </svg>
// // //                 Schedule
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
// // //                 </svg>
// // //                 Post
// // //               </>
// // //             )}
// // //           </button>
// // //         </div>
// // //       </form>

// // //       {/* DaisyUI Toast for required fields */}
// // //       <div className="toast toast-center toast-middle z-50">
// // //         {showRequiredToast && (
// // //           <div className={`alert shadow-lg ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
// // //             <span>{requiredToastMsg}</span>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // } 



// // // 'use client';

// // // import { useState, useEffect, ChangeEvent, FormEvent, useCallback, useMemo, JSX } from 'react';
// // // import { useRouter } from 'next/navigation';
// // // import Link from 'next/link';
// // // import { FaSave, FaArrowLeft, FaSearch, FaCheck, FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
// // // import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, BaseEditor, BaseElement, BaseText } from 'slate';
// // // import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react';
// // // import { withHistory, HistoryEditor } from 'slate-history';
// // // import { API_BASE_URL, API_ROUTES } from '../../config';
// // // import TargetRowCard, { TargetRow } from './card';
// // // import EmployeeDocumentManager, { EmployeeDocument } from '../../components/EmployeeDocumentManager';
// // // import { useTheme } from '../../components/ThemeProvider';

// // // // Extend Slate types to include our custom formatting
// // // type CustomText = {
// // //   bold?: boolean;
// // //   italic?: boolean;
// // //   underline?: boolean;
// // //   text: string;
// // // };

// // // type ParagraphElement = {
// // //   type: 'paragraph';
// // //   children: CustomText[];
// // // };

// // // type CustomElement = ParagraphElement;

// // // declare module 'slate' {
// // //   interface CustomTypes {
// // //     Editor: BaseEditor & ReactEditor & HistoryEditor;
// // //     Element: CustomElement;
// // //     Text: CustomText;
// // //   }
// // // }

// // // interface Company {
// // //   id: string;
// // //   name: string;
// // // }

// // // interface Department {
// // //   id: string;
// // //   department_name: string;
// // //   company_id: string;
// // //   company_name: string;
// // // }

// // // interface Position {
// // //   id: string;
// // //   title: string;
// // //   department_id: string;
// // //   company_name: string;
// // //   department_name: string;
// // // }

// // // interface Employee {
// // //   id: string;
// // //   name: string;
// // //   position_id: string;
// // //   department_id: string;
// // //   company_id: string;
// // //   company_name: string;
// // //   department_name: string;
// // //   position_title: string;
// // //   job_level: string;
// // // }

// // // interface FormDataType {
// // //   title: string;
// // //   content: string;
// // //   selectedCompanies: string[];
// // //   selectedDepartments: string[];
// // //   selectedPositions: string[];
// // //   selectedEmployees: string[];
// // //   activeCompanyId: string;
// // //   activeDepartmentId: string;
// // //   activePositionId: string;
// // //   companySearchTerm: string;
// // //   departmentSearchTerm: string;
// // //   positionSearchTerm: string;
// // //   employeeSearchTerm: string;
// // //   requireAcknowledgement: boolean;
// // //   forceAcknowledgeLogin: boolean;
// // //   autoExpire: boolean;
// // //   targetRows: TargetRow[];
// // //   scheduleEnabled: boolean;
// // //   scheduledAt: string;
// // //   attachments: EmployeeDocument[];
// // // }

// // // interface AnnouncementPayload {
// // //   title: string;
// // //   content: string;
// // //   targets: { target_type: string; target_id: string }[];
// // //   target_type?: string;
// // //   target_id?: number;
// // //   requireAcknowledgement: boolean;
// // //   forceAcknowledgeLogin: boolean;
// // //   autoExpire: boolean;
// // //   is_posted: boolean;
// // //   scheduled_at?: string | null;
// // // }

// // // // Define our own custom set of helpers for formatting
// // // const CustomEditor = {
// // //   isBoldMarkActive(editor: Editor) {
// // //     const marks = Editor.marks(editor);
// // //     return marks ? (marks as CustomText).bold === true : false;
// // //   },

// // //   isItalicMarkActive(editor: Editor) {
// // //     const marks = Editor.marks(editor);
// // //     return marks ? (marks as CustomText).italic === true : false;
// // //   },

// // //   isUnderlineMarkActive(editor: Editor) {
// // //     const marks = Editor.marks(editor);
// // //     return marks ? (marks as CustomText).underline === true : false;
// // //   },

// // //   toggleBoldMark(editor: Editor) {
// // //     const isActive = CustomEditor.isBoldMarkActive(editor);
// // //     if (isActive) {
// // //       Editor.removeMark(editor, 'bold');
// // //     } else {
// // //       Editor.addMark(editor, 'bold', true);
// // //     }
// // //   },

// // //   toggleItalicMark(editor: Editor) {
// // //     const isActive = CustomEditor.isItalicMarkActive(editor);
// // //     if (isActive) {
// // //       Editor.removeMark(editor, 'italic');
// // //     } else {
// // //       Editor.addMark(editor, 'italic', true);
// // //     }
// // //   },

// // //   toggleUnderlineMark(editor: Editor) {
// // //     const isActive = CustomEditor.isUnderlineMarkActive(editor);
// // //     if (isActive) {
// // //       Editor.removeMark(editor, 'underline');
// // //     } else {
// // //       Editor.addMark(editor, 'underline', true);
// // //     }
// // //   },
// // // };

// // // // Initial value for the Slate editor
// // // const initialValue: CustomElement[] = [
// // //   {
// // //     type: 'paragraph',
// // //     children: [{ text: '' }],
// // //   },
// // // ];

// // // export default function CreateAnnouncementPage() {
// // //   const { theme } = useTheme();
// // //   const router = useRouter();
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState('');
// // //   const [activeTab, setActiveTab] = useState('details');
// // //   const [recipientTab, setRecipientTab] = useState('companies');
// // //   const [companies, setCompanies] = useState<Company[]>([]);
// // //   const [departments, setDepartments] = useState<Department[]>([]);
// // //   const [positions, setPositions] = useState<Position[]>([]);
// // //   const [employees, setEmployees] = useState<Employee[]>([]);
// // //   const [showRequiredToast, setShowRequiredToast] = useState(false);
// // //   const [requiredToastMsg, setRequiredToastMsg] = useState('');
  
// // //   // Create a Slate editor object that won't change across renders
// // //   const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  
// // //   const [formData, setFormData] = useState<FormDataType>({
// // //     title: '',
// // //     content: '',
// // //     selectedCompanies: [],
// // //     selectedDepartments: [],
// // //     selectedPositions: [],
// // //     selectedEmployees: [],
// // //     activeCompanyId: '',
// // //     activeDepartmentId: '',
// // //     activePositionId: '',
// // //     companySearchTerm: '',
// // //     departmentSearchTerm: '',
// // //     positionSearchTerm: '',
// // //     employeeSearchTerm: '',
// // //     requireAcknowledgement: false,
// // //     forceAcknowledgeLogin: false,
// // //     autoExpire: false,
// // //     scheduleEnabled: false,
// // //     scheduledAt: '',
// // //     attachments: [],
// // //     targetRows: [{
// // //       id: Math.random().toString(36).substr(2, 9),
// // //       type: 'companies',
// // //       selectedCompanies: [],
// // //       selectedDepartments: [],
// // //       selectedPositions: [],
// // //       selectedEmployees: [],
// // //       isOpen: true,
// // //       activeTab: 'companies',
// // //       parentType: '',
// // //       selectedAll: false
// // //     }]
// // //   });


// // //   const MarkButton = ({
// // //   format,
// // //   icon,
// // //   theme,
// // // }: {
// // //   format: 'bold' | 'italic' | 'underline';
// // //   icon: JSX.Element;
// // //   theme: string;
// // // }) => {
// // //   const editor = useSlate();
// // //   const isActive =
// // //     format === 'bold'
// // //       ? CustomEditor.isBoldMarkActive(editor)
// // //       : format === 'italic'
// // //       ? CustomEditor.isItalicMarkActive(editor)
// // //       : CustomEditor.isUnderlineMarkActive(editor);

// // //   return (
// // //     <button
// // //       type="button"
// // //       aria-pressed={isActive}
// // //       onMouseDown={(e) => {
// // //         e.preventDefault();
// // //         // ensure the editor has focus & a selection
// // //         ReactEditor.focus(editor);
// // //         if (!editor.selection) {
// // //           try {
// // //             Transforms.select(editor, Editor.end(editor, []));
// // //           } catch {}
// // //         }
// // //         if (format === 'bold') CustomEditor.toggleBoldMark(editor);
// // //         else if (format === 'italic') CustomEditor.toggleItalicMark(editor);
// // //         else CustomEditor.toggleUnderlineMark(editor);
// // //       }}
// // //       className={[
// // //         'px-2 py-1 rounded-md text-sm font-semibold border transition-colors',
// // //         isActive
// // //           ? theme === 'light'
// // //             ? 'bg-blue-600 text-white border-blue-600'
// // //             : 'bg-blue-500 text-white border-blue-500'
// // //           : theme === 'light'
// // //           ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
// // //           : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600',
// // //       ].join(' ')}
// // //     >
// // //       {icon}
// // //     </button>
// // //   );
// // // };


// // //   // Handle tab switching
// // //   const handleTabChange = (tab: string) => {
// // //     setActiveTab(tab);
// // //   };

// // //   const fetchCompanies = async () => {
// // //     try {
// // //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.companies}`);

// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         setCompanies(data);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error fetching companies:', error);
// // //     }
// // //   };

// // //   const fetchAllDepartments = useCallback(async () => {
// // //     try {
// // //       const id = formData.activeCompanyId;
// // //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.departments}/${id}`);
// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         setDepartments(data);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error fetching departments:', error);
// // //     }
// // //   }, [formData.activeCompanyId]);

// // //   const fetchDepartmentsByCompany = async (companyId: string) => {
// // //     try {
// // //       const id = companyId;
// // //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.departments}/${id}`);

// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         setDepartments(data);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error fetching departments:', error);
// // //     }
// // //   };

// // //   const fetchAllPositions = useCallback(async () => {
// // //     try {
// // //       const id = formData.activeDepartmentId;
// // //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.positions}`);
    
// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         setPositions(data);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error fetching positions:', error);
// // //     }
// // //   }, [formData.activeDepartmentId]);

// // //   const fetchAllEmployees = async () => {
// // //     try {
// // //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.employees}`);
// // //       if (response.ok) {
// // //         const data = await response.json();

// // //         setEmployees(data);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error fetching employees:', error);
// // //     }
// // //   };

// // //   const handleSearchChange = (e: ChangeEvent<HTMLInputElement>, type: 'company' | 'department' | 'position' | 'employee') => {
// // //     const fieldName = `${type}SearchTerm` as 
// // //       'companySearchTerm' | 'departmentSearchTerm' | 'positionSearchTerm' | 'employeeSearchTerm';

// // //     setFormData(prev => ({
// // //       ...prev,
// // //       [fieldName]: e.target.value
// // //     }));
// // //   };

// // //   const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
// // //     const { name, value } = e.target;
// // //     setFormData(prev => ({
// // //       ...prev,
// // //       [name]: value
// // //     }));
// // //   };

// // //   const handleBooleanChange = (e: ChangeEvent<HTMLInputElement>) => {
// // //     const { name, checked } = e.target;
// // //     setFormData(prev => ({
// // //       ...prev,
// // //       [name]: checked
// // //     }));
// // //   };

// // //   // Handle file selection from EmployeeDocumentManager
// // //   const handleFilesSelected = (files: EmployeeDocument[]) => {
// // //     setFormData(prev => ({
// // //       ...prev,
// // //       attachments: files
// // //     }));
// // //   };

// // //   // Handle document deletion from EmployeeDocumentManager
// // //   const handleDocumentDeleted = (removedFile?: EmployeeDocument) => {
// // //     if (removedFile) {
// // //       setFormData(prev => ({
// // //         ...prev,
// // //         attachments: prev.attachments.filter(file => 
// // //           !(file.name === removedFile.name && 
// // //             file.documentType === removedFile.documentType && 
// // //             file.file === removedFile.file)
// // //         )
// // //       }));
// // //     }
// // //   };

// // //   // Remove a file from the selected files
// // //   const removeFile = (index: number) => {
// // //     setFormData(prev => ({
// // //       ...prev,
// // //       attachments: prev.attachments.filter((_, i) => i !== index)
// // //     }));
// // //   };

  
// // //   useEffect(() => {
// // //     fetchCompanies();
// // //     fetchAllDepartments();
// // //     fetchAllPositions();
// // //     fetchAllEmployees();
    
// // //     // Initialize with the first target row if none exists
// // //     if (formData.targetRows.length === 0) {
// // //       setFormData(prev => ({
// // //         ...prev,
// // //         targetRows: [{
// // //           id: Math.random().toString(36).substr(2, 9),
// // //           type: 'companies',
// // //           selectedCompanies: [],
// // //           selectedDepartments: [],
// // //           selectedPositions: [],
// // //           selectedEmployees: [],
// // //           isOpen: true,
// // //           activeTab: 'companies',
// // //           parentType: '',
// // //            selectedAll: false
// // //         }]
// // //       }));
// // //     }
// // //   }, [fetchAllDepartments, fetchAllPositions, formData.targetRows.length]);

// // //   // Serialize Slate content to HTML
// // //   const serialize = (node: Descendant): string => {
// // //     if (SlateElement.isElement(node)) {
// // //       const element = node as CustomElement;
// // //       const children = element.children.map(n => serialize(n)).join('');
      
// // //       switch (element.type) {
// // //         case 'paragraph':
// // //           return `<p>${children}</p>`;
// // //         default:
// // //           return children;
// // //       }
// // //     }
    
// // //     // Handle text nodes with formatting
// // //     const textNode = node as CustomText;
// // //     let string = textNode.text;
// // //     if (textNode.bold) {
// // //       string = `<strong>${string}</strong>`;
// // //     }
// // //     if (textNode.italic) {
// // //       string = `<em>${string}</em>`;
// // //     }
// // //     if (textNode.underline) {
// // //       string = `<u>${string}</u>`;
// // //     }
// // //     return string;
// // //   };

// // //   const handleSubmit = async (e: FormEvent<HTMLFormElement>, isPost: boolean = false) => {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setError('');

// // //     const htmlContent = formData.content || editor.children.map(n => serialize(n)).join('');

// // //     // Required field validation
// // //     if (!formData.title.trim() || !htmlContent.trim()) {
// // //       setShowRequiredToast(true);
// // //       setLoading(false);
// // //       setTimeout(() => setShowRequiredToast(false), 3000);
// // //       setRequiredToastMsg( formData.title.trim() 
// // //       ? 'Content is required field. Please fill it in before submitting.' : htmlContent.trim()
// // //       ? 'Title is required field. Please fill it in before submitting.' : 'Title and Content are required fields. Please fill them in before submitting.');
// // //       return;
// // //     }

// // //     try {
// // //       const { 
// // //         title,
// // //         requireAcknowledgement,
// // //         forceAcknowledgeLogin,
// // //         autoExpire,
// // //         targetRows,
// // //         scheduleEnabled,
// // //         scheduledAt,
// // //         attachments
// // //       } = formData;
      
// // //       // Create the base payload
// // //       const payload: AnnouncementPayload = {
// // //         title,
// // //         content: htmlContent,
// // //         targets: [],
// // //         requireAcknowledgement,
// // //         forceAcknowledgeLogin,
// // //         autoExpire,
// // //         is_posted: isPost,
// // //         scheduled_at: scheduleEnabled && scheduledAt ? scheduledAt : null
// // //       };
      
// // //       // Get all targets from target rows
// // //       const hasTargets = targetRows.some(row => 
// // //         row.selectedCompanies.length > 0 || 
// // //         row.selectedDepartments.length > 0 || 
// // //         row.selectedPositions.length > 0 || 
// // //         row.selectedEmployees.length > 0
// // //       );

      
// // //       if (!hasTargets) {
// // //         payload.target_type = 'all';
// // //         payload.target_id = 0; // A special ID to indicate all
// // //       } else {
// // //         // Process each target row
// // //         targetRows.forEach(row => {
// // //           const targetType = row.selectedEmployees.length > 0
// // //             ? 'employee' 
// // //             : row.selectedPositions.length > 0  
// // //               ? 'position' 
// // //               : row.selectedDepartments.length > 0 
// // //                 ? 'department' 
// // //                 : 'company';
                
// // //           // Process each collection based on type

// // //           if (row.selectedEmployees.length > 0 ) {
// // //             row.selectedEmployees.forEach(id => {
// // //               payload.targets.push({
// // //                 target_type: targetType,
// // //                 target_id: id
// // //               });
// // //             });
// // //           }else if (row.selectedPositions.length > 0 ) {
// // //             row.selectedPositions.forEach(id => {
// // //               payload.targets.push({
// // //                 target_type: targetType,
// // //                 target_id: id
// // //               });
// // //             });
// // //           }  else if (row.selectedDepartments.length > 0 ) {
// // //             row.selectedDepartments.forEach(id => {
// // //               payload.targets.push({
// // //                 target_type: targetType,
// // //                 target_id: id
// // //               });
// // //             });
// // //           }  
// // //           else if (row.selectedCompanies.length > 0) {
// // //             row.selectedCompanies.forEach(id => {
// // //               payload.targets.push({
// // //                 target_type: targetType,
// // //                 target_id: id
// // //               });
// // //             });
// // //           } 
// // //         });
// // //       }

      
// // //       // Create FormData for file uploads
// // //       const formDataToSend = new FormData();
      
// // //       // Add JSON payload as a string
// // //       formDataToSend.append('data', JSON.stringify({
// // //         ...payload, 
// // //         is_acknowledgement: requireAcknowledgement, 
// // //         is_force_login: forceAcknowledgeLogin,
// // //         is_expired: autoExpire
// // //       }));
      
// // //       // Add files from EmployeeDocument attachments if they have File objects
// // //       if (attachments.length > 0) {
// // //         attachments.forEach(doc => {
// // //           if (doc.file) {
// // //             formDataToSend.append('attachments[]', doc.file);
// // //           }
// // //         });
// // //       }
      
// // //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}`, {
// // //         method: 'POST',
// // //         body: formDataToSend,
// // //       }); 

// // //       if (!response.ok) {
// // //         throw new Error('Failed to create announcement');
// // //       }

// // //       router.push('/announcements');
// // //     } catch (error) {
// // //       console.error('Error creating announcement:', error);
// // //       setError('Failed to create announcement. Please try again.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };
   
// // //   // Toggle selection for an item in a target row
// // //   const toggleTargetRowItem = (rowId: string, itemId: string) => {
// // //     setFormData(prev => {
// // //       const targetRow = prev.targetRows.find(row => row.id === rowId);
// // //       if (!targetRow) return prev;
// // //       let isSelected = false;

// // //       let updatedItems: string[] = [];
// // //       if(targetRow.activeTab === 'companies') {
// // //         isSelected = targetRow.selectedCompanies.includes(itemId);
// // //         updatedItems = isSelected
// // //           ? targetRow.selectedCompanies.filter(id => id !== itemId)
// // //           : [...targetRow.selectedCompanies, itemId];
// // //       } else if(targetRow.activeTab === 'departments') {  
// // //         isSelected = targetRow.selectedDepartments.includes(itemId);
// // //         updatedItems = isSelected
// // //           ? targetRow.selectedDepartments.filter(id => id !== itemId)
// // //           : [...targetRow.selectedDepartments, itemId];
// // //       } else if(targetRow.activeTab === 'positions') {
// // //         isSelected = targetRow.selectedPositions.includes(itemId);
// // //         updatedItems = isSelected
// // //           ? targetRow.selectedPositions.filter(id => id !== itemId)
// // //           : [...targetRow.selectedPositions, itemId];
// // //       } else if(targetRow.activeTab === 'employees') {
// // //         isSelected = targetRow.selectedEmployees.includes(itemId);
// // //         updatedItems = isSelected
// // //           ? targetRow.selectedEmployees.filter(id => id !== itemId)
// // //           : [...targetRow.selectedEmployees, itemId];
// // //       }

// // //       const selectedCompanies = targetRow.activeTab === 'companies' ? updatedItems : prev.selectedCompanies;
// // //       const selectedDepartments = selectedCompanies.length === 0 ? [] : targetRow.activeTab === 'departments' ? updatedItems : prev.selectedDepartments;
// // //       const selectedPositions = selectedCompanies.length === 0 || selectedDepartments.length === 0 ? [] : targetRow.activeTab === 'positions' ? updatedItems : prev.selectedPositions;
// // //       const selectedEmployees = targetRow.selectedCompanies.length === 0 || targetRow.selectedDepartments.length === 0 || targetRow.selectedPositions.length === 0 ? [] : targetRow.activeTab === 'employees' ? updatedItems : prev.selectedEmployees;

// // //       if(targetRow.selectedCompanies.length === 0) {
// // //         targetRow.selectedDepartments = [];
// // //         targetRow.selectedPositions = [];
// // //         targetRow.selectedEmployees = [];
// // //       }

// // //       if(targetRow.selectedDepartments.length === 0) {
// // //         targetRow.selectedPositions = [];
// // //         targetRow.selectedEmployees = [];
// // //       }

// // //       if(targetRow.selectedPositions.length === 0) {
// // //         targetRow.selectedEmployees = [];
// // //       }

// // //       return {
// // //         ...prev,
// // //         selectedCompanies: selectedCompanies,
// // //         selectedDepartments: selectedDepartments,
// // //         selectedPositions: selectedPositions,
// // //         selectedEmployees: selectedEmployees,
// // //         targetRows: prev.targetRows.map(row =>
// // //           row.id === rowId
// // //             ? { 
// // //                 ...row, 
// // //                 selectedCompanies: targetRow.activeTab === 'companies' ? updatedItems : row.selectedCompanies,
// // //                 selectedDepartments: selectedCompanies.length === 0 ? [] : targetRow.activeTab === 'departments' ? updatedItems : row.selectedDepartments,
// // //                 selectedPositions: selectedDepartments.length === 0 || selectedDepartments.length === 0 ? [] : targetRow.activeTab === 'positions' ? updatedItems : row.selectedPositions,
// // //                 selectedEmployees: targetRow.selectedCompanies.length === 0 || targetRow.selectedDepartments.length === 0 || targetRow.selectedPositions.length === 0 ? [] : targetRow.activeTab === 'employees' ? updatedItems : row.selectedEmployees,
// // //                 parentType: targetRow.parentType 
// // //               }
// // //             : row
// // //         )
// // //       };
// // //     });
// // //   };
  
  
// // //   // Add function to check if a company is selected in any row
// // //   const isAnyCompanySelected = () => {
// // //     const companyRows = formData.targetRows.some(row => 
// // //       (row.type === 'companies' || row.parentType === 'companies') && row.selectedCompanies.length > 0
// // //     );
    
// // //     return companyRows;
// // //   };

// // //   // Add function to check if a department is selected in any row
// // //   const isAnyDepartmentSelected = () => {
// // //     const departmentRows = formData.targetRows.some(row => 
// // //       (row.activeTab === 'departments' || row.parentType === 'departments' || row.selectedPositions.length > 0) && 
// // //       row.selectedDepartments.length > 0);

// // //      return departmentRows || formData.targetRows.some(row => row.activeTab !== 'departments' && row.selectedDepartments.length > 0);
// // //   };

// // //   // Add function to check if a position is selected in any row
// // //   const isAnyPositionSelected = () => {
// // //     const positionRows = formData.targetRows.some(row => 
// // //       (row.activeTab === 'positions' || row.parentType === 'positions'|| row.selectedEmployees.length > 0) && 
// // //       row.selectedPositions.length > 0
// // //     );

// // //     return positionRows || formData.targetRows.some(row => row.activeTab !== 'positions' && row.selectedPositions.length > 0);
// // //   };

// // //   // Change the active tab of a target row
// // //   const changeTargetRowTab = (rowId: string, newTab: 'companies' | 'departments' | 'positions' | 'employees', parentType: '' | 'companies' | 'departments' | 'positions') => {

// // //     // Check if the tab is allowed to be clicked
// // //     if (newTab === 'departments' && !isAnyCompanySelected()) {
// // //       return; // Don't allow switching to departments if no company selected
// // //     }
// // //     if (newTab === 'positions' && !isAnyDepartmentSelected()) {
// // //       return; // Don't allow switching to positions if no department selected
// // //     }
// // //     if (newTab === 'employees' && !isAnyPositionSelected()) {
// // //       return; // Don't allow switching to employees if no position selected
// // //     }
    
// // //     setFormData(prev => ({
// // //       ...prev,
// // //       targetRows: prev.targetRows.map(row =>
// // //         row.id === rowId
// // //           ? { ...row, activeTab: newTab, parentType: parentType }
// // //           : row
// // //       )
// // //     }));
// // //   };

// // //   // Define document types for announcements
// // //   const announcementDocumentTypes = [
// // //     {
// // //       type: 'AnnouncementAttachment',
// // //       label: 'Announcement Attachments',
// // //       description: 'Upload files to be included with this announcement (PDF, Word, Excel, images, etc.)'
// // //     }
// // //   ];

// // //   // Define how to render text with any formatting marks
// // //   const renderLeaf = useCallback((props: any) => {
// // //     const { leaf } = props;
// // //     const customLeaf = leaf as CustomText;
    
// // //     return (
// // //       <span
// // //         {...props.attributes}
// // //         style={{ 
// // //           fontWeight: customLeaf.bold ? 'bold' : 'normal',
// // //           fontStyle: customLeaf.italic ? 'italic' : 'normal',
// // //           textDecoration: customLeaf.underline ? 'underline' : 'none'
// // //         }}
// // //       >
// // //         {props.children}
// // //       </span>
// // //     );
// // //   }, []);

// // //   return (
// // //     <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
// // //       <div className="flex flex-col sm:flex-row justify-between mb-6">
// // //         <nav className="text-sm breadcrumbs">
// // //           <ul>
// // //             <li><Link href="/" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Dashboard</Link></li>
// // //             <li><Link href="/announcements" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Announcements</Link></li>
// // //             <li className="font-semibold">Create Announcement</li>
// // //           </ul>
// // //         </nav>
        
// // //         <div className="flex justify-end">
// // //           <Link href="/announcements" className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
// // //             <FaArrowLeft className="mr-2" /> Back
// // //           </Link>
// // //         </div>
// // //       </div>

// // //       <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Create New Announcement</h1>

// // //       {error && (
// // //         <div className={`alert mb-6 ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
// // //           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
// // //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
// // //           </svg>
// // //           <span>{error}</span>
// // //         </div>
// // //       )}
      
// // //       <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// // //         {/* Tab Navigation */}
// // //         <div className="tabs tabs-bordered mb-6">
// // //           <a 
// // //             className={`tab tab-bordered ${activeTab === 'details' ? 'tab-active' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`} 
// // //             onClick={() => handleTabChange('details')}
// // //           >
// // //             Announcement Details
// // //           </a>
// // //           <a 
// // //             className={`tab tab-bordered ${activeTab === 'recipients' ? 'tab-active' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}
// // //             onClick={() => handleTabChange('recipients')}
// // //           >
// // //             Recipients
// // //           </a>
// // //         </div>

// // //         {/* Announcement Details Tab */}
// // //         <div className={`tab-content ${activeTab === 'details' ? 'block' : 'hidden'}`}>
// // //           <div className="mb-8">
// // //             <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Announcement Details</h2>
            
// // //             <div className="grid grid-cols-1 gap-6 mb-6">
// // //               <div>
// // //                 <div className={`mb-2 font-medium flex items-center gap-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                   Title <span className="text-red-500">*</span>
// // //                 </div>
// // //                 <input
// // //                   type="text"
// // //                   name="title"
// // //                   value={formData.title}
// // //                   onChange={handleTextChange}
// // //                   className={`input w-full border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
// // //                   required
// // //                   placeholder="Enter announcement title"
// // //                 />
// // //               </div>

// // //               <div>
// // //                 <div className={`mb-2 font-medium flex items-center gap-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                   Content <span className="text-red-500">*</span>
// // //                 </div>
                
// // //                 {/* Rich Text Editor */}
// // //                 {/* <div className={`border rounded-lg ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}>
// // //                   <div className={`flex items-center p-2 border-b ${theme === 'light' ? 'border-slate-200' : 'border-slate-600'}`}>
// // //                     <button
// // //                       type="button"
// // //                       className={`p-2 rounded ${CustomEditor.isBoldMarkActive(editor) ? 'bg-slate-200' : ''} ${theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-slate-600'}`}
// // //                       onMouseDown={(event) => {
// // //                         event.preventDefault();
// // //                         CustomEditor.toggleBoldMark(editor);
// // //                       }}
// // //                     >
// // //                       <FaBold className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`} />
// // //                     </button>
// // //                     <button
// // //                       type="button"
// // //                       className={`p-2 rounded ${CustomEditor.isItalicMarkActive(editor) ? 'bg-slate-200' : ''} ${theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-slate-600'}`}
// // //                       onMouseDown={(event) => {
// // //                         event.preventDefault();
// // //                         CustomEditor.toggleItalicMark(editor);
// // //                       }}
// // //                     >
// // //                       <FaItalic className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`} />
// // //                     </button>
// // //                     <button
// // //                       type="button"
// // //                       className={`p-2 rounded ${CustomEditor.isUnderlineMarkActive(editor) ? 'bg-slate-200' : ''} ${theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-slate-600'}`}
// // //                       onMouseDown={(event) => {
// // //                         event.preventDefault();
// // //                         CustomEditor.toggleUnderlineMark(editor);
// // //                       }}
// // //                     >
// // //                       <FaUnderline className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`} />
// // //                     </button>
// // //                   </div>
                  
                  
// // //                   <Slate
// // //                     editor={editor}
// // //                     initialValue={initialValue}
// // //                     onChange={value => {
// // //                       const isAstChange = editor.operations.some(
// // //                         op => 'set_selection' !== op.type
// // //                       );
// // //                       if (isAstChange) {
// // //                         setFormData(prev => ({
// // //                           ...prev,
// // //                           content: JSON.stringify(value)
// // //                         }));
// // //                       }
// // //                     }}
// // //                   >
// // //                     <Editable
// // //                       renderLeaf={renderLeaf}
// // //                       placeholder="Enter announcement content..."
// // //                       className={`p-3 min-h-40 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}
// // //                     />
// // //                   </Slate>
// // //                 </div> */}
// // //                 {/* Rich Text Editor (UPDATED) */}
// // // <div
// // //   className={`rounded-lg border ${
// // //     theme === 'light'
// // //       ? 'bg-white border-slate-300 focus-within:ring-2 focus-within:ring-blue-500'
// // //       : 'bg-slate-700 border-slate-600 focus-within:ring-2 focus-within:ring-blue-400'
// // //   }`}
// // // >
// // //   <Slate
// // //     editor={editor}
// // //     initialValue={initialValue}
// // //     onChange={(value) => {
// // //       const isAstChange = editor.operations.some(op => op.type !== 'set_selection');
// // //       if (isAstChange) {
// // //         setFormData((prev) => ({ ...prev, content: JSON.stringify(value) }));
// // //       }
// // //     }}
// // //   >
// // //     {/* Toolbar INSIDE Slate for live active state */}
// // //     <div
// // //       className={`flex items-center gap-2 p-2 border-b ${
// // //         theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700'
// // //       }`}
// // //     >
// // //       <button
// // //         type="button"
// // //         title="Bold (Ctrl/Cmd + B)"
// // //         onMouseDown={(e) => { e.preventDefault(); CustomEditor.toggleBoldMark(editor); }}
// // //         className={[
// // //           'px-2 py-1 rounded-md text-sm font-semibold border transition-colors',
// // //           CustomEditor.isBoldMarkActive(editor)
// // //             ? (theme === 'light' ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-500 text-white border-blue-500')
// // //             : (theme === 'light' ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50' : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600')
// // //         ].join(' ')}
// // //       >
// // //         <FaBold />
// // //       </button>

// // //       <button
// // //         type="button"
// // //         title="Italic (Ctrl/Cmd + I)"
// // //         onMouseDown={(e) => { e.preventDefault(); CustomEditor.toggleItalicMark(editor); }}
// // //         className={[
// // //           'px-2 py-1 rounded-md text-sm font-semibold border transition-colors',
// // //           CustomEditor.isItalicMarkActive(editor)
// // //             ? (theme === 'light' ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-500 text-white border-blue-500')
// // //             : (theme === 'light' ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50' : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600')
// // //         ].join(' ')}
// // //       >
// // //         <FaItalic />
// // //       </button>

// // //       <button
// // //         type="button"
// // //         title="Underline (Ctrl/Cmd + U)"
// // //         onMouseDown={(e) => { e.preventDefault(); CustomEditor.toggleUnderlineMark(editor); }}
// // //         className={[
// // //           'px-2 py-1 rounded-md text-sm font-semibold border transition-colors',
// // //           CustomEditor.isUnderlineMarkActive(editor)
// // //             ? (theme === 'light' ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-500 text-white border-blue-500')
// // //             : (theme === 'light' ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50' : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600')
// // //         ].join(' ')}
// // //       >
// // //         <FaUnderline />
// // //       </button>
// // //     </div>

// // //     {/* Editable area — no inner border/outline */}
// // //     <div className="p-3">
// // //       <Editable
// // //         renderLeaf={renderLeaf}
// // //         placeholder="Enter announcement content..."
// // //         spellCheck
// // //         className={`min-h-40 w-full border-0 outline-none focus:outline-none ring-0 focus:ring-0 ${
// // //           theme === 'light' ? 'text-slate-900' : 'text-slate-100'
// // //         }`}
// // //         onKeyDown={(e) => {
// // //           const k = e.key.toLowerCase();
// // //           if ((e.metaKey || e.ctrlKey) && k === 'b') { e.preventDefault(); CustomEditor.toggleBoldMark(editor); }
// // //           if ((e.metaKey || e.ctrlKey) && k === 'i') { e.preventDefault(); CustomEditor.toggleItalicMark(editor); }
// // //           if ((e.metaKey || e.ctrlKey) && k === 'u') { e.preventDefault(); CustomEditor.toggleUnderlineMark(editor); }
// // //         }}
// // //       />
// // //     </div>
// // //   </Slate>
// // // </div>

// // //               </div>
              
// // //               {/* Replace File Attachment Section with EmployeeDocumentManager */}
// // //               <div className="mt-4">
// // //                 <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Attachments</div>
// // //                 <EmployeeDocumentManager
// // //                   employeeId={null}
// // //                   mode="add"
// // //                   documentTypes={announcementDocumentTypes}
// // //                   onFilesSelected={handleFilesSelected}
// // //                   moduleName="announcement"
// // //                   customUploadEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents/upload-request`}
// // //                   customDeleteEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents`}
// // //                   customViewEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents/view-url`}
// // //                   initialDocuments={formData.attachments || []}
// // //                   onDocumentDeleted={handleDocumentDeleted}
// // //                 />
// // //               </div>
// // //             </div>
// // //           </div>
          
// // //           <div className="mt-4 flex justify-between">
// // //             <div></div> {/* Empty div for spacing */}
// // //             <button 
// // //               type="button" 
// // //               className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
// // //               onClick={() => handleTabChange('recipients')}
// // //             >
// // //               Next: Select Recipients
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* Recipients Tab */}
// // //         <div className={`tab-content ${activeTab === 'recipients' ? 'block' : 'hidden'}`}>
// // //           <div className="mb-8">
// // //             <div className="flex items-center mb-4">
// // //               <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Recipients</h2>
// // //               <div className={`badge ml-3 ${theme === 'light' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-blue-900 text-blue-200 border-blue-700'} border`}>Optional</div>
// // //             </div>
            
// // //             <div className={`alert mb-6 ${theme === 'light' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-blue-900 border-blue-700 text-blue-200'} border rounded-lg`}>
// // //               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
// // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
// // //               </svg>
// // //               <span>If no target rows are added, the announcement will be sent to all parties.</span>
// // //             </div>

// // //             {/* Target Rows Container */}
// // //             <div className="space-y-4 mb-6">
// // //               {formData.targetRows.map((row, index) => (
// // //                 <TargetRowCard
// // //                   key={row.id}
// // //                   row={row}
// // //                   index={index}
// // //                   companies={companies}
// // //                   departments={departments}
// // //                   positions={positions}
// // //                   employees={employees}
// // //                   companySearchTerm={formData.companySearchTerm}
// // //                   departmentSearchTerm={formData.departmentSearchTerm}
// // //                   positionSearchTerm={formData.positionSearchTerm}
// // //                   employeeSearchTerm={formData.employeeSearchTerm}
// // //                   targetRows={formData.targetRows}
// // //                   onChangeTab={changeTargetRowTab}
// // //                   onToggleItem={toggleTargetRowItem}
// // //                   onSearchChange={handleSearchChange}
// // //                   isAnyCompanySelected={isAnyCompanySelected}
// // //                   isAnyDepartmentSelected={isAnyDepartmentSelected}
// // //                   isAnyPositionSelected={isAnyPositionSelected}
// // //                 />
// // //               ))}
// // //             </div>

// // //             {/* Acknowledgement Options */}
// // //             <div className={`mb-8 p-4 rounded-lg mt-4 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
// // //               <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Acknowledgement Options</h3>
              
// // //               <div className="space-y-4">
// // //                 <div className="form-control">
// // //                   <label className="label cursor-pointer justify-start gap-3">
// // //                     <input 
// // //                       type="checkbox" 
// // //                       className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
// // //                       name="requireAcknowledgement"
// // //                       checked={formData.requireAcknowledgement}
// // //                       onChange={handleBooleanChange}
// // //                     />
// // //                     <div>
// // //                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Require Acknowledgement</span>
// // //                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients will need to acknowledge they have read this announcement</p>
// // //                     </div>
// // //                   </label>
// // //                 </div>
                
// // //                 <div className="form-control">
// // //                   <label className="label cursor-pointer justify-start gap-3">
// // //                     <input 
// // //                       type="checkbox" 
// // //                       className={`toggle ${theme === 'light' ? 'toggle-primary' : 'toggle-accent'}`}
// // //                       name="forceAcknowledgeLogin"
// // //                       checked={formData.forceAcknowledgeLogin}
// // //                       onChange={handleBooleanChange}
// // //                       disabled={!formData.requireAcknowledgement}
// // //                     />
// // //                     <div>
// // //                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Force Acknowledgement on Login</span>
// // //                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients will be required to acknowledge this announcement before they can proceed</p>
// // //                     </div>
// // //                   </label>
// // //                 </div>

// // //                 <div className="form-control">
// // //                   <label className="label cursor-pointer justify-start gap-3">
// // //                     <input 
// // //                       type="checkbox" 
// // //                       className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
// // //                       name="autoExpire"
// // //                       checked={formData.autoExpire}
// // //                       onChange={handleBooleanChange}
// // //                       disabled={!formData.requireAcknowledgement}
// // //                     />
// // //                     <div>
// // //                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Auto-Expire After 7 Days</span>
// // //                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Announcement will be automatically deleted 7 days after all targeted employees have read it</p>
// // //                     </div>
// // //                   </label>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Schedule Options */}
// // //             <div className={`mb-8 p-4 rounded-lg mt-4 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
// // //               <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule Options</h3>
              
// // //               <div className="space-y-4">
// // //                 <div className="form-control">
// // //                   <label className="label cursor-pointer justify-start gap-3">
// // //                     <input 
// // //                       type="checkbox" 
// // //                       className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
// // //                       name="scheduleEnabled"
// // //                       checked={formData.scheduleEnabled}
// // //                       onChange={handleBooleanChange}
// // //                     />
// // //                     <div>
// // //                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule this announcement</span>
// // //                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>This announcement will be published automatically at the specified date and time</p>
// // //                     </div>
// // //                   </label>
// // //                 </div>
                
// // //                 {formData.scheduleEnabled && (
// // //                   <div className="form-control">
// // //                     <label className="label">
// // //                       <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Publication Date and Time</span>
// // //                     </label>
// // //                     <div className="flex items-center gap-2">
// // //                       <input 
// // //                         type="datetime-local" 
// // //                         className={`input border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-600 border-slate-500 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
// // //                         name="scheduledAt"
// // //                         value={formData.scheduledAt}
// // //                         onChange={(e) => setFormData(prev => ({
// // //                           ...prev,
// // //                           scheduledAt: e.target.value
// // //                         }))}
// // //                         min={new Date().toISOString().slice(0, 16)}
// // //                         required={formData.scheduleEnabled}
// // //                       />
// // //                     </div>
// // //                     <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Select the date and time when this announcement should be published</p>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>
          
// // //           <div className="mt-4 flex justify-between">
// // //             <button 
// // //               type="button" 
// // //               className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
// // //               onClick={() => handleTabChange('details')}
// // //             >
// // //               Back to Details
// // //             </button>
// // //             <div></div> {/* Empty div for spacing */}
// // //           </div>
// // //         </div>

// // //         {/* Submit buttons - only show on Recipients tab */}
// // //         <div className={`mt-8 pt-4 border-t flex justify-end ${activeTab === 'recipients' ? 'block' : 'hidden'} ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
// // //           <Link href="/announcements" className={`btn btn-outline mr-3 ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
// // //             Cancel
// // //           </Link>
// // //           {!formData.scheduleEnabled && (
// // //             <button
// // //               type="button"
// // //               className={`btn mr-3 ${theme === 'light' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-amber-400 hover:bg-amber-500'} text-white border-0`}
// // //               disabled={loading || (formData.scheduleEnabled && !formData.scheduledAt)}
// // //               onClick={() => {
// // //                 const syntheticEvent = { 
// // //                   preventDefault: () => {} 
// // //                 } as FormEvent<HTMLFormElement>;
// // //                 handleSubmit(syntheticEvent, false);
// // //               }}
// // //             >
// // //               {loading ? (
// // //                 <>
// // //                   <span className="loading loading-spinner loading-sm mr-2"></span>
// // //                   Saving...
// // //                 </>
// // //               ) : (
// // //                 <>
// // //                   <FaSave className="mr-2" /> Save Draft
// // //                 </>
// // //               )}
// // //             </button>
// // //           )}
// // //           <button
// // //             type="submit"
// // //             className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
// // //             disabled={loading || (formData.scheduleEnabled && !formData.scheduledAt)}
// // //             onClick={() => {
// // //               const syntheticEvent = { 
// // //                 preventDefault: () => {} 
// // //               } as FormEvent<HTMLFormElement>;
// // //               handleSubmit(syntheticEvent, formData.scheduleEnabled ? false : true);
// // //             }}
// // //           >
// // //             {loading ? (
// // //               <>
// // //                 <span className="loading loading-spinner loading-sm mr-2"></span>
// // //                 Saving...
// // //               </>
// // //             ) : formData.scheduleEnabled ? (
// // //               <>
// // //                 <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// // //                 </svg>
// // //                 Schedule
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
// // //                 </svg>
// // //                 Post
// // //               </>
// // //             )}
// // //           </button>
// // //         </div>
// // //       </form>

// // //       {/* DaisyUI Toast for required fields */}
// // //       <div className="toast toast-center toast-middle z-50">
// // //         {showRequiredToast && (
// // //           <div className={`alert shadow-lg ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
// // //             <span>{requiredToastMsg}</span>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // 'use client';

// // import { useState, useEffect, ChangeEvent, FormEvent, useCallback, useMemo, JSX } from 'react';
// // import { useRouter } from 'next/navigation';
// // import Link from 'next/link';
// // import { FaSave, FaArrowLeft, FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
// // import {
// //   createEditor,
// //   Descendant,
// //   Editor,
// //   Transforms,
// //   Element as SlateElement,
// //   BaseEditor,
// // } from 'slate';
// // import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react';
// // import { withHistory, HistoryEditor } from 'slate-history';
// // import { API_BASE_URL, API_ROUTES } from '../../config';
// // import TargetRowCard, { TargetRow } from './card';
// // import EmployeeDocumentManager, { EmployeeDocument } from '../../components/EmployeeDocumentManager';
// // import { useTheme } from '../../components/ThemeProvider';

// // // --------- Slate typings ----------
// // type CustomText = {
// //   bold?: boolean;
// //   italic?: boolean;
// //   underline?: boolean;
// //   text: string;
// // };
// // type ParagraphElement = { type: 'paragraph'; children: CustomText[] };
// // type CustomElement = ParagraphElement;

// // declare module 'slate' {
// //   interface CustomTypes {
// //     Editor: BaseEditor & ReactEditor & HistoryEditor;
// //     Element: CustomElement;
// //     Text: CustomText;
// //   }
// // }

// // // --------- API models ----------
// // interface Company { id: string; name: string; }
// // interface Department { id: string; department_name: string; company_id: string; company_name: string; }
// // interface Position { id: string; title: string; department_id: string; company_name: string; department_name: string; }
// // interface Employee {
// //   id: string; name: string; position_id: string; department_id: string; company_id: string;
// //   company_name: string; department_name: string; position_title: string; job_level: string;
// // }
// // interface FormDataType {
// //   title: string;
// //   content: string; // not used for editing; we serialize on submit but keep in payload structure
// //   selectedCompanies: string[]; selectedDepartments: string[]; selectedPositions: string[]; selectedEmployees: string[];
// //   activeCompanyId: string; activeDepartmentId: string; activePositionId: string;
// //   companySearchTerm: string; departmentSearchTerm: string; positionSearchTerm: string; employeeSearchTerm: string;
// //   requireAcknowledgement: boolean; forceAcknowledgeLogin: boolean; autoExpire: boolean;
// //   targetRows: TargetRow[]; scheduleEnabled: boolean; scheduledAt: string; attachments: EmployeeDocument[];
// // }
// // interface AnnouncementPayload {
// //   title: string;
// //   content: string;
// //   targets: { target_type: string; target_id: string }[];
// //   target_type?: string;
// //   target_id?: number;
// //   requireAcknowledgement: boolean;
// //   forceAcknowledgeLogin: boolean;
// //   autoExpire: boolean;
// //   is_posted: boolean;
// //   scheduled_at?: string | null;
// // }

// // // --------- Mark helpers ----------
// // const CustomEditor = {
// //   isBoldMarkActive(editor: Editor) {
// //     const marks = Editor.marks(editor);
// //     return marks ? (marks as CustomText).bold === true : false;
// //   },
// //   isItalicMarkActive(editor: Editor) {
// //     const marks = Editor.marks(editor);
// //     return marks ? (marks as CustomText).italic === true : false;
// //   },
// //   isUnderlineMarkActive(editor: Editor) {
// //     const marks = Editor.marks(editor);
// //     return marks ? (marks as CustomText).underline === true : false;
// //   },
// //   toggleBoldMark(editor: Editor) {
// //     CustomEditor.isBoldMarkActive(editor) ? Editor.removeMark(editor, 'bold') : Editor.addMark(editor, 'bold', true);
// //   },
// //   toggleItalicMark(editor: Editor) {
// //     CustomEditor.isItalicMarkActive(editor) ? Editor.removeMark(editor, 'italic') : Editor.addMark(editor, 'italic', true);
// //   },
// //   toggleUnderlineMark(editor: Editor) {
// //     CustomEditor.isUnderlineMarkActive(editor) ? Editor.removeMark(editor, 'underline') : Editor.addMark(editor, 'underline', true);
// //   },
// // };

// // // --------- Initial value ----------
// // const initialValue: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }];

// // // --------- Toolbar Button (subscribes to Slate state) ----------
// // const MarkButton = ({
// //   format,
// //   icon,
// //   theme,
// // }: {
// //   format: 'bold' | 'italic' | 'underline';
// //   icon: JSX.Element;
// //   theme: string;
// // }) => {
// //   const editor = useSlate();
// //   const isActive =
// //     format === 'bold'
// //       ? CustomEditor.isBoldMarkActive(editor)
// //       : format === 'italic'
// //       ? CustomEditor.isItalicMarkActive(editor)
// //       : CustomEditor.isUnderlineMarkActive(editor);

// //   return (
// //     <button
// //       type="button"
// //       aria-pressed={isActive}
// //       onMouseDown={(e) => {
// //         e.preventDefault();
// //         // make sure editor is focused & a selection exists so mark applies immediately
// //         ReactEditor.focus(editor);
// //         if (!editor.selection) {
// //           try { Transforms.select(editor, Editor.end(editor, [])); } catch {}
// //         }
// //         if (format === 'bold') CustomEditor.toggleBoldMark(editor);
// //         else if (format === 'italic') CustomEditor.toggleItalicMark(editor);
// //         else CustomEditor.toggleUnderlineMark(editor);
// //       }}
// //       className={[
// //         'px-2 py-1 rounded-md text-sm font-semibold border transition-colors',
// //         isActive
// //           ? theme === 'light'
// //             ? 'bg-blue-600 text-white border-blue-600'
// //             : 'bg-blue-500 text-white border-blue-500'
// //           : theme === 'light'
// //           ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
// //           : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600',
// //       ].join(' ')}
// //     >
// //       {icon}
// //     </button>
// //   );
// // };

// // // --------- Serialize to HTML ----------
// // const serialize = (node: Descendant): string => {
// //   if (SlateElement.isElement(node)) {
// //     const el = node as CustomElement;
// //     const children = el.children.map((n) => serialize(n)).join('');
// //     if (el.type === 'paragraph') return `<p>${children}</p>`;
// //     return children;
// //   }
// //   const t = node as CustomText;
// //   let str = t.text;
// //   if (t.bold) str = `<strong>${str}</strong>`;
// //   if (t.italic) str = `<em>${str}</em>`;
// //   if (t.underline) str = `<u>${str}</u>`;
// //   return str;
// // };

// // export default function CreateAnnouncementPage() {
// //   const { theme } = useTheme();
// //   const router = useRouter();
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [activeTab, setActiveTab] = useState<'details' | 'recipients'>('details');
// //   const [companies, setCompanies] = useState<Company[]>([]);
// //   const [departments, setDepartments] = useState<Department[]>([]);
// //   const [positions, setPositions] = useState<Position[]>([]);
// //   const [employees, setEmployees] = useState<Employee[]>([]);
// //   const [showRequiredToast, setShowRequiredToast] = useState(false);
// //   const [requiredToastMsg, setRequiredToastMsg] = useState('');

// //   // Slate editor + value
// //   const editor = useMemo(() => withHistory(withReact(createEditor())), []);
// //   const [editorValue, setEditorValue] = useState<Descendant[]>(initialValue);

// //   const [formData, setFormData] = useState<FormDataType>({
// //     title: '',
// //     content: '',
// //     selectedCompanies: [],
// //     selectedDepartments: [],
// //     selectedPositions: [],
// //     selectedEmployees: [],
// //     activeCompanyId: '',
// //     activeDepartmentId: '',
// //     activePositionId: '',
// //     companySearchTerm: '',
// //     departmentSearchTerm: '',
// //     positionSearchTerm: '',
// //     employeeSearchTerm: '',
// //     requireAcknowledgement: false,
// //     forceAcknowledgeLogin: false,
// //     autoExpire: false,
// //     scheduleEnabled: false,
// //     scheduledAt: '',
// //     attachments: [],
// //     targetRows: [
// //       {
// //         id: Math.random().toString(36).substr(2, 9),
// //         type: 'companies',
// //         selectedCompanies: [],
// //         selectedDepartments: [],
// //         selectedPositions: [],
// //         selectedEmployees: [],
// //         isOpen: true,
// //         activeTab: 'companies',
// //         parentType: '',
// //         selectedAll: false,
// //       },
// //     ],
// //   });

// //   const handleTabChange = (tab: 'details' | 'recipients') => setActiveTab(tab);

// //   const fetchCompanies = async () => {
// //     try {
// //       const res = await fetch(`${API_BASE_URL}${API_ROUTES.companies}`);
// //       if (res.ok) setCompanies(await res.json());
// //     } catch (e) { console.error(e); }
// //   };
// //   const fetchAllDepartments = useCallback(async () => {
// //     try {
// //       const id = formData.activeCompanyId;
// //       const res = await fetch(`${API_BASE_URL}${API_ROUTES.departments}/${id}`);
// //       if (res.ok) setDepartments(await res.json());
// //     } catch (e) { console.error(e); }
// //   }, [formData.activeCompanyId]);

// //   const fetchAllPositions = useCallback(async () => {
// //     try {
// //       const res = await fetch(`${API_BASE_URL}${API_ROUTES.positions}`);
// //       if (res.ok) setPositions(await res.json());
// //     } catch (e) { console.error(e); }
// //   }, []);

// //   const fetchAllEmployees = async () => {
// //     try {
// //       const res = await fetch(`${API_BASE_URL}${API_ROUTES.employees}`);
// //       if (res.ok) setEmployees(await res.json());
// //     } catch (e) { console.error(e); }
// //   };

// //   useEffect(() => {
// //     fetchCompanies();
// //     fetchAllDepartments();
// //     fetchAllPositions();
// //     fetchAllEmployees();
// //     if (formData.targetRows.length === 0) {
// //       setFormData((prev) => ({
// //         ...prev,
// //         targetRows: [
// //           {
// //             id: Math.random().toString(36).substr(2, 9),
// //             type: 'companies',
// //             selectedCompanies: [],
// //             selectedDepartments: [],
// //             selectedPositions: [],
// //             selectedEmployees: [],
// //             isOpen: true,
// //             activeTab: 'companies',
// //             parentType: '',
// //             selectedAll: false,
// //           },
// //         ],
// //       }));
// //     }
// //   }, [fetchAllDepartments, fetchAllPositions, formData.targetRows.length]);

// //   const handleSearchChange = (e: ChangeEvent<HTMLInputElement>, type: 'company' | 'department' | 'position' | 'employee') => {
// //     const field = `${type}SearchTerm` as
// //       | 'companySearchTerm'
// //       | 'departmentSearchTerm'
// //       | 'positionSearchTerm'
// //       | 'employeeSearchTerm';
// //     setFormData((p) => ({ ...p, [field]: e.target.value }));
// //   };
// //   const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
// //     const { name, value } = e.target;
// //     setFormData((p) => ({ ...p, [name]: value }));
// //   };
// //   const handleBooleanChange = (e: ChangeEvent<HTMLInputElement>) => {
// //     const { name, checked } = e.target;
// //     setFormData((p) => ({ ...p, [name]: checked }));
// //   };

// //   const handleFilesSelected = (files: EmployeeDocument[]) => setFormData((p) => ({ ...p, attachments: files }));
// //   const handleDocumentDeleted = (removed?: EmployeeDocument) => {
// //     if (!removed) return;
// //     setFormData((p) => ({
// //       ...p,
// //       attachments: p.attachments.filter(
// //         (f) => !(f.name === removed.name && f.documentType === removed.documentType && f.file === removed.file)
// //       ),
// //     }));
// //   };

// //   // ---- Submit ----
// //   const handleSubmit = async (e: FormEvent<HTMLFormElement>, isPost = false) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError('');

// //     // serialize Slate value to HTML
// //     const htmlContent = editorValue.map((n) => serialize(n)).join('');
// //     const textForValidation = htmlContent.replace(/<[^>]*>/g, '').trim();

// //     if (!formData.title.trim() || !textForValidation) {
// //       setShowRequiredToast(true);
// //       setLoading(false);
// //       setTimeout(() => setShowRequiredToast(false), 3000);
// //       setRequiredToastMsg(
// //         formData.title.trim()
// //           ? 'Content is required field. Please fill it in before submitting.'
// //           : textForValidation
// //           ? 'Title is required field. Please fill it in before submitting.'
// //           : 'Title and Content are required fields. Please fill them in before submitting.'
// //       );
// //       return;
// //     }

// //     try {
// //       const {
// //         title,
// //         requireAcknowledgement,
// //         forceAcknowledgeLogin,
// //         autoExpire,
// //         targetRows,
// //         scheduleEnabled,
// //         scheduledAt,
// //         attachments,
// //       } = formData;

// //       const payload: AnnouncementPayload = {
// //         title,
// //         content: htmlContent,
// //         targets: [],
// //         requireAcknowledgement,
// //         forceAcknowledgeLogin,
// //         autoExpire,
// //         is_posted: isPost,
// //         scheduled_at: scheduleEnabled && scheduledAt ? scheduledAt : null,
// //       };

// //       const hasTargets = targetRows.some(
// //         (row) =>
// //           row.selectedCompanies.length > 0 ||
// //           row.selectedDepartments.length > 0 ||
// //           row.selectedPositions.length > 0 ||
// //           row.selectedEmployees.length > 0
// //       );

// //       if (!hasTargets) {
// //         payload.target_type = 'all';
// //         payload.target_id = 0;
// //       } else {
// //         targetRows.forEach((row) => {
// //           const targetType =
// //             row.selectedEmployees.length > 0
// //               ? 'employee'
// //               : row.selectedPositions.length > 0
// //               ? 'position'
// //               : row.selectedDepartments.length > 0
// //               ? 'department'
// //               : 'company';

// //           const pushAll = (ids: string[]) => {
// //             ids.forEach((id) => payload.targets.push({ target_type: targetType, target_id: id }));
// //           };
// //           if (row.selectedEmployees.length) pushAll(row.selectedEmployees);
// //           else if (row.selectedPositions.length) pushAll(row.selectedPositions);
// //           else if (row.selectedDepartments.length) pushAll(row.selectedDepartments);
// //           else if (row.selectedCompanies.length) pushAll(row.selectedCompanies);
// //         });
// //       }

// //       const formDataToSend = new FormData();
// //       formDataToSend.append(
// //         'data',
// //         JSON.stringify({
// //           ...payload,
// //           is_acknowledgement: requireAcknowledgement,
// //           is_force_login: forceAcknowledgeLogin,
// //           is_expired: autoExpire,
// //         })
// //       );
// //       if (attachments.length) {
// //         attachments.forEach((doc) => {
// //           if (doc.file) formDataToSend.append('attachments[]', doc.file);
// //         });
// //       }

// //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}`, {
// //         method: 'POST',
// //         body: formDataToSend,
// //       });

// //       if (!response.ok) throw new Error('Failed to create announcement');
// //       router.push('/announcements');
// //     } catch (err) {
// //       console.error('Error creating announcement:', err);
// //       setError('Failed to create announcement. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ---- target row helpers (unchanged logic) ----
// //   const toggleTargetRowItem = (rowId: string, itemId: string) => {
// //     setFormData((prev) => {
// //       const targetRow = prev.targetRows.find((r) => r.id === rowId);
// //       if (!targetRow) return prev;

// //       let updatedItems: string[] = [];
// //       if (targetRow.activeTab === 'companies') {
// //         updatedItems = targetRow.selectedCompanies.includes(itemId)
// //           ? targetRow.selectedCompanies.filter((id) => id !== itemId)
// //           : [...targetRow.selectedCompanies, itemId];
// //       } else if (targetRow.activeTab === 'departments') {
// //         updatedItems = targetRow.selectedDepartments.includes(itemId)
// //           ? targetRow.selectedDepartments.filter((id) => id !== itemId)
// //           : [...targetRow.selectedDepartments, itemId];
// //       } else if (targetRow.activeTab === 'positions') {
// //         updatedItems = targetRow.selectedPositions.includes(itemId)
// //           ? targetRow.selectedPositions.filter((id) => id !== itemId)
// //           : [...targetRow.selectedPositions, itemId];
// //       } else {
// //         updatedItems = targetRow.selectedEmployees.includes(itemId)
// //           ? targetRow.selectedEmployees.filter((id) => id !== itemId)
// //           : [...targetRow.selectedEmployees, itemId];
// //       }

// //       const selectedCompanies = targetRow.activeTab === 'companies' ? updatedItems : prev.selectedCompanies;
// //       const selectedDepartments =
// //         selectedCompanies.length === 0
// //           ? []
// //           : targetRow.activeTab === 'departments'
// //           ? updatedItems
// //           : prev.selectedDepartments;
// //       const selectedPositions =
// //         selectedCompanies.length === 0 || selectedDepartments.length === 0
// //           ? []
// //           : targetRow.activeTab === 'positions'
// //           ? updatedItems
// //           : prev.selectedPositions;
// //       const selectedEmployees =
// //         targetRow.selectedCompanies.length === 0 ||
// //         targetRow.selectedDepartments.length === 0 ||
// //         targetRow.selectedPositions.length === 0
// //           ? []
// //           : targetRow.activeTab === 'employees'
// //           ? updatedItems
// //           : prev.selectedEmployees;

// //       if (targetRow.selectedCompanies.length === 0) {
// //         targetRow.selectedDepartments = [];
// //         targetRow.selectedPositions = [];
// //         targetRow.selectedEmployees = [];
// //       }
// //       if (targetRow.selectedDepartments.length === 0) {
// //         targetRow.selectedPositions = [];
// //         targetRow.selectedEmployees = [];
// //       }
// //       if (targetRow.selectedPositions.length === 0) {
// //         targetRow.selectedEmployees = [];
// //       }

// //       return {
// //         ...prev,
// //         selectedCompanies,
// //         selectedDepartments,
// //         selectedPositions,
// //         selectedEmployees,
// //         targetRows: prev.targetRows.map((row) =>
// //           row.id === rowId
// //             ? {
// //                 ...row,
// //                 selectedCompanies: targetRow.activeTab === 'companies' ? updatedItems : row.selectedCompanies,
// //                 selectedDepartments:
// //                   selectedCompanies.length === 0
// //                     ? []
// //                     : targetRow.activeTab === 'departments'
// //                     ? updatedItems
// //                     : row.selectedDepartments,
// //                 selectedPositions:
// //                   selectedDepartments.length === 0
// //                     ? []
// //                     : targetRow.activeTab === 'positions'
// //                     ? updatedItems
// //                     : row.selectedPositions,
// //                 selectedEmployees:
// //                   targetRow.selectedCompanies.length === 0 ||
// //                   targetRow.selectedDepartments.length === 0 ||
// //                   targetRow.selectedPositions.length === 0
// //                     ? []
// //                     : targetRow.activeTab === 'employees'
// //                     ? updatedItems
// //                     : row.selectedEmployees,
// //                 parentType: targetRow.parentType,
// //               }
// //             : row
// //         ),
// //       };
// //     });
// //   };

// //   const isAnyCompanySelected = () =>
// //     formData.targetRows.some(
// //       (row) => (row.type === 'companies' || row.parentType === 'companies') && row.selectedCompanies.length > 0
// //     );

// //   const isAnyDepartmentSelected = () =>
// //     formData.targetRows.some(
// //       (row) =>
// //         (row.activeTab === 'departments' || row.parentType === 'departments' || row.selectedPositions.length > 0) &&
// //         row.selectedDepartments.length > 0
// //     ) || formData.targetRows.some((row) => row.activeTab !== 'departments' && row.selectedDepartments.length > 0);

// //   const isAnyPositionSelected = () =>
// //     formData.targetRows.some(
// //       (row) =>
// //         (row.activeTab === 'positions' || row.parentType === 'positions' || row.selectedEmployees.length > 0) &&
// //         row.selectedPositions.length > 0
// //     ) || formData.targetRows.some((row) => row.activeTab !== 'positions' && row.selectedPositions.length > 0);

// //   const changeTargetRowTab = (
// //     rowId: string,
// //     newTab: 'companies' | 'departments' | 'positions' | 'employees',
// //     parentType: '' | 'companies' | 'departments' | 'positions'
// //   ) => {
// //     if (newTab === 'departments' && !isAnyCompanySelected()) return;
// //     if (newTab === 'positions' && !isAnyDepartmentSelected()) return;
// //     if (newTab === 'employees' && !isAnyPositionSelected()) return;

// //     setFormData((prev) => ({
// //       ...prev,
// //       targetRows: prev.targetRows.map((row) => (row.id === rowId ? { ...row, activeTab: newTab, parentType } : row)),
// //     }));
// //   };

// //   // --------- Leaf renderer ----------
// //   const renderLeaf = useCallback((props: any) => {
// //     const leaf = props.leaf as CustomText;
// //     return (
// //       <span
// //         {...props.attributes}
// //         style={{
// //           fontWeight: leaf.bold ? 'bold' : 'normal',
// //           fontStyle: leaf.italic ? 'italic' : 'normal',
// //           textDecoration: leaf.underline ? 'underline' : 'none',
// //         }}
// //       >
// //         {props.children}
// //       </span>
// //     );
// //   }, []);

// //   return (
// //     <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
// //       <div className="flex flex-col sm:flex-row justify-between mb-6">
// //         <nav className="text-sm breadcrumbs">
// //           <ul>
// //             <li><Link href="/" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Dashboard</Link></li>
// //             <li><Link href="/announcements" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Announcements</Link></li>
// //             <li className="font-semibold">Create Announcement</li>
// //           </ul>
// //         </nav>
// //         <div className="flex justify-end">
// //           <Link href="/announcements" className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
// //             <FaArrowLeft className="mr-2" /> Back
// //           </Link>
// //         </div>
// //       </div>

// //       <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Create New Announcement</h1>

// //       {error && (
// //         <div className={`alert mb-6 ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
// //           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
// //           </svg>
// //           <span>{error}</span>
// //         </div>
// //       )}

// //       <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// //         <div className="tabs tabs-bordered mb-6">
// //           <a className={`tab tab-bordered ${activeTab === 'details' ? 'tab-active' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`} onClick={() => handleTabChange('details')}>Announcement Details</a>
// //           <a className={`tab tab-bordered ${activeTab === 'recipients' ? 'tab-active' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`} onClick={() => handleTabChange('recipients')}>Recipients</a>
// //         </div>

// //         <div className={`${activeTab === 'details' ? 'block' : 'hidden'}`}>
// //           <div className="mb-8">
// //             <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Announcement Details</h2>

// //             <div className="grid grid-cols-1 gap-6 mb-6">
// //               <div>
// //                 <div className={`mb-2 font-medium flex items-center gap-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Title <span className="text-red-500">*</span></div>
// //                 <input
// //                   type="text"
// //                   name="title"
// //                   value={formData.title}
// //                   onChange={handleTextChange}
// //                   className={`input w-full border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
// //                   required
// //                   placeholder="Enter announcement title"
// //                 />
// //               </div>

// //               <div>
// //                 <div className={`mb-2 font-medium flex items-center gap-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Content <span className="text-red-500">*</span></div>
// //                 <div
// //                   className={`rounded-lg border ${
// //                     theme === 'light'
// //                       ? 'bg-white border-slate-300 focus-within:ring-2 focus-within:ring-blue-500'
// //                       : 'bg-slate-700 border-slate-600 focus-within:ring-2 focus-within:ring-blue-400'
// //                   }`}
// //                 >
// //                   <Slate
// //                     editor={editor}
// //                     initialValue={editorValue}
// //                     onChange={(v) => setEditorValue(v)}
// //                   >
// //                     <div
// //                       className={`flex items-center gap-2 p-2 border-b ${
// //                         theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700'
// //                       }`}
// //                     >
// //                       <MarkButton format="bold" icon={<FaBold />} theme={theme} />
// //                       <MarkButton format="italic" icon={<FaItalic />} theme={theme} />
// //                       <MarkButton format="underline" icon={<FaUnderline />} theme={theme} />
// //                     </div>

// //                     <div className="p-3">
// //                       <Editable
// //                         renderLeaf={renderLeaf}
// //                         placeholder="Enter announcement content..."
// //                         spellCheck
// //                         className={`min-h-40 w-full border-0 outline-none focus:outline-none ring-0 focus:ring-0 ${
// //                           theme === 'light' ? 'text-slate-900' : 'text-slate-100'
// //                         }`}
// //                         onKeyDown={(e) => {
// //                           const k = e.key.toLowerCase();
// //                           if ((e.metaKey || e.ctrlKey) && k === 'b') { e.preventDefault(); CustomEditor.toggleBoldMark(editor); }
// //                           if ((e.metaKey || e.ctrlKey) && k === 'i') { e.preventDefault(); CustomEditor.toggleItalicMark(editor); }
// //                           if ((e.metaKey || e.ctrlKey) && k === 'u') { e.preventDefault(); CustomEditor.toggleUnderlineMark(editor); }
// //                         }}
// //                       />
// //                     </div>
// //                   </Slate>
// //                 </div>
// //               </div>

// //               {/* Attachments */}
// //               <div className="mt-4">
// //                 <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Attachments</div>
// //                 <EmployeeDocumentManager
// //                   employeeId={null}
// //                   mode="add"
// //                   documentTypes={[{ type: 'AnnouncementAttachment', label: 'Announcement Attachments', description: 'Upload files to be included with this announcement (PDF, Word, Excel, images, etc.)' }]}
// //                   onFilesSelected={handleFilesSelected}
// //                   moduleName="announcement"
// //                   customUploadEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents/upload-request`}
// //                   customDeleteEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents`}
// //                   customViewEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents/view-url`}
// //                   initialDocuments={formData.attachments || []}
// //                   onDocumentDeleted={handleDocumentDeleted}
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           <div className="mt-4 flex justify-between">
// //             <div />
// //             <button
// //               type="button"
// //               className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
// //               onClick={() => handleTabChange('recipients')}
// //             >
// //               Next: Select Recipients
// //             </button>
// //           </div>
// //         </div>

// //         {/* Recipients */}
// //         <div className={`${activeTab === 'recipients' ? 'block' : 'hidden'}`}>
// //           <div className="mb-8">
// //             <div className="flex items-center mb-4">
// //               <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Recipients</h2>
// //               <div className={`badge ml-3 ${theme === 'light' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-blue-900 text-blue-200 border-blue-700'} border`}>Optional</div>
// //             </div>

// //             <div className={`alert mb-6 ${theme === 'light' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-blue-900 border-blue-700 text-blue-200'} border rounded-lg`}>
// //               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
// //               </svg>
// //               <span>If no target rows are added, the announcement will be sent to all parties.</span>
// //             </div>

// //             <div className="space-y-4 mb-6">
// //               {formData.targetRows.map((row, index) => (
// //                 <TargetRowCard
// //                   key={row.id}
// //                   row={row}
// //                   index={index}
// //                   companies={companies}
// //                   departments={departments}
// //                   positions={positions}
// //                   employees={employees}
// //                   companySearchTerm={formData.companySearchTerm}
// //                   departmentSearchTerm={formData.departmentSearchTerm}
// //                   positionSearchTerm={formData.positionSearchTerm}
// //                   employeeSearchTerm={formData.employeeSearchTerm}
// //                   targetRows={formData.targetRows}
// //                   onChangeTab={changeTargetRowTab}
// //                   onToggleItem={toggleTargetRowItem}
// //                   onSearchChange={handleSearchChange}
// //                   isAnyCompanySelected={isAnyCompanySelected}
// //                   isAnyDepartmentSelected={isAnyDepartmentSelected}
// //                   isAnyPositionSelected={isAnyPositionSelected}
// //                 />
// //               ))}
// //             </div>

// //             {/* Acknowledgement */}
// //             <div className={`mb-8 p-4 rounded-lg mt-4 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
// //               <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Acknowledgement Options</h3>

// //               <div className="space-y-4">
// //                 <div className="form-control">
// //                   <label className="label cursor-pointer justify-start gap-3">
// //                     <input type="checkbox" className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`} name="requireAcknowledgement" checked={formData.requireAcknowledgement} onChange={handleBooleanChange} />
// //                     <div>
// //                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Require Acknowledgement</span>
// //                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients will need to acknowledge they have read this announcement</p>
// //                     </div>
// //                   </label>
// //                 </div>

// //                 <div className="form-control">
// //                   <label className="label cursor-pointer justify-start gap-3">
// //                     <input type="checkbox" className={`toggle ${theme === 'light' ? 'toggle-primary' : 'toggle-accent'}`} name="forceAcknowledgeLogin" checked={formData.forceAcknowledgeLogin} onChange={handleBooleanChange} disabled={!formData.requireAcknowledgement} />
// //                     <div>
// //                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Force Acknowledgement on Login</span>
// //                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients will be required to acknowledge this announcement before they can proceed</p>
// //                     </div>
// //                   </label>
// //                 </div>

// //                 <div className="form-control">
// //                   <label className="label cursor-pointer justify-start gap-3">
// //                     <input type="checkbox" className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`} name="autoExpire" checked={formData.autoExpire} onChange={handleBooleanChange} disabled={!formData.requireAcknowledgement} />
// //                     <div>
// //                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Auto-Expire After 7 Days</span>
// //                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Announcement will be automatically deleted 7 days after all targeted employees have read it</p>
// //                     </div>
// //                   </label>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Schedule */}
// //             <div className={`mb-8 p-4 rounded-lg mt-4 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
// //               <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule Options</h3>
// //               <div className="space-y-4">
// //                 <div className="form-control">
// //                   <label className="label cursor-pointer justify-start gap-3">
// //                     <input type="checkbox" className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`} name="scheduleEnabled" checked={formData.scheduleEnabled} onChange={handleBooleanChange} />
// //                     <div>
// //                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule this announcement</span>
// //                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>This announcement will be published automatically at the specified date and time</p>
// //                     </div>
// //                   </label>
// //                 </div>

// //                 {formData.scheduleEnabled && (
// //                   <div className="form-control">
// //                     <label className="label"><span className={`label-text font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Publication Date and Time</span></label>
// //                     <div className="flex items-center gap-2">
// //                       <input
// //                         type="datetime-local"
// //                         className={`input border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-600 border-slate-500 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
// //                         name="scheduledAt"
// //                         value={formData.scheduledAt}
// //                         onChange={(e) => setFormData((p) => ({ ...p, scheduledAt: e.target.value }))}
// //                         min={new Date().toISOString().slice(0, 16)}
// //                         required={formData.scheduleEnabled}
// //                       />
// //                     </div>
// //                     <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Select the date and time when this announcement should be published</p>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           <div className="mt-4 flex justify-between">
// //             <button
// //               type="button"
// //               className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
// //               onClick={() => handleTabChange('details')}
// //             >
// //               Back to Details
// //             </button>
// //             <div />
// //           </div>
// //         </div>

// //         {/* Submit buttons (recipients tab) */}
// //         <div className={`mt-8 pt-4 border-t flex justify-end ${activeTab === 'recipients' ? 'block' : 'hidden'} ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
// //           <Link href="/announcements" className={`btn btn-outline mr-3 ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>Cancel</Link>
// //           {!formData.scheduleEnabled && (
// //             <button
// //               type="button"
// //               className={`btn mr-3 ${theme === 'light' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-amber-400 hover:bg-amber-500'} text-white border-0`}
// //               disabled={loading || (formData.scheduleEnabled && !formData.scheduledAt)}
// //               onClick={(ev) => {
// //                 const s = { preventDefault: () => {} } as unknown as FormEvent<HTMLFormElement>;
// //                 handleSubmit(s, false);
// //               }}
// //             >
// //               {loading ? (<><span className="loading loading-spinner loading-sm mr-2"></span>Saving...</>) : (<><FaSave className="mr-2" /> Save Draft</>)}
// //             </button>
// //           )}
// //           <button
// //             type="submit"
// //             className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
// //             disabled={loading || (formData.scheduleEnabled && !formData.scheduledAt)}
// //             onClick={(ev) => {
// //               const s = { preventDefault: () => {} } as unknown as FormEvent<HTMLFormElement>;
// //               handleSubmit(s, formData.scheduleEnabled ? false : true);
// //             }}
// //           >
// //             {loading ? (
// //               <><span className="loading loading-spinner loading-sm mr-2"></span>Saving...</>
// //             ) : formData.scheduleEnabled ? (
// //               <>
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //                 </svg>
// //                 Schedule
// //               </>
// //             ) : (
// //               <>
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
// //                 </svg>
// //                 Post
// //               </>
// //             )}
// //           </button>
// //         </div>
// //       </form>

// //       {/* Toast */}
// //       <div className="toast toast-center toast-middle z-50">
// //         {showRequiredToast && (
// //           <div className={`alert shadow-lg ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
// //             <span>{requiredToastMsg}</span>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// 'use client';

// import { useState, useEffect, ChangeEvent, FormEvent, useCallback, useMemo, JSX } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { FaSave, FaArrowLeft, FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
// import {
//   createEditor,
//   Descendant,
//   Editor,
//   Transforms,
//   Element as SlateElement,
//   BaseEditor,
// } from 'slate';
// import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react';
// import { withHistory, HistoryEditor } from 'slate-history';
// import { API_BASE_URL, API_ROUTES } from '../../config';
// import TargetRowCard, { TargetRow } from './card';
// import EmployeeDocumentManager, { EmployeeDocument } from '../../components/EmployeeDocumentManager';
// import { useTheme } from '../../components/ThemeProvider';

// // --------- Slate typings ----------
// type CustomText = {
//   bold?: boolean;
//   italic?: boolean;
//   underline?: boolean;
//   text: string;
// };
// type ParagraphElement = { type: 'paragraph'; children: CustomText[] };
// type CustomElement = ParagraphElement;

// declare module 'slate' {
//   interface CustomTypes {
//     Editor: BaseEditor & ReactEditor & HistoryEditor;
//     Element: CustomElement;
//     Text: CustomText;
//   }
// }

// // --------- API models ----------
// interface Company { id: string; name: string; }
// interface Department { id: string; department_name: string; company_id: string; company_name: string; }
// interface Position { id: string; title: string; department_id: string; company_name: string; department_name: string; }
// interface Employee {
//   id: string; name: string; position_id: string; department_id: string; company_id: string;
//   company_name: string; department_name: string; position_title: string; job_level: string;
// }
// interface FormDataType {
//   title: string;
//   content: string; // we serialize Slate to HTML on submit
//   selectedCompanies: string[]; selectedDepartments: string[]; selectedPositions: string[]; selectedEmployees: string[];
//   activeCompanyId: string; activeDepartmentId: string; activePositionId: string;
//   companySearchTerm: string; departmentSearchTerm: string; positionSearchTerm: string; employeeSearchTerm: string;
//   requireAcknowledgement: boolean; forceAcknowledgeLogin: boolean; autoExpire: boolean;
//   targetRows: TargetRow[]; scheduleEnabled: boolean; scheduledAt: string; attachments: EmployeeDocument[];
// }
// interface AnnouncementPayload {
//   title: string;
//   content: string;
//   targets: { target_type: string; target_id: string }[];
//   target_type?: string;
//   target_id?: number;
//   requireAcknowledgement: boolean;
//   forceAcknowledgeLogin: boolean;
//   autoExpire: boolean;
//   is_posted: boolean;
//   scheduled_at?: string | null;
// }

// // --------- Mark helpers ----------
// // --------- Mark helpers ----------
// const CustomEditor = {
//   isBoldMarkActive(editor: Editor) {
//     const marks = Editor.marks(editor);
//     return marks ? (marks as CustomText).bold === true : false;
//   },
//   isItalicMarkActive(editor: Editor) {
//     const marks = Editor.marks(editor);
//     return marks ? (marks as CustomText).italic === true : false;
//   },
//   isUnderlineMarkActive(editor: Editor) {
//     const marks = Editor.marks(editor);
//     return marks ? (marks as CustomText).underline === true : false;
//   },
//   toggleBoldMark(editor: Editor) {
//     if (CustomEditor.isBoldMarkActive(editor)) {
//       Editor.removeMark(editor, 'bold');
//     } else {
//       Editor.addMark(editor, 'bold', true);
//     }
//   },
//   toggleItalicMark(editor: Editor) {
//     if (CustomEditor.isItalicMarkActive(editor)) {
//       Editor.removeMark(editor, 'italic');
//     } else {
//       Editor.addMark(editor, 'italic', true);
//     }
//   },
//   toggleUnderlineMark(editor: Editor) {
//     if (CustomEditor.isUnderlineMarkActive(editor)) {
//       Editor.removeMark(editor, 'underline');
//     } else {
//       Editor.addMark(editor, 'underline', true);
//     }
//   },
// };

// // --------- Initial value ----------
// const initialValue: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }];

// // --------- Toolbar Button ----------
// const MarkButton = ({
//   format,
//   icon,
//   theme,
// }: {
//   format: 'bold' | 'italic' | 'underline';
//   icon: JSX.Element;
//   theme: string;
// }) => {
//   const editor = useSlate();
//   const isActive =
//     format === 'bold'
//       ? CustomEditor.isBoldMarkActive(editor)
//       : format === 'italic'
//       ? CustomEditor.isItalicMarkActive(editor)
//       : CustomEditor.isUnderlineMarkActive(editor);

//   return (
//     <button
//       type="button"
//       aria-pressed={isActive}
//       onMouseDown={(e) => {
//         e.preventDefault();
//         ReactEditor.focus(editor);
//         if (!editor.selection) {
//           try { Transforms.select(editor, Editor.end(editor, [])); } catch { /* no-op */ }
//         }
//         if (format === 'bold') CustomEditor.toggleBoldMark(editor);
//         else if (format === 'italic') CustomEditor.toggleItalicMark(editor);
//         else CustomEditor.toggleUnderlineMark(editor);
//       }}
//       className={[
//         'px-2 py-1 rounded-md text-sm font-semibold border transition-colors',
//         isActive
//           ? theme === 'light'
//             ? 'bg-blue-600 text-white border-blue-600'
//             : 'bg-blue-500 text-white border-blue-500'
//           : theme === 'light'
//           ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
//           : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600',
//       ].join(' ')}
//     >
//       {icon}
//     </button>
//   );
// };

// // --------- Serialize to HTML ----------
// const serialize = (node: Descendant): string => {
//   if (SlateElement.isElement(node)) {
//     const el = node as ParagraphElement;
//     const children = el.children.map((n) => serialize(n)).join('');
//     if (el.type === 'paragraph') return `<p>${children}</p>`;
//     return children;
//   }
//   const t = node as CustomText;
//   let str = t.text;
//   if (t.bold) str = `<strong>${str}</strong>`;
//   if (t.italic) str = `<em>${str}</em>`;
//   if (t.underline) str = `<u>${str}</u>`;
//   return str;
// };

// export default function CreateAnnouncementPage() {
//   const { theme } = useTheme();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState<'details' | 'recipients'>('details');
//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [positions, setPositions] = useState<Position[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [showRequiredToast, setShowRequiredToast] = useState(false);
//   const [requiredToastMsg, setRequiredToastMsg] = useState('');

//   // Slate editor + value
//   const editor = useMemo(() => withHistory(withReact(createEditor())), []);
//   const [editorValue, setEditorValue] = useState<Descendant[]>(initialValue);

//   const [formData, setFormData] = useState<FormDataType>({
//     title: '',
//     content: '',
//     selectedCompanies: [],
//     selectedDepartments: [],
//     selectedPositions: [],
//     selectedEmployees: [],
//     activeCompanyId: '',
//     activeDepartmentId: '',
//     activePositionId: '',
//     companySearchTerm: '',
//     departmentSearchTerm: '',
//     positionSearchTerm: '',
//     employeeSearchTerm: '',
//     requireAcknowledgement: false,
//     forceAcknowledgeLogin: false,
//     autoExpire: false,
//     scheduleEnabled: false,
//     scheduledAt: '',
//     attachments: [],
//     targetRows: [
//       {
//         id: Math.random().toString(36).slice(2, 11),
//         type: 'companies',
//         selectedCompanies: [],
//         selectedDepartments: [],
//         selectedPositions: [],
//         selectedEmployees: [],
//         isOpen: true,
//         activeTab: 'companies',
//         parentType: '',
//         selectedAll: false,
//       },
//     ],
//   });

//   const handleTabChange = (tab: 'details' | 'recipients') => setActiveTab(tab);

//   const fetchCompanies = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}${API_ROUTES.companies}`);
//       if (res.ok) setCompanies(await res.json());
//     } catch (e) { console.error(e); }
//   };
//   const fetchAllDepartments = useCallback(async () => {
//     try {
//       const id = formData.activeCompanyId;
//       const res = await fetch(`${API_BASE_URL}${API_ROUTES.departments}/${id}`);
//       if (res.ok) setDepartments(await res.json());
//     } catch (e) { console.error(e); }
//   }, [formData.activeCompanyId]);

//   const fetchAllPositions = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}${API_ROUTES.positions}`);
//       if (res.ok) setPositions(await res.json());
//     } catch (e) { console.error(e); }
//   }, []);

//   const fetchAllEmployees = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}${API_ROUTES.employees}`);
//       if (res.ok) setEmployees(await res.json());
//     } catch (e) { console.error(e); }
//   };

//   useEffect(() => {
//     fetchCompanies();
//     fetchAllDepartments();
//     fetchAllPositions();
//     fetchAllEmployees();
//     if (formData.targetRows.length === 0) {
//       setFormData((prev) => ({
//         ...prev,
//         targetRows: [
//           {
//             id: Math.random().toString(36).slice(2, 11),
//             type: 'companies',
//             selectedCompanies: [],
//             selectedDepartments: [],
//             selectedPositions: [],
//             selectedEmployees: [],
//             isOpen: true,
//             activeTab: 'companies',
//             parentType: '',
//             selectedAll: false,
//           },
//         ],
//       }));
//     }
//   }, [fetchAllDepartments, fetchAllPositions, formData.targetRows.length]);

//   const handleSearchChange = (e: ChangeEvent<HTMLInputElement>, type: 'company' | 'department' | 'position' | 'employee') => {
//     const field = `${type}SearchTerm` as
//       | 'companySearchTerm'
//       | 'departmentSearchTerm'
//       | 'positionSearchTerm'
//       | 'employeeSearchTerm';
//     setFormData((p) => ({ ...p, [field]: e.target.value }));
//   };
//   const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };
//   const handleBooleanChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target;
//     setFormData((p) => ({ ...p, [name]: checked }));
//   };

//   const handleFilesSelected = (files: EmployeeDocument[]) => setFormData((p) => ({ ...p, attachments: files }));
//   const handleDocumentDeleted = (removed?: EmployeeDocument) => {
//     if (!removed) return;
//     setFormData((p) => ({
//       ...p,
//       attachments: p.attachments.filter(
//         (f) => !(f.name === removed.name && f.documentType === removed.documentType && f.file === removed.file)
//       ),
//     }));
//   };

//   // ---- Submit (single entry point) ----
//   const doSubmitold = async (postNow: boolean) => {
//     setLoading(true);
//     setError('');

//     // serialize Slate value to HTML
//     const htmlContent = editorValue.map((n) => serialize(n)).join('');
//     const textForValidation = htmlContent.replace(/<[^>]*>/g, '').trim();

//     if (!formData.title.trim() || !textForValidation) {
//       setShowRequiredToast(true);
//       setLoading(false);
//       setTimeout(() => setShowRequiredToast(false), 3000);
//       setRequiredToastMsg(
//         formData.title.trim()
//           ? 'Content is required field. Please fill it in before submitting.'
//           : textForValidation
//           ? 'Title is required field. Please fill it in before submitting.'
//           : 'Title and Content are required fields. Please fill them in before submitting.'
//       );
//       return;
//     }

//     try {
//       const {
//         title,
//         requireAcknowledgement,
//         forceAcknowledgeLogin,
//         autoExpire,
//         targetRows,
//         scheduleEnabled,
//         scheduledAt,
//         attachments,
//       } = formData;

//       const payload: AnnouncementPayload = {
//         title,
//         content: htmlContent,
//         targets: [],
//         requireAcknowledgement,
//         forceAcknowledgeLogin,
//         autoExpire,
//         is_posted: scheduleEnabled ? false : postNow,
//       //   scheduled_at: scheduleEnabled && scheduledAt ? scheduledAt : null,
//       // };
// scheduled_at: scheduleEnabled && scheduledAt 
//   ? scheduledAt // Just use the value directly - backend will handle timezone
//   : null,
//     };

//       const hasTargets = targetRows.some(
//         (row) =>
//           row.selectedCompanies.length > 0 ||
//           row.selectedDepartments.length > 0 ||
//           row.selectedPositions.length > 0 ||
//           row.selectedEmployees.length > 0
//       );

//       if (!hasTargets) {
//         payload.target_type = 'all';
//         payload.target_id = 0;
//       } else {
//         targetRows.forEach((row) => {
//           const targetType =
//             row.selectedEmployees.length > 0
//               ? 'employee'
//               : row.selectedPositions.length > 0
//               ? 'position'
//               : row.selectedDepartments.length > 0
//               ? 'department'
//               : 'company';

//           const pushAll = (ids: string[]) => {
//             ids.forEach((id) => payload.targets.push({ target_type: targetType, target_id: id }));
//           };
//           if (row.selectedEmployees.length) pushAll(row.selectedEmployees);
//           else if (row.selectedPositions.length) pushAll(row.selectedPositions);
//           else if (row.selectedDepartments.length) pushAll(row.selectedDepartments);
//           else if (row.selectedCompanies.length) pushAll(row.selectedCompanies);
//         });
//       }

//       const formDataToSend = new FormData();
//       formDataToSend.append(
//         'data',
//         JSON.stringify({
//           ...payload,
//           is_acknowledgement: requireAcknowledgement,
//           is_force_login: forceAcknowledgeLogin,
//           is_expired: autoExpire,
//         })
//       );
//       if (attachments.length) {
//         attachments.forEach((doc) => {
//           if (doc.file) formDataToSend.append('attachments[]', doc.file);
//         });
//       }

//       const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}`, {
//         method: 'POST',
//         body: formDataToSend,
//       });

//       if (!response.ok) throw new Error('Failed to create announcement');
//       router.push('/announcements');
//     } catch (err) {
//       console.error('Error creating announcement:', err);
//       setError('Failed to create announcement. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const doSubmit = async (postNow: boolean) => {
//   setLoading(true);
//   setError('');

//   // serialize Slate value to HTML
//   const htmlContent = editorValue.map((n) => serialize(n)).join('');
//   const textForValidation = htmlContent.replace(/<[^>]*>/g, '').trim();

//   if (!formData.title.trim() || !textForValidation) {
//     setShowRequiredToast(true);
//     setLoading(false);
//     setTimeout(() => setShowRequiredToast(false), 3000);
//     setRequiredToastMsg(
//       formData.title.trim()
//         ? 'Content is required field. Please fill it in before submitting.'
//         : textForValidation
//         ? 'Title is required field. Please fill it in before submitting.'
//         : 'Title and Content are required fields. Please fill them in before submitting.'
//     );
//     return;
//   }

//   try {
//     const {
//       title,
//       requireAcknowledgement,
//       forceAcknowledgeLogin,
//       autoExpire,
//       targetRows,
//       scheduleEnabled,
//       scheduledAt,
//       attachments,
//     } = formData;

//     const payload: AnnouncementPayload = {
//       title,
//       content: htmlContent,
//       targets: [],
//       requireAcknowledgement,
//       forceAcknowledgeLogin,
//       autoExpire,
//       is_posted: scheduleEnabled ? false : postNow,
//       scheduled_at: scheduleEnabled && scheduledAt 
//         ? scheduledAt
//         : null,
//     };

//     const hasTargets = targetRows.some(
//       (row) =>
//         row.selectedCompanies.length > 0 ||
//         row.selectedDepartments.length > 0 ||
//         row.selectedPositions.length > 0 ||
//         row.selectedEmployees.length > 0
//     );

//     if (!hasTargets) {
//       payload.target_type = 'all';
//       payload.target_id = 0;
//     } else {
//       targetRows.forEach((row) => {
//         const targetType =
//           row.selectedEmployees.length > 0
//             ? 'employee'
//             : row.selectedPositions.length > 0
//             ? 'position'
//             : row.selectedDepartments.length > 0
//             ? 'department'
//             : 'company';

//         const pushAll = (ids: string[]) => {
//           ids.forEach((id) => payload.targets.push({ target_type: targetType, target_id: id }));
//         };
//         if (row.selectedEmployees.length) pushAll(row.selectedEmployees);
//         else if (row.selectedPositions.length) pushAll(row.selectedPositions);
//         else if (row.selectedDepartments.length) pushAll(row.selectedDepartments);
//         else if (row.selectedCompanies.length) pushAll(row.selectedCompanies);
//       });
//     }

//     const formDataToSend = new FormData();
    
//     // Append the main announcement data
//     formDataToSend.append(
//       'data',
//       JSON.stringify({
//         ...payload,
//         is_acknowledgement: requireAcknowledgement,
//         is_force_login: forceAcknowledgeLogin,
//         is_expired: autoExpire,
//       })
//     );

//     // Append attachments correctly
//     if (attachments && attachments.length > 0) {
//       attachments.forEach((doc, index) => {
//         if (doc.file) {
//           // Append each file with a consistent naming pattern
//           formDataToSend.append(`attachments[${index}]`, doc.file);
          
//           // Also append metadata if needed
//           formDataToSend.append(`attachments_metadata[${index}]`, JSON.stringify({
//             name: doc.name,
//             documentType: doc.documentType,
//             size: doc.file.size,
//             type: doc.file.type
//           }));
//         }
//       });
//     }

//     console.log('Sending form data with attachments:', attachments?.length || 0);

//     const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}`, {
//       method: 'POST',
//       body: formDataToSend,
//       // Don't set Content-Type header - browser will set it with boundary for FormData
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Server response:', errorText);
//       throw new Error(`Failed to create announcement: ${response.status} ${response.statusText}`);
//     }

//     const result = await response.json();
//     console.log('Announcement created successfully:', result);
    
//     router.push('/announcements');
//   } catch (err) {
//     console.error('Error creating announcement:', err);
//     setError(err instanceof Error ? err.message : 'Failed to create announcement. Please try again.');
//   } finally {
//     setLoading(false);
//   }
// };

//   // Keep keyboard submit (Enter) as Save Draft by default
//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     doSubmit(false);
//   };

//   // ---- target row helpers ----
//   const toggleTargetRowItem = (rowId: string, itemId: string) => {
//     setFormData((prev) => {
//       const targetRow = prev.targetRows.find((r) => r.id === rowId);
//       if (!targetRow) return prev;

//       let updatedItems: string[] = [];
//       if (targetRow.activeTab === 'companies') {
//         updatedItems = targetRow.selectedCompanies.includes(itemId)
//           ? targetRow.selectedCompanies.filter((id) => id !== itemId)
//           : [...targetRow.selectedCompanies, itemId];
//       } else if (targetRow.activeTab === 'departments') {
//         updatedItems = targetRow.selectedDepartments.includes(itemId)
//           ? targetRow.selectedDepartments.filter((id) => id !== itemId)
//           : [...targetRow.selectedDepartments, itemId];
//       } else if (targetRow.activeTab === 'positions') {
//         updatedItems = targetRow.selectedPositions.includes(itemId)
//           ? targetRow.selectedPositions.filter((id) => id !== itemId)
//           : [...targetRow.selectedPositions, itemId];
//       } else {
//         updatedItems = targetRow.selectedEmployees.includes(itemId)
//           ? targetRow.selectedEmployees.filter((id) => id !== itemId)
//           : [...targetRow.selectedEmployees, itemId];
//       }

//       const selectedCompanies = targetRow.activeTab === 'companies' ? updatedItems : prev.selectedCompanies;
//       const selectedDepartments =
//         selectedCompanies.length === 0
//           ? []
//           : targetRow.activeTab === 'departments'
//           ? updatedItems
//           : prev.selectedDepartments;
//       const selectedPositions =
//         selectedCompanies.length === 0 || selectedDepartments.length === 0
//           ? []
//           : targetRow.activeTab === 'positions'
//           ? updatedItems
//           : prev.selectedPositions;
//       const selectedEmployees =
//         targetRow.selectedCompanies.length === 0 ||
//         targetRow.selectedDepartments.length === 0 ||
//         targetRow.selectedPositions.length === 0
//           ? []
//           : targetRow.activeTab === 'employees'
//           ? updatedItems
//           : prev.selectedEmployees;

//       if (targetRow.selectedCompanies.length === 0) {
//         targetRow.selectedDepartments = [];
//         targetRow.selectedPositions = [];
//         targetRow.selectedEmployees = [];
//       }
//       if (targetRow.selectedDepartments.length === 0) {
//         targetRow.selectedPositions = [];
//         targetRow.selectedEmployees = [];
//       }
//       if (targetRow.selectedPositions.length === 0) {
//         targetRow.selectedEmployees = [];
//       }

//       return {
//         ...prev,
//         selectedCompanies,
//         selectedDepartments,
//         selectedPositions,
//         selectedEmployees,
//         targetRows: prev.targetRows.map((row) =>
//           row.id === rowId
//             ? {
//                 ...row,
//                 selectedCompanies: targetRow.activeTab === 'companies' ? updatedItems : row.selectedCompanies,
//                 selectedDepartments:
//                   selectedCompanies.length === 0
//                     ? []
//                     : targetRow.activeTab === 'departments'
//                     ? updatedItems
//                     : row.selectedDepartments,
//                 selectedPositions:
//                   selectedDepartments.length === 0
//                     ? []
//                     : targetRow.activeTab === 'positions'
//                     ? updatedItems
//                     : row.selectedPositions,
//                 selectedEmployees:
//                   targetRow.selectedCompanies.length === 0 ||
//                   targetRow.selectedDepartments.length === 0 ||
//                   targetRow.selectedPositions.length === 0
//                     ? []
//                     : targetRow.activeTab === 'employees'
//                     ? updatedItems
//                     : row.selectedEmployees,
//                 parentType: targetRow.parentType,
//               }
//             : row
//         ),
//       };
//     });
//   };

//   const isAnyCompanySelected = () =>
//     formData.targetRows.some(
//       (row) => (row.type === 'companies' || row.parentType === 'companies') && row.selectedCompanies.length > 0
//     );

//   const isAnyDepartmentSelected = () =>
//     formData.targetRows.some(
//       (row) =>
//         (row.activeTab === 'departments' || row.parentType === 'departments' || row.selectedPositions.length > 0) &&
//         row.selectedDepartments.length > 0
//     ) || formData.targetRows.some((row) => row.activeTab !== 'departments' && row.selectedDepartments.length > 0);

//   const isAnyPositionSelected = () =>
//     formData.targetRows.some(
//       (row) =>
//         (row.activeTab === 'positions' || row.parentType === 'positions' || row.selectedEmployees.length > 0) &&
//         row.selectedPositions.length > 0
//     ) || formData.targetRows.some((row) => row.activeTab !== 'positions' && row.selectedPositions.length > 0);

//   const changeTargetRowTab = (
//     rowId: string,
//     newTab: 'companies' | 'departments' | 'positions' | 'employees',
//     parentType: '' | 'companies' | 'departments' | 'positions'
//   ) => {
//     if (newTab === 'departments' && !isAnyCompanySelected()) return;
//     if (newTab === 'positions' && !isAnyDepartmentSelected()) return;
//     if (newTab === 'employees' && !isAnyPositionSelected()) return;

//     setFormData((prev) => ({
//       ...prev,
//       targetRows: prev.targetRows.map((row) => (row.id === rowId ? { ...row, activeTab: newTab, parentType } : row)),
//     }));
//   };

//   // --------- Leaf renderer ----------
//   const renderLeaf = useCallback((props: any) => {
//     const leaf = props.leaf as CustomText;
//     return (
//       <span
//         {...props.attributes}
//         style={{
//           fontWeight: leaf.bold ? 'bold' : 'normal',
//           fontStyle: leaf.italic ? 'italic' : 'normal',
//           textDecoration: leaf.underline ? 'underline' : 'none',
//         }}
//       >
//         {props.children}
//       </span>
//     );
//   }, []);

//   // ---- Helpers to avoid expression-only lines in JSX ----
//   const MainSubmitLabel = ({ scheduled }: { scheduled: boolean }) => {
//     if (loading) {
//       return (
//         <>
//           <span className="loading loading-spinner loading-sm mr-2" />
//           Saving...
//         </>
//       );
//     }
//     if (scheduled) {
//       return (
//         <>
//           <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           Schedule
//         </>
//       );
//     }
//     return (
//       <>
//         <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//         </svg>
//         Post
//       </>
//     );
//   };

//   return (
//     <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
//       <div className="flex flex-col sm:flex-row justify-between mb-6">
//         <nav className="text-sm breadcrumbs">
//           <ul>
//             <li><Link href="/" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Dashboard</Link></li>
//             <li><Link href="/announcements" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Announcements</Link></li>
//             <li className="font-semibold">Create Announcement</li>
//           </ul>
//         </nav>
//         <div className="flex justify-end">
//           <Link href="/announcements" className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
//             <FaArrowLeft className="mr-2" /> Back
//           </Link>
//         </div>
//       </div>

//       <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Create New Announcement</h1>

//       {error ? (
//         <div className={`alert mb-6 ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
//           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <span>{error}</span>
//         </div>
//       ) : null}

//       <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//         <div className="tabs tabs-bordered mb-6">
//           <a className={`tab tab-bordered ${activeTab === 'details' ? 'tab-active' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`} onClick={() => handleTabChange('details')}>Announcement Details</a>
//           <a className={`tab tab-bordered ${activeTab === 'recipients' ? 'tab-active' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`} onClick={() => handleTabChange('recipients')}>Recipients</a>
//         </div>

//         <div className={`${activeTab === 'details' ? 'block' : 'hidden'}`}>
//           <div className="mb-8">
//             <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Announcement Details</h2>

//             <div className="grid grid-cols-1 gap-6 mb-6">
//               <div>
//                 <div className={`mb-2 font-medium flex items-center gap-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Title <span className="text-red-500">*</span></div>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleTextChange}
//                   className={`input w-full border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
//                   required
//                   placeholder="Enter announcement title"
//                 />
//               </div>

//               <div>
//                 <div className={`mb-2 font-medium flex items-center gap-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Content <span className="text-red-500">*</span></div>
//                 <div
//                   className={`rounded-lg border ${
//                     theme === 'light'
//                       ? 'bg-white border-slate-300 focus-within:ring-2 focus-within:ring-blue-500'
//                       : 'bg-slate-700 border-slate-600 focus-within:ring-2 focus-within:ring-blue-400'
//                   }`}
//                 >
//                   <Slate
//                     editor={editor}
//                     initialValue={editorValue}
//                     onChange={(v) => setEditorValue(v)}
//                   >
//                     <div
//                       className={`flex items-center gap-2 p-2 border-b ${
//                         theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700'
//                       }`}
//                     >
//                       <MarkButton format="bold" icon={<FaBold />} theme={theme} />
//                       <MarkButton format="italic" icon={<FaItalic />} theme={theme} />
//                       <MarkButton format="underline" icon={<FaUnderline />} theme={theme} />
//                     </div>

//                     <div className="p-3">
//                       <Editable
//                         renderLeaf={renderLeaf}
//                         placeholder="Enter announcement content..."
//                         spellCheck
//                         className={`min-h-40 w-full border-0 outline-none focus:outline-none ring-0 focus:ring-0 ${
//                           theme === 'light' ? 'text-slate-900' : 'text-slate-100'
//                         }`}
//                         onKeyDown={(e) => {
//                           const k = e.key.toLowerCase();
//                           if ((e.metaKey || e.ctrlKey) && k === 'b') { e.preventDefault(); CustomEditor.toggleBoldMark(editor); }
//                           if ((e.metaKey || e.ctrlKey) && k === 'i') { e.preventDefault(); CustomEditor.toggleItalicMark(editor); }
//                           if ((e.metaKey || e.ctrlKey) && k === 'u') { e.preventDefault(); CustomEditor.toggleUnderlineMark(editor); }
//                         }}
//                       />
//                     </div>
//                   </Slate>
//                 </div>
//               </div>

//               {/* Attachments */}
//               <div className="mt-4">
//                 <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Attachments</div>
// <EmployeeDocumentManager
//   employeeId={null}
//   mode="add"
//   documentTypes={[{ type: 'AnnouncementAttachment', label: 'Announcement Attachments', description: 'Upload files to be included with this announcement (PDF, Word, Excel, images, etc.)' }]}
//   onFilesSelected={handleFilesSelected}
//   moduleName="announcement"
//   customUploadEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents/upload-request`}
//   customDeleteEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents`}
//   customViewEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents/view-url`}
//   initialDocuments={formData.attachments || []}
//   onDocumentDeleted={handleDocumentDeleted}
// />
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 flex justify-between">
//             <div />
//             <button
//               type="button"
//               className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
//               onClick={() => handleTabChange('recipients')}
//             >
//               Next: Select Recipients
//             </button>
//           </div>
//         </div>

//         {/* Recipients */}
//         <div className={`${activeTab === 'recipients' ? 'block' : 'hidden'}`}>
//           <div className="mb-8">
//             <div className="flex items-center mb-4">
//               <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Recipients</h2>
//               <div className={`badge ml-3 ${theme === 'light' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-blue-900 text-blue-200 border-blue-700'} border`}>Optional</div>
//             </div>

//             <div className={`alert mb-6 ${theme === 'light' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-blue-900 border-blue-700 text-blue-200'} border rounded-lg`}>
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//               </svg>
//               <span>If no target rows are added, the announcement will be sent to all parties.</span>
//             </div>

//             <div className="space-y-4 mb-6">
//               {formData.targetRows.map((row, index) => (
//                 <TargetRowCard
//                   key={row.id}
//                   row={row}
//                   index={index}
//                   companies={companies}
//                   departments={departments}
//                   positions={positions}
//                   employees={employees}
//                   companySearchTerm={formData.companySearchTerm}
//                   departmentSearchTerm={formData.departmentSearchTerm}
//                   positionSearchTerm={formData.positionSearchTerm}
//                   employeeSearchTerm={formData.employeeSearchTerm}
//                   targetRows={formData.targetRows}
//                   onChangeTab={changeTargetRowTab}
//                   onToggleItem={toggleTargetRowItem}
//                   onSearchChange={handleSearchChange}
//                   isAnyCompanySelected={isAnyCompanySelected}
//                   isAnyDepartmentSelected={isAnyDepartmentSelected}
//                   isAnyPositionSelected={isAnyPositionSelected}
//                 />
//               ))}
//             </div>

//             {/* Acknowledgement */}
//             <div className={`mb-8 p-4 rounded-lg mt-4 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
//               <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Acknowledgement Options</h3>

//               <div className="space-y-4">
//                 <div className="form-control">
//                   <label className="label cursor-pointer justify-start gap-3">
//                     <input type="checkbox" className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`} name="requireAcknowledgement" checked={formData.requireAcknowledgement} onChange={handleBooleanChange} />
//                     <div>
//                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Require Acknowledgement</span>
//                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients will need to acknowledge they have read this announcement</p>
//                     </div>
//                   </label>
//                 </div>

//                 <div className="form-control">
//                   <label className="label cursor-pointer justify-start gap-3">
//                     <input type="checkbox" className={`toggle ${theme === 'light' ? 'toggle-primary' : 'toggle-accent'}`} name="forceAcknowledgeLogin" checked={formData.forceAcknowledgeLogin} onChange={handleBooleanChange} disabled={!formData.requireAcknowledgement} />
//                     <div>
//                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Force Acknowledgement on Login</span>
//                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients will be required to acknowledge this announcement before they can proceed</p>
//                     </div>
//                   </label>
//                 </div>

//                 <div className="form-control">
//                   <label className="label cursor-pointer justify-start gap-3">
//                     <input type="checkbox" className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`} name="autoExpire" checked={formData.autoExpire} onChange={handleBooleanChange} disabled={!formData.requireAcknowledgement} />
//                     <div>
//                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Auto-Expire After 7 Days</span>
//                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Announcement will be automatically deleted 7 days after all targeted employees have read it</p>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* Schedule */}
//             <div className={`mb-8 p-4 rounded-lg mt-4 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
//               <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule Options</h3>
//               <div className="space-y-4">
//                 <div className="form-control">
//                   <label className="label cursor-pointer justify-start gap-3">
//                     <input type="checkbox" className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`} name="scheduleEnabled" checked={formData.scheduleEnabled} onChange={handleBooleanChange} />
//                     <div>
//                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule this announcement</span>
//                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>This announcement will be published automatically at the specified date and time</p>
//                     </div>
//                   </label>
//                 </div>

//                 {formData.scheduleEnabled ? (
//                   <div className="form-control">
//                     <label className="label"><span className={`label-text font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Publication Date and Time</span></label>
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="datetime-local"
//                         className={`input border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-600 border-slate-500 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
//                         name="scheduledAt"
//                         value={formData.scheduledAt}
//                         onChange={(e) => setFormData((p) => ({ ...p, scheduledAt: e.target.value }))}
//                         min={new Date().toISOString().slice(0, 16)}
//                         required={formData.scheduleEnabled}
//                       />
//                     </div>
//                     <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Select the date and time when this announcement should be published</p>
//                   </div>
//                 ) : null}
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 flex justify-between">
//             <button
//               type="button"
//               className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
//               onClick={() => handleTabChange('details')}
//             >
//               Back to Details
//             </button>
//             <div />
//           </div>
//         </div>

//         {/* Submit buttons (recipients tab) */}
//         <div className={`mt-8 pt-4 border-t flex justify-end ${activeTab === 'recipients' ? 'block' : 'hidden'} ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
//           <Link href="/announcements" className={`btn btn-outline mr-3 ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>Cancel</Link>

//           {!formData.scheduleEnabled ? (
//             <button
//               type="button"
//               className={`btn mr-3 ${theme === 'light' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-amber-400 hover:bg-amber-500'} text-white border-0`}
//               disabled={loading}
//               onClick={() => { doSubmit(false); }}
//             >
//               {loading ? (
//                 <>
//                   <span className="loading loading-spinner loading-sm mr-2" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <FaSave className="mr-2" /> Save Draft
//                 </>
//               )}
//             </button>
//           ) : null}

//           <button
//             type="button"
//             className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
//             disabled={loading || (formData.scheduleEnabled && !formData.scheduledAt)}
//             onClick={() => { doSubmit(!formData.scheduleEnabled); }}
//           >
//             <MainSubmitLabel scheduled={formData.scheduleEnabled} />
//           </button>
//         </div>
//       </form>

//       {/* Toast */}
//       <div className="toast toast-center toast-middle z-50">
//         {showRequiredToast ? (
//           <div className={`alert shadow-lg ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
//             <span>{requiredToastMsg}</span>
//           </div>
//         ) : null}
//       </div>
//     </div>
//   );
// }


//0212

// // 'use client';

// // import { useState, useEffect, ChangeEvent, FormEvent, useCallback, useMemo, JSX } from 'react';
// // import { useRouter } from 'next/navigation';
// // import Link from 'next/link';
// // import { FaSave, FaArrowLeft, FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
// // import {
// //   createEditor,
// //   Descendant,
// //   Editor,
// //   Transforms,
// //   Element as SlateElement,
// //   BaseEditor,
// // } from 'slate';
// // import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react';
// // import { withHistory, HistoryEditor } from 'slate-history';
// // import { API_BASE_URL, API_ROUTES } from '../../config';
// // import TargetRowCard, { TargetRow } from './card';
// // import EmployeeDocumentManager, { EmployeeDocument } from '../../components/EmployeeDocumentManager';
// // import { useTheme } from '../../components/ThemeProvider';

// // // --------- Slate typings ----------
// // type CustomText = {
// //   bold?: boolean;
// //   italic?: boolean;
// //   underline?: boolean;
// //   text: string;
// // };
// // type ParagraphElement = { type: 'paragraph'; children: CustomText[] };
// // type CustomElement = ParagraphElement;

// // declare module 'slate' {
// //   interface CustomTypes {
// //     Editor: BaseEditor & ReactEditor & HistoryEditor;
// //     Element: CustomElement;
// //     Text: CustomText;
// //   }
// // }

// // // --------- API models ----------
// // interface Company { id: string; name: string; }

// // // Unified Department interface that matches TargetRowCard expectations
// // interface Department { 
// //   id: string; 
// //   department_name: string; 
// //   company_id: string;    
// //   company_name: string;  
// //   // Optional fields for API compatibility
// //   company_ids?: string;    
// //   company_names?: string;  
// // }

// // // Improved normalizeDepartment function
// // const normalizeDepartment = (dept: any, companyId?: string, companyName?: string): Department => {
// //   console.log('🔧 Normalizing department - Input:', { dept, companyId, companyName });

// //   // Handle different possible field names for department data
// //   const id = dept.id?.toString() || dept.department_id?.toString() || '';
// //   const department_name = dept.department_name || dept.name || dept.department_name || '';
  
// //   // Priority: explicit companyId > dept.company_id > dept.company_ids > fallback
// //   const finalCompanyId = companyId || dept.company_id?.toString() || dept.company_ids?.toString() || '';
// //   const finalCompanyName = companyName || dept.company_name || dept.company_names || '';

// //   const normalized = {
// //     id,
// //     department_name,
// //     company_id: finalCompanyId,
// //     company_name: finalCompanyName,
// //     company_ids: dept.company_ids,
// //     company_names: dept.company_names
// //   };

// //   console.log('✅ Normalized department result:', normalized);
// //   return normalized;
// // };

// // interface Position { id: string; title: string; department_id: string; company_name: string; department_name: string; }
// // interface Employee {
// //   id: string; name: string; position_id: string; department_id: string; company_id: string;
// //   company_name: string; department_name: string; position_title: string; job_level: string;
// // }
// // interface FormDataType {
// //   title: string;
// //   content: string;
// //   selectedCompanies: string[]; selectedDepartments: string[]; selectedPositions: string[]; selectedEmployees: string[];
// //   activeCompanyId: string; activeDepartmentId: string; activePositionId: string;
// //   companySearchTerm: string; departmentSearchTerm: string; positionSearchTerm: string; employeeSearchTerm: string;
// //   requireAcknowledgement: boolean; forceAcknowledgeLogin: boolean; autoExpire: boolean;
// //   targetRows: TargetRow[]; scheduleEnabled: boolean; scheduledAt: string; attachments: EmployeeDocument[];
// // }
// // interface AnnouncementPayload {
// //   title: string;
// //   content: string;
// //   targets: { target_type: string; target_id: string }[];
// //   target_type?: string;
// //   target_id?: number;
// //   requireAcknowledgement: boolean;
// //   forceAcknowledgeLogin: boolean;
// //   autoExpire: boolean;
// //   is_posted: boolean;
// //   scheduled_at?: string | null;
// // }

// // // --------- Mark helpers ----------
// // const CustomEditor = {
// //   isBoldMarkActive(editor: Editor) {
// //     const marks = Editor.marks(editor);
// //     return marks ? (marks as CustomText).bold === true : false;
// //   },
// //   isItalicMarkActive(editor: Editor) {
// //     const marks = Editor.marks(editor);
// //     return marks ? (marks as CustomText).italic === true : false;
// //   },
// //   isUnderlineMarkActive(editor: Editor) {
// //     const marks = Editor.marks(editor);
// //     return marks ? (marks as CustomText).underline === true : false;
// //   },
// //   toggleBoldMark(editor: Editor) {
// //     if (CustomEditor.isBoldMarkActive(editor)) {
// //       Editor.removeMark(editor, 'bold');
// //     } else {
// //       Editor.addMark(editor, 'bold', true);
// //     }
// //   },
// //   toggleItalicMark(editor: Editor) {
// //     if (CustomEditor.isItalicMarkActive(editor)) {
// //       Editor.removeMark(editor, 'italic');
// //     } else {
// //       Editor.addMark(editor, 'italic', true);
// //     }
// //   },
// //   toggleUnderlineMark(editor: Editor) {
// //     if (CustomEditor.isUnderlineMarkActive(editor)) {
// //       Editor.removeMark(editor, 'underline');
// //     } else {
// //       Editor.addMark(editor, 'underline', true);
// //     }
// //   },
// // };

// // // --------- Initial value ----------
// // const initialValue: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }];

// // // --------- Toolbar Button ----------
// // const MarkButton = ({
// //   format,
// //   icon,
// //   theme,
// // }: {
// //   format: 'bold' | 'italic' | 'underline';
// //   icon: JSX.Element;
// //   theme: string;
// // }) => {
// //   const editor = useSlate();
// //   const isActive =
// //     format === 'bold'
// //       ? CustomEditor.isBoldMarkActive(editor)
// //       : format === 'italic'
// //       ? CustomEditor.isItalicMarkActive(editor)
// //       : CustomEditor.isUnderlineMarkActive(editor);

// //   return (
// //     <button
// //       type="button"
// //       aria-pressed={isActive}
// //       onMouseDown={(e) => {
// //         e.preventDefault();
// //         ReactEditor.focus(editor);
// //         if (!editor.selection) {
// //           try { Transforms.select(editor, Editor.end(editor, [])); } catch { /* no-op */ }
// //         }
// //         if (format === 'bold') CustomEditor.toggleBoldMark(editor);
// //         else if (format === 'italic') CustomEditor.toggleItalicMark(editor);
// //         else CustomEditor.toggleUnderlineMark(editor);
// //       }}
// //       className={[
// //         'px-2 py-1 rounded-md text-sm font-semibold border transition-colors',
// //         isActive
// //           ? theme === 'light'
// //             ? 'bg-blue-600 text-white border-blue-600'
// //             : 'bg-blue-500 text-white border-blue-500'
// //           : theme === 'light'
// //           ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
// //           : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600',
// //       ].join(' ')}
// //     >
// //       {icon}
// //     </button>
// //   );
// // };

// // // --------- Serialize to HTML ----------
// // const serialize = (node: Descendant): string => {
// //   if (SlateElement.isElement(node)) {
// //     const el = node as ParagraphElement;
// //     const children = el.children.map((n) => serialize(n)).join('');
// //     if (el.type === 'paragraph') return `<p>${children}</p>`;
// //     return children;
// //   }
// //   const t = node as CustomText;
// //   let str = t.text;
// //   if (t.bold) str = `<strong>${str}</strong>`;
// //   if (t.italic) str = `<em>${str}</em>`;
// //   if (t.underline) str = `<u>${str}</u>`;
// //   return str;
// // };

// // export default function CreateAnnouncementPage() {
// //   const { theme } = useTheme();
// //   const router = useRouter();
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [activeTab, setActiveTab] = useState<'details' | 'recipients'>('details');
// //   const [companies, setCompanies] = useState<Company[]>([]);
// //   const [departments, setDepartments] = useState<Department[]>([]);
// //   const [positions, setPositions] = useState<Position[]>([]);
// //   const [employees, setEmployees] = useState<Employee[]>([]);
// //   const [showRequiredToast, setShowRequiredToast] = useState(false);
// //   const [requiredToastMsg, setRequiredToastMsg] = useState('');

// //   // Slate editor + value
// //   const editor = useMemo(() => withHistory(withReact(createEditor())), []);
// //   const [editorValue, setEditorValue] = useState<Descendant[]>(initialValue);

// //   const [formData, setFormData] = useState<FormDataType>({
// //     title: '',
// //     content: '',
// //     selectedCompanies: [],
// //     selectedDepartments: [],
// //     selectedPositions: [],
// //     selectedEmployees: [],
// //     activeCompanyId: '',
// //     activeDepartmentId: '',
// //     activePositionId: '',
// //     companySearchTerm: '',
// //     departmentSearchTerm: '',
// //     positionSearchTerm: '',
// //     employeeSearchTerm: '',
// //     requireAcknowledgement: false,
// //     forceAcknowledgeLogin: false,
// //     autoExpire: false,
// //     scheduleEnabled: false,
// //     scheduledAt: '',
// //     attachments: [],
// //     targetRows: [
// //       {
// //         id: Math.random().toString(36).slice(2, 11),
// //         type: 'companies',
// //         selectedCompanies: [],
// //         selectedDepartments: [],
// //         selectedPositions: [],
// //         selectedEmployees: [],
// //         isOpen: true,
// //         activeTab: 'companies',
// //         parentType: '',
// //         selectedAll: false,
// //       },
// //     ],
// //   });

// //   const handleTabChange = (tab: 'details' | 'recipients') => setActiveTab(tab);

// //   const fetchCompanies = async () => {
// //     try {
// //       const res = await fetch(`${API_BASE_URL}${API_ROUTES.companies}`);
// //       if (res.ok) {
// //         const data = await res.json();
// //         setCompanies(data);
// //         console.log('✅ Companies loaded:', data.length);
// //       }
// //     } catch (e) { 
// //       console.error('Error fetching companies:', e); 
// //     }
// //   };

// //   // COMPLETELY REWRITTEN fetchAllDepartments function
// //   const fetchAllDepartments = useCallback(async () => {
// //     console.group('🔍 fetchAllDepartments - ENTER');
    
// //     try {
// //       const companyId = formData.activeCompanyId;
// //       console.log('📋 Starting department fetch for company:', companyId);

// //       let apiUrl: string;
// //       let isCompanyDepartmentsEndpoint = false;
      
// //       if (companyId) {
// //         // Use company-specific endpoint
// //         apiUrl = `${API_BASE_URL}/api/admin/companies/${companyId}`;
// //         isCompanyDepartmentsEndpoint = true;
// //         console.log('🏢 Using company-specific endpoint:', apiUrl);
// //       } else {
// //         // Get all departments
// //         apiUrl = `${API_BASE_URL}${API_ROUTES.departments}`;
// //         console.log('🌐 Using all departments endpoint:', apiUrl);
// //       }

// //       console.log('🚀 Making API request to:', apiUrl);
// //       const response = await fetch(apiUrl);
      
// //       console.log('📥 API Response status:', response.status, response.statusText);

// //       if (response.ok) {
// //         const data = await response.json();
// //         console.log('✅ Raw API Response Data:', data);
        
// //         let departmentsData: any[] = [];
        
// //         if (isCompanyDepartmentsEndpoint) {
// //           // Handle company-specific response
// //           console.log('🏢 Processing company-specific response structure');
          
// //           // Try multiple possible structures for departments in company response
// //           if (data.departments && Array.isArray(data.departments)) {
// //             departmentsData = data.departments;
// //             console.log('📊 Found departments array in company response:', departmentsData.length);
// //           } else if (data.data?.departments && Array.isArray(data.data.departments)) {
// //             departmentsData = data.data.departments;
// //             console.log('📊 Found departments in data.departments:', departmentsData.length);
// //           } else if (Array.isArray(data)) {
// //             // If the response itself is an array, use it directly
// //             departmentsData = data;
// //             console.log('📊 Response is direct array of departments:', departmentsData.length);
// //           } else {
// //             console.warn('⚠️ No departments found in company response. Response structure:', Object.keys(data));
// //             departmentsData = [];
// //           }

// //           // ENHANCED: Add company context to each department
// //           if (departmentsData.length > 0) {
// //             departmentsData = departmentsData.map(dept => {
// //               const enhancedDept = {
// //                 ...dept,
// //                 // Ensure company_id is set from the parent company
// //                 company_id: companyId,
// //                 company_name: data.name || data.company_name || 'Unknown Company'
// //               };
// //               console.log('🎯 Enhanced department:', enhancedDept);
// //               return enhancedDept;
// //             });
// //           }
// //         } else {
// //           // Handle all departments endpoint
// //           console.log('🌐 Processing all departments response structure');
// //           if (Array.isArray(data)) {
// //             departmentsData = data;
// //           } else if (data.data && Array.isArray(data.data)) {
// //             departmentsData = data.data;
// //           } else if (data.departments && Array.isArray(data.departments)) {
// //             departmentsData = data.departments;
// //           } else if (data.success && Array.isArray(data.departments)) {
// //             departmentsData = data.departments;
// //           } else {
// //             console.warn('⚠️ Unexpected response structure for all departments:', Object.keys(data));
// //             departmentsData = [];
// //           }
// //         }
        
// //         console.log('📊 Final departments data to process:', departmentsData);
        
// //         if (departmentsData.length === 0) {
// //           console.warn('⚠️ No departments data found after processing');
// //         }

// //         // Normalize the department data
// //         const normalizedDepartments = departmentsData.map(dept => 
// //           normalizeDepartment(dept, companyId, data.name || data.company_name)
// //         );
        
// //         console.log('🔄 Normalized Departments:', normalizedDepartments);
        
// //         setDepartments(normalizedDepartments);
// //         console.log('📈 Departments state updated. Count:', normalizedDepartments.length);
        
// //       } else {
// //         console.error('❌ API Response not OK');
// //         try {
// //           const errorText = await response.text();
// //           console.error('📄 Error response body:', errorText);
// //         } catch (textError) {
// //           console.error('📄 Could not read error response body');
// //         }
// //       }

// //     } catch (error) {
// //       console.error('💥 Error in fetchAllDepartments:', error);
// //     } finally {
// //       console.groupEnd();
// //     }
// //   }, [formData.activeCompanyId]);

// //   const fetchAllPositions = useCallback(async () => {
// //     try {
// //       const res = await fetch(`${API_BASE_URL}${API_ROUTES.positions}`);
// //       if (res.ok) {
// //         const data = await res.json();
// //         setPositions(data);
// //         console.log('✅ Positions loaded:', data.length);
// //       }
// //     } catch (e) { console.error(e); }
// //   }, []);

// //   const fetchAllEmployees = async () => {
// //     try {
// //       const res = await fetch(`${API_BASE_URL}${API_ROUTES.employees}`);
// //       if (res.ok) {
// //         const data = await res.json();
// //         setEmployees(data);
// //         console.log('✅ Employees loaded:', data.length);
// //       }
// //     } catch (e) { console.error(e); }
// //   };

// //   // IMPROVED getFilteredDepartments function
// //   const getFilteredDepartments = useCallback((): Department[] => {
// //     if (!formData.activeCompanyId) {
// //       console.log('🌐 No company selected, showing all departments:', departments.length);
// //       return departments;
// //     }
    
// //     console.log('🔍 Starting department filtering for company:', formData.activeCompanyId);
// //     console.log('📊 Total departments available:', departments.length);

// //     const filtered = departments.filter(dept => {
// //       const deptCompanyId = dept.company_id?.toString() || '';
// //       const activeCompanyId = formData.activeCompanyId?.toString() || '';
// //       const matches = deptCompanyId === activeCompanyId;
      
// //       if (matches) {
// //         console.log('✅ Department matches company:', {
// //           deptId: dept.id,
// //           deptName: dept.department_name,
// //           deptCompanyId: deptCompanyId,
// //           activeCompanyId: activeCompanyId
// //         });
// //       }
      
// //       return matches;
// //     });
    
// //     console.log(`🏢 FILTERING COMPLETE for company ${formData.activeCompanyId}:`, {
// //       totalDepartments: departments.length,
// //       filteredCount: filtered.length,
// //       filteredDepartments: filtered.map(d => ({ 
// //         id: d.id, 
// //         name: d.department_name, 
// //         companyId: d.company_id 
// //       }))
// //     });
    
// //     return filtered;
// //   }, [departments, formData.activeCompanyId]);

// //   const getFilteredPositions = useCallback((): Position[] => {
// //     if (formData.selectedDepartments.length === 0) {
// //       console.log('🌐 No departments selected, showing all positions:', positions.length);
// //       return positions;
// //     }
// //     const filtered = positions.filter(pos => formData.selectedDepartments.includes(pos.department_id));
// //     console.log(`🏛️ Filtered positions for selected departments:`, filtered.length);
// //     return filtered;
// //   }, [positions, formData.selectedDepartments]);

// //   const getFilteredEmployees = useCallback((): Employee[] => {
// //     if (formData.selectedPositions.length === 0) {
// //       console.log('🌐 No positions selected, showing all employees:', employees.length);
// //       return employees;
// //     }
// //     const filtered = employees.filter(emp => formData.selectedPositions.includes(emp.position_id));
// //     console.log(`💼 Filtered employees for selected positions:`, filtered.length);
// //     return filtered;
// //   }, [employees, formData.selectedPositions]);

// //   // Get the current filtered data
// //   const filteredDepartments = getFilteredDepartments();
// //   const filteredPositions = getFilteredPositions();
// //   const filteredEmployees = getFilteredEmployees();

// //   // Refresh departments when company selection changes
// //   useEffect(() => {
// //     console.log('🔄 Company selection changed, refreshing departments...', {
// //       activeCompanyId: formData.activeCompanyId,
// //       selectedCompanies: formData.selectedCompanies
// //     });
// //     fetchAllDepartments();
// //   }, [formData.activeCompanyId, fetchAllDepartments]);

// //   // Initial load
// //   useEffect(() => {
// //     console.log('🚀 Initializing component...');
// //     fetchCompanies();
// //     fetchAllDepartments();
// //     fetchAllPositions();
// //     fetchAllEmployees();
    
// //     if (formData.targetRows.length === 0) {
// //       setFormData((prev) => ({
// //         ...prev,
// //         targetRows: [
// //           {
// //             id: Math.random().toString(36).slice(2, 11),
// //             type: 'companies',
// //             selectedCompanies: [],
// //             selectedDepartments: [],
// //             selectedPositions: [],
// //             selectedEmployees: [],
// //             isOpen: true,
// //             activeTab: 'companies',
// //             parentType: '',
// //             selectedAll: false,
// //           },
// //         ],
// //       }));
// //     }
// //   }, []);

// //   // FIXED: Auto-switch to departments tab when departments become available
// //   useEffect(() => {
// //     if (formData.activeCompanyId && filteredDepartments.length > 0) {
// //       console.log('🚀 Auto-switching to departments tab:', {
// //         activeCompanyId: formData.activeCompanyId,
// //         filteredDepartmentsCount: filteredDepartments.length
// //       });
      
// //       setFormData((prev) => {
// //         const updatedTargetRows = prev.targetRows.map((row, index) => {
// //           if (index === 0 && row.activeTab === 'companies') {
// //             console.log('🔄 Switching first target row to departments tab');
// //             return {
// //               ...row,
// //               activeTab: 'departments' as 'companies' | 'departments' | 'positions' | 'employees',
// //               parentType: 'companies' as '' | 'companies' | 'departments' | 'positions'
// //             };
// //           }
// //           return row;
// //         });
        
// //         return {
// //           ...prev,
// //           targetRows: updatedTargetRows
// //         };
// //       });
// //     }
// //   }, [filteredDepartments.length, formData.activeCompanyId]);

// //   // Enhanced debugging - MOVED AFTER filteredDepartments declaration
// //   useEffect(() => {
// //     console.log('🔍 COMPREHENSIVE DEPARTMENT DEBUG:', {
// //       activeCompanyId: formData.activeCompanyId,
// //       allDepartmentsCount: departments.length,
// //       filteredDepartmentsCount: filteredDepartments.length,
// //       firstFewDepartments: departments.slice(0, 3).map(d => ({
// //         id: d.id,
// //         name: d.department_name,
// //         company_id: d.company_id,
// //         company_name: d.company_name
// //       })),
// //       firstFewFiltered: filteredDepartments.slice(0, 3).map(d => ({
// //         id: d.id,
// //         name: d.department_name,
// //         company_id: d.company_id
// //       })),
// //       targetRows: formData.targetRows.map(row => ({
// //         id: row.id,
// //         activeTab: row.activeTab,
// //         selectedCompanies: row.selectedCompanies,
// //         selectedDepartments: row.selectedDepartments
// //       }))
// //     });
// //   }, [formData.activeCompanyId, departments, filteredDepartments, formData.targetRows]);

// //   // Debug filtered data
// //   useEffect(() => {
// //     console.log('🎯 Filtered Data Summary:', {
// //       filteredDepartments: filteredDepartments.length,
// //       filteredPositions: filteredPositions.length,
// //       filteredEmployees: filteredEmployees.length,
// //       activeCompanyId: formData.activeCompanyId,
// //       selectedDepartments: formData.selectedDepartments,
// //       selectedPositions: formData.selectedPositions
// //     });
// //   }, [filteredDepartments, filteredPositions, filteredEmployees, formData.activeCompanyId, formData.selectedDepartments, formData.selectedPositions]);

// //   const handleSearchChange = (e: ChangeEvent<HTMLInputElement>, type: 'company' | 'department' | 'position' | 'employee') => {
// //     const field = `${type}SearchTerm` as
// //       | 'companySearchTerm'
// //       | 'departmentSearchTerm'
// //       | 'positionSearchTerm'
// //       | 'employeeSearchTerm';
// //     setFormData((p) => ({ ...p, [field]: e.target.value }));
// //   };
  
// //   const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
// //     const { name, value } = e.target;
// //     setFormData((p) => ({ ...p, [name]: value }));
// //   };
  
// //   const handleBooleanChange = (e: ChangeEvent<HTMLInputElement>) => {
// //     const { name, checked } = e.target;
// //     setFormData((p) => ({ ...p, [name]: checked }));
// //   };

// //   const handleFilesSelected = (files: EmployeeDocument[]) => setFormData((p) => ({ ...p, attachments: files }));
  
// //   const handleDocumentDeleted = (removed?: EmployeeDocument) => {
// //     if (!removed) return;
// //     setFormData((p) => ({
// //       ...p,
// //       attachments: p.attachments.filter(
// //         (f) => !(f.name === removed.name && f.documentType === removed.documentType && f.file === removed.file)
// //       ),
// //     }));
// //   };

// //   // Manual debug function
// //   const debugDepartmentFiltering = () => {
// //     console.group('🧪 MANUAL DEPARTMENT DEBUG');
// //     console.log('Active Company ID:', formData.activeCompanyId);
// //     console.log('All Departments:', departments);
// //     console.log('Filtered Departments:', filteredDepartments);
// //     console.log('Target Rows:', formData.targetRows);
    
// //     const manualFiltered = departments.filter(dept => 
// //       dept.company_id?.toString() === formData.activeCompanyId?.toString()
// //     );
// //     console.log('Manual Filter Result:', manualFiltered);
    
// //     console.groupEnd();
// //   };

// //   // ---- Submit (single entry point) ----
// //   const doSubmit = async (postNow: boolean) => {
// //     setLoading(true);
// //     setError('');

// //     const htmlContent = editorValue.map((n) => serialize(n)).join('');
// //     const textForValidation = htmlContent.replace(/<[^>]*>/g, '').trim();

// //     if (!formData.title.trim() || !textForValidation) {
// //       setShowRequiredToast(true);
// //       setLoading(false);
// //       setTimeout(() => setShowRequiredToast(false), 3000);
// //       setRequiredToastMsg(
// //         formData.title.trim()
// //           ? 'Content is required field. Please fill it in before submitting.'
// //           : textForValidation
// //           ? 'Title is required field. Please fill it in before submitting.'
// //           : 'Title and Content are required fields. Please fill them in before submitting.'
// //       );
// //       return;
// //     }

// //     try {
// //       const {
// //         title,
// //         requireAcknowledgement,
// //         forceAcknowledgeLogin,
// //         autoExpire,
// //         targetRows,
// //         scheduleEnabled,
// //         scheduledAt,
// //         attachments,
// //       } = formData;

// //       const payload: AnnouncementPayload = {
// //         title,
// //         content: htmlContent,
// //         targets: [],
// //         requireAcknowledgement,
// //         forceAcknowledgeLogin,
// //         autoExpire,
// //         is_posted: scheduleEnabled ? false : postNow,
// //         scheduled_at: scheduleEnabled && scheduledAt ? scheduledAt : null,
// //       };

// //       const hasTargets = targetRows.some(
// //         (row) =>
// //           row.selectedCompanies.length > 0 ||
// //           row.selectedDepartments.length > 0 ||
// //           row.selectedPositions.length > 0 ||
// //           row.selectedEmployees.length > 0
// //       );

// //       if (!hasTargets) {
// //         payload.target_type = 'all';
// //         payload.target_id = 0;
// //       } else {
// //         targetRows.forEach((row) => {
// //           const targetType =
// //             row.selectedEmployees.length > 0
// //               ? 'employee'
// //               : row.selectedPositions.length > 0
// //               ? 'position'
// //               : row.selectedDepartments.length > 0
// //               ? 'department'
// //               : 'company';

// //           const pushAll = (ids: string[]) => {
// //             ids.forEach((id) => payload.targets.push({ target_type: targetType, target_id: id }));
// //           };
// //           if (row.selectedEmployees.length) pushAll(row.selectedEmployees);
// //           else if (row.selectedPositions.length) pushAll(row.selectedPositions);
// //           else if (row.selectedDepartments.length) pushAll(row.selectedDepartments);
// //           else if (row.selectedCompanies.length) pushAll(row.selectedCompanies);
// //         });
// //       }

// //       const formDataToSend = new FormData();
// //       formDataToSend.append(
// //         'data',
// //         JSON.stringify({
// //           ...payload,
// //           is_acknowledgement: requireAcknowledgement,
// //           is_force_login: forceAcknowledgeLogin,
// //           is_expired: autoExpire,
// //         })
// //       );

// //       if (attachments && attachments.length > 0) {
// //         attachments.forEach((doc, index) => {
// //           if (doc.file) {
// //             formDataToSend.append(`attachments[${index}]`, doc.file);
// //             formDataToSend.append(`attachments_metadata[${index}]`, JSON.stringify({
// //               name: doc.name,
// //               documentType: doc.documentType,
// //               size: doc.file.size,
// //               type: doc.file.type
// //             }));
// //           }
// //         });
// //       }

// //       console.log('Sending form data with attachments:', attachments?.length || 0);

// //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}`, {
// //         method: 'POST',
// //         body: formDataToSend,
// //       });

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         console.error('Server response:', errorText);
// //         throw new Error(`Failed to create announcement: ${response.status} ${response.statusText}`);
// //       }

// //       const result = await response.json();
// //       console.log('Announcement created successfully:', result);
      
// //       router.push('/announcements');
// //     } catch (err) {
// //       console.error('Error creating announcement:', err);
// //       setError(err instanceof Error ? err.message : 'Failed to create announcement. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
// //     doSubmit(false);
// //   };

// //   // ---- target row helpers ----
// //   const toggleTargetRowItem = (rowId: string, itemId: string) => {
// //     setFormData((prev) => {
// //       const targetRow = prev.targetRows.find((r) => r.id === rowId);
// //       if (!targetRow) return prev;

// //       let updatedItems: string[] = [];
// //       let newActiveCompanyId = prev.activeCompanyId;
// //       let newActiveDepartmentId = prev.activeDepartmentId;
// //       let newActivePositionId = prev.activePositionId;

// //       if (targetRow.activeTab === 'companies') {
// //         updatedItems = targetRow.selectedCompanies.includes(itemId)
// //           ? targetRow.selectedCompanies.filter((id) => id !== itemId)
// //           : [...targetRow.selectedCompanies, itemId];
        
// //         if (updatedItems.length > 0) {
// //           newActiveCompanyId = updatedItems[0];
// //           console.log('🏢 Company selected, setting activeCompanyId:', newActiveCompanyId);
// //         } else {
// //           newActiveCompanyId = '';
// //         }
// //         newActiveDepartmentId = '';
// //         newActivePositionId = '';
// //       } else if (targetRow.activeTab === 'departments') {
// //         updatedItems = targetRow.selectedDepartments.includes(itemId)
// //           ? targetRow.selectedDepartments.filter((id) => id !== itemId)
// //           : [...targetRow.selectedDepartments, itemId];
        
// //         if (updatedItems.length > 0) {
// //           newActiveDepartmentId = updatedItems[0];
// //           console.log('🏛️ Department selected, setting activeDepartmentId:', newActiveDepartmentId);
// //         } else {
// //           newActiveDepartmentId = '';
// //         }
// //         newActivePositionId = '';
// //       } else if (targetRow.activeTab === 'positions') {
// //         updatedItems = targetRow.selectedPositions.includes(itemId)
// //           ? targetRow.selectedPositions.filter((id) => id !== itemId)
// //           : [...targetRow.selectedPositions, itemId];
        
// //         if (updatedItems.length > 0) {
// //           newActivePositionId = updatedItems[0];
// //           console.log('💼 Position selected, setting activePositionId:', newActivePositionId);
// //         } else {
// //           newActivePositionId = '';
// //         }
// //       } else {
// //         updatedItems = targetRow.selectedEmployees.includes(itemId)
// //           ? targetRow.selectedEmployees.filter((id) => id !== itemId)
// //           : [...targetRow.selectedEmployees, itemId];
// //       }

// //       const selectedCompanies = targetRow.activeTab === 'companies' ? updatedItems : prev.selectedCompanies;
      
// //       let selectedDepartments = prev.selectedDepartments;
// //       let selectedPositions = prev.selectedPositions;
// //       let selectedEmployees = prev.selectedEmployees;
      
// //       if (targetRow.activeTab === 'companies') {
// //         selectedDepartments = [];
// //         selectedPositions = [];
// //         selectedEmployees = [];
// //       } else if (targetRow.activeTab === 'departments') {
// //         selectedPositions = [];
// //         selectedEmployees = [];
// //       } else if (targetRow.activeTab === 'positions') {
// //         selectedEmployees = [];
// //       }

// //       const updatedTargetRows = prev.targetRows.map((row) => {
// //         if (row.id === rowId) {
// //           const updatedRow = {
// //             ...row,
// //             selectedCompanies: targetRow.activeTab === 'companies' ? updatedItems : row.selectedCompanies,
// //             selectedDepartments: targetRow.activeTab === 'departments' ? updatedItems : row.selectedDepartments,
// //             selectedPositions: targetRow.activeTab === 'positions' ? updatedItems : row.selectedPositions,
// //             selectedEmployees: targetRow.activeTab === 'employees' ? updatedItems : row.selectedEmployees,
// //           };

// //           if (targetRow.activeTab === 'companies') {
// //             updatedRow.selectedDepartments = [];
// //             updatedRow.selectedPositions = [];
// //             updatedRow.selectedEmployees = [];
// //           } else if (targetRow.activeTab === 'departments') {
// //             updatedRow.selectedPositions = [];
// //             updatedRow.selectedEmployees = [];
// //           } else if (targetRow.activeTab === 'positions') {
// //             updatedRow.selectedEmployees = [];
// //           }

// //           return updatedRow;
// //         }
// //         return row;
// //       });

// //       return {
// //         ...prev,
// //         activeCompanyId: newActiveCompanyId,
// //         activeDepartmentId: newActiveDepartmentId,
// //         activePositionId: newActivePositionId,
// //         selectedCompanies,
// //         selectedDepartments,
// //         selectedPositions,
// //         selectedEmployees,
// //         targetRows: updatedTargetRows,
// //       };
// //     });
// //   };

// //   const isAnyCompanySelected = () =>
// //     formData.targetRows.some(
// //       (row) => (row.type === 'companies' || row.parentType === 'companies') && row.selectedCompanies.length > 0
// //     );

// //   const isAnyDepartmentSelected = () =>
// //     formData.targetRows.some(
// //       (row) =>
// //         (row.activeTab === 'departments' || row.parentType === 'departments' || row.selectedPositions.length > 0) &&
// //         row.selectedDepartments.length > 0
// //     ) || formData.targetRows.some((row) => row.activeTab !== 'departments' && row.selectedDepartments.length > 0);

// //   const isAnyPositionSelected = () =>
// //     formData.targetRows.some(
// //       (row) =>
// //         (row.activeTab === 'positions' || row.parentType === 'positions' || row.selectedEmployees.length > 0) &&
// //         row.selectedPositions.length > 0
// //     ) || formData.targetRows.some((row) => row.activeTab !== 'positions' && row.selectedPositions.length > 0);

// //   const changeTargetRowTab = (
// //     rowId: string,
// //     newTab: 'companies' | 'departments' | 'positions' | 'employees',
// //     parentType: '' | 'companies' | 'departments' | 'positions'
// //   ) => {
// //     if (newTab === 'departments' && !isAnyCompanySelected()) return;
// //     if (newTab === 'positions' && !isAnyDepartmentSelected()) return;
// //     if (newTab === 'employees' && !isAnyPositionSelected()) return;

// //     console.log(`🔄 Changing tab to ${newTab} for row ${rowId}`);

// //     setFormData((prev) => ({
// //       ...prev,
// //       targetRows: prev.targetRows.map((row) => (row.id === rowId ? { ...row, activeTab: newTab, parentType } : row)),
// //     }));
// //   };

// //   const renderLeaf = useCallback((props: any) => {
// //     const leaf = props.leaf as CustomText;
// //     return (
// //       <span
// //         {...props.attributes}
// //         style={{
// //           fontWeight: leaf.bold ? 'bold' : 'normal',
// //           fontStyle: leaf.italic ? 'italic' : 'normal',
// //           textDecoration: leaf.underline ? 'underline' : 'none',
// //         }}
// //       >
// //         {props.children}
// //       </span>
// //     );
// //   }, []);

// //   const MainSubmitLabel = ({ scheduled }: { scheduled: boolean }) => {
// //     if (loading) {
// //       return (
// //         <>
// //           <span className="loading loading-spinner loading-sm mr-2" />
// //           Saving...
// //         </>
// //       );
// //     }
// //     if (scheduled) {
// //       return (
// //         <>
// //           <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //           </svg>
// //           Schedule
// //         </>
// //       );
// //     }
// //     return (
// //       <>
// //         <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
// //         </svg>
// //         Post
// //       </>
// //     );
// //   };

// //   return (
// //     <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
// //       <div className="flex flex-col sm:flex-row justify-between mb-6">
// //         <nav className="text-sm breadcrumbs">
// //           <ul>
// //             <li><Link href="/" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Dashboard</Link></li>
// //             <li><Link href="/announcements" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Announcements</Link></li>
// //             <li className="font-semibold">Create Announcement</li>
// //           </ul>
// //         </nav>
// //         <div className="flex justify-end">
// //           <Link href="/announcements" className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
// //             <FaArrowLeft className="mr-2" /> Back
// //           </Link>
// //         </div>
// //       </div>

// //       <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Create New Announcement</h1>

// //       {error ? (
// //         <div className={`alert mb-6 ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
// //           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
// //           </svg>
// //           <span>{error}</span>
// //         </div>
// //       ) : null}

// //       {/* Enhanced debug section */}
// //       <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
// //         <h3 className="font-bold mb-2">Debug: Data Loading</h3>
// //         <div className="flex flex-wrap gap-2">
// //           <button 
// //             onClick={() => fetchAllDepartments()}
// //             className="btn btn-sm btn-warning"
// //           >
// //             Refresh Departments
// //           </button>
// //           <button 
// //             onClick={() => fetchAllPositions()}
// //             className="btn btn-sm btn-info"
// //           >
// //             Refresh Positions
// //           </button>
// //           <button 
// //             onClick={() => fetchAllEmployees()}
// //             className="btn btn-sm btn-success"
// //           >
// //             Refresh Employees
// //           </button>
// //           <button 
// //             onClick={debugDepartmentFiltering}
// //             className="btn btn-sm btn-error"
// //           >
// //             Debug Departments
// //           </button>
// //           <div className="text-sm">
// //             Active Company: {formData.activeCompanyId} | 
// //             Departments: {filteredDepartments.length}/{departments.length} | 
// //             Positions: {filteredPositions.length}/{positions.length} | 
// //             Employees: {filteredEmployees.length}/{employees.length}
// //           </div>
// //         </div>
// //       </div>

// //       <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// //         <div className="tabs tabs-bordered mb-6">
// //           <a className={`tab tab-bordered ${activeTab === 'details' ? 'tab-active' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`} onClick={() => handleTabChange('details')}>Announcement Details</a>
// //           <a className={`tab tab-bordered ${activeTab === 'recipients' ? 'tab-active' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`} onClick={() => handleTabChange('recipients')}>Recipients</a>
// //         </div>

// //         <div className={`${activeTab === 'details' ? 'block' : 'hidden'}`}>
// //           <div className="mb-8">
// //             <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Announcement Details</h2>

// //             <div className="grid grid-cols-1 gap-6 mb-6">
// //               <div>
// //                 <div className={`mb-2 font-medium flex items-center gap-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Title <span className="text-red-500">*</span></div>
// //                 <input
// //                   type="text"
// //                   name="title"
// //                   value={formData.title}
// //                   onChange={handleTextChange}
// //                   className={`input w-full border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
// //                   required
// //                   placeholder="Enter announcement title"
// //                 />
// //               </div>

// //               <div>
// //                 <div className={`mb-2 font-medium flex items-center gap-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Content <span className="text-red-500">*</span></div>
// //                 <div
// //                   className={`rounded-lg border ${
// //                     theme === 'light'
// //                       ? 'bg-white border-slate-300 focus-within:ring-2 focus-within:ring-blue-500'
// //                       : 'bg-slate-700 border-slate-600 focus-within:ring-2 focus-within:ring-blue-400'
// //                   }`}
// //                 >
// //                   <Slate
// //                     editor={editor}
// //                     initialValue={editorValue}
// //                     onChange={(v) => setEditorValue(v)}
// //                   >
// //                     <div
// //                       className={`flex items-center gap-2 p-2 border-b ${
// //                         theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700'
// //                       }`}
// //                     >
// //                       <MarkButton format="bold" icon={<FaBold />} theme={theme} />
// //                       <MarkButton format="italic" icon={<FaItalic />} theme={theme} />
// //                       <MarkButton format="underline" icon={<FaUnderline />} theme={theme} />
// //                     </div>

// //                     <div className="p-3">
// //                       <Editable
// //                         renderLeaf={renderLeaf}
// //                         placeholder="Enter announcement content..."
// //                         spellCheck
// //                         className={`min-h-40 w-full border-0 outline-none focus:outline-none ring-0 focus:ring-0 ${
// //                           theme === 'light' ? 'text-slate-900' : 'text-slate-100'
// //                         }`}
// //                         onKeyDown={(e) => {
// //                           const k = e.key.toLowerCase();
// //                           if ((e.metaKey || e.ctrlKey) && k === 'b') { e.preventDefault(); CustomEditor.toggleBoldMark(editor); }
// //                           if ((e.metaKey || e.ctrlKey) && k === 'i') { e.preventDefault(); CustomEditor.toggleItalicMark(editor); }
// //                           if ((e.metaKey || e.ctrlKey) && k === 'u') { e.preventDefault(); CustomEditor.toggleUnderlineMark(editor); }
// //                         }}
// //                       />
// //                     </div>
// //                   </Slate>
// //                 </div>
// //               </div>

// //               {/* Attachments */}
// //               <div className="mt-4">
// //                 <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Attachments</div>
// //                 <EmployeeDocumentManager
// //                   employeeId={null}
// //                   mode="add"
// //                   documentTypes={[{ type: 'AnnouncementAttachment', label: 'Announcement Attachments', description: 'Upload files to be included with this announcement (PDF, Word, Excel, images, etc.)' }]}
// //                   onFilesSelected={handleFilesSelected}
// //                   moduleName="announcement"
// //                   customUploadEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents/upload-request`}
// //                   customDeleteEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents`}
// //                   customViewEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents/view-url`}
// //                   initialDocuments={formData.attachments || []}
// //                   onDocumentDeleted={handleDocumentDeleted}
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           <div className="mt-4 flex justify-between">
// //             <div />
// //             <button
// //               type="button"
// //               className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
// //               onClick={() => handleTabChange('recipients')}
// //             >
// //               Next: Select Recipients
// //             </button>
// //           </div>
// //         </div>

// //         {/* Recipients */}
// //         <div className={`${activeTab === 'recipients' ? 'block' : 'hidden'}`}>
// //           <div className="mb-8">
// //             <div className="flex items-center mb-4">
// //               <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Recipients</h2>
// //               <div className={`badge ml-3 ${theme === 'light' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-blue-900 text-blue-200 border-blue-700'} border`}>Optional</div>
// //             </div>

// //             <div className={`alert mb-6 ${theme === 'light' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-blue-900 border-blue-700 text-blue-200'} border rounded-lg`}>
// //               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
// //               </svg>
// //               <span>If no target rows are added, the announcement will be sent to all parties.</span>
// //             </div>

// //             <div className="space-y-4 mb-6">
// //               {formData.targetRows.map((row, index) => (
// //                 <TargetRowCard
// //                   key={row.id}
// //                   row={row}
// //                   index={index}
// //                   companies={companies}
// //                   departments={filteredDepartments}
// //                   positions={filteredPositions}
// //                   employees={filteredEmployees}
// //                   companySearchTerm={formData.companySearchTerm}
// //                   departmentSearchTerm={formData.departmentSearchTerm}
// //                   positionSearchTerm={formData.positionSearchTerm}
// //                   employeeSearchTerm={formData.employeeSearchTerm}
// //                   targetRows={formData.targetRows}
// //                   onChangeTab={changeTargetRowTab}
// //                   onToggleItem={toggleTargetRowItem}
// //                   onSearchChange={handleSearchChange}
// //                   isAnyCompanySelected={isAnyCompanySelected}
// //                   isAnyDepartmentSelected={isAnyDepartmentSelected}
// //                   isAnyPositionSelected={isAnyPositionSelected}
// //                 />
// //               ))}
// //             </div>

// //             {/* Acknowledgement */}
// //             <div className={`mb-8 p-4 rounded-lg mt-4 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
// //               <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Acknowledgement Options</h3>

// //               <div className="space-y-4">
// //                 <div className="form-control">
// //                   <label className="label cursor-pointer justify-start gap-3">
// //                     <input type="checkbox" className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`} name="requireAcknowledgement" checked={formData.requireAcknowledgement} onChange={handleBooleanChange} />
// //                     <div>
// //                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Require Acknowledgement</span>
// //                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients will need to acknowledge they have read this announcement</p>
// //                     </div>
// //                   </label>
// //                 </div>

// //                 <div className="form-control">
// //                   <label className="label cursor-pointer justify-start gap-3">
// //                     <input type="checkbox" className={`toggle ${theme === 'light' ? 'toggle-primary' : 'toggle-accent'}`} name="forceAcknowledgeLogin" checked={formData.forceAcknowledgeLogin} onChange={handleBooleanChange} disabled={!formData.requireAcknowledgement} />
// //                     <div>
// //                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Force Acknowledgement on Login</span>
// //                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients will be required to acknowledge this announcement before they can proceed</p>
// //                     </div>
// //                   </label>
// //                 </div>

// //                 <div className="form-control">
// //                   <label className="label cursor-pointer justify-start gap-3">
// //                     <input type="checkbox" className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`} name="autoExpire" checked={formData.autoExpire} onChange={handleBooleanChange} disabled={!formData.requireAcknowledgement} />
// //                     <div>
// //                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Auto-Expire After 7 Days</span>
// //                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Announcement will be automatically deleted 7 days after all targeted employees have read it</p>
// //                     </div>
// //                   </label>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Schedule */}
// //             <div className={`mb-8 p-4 rounded-lg mt-4 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
// //               <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule Options</h3>
// //               <div className="space-y-4">
// //                 <div className="form-control">
// //                   <label className="label cursor-pointer justify-start gap-3">
// //                     <input type="checkbox" className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`} name="scheduleEnabled" checked={formData.scheduleEnabled} onChange={handleBooleanChange} />
// //                     <div>
// //                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule this announcement</span>
// //                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>This announcement will be published automatically at the specified date and time</p>
// //                     </div>
// //                   </label>
// //                 </div>

// //                 {formData.scheduleEnabled ? (
// //                   <div className="form-control">
// //                     <label className="label"><span className={`label-text font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Publication Date and Time</span></label>
// //                     <div className="flex items-center gap-2">
// //                       <input
// //                         type="datetime-local"
// //                         className={`input border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-600 border-slate-500 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
// //                         name="scheduledAt"
// //                         value={formData.scheduledAt}
// //                         onChange={(e) => setFormData((p) => ({ ...p, scheduledAt: e.target.value }))}
// //                         min={new Date().toISOString().slice(0, 16)}
// //                         required={formData.scheduleEnabled}
// //                       />
// //                     </div>
// //                     <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Select the date and time when this announcement should be published</p>
// //                   </div>
// //                 ) : null}
// //               </div>
// //             </div>
// //           </div>

// //           <div className="mt-4 flex justify-between">
// //             <button
// //               type="button"
// //               className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
// //               onClick={() => handleTabChange('details')}
// //             >
// //               Back to Details
// //             </button>
// //             <div />
// //           </div>
// //         </div>

// //         {/* Submit buttons (recipients tab) */}
// //         <div className={`mt-8 pt-4 border-t flex justify-end ${activeTab === 'recipients' ? 'block' : 'hidden'} ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
// //           <Link href="/announcements" className={`btn btn-outline mr-3 ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>Cancel</Link>

// //           {!formData.scheduleEnabled ? (
// //             <button
// //               type="button"
// //               className={`btn mr-3 ${theme === 'light' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-amber-400 hover:bg-amber-500'} text-white border-0`}
// //               disabled={loading}
// //               onClick={() => { doSubmit(false); }}
// //             >
// //               {loading ? (
// //                 <>
// //                   <span className="loading loading-spinner loading-sm mr-2" />
// //                   Saving...
// //                 </>
// //               ) : (
// //                 <>
// //                   <FaSave className="mr-2" /> Save Draft
// //                 </>
// //               )}
// //             </button>
// //           ) : null}

// //           <button
// //             type="button"
// //             className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
// //             disabled={loading || (formData.scheduleEnabled && !formData.scheduledAt)}
// //             onClick={() => { doSubmit(!formData.scheduleEnabled); }}
// //           >
// //             <MainSubmitLabel scheduled={formData.scheduleEnabled} />
// //           </button>
// //         </div>
// //       </form>

// //       {/* Toast */}
// //       <div className="toast toast-center toast-middle z-50">
// //         {showRequiredToast ? (
// //           <div className={`alert shadow-lg ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
// //             <span>{requiredToastMsg}</span>
// //           </div>
// //         ) : null}
// //       </div>
// //     </div>
// //   );
// // }
// 'use client';

// import { useState, useEffect, ChangeEvent, FormEvent, useCallback, useMemo, JSX } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { FaSave, FaArrowLeft, FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
// import {
//   createEditor,
//   Descendant,
//   Editor,
//   Transforms,
//   Element as SlateElement,
//   BaseEditor,
// } from 'slate';
// import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react';
// import { withHistory, HistoryEditor } from 'slate-history';
// import { API_BASE_URL, API_ROUTES } from '../../config';
// import TargetRowCard, { TargetRow } from './card';
// import EmployeeDocumentManager, { EmployeeDocument } from '../../components/EmployeeDocumentManager';
// import { useTheme } from '../../components/ThemeProvider';
// import { filterApi, FilterOptions } from '../../utils/filterApi';

// // --------- Slate typings ----------
// type CustomText = {
//   bold?: boolean;
//   italic?: boolean;
//   underline?: boolean;
//   text: string;
// };
// type ParagraphElement = { type: 'paragraph'; children: CustomText[] };
// type CustomElement = ParagraphElement;

// declare module 'slate' {
//   interface CustomTypes {
//     Editor: BaseEditor & ReactEditor & HistoryEditor;
//     Element: CustomElement;
//     Text: CustomText;
//   }
// }

// // --------- API models ----------
// interface Company { 
//   id: string; 
//   name: string; 
//   is_active?: boolean;
// }

// interface Department { 
//   id: string; 
//   department_name: string; 
//   company_id: string;    
//   company_name: string;  
//   company_ids?: string;    
//   company_names?: string;  
// }

// interface Position { 
//   id: string; 
//   title: string; 
//   department_id: string; 
//   company_name: string; 
//   department_name: string;
//   job_level?: string;
// }

// interface Employee {
//   id: string; 
//   name: string; 
//   position_id: string; 
//   department_id: string; 
//   company_id: string;
//   company_name: string; 
//   department_name: string; 
//   position_title: string; 
//   job_level: string;
//   employee_no?: string;
//   email?: string;
// }

// interface FormDataType {
//   title: string;
//   content: string;
//   selectedCompanies: string[]; 
//   selectedDepartments: string[]; 
//   selectedPositions: string[]; 
//   selectedEmployees: string[];
//   companySearchTerm: string; 
//   departmentSearchTerm: string; 
//   positionSearchTerm: string; 
//   employeeSearchTerm: string;
//   requireAcknowledgement: boolean; 
//   forceAcknowledgeLogin: boolean; 
//   autoExpire: boolean;
//   targetRows: TargetRow[]; 
//   scheduleEnabled: boolean; 
//   scheduledAt: string; 
//   attachments: EmployeeDocument[];
// }

// interface AnnouncementPayload {
//   title: string;
//   content: string;
//   targets: { target_type: string; target_id: string }[];
//   target_type?: string;
//   target_id?: number;
//   requireAcknowledgement: boolean;
//   forceAcknowledgeLogin: boolean;
//   autoExpire: boolean;
//   is_posted: boolean;
//   scheduled_at?: string | null;
// }

// // --------- Mark helpers ----------
// const CustomEditor = {
//   isBoldMarkActive(editor: Editor) {
//     const marks = Editor.marks(editor);
//     return marks ? (marks as CustomText).bold === true : false;
//   },
//   isItalicMarkActive(editor: Editor) {
//     const marks = Editor.marks(editor);
//     return marks ? (marks as CustomText).italic === true : false;
//   },
//   isUnderlineMarkActive(editor: Editor) {
//     const marks = Editor.marks(editor);
//     return marks ? (marks as CustomText).underline === true : false;
//   },
//   toggleBoldMark(editor: Editor) {
//     if (CustomEditor.isBoldMarkActive(editor)) {
//       Editor.removeMark(editor, 'bold');
//     } else {
//       Editor.addMark(editor, 'bold', true);
//     }
//   },
//   toggleItalicMark(editor: Editor) {
//     if (CustomEditor.isItalicMarkActive(editor)) {
//       Editor.removeMark(editor, 'italic');
//     } else {
//       Editor.addMark(editor, 'italic', true);
//     }
//   },
//   toggleUnderlineMark(editor: Editor) {
//     if (CustomEditor.isUnderlineMarkActive(editor)) {
//       Editor.removeMark(editor, 'underline');
//     } else {
//       Editor.addMark(editor, 'underline', true);
//     }
//   },
// };

// // --------- Initial value ----------
// const initialValue: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }];

// // --------- Toolbar Button ----------
// const MarkButton = ({
//   format,
//   icon,
//   theme,
// }: {
//   format: 'bold' | 'italic' | 'underline';
//   icon: JSX.Element;
//   theme: string;
// }) => {
//   const editor = useSlate();
//   const isActive =
//     format === 'bold'
//       ? CustomEditor.isBoldMarkActive(editor)
//       : format === 'italic'
//       ? CustomEditor.isItalicMarkActive(editor)
//       : CustomEditor.isUnderlineMarkActive(editor);

//   return (
//     <button
//       type="button"
//       aria-pressed={isActive}
//       onMouseDown={(e) => {
//         e.preventDefault();
//         ReactEditor.focus(editor);
//         if (!editor.selection) {
//           try { Transforms.select(editor, Editor.end(editor, [])); } catch { /* no-op */ }
//         }
//         if (format === 'bold') CustomEditor.toggleBoldMark(editor);
//         else if (format === 'italic') CustomEditor.toggleItalicMark(editor);
//         else CustomEditor.toggleUnderlineMark(editor);
//       }}
//       className={[
//         'px-2 py-1 rounded-md text-sm font-semibold border transition-colors',
//         isActive
//           ? theme === 'light'
//             ? 'bg-blue-600 text-white border-blue-600'
//             : 'bg-blue-500 text-white border-blue-500'
//           : theme === 'light'
//           ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
//           : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600',
//       ].join(' ')}
//     >
//       {icon}
//     </button>
//   );
// };

// // --------- Serialize to HTML ----------
// const serialize = (node: Descendant): string => {
//   if (SlateElement.isElement(node)) {
//     const el = node as ParagraphElement;
//     const children = el.children.map((n) => serialize(n)).join('');
//     if (el.type === 'paragraph') return `<p>${children}</p>`;
//     return children;
//   }
//   const t = node as CustomText;
//   let str = t.text;
//   if (t.bold) str = `<strong>${str}</strong>`;
//   if (t.italic) str = `<em>${str}</em>`;
//   if (t.underline) str = `<u>${str}</u>`;
//   return str;
// };

// export default function CreateAnnouncementPage() {
//   const { theme } = useTheme();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState<'details' | 'recipients'>('details');
//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [positions, setPositions] = useState<Position[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [showRequiredToast, setShowRequiredToast] = useState(false);
//   const [requiredToastMsg, setRequiredToastMsg] = useState('');
//   const [isLoadingData, setIsLoadingData] = useState(false);
//   const [userId, setUserId] = useState<number>(0);

//   // Initialize userId from localStorage
//   useEffect(() => {
//     const user = localStorage.getItem('hrms_user');
//     if (user) {
//       try {
//         const userData = JSON.parse(user);
//         if (userData && userData.id) setUserId(userData.id);
//       } catch (e) {
//         console.error('Error parsing user data:', e);
//       }
//     }
//   }, []);

//   // Slate editor + value
//   const editor = useMemo(() => withHistory(withReact(createEditor())), []);
//   const [editorValue, setEditorValue] = useState<Descendant[]>(initialValue);

//   const [formData, setFormData] = useState<FormDataType>({
//     title: '',
//     content: '',
//     selectedCompanies: [],
//     selectedDepartments: [],
//     selectedPositions: [],
//     selectedEmployees: [],
//     companySearchTerm: '',
//     departmentSearchTerm: '',
//     positionSearchTerm: '',
//     employeeSearchTerm: '',
//     requireAcknowledgement: false,
//     forceAcknowledgeLogin: false,
//     autoExpire: false,
//     scheduleEnabled: false,
//     scheduledAt: '',
//     attachments: [],
//     targetRows: [
//       {
//         id: Math.random().toString(36).slice(2, 11),
//         type: 'companies',
//         selectedCompanies: [],
//         selectedDepartments: [],
//         selectedPositions: [],
//         selectedEmployees: [],
//         isOpen: true,
//         activeTab: 'companies',
//         parentType: '',
//         selectedAll: false,
//       },
//     ],
//   });

//   const handleTabChange = (tab: 'details' | 'recipients') => setActiveTab(tab);

//   // NEW: Enhanced fetch functions with proper multiple selection support
//   const fetchCompanies = async (searchTerm: string = '', selectedIds: string[] = []) => {
//     try {
//       const filters: FilterOptions = {};
//       if (searchTerm) filters.search = searchTerm;
//       if (selectedIds.length > 0) filters.ids = selectedIds;
//       filters.limit = 100;
      
//       const result = await filterApi.getCompanies(filters);
//       if (result.success) {
//         setCompanies(result.data);
//         console.log('✅ Companies loaded:', result.data.length);
//       }
//     } catch (e) { 
//       console.error('Error fetching companies:', e); 
//     }
//   };

//   const fetchDepartments = async (searchTerm: string = '', companyIds: string[] = [], selectedIds: string[] = []) => {
//     try {
//       const filters: FilterOptions = {};
//       if (searchTerm) filters.search = searchTerm;
//       if (companyIds.length > 0) filters.company_ids = companyIds;
//       if (selectedIds.length > 0) filters.ids = selectedIds;
//       filters.limit = 200;
      
//       console.log('🔍 Fetching departments with filters:', { companyIds, selectedIds });
      
//       const result = await filterApi.getDepartments(filters);
//       if (result.success) {
//         setDepartments(result.data);
//         console.log('✅ Departments loaded for companies:', companyIds, 'Count:', result.data.length);
//       }
//     } catch (e) { 
//       console.error('Error fetching departments:', e); 
//     }
//   };

//   const fetchPositions = async (searchTerm: string = '', departmentIds: string[] = [], companyIds: string[] = [], selectedIds: string[] = []) => {
//     try {
//       const filters: FilterOptions = {};
//       if (searchTerm) filters.search = searchTerm;
//       if (departmentIds.length > 0) {
//         filters.department_ids = departmentIds;
//         console.log('🎯 Fetching positions for departments:', departmentIds);
//       } else if (companyIds.length > 0) {
//         filters.company_ids = companyIds;
//         console.log('🎯 Fetching positions for companies:', companyIds);
//       }
//       if (selectedIds.length > 0) filters.ids = selectedIds;
//       filters.limit = 200;
      
//       const result = await filterApi.getPositions(filters);
//       if (result.success) {
//         setPositions(result.data);
//         console.log('✅ Positions loaded:', result.data.length);
//       }
//     } catch (e) { 
//       console.error('Error fetching positions:', e); 
//     }
//   };

//   const fetchEmployees = async (searchTerm: string = '', positionIds: string[] = [], departmentIds: string[] = [], companyIds: string[] = [], selectedIds: string[] = []) => {
//     try {
//       const filters: FilterOptions = { status: 'Active' };
//       if (searchTerm) filters.search = searchTerm;
//       if (positionIds.length > 0) {
//         filters.position_ids = positionIds;
//         console.log('👥 Fetching employees for positions:', positionIds);
//       } else if (departmentIds.length > 0) {
//         filters.department_ids = departmentIds;
//         console.log('👥 Fetching employees for departments:', departmentIds);
//       } else if (companyIds.length > 0) {
//         filters.company_ids = companyIds;
//         console.log('👥 Fetching employees for companies:', companyIds);
//       }
//       if (selectedIds.length > 0) filters.ids = selectedIds;
//       filters.limit = 200;
      
//       const result = await filterApi.getEmployees(filters);
//       if (result.success) {
//         setEmployees(result.data);
//         console.log('✅ Employees loaded:', result.data.length);
//       }
//     } catch (e) { 
//       console.error('Error fetching employees:', e); 
//     }
//   };

//   // NEW: Efficient initial data loading
//   const loadAllInitialData = async () => {
//     setIsLoadingData(true);
//     try {
//       const result = await filterApi.getAllFilterData();
//       if (result.success) {
//         setCompanies(result.data.companies);
//         setDepartments(result.data.departments);
//         setPositions(result.data.positions);
//         setEmployees(result.data.employees);
        
//         console.log('🚀 All initial data loaded:', {
//           companies: result.data.companies.length,
//           departments: result.data.departments.length,
//           positions: result.data.positions.length,
//           employees: result.data.employees.length
//         });
//       }
//     } catch (error) {
//       console.error('Error loading initial data:', error);
//       // Fallback to individual calls
//       await fetchCompanies();
//       await fetchDepartments();
//       await fetchPositions();
//       await fetchEmployees();
//     } finally {
//       setIsLoadingData(false);
//     }
//   };

//   // NEW: Enhanced search handlers with proper multiple selection support
//   const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>, type: 'company' | 'department' | 'position' | 'employee') => {
//     const searchTerm = e.target.value;
//     const field = `${type}SearchTerm` as
//       | 'companySearchTerm'
//       | 'departmentSearchTerm'
//       | 'positionSearchTerm'
//       | 'employeeSearchTerm';
    
//     setFormData((p) => ({ ...p, [field]: searchTerm }));

//     // Debounced search with proper multiple selection support
//     setTimeout(() => {
//       switch (type) {
//         case 'company':
//           fetchCompanies(searchTerm, formData.selectedCompanies);
//           break;
//         case 'department':
//           fetchDepartments(
//             searchTerm, 
//             formData.selectedCompanies, // Use ALL selected companies, not just activeCompanyId
//             formData.selectedDepartments
//           );
//           break;
//         case 'position':
//           fetchPositions(
//             searchTerm,
//             formData.selectedDepartments,
//             formData.selectedCompanies,
//             formData.selectedPositions
//           );
//           break;
//         case 'employee':
//           fetchEmployees(
//             searchTerm,
//             formData.selectedPositions,
//             formData.selectedDepartments,
//             formData.selectedCompanies,
//             formData.selectedEmployees
//           );
//           break;
//       }
//     }, 300);
//   };

//   // NEW: Enhanced data refresh with proper multiple selection cascading
//   const refreshFilteredData = useCallback(async () => {
//     console.log('🔄 Refreshing filtered data with multiple selections:', {
//       selectedCompanies: formData.selectedCompanies,
//       selectedDepartments: formData.selectedDepartments,
//       selectedPositions: formData.selectedPositions,
//       selectedEmployees: formData.selectedEmployees
//     });

//     // Always refresh companies to show current selections
//     await fetchCompanies(formData.companySearchTerm, formData.selectedCompanies);

//     // Refresh departments based on selected companies
//     if (formData.selectedCompanies.length > 0) {
//       await fetchDepartments(
//         formData.departmentSearchTerm,
//         formData.selectedCompanies, // Use ALL selected companies
//         formData.selectedDepartments
//       );
//     } else {
//       // If no companies selected, show all departments
//       await fetchDepartments(formData.departmentSearchTerm, [], formData.selectedDepartments);
//     }

//     // Refresh positions based on selected departments OR companies
//     if (formData.selectedDepartments.length > 0) {
//       await fetchPositions(
//         formData.positionSearchTerm,
//         formData.selectedDepartments,
//         [], // Don't need companies if we have departments
//         formData.selectedPositions
//       );
//     } else if (formData.selectedCompanies.length > 0) {
//       await fetchPositions(
//         formData.positionSearchTerm,
//         [],
//         formData.selectedCompanies,
//         formData.selectedPositions
//       );
//     } else {
//       // If no filters, show all positions
//       await fetchPositions(formData.positionSearchTerm, [], [], formData.selectedPositions);
//     }

//     // Refresh employees based on selected positions OR departments OR companies
//     if (formData.selectedPositions.length > 0) {
//       await fetchEmployees(
//         formData.employeeSearchTerm,
//         formData.selectedPositions,
//         [],
//         [],
//         formData.selectedEmployees
//       );
//     } else if (formData.selectedDepartments.length > 0) {
//       await fetchEmployees(
//         formData.employeeSearchTerm,
//         [],
//         formData.selectedDepartments,
//         [],
//         formData.selectedEmployees
//       );
//     } else if (formData.selectedCompanies.length > 0) {
//       await fetchEmployees(
//         formData.employeeSearchTerm,
//         [],
//         [],
//         formData.selectedCompanies,
//         formData.selectedEmployees
//       );
//     } else {
//       // If no filters, show all employees
//       await fetchEmployees(formData.employeeSearchTerm, [], [], [], formData.selectedEmployees);
//     }
//   }, [
//     formData.selectedCompanies,
//     formData.selectedDepartments,
//     formData.selectedPositions,
//     formData.selectedEmployees,
//     formData.companySearchTerm,
//     formData.departmentSearchTerm,
//     formData.positionSearchTerm,
//     formData.employeeSearchTerm
//   ]);

//   // FIXED: Proper filtered data functions for multiple selections
//   const getFilteredDepartments = useCallback((): Department[] => {
//     // If no companies selected, show all departments
//     if (formData.selectedCompanies.length === 0) {
//       return departments;
//     }
    
//     // Filter departments that belong to ANY of the selected companies
//     const filtered = departments.filter(dept => 
//       formData.selectedCompanies.includes(dept.company_id)
//     );
    
//     console.log('🏢 Department filtering:', {
//       selectedCompanies: formData.selectedCompanies,
//       totalDepartments: departments.length,
//       filteredDepartments: filtered.length
//     });
    
//     return filtered;
//   }, [departments, formData.selectedCompanies]);

//   const getFilteredPositions = useCallback((): Position[] => {
//     // If no departments selected, show positions from selected companies or all
//     if (formData.selectedDepartments.length === 0) {
//       if (formData.selectedCompanies.length > 0) {
//         // Show positions from selected companies
//         return positions.filter(pos => 
//           formData.selectedCompanies.some(companyId => 
//             pos.company_name.includes(companyId) // Adjust this based on your position data structure
//           )
//         );
//       }
//       return positions;
//     }
    
//     // Filter positions that belong to ANY of the selected departments
//     const filtered = positions.filter(pos => 
//       formData.selectedDepartments.includes(pos.department_id)
//     );
    
//     console.log('💼 Position filtering:', {
//       selectedDepartments: formData.selectedDepartments,
//       totalPositions: positions.length,
//       filteredPositions: filtered.length
//     });
    
//     return filtered;
//   }, [positions, formData.selectedDepartments, formData.selectedCompanies]);

//   const getFilteredEmployees = useCallback((): Employee[] => {
//     // If no positions selected, show employees from selected departments/companies or all
//     if (formData.selectedPositions.length === 0) {
//       if (formData.selectedDepartments.length > 0) {
//         // Show employees from selected departments
//         return employees.filter(emp => 
//           formData.selectedDepartments.includes(emp.department_id)
//         );
//       } else if (formData.selectedCompanies.length > 0) {
//         // Show employees from selected companies
//         return employees.filter(emp => 
//           formData.selectedCompanies.includes(emp.company_id)
//         );
//       }
//       return employees;
//     }
    
//     // Filter employees that belong to ANY of the selected positions
//     const filtered = employees.filter(emp => 
//       formData.selectedPositions.includes(emp.position_id)
//     );
    
//     console.log('👥 Employee filtering:', {
//       selectedPositions: formData.selectedPositions,
//       totalEmployees: employees.length,
//       filteredEmployees: filtered.length
//     });
    
//     return filtered;
//   }, [employees, formData.selectedPositions, formData.selectedDepartments, formData.selectedCompanies]);

//   // Get the current filtered data
//   const filteredDepartments = getFilteredDepartments();
//   const filteredPositions = getFilteredPositions();
//   const filteredEmployees = getFilteredEmployees();

//   // Refresh data when selections change
//   useEffect(() => {
//     refreshFilteredData();
//   }, [refreshFilteredData]);

//   // Initial load
//   useEffect(() => {
//     console.log('🚀 Initializing component...');
//     loadAllInitialData();
//   }, []);

//   // Auto-switch to departments tab when companies are selected and departments become available
//   useEffect(() => {
//     if (formData.selectedCompanies.length > 0 && filteredDepartments.length > 0) {
//       console.log('🚀 Auto-switching to departments tab:', {
//         selectedCompanies: formData.selectedCompanies.length,
//         filteredDepartmentsCount: filteredDepartments.length
//       });
      
//       setFormData((prev) => {
//         const updatedTargetRows = prev.targetRows.map((row, index) => {
//           if (index === 0 && row.activeTab === 'companies') {
//             console.log('🔄 Switching first target row to departments tab');
//             return {
//               ...row,
//               activeTab: 'departments' as 'companies' | 'departments' | 'positions' | 'employees',
//               parentType: 'companies' as '' | 'companies' | 'departments' | 'positions'
//             };
//           }
//           return row;
//         });
        
//         return {
//           ...prev,
//           targetRows: updatedTargetRows
//         };
//       });
//     }
//   }, [filteredDepartments.length, formData.selectedCompanies.length]);

//   // Enhanced debugging
//   useEffect(() => {
//     console.log('🔍 COMPREHENSIVE MULTI-SELECTION DEBUG:', {
//       selectedCompanies: formData.selectedCompanies,
//       selectedDepartments: formData.selectedDepartments,
//       selectedPositions: formData.selectedPositions,
//       selectedEmployees: formData.selectedEmployees,
//       companiesCount: companies.length,
//       departmentsCount: departments.length,
//       positionsCount: positions.length,
//       employeesCount: employees.length,
//       filteredDepartmentsCount: filteredDepartments.length,
//       filteredPositionsCount: filteredPositions.length,
//       filteredEmployeesCount: filteredEmployees.length
//     });
//   }, [
//     formData.selectedCompanies,
//     formData.selectedDepartments, 
//     formData.selectedPositions,
//     formData.selectedEmployees,
//     companies,
//     departments,
//     positions,
//     employees,
//     filteredDepartments,
//     filteredPositions,
//     filteredEmployees
//   ]);

//   const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };
  
//   const handleBooleanChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target;
//     setFormData((p) => ({ ...p, [name]: checked }));
//   };

//   const handleFilesSelected = (files: EmployeeDocument[]) => setFormData((p) => ({ ...p, attachments: files }));
  
//   const handleDocumentDeleted = (removed?: EmployeeDocument) => {
//     if (!removed) return;
//     setFormData((p) => ({
//       ...p,
//       attachments: p.attachments.filter(
//         (f) => !(f.name === removed.name && f.documentType === removed.documentType && f.file === removed.file)
//       ),
//     }));
//   };

//   // Manual debug function
//   const debugMultiSelection = () => {
//     console.group('🧪 MULTI-SELECTION DEBUG');
//     console.log('Selected Companies:', formData.selectedCompanies);
//     console.log('Selected Departments:', formData.selectedDepartments);
//     console.log('Selected Positions:', formData.selectedPositions);
//     console.log('Selected Employees:', formData.selectedEmployees);
//     console.log('All Companies:', companies);
//     console.log('All Departments:', departments);
//     console.log('All Positions:', positions);
//     console.log('All Employees:', employees);
//     console.log('Filtered Departments:', filteredDepartments);
//     console.log('Filtered Positions:', filteredPositions);
//     console.log('Filtered Employees:', filteredEmployees);
//     console.groupEnd();
//   };

//   // ---- Enhanced target row helpers with proper multiple selection support ----
//   const toggleTargetRowItem = async (rowId: string, itemId: string) => {
//     setFormData((prev) => {
//       const targetRow = prev.targetRows.find((r) => r.id === rowId);
//       if (!targetRow) return prev;

//       let updatedItems: string[] = [];

//       if (targetRow.activeTab === 'companies') {
//         updatedItems = targetRow.selectedCompanies.includes(itemId)
//           ? targetRow.selectedCompanies.filter((id) => id !== itemId)
//           : [...targetRow.selectedCompanies, itemId];
        
//         console.log('🏢 Company selection updated:', {
//           itemId,
//           previousSelection: targetRow.selectedCompanies,
//           newSelection: updatedItems
//         });
        
//       } else if (targetRow.activeTab === 'departments') {
//         updatedItems = targetRow.selectedDepartments.includes(itemId)
//           ? targetRow.selectedDepartments.filter((id) => id !== itemId)
//           : [...targetRow.selectedDepartments, itemId];
        
//       } else if (targetRow.activeTab === 'positions') {
//         updatedItems = targetRow.selectedPositions.includes(itemId)
//           ? targetRow.selectedPositions.filter((id) => id !== itemId)
//           : [...targetRow.selectedPositions, itemId];
        
//       } else {
//         updatedItems = targetRow.selectedEmployees.includes(itemId)
//           ? targetRow.selectedEmployees.filter((id) => id !== itemId)
//           : [...targetRow.selectedEmployees, itemId];
//       }

//       // Update the appropriate selection array
//       const selectedCompanies = targetRow.activeTab === 'companies' ? updatedItems : prev.selectedCompanies;
//       const selectedDepartments = targetRow.activeTab === 'departments' ? updatedItems : prev.selectedDepartments;
//       const selectedPositions = targetRow.activeTab === 'positions' ? updatedItems : prev.selectedPositions;
//       const selectedEmployees = targetRow.activeTab === 'employees' ? updatedItems : prev.selectedEmployees;

//       // Clear dependent selections when parent changes
//       let clearedDepartments = selectedDepartments;
//       let clearedPositions = selectedPositions;
//       let clearedEmployees = selectedEmployees;

//       if (targetRow.activeTab === 'companies') {
//         // When companies change, clear dependent selections
//         clearedDepartments = [];
//         clearedPositions = [];
//         clearedEmployees = [];
//         console.log('🔄 Cleared dependent selections due to company change');
//       } else if (targetRow.activeTab === 'departments') {
//         // When departments change, clear positions and employees
//         clearedPositions = [];
//         clearedEmployees = [];
//       } else if (targetRow.activeTab === 'positions') {
//         // When positions change, clear employees
//         clearedEmployees = [];
//       }

//       const updatedTargetRows = prev.targetRows.map((row) => {
//         if (row.id === rowId) {
//           const updatedRow = {
//             ...row,
//             selectedCompanies: targetRow.activeTab === 'companies' ? updatedItems : row.selectedCompanies,
//             selectedDepartments: targetRow.activeTab === 'departments' ? updatedItems : clearedDepartments,
//             selectedPositions: targetRow.activeTab === 'positions' ? updatedItems : clearedPositions,
//             selectedEmployees: targetRow.activeTab === 'employees' ? updatedItems : clearedEmployees,
//           };

//           return updatedRow;
//         }
//         return row;
//       });

//       const newFormData = {
//         ...prev,
//         selectedCompanies,
//         selectedDepartments: clearedDepartments,
//         selectedPositions: clearedPositions,
//         selectedEmployees: clearedEmployees,
//         targetRows: updatedTargetRows,
//       };

//       console.log('🎯 Updated form data after selection:', {
//         activeTab: targetRow.activeTab,
//         selectedCompanies: newFormData.selectedCompanies,
//         selectedDepartments: newFormData.selectedDepartments,
//         selectedPositions: newFormData.selectedPositions,
//         selectedEmployees: newFormData.selectedEmployees
//       });

//       return newFormData;
//     });

//     // Refresh data after selection changes
//     setTimeout(refreshFilteredData, 100);
//   };

//   const isAnyCompanySelected = () =>
//     formData.selectedCompanies.length > 0;

//   const isAnyDepartmentSelected = () =>
//     formData.selectedDepartments.length > 0;

//   const isAnyPositionSelected = () =>
//     formData.selectedPositions.length > 0;

//   const changeTargetRowTab = (
//     rowId: string,
//     newTab: 'companies' | 'departments' | 'positions' | 'employees',
//     parentType: '' | 'companies' | 'departments' | 'positions'
//   ) => {
//     // Enhanced validation for multiple selections
//     if (newTab === 'departments' && !isAnyCompanySelected()) {
//       console.warn('⚠️ Cannot switch to departments without selecting companies');
//       return;
//     }
//     if (newTab === 'positions' && !isAnyDepartmentSelected() && !isAnyCompanySelected()) {
//       console.warn('⚠️ Cannot switch to positions without selecting departments or companies');
//       return;
//     }
//     if (newTab === 'employees' && !isAnyPositionSelected() && !isAnyDepartmentSelected() && !isAnyCompanySelected()) {
//       console.warn('⚠️ Cannot switch to employees without selecting positions, departments, or companies');
//       return;
//     }

//     console.log(`🔄 Changing tab to ${newTab} for row ${rowId}`, {
//       selectedCompanies: formData.selectedCompanies.length,
//       selectedDepartments: formData.selectedDepartments.length,
//       selectedPositions: formData.selectedPositions.length
//     });

//     setFormData((prev) => ({
//       ...prev,
//       targetRows: prev.targetRows.map((row) => (row.id === rowId ? { ...row, activeTab: newTab, parentType } : row)),
//     }));
//   };

//   const renderLeaf = useCallback((props: any) => {
//     const leaf = props.leaf as CustomText;
//     return (
//       <span
//         {...props.attributes}
//         style={{
//           fontWeight: leaf.bold ? 'bold' : 'normal',
//           fontStyle: leaf.italic ? 'italic' : 'normal',
//           textDecoration: leaf.underline ? 'underline' : 'none',
//         }}
//       >
//         {props.children}
//       </span>
//     );
//   }, []);

//   const MainSubmitLabel = ({ scheduled }: { scheduled: boolean }) => {
//     if (loading) {
//       return (
//         <>
//           <span className="loading loading-spinner loading-sm mr-2" />
//           Saving...
//         </>
//       );
//     }
//     if (scheduled) {
//       return (
//         <>
//           <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           Schedule
//         </>
//       );
//     }
//     return (
//       <>
//         <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//         </svg>
//         Post
//       </>
//     );
//   };

//   // ---- Submit function ----
//   const doSubmit = async (postNow: boolean) => {
//     setLoading(true);
//     setError('');

//     const htmlContent = editorValue.map((n) => serialize(n)).join('');
//     const textForValidation = htmlContent.replace(/<[^>]*>/g, '').trim();

//     if (!formData.title.trim() || !textForValidation) {
//       setShowRequiredToast(true);
//       setLoading(false);
//       setTimeout(() => setShowRequiredToast(false), 3000);
//       setRequiredToastMsg(
//         formData.title.trim()
//           ? 'Content is required field. Please fill it in before submitting.'
//           : textForValidation
//           ? 'Title is required field. Please fill it in before submitting.'
//           : 'Title and Content are required fields. Please fill them in before submitting.'
//       );
//       return;
//     }

//     try {
//       const {
//         title,
//         requireAcknowledgement,
//         forceAcknowledgeLogin,
//         autoExpire,
//         targetRows,
//         scheduleEnabled,
//         scheduledAt,
//         attachments,
//       } = formData;

//       const payload: AnnouncementPayload = {
//         title,
//         content: htmlContent,
//         targets: [],
//         requireAcknowledgement,
//         forceAcknowledgeLogin,
//         autoExpire,
//         is_posted: scheduleEnabled ? false : postNow,
//         scheduled_at: scheduleEnabled && scheduledAt ? scheduledAt : null,
//       };

//       const hasTargets = targetRows.some(
//         (row) =>
//           row.selectedCompanies.length > 0 ||
//           row.selectedDepartments.length > 0 ||
//           row.selectedPositions.length > 0 ||
//           row.selectedEmployees.length > 0
//       );

//       if (!hasTargets) {
//         payload.target_type = 'all';
//         payload.target_id = 0;
//       } else {
//         targetRows.forEach((row) => {
//           const targetType =
//             row.selectedEmployees.length > 0
//               ? 'employee'
//               : row.selectedPositions.length > 0
//               ? 'position'
//               : row.selectedDepartments.length > 0
//               ? 'department'
//               : 'company';

//           const pushAll = (ids: string[]) => {
//             ids.forEach((id) => payload.targets.push({ target_type: targetType, target_id: id }));
//           };
//           if (row.selectedEmployees.length) pushAll(row.selectedEmployees);
//           else if (row.selectedPositions.length) pushAll(row.selectedPositions);
//           else if (row.selectedDepartments.length) pushAll(row.selectedDepartments);
//           else if (row.selectedCompanies.length) pushAll(row.selectedCompanies);
//         });
//       }

//       const formDataToSend = new FormData();
//       formDataToSend.append(
//         'data',
//         JSON.stringify({
//           ...payload,
//           is_acknowledgement: requireAcknowledgement,
//           is_force_login: forceAcknowledgeLogin,
//           is_expired: autoExpire,
//         })
//       );

//       if (attachments && attachments.length > 0) {
//         attachments.forEach((doc, index) => {
//           if (doc.file) {
//             formDataToSend.append(`attachments[${index}]`, doc.file);
//             formDataToSend.append(`attachments_metadata[${index}]`, JSON.stringify({
//               name: doc.name,
//               documentType: doc.documentType,
//               size: doc.file.size,
//               type: doc.file.type
//             }));
//           }
//         });
//       }

//       console.log('Sending form data with attachments:', attachments?.length || 0);

//       const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}`, {
//         method: 'POST',
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Server response:', errorText);
//         throw new Error(`Failed to create announcement: ${response.status} ${response.statusText}`);
//       }

//       const result = await response.json();
//       console.log('Announcement created successfully:', result);
      
//       router.push('/announcements');
//     } catch (err) {
//       console.error('Error creating announcement:', err);
//       setError(err instanceof Error ? err.message : 'Failed to create announcement. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     doSubmit(false);
//   };

//   return (
//     <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
//       <div className="flex flex-col sm:flex-row justify-between mb-6">
//         <nav className="text-sm breadcrumbs">
//           <ul>
//             <li><Link href="/" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Dashboard</Link></li>
//             <li><Link href="/announcements" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Announcements</Link></li>
//             <li className="font-semibold">Create Announcement</li>
//           </ul>
//         </nav>
//         <div className="flex justify-end">
//           <Link href="/announcements" className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
//             <FaArrowLeft className="mr-2" /> Back
//           </Link>
//         </div>
//       </div>

//       <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Create New Announcement</h1>

//       {error ? (
//         <div className={`alert mb-6 ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
//           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <span>{error}</span>
//         </div>
//       ) : null}

//       {/* Enhanced debug section */}
//       <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
//         <h3 className="font-bold mb-2">Enhanced Multi-Selection Filtering System</h3>
//         <div className="flex flex-wrap gap-2">
//           <button 
//             onClick={() => loadAllInitialData()}
//             className="btn btn-sm btn-warning"
//             disabled={isLoadingData}
//           >
//             {isLoadingData ? 'Loading...' : 'Refresh All Data'}
//           </button>
//           <button 
//             onClick={() => fetchCompanies(formData.companySearchTerm, formData.selectedCompanies)}
//             className="btn btn-sm btn-info"
//           >
//             Refresh Companies
//           </button>
//           <button 
//             onClick={() => fetchDepartments(
//               formData.departmentSearchTerm,
//               formData.selectedCompanies,
//               formData.selectedDepartments
//             )}
//             className="btn btn-sm btn-success"
//           >
//             Refresh Departments
//           </button>
//           <button 
//             onClick={debugMultiSelection}
//             className="btn btn-sm btn-error"
//           >
//             Debug Multi-Selection
//           </button>
//           <div className="text-sm">
//             {isLoadingData ? '🔄 Loading data...' : '✅ Data loaded'} | 
//             Companies: {companies.length} | 
//             Departments: {filteredDepartments.length} | 
//             Positions: {filteredPositions.length} | 
//             Employees: {filteredEmployees.length}
//           </div>
//         </div>
//         <div className="mt-2 text-sm">
//           <strong>Active Multi-Selections:</strong> 
//           Companies: {formData.selectedCompanies.length} | 
//           Departments: {formData.selectedDepartments.length} | 
//           Positions: {formData.selectedPositions.length} | 
//           Employees: {formData.selectedEmployees.length}
//         </div>
//         <div className="mt-1 text-xs text-green-700">
//           ✅ <strong>Multiple Selection Supported:</strong> Departments now show for ALL selected companies
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//         <div className="tabs tabs-bordered mb-6">
//           <a className={`tab tab-bordered ${activeTab === 'details' ? 'tab-active' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`} onClick={() => handleTabChange('details')}>Announcement Details</a>
//           <a className={`tab tab-bordered ${activeTab === 'recipients' ? 'tab-active' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`} onClick={() => handleTabChange('recipients')}>Recipients</a>
//         </div>

//         <div className={`${activeTab === 'details' ? 'block' : 'hidden'}`}>
//           <div className="mb-8">
//             <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Announcement Details</h2>

//             <div className="grid grid-cols-1 gap-6 mb-6">
//               <div>
//                 <div className={`mb-2 font-medium flex items-center gap-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Title <span className="text-red-500">*</span></div>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleTextChange}
//                   className={`input w-full border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
//                   required
//                   placeholder="Enter announcement title"
//                 />
//               </div>

//               <div>
//                 <div className={`mb-2 font-medium flex items-center gap-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Content <span className="text-red-500">*</span></div>
//                 <div
//                   className={`rounded-lg border ${
//                     theme === 'light'
//                       ? 'bg-white border-slate-300 focus-within:ring-2 focus-within:ring-blue-500'
//                       : 'bg-slate-700 border-slate-600 focus-within:ring-2 focus-within:ring-blue-400'
//                   }`}
//                 >
//                   <Slate
//                     editor={editor}
//                     initialValue={editorValue}
//                     onChange={(v) => setEditorValue(v)}
//                   >
//                     <div
//                       className={`flex items-center gap-2 p-2 border-b ${
//                         theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700'
//                       }`}
//                     >
//                       <MarkButton format="bold" icon={<FaBold />} theme={theme} />
//                       <MarkButton format="italic" icon={<FaItalic />} theme={theme} />
//                       <MarkButton format="underline" icon={<FaUnderline />} theme={theme} />
//                     </div>

//                     <div className="p-3">
//                       <Editable
//                         renderLeaf={renderLeaf}
//                         placeholder="Enter announcement content..."
//                         spellCheck
//                         className={`min-h-40 w-full border-0 outline-none focus:outline-none ring-0 focus:ring-0 ${
//                           theme === 'light' ? 'text-slate-900' : 'text-slate-100'
//                         }`}
//                         onKeyDown={(e) => {
//                           const k = e.key.toLowerCase();
//                           if ((e.metaKey || e.ctrlKey) && k === 'b') { e.preventDefault(); CustomEditor.toggleBoldMark(editor); }
//                           if ((e.metaKey || e.ctrlKey) && k === 'i') { e.preventDefault(); CustomEditor.toggleItalicMark(editor); }
//                           if ((e.metaKey || e.ctrlKey) && k === 'u') { e.preventDefault(); CustomEditor.toggleUnderlineMark(editor); }
//                         }}
//                       />
//                     </div>
//                   </Slate>
//                 </div>
//               </div>

//               {/* Attachments */}
//               <div className="mt-4">
//                 <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Attachments</div>
//                 <EmployeeDocumentManager
//                   employeeId={null}
//                   mode="add"
//                   documentTypes={[{ type: 'AnnouncementAttachment', label: 'Announcement Attachments', description: 'Upload files to be included with this announcement (PDF, Word, Excel, images, etc.)' }]}
//                   onFilesSelected={handleFilesSelected}
//                   moduleName="announcement"
//                   customUploadEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents/upload-request`}
//                   customDeleteEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents`}
//                   customViewEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents/view-url`}
//                   initialDocuments={formData.attachments || []}
//                   onDocumentDeleted={handleDocumentDeleted}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 flex justify-between">
//             <div />
//             <button
//               type="button"
//               className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
//               onClick={() => handleTabChange('recipients')}
//             >
//               Next: Select Recipients
//             </button>
//           </div>
//         </div>

//         {/* Recipients */}
//         <div className={`${activeTab === 'recipients' ? 'block' : 'hidden'}`}>
//           <div className="mb-8">
//             <div className="flex items-center mb-4">
//               <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Recipients</h2>
//               <div className={`badge ml-3 ${theme === 'light' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-blue-900 text-blue-200 border-blue-700'} border`}>Optional</div>
//             </div>

//             <div className={`alert mb-6 ${theme === 'light' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-blue-900 border-blue-700 text-blue-200'} border rounded-lg`}>
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//               </svg>
//               <span>If no target rows are added, the announcement will be sent to all parties.</span>
//             </div>

//             <div className="space-y-4 mb-6">
//               {formData.targetRows.map((row, index) => (
//                 <TargetRowCard
//                   key={row.id}
//                   row={row}
//                   index={index}
//                   companies={companies}
//                   departments={filteredDepartments}
//                   positions={filteredPositions}
//                   employees={filteredEmployees}
//                   companySearchTerm={formData.companySearchTerm}
//                   departmentSearchTerm={formData.departmentSearchTerm}
//                   positionSearchTerm={formData.positionSearchTerm}
//                   employeeSearchTerm={formData.employeeSearchTerm}
//                   targetRows={formData.targetRows}
//                   onChangeTab={changeTargetRowTab}
//                   onToggleItem={toggleTargetRowItem}
//                   onSearchChange={handleSearchChange}
//                   isAnyCompanySelected={isAnyCompanySelected}
//                   isAnyDepartmentSelected={isAnyDepartmentSelected}
//                   isAnyPositionSelected={isAnyPositionSelected}
//                 />
//               ))}
//             </div>

//             {/* Acknowledgement */}
//             <div className={`mb-8 p-4 rounded-lg mt-4 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
//               <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Acknowledgement Options</h3>

//               <div className="space-y-4">
//                 <div className="form-control">
//                   <label className="label cursor-pointer justify-start gap-3">
//                     <input type="checkbox" className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`} name="requireAcknowledgement" checked={formData.requireAcknowledgement} onChange={handleBooleanChange} />
//                     <div>
//                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Require Acknowledgement</span>
//                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients will need to acknowledge they have read this announcement</p>
//                     </div>
//                   </label>
//                 </div>

//                 <div className="form-control">
//                   <label className="label cursor-pointer justify-start gap-3">
//                     <input type="checkbox" className={`toggle ${theme === 'light' ? 'toggle-primary' : 'toggle-accent'}`} name="forceAcknowledgeLogin" checked={formData.forceAcknowledgeLogin} onChange={handleBooleanChange} disabled={!formData.requireAcknowledgement} />
//                     <div>
//                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Force Acknowledgement on Login</span>
//                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients will be required to acknowledge this announcement before they can proceed</p>
//                     </div>
//                   </label>
//                 </div>

//                 <div className="form-control">
//                   <label className="label cursor-pointer justify-start gap-3">
//                     <input type="checkbox" className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`} name="autoExpire" checked={formData.autoExpire} onChange={handleBooleanChange} disabled={!formData.requireAcknowledgement} />
//                     <div>
//                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Auto-Expire After 7 Days</span>
//                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Announcement will be automatically deleted 7 days after all targeted employees have read it</p>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* Schedule */}
//             <div className={`mb-8 p-4 rounded-lg mt-4 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
//               <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule Options</h3>
//               <div className="space-y-4">
//                 <div className="form-control">
//                   <label className="label cursor-pointer justify-start gap-3">
//                     <input type="checkbox" className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`} name="scheduleEnabled" checked={formData.scheduleEnabled} onChange={handleBooleanChange} />
//                     <div>
//                       <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule this announcement</span>
//                       <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>This announcement will be published automatically at the specified date and time</p>
//                     </div>
//                   </label>
//                 </div>

//                 {formData.scheduleEnabled ? (
//                   <div className="form-control">
//                     <label className="label"><span className={`label-text font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Publication Date and Time</span></label>
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="datetime-local"
//                         className={`input border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-600 border-slate-500 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
//                         name="scheduledAt"
//                         value={formData.scheduledAt}
//                         onChange={(e) => setFormData((p) => ({ ...p, scheduledAt: e.target.value }))}
//                         min={new Date().toISOString().slice(0, 16)}
//                         required={formData.scheduleEnabled}
//                       />
//                     </div>
//                     <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Select the date and time when this announcement should be published</p>
//                   </div>
//                 ) : null}
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 flex justify-between">
//             <button
//               type="button"
//               className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
//               onClick={() => handleTabChange('details')}
//             >
//               Back to Details
//             </button>
//             <div />
//           </div>
//         </div>

//         {/* Submit buttons (recipients tab) */}
//         <div className={`mt-8 pt-4 border-t flex justify-end ${activeTab === 'recipients' ? 'block' : 'hidden'} ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
//           <Link href="/announcements" className={`btn btn-outline mr-3 ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>Cancel</Link>

//           {!formData.scheduleEnabled ? (
//             <button
//               type="button"
//               className={`btn mr-3 ${theme === 'light' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-amber-400 hover:bg-amber-500'} text-white border-0`}
//               disabled={loading}
//               onClick={() => { doSubmit(false); }}
//             >
//               {loading ? (
//                 <>
//                   <span className="loading loading-spinner loading-sm mr-2" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <FaSave className="mr-2" /> Save Draft
//                 </>
//               )}
//             </button>
//           ) : null}

//           <button
//             type="button"
//             className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
//             disabled={loading || (formData.scheduleEnabled && !formData.scheduledAt)}
//             onClick={() => { doSubmit(!formData.scheduleEnabled); }}
//           >
//             <MainSubmitLabel scheduled={formData.scheduleEnabled} />
//           </button>
//         </div>
//       </form>

//       {/* Toast */}
//       <div className="toast toast-center toast-middle z-50">
//         {showRequiredToast ? (
//           <div className={`alert shadow-lg ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
//             <span>{requiredToastMsg}</span>
//           </div>
//         ) : null}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect, ChangeEvent, FormEvent, useCallback, useMemo, JSX } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaSave, FaArrowLeft, FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import {
  createEditor,
  Descendant,
  Editor,
  Transforms,
  Element as SlateElement,
  BaseEditor,
} from 'slate';
import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react';
import { withHistory, HistoryEditor } from 'slate-history';
import { API_BASE_URL, API_ROUTES } from '../../config';
import TargetRowCard, { TargetRow } from './card';
import EmployeeDocumentManager, { EmployeeDocument } from '../../components/EmployeeDocumentManager';
import { useTheme } from '../../components/ThemeProvider';
import { filterApi, FilterOptions } from '../../utils/filterApi';

// --------- Slate typings ----------
type CustomText = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  text: string;
};
type ParagraphElement = { type: 'paragraph'; children: CustomText[] };
type CustomElement = ParagraphElement;

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// --------- API models ----------
interface Company { 
  id: string; 
  name: string; 
  is_active?: boolean;
}

interface Department { 
  id: string; 
  department_name: string; 
  company_id: string;    
  company_name: string;  
  company_ids?: string;    
  company_names?: string;  
}

interface Position { 
  id: string; 
  title: string; 
  department_id: string; 
  company_name: string; 
  department_name: string;
  job_level?: string;
}

interface Employee {
  id: string; 
  name: string; 
  position_id: string; 
  department_id: string; 
  company_id: string;
  company_name: string; 
  department_name: string; 
  position_title: string; 
  job_level: string;
  employee_no?: string;
  email?: string;
}

interface FormDataType {
  title: string;
  content: string;
  companySearchTerm: string; 
  departmentSearchTerm: string; 
  positionSearchTerm: string; 
  employeeSearchTerm: string;
  requireAcknowledgement: boolean; 
  forceAcknowledgeLogin: boolean; 
  autoExpire: boolean;
  targetRows: TargetRow[]; 
  scheduleEnabled: boolean; 
  scheduledAt: string; 
  attachments: EmployeeDocument[];
}

interface AnnouncementPayload {
  title: string;
  content: string;
  targets: { target_type: string; target_id: string }[];
  target_type?: string;
  target_id?: number;
  requireAcknowledgement: boolean;
  forceAcknowledgeLogin: boolean;
  autoExpire: boolean;
  is_posted: boolean;
  scheduled_at?: string | null;
}

// --------- Mark helpers ----------
const CustomEditor = {
  isBoldMarkActive(editor: Editor) {
    const marks = Editor.marks(editor);
    return marks ? (marks as CustomText).bold === true : false;
  },
  isItalicMarkActive(editor: Editor) {
    const marks = Editor.marks(editor);
    return marks ? (marks as CustomText).italic === true : false;
  },
  isUnderlineMarkActive(editor: Editor) {
    const marks = Editor.marks(editor);
    return marks ? (marks as CustomText).underline === true : false;
  },
  toggleBoldMark(editor: Editor) {
    if (CustomEditor.isBoldMarkActive(editor)) {
      Editor.removeMark(editor, 'bold');
    } else {
      Editor.addMark(editor, 'bold', true);
    }
  },
  toggleItalicMark(editor: Editor) {
    if (CustomEditor.isItalicMarkActive(editor)) {
      Editor.removeMark(editor, 'italic');
    } else {
      Editor.addMark(editor, 'italic', true);
    }
  },
  toggleUnderlineMark(editor: Editor) {
    if (CustomEditor.isUnderlineMarkActive(editor)) {
      Editor.removeMark(editor, 'underline');
    } else {
      Editor.addMark(editor, 'underline', true);
    }
  },
};

// --------- Initial value ----------
const initialValue: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }];

// --------- Toolbar Button ----------
const MarkButton = ({
  format,
  icon,
  theme,
}: {
  format: 'bold' | 'italic' | 'underline';
  icon: JSX.Element;
  theme: string;
}) => {
  const editor = useSlate();
  const isActive =
    format === 'bold'
      ? CustomEditor.isBoldMarkActive(editor)
      : format === 'italic'
      ? CustomEditor.isItalicMarkActive(editor)
      : CustomEditor.isUnderlineMarkActive(editor);

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onMouseDown={(e) => {
        e.preventDefault();
        ReactEditor.focus(editor);
        if (!editor.selection) {
          try { Transforms.select(editor, Editor.end(editor, [])); } catch { /* no-op */ }
        }
        if (format === 'bold') CustomEditor.toggleBoldMark(editor);
        else if (format === 'italic') CustomEditor.toggleItalicMark(editor);
        else CustomEditor.toggleUnderlineMark(editor);
      }}
      className={[
        'px-2 py-1 rounded-md text-sm font-semibold border transition-colors',
        isActive
          ? theme === 'light'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-blue-500 text-white border-blue-500'
          : theme === 'light'
          ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600',
      ].join(' ')}
    >
      {icon}
    </button>
  );
};

// --------- Serialize to HTML ----------
const serialize = (node: Descendant): string => {
  if (SlateElement.isElement(node)) {
    const el = node as ParagraphElement;
    const children = el.children.map((n) => serialize(n)).join('');
    if (el.type === 'paragraph') return `<p>${children}</p>`;
    return children;
  }
  const t = node as CustomText;
  let str = t.text;
  if (t.bold) str = `<strong>${str}</strong>`;
  if (t.italic) str = `<em>${str}</em>`;
  if (t.underline) str = `<u>${str}</u>`;
  return str;
};

export default function CreateAnnouncementPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'recipients'>('details');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showRequiredToast, setShowRequiredToast] = useState(false);
  const [requiredToastMsg, setRequiredToastMsg] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userId, setUserId] = useState<number>(0);
  const [hasAutoSwitched, setHasAutoSwitched] = useState(false);

  // Initialize userId from localStorage
  useEffect(() => {
    const user = localStorage.getItem('hrms_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData && userData.id) setUserId(userData.id);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  // Slate editor + value
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [editorValue, setEditorValue] = useState<Descendant[]>(initialValue);

  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    content: '',
    companySearchTerm: '',
    departmentSearchTerm: '',
    positionSearchTerm: '',
    employeeSearchTerm: '',
    requireAcknowledgement: false,
    forceAcknowledgeLogin: false,
    autoExpire: false,
    scheduleEnabled: false,
    scheduledAt: '',
    attachments: [],
    targetRows: [
      {
        id: Math.random().toString(36).slice(2, 11),
        type: 'companies',
        selectedCompanies: [],
        selectedDepartments: [],
        selectedPositions: [],
        selectedEmployees: [],
        isOpen: true,
        activeTab: 'companies',
        parentType: '',
        selectedAll: false,
      },
    ],
  });

  // Helper to get current selections from targetRows
  const getSelectedCompanies = useCallback(() => {
    return formData.targetRows.flatMap(row => row.selectedCompanies);
  }, [formData.targetRows]);

  const getSelectedDepartments = useCallback(() => {
    return formData.targetRows.flatMap(row => row.selectedDepartments);
  }, [formData.targetRows]);

  const getSelectedPositions = useCallback(() => {
    return formData.targetRows.flatMap(row => row.selectedPositions);
  }, [formData.targetRows]);

  const getSelectedEmployees = useCallback(() => {
    return formData.targetRows.flatMap(row => row.selectedEmployees);
  }, [formData.targetRows]);

  const handleTabChange = (tab: 'details' | 'recipients') => setActiveTab(tab);

  // Fetch functions with proper multiple selection support
  const fetchCompanies = async (searchTerm: string = '') => {
    try {
      const filters: FilterOptions = {};
      if (searchTerm) filters.search = searchTerm;
      filters.limit = 100;
      
      const result = await filterApi.getCompanies(filters);
      if (result.success) {
        setCompanies(result.data);
        console.log('✅ Companies loaded:', result.data.length);
      }
    } catch (e) { 
      console.error('Error fetching companies:', e); 
    }
  };

  const fetchDepartments = async (searchTerm: string = '', companyIds: string[] = []) => {
    try {
      const filters: FilterOptions = {};
      if (searchTerm) filters.search = searchTerm;
      if (companyIds.length > 0) filters.company_ids = companyIds;
      filters.limit = 200;
      
      console.log('🔍 Fetching departments for companies:', companyIds);
      
      const result = await filterApi.getDepartments(filters);
      if (result.success) {
        setDepartments(result.data);
        console.log('✅ Departments loaded:', result.data.length);
      }
    } catch (e) { 
      console.error('Error fetching departments:', e); 
    }
  };

  const fetchPositions = async (searchTerm: string = '', departmentIds: string[] = [], companyIds: string[] = []) => {
    try {
      const filters: FilterOptions = {};
      if (searchTerm) filters.search = searchTerm;
      if (departmentIds.length > 0) {
        filters.department_ids = departmentIds;
        console.log('🎯 Fetching positions for departments:', departmentIds);
      } else if (companyIds.length > 0) {
        filters.company_ids = companyIds;
        console.log('🎯 Fetching positions for companies:', companyIds);
      }
      filters.limit = 200;
      
      const result = await filterApi.getPositions(filters);
      if (result.success) {
        setPositions(result.data);
        console.log('✅ Positions loaded:', result.data.length);
      }
    } catch (e) { 
      console.error('Error fetching positions:', e); 
    }
  };

  const fetchEmployees = async (searchTerm: string = '', positionIds: string[] = [], departmentIds: string[] = [], companyIds: string[] = []) => {
    try {
      const filters: FilterOptions = { status: 'Active' };
      if (searchTerm) filters.search = searchTerm;
      if (positionIds.length > 0) {
        filters.position_ids = positionIds;
        console.log('👥 Fetching employees for positions:', positionIds);
      } else if (departmentIds.length > 0) {
        filters.department_ids = departmentIds;
        console.log('👥 Fetching employees for departments:', departmentIds);
      } else if (companyIds.length > 0) {
        filters.company_ids = companyIds;
        console.log('👥 Fetching employees for companies:', companyIds);
      }
      filters.limit = 200;
      
      const result = await filterApi.getEmployees(filters);
      if (result.success) {
        setEmployees(result.data);
        console.log('✅ Employees loaded:', result.data.length);
      }
    } catch (e) { 
      console.error('Error fetching employees:', e); 
    }
  };

  // Load initial data
  const loadAllInitialData = async () => {
    setIsLoadingData(true);
    try {
      await Promise.all([
        fetchCompanies(),
        fetchDepartments(),
        fetchPositions(),
        fetchEmployees()
      ]);
      console.log('🚀 All initial data loaded');
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Search handlers
  const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>, type: 'company' | 'department' | 'position' | 'employee') => {
    const searchTerm = e.target.value;
    const field = `${type}SearchTerm` as
      | 'companySearchTerm'
      | 'departmentSearchTerm'
      | 'positionSearchTerm'
      | 'employeeSearchTerm';
    
    setFormData((p) => ({ ...p, [field]: searchTerm }));

    // Debounced search
    setTimeout(() => {
      switch (type) {
        case 'company':
          fetchCompanies(searchTerm);
          break;
        case 'department':
          fetchDepartments(searchTerm, getSelectedCompanies());
          break;
        case 'position':
          fetchPositions(searchTerm, getSelectedDepartments(), getSelectedCompanies());
          break;
        case 'employee':
          fetchEmployees(searchTerm, getSelectedPositions(), getSelectedDepartments(), getSelectedCompanies());
          break;
      }
    }, 300);
  };

  // Refresh data when selections change
  const refreshFilteredData = useCallback(async () => {
    const selectedCompanies = getSelectedCompanies();
    const selectedDepartments = getSelectedDepartments();
    const selectedPositions = getSelectedPositions();

    console.log('🔄 Refreshing filtered data with selections:', {
      companies: selectedCompanies,
      departments: selectedDepartments,
      positions: selectedPositions,
    });

    // Always refresh companies
    await fetchCompanies(formData.companySearchTerm);
    
    // Refresh departments based on selected companies
    if (selectedCompanies.length > 0) {
      await fetchDepartments(formData.departmentSearchTerm, selectedCompanies);
    } else {
      await fetchDepartments(formData.departmentSearchTerm, []);
    }

    // Refresh positions based on selected departments OR companies
    if (selectedDepartments.length > 0) {
      await fetchPositions(formData.positionSearchTerm, selectedDepartments, []);
    } else if (selectedCompanies.length > 0) {
      await fetchPositions(formData.positionSearchTerm, [], selectedCompanies);
    } else {
      await fetchPositions(formData.positionSearchTerm, [], []);
    }

    // Refresh employees based on selected positions OR departments OR companies
    if (selectedPositions.length > 0) {
      await fetchEmployees(formData.employeeSearchTerm, selectedPositions, [], []);
    } else if (selectedDepartments.length > 0) {
      await fetchEmployees(formData.employeeSearchTerm, [], selectedDepartments, []);
    } else if (selectedCompanies.length > 0) {
      await fetchEmployees(formData.employeeSearchTerm, [], [], selectedCompanies);
    } else {
      await fetchEmployees(formData.employeeSearchTerm, [], [], []);
    }
  }, [
    formData.companySearchTerm,
    formData.departmentSearchTerm,
    formData.positionSearchTerm,
    formData.employeeSearchTerm,
    getSelectedCompanies,
    getSelectedDepartments,
    getSelectedPositions,
  ]);

  // Get filtered data for display
  const getFilteredDepartments = useCallback((): Department[] => {
    const selectedCompanies = getSelectedCompanies();
    
    // If no companies selected, show all departments
    if (selectedCompanies.length === 0) {
      return departments;
    }
    
    // Filter departments that belong to ANY of the selected companies
    const filtered = departments.filter(dept => 
      selectedCompanies.includes(dept.company_id)
    );
    
    console.log('🏢 Department filtering:', {
      selectedCompanies,
      totalDepartments: departments.length,
      filteredDepartments: filtered.length
    });
    
    return filtered;
  }, [departments, getSelectedCompanies]);

  const getFilteredPositions = useCallback((): Position[] => {
    const selectedDepartments = getSelectedDepartments();
    const selectedCompanies = getSelectedCompanies();
    
    // If no departments selected, show positions from selected companies or all
    if (selectedDepartments.length === 0) {
      if (selectedCompanies.length > 0) {
        // Filter positions by company name (adjust if you have company_id in positions)
        return positions.filter(pos => 
          selectedCompanies.some(companyId => 
            // Assuming positions have company_name that matches company id
            // You might need to adjust this based on your data structure
            companies.find(c => c.id === companyId)?.name === pos.company_name
          )
        );
      }
      return positions;
    }
    
    // Filter positions that belong to ANY of the selected departments
    return positions.filter(pos => 
      selectedDepartments.includes(pos.department_id)
    );
  }, [positions, getSelectedDepartments, getSelectedCompanies, companies]);

  const getFilteredEmployees = useCallback((): Employee[] => {
    const selectedPositions = getSelectedPositions();
    const selectedDepartments = getSelectedDepartments();
    const selectedCompanies = getSelectedCompanies();
    
    // If no positions selected, show employees from selected departments/companies or all
    if (selectedPositions.length === 0) {
      if (selectedDepartments.length > 0) {
        return employees.filter(emp => 
          selectedDepartments.includes(emp.department_id)
        );
      } else if (selectedCompanies.length > 0) {
        return employees.filter(emp => 
          selectedCompanies.includes(emp.company_id)
        );
      }
      return employees;
    }
    
    // Filter employees that belong to ANY of the selected positions
    return employees.filter(emp => 
      selectedPositions.includes(emp.position_id)
    );
  }, [employees, getSelectedPositions, getSelectedDepartments, getSelectedCompanies]);

  // Get filtered data
  const filteredDepartments = getFilteredDepartments();
  const filteredPositions = getFilteredPositions();
  const filteredEmployees = getFilteredEmployees();

  // Check if any selections exist
  const isAnyCompanySelected = useCallback(() => 
    getSelectedCompanies().length > 0, [getSelectedCompanies]
  );

  const isAnyDepartmentSelected = useCallback(() => 
    getSelectedDepartments().length > 0, [getSelectedDepartments]
  );

  const isAnyPositionSelected = useCallback(() => 
    getSelectedPositions().length > 0, [getSelectedPositions]
  );

  // Initial load
  useEffect(() => {
    console.log('🚀 Initializing component...');
    loadAllInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-switch to departments tab when companies are selected
  useEffect(() => {
    const selectedCompanies = getSelectedCompanies();
    const currentRow = formData.targetRows[0];
    
    // Only auto-switch if:
    // 1. We haven't auto-switched before
    // 2. Companies are selected
    // 3. Departments are available
    // 4. Current tab is companies
    // 5. There are filtered departments to show
    if (
      !hasAutoSwitched &&
      selectedCompanies.length > 0 &&
      filteredDepartments.length > 0 &&
      currentRow.activeTab === 'companies'
    ) {
      console.log('🚀 Auto-switching to departments tab');
      
      setFormData((prev) => {
        const updatedTargetRows = prev.targetRows.map((row, index) => {
          if (index === 0) {
            return {
              ...row,
              activeTab: 'departments' as 'companies' | 'departments' | 'positions' | 'employees',
              parentType: 'companies' as '' | 'companies' | 'departments' | 'positions'
            };
          }
          return row;
        });
        
        return {
          ...prev,
          targetRows: updatedTargetRows
        };
      });
      
      // Mark that we've auto-switched
      setHasAutoSwitched(true);
    }
    
    // Reset auto-switch flag when no companies are selected
    if (selectedCompanies.length === 0 && hasAutoSwitched) {
      setHasAutoSwitched(false);
    }
  }, [filteredDepartments.length, formData.targetRows, getSelectedCompanies, hasAutoSwitched]);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };
  
  const handleBooleanChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: checked }));
  };

  const handleFilesSelected = (files: EmployeeDocument[]) => setFormData((p) => ({ ...p, attachments: files }));
  
  const handleDocumentDeleted = (removed?: EmployeeDocument) => {
    if (!removed) return;
    setFormData((p) => ({
      ...p,
      attachments: p.attachments.filter(
        (f) => !(f.name === removed.name && f.documentType === removed.documentType && f.file === removed.file)
      ),
    }));
  };

  // Enhanced toggle target row item
  const toggleTargetRowItem = async (rowId: string, itemId: string) => {
    setFormData((prev) => {
      const targetRow = prev.targetRows.find((r) => r.id === rowId);
      if (!targetRow) return prev;

      let updatedRow = { ...targetRow };
      const selectedCompanies = [...targetRow.selectedCompanies];
      const selectedDepartments = [...targetRow.selectedDepartments];
      const selectedPositions = [...targetRow.selectedPositions];
      const selectedEmployees = [...targetRow.selectedEmployees];

      // Update the appropriate array based on active tab
      if (targetRow.activeTab === 'companies') {
        const newSelection = selectedCompanies.includes(itemId)
          ? selectedCompanies.filter((id) => id !== itemId)
          : [...selectedCompanies, itemId];
        
        updatedRow.selectedCompanies = newSelection;
        
        // Clear dependent selections when companies change
        updatedRow.selectedDepartments = [];
        updatedRow.selectedPositions = [];
        updatedRow.selectedEmployees = [];
        
        console.log('🏢 Company selection updated:', newSelection);
        
      } else if (targetRow.activeTab === 'departments') {
        const newSelection = selectedDepartments.includes(itemId)
          ? selectedDepartments.filter((id) => id !== itemId)
          : [...selectedDepartments, itemId];
        
        updatedRow.selectedDepartments = newSelection;
        
        // Clear dependent selections when departments change
        updatedRow.selectedPositions = [];
        updatedRow.selectedEmployees = [];
        
      } else if (targetRow.activeTab === 'positions') {
        const newSelection = selectedPositions.includes(itemId)
          ? selectedPositions.filter((id) => id !== itemId)
          : [...selectedPositions, itemId];
        
        updatedRow.selectedPositions = newSelection;
        
        // Clear dependent selections when positions change
        updatedRow.selectedEmployees = [];
        
      } else {
        const newSelection = selectedEmployees.includes(itemId)
          ? selectedEmployees.filter((id) => id !== itemId)
          : [...selectedEmployees, itemId];
        
        updatedRow.selectedEmployees = newSelection;
      }

      // Update the target row
      const updatedTargetRows = prev.targetRows.map((row) => 
        row.id === rowId ? updatedRow : row
      );

      const newFormData = {
        ...prev,
        targetRows: updatedTargetRows,
      };

      console.log('🎯 Updated form data after selection:', {
        activeTab: targetRow.activeTab,
        companies: updatedRow.selectedCompanies,
        departments: updatedRow.selectedDepartments,
        positions: updatedRow.selectedPositions,
        employees: updatedRow.selectedEmployees
      });

      return newFormData;
    });

    // Refresh data after selection changes
    setTimeout(() => refreshFilteredData(), 100);
  };

  const changeTargetRowTab = (
    rowId: string,
    newTab: 'companies' | 'departments' | 'positions' | 'employees',
    parentType: '' | 'companies' | 'departments' | 'positions'
  ) => {
    // Enhanced validation
    if (newTab === 'departments' && !isAnyCompanySelected()) {
      console.warn('⚠️ Cannot switch to departments without selecting companies');
      return;
    }
    if (newTab === 'positions' && !isAnyDepartmentSelected() && !isAnyCompanySelected()) {
      console.warn('⚠️ Cannot switch to positions without selecting departments or companies');
      return;
    }
    if (newTab === 'employees' && !isAnyPositionSelected() && !isAnyDepartmentSelected() && !isAnyCompanySelected()) {
      console.warn('⚠️ Cannot switch to employees without selecting positions, departments, or companies');
      return;
    }

    console.log(`🔄 Changing tab to ${newTab} for row ${rowId}`);

    setFormData((prev) => ({
      ...prev,
      targetRows: prev.targetRows.map((row) => 
        row.id === rowId ? { ...row, activeTab: newTab, parentType } : row
      ),
    }));
    
    // Reset auto-switch flag when user manually changes tabs
    if (newTab === 'departments') {
      setHasAutoSwitched(true);
    }
  };

  const renderLeaf = useCallback((props: any) => {
    const leaf = props.leaf as CustomText;
    return (
      <span
        {...props.attributes}
        style={{
          fontWeight: leaf.bold ? 'bold' : 'normal',
          fontStyle: leaf.italic ? 'italic' : 'normal',
          textDecoration: leaf.underline ? 'underline' : 'none',
        }}
      >
        {props.children}
      </span>
    );
  }, []);

  const MainSubmitLabel = ({ scheduled }: { scheduled: boolean }) => {
    if (loading) {
      return (
        <>
          <span className="loading loading-spinner loading-sm mr-2" />
          Saving...
        </>
      );
    }
    if (scheduled) {
      return (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Schedule
        </>
      );
    }
    return (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Post
      </>
    );
  };

  // ---- Submit function ----
  const doSubmit = async (postNow: boolean) => {
    setLoading(true);
    setError('');

    const htmlContent = editorValue.map((n) => serialize(n)).join('');
    const textForValidation = htmlContent.replace(/<[^>]*>/g, '').trim();

    if (!formData.title.trim() || !textForValidation) {
      setShowRequiredToast(true);
      setLoading(false);
      setTimeout(() => setShowRequiredToast(false), 3000);
      setRequiredToastMsg(
        formData.title.trim()
          ? 'Content is required field. Please fill it in before submitting.'
          : textForValidation
          ? 'Title is required field. Please fill it in before submitting.'
          : 'Title and Content are required fields. Please fill them in before submitting.'
      );
      return;
    }

    try {
      const {
        title,
        requireAcknowledgement,
        forceAcknowledgeLogin,
        autoExpire,
        targetRows,
        scheduleEnabled,
        scheduledAt,
        attachments,
      } = formData;

      const payload: AnnouncementPayload = {
        title,
        content: htmlContent,
        targets: [],
        requireAcknowledgement,
        forceAcknowledgeLogin,
        autoExpire,
        is_posted: scheduleEnabled ? false : postNow,
        scheduled_at: scheduleEnabled && scheduledAt ? scheduledAt : null,
      };

      const hasTargets = targetRows.some(
        (row) =>
          row.selectedCompanies.length > 0 ||
          row.selectedDepartments.length > 0 ||
          row.selectedPositions.length > 0 ||
          row.selectedEmployees.length > 0
      );

      if (!hasTargets) {
        payload.target_type = 'all';
        payload.target_id = 0;
      } else {
        targetRows.forEach((row) => {
          const targetType =
            row.selectedEmployees.length > 0
              ? 'employee'
              : row.selectedPositions.length > 0
              ? 'position'
              : row.selectedDepartments.length > 0
              ? 'department'
              : 'company';

          const pushAll = (ids: string[]) => {
            ids.forEach((id) => payload.targets.push({ target_type: targetType, target_id: id }));
          };
          if (row.selectedEmployees.length) pushAll(row.selectedEmployees);
          else if (row.selectedPositions.length) pushAll(row.selectedPositions);
          else if (row.selectedDepartments.length) pushAll(row.selectedDepartments);
          else if (row.selectedCompanies.length) pushAll(row.selectedCompanies);
        });
      }

      const formDataToSend = new FormData();
      formDataToSend.append(
        'data',
        JSON.stringify({
          ...payload,
          is_acknowledgement: requireAcknowledgement,
          is_force_login: forceAcknowledgeLogin,
          is_expired: autoExpire,
        })
      );

      if (attachments && attachments.length > 0) {
        attachments.forEach((doc, index) => {
          if (doc.file) {
            formDataToSend.append(`attachments[${index}]`, doc.file);
            formDataToSend.append(`attachments_metadata[${index}]`, JSON.stringify({
              name: doc.name,
              documentType: doc.documentType,
              size: doc.file.size,
              type: doc.file.type
            }));
          }
        });
      }

      console.log('Sending form data with attachments:', attachments?.length || 0);

      const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Failed to create announcement: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Announcement created successfully:', result);
      
      router.push('/announcements');
    } catch (err) {
      console.error('Error creating announcement:', err);
      setError(err instanceof Error ? err.message : 'Failed to create announcement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    doSubmit(false);
  };

  return (
    <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
      <div className="flex flex-col sm:flex-row justify-between mb-6">
        <nav className="text-sm breadcrumbs">
          <ul>
            <li><Link href="/" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Dashboard</Link></li>
            <li><Link href="/announcements" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Announcements</Link></li>
            <li className="font-semibold">Create Announcement</li>
          </ul>
        </nav>
        <div className="flex justify-end">
          <Link href="/announcements" className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
            <FaArrowLeft className="mr-2" /> Back
          </Link>
        </div>
      </div>

      <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Create New Announcement</h1>

      {error ? (
        <div className={`alert mb-6 ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
        <div className="tabs tabs-bordered mb-6">
          <a className={`tab tab-bordered ${activeTab === 'details' ? 'tab-active' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`} onClick={() => handleTabChange('details')}>Announcement Details</a>
          <a className={`tab tab-bordered ${activeTab === 'recipients' ? 'tab-active' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`} onClick={() => handleTabChange('recipients')}>Recipients</a>
        </div>

        <div className={`${activeTab === 'details' ? 'block' : 'hidden'}`}>
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Announcement Details</h2>

            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <div className={`mb-2 font-medium flex items-center gap-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Title <span className="text-red-500">*</span></div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTextChange}
                  className={`input w-full border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
                  required
                  placeholder="Enter announcement title"
                />
              </div>

              <div>
                <div className={`mb-2 font-medium flex items-center gap-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Content <span className="text-red-500">*</span></div>
                <div
                  className={`rounded-lg border ${
                    theme === 'light'
                      ? 'bg-white border-slate-300 focus-within:ring-2 focus-within:ring-blue-500'
                      : 'bg-slate-700 border-slate-600 focus-within:ring-2 focus-within:ring-blue-400'
                  }`}
                >
                  <Slate
                    editor={editor}
                    initialValue={editorValue}
                    onChange={(v) => setEditorValue(v)}
                  >
                    <div
                      className={`flex items-center gap-2 p-2 border-b ${
                        theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700'
                      }`}
                    >
                      <MarkButton format="bold" icon={<FaBold />} theme={theme} />
                      <MarkButton format="italic" icon={<FaItalic />} theme={theme} />
                      <MarkButton format="underline" icon={<FaUnderline />} theme={theme} />
                    </div>

                    <div className="p-3">
                      <Editable
                        renderLeaf={renderLeaf}
                        placeholder="Enter announcement content..."
                        spellCheck
                        className={`min-h-40 w-full border-0 outline-none focus:outline-none ring-0 focus:ring-0 ${
                          theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                        }`}
                        onKeyDown={(e) => {
                          const k = e.key.toLowerCase();
                          if ((e.metaKey || e.ctrlKey) && k === 'b') { e.preventDefault(); CustomEditor.toggleBoldMark(editor); }
                          if ((e.metaKey || e.ctrlKey) && k === 'i') { e.preventDefault(); CustomEditor.toggleItalicMark(editor); }
                          if ((e.metaKey || e.ctrlKey) && k === 'u') { e.preventDefault(); CustomEditor.toggleUnderlineMark(editor); }
                        }}
                      />
                    </div>
                  </Slate>
                </div>
              </div>

              {/* Attachments */}
              <div className="mt-4">
                <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Attachments</div>
                <EmployeeDocumentManager
                  employeeId={null}
                  mode="add"
                  documentTypes={[{ type: 'AnnouncementAttachment', label: 'Announcement Attachments', description: 'Upload files to be included with this announcement (PDF, Word, Excel, images, etc.)' }]}
                  onFilesSelected={handleFilesSelected}
                  moduleName="announcement"
                  customUploadEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents/upload-request`}
                  customDeleteEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents`}
                  customViewEndpoint={`${API_BASE_URL}/api/announcement/announcements/documents/view-url`}
                  initialDocuments={formData.attachments || []}
                  onDocumentDeleted={handleDocumentDeleted}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <div />
            <button
              type="button"
              className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
              onClick={() => handleTabChange('recipients')}
            >
              Next: Select Recipients
            </button>
          </div>
        </div>

        {/* Recipients */}
        <div className={`${activeTab === 'recipients' ? 'block' : 'hidden'}`}>
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Recipients</h2>
              <div className={`badge ml-3 ${theme === 'light' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-blue-900 text-blue-200 border-blue-700'} border`}>Optional</div>
            </div>

            <div className={`alert mb-6 ${theme === 'light' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-blue-900 border-blue-700 text-blue-200'} border rounded-lg`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>If no target rows are added, the announcement will be sent to all parties.</span>
            </div>

            <div className="space-y-4 mb-6">
              {formData.targetRows.map((row, index) => (
                <TargetRowCard
                  key={row.id}
                  row={row}
                  index={index}
                  companies={companies}
                  departments={filteredDepartments}
                  positions={filteredPositions}
                  employees={filteredEmployees}
                  companySearchTerm={formData.companySearchTerm}
                  departmentSearchTerm={formData.departmentSearchTerm}
                  positionSearchTerm={formData.positionSearchTerm}
                  employeeSearchTerm={formData.employeeSearchTerm}
                  targetRows={formData.targetRows}
                  onChangeTab={changeTargetRowTab}
                  onToggleItem={toggleTargetRowItem}
                  onSearchChange={handleSearchChange}
                  isAnyCompanySelected={isAnyCompanySelected}
                  isAnyDepartmentSelected={isAnyDepartmentSelected}
                  isAnyPositionSelected={isAnyPositionSelected}
                />
              ))}
            </div>

            {/* Acknowledgement */}
            <div className={`mb-8 p-4 rounded-lg mt-4 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
              <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Acknowledgement Options</h3>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`} name="requireAcknowledgement" checked={formData.requireAcknowledgement} onChange={handleBooleanChange} />
                    <div>
                      <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Require Acknowledgement</span>
                      <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients will need to acknowledge they have read this announcement</p>
                    </div>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" className={`toggle ${theme === 'light' ? 'toggle-primary' : 'toggle-accent'}`} name="forceAcknowledgeLogin" checked={formData.forceAcknowledgeLogin} onChange={handleBooleanChange} disabled={!formData.requireAcknowledgement} />
                    <div>
                      <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Force Acknowledgement on Login</span>
                      <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients will be required to acknowledge this announcement before they can proceed</p>
                    </div>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`} name="autoExpire" checked={formData.autoExpire} onChange={handleBooleanChange} disabled={!formData.requireAcknowledgement} />
                    <div>
                      <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Auto-Expire After 7 Days</span>
                      <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Announcement will be automatically deleted 7 days after all targeted employees have read it</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className={`mb-8 p-4 rounded-lg mt-4 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
              <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule Options</h3>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`} name="scheduleEnabled" checked={formData.scheduleEnabled} onChange={handleBooleanChange} />
                    <div>
                      <span className={`label-text font-medium text-wrap ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule this announcement</span>
                      <p className={`text-xs mt-1 text-wrap ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>This announcement will be published automatically at the specified date and time</p>
                    </div>
                  </label>
                </div>

                {formData.scheduleEnabled ? (
                  <div className="form-control">
                    <label className="label"><span className={`label-text font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Publication Date and Time</span></label>
                    <div className="flex items-center gap-2">
                      <input
                        type="datetime-local"
                        className={`input border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-600 border-slate-500 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
                        name="scheduledAt"
                        value={formData.scheduledAt}
                        onChange={(e) => setFormData((p) => ({ ...p, scheduledAt: e.target.value }))}
                        min={new Date().toISOString().slice(0, 16)}
                        required={formData.scheduleEnabled}
                      />
                    </div>
                    <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Select the date and time when this announcement should be published</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
              onClick={() => handleTabChange('details')}
            >
              Back to Details
            </button>
            <div />
          </div>
        </div>

        {/* Submit buttons (recipients tab) */}
        <div className={`mt-8 pt-4 border-t flex justify-end ${activeTab === 'recipients' ? 'block' : 'hidden'} ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
          <Link href="/announcements" className={`btn btn-outline mr-3 ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>Cancel</Link>

          {!formData.scheduleEnabled ? (
            <button
              type="button"
              className={`btn mr-3 ${theme === 'light' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-amber-400 hover:bg-amber-500'} text-white border-0`}
              disabled={loading}
              onClick={() => { doSubmit(false); }}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Save Draft
                </>
              )}
            </button>
          ) : null}

          <button
            type="button"
            className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
            disabled={loading || (formData.scheduleEnabled && !formData.scheduledAt)}
            onClick={() => { doSubmit(!formData.scheduleEnabled); }}
          >
            <MainSubmitLabel scheduled={formData.scheduleEnabled} />
          </button>
        </div>
      </form>

      {/* Toast */}
      <div className="toast toast-center toast-middle z-50">
        {showRequiredToast ? (
          <div className={`alert shadow-lg ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
            <span>{requiredToastMsg}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
