// // 'use client';

// // import { useState, useEffect, ChangeEvent, FormEvent , useCallback} from 'react';
// // import { useRouter, useParams } from 'next/navigation';
// // import Link from 'next/link';
// // import { FaSave, FaArrowLeft, FaUsers, FaBuilding, FaUserTie, FaUser, FaFileAlt, FaDownload, FaTrash, FaCheck } from 'react-icons/fa';
// // import { API_BASE_URL, API_ROUTES } from '../../../config';
// // import toSingaporeTime from '@/app/components/ConvertToSingaporeTimeZone';
// // import { toZonedTime } from 'date-fns-tz';
// // import { format } from 'date-fns';
// // import EmployeeDocumentManager, { EmployeeDocument } from '../../../components/EmployeeDocumentManager';
// // import { useTheme } from '../../../components/ThemeProvider';

// // interface Announcement {
// //   id: string;
// //   title: string;
// //   content: string;
// //   target_type: string;
// //   target_id?: string;
// //   target_name?: string;
// //   is_posted?: boolean;
// //   targets?: {
// //     companies?: { id: string; name: string }[];
// //     departments?: { id: string; name: string; company_name: string }[];
// //     positions?: { id: string; name: string; department_name: string; company_name: string }[];
// //     employees?: { id: string; name: string; position_title: string; job_level: string; department_name: string; company_name: string }[];
// //   };
// //   scheduled_at?: string;
// // }

// // interface FormData {
// //   title: string;
// //   content: string;
// //   is_posted?: boolean;
// //   scheduleEnabled?: boolean;
// //   scheduledAt?: string;
// //   attachments?: EmployeeDocument[];
// //   documentsToDelete?: number[];
// // }

// // interface Document {
// //   id: number;
// //   original_filename: string;
// //   file_size: number;
// //   content_type: string;
// //   download_url: string;
// //   uploaded_at: string;
// // }

// // interface Name{
// //   name: string;
// //   position_title?: string;
// //   job_level?: string;
// //   department_name?: string;
// //   company_name?: string;
// // }

// // export default function EditAnnouncementPage() {
// //   const { theme } = useTheme();
// //   const router = useRouter();
// //   const params = useParams();
// //   const id = params.id as string;
// //   const [loading, setLoading] = useState(false);
// //   const [fetchLoading, setFetchLoading] = useState(true);
// //   const [error, setError] = useState('');
// //   const [recipientInfo, setRecipientInfo] = useState<{type: string; name: string}>({type: '', name: ''});
// //   const [documents, setDocuments] = useState<Document[]>([]);
 
// //   const [listName, setListName] = useState<Name[]>([]); 

// //   const [formData, setFormData] = useState<FormData>({
// //     title: '',
// //     content: '',
// //     is_posted: false,
// //     scheduleEnabled: false,
// //     scheduledAt: '',
// //     attachments: [],
// //     documentsToDelete: []
// //   });

// //   // Define fetchDocuments function here before it's used
// //   const fetchDocuments = useCallback(async () => {//async () => {
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/api/announcement/announcements/${id}/documents`);
// //       if (response.ok) {
// //         const data = await response.json();
// //         const docs = data.documents || [];
        
        
// //         // Store documents in state
// //         setDocuments(docs);
        
// //         // Convert to EmployeeDocument format for EmployeeDocumentManager
// //         const employeeDocs: EmployeeDocument[] = docs.map((doc: Document) => ({
// //           id: doc.id,
// //           name: doc.original_filename,
// //           url: doc.download_url,
// //           documentType: doc.content_type || 'AnnouncementAttachment',
// //           uploadDate: doc.uploaded_at,
// //           size: doc.file_size,
// //           contentType: doc.content_type
// //         }));
        
// //       } else {
// //         console.error("Failed to fetch documents:", response.status);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching documents:', error);
// //     }
// //   }, [id]);//};

// //   useEffect(() => {
// //     const fetchAnnouncement = async () => {
// //       try {
// //         const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`);
// //         if (!response.ok) {
// //           throw new Error('Failed to fetch announcement');
// //         }
        
// //         const data = await response.json() as Announcement;
        
// //         setFormData({
// //           title: data.title || '',
// //           content: data.content || '',
// //           is_posted: data.is_posted,
// //           scheduleEnabled: data.scheduled_at ? true : false,
// //           scheduledAt: data.scheduled_at ? format(toSingaporeTime(new Date(data.scheduled_at)), 'yyyy-MM-dd HH:mm') : '',
// //           attachments: [],
// //           documentsToDelete: []
// //         });
      

// //         if(data.targets){
// //           // Check if each target array exists and has items before accessing [0]
// //           const hasEmployees = data.targets.employees && data.targets.employees.length > 0;
// //           const hasDepartments = data.targets.departments && data.targets.departments.length > 0;
// //           const hasPositions = data.targets.positions && data.targets.positions.length > 0;
// //           const hasCompanies = data.targets.companies && data.targets.companies.length > 0;
          
// //           setRecipientInfo({
// //             type: hasEmployees ? 'employee' : hasDepartments ? 'department' : 
// //                   hasPositions ? 'position' : hasCompanies ? 'company' : '',
// //             name: hasEmployees ? (data.targets.employees?.map(emp => emp.name).join(', ') || 'No employees specified') : 
// //                   hasDepartments ? (data.targets.departments?.map(dept => dept.name).join(', ') || 'No departments specified') : 
// //                   hasPositions ? (data.targets.positions?.map(pos => pos.name).join(', ') || 'No positions specified') : 
// //                   hasCompanies ? (data.targets.companies?.map(comp => comp.name).join(', ') || 'No companies specified') : 'All Users'
// //           });

// //           setListName(hasEmployees ? (data.targets.employees?.map(emp => ({name: emp.name, position_title: emp.position_title, job_level: emp.job_level, department_name: emp.department_name, company_name: emp.company_name})) || []) : 
// //                       hasDepartments ? (data.targets.departments?.map(dept => ({name: dept.name, company_name: dept.company_name})) || []) : 
// //                       hasPositions ? (data.targets.positions?.map(pos => ({name: pos.name, department_name: pos.department_name, company_name: pos.company_name})) || []) : 
// //                       hasCompanies ? (data.targets.companies?.map(comp => ({name: comp.name})) || []) : [{name: 'All Users'}]);
// //         }else{
// //           setRecipientInfo({
// //             type: 'All',
// //             name: 'All Users'
// //           });
// //         }
        
// //         // Fetch attached documents
// //         fetchDocuments();
        
// //         setFetchLoading(false);
// //       } catch (error) {
// //         console.error('Error fetching announcement:', error);
// //         setError('Failed to load announcement data');
// //         setFetchLoading(false);
// //       }
// //     };
    
// //     fetchAnnouncement();
// //   }, [id,fetchDocuments]);

// //   // Add a separate effect just for fetching documents to ensure they're loaded
// //   useEffect(() => {
// //     if (!fetchLoading) {
// //       // Fetch documents again after component is fully loaded
// //       fetchDocuments();
// //     }
// //   }, [fetchLoading,fetchDocuments]);


// //   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   const handleSubmit = async (e: FormEvent<HTMLFormElement>, isPost: boolean = false) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError('');


// //     formData.is_posted = isPost;

// //     try {
// //       // Create FormData for file uploads and announcement update
// //       const formDataToSend = new FormData();
// //       // Add JSON payload as a string
// //       formDataToSend.append('data', JSON.stringify({
// //         title: formData.title,
// //         content: formData.content,
// //         is_posted: formData.is_posted,
// //         scheduled_at: formData.scheduleEnabled && formData.scheduledAt ? formData.scheduledAt : null,
// //         documents_to_delete: formData.documentsToDelete || []
// //       }));
      
// //       // Add files from formData.attachments
// //       if (formData.attachments && formData.attachments.length > 0) {
// //         formData.attachments.forEach(doc => {
// //           if (doc.file) {
// //             formDataToSend.append('attachments[]', doc.file);
// //           }
// //         });
// //       }
      
// //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`, {
// //         method: 'PUT',
// //         body: formDataToSend,
// //       });
// //       if(response.ok && formData.documentsToDelete && formData.documentsToDelete.length > 0){
// //         const responseDelete = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}/documents`, {
// //           method: 'DELETE',
// //           headers: {
// //             'Content-Type': 'application/json'
// //           },
// //           body: JSON.stringify({
// //             document_id: formData.documentsToDelete,
// //             announcement_id: id
// //           })
// //         });

// //         if(responseDelete.ok){
// //           router.push('/announcements');
// //         }else{
// //           throw new Error('Failed to delete documents');
// //         }
// //       }else{
// //         throw new Error('Failed to update announcement');
// //       }

// //       router.push('/announcements');
// //     } catch (error) {
// //       console.error('Error updating announcement:', error);
// //       setError('Failed to update announcement. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const togglePostStatus = () => {
// //     setFormData(prev => ({
// //       ...prev,
// //       is_posted: !prev.is_posted
// //     }));
// //   };

// //   // Helper function to get icon for recipient type
// //   const getRecipientIcon = (type: string) => {
// //     switch (type) {
// //       case 'company':
// //         return <FaBuilding className="text-primary" />;
// //       case 'department':
// //         return <FaUsers className="text-primary" />;
// //       case 'position':
// //         return <FaUserTie className="text-primary" />;
// //       case 'employee':
// //         return <FaUser className="text-primary" />;
// //       default:
// //         return <FaBuilding className="text-primary" />;
// //     }
// //   };

// //   // Helper function to get human-readable recipient type
// //   const getRecipientTypeLabel = (type: string) => {
// //     switch (type) {
// //       case 'company':
// //         return 'Company';
// //       case 'department':
// //         return 'Department';
// //       case 'position':
// //         return 'Position';
// //       case 'employee':
// //         return 'Employee';
// //       default:
// //         return 'All';
// //     }
// //   };

// //   // Define document types for announcements
// //   const announcementDocumentTypes = [
// //     {
// //       type: 'AnnouncementAttachment',
// //       label: 'Attachments',
// //       description: 'Upload files to be included with this announcement (PDF, Word, Excel, images, etc.)'
// //     }
// //   ];

// //   if (fetchLoading) {
// //     return (
// //       <div className="flex justify-center items-center h-screen">
// //         <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
// //       <div className="flex justify-between items-center mb-6">
// //         <nav className="text-sm breadcrumbs">
// //           <ul>
// //             <li><Link href="/" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Dashboard</Link></li>
// //             <li><Link href="/announcements" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Announcements</Link></li>
// //             <li className="font-semibold">Edit Announcement</li>
// //           </ul>
// //         </nav>
        
// //         <Link href="/announcements" className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
// //           <FaArrowLeft className="mr-2" /> Back to Announcements
// //         </Link>
// //       </div>

// //       <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Edit Announcement</h1>

// //       {error && (
// //         <div className={`alert mb-6 ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
// //           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
// //           </svg>
// //           <span>{error}</span>
// //         </div>
// //       )}

// //       <form onSubmit={(e)=>handleSubmit(e,formData.is_posted)} className={`p-6 rounded-lg shadow ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
      
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           <div className={`lg:col-span-2`}>
// //             {/* Announcement Details Section */}
// //             <div className="mb-8">
// //               <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Announcement Details</h2>
              
// //               <div className="grid grid-cols-1 gap-6 mb-6">
// //                 <div>
// //                   <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Title</div>
// //                   <input
// //                     type="text"
// //                     name="title"
// //                     value={formData.title}
// //                     onChange={handleChange}
// //                     className={`input w-full border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
// //                     required
// //                     placeholder="Enter announcement title"
// //                   />
// //                 </div>

// //                 <div>
// //                   <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Content</div>
// //                   <textarea
// //                     name="content"
// //                     value={formData.content}
// //                     onChange={handleChange}
// //                     className={`textarea w-full h-40 border whitespace-pre-wrap ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
// //                     required
// //                     placeholder="Enter announcement content"
// //                     style={{ lineHeight: "1.5" }}
// //                   />
// //                 </div>

// //                 {/* File Attachment Section - Styled like EmployeeDocumentManager */}
// //                 <div className="mt-4">
// //                   <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Attachments</div>
                  
// //                   {/* Attachment container - styled similar to EmployeeDocumentManager */}
// //                   <div className={`border rounded-lg p-4 ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
// //                     <div className="flex justify-between flex-row mb-2">
// //                       <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Announcement Attachments</h3>
// //                       {/* Upload button styled like EmployeeDocumentManager */}
// //                       <label htmlFor="attachment-upload" className={`btn btn-sm btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
// //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
// //                         </svg>
// //                         Add
// //                       </label>
// //                       <input
// //                         id="attachment-upload"
// //                         type="file"
// //                         multiple
// //                         className="hidden"
// //                         onChange={(e) => {
// //                           if (e.target.files && e.target.files.length > 0) {
// //                             const files = Array.from(e.target.files);
// //                             const newAttachments = files.map(file => ({
// //                               name: file.name,
// //                               file: file,
// //                               documentType: 'AnnouncementAttachment'
// //                             }));
// //                             setFormData(prev => ({
// //                               ...prev,
// //                               attachments: [...(prev.attachments || []), ...newAttachments]
// //                             }));
// //                           }
// //                         }}
// //                       />
// //                     </div>
                    
// //                     <div className={`items-center p-4 border-2 border-dashed rounded-lg ${theme === 'light' ? 'border-slate-300 bg-slate-50' : 'border-slate-600 bg-slate-800'}`}>
// //                       <div className="flex justify-between flex-row">
// //                         <div>
// //                           <p className={`text-sm text-center mb-2 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// //                             Upload files to be included with this announcement (PDF, Word, Excel, images, etc.)
// //                           </p>
// //                         </div>
// //                       </div>

// //                       {/* Grid for both existing documents and new files */}
// //                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
// //                         {/* Display existing attachments */}
// //                         {documents.map((doc) => {
// //                           const isMarkedForDeletion = formData.documentsToDelete?.includes(doc.id);
                          
// //                           return (
// //                             <div 
// //                               key={`doc-${doc.id}`} 
// //                               className={`card border ${isMarkedForDeletion ? 'hidden' : ''} ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-700 border-slate-600'}`}
// //                             >
// //                               <div className="card-body p-4">
// //                                 <div className="flex items-start justify-between">
// //                                   <div className="flex-1">
// //                                     <h4 className={`card-title text-sm mb-1 truncate ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`} title={doc.original_filename}>
// //                                       {doc.original_filename}
// //                                       {isMarkedForDeletion && (
// //                                         <span className="ml-2 text-xs text-red-500">(Will be deleted)</span>
// //                                       )}
// //                                     </h4>
// //                                     <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// //                                       Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
// //                                     </p>
// //                                   </div>
                                  
// //                                   <button
// //                                     type="button"
// //                                     className={`btn btn-ghost btn-xs ${isMarkedForDeletion ? 'text-green-500' : 'text-red-500'}`}
// //                                     onClick={() => {
// //                                       setFormData(prev => {
// //                                         const documentsToDelete = prev.documentsToDelete || [];
// //                                         if (isMarkedForDeletion) {
// //                                           return {
// //                                             ...prev,
// //                                             documentsToDelete: documentsToDelete.filter(id => id !== doc.id)
// //                                           };
// //                                         } else {
// //                                           return {
// //                                             ...prev,
// //                                             documentsToDelete: [...documentsToDelete, doc.id]
// //                                           };
// //                                         }
// //                                       });
// //                                     }}
// //                                   >
// //                                     {isMarkedForDeletion ? (
// //                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// //                                       </svg>
// //                                     ) : (
// //                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                                       </svg>
// //                                     )}
// //                                   </button>
// //                                 </div>
                                
// //                                 <div className="mt-2">
// //                                   <a
// //                                     href={doc.download_url}
// //                                     target="_blank"
// //                                     rel="noopener noreferrer"
// //                                     className={`btn btn-sm w-full ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
// //                                   >
// //                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //                                     </svg>
// //                                     View Document
// //                                   </a>
// //                                 </div>
// //                               </div>
// //                             </div>
// //                           );
// //                         })}
                        
// //                         {/* Display new files to be uploaded */}
// //                         {formData.attachments && formData.attachments.map((file, index) => (
// //                           <div 
// //                             key={`upload-${index}`} 
// //                             className={`card border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-700 border-slate-600'}`}
// //                           >
// //                             <div className="card-body p-4">
// //                               <div className="flex items-start justify-between">
// //                                 <div className="flex-1">
// //                                   <h4 className={`card-title text-sm mb-1 truncate ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`} title={file.name}>
// //                                     {file.name}
// //                                     <span className="ml-2 text-xs text-blue-500">(New)</span>
// //                                   </h4>
// //                                 </div>
                                
// //                                 <button
// //                                   type="button"
// //                                   className="btn btn-ghost btn-xs text-red-500"
// //                                   onClick={() => {
// //                                     setFormData(prev => ({
// //                                       ...prev,
// //                                       attachments: prev.attachments?.filter((_, i) => i !== index) || []
// //                                     }));
// //                                   }}
// //                                 >
// //                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                                   </svg>
// //                                 </button>
// //                               </div>
// //                             </div>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
            
// //             {/* Schedule Options Section */}
// //             {!formData.is_posted && (
// //               <div className={`mb-8 p-4 rounded-lg ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
// //                 <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule Options</h3>
                
// //                 <div className="space-y-4">
// //                   <div className="form-control">
// //                     <label className="label cursor-pointer justify-start gap-3">
// //                       <input 
// //                         type="checkbox" 
// //                         className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
// //                         checked={formData.scheduleEnabled}
// //                         onChange={(e) => setFormData(prev => ({
// //                           ...prev,
// //                           scheduleEnabled: e.target.checked
// //                         }))}
// //                       />
// //                       <div>
// //                         <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule this announcement</span>
// //                         <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>This announcement will be published automatically at the specified date and time</p>
// //                       </div>
// //                     </label>
// //                   </div>
                  
// //                   {formData.scheduleEnabled && (
// //                     <div className="form-control">
// //                       <label className="label">
// //                         <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Publication Date and Time</span>
// //                       </label>
// //                       <div className="flex items-center gap-2">
// //                         <input 
// //                           type="datetime-local" 
// //                           className={`input border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-600 border-slate-500 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
// //                           value={formData.scheduledAt}
// //                           onChange={(e) => setFormData(prev => ({
// //                             ...prev,
// //                             scheduledAt: e.target.value
// //                           }))}
// //                           min={new Date().toISOString().slice(0, 16)}
// //                           required={formData.scheduleEnabled}
// //                         />
// //                       </div>
// //                       <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Select the date and time when this announcement should be published</p>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             )}
// //           </div>
          
// //           <div className={`lg:col-span-1`}>
// //             <div className={`card border p-4 mb-4 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
// //               <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Recipient Information</h2>
// //               <div className={`flex flex-col space-y-3 p-4 rounded-lg mb-4 max-h-64 overflow-y-auto overflow-x-hidden ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
// //                 <div className={`text-sm font-medium flex justify-start w-full border-b pb-2 ${theme === 'light' ? 'text-blue-600 border-slate-300' : 'text-blue-400 border-slate-600'}`}>
// //                   {getRecipientTypeLabel(recipientInfo.type)}
// //                 </div>
// //                 <div className="grid grid-cols-1 md:grid-cols-1 gap-3 mt-2">
// //                   {listName.map((name, index) => (
// //                     <div key={index} className={`flex items-center p-3 rounded-md shadow-sm hover:shadow-md transition-shadow border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-600 border-slate-500'}`}>
// //                       <div className="w-full">
// //                         <div className={`font-medium truncate ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{name.name}</div>

// //                         <div className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// //                           {name.position_title ? `${name.company_name} • ${name.department_name} • ${name.position_title} • ${name.job_level}` : 
// //                           name.department_name ? `${name.company_name} • ${name.department_name}` : 
// //                           name.company_name ? `${name.company_name}` : ''}
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //               <div className="mt-4 text-sm">
// //                 <p className={`${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients cannot be changed after an announcement is created. To target different recipients, please create a new announcement.</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         <div className={`mt-8 pt-4 border-t flex justify-end ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
// //           <div className="flex-1">
// //             {!formData.is_posted && (
// //                 <button
// //                   type="button"
// //                   onClick={()=> {
// //                     const syntheticEvent = { 
// //                       preventDefault: () => {} 
// //                     } as FormEvent<HTMLFormElement>;
// //                     handleSubmit(syntheticEvent, true);
// //                   }}
// //                   className={`btn btn-outline ${theme === 'light' ? 'border-green-600 text-green-600 hover:bg-green-600' : 'border-green-400 text-green-400 hover:bg-green-400'} hover:text-white`}
// //                 >
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
// //                   </svg>
// //                   {formData.scheduleEnabled ? 'Schedule' : 'Publish'}
// //                 </button>
// //             )}
// //           </div>
// //           <Link href="/announcements" className={`btn btn-outline mr-3 ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
// //             Cancel
// //           </Link>
// //           <button
// //             type="submit"
// //             className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
// //             disabled={loading || (formData.scheduleEnabled && !formData.scheduledAt)}
// //           >
// //             {loading ? (
// //               <>
// //                 <span className="loading loading-spinner loading-sm mr-2"></span>
// //                 Updating...
// //               </>
// //             ) : (
// //               <>
// //                 <FaSave className="mr-2" /> Update Announcement
// //               </>
// //             )}
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // } 


// 'use client';

// import React, { useState, useEffect, ChangeEvent, FormEvent , useCallback} from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import Link from 'next/link';
// import { FaSave, FaArrowLeft, FaUsers, FaBuilding, FaUserTie, FaUser, FaFileAlt, FaDownload, FaTrash, FaCheck } from 'react-icons/fa';
// import { API_BASE_URL, API_ROUTES } from '../../../config';
// import toSingaporeTime from '@/app/components/ConvertToSingaporeTimeZone';
// import { toZonedTime } from 'date-fns-tz';
// import { format } from 'date-fns';
// import type { EmployeeDocument } from '../../../components/EmployeeDocumentManager';
// import { useTheme } from '../../../components/ThemeProvider';

// /* ======================= Slate rendering helpers ======================= */

// type SlateNode = any;
// type SlateArray = SlateNode[];

// function tryParseJson(input: unknown): unknown {
//   if (typeof input !== 'string') return input;
//   const s = input.trim();
//   if (!s.startsWith('[') && !s.startsWith('{')) return input;
//   try {
//     return JSON.parse(s);
//   } catch {
//     return input;
//   }
// }

// function isSlateArray(val: unknown): val is SlateArray {
//   return Array.isArray(val) && val.every((n) => typeof n === 'object' && n && 'children' in n);
// }

// function renderLeaf(leaf: any, key: number): React.ReactNode {
//   let content: React.ReactNode = leaf.text ?? '';
//   if (leaf.bold) content = <strong key={`b-${key}`}>{content}</strong>;
//   if (leaf.italic) content = <em key={`i-${key}`}>{content}</em>;
//   if (leaf.underline) content = <u key={`u-${key}`}>{content}</u>;
//   if (leaf.code) content = <code key={`c-${key}`} className="px-1 rounded bg-gray-100 dark:bg-slate-700">{content}</code>;
//   if (leaf.strikethrough) content = <s key={`s-${key}`}>{content}</s>;
//   return <React.Fragment key={key}>{content}</React.Fragment>;
// }

// function renderChildren(children: any[]): React.ReactNode {
//   return children.map((ch, i) => {
//     if (typeof ch?.text === 'string') return renderLeaf(ch, i);
//     if (Array.isArray(ch?.children)) return renderElement(ch, i);
//     return <React.Fragment key={i} />;
//   });
// }

// function renderElement(node: any, key: number): React.ReactNode {
//   const { type, children } = node || {};
//   const kids = Array.isArray(children) ? children : [];

//   switch (type) {
//     case 'heading-one':
//       return <h1 key={key} className="text-2xl font-bold mb-2">{renderChildren(kids)}</h1>;
//     case 'heading-two':
//       return <h2 key={key} className="text-xl font-semibold mb-2">{renderChildren(kids)}</h2>;
//     case 'heading-three':
//       return <h3 key={key} className="text-lg font-semibold mb-2">{renderChildren(kids)}</h3>;
//     case 'block-quote':
//       return (
//         <blockquote key={key} className="border-l-4 pl-3 italic my-2 border-gray-300 dark:border-slate-600">
//           {renderChildren(kids)}
//         </blockquote>
//       );
//     case 'bulleted-list':
//       return <ul key={key} className="list-disc ml-6 my-2">{renderChildren(kids)}</ul>;
//     case 'numbered-list':
//       return <ol key={key} className="list-decimal ml-6 my-2">{renderChildren(kids)}</ol>;
//     case 'list-item':
//       return <li key={key}>{renderChildren(kids)}</li>;
//     case 'link':
//       return (
//         <a key={key} href={node.url || '#'} className="text-blue-600 dark:text-blue-400 underline">
//           {renderChildren(kids)}
//         </a>
//       );
//     case 'paragraph':
//     default:
//       return <p key={key} className="mb-2 whitespace-pre-wrap">{renderChildren(kids)}</p>;
//   }
// }

// function RichText({ content, className }: { content: unknown; className?: string }) {
//   const parsed = tryParseJson(content);
//   if (isSlateArray(parsed)) {
//     return <div className={className}>{parsed.map((n, i) => renderElement(n, i))}</div>;
//   }
//   return <div className={className}>{typeof content === 'string' ? content : ''}</div>;
// }

// /* ======================= Types ======================= */

// interface Announcement {
//   id: string;
//   title: string;
//   content: string | unknown; // may be Slate JSON or string
//   target_type: string;
//   target_id?: string;
//   target_name?: string;
//   is_posted?: boolean;
//   targets?: {
//     companies?: { id: string; name: string }[];
//     departments?: { id: string; name: string; company_name: string }[];
//     positions?: { id: string; name: string; department_name: string; company_name: string }[];
//     employees?: { id: string; name: string; position_title: string; job_level: string; department_name: string; company_name: string }[];
//   };
//   scheduled_at?: string;
// }

// interface FormDataShape {
//   title: string;
//   content: string; // what we will send to API (plain or JSON string)
//   is_posted?: boolean;
//   scheduleEnabled?: boolean;
//   scheduledAt?: string;
//   attachments?: EmployeeDocument[];
//   documentsToDelete?: number[];
// }

// interface Document {
//   id: number;
//   original_filename: string;
//   file_size: number;
//   content_type: string;
//   download_url: string;
//   uploaded_at: string;
// }

// interface Name{
//   name: string;
//   position_title?: string;
//   job_level?: string;
//   department_name?: string;
//   company_name?: string;
// }

// type ContentFormat = 'plain' | 'slate';

// export default function EditAnnouncementPage() {
//   const { theme } = useTheme();
//   const router = useRouter();
//   const params = useParams();
//   const id = params.id as string;

//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [recipientInfo, setRecipientInfo] = useState<{type: string; name: string}>({type: '', name: ''});
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [listName, setListName] = useState<Name[]>([]);

//   // Content editing mode + states
//   const [contentFormat, setContentFormat] = useState<ContentFormat>('plain');
//   const [contentPlain, setContentPlain] = useState<string>('');
//   const [contentJsonString, setContentJsonString] = useState<string>(''); // stringified Slate JSON
//   const [contentJsonError, setContentJsonError] = useState<string>('');

//   const [formData, setFormData] = useState<FormDataShape>({
//     title: '',
//     content: '',          // kept in sync with mode
//     is_posted: false,
//     scheduleEnabled: false,
//     scheduledAt: '',
//     attachments: [],
//     documentsToDelete: []
//   });

//   // Validate and sync content to formData whenever inputs change
//   useEffect(() => {
//     if (contentFormat === 'plain') {
//       setContentJsonError('');
//       setFormData(prev => ({ ...prev, content: contentPlain }));
//     } else {
//       // slate mode
//       const raw = contentJsonString.trim();
//       if (!raw) {
//         setContentJsonError('Slate JSON is empty.');
//         setFormData(prev => ({ ...prev, content: '' }));
//         return;
//       }
//       const parsed = tryParseJson(raw);
//       if (isSlateArray(parsed)) {
//         setContentJsonError('');
//         // ensure we store a stable pretty/minified string; minified is fine
//         setFormData(prev => ({ ...prev, content: JSON.stringify(parsed) }));
//       } else {
//         setContentJsonError('Invalid Slate JSON format. Expecting an array of nodes with children.');
//         setFormData(prev => ({ ...prev, content: raw })); // keep user text but block submit
//       }
//     }
//   }, [contentFormat, contentPlain, contentJsonString]);

//   // Define fetchDocuments function here before it's used
//   const fetchDocuments = useCallback(async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/announcement/announcements/${id}/documents`);
//       if (response.ok) {
//         const data = await response.json();
//         const docs = data.documents || [];
//         setDocuments(docs);
//       } else {
//         console.error("Failed to fetch documents:", response.status);
//       }
//     } catch (error) {
//       console.error('Error fetching documents:', error);
//     }
//   }, [id]);

//   useEffect(() => {
//     const fetchAnnouncement = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch announcement');
//         }
        
//         const data = await response.json() as Announcement;

//         // Detect format and populate editors
//         const maybeParsed = tryParseJson(data.content);
//         if (isSlateArray(maybeParsed)) {
//           setContentFormat('slate');
//           setContentJsonString(JSON.stringify(maybeParsed));
//           setContentPlain(''); // keep separate
//           setFormData(prev => ({
//             ...prev,
//             title: data.title || '',
//             content: JSON.stringify(maybeParsed),
//             is_posted: data.is_posted,
//             scheduleEnabled: !!data.scheduled_at,
//             scheduledAt: data.scheduled_at ? format(toSingaporeTime(new Date(data.scheduled_at)), 'yyyy-MM-dd HH:mm') : '',
//             attachments: [],
//             documentsToDelete: []
//           }));
//         } else {
//           const text = typeof data.content === 'string' ? data.content : '';
//           setContentFormat('plain');
//           setContentPlain(text);
//           setContentJsonString('');
//           setFormData(prev => ({
//             ...prev,
//             title: data.title || '',
//             content: text,
//             is_posted: data.is_posted,
//             scheduleEnabled: !!data.scheduled_at,
//             scheduledAt: data.scheduled_at ? format(toSingaporeTime(new Date(data.scheduled_at)), 'yyyy-MM-dd HH:mm') : '',
//             attachments: [],
//             documentsToDelete: []
//           }));
//         }

//         if (data.targets) {
//           const hasEmployees = data.targets.employees && data.targets.employees.length > 0;
//           const hasDepartments = data.targets.departments && data.targets.departments.length > 0;
//           const hasPositions = data.targets.positions && data.targets.positions.length > 0;
//           const hasCompanies = data.targets.companies && data.targets.companies.length > 0;
          
//           setRecipientInfo({
//             type: hasEmployees ? 'employee' : hasDepartments ? 'department' : 
//                   hasPositions ? 'position' : hasCompanies ? 'company' : '',
//             name: hasEmployees ? (data.targets.employees?.map(emp => emp.name).join(', ') || 'No employees specified') : 
//                   hasDepartments ? (data.targets.departments?.map(dept => dept.name).join(', ') || 'No departments specified') : 
//                   hasPositions ? (data.targets.positions?.map(pos => pos.name).join(', ') || 'No positions specified') : 
//                   hasCompanies ? (data.targets.companies?.map(comp => comp.name).join(', ') || 'No companies specified') : 'All Users'
//           });

//           setListName(hasEmployees ? (data.targets.employees?.map(emp => ({name: emp.name, position_title: emp.position_title, job_level: emp.job_level, department_name: emp.department_name, company_name: emp.company_name})) || []) : 
//                       hasDepartments ? (data.targets.departments?.map(dept => ({name: dept.name, company_name: dept.company_name})) || []) : 
//                       hasPositions ? (data.targets.positions?.map(pos => ({name: pos.name, department_name: pos.department_name, company_name: pos.company_name})) || []) : 
//                       hasCompanies ? (data.targets.companies?.map(comp => ({name: comp.name})) || []) : [{name: 'All Users'}]);
//         } else {
//           setRecipientInfo({ type: 'All', name: 'All Users' });
//         }
        
//         // Fetch attached documents
//         fetchDocuments();
//         setFetchLoading(false);
//       } catch (error) {
//         console.error('Error fetching announcement:', error);
//         setError('Failed to load announcement data');
//         setFetchLoading(false);
//       }
//     };
    
//     fetchAnnouncement();
//   }, [id, fetchDocuments]);

//   // Add a separate effect just for fetching documents to ensure they're loaded
//   useEffect(() => {
//     if (!fetchLoading) {
//       fetchDocuments();
//     }
//   }, [fetchLoading, fetchDocuments]);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>, isPost: boolean = false) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       // Create FormData for file uploads and announcement update
//       const formDataToSend = new FormData();
//       // Add JSON payload as a string
//       formDataToSend.append('data', JSON.stringify({
//         title: formData.title,
//         content: formData.content, // already synced with chosen format
//         is_posted: isPost,
//         scheduled_at: formData.scheduleEnabled && formData.scheduledAt ? formData.scheduledAt : null,
//         documents_to_delete: formData.documentsToDelete || []
//       }));
      
//       // Add files from formData.attachments
//       if (formData.attachments && formData.attachments.length > 0) {
//         formData.attachments.forEach(doc => {
//           if ((doc as any).file) {
//             formDataToSend.append('attachments[]', (doc as any).file as File);
//           }
//         });
//       }
      
//       const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`, {
//         method: 'PUT',
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update announcement');
//       }

//       // Optionally delete documents if requested
//       if (formData.documentsToDelete && formData.documentsToDelete.length > 0) {
//         const responseDelete = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}/documents`, {
//           method: 'DELETE',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             document_id: formData.documentsToDelete,
//             announcement_id: id
//           })
//         });

//         if (!responseDelete.ok) {
//           throw new Error('Failed to delete documents');
//         }
//       }

//       router.push('/announcements');
//     } catch (error) {
//       console.error('Error updating announcement:', error);
//       setError('Failed to update announcement. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const togglePostStatus = () => {
//     setFormData(prev => ({
//       ...prev,
//       is_posted: !prev.is_posted
//     }));
//   };

//   // Helper function to get icon for recipient type
//   const getRecipientIcon = (type: string) => {
//     switch (type) {
//       case 'company':
//         return <FaBuilding className="text-primary" />;
//       case 'department':
//         return <FaUsers className="text-primary" />;
//       case 'position':
//         return <FaUserTie className="text-primary" />;
//       case 'employee':
//         return <FaUser className="text-primary" />;
//       default:
//         return <FaBuilding className="text-primary" />;
//     }
//   };

//   // Helper function to get human-readable recipient type
//   const getRecipientTypeLabel = (type: string) => {
//     switch (type) {
//       case 'company':
//         return 'Company';
//       case 'department':
//         return 'Department';
//       case 'position':
//         return 'Position';
//       case 'employee':
//         return 'Employee';
//       default:
//         return 'All';
//     }
//   };

//   // Define document types for announcements
//   const announcementDocumentTypes = [
//     {
//       type: 'AnnouncementAttachment',
//       label: 'Attachments',
//       description: 'Upload files to be included with this announcement (PDF, Word, Excel, images, etc.)'
//     }
//   ];

//   if (fetchLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
//       </div>
//     );
//   }

//   const submitDisabled = loading || (formData.scheduleEnabled && !formData.scheduledAt) || (contentFormat === 'slate' && !!contentJsonError);

//   return (
//     <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
//       <div className="flex justify-between items-center mb-6">
//         <nav className="text-sm breadcrumbs">
//           <ul>
//             <li><Link href="/" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Dashboard</Link></li>
//             <li><Link href="/announcements" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Announcements</Link></li>
//             <li className="font-semibold">Edit Announcement</li>
//           </ul>
//         </nav>
        
//         <Link href="/announcements" className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
//           <FaArrowLeft className="mr-2" /> Back to Announcements
//         </Link>
//       </div>

//       <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Edit Announcement</h1>

//       {error && (
//         <div className={`alert mb-6 ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
//           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <span>{error}</span>
//         </div>
//       )}

//       <form onSubmit={(e)=>handleSubmit(e, formData.is_posted ?? false)} className={`p-6 rounded-lg shadow ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
      
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className={`lg:col-span-2`}>
//             {/* Announcement Details Section */}
//             <div className="mb-8">
//               <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Announcement Details</h2>
              
//               <div className="grid grid-cols-1 gap-6 mb-6">
//                 <div>
//                   <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Title</div>
//                   <input
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     className={`input w-full border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
//                     required
//                     placeholder="Enter announcement title"
//                   />
//                 </div>

//                 <div>
//                   <div className="flex items-center justify-between mb-2">
//                     <div className={`font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Content</div>
//                     <div className="flex gap-2">
//                       <button
//                         type="button"
//                         onClick={() => setContentFormat('plain')}
//                         className={`btn btn-xs ${contentFormat === 'plain'
//                           ? (theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white')
//                           : (theme === 'light' ? 'btn-outline border-slate-400 text-slate-700' : 'btn-outline border-slate-500 text-slate-300')
//                         }`}
//                       >
//                         Plain text
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => setContentFormat('slate')}
//                         className={`btn btn-xs ${contentFormat === 'slate'
//                           ? (theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white')
//                           : (theme === 'light' ? 'btn-outline border-slate-400 text-slate-700' : 'btn-outline border-slate-500 text-slate-300')
//                         }`}
//                       >
//                         Slate JSON
//                       </button>
//                     </div>
//                   </div>

//                   {contentFormat === 'plain' ? (
//                     <textarea
//                       value={contentPlain}
//                       onChange={(e) => setContentPlain(e.target.value)}
//                       className={`textarea w-full h-40 border whitespace-pre-wrap ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
//                       required
//                       placeholder="Enter announcement content"
//                       style={{ lineHeight: "1.5" }}
//                     />
//                   ) : (
//                     <>
//                       <textarea
//                         value={contentJsonString}
//                         onChange={(e) => setContentJsonString(e.target.value)}
//                         className={`textarea w-full h-40 border font-mono text-xs ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
//                         placeholder='Paste Slate JSON here, e.g. [{"type":"paragraph","children":[{"text":"Hello"}]}]'
//                         required
//                       />
//                       {contentJsonError ? (
//                         <div className={`mt-2 text-xs ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>
//                           {contentJsonError}
//                         </div>
//                       ) : (
//                         <div className="mt-4">
//                           <div className={`mb-2 text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Preview</div>
//                           <div className={`p-3 rounded border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-700 bg-slate-900/30'}`}>
//                             <RichText content={contentJsonString} />
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>

//                 {/* File Attachment Section */}
//                 <div className="mt-4">
//                   <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Attachments</div>
                  
//                   <div className={`border rounded-lg p-4 ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
//                     <div className="flex justify-between flex-row mb-2">
//                       <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Announcement Attachments</h3>
//                       <label htmlFor="attachment-upload" className={`btn btn-sm btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                         </svg>
//                         Add
//                       </label>
//                       <input
//                         id="attachment-upload"
//                         type="file"
//                         multiple
//                         className="hidden"
//                         onChange={(e) => {
//                           if (e.target.files && e.target.files.length > 0) {
//                             const files = Array.from(e.target.files);
//                             const newAttachments = files.map(file => ({
//                               name: file.name,
//                               file: file,
//                               documentType: 'AnnouncementAttachment'
//                             })) as unknown as EmployeeDocument[];
//                             setFormData(prev => ({
//                               ...prev,
//                               attachments: [...(prev.attachments || []), ...newAttachments]
//                             }));
//                           }
//                         }}
//                       />
//                     </div>
                    
//                     <div className={`items-center p-4 border-2 border-dashed rounded-lg ${theme === 'light' ? 'border-slate-300 bg-slate-50' : 'border-slate-600 bg-slate-800'}`}>
//                       <div className="flex justify-between flex-row">
//                         <div>
//                           <p className={`text-sm text-center mb-2 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
//                             Upload files to be included with this announcement (PDF, Word, Excel, images, etc.)
//                           </p>
//                         </div>
//                       </div>

//                       {/* Grid for both existing documents and new files */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//                         {/* Existing attachments */}
//                         {documents.map((doc) => {
//                           const isMarkedForDeletion = formData.documentsToDelete?.includes(doc.id);
                          
//                           return (
//                             <div 
//                               key={`doc-${doc.id}`} 
//                               className={`card border ${isMarkedForDeletion ? 'hidden' : ''} ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-700 border-slate-600'}`}
//                             >
//                               <div className="card-body p-4">
//                                 <div className="flex items-start justify-between">
//                                   <div className="flex-1">
//                                     <h4 className={`card-title text-sm mb-1 truncate ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`} title={doc.original_filename}>
//                                       {doc.original_filename}
//                                       {isMarkedForDeletion && (
//                                         <span className="ml-2 text-xs text-red-500">(Will be deleted)</span>
//                                       )}
//                                     </h4>
//                                     <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                                       Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
//                                     </p>
//                                   </div>
                                  
//                                   <button
//                                     type="button"
//                                     className={`btn btn-ghost btn-xs ${isMarkedForDeletion ? 'text-green-500' : 'text-red-500'}`}
//                                     onClick={() => {
//                                       setFormData(prev => {
//                                         const documentsToDelete = prev.documentsToDelete || [];
//                                         if (isMarkedForDeletion) {
//                                           return {
//                                             ...prev,
//                                             documentsToDelete: documentsToDelete.filter(id => id !== doc.id)
//                                           };
//                                         } else {
//                                           return {
//                                             ...prev,
//                                             documentsToDelete: [...documentsToDelete, doc.id]
//                                           };
//                                         }
//                                       });
//                                     }}
//                                   >
//                                     {isMarkedForDeletion ? (
//                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                       </svg>
//                                     ) : (
//                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                       </svg>
//                                     )}
//                                   </button>
//                                 </div>
                                
//                                 <div className="mt-2">
//                                   <a
//                                     href={doc.download_url}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className={`btn btn-sm w-full ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
//                                   >
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                     </svg>
//                                     View Document
//                                   </a>
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
                        
//                         {/* New files to be uploaded */}
//                         {formData.attachments && formData.attachments.map((file, index) => (
//                           <div 
//                             key={`upload-${index}`} 
//                             className={`card border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-700 border-slate-600'}`}
//                           >
//                             <div className="card-body p-4">
//                               <div className="flex items-start justify-between">
//                                 <div className="flex-1">
//                                   <h4 className={`card-title text-sm mb-1 truncate ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`} title={(file as any).name}>
//                                     {(file as any).name}
//                                     <span className="ml-2 text-xs text-blue-500">(New)</span>
//                                   </h4>
//                                 </div>
                                
//                                 <button
//                                   type="button"
//                                   className="btn btn-ghost btn-xs text-red-500"
//                                   onClick={() => {
//                                     setFormData(prev => ({
//                                       ...prev,
//                                       attachments: prev.attachments?.filter((_, i) => i !== index) || []
//                                     }));
//                                   }}
//                                 >
//                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                   </svg>
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Schedule Options Section */}
//             {!formData.is_posted && (
//               <div className={`mb-8 p-4 rounded-lg ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
//                 <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule Options</h3>
                
//                 <div className="space-y-4">
//                   <div className="form-control">
//                     <label className="label cursor-pointer justify-start gap-3">
//                       <input 
//                         type="checkbox" 
//                         className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
//                         checked={formData.scheduleEnabled}
//                         onChange={(e) => setFormData(prev => ({
//                           ...prev,
//                           scheduleEnabled: e.target.checked
//                         }))}
//                       />
//                       <div>
//                         <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule this announcement</span>
//                         <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>This announcement will be published automatically at the specified date and time</p>
//                       </div>
//                     </label>
//                   </div>
                  
//                   {formData.scheduleEnabled && (
//                     <div className="form-control">
//                       <label className="label">
//                         <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Publication Date and Time</span>
//                       </label>
//                       <div className="flex items-center gap-2">
//                         <input 
//                           type="datetime-local" 
//                           className={`input border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-600 border-slate-500 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
//                           value={formData.scheduledAt}
//                           onChange={(e) => setFormData(prev => ({
//                             ...prev,
//                             scheduledAt: e.target.value
//                           }))}
//                           min={new Date().toISOString().slice(0, 16)}
//                           required={formData.scheduleEnabled}
//                         />
//                       </div>
//                       <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Select the date and time when this announcement should be published</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
          
//           <div className={`lg:col-span-1`}>
//             <div className={`card border p-4 mb-4 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
//               <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Recipient Information</h2>
//               <div className={`flex flex-col space-y-3 p-4 rounded-lg mb-4 max-h-64 overflow-y-auto overflow-x-hidden ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
//                 <div className={`text-sm font-medium flex justify-start w-full border-b pb-2 ${theme === 'light' ? 'text-blue-600 border-slate-300' : 'text-blue-400 border-slate-600'}`}>
//                   {getRecipientTypeLabel(recipientInfo.type)}
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-1 gap-3 mt-2">
//                   {listName.map((name, index) => (
//                     <div key={index} className={`flex items-center p-3 rounded-md shadow-sm hover:shadow-md transition-shadow border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-600 border-slate-500'}`}>
//                       <div className="w-full">
//                         <div className={`font-medium truncate ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{name.name}</div>

//                         <div className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                           {name.position_title ? `${name.company_name} • ${name.department_name} • ${name.position_title} • ${name.job_level}` : 
//                           name.department_name ? `${name.company_name} • ${name.department_name}` : 
//                           name.company_name ? `${name.company_name}` : ''}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="mt-4 text-sm">
//                 <p className={`${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients cannot be changed after an announcement is created. To target different recipients, please create a new announcement.</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className={`mt-8 pt-4 border-t flex justify-end ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
//           <div className="flex-1">
//             {!formData.is_posted && (
//               <button
//                 type="button"
//                 onClick={()=> {
//                   const syntheticEvent = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;
//                   handleSubmit(syntheticEvent, true);
//                 }}
//                 className={`btn btn-outline ${theme === 'light' ? 'border-green-600 text-green-600 hover:bg-green-600' : 'border-green-400 text-green-400 hover:bg-green-400'} hover:text-white`}
//                 disabled={submitDisabled}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//                 {formData.scheduleEnabled ? 'Schedule' : 'Publish'}
//               </button>
//             )}
//           </div>
//           <Link href="/announcements" className={`btn btn-outline mr-3 ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
//             Cancel
//           </Link>
//           <button
//             type="submit"
//             className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
//             disabled={submitDisabled}
//           >
//             {loading ? (
//               <>
//                 <span className="loading loading-spinner loading-sm mr-2"></span>
//                 Updating...
//               </>
//             ) : (
//               <>
//                 <FaSave className="mr-2" /> Update Announcement
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }


// 'use client';

// import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import Link from 'next/link';
// import { FaSave, FaArrowLeft, FaUsers, FaBuilding, FaUserTie, FaUser, FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
// import { API_BASE_URL, API_ROUTES } from '../../../config';
// import toSingaporeTime from '@/app/components/ConvertToSingaporeTimeZone';
// import { format } from 'date-fns';
// import type { EmployeeDocument } from '../../../components/EmployeeDocumentManager';
// import { useTheme } from '../../../components/ThemeProvider';

// import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react';


// /* ======================= Slate (WYSIWYG) ======================= */
// //import { Slate, Editable, withReact, useSlate } from 'slate-react';
// import { createEditor, Editor, Descendant, Node } from 'slate';

// type SlateArray = Descendant[];

// function tryParseJson(input: unknown): unknown {
//   if (typeof input !== 'string') return input;
//   const s = input.trim();
//   if (!s.startsWith('[') && !s.startsWith('{')) return input;
//   try { return JSON.parse(s); } catch { return input; }
// }

// function isSlateArray(val: unknown): val is SlateArray {
//   return Array.isArray(val) && val.every((n) => typeof n === 'object' && n && 'children' in n);
// }

// function textToSlate(text: string): SlateArray {
//   const lines = (text ?? '').split(/\r?\n/);
//   if (lines.length === 0) return [{ type: 'paragraph', children: [{ text: '' }] }];
//   return lines.map((l) => ({ type: 'paragraph', children: [{ text: l }] })) as SlateArray;
// }

// function serialize(node: Descendant): string {
//   if ('type' in (node as any)) {
//     const el = node as any;
//     const children = el.children.map((n: Descendant) => serialize(n)).join('');
//     return el.type === 'paragraph' ? `<p>${children}</p>` : children;
//   }
//   const t = node as any;
//   let s = t.text ?? '';
//   if (t.bold) s = `<strong>${s}</strong>`;
//   if (t.italic) s = `<em>${s}</em>`;
//   if (t.underline) s = `<u>${s}</u>`;
//   return s;
// }


// // Turn an HTML string into a Slate value (paragraphs + marks)
// function htmlToSlate(html: string): SlateArray {
//   const out: SlateArray = [];
//   const wrapper = document.createElement('div');
//   wrapper.innerHTML = html ?? '';

//   // recursive walker that returns an array of leaf nodes (text + marks)
//   const walk = (node: any, marks: { bold?: boolean; italic?: boolean; underline?: boolean } = {}) => {
//     const leaves: Array<{ text: string; bold?: boolean; italic?: boolean; underline?: boolean }> = [];

//     if (node.nodeType === 3) {
//       // TEXT_NODE
//       const text = node.nodeValue ?? '';
//       if (text) leaves.push({ text, ...marks });
//       return leaves;
//     }

//     if (node.nodeType !== 1) return leaves; // not ELEMENT_NODE

//     const tag = (node.tagName || '').toLowerCase();
//     const nextMarks = { ...marks };
//     if (tag === 'strong' || tag === 'b') nextMarks.bold = true;
//     if (tag === 'em' || tag === 'i') nextMarks.italic = true;
//     if (tag === 'u') nextMarks.underline = true;
//     if (tag === 'br') {
//       leaves.push({ text: '\n', ...nextMarks });
//       return leaves;
//     }

//     for (let i = 0; i < node.childNodes.length; i++) {
//       leaves.push(...walk(node.childNodes[i], nextMarks));
//     }
//     return leaves;
//   };

//   // Top-level: treat <p> as blocks, everything else gets wrapped into a paragraph
//   const pushParagraph = (leaves: Array<{ text: string; bold?: boolean; italic?: boolean; underline?: boolean }>) => {
//     const str = leaves.map(l => l.text).join('').replace(/\n/g, '').trim();
//     if (str === '') return; // drop empty paragraphs from HTML like <p><em></em></p>
//     out.push({ type: 'paragraph', children: leaves.length ? leaves : [{ text: '' }] } as any);
//   };

//   for (let i = 0; i < wrapper.childNodes.length; i++) {
//     const child: any = wrapper.childNodes[i];
//     if (child.nodeType === 1 && (child.tagName || '').toLowerCase() === 'p') {
//       pushParagraph(walk(child));
//     } else {
//       const leaves = walk(child);
//       if (leaves.length) pushParagraph(leaves);
//     }
//   }

//   return out.length ? out : [{ type: 'paragraph', children: [{ text: '' }] }];
// }


// const Leaf = ({ attributes, children, leaf }: any) => {
//   if (leaf.bold) children = <strong>{children}</strong>;
//   if (leaf.italic) children = <em>{children}</em>;
//   if (leaf.underline) children = <u>{children}</u>;
//   return <span {...attributes}>{children}</span>;
// };

// function isMarkActive(editor: Editor, format: 'bold' | 'italic' | 'underline'): boolean {
//   type MarkMap = Partial<Record<'bold' | 'italic' | 'underline', boolean>>;
//   const marks = Editor.marks(editor) as MarkMap | null;
//   return marks?.[format] === true;
// }

// function toggleMark(editor: Editor, format: 'bold'|'italic'|'underline') {
//   if (isMarkActive(editor, format)) Editor.removeMark(editor, format);
//   else Editor.addMark(editor, format, true);
// }
// const MarkButton = ({
//   format,
//   label,
//   theme,
// }: {
//   format: 'bold' | 'italic' | 'underline';
//   label: string;
//   theme: string;
// }) => {
//   const editor = useSlate();
//   const active = isMarkActive(editor, format);

//   const base =
//     theme === 'light'
//       ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
//       : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600';

//   const activeCls =
//     theme === 'light'
//       ? 'bg-blue-600 text-white border-blue-600'
//       : 'bg-blue-500 text-white border-blue-500';

//   return (
//     <button
//       type="button"
//       onMouseDown={(e) => {
//         e.preventDefault();
//         toggleMark(editor, format);
//       }}
//       aria-pressed={active}
//       className={`px-2 py-1 rounded-md text-sm font-semibold border transition-colors ${active ? activeCls : base}`}
//       title={label}
//     >
//       {label}
//     </button>
//   );
// };

// /* =============================================================== */

// interface Announcement {
//   id: string;
//   title: string;
//   content: string | unknown; // plain or Slate JSON
//   target_type: string;
//   targets?: {
//     companies?: { id: string; name: string }[];
//     departments?: { id: string; name: string; company_name: string }[];
//     positions?: { id: string; name: string; department_name: string; company_name: string }[];
//     employees?: { id: string; name: string; position_title: string; job_level: string; department_name: string; company_name: string }[];
//   };
//   is_posted?: boolean;
//   scheduled_at?: string;
// }

// interface FormDataShape {
//   title: string;
//   content: string; // JSON.stringified Slate value
//   is_posted?: boolean;
//   scheduleEnabled?: boolean;
//   scheduledAt?: string;
//   attachments?: EmployeeDocument[];
//   documentsToDelete?: number[];
// }

// interface Document {
//   id: number;
//   original_filename: string;
//   file_size: number;
//   content_type: string;
//   download_url: string;
//   uploaded_at: string;
// }

// interface Name{
//   name: string;
//   position_title?: string;
//   job_level?: string;
//   department_name?: string;
//   company_name?: string;
// }

// export default function EditAnnouncementPage() {
//   const { theme } = useTheme();
//   const router = useRouter();
//   const params = useParams();
//   const id = params.id as string;

//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [recipientInfo, setRecipientInfo] = useState<{type: string; name: string}>({type: '', name: ''});
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [listName, setListName] = useState<Name[]>([]);

//   // Slate editor
//   const [editor] = useState(() => withReact(createEditor()));
//   const [editorValue, setEditorValue] = useState<SlateArray>([
//     { type: 'paragraph', children: [{ text: '' }] }
//   ]);
//   const [slateKey, setSlateKey] = useState(0); // force remount when data arrives

//   const [formData, setFormData] = useState<FormDataShape>({
//     title: '',
//     content: JSON.stringify([{ type: 'paragraph', children: [{ text: '' }] }]),
//     is_posted: false,
//     scheduleEnabled: false,
//     scheduledAt: '',
//     attachments: [],
//     documentsToDelete: []
//   });

//   // Keep formData.content in sync with the editor JSON
//   useEffect(() => {
//     setFormData(prev => ({ ...prev, content: JSON.stringify(editorValue) }));
//   }, [editorValue]);

//   // Load attachments
//   const fetchDocuments = useCallback(async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/announcement/announcements/${id}/documents`);
//       if (response.ok) {
//         const data = await response.json();
//         setDocuments(data.documents || []);
//       }
//     } catch (e) {
//       console.error('Error fetching documents:', e);
//     }
//   }, [id]);

//   // Load announcement
//   useEffect(() => {
//     const fetchAnnouncement = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`);
//         if (!response.ok) throw new Error('Failed to fetch announcement');

//         const data = await response.json() as Announcement;

// // Apply content to Slate
// const contentStr = typeof data.content === 'string' ? data.content : '';
// const parsed = tryParseJson(contentStr);

// if (isSlateArray(parsed)) {
//   setEditorValue(parsed as SlateArray);
// } else if (contentStr.trim().startsWith('<')) {
//   // it's HTML -> turn into Slate
//   setEditorValue(htmlToSlate(contentStr));
// } else {
//   // plain text fallback
//   setEditorValue(textToSlate(contentStr));
// }
// setSlateKey(k => k + 1); // ensure initialValue is used


//         setFormData(prev => ({
//           ...prev,
//           title: data.title || '',
//           is_posted: data.is_posted,
//           scheduleEnabled: !!data.scheduled_at,
//           scheduledAt: data.scheduled_at ? format(toSingaporeTime(new Date(data.scheduled_at)), 'yyyy-MM-dd HH:mm') : '',
//           attachments: [],
//           documentsToDelete: []
//         }));

//         if (data.targets) {
//           const hasEmployees = data.targets.employees?.length;
//           const hasDepartments = data.targets.departments?.length;
//           const hasPositions = data.targets.positions?.length;
//           const hasCompanies = data.targets.companies?.length;

//           setRecipientInfo({
//             type: hasEmployees ? 'employee' : hasDepartments ? 'department' :
//                   hasPositions ? 'position' : hasCompanies ? 'company' : '',
//             name: hasEmployees ? (data.targets.employees?.map(emp => emp.name).join(', ') || 'No employees specified') :
//                   hasDepartments ? (data.targets.departments?.map(dept => dept.name).join(', ') || 'No departments specified') :
//                   hasPositions ? (data.targets.positions?.map(pos => pos.name).join(', ') || 'No positions specified') :
//                   hasCompanies ? (data.targets.companies?.map(comp => comp.name).join(', ') || 'No companies specified') : 'All Users'
//           });

//           setListName(
//             hasEmployees ? (data.targets.employees?.map(emp => ({
//               name: emp.name, position_title: emp.position_title, job_level: emp.job_level,
//               department_name: emp.department_name, company_name: emp.company_name
//             })) || []) :
//             hasDepartments ? (data.targets.departments?.map(dept => ({
//               name: dept.name, company_name: dept.company_name
//             })) || []) :
//             hasPositions ? (data.targets.positions?.map(pos => ({
//               name: pos.name, department_name: pos.department_name, company_name: pos.company_name
//             })) || []) :
//             hasCompanies ? (data.targets.companies?.map(comp => ({ name: comp.name })) || []) :
//             [{ name: 'All Users' }]
//           );
//         } else {
//           setRecipientInfo({ type: 'All', name: 'All Users' });
//           setListName([{ name: 'All Users' }]);
//         }

//         await fetchDocuments();
//         setFetchLoading(false);
//       } catch (e) {
//         console.error('Error fetching announcement:', e);
//         setError('Failed to load announcement data');
//         setFetchLoading(false);
//       }
//     };
//     fetchAnnouncement();
//   }, [id, fetchDocuments]);

//   // Re-fetch docs once ready
//   useEffect(() => { if (!fetchLoading) fetchDocuments(); }, [fetchLoading, fetchDocuments]);

//   const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     setFormData(prev => ({ ...prev, title: value }));
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>, isPost: boolean = false) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const fd = new FormData();
//       fd.append('data', JSON.stringify({
//         title: formData.title,
//         content: editorValue.map(serialize).join(''),//content: formData.content, // Slate JSON string
//         is_posted: isPost,
//         scheduled_at: formData.scheduleEnabled && formData.scheduledAt ? formData.scheduledAt : null,
//         documents_to_delete: formData.documentsToDelete || []
//       }));

//       if (formData.attachments?.length) {
//         formData.attachments.forEach(doc => {
//           if ((doc as any).file) fd.append('attachments[]', (doc as any).file as File);
//         });
//       }

//       const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`, {
//         method: 'PUT',
//         body: fd,
//       });
//       if (!response.ok) throw new Error('Failed to update announcement');

//       if (formData.documentsToDelete?.length) {
//         const responseDelete = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}/documents`, {
//           method: 'DELETE',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ document_id: formData.documentsToDelete, announcement_id: id })
//         });
//         if (!responseDelete.ok) throw new Error('Failed to delete documents');
//       }

//       router.push('/announcements');
//     } catch (e) {
//       console.error('Error updating announcement:', e);
//       setError('Failed to update announcement. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getRecipientTypeLabel = (type: string) => {
//     switch (type) {
//       case 'company': return 'Company';
//       case 'department': return 'Department';
//       case 'position': return 'Position';
//       case 'employee': return 'Employee';
//       default: return 'All';
//     }
//   };

//   if (fetchLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
//       </div>
//     );
//   }

//   // prevent empty submit
//   const plain = editorValue.map(n => Node.string(n)).join('').trim();
//   const submitDisabled = loading || (formData.scheduleEnabled && !formData.scheduledAt) || plain.length === 0;

//   return (
//     <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
//       <div className="flex justify-between items-center mb-6">
//         <nav className="text-sm breadcrumbs">
//           <ul>
//             <li><Link href="/" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Dashboard</Link></li>
//             <li><Link href="/announcements" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Announcements</Link></li>
//             <li className="font-semibold">Edit Announcement</li>
//           </ul>
//         </nav>
//         <Link href="/announcements" className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
//           <FaArrowLeft className="mr-2" /> Back to Announcements
//         </Link>
//       </div>

//       <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Edit Announcement</h1>

//       {error && (
//         <div className={`alert mb-6 ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
//           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <span>{error}</span>
//         </div>
//       )}

//       <form onSubmit={(e)=>handleSubmit(e, formData.is_posted ?? false)} className={`p-6 rounded-lg shadow ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2">
//             <div className="mb-8">
//               <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Announcement Details</h2>
//               <div className="grid grid-cols-1 gap-6 mb-6">
//                 <div>
//                   <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Title</div>
//                   <input
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleTitleChange}
//                     className={`input w-full border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
//                     required
//                     placeholder="Enter announcement title"
//                   />
//                 </div>

//                 {/* WYSIWYG CONTENT (no preview) */}
// {/* WYSIWYG CONTENT (no preview) */}
// <div>
//   <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//     Content <span className="text-red-500">*</span>
//   </div>

// <Slate
//   key={slateKey}
//   editor={editor}
//   initialValue={editorValue}
//   onChange={setEditorValue}
// >

//     {/* Toolbar */}
//     <div
//                       className={`flex items-center gap-2 p-2 border-b ${
//                         theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700'
//                       }`}
//     >
//       {/* <MarkButton format="bold" label="B" theme={theme} />
//       <MarkButton format="italic" label="I" theme={theme} />
//       <MarkButton format="underline" label="U" theme={theme} /> */}
//        <MarkButton format="bold" icon={<FaBold />} theme={theme} />
//                             <MarkButton format="italic" icon={<FaItalic />} theme={theme} />
//                             <MarkButton format="underline" icon={<FaUnderline />} theme={theme} />
//     </div>

//     {/* Single bordered wrapper */}
//     <div
//       className={`rounded-lg border p-3 min-h-[220px] ${
//         theme === 'light'
//           ? 'bg-white border-slate-300 focus-within:ring-2 focus-within:ring-blue-500'
//           : 'bg-slate-700 border-slate-600 focus-within:ring-2 focus-within:ring-blue-400'
//       }`}
//     >
//       <Editable
//         renderLeaf={(props) => <Leaf {...props} />}
//         placeholder="Type your announcement here…"
//         spellCheck
//         // remove any inner border/outline/ring
//         className="min-h-[200px] w-full outline-none focus:outline-none ring-0 focus:ring-0 border-0"
//         style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
//         onKeyDown={(e) => {
//           if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
//             e.preventDefault();
//             toggleMark(editor, 'bold');
//           }
//           if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
//             e.preventDefault();
//             toggleMark(editor, 'italic');
//           }
//           if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'u') {
//             e.preventDefault();
//             toggleMark(editor, 'underline');
//           }
//         }}
//       />
//     </div>
//   </Slate>
// </div>


//                 {/* Attachments */}
//                 <div className="mt-2">
//                   <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Attachments</div>
//                   <div className={`border rounded-lg p-4 ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
//                     <div className="flex justify-between flex-row mb-2">
//                       <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Announcement Attachments</h3>
//                       <label htmlFor="attachment-upload" className={`btn btn-sm btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
//                         Add
//                       </label>
//                       <input
//                         id="attachment-upload"
//                         type="file"
//                         multiple
//                         className="hidden"
//                         onChange={(e) => {
//                           if (!e.target.files?.length) return;
//                           const files = Array.from(e.target.files);
//                           const newAttachments = files.map(file => ({
//                             name: file.name,
//                             file,
//                             documentType: 'AnnouncementAttachment'
//                           })) as unknown as EmployeeDocument[];
//                           setFormData(prev => ({
//                             ...prev,
//                             attachments: [...(prev.attachments || []), ...newAttachments]
//                           }));
//                         }}
//                       />
//                     </div>

//                     {/* Existing attachments */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//                       {documents.map((doc) => {
//                         const isMarkedForDeletion = formData.documentsToDelete?.includes(doc.id);
//                         return (
//                           <div key={`doc-${doc.id}`} className={`card border ${isMarkedForDeletion ? 'hidden' : ''} ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-700 border-slate-600'}`}>
//                             <div className="card-body p-4">
//                               <div className="flex items-start justify-between">
//                                 <div className="flex-1">
//                                   <h4 className={`card-title text-sm mb-1 truncate ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`} title={doc.original_filename}>
//                                     {doc.original_filename}
//                                   </h4>
//                                   <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                                     Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
//                                   </p>
//                                 </div>
//                                 <button
//                                   type="button"
//                                   className={`btn btn-ghost btn-xs ${isMarkedForDeletion ? 'text-green-500' : 'text-red-500'}`}
//                                   onClick={() => {
//                                     setFormData(prev => {
//                                       const del = prev.documentsToDelete || [];
//                                       return isMarkedForDeletion
//                                         ? { ...prev, documentsToDelete: del.filter(did => did !== doc.id) }
//                                         : { ...prev, documentsToDelete: [...del, doc.id] };
//                                     });
//                                   }}
//                                 >
//                                   {isMarkedForDeletion ? 'Undo' : 'Remove'}
//                                 </button>
//                               </div>
//                               <div className="mt-2">
//                                 <a href={doc.download_url} target="_blank" rel="noopener noreferrer" className={`btn btn-sm w-full ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}>
//                                   View Document
//                                 </a>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}

//                       {/* New uploads */}
//                       {formData.attachments?.map((file, index) => (
//                         <div key={`upload-${index}`} className={`card border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-700 border-slate-600'}`}>
//                           <div className="card-body p-4">
//                             <div className="flex items-start justify-between">
//                               <div className="flex-1">
//                                 <h4 className={`card-title text-sm mb-1 truncate ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`} title={(file as any).name}>
//                                   {(file as any).name} <span className="ml-1 text-xs text-blue-500">(New)</span>
//                                 </h4>
//                               </div>
//                               <button
//                                 type="button"
//                                 className="btn btn-ghost btn-xs text-red-500"
//                                 onClick={() => {
//                                   setFormData(prev => ({
//                                     ...prev,
//                                     attachments: prev.attachments?.filter((_, i) => i !== index) || []
//                                   }));
//                                 }}
//                               >
//                                 Remove
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//                 {/* /Attachments */}
//               </div>
//             </div>

//             {/* Schedule */}
//             {!formData.is_posted && (
//               <div className={`mb-8 p-4 rounded-lg ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
//                 <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule Options</h3>
//                 <div className="space-y-4">
//                   <label className="label cursor-pointer justify-start gap-3">
//                     <input
//                       type="checkbox"
//                       className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
//                       checked={formData.scheduleEnabled}
//                       onChange={(e) => setFormData(prev => ({ ...prev, scheduleEnabled: e.target.checked }))}
//                     />
//                     <div>
//                       <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule this announcement</span>
//                       <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>It will be published at the specified date and time</p>
//                     </div>
//                   </label>
//                   {formData.scheduleEnabled && (
//                     <div>
//                       <label className="label">
//                         <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Publication Date and Time</span>
//                       </label>
//                       <input
//                         type="datetime-local"
//                         className={`input border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-600 border-slate-500 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
//                         value={formData.scheduledAt}
//                         onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
//                         min={new Date().toISOString().slice(0, 16)}
//                         required={formData.scheduleEnabled}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right column: recipients */}
//           <div className="lg:col-span-1">
//             <div className={`card border p-4 mb-4 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
//               <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Recipient Information</h2>
//               <div className={`flex flex-col space-y-3 p-4 rounded-lg mb-4 max-h-64 overflow-y-auto overflow-x-hidden ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
//                 <div className={`text-sm font-medium flex justify-start w-full border-b pb-2 ${theme === 'light' ? 'text-blue-600 border-slate-300' : 'text-blue-400 border-slate-600'}`}>
//                   {getRecipientTypeLabel(recipientInfo.type)}
//                 </div>
//                 <div className="grid grid-cols-1 gap-3 mt-2">
//                   {listName.map((name, index) => (
//                     <div key={index} className={`flex items-center p-3 rounded-md shadow-sm hover:shadow-md transition-shadow border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-600 border-slate-500'}`}>
//                       <div className="w-full">
//                         <div className={`font-medium truncate ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{name.name}</div>
//                         <div className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                           {name.position_title ? `${name.company_name} • ${name.department_name} • ${name.position_title} • ${name.job_level}` :
//                            name.department_name ? `${name.company_name} • ${name.department_name}` :
//                            name.company_name ? `${name.company_name}` : ''}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="mt-4 text-sm">
//                 <p className={`${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients cannot be changed after creation. To target different recipients, create a new announcement.</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className={`mt-8 pt-4 border-t flex justify-end ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
//           <div className="flex-1">
//             {!formData.is_posted && (
//               <button
//                 type="button"
//                 onClick={()=> {
//                   const syntheticEvent = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;
//                   handleSubmit(syntheticEvent, true);
//                 }}
//                 className={`btn btn-outline ${theme === 'light' ? 'border-green-600 text-green-600 hover:bg-green-600' : 'border-green-400 text-green-400 hover:bg-green-400'} hover:text-white`}
//                 disabled={submitDisabled}
//               >
//                 {formData.scheduleEnabled ? 'Schedule' : 'Publish'}
//               </button>
//             )}
//           </div>
//           <Link href="/announcements" className={`btn btn-outline mr-3 ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
//             Cancel
//           </Link>
//           <button
//             type="submit"
//             className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
//             disabled={submitDisabled}
//           >
//             {loading ? (<><span className="loading loading-spinner loading-sm mr-2"></span>Updating...</>) : (<><FaSave className="mr-2" /> Update Announcement</>)}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }


'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback, ReactNode } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaSave, FaArrowLeft, FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import { API_BASE_URL, API_ROUTES } from '../../../config';
import toSingaporeTime from '@/app/components/ConvertToSingaporeTimeZone';
import { format } from 'date-fns';
import type { EmployeeDocument } from '../../../components/EmployeeDocumentManager';
import { useTheme } from '../../../components/ThemeProvider';

import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { createEditor, Editor, Descendant, Node } from 'slate';

/* ======================= Slate (WYSIWYG) ======================= */

type SlateArray = Descendant[];

function tryParseJson(input: unknown): unknown {
  if (typeof input !== 'string') return input;
  const s = input.trim();
  if (!s.startsWith('[') && !s.startsWith('{')) return input;
  try { return JSON.parse(s); } catch { return input; }
}

function isSlateArray(val: unknown): val is SlateArray {
  return Array.isArray(val) && val.every((n) => typeof n === 'object' && n && 'children' in n);
}

function textToSlate(text: string): SlateArray {
  const lines = (text ?? '').split(/\r?\n/);
  if (lines.length === 0) return [{ type: 'paragraph', children: [{ text: '' }] }];
  return lines.map((l) => ({ type: 'paragraph', children: [{ text: l }] })) as SlateArray;
}

function serialize(node: Descendant): string {
  if ('type' in (node as any)) {
    const el = node as any;
    const children = el.children.map((n: Descendant) => serialize(n)).join('');
    return el.type === 'paragraph' ? `<p>${children}</p>` : children;
  }
  const t = node as any;
  let s = t.text ?? '';
  if (t.bold) s = `<strong>${s}</strong>`;
  if (t.italic) s = `<em>${s}</em>`;
  if (t.underline) s = `<u>${s}</u>`;
  return s;
}

// Turn an HTML string into a Slate value (paragraphs + marks)
function htmlToSlate(html: string): SlateArray {
  const out: SlateArray = [];
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html ?? '';

  const walk = (
    node: any,
    marks: { bold?: boolean; italic?: boolean; underline?: boolean } = {}
  ) => {
    const leaves: Array<{ text: string; bold?: boolean; italic?: boolean; underline?: boolean }> = [];

    if (node.nodeType === 3) {
      const text = node.nodeValue ?? '';
      if (text) leaves.push({ text, ...marks });
      return leaves;
    }

    if (node.nodeType !== 1) return leaves;

    const tag = (node.tagName || '').toLowerCase();
    const nextMarks = { ...marks };
    if (tag === 'strong' || tag === 'b') nextMarks.bold = true;
    if (tag === 'em' || tag === 'i') nextMarks.italic = true;
    if (tag === 'u') nextMarks.underline = true;
    if (tag === 'br') {
      leaves.push({ text: '\n', ...nextMarks });
      return leaves;
    }

    for (let i = 0; i < node.childNodes.length; i++) {
      leaves.push(...walk(node.childNodes[i], nextMarks));
    }
    return leaves;
  };

  const pushParagraph = (leaves: Array<{ text: string; bold?: boolean; italic?: boolean; underline?: boolean }>) => {
    const str = leaves.map(l => l.text).join('').replace(/\n/g, '').trim();
    if (str === '') return;
    out.push({ type: 'paragraph', children: leaves.length ? leaves : [{ text: '' }] } as any);
  };

  for (let i = 0; i < wrapper.childNodes.length; i++) {
    const child: any = wrapper.childNodes[i];
    if (child.nodeType === 1 && (child.tagName || '').toLowerCase() === 'p') {
      pushParagraph(walk(child));
    } else {
      const leaves = walk(child);
      if (leaves.length) pushParagraph(leaves);
    }
  }

  return out.length ? out : [{ type: 'paragraph', children: [{ text: '' }] }];
}

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  return <span {...attributes}>{children}</span>;
};

function isMarkActive(editor: Editor, format: 'bold' | 'italic' | 'underline'): boolean {
  type MarkMap = Partial<Record<'bold' | 'italic' | 'underline', boolean>>;
  const marks = Editor.marks(editor) as MarkMap | null;
  return marks?.[format] === true;
}

function toggleMark(editor: Editor, format: 'bold'|'italic'|'underline') {
  if (isMarkActive(editor, format)) Editor.removeMark(editor, format);
  else Editor.addMark(editor, format, true);
}

// UPDATED: accept icon OR label (label optional)
const MarkButton = ({
  format,
  theme,
  label,
  icon,
}: {
  format: 'bold' | 'italic' | 'underline';
  theme: string;
  label?: string;
  icon?: ReactNode;
}) => {
  const editor = useSlate();
  const active = isMarkActive(editor, format);

  const base =
    theme === 'light'
      ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
      : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600';

  const activeCls =
    theme === 'light'
      ? 'bg-blue-600 text-white border-blue-600'
      : 'bg-blue-500 text-white border-blue-500';

  const fallbackLabel = label ?? format;

  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
      aria-pressed={active}
      aria-label={fallbackLabel}
      title={fallbackLabel}
      className={`px-2 py-1 rounded-md text-sm font-semibold border transition-colors ${active ? activeCls : base}`}
    >
      {icon ?? fallbackLabel}
    </button>
  );
};

/* =============================================================== */

interface Announcement {
  id: string;
  title: string;
  content: string | unknown; // plain or Slate JSON
  target_type: string;
  targets?: {
    companies?: { id: string; name: string }[];
    departments?: { id: string; name: string; company_name: string }[];
    positions?: { id: string; name: string; department_name: string; company_name: string }[];
    employees?: { id: string; name: string; position_title: string; job_level: string; department_name: string; company_name: string }[];
  };
  is_posted?: boolean;
  scheduled_at?: string;
}

interface FormDataShape {
  title: string;
  content: string; // JSON.stringified Slate value
  is_posted?: boolean;
  scheduleEnabled?: boolean;
  scheduledAt?: string;
  attachments?: EmployeeDocument[];
  documentsToDelete?: number[];
}

interface Document {
  id: number;
  original_filename: string;
  file_size: number;
  content_type: string;
  download_url: string;
  uploaded_at: string;
}

interface Name{
  name: string;
  position_title?: string;
  job_level?: string;
  department_name?: string;
  company_name?: string;
}

export default function EditAnnouncementPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [recipientInfo, setRecipientInfo] = useState<{type: string; name: string}>({type: '', name: ''});
  const [documents, setDocuments] = useState<Document[]>([]);
  const [listName, setListName] = useState<Name[]>([]);

  // Slate editor
  const [editor] = useState(() => withReact(createEditor()));
  const [editorValue, setEditorValue] = useState<SlateArray>([
    { type: 'paragraph', children: [{ text: '' }] }
  ]);
  const [slateKey, setSlateKey] = useState(0); // force remount when data arrives

  const [formData, setFormData] = useState<FormDataShape>({
    title: '',
    content: JSON.stringify([{ type: 'paragraph', children: [{ text: '' }] }]),
    is_posted: false,
    scheduleEnabled: false,
    scheduledAt: '',
    attachments: [],
    documentsToDelete: []
  });

  // Keep formData.content in sync with the editor JSON
  useEffect(() => {
    setFormData(prev => ({ ...prev, content: JSON.stringify(editorValue) }));
  }, [editorValue]);

  // Load attachments
  const fetchDocuments = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/announcement/announcements/${id}/documents`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      }
    } catch (e) {
      console.error('Error fetching documents:', e);
    }
  }, [id]);

  // Load announcement
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch announcement');

        const data = (await response.json()) as Announcement;

        // Apply content to Slate (handles array JSON, HTML, or plain text)
        const raw = data.content;
        if (Array.isArray(raw) && isSlateArray(raw)) {
          setEditorValue(raw as SlateArray);
        } else if (typeof raw === 'string') {
          const parsed = tryParseJson(raw);
          if (isSlateArray(parsed)) {
            setEditorValue(parsed as SlateArray);
          } else if (raw.trim().startsWith('<')) {
            setEditorValue(htmlToSlate(raw));
          } else {
            setEditorValue(textToSlate(raw));
          }
        } else {
          setEditorValue(textToSlate(String(raw ?? '')));
        }
        setSlateKey(k => k + 1); // ensure initialValue is used

        setFormData(prev => ({
          ...prev,
          title: data.title || '',
          is_posted: data.is_posted,
          scheduleEnabled: !!data.scheduled_at,
          scheduledAt: data.scheduled_at ? format(toSingaporeTime(new Date(data.scheduled_at)), 'yyyy-MM-dd HH:mm') : '',
          attachments: [],
          documentsToDelete: []
        }));

        if (data.targets) {
          const hasEmployees = data.targets.employees?.length;
          const hasDepartments = data.targets.departments?.length;
          const hasPositions = data.targets.positions?.length;
          const hasCompanies = data.targets.companies?.length;

          setRecipientInfo({
            type: hasEmployees ? 'employee' : hasDepartments ? 'department' :
                  hasPositions ? 'position' : hasCompanies ? 'company' : '',
            name: hasEmployees ? (data.targets.employees?.map(emp => emp.name).join(', ') || 'No employees specified') :
                  hasDepartments ? (data.targets.departments?.map(dept => dept.name).join(', ') || 'No departments specified') :
                  hasPositions ? (data.targets.positions?.map(pos => pos.name).join(', ') || 'No positions specified') :
                  hasCompanies ? (data.targets.companies?.map(comp => comp.name).join(', ') || 'No companies specified') : 'All Users'
          });

          setListName(
            hasEmployees ? (data.targets.employees?.map(emp => ({
              name: emp.name, position_title: emp.position_title, job_level: emp.job_level,
              department_name: emp.department_name, company_name: emp.company_name
            })) || []) :
            hasDepartments ? (data.targets.departments?.map(dept => ({
              name: dept.name, company_name: dept.company_name
            })) || []) :
            hasPositions ? (data.targets.positions?.map(pos => ({
              name: pos.name, department_name: pos.department_name, company_name: pos.company_name
            })) || []) :
            hasCompanies ? (data.targets.companies?.map(comp => ({ name: comp.name })) || []) :
            [{ name: 'All Users' }]
          );
        } else {
          setRecipientInfo({ type: 'All', name: 'All Users' });
          setListName([{ name: 'All Users' }]);
        }

        await fetchDocuments();
        setFetchLoading(false);
      } catch (e) {
        console.error('Error fetching announcement:', e);
        setError('Failed to load announcement data');
        setFetchLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id, fetchDocuments]);

  // Re-fetch docs once ready
  useEffect(() => { if (!fetchLoading) fetchDocuments(); }, [fetchLoading, fetchDocuments]);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, title: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, isPost: boolean = false) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('data', JSON.stringify({
        title: formData.title,
        content: editorValue.map(serialize).join(''), // send as HTML string
        is_posted: isPost,
        scheduled_at: formData.scheduleEnabled && formData.scheduledAt ? formData.scheduledAt : null,
        documents_to_delete: formData.documentsToDelete || []
      }));

      if (formData.attachments?.length) {
        formData.attachments.forEach(doc => {
          if ((doc as any).file) fd.append('attachments[]', (doc as any).file as File);
        });
      }

      const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`, {
        method: 'PUT',
        body: fd,
      });
      if (!response.ok) throw new Error('Failed to update announcement');

      if (formData.documentsToDelete?.length) {
        const responseDelete = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}/documents`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ document_id: formData.documentsToDelete, announcement_id: id })
        });
        if (!responseDelete.ok) throw new Error('Failed to delete documents');
      }

      router.push('/announcements');
    } catch (e) {
      console.error('Error updating announcement:', e);
      setError('Failed to update announcement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRecipientTypeLabel = (type: string) => {
    switch (type) {
      case 'company': return 'Company';
      case 'department': return 'Department';
      case 'position': return 'Position';
      case 'employee': return 'Employee';
      default: return 'All';
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
      </div>
    );
  }

  // prevent empty submit
  const plain = editorValue.map(n => Node.string(n)).join('').trim();
  const submitDisabled = loading || (formData.scheduleEnabled && !formData.scheduledAt) || plain.length === 0;

  return (
    <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
      <div className="flex justify-between items-center mb-6">
        <nav className="text-sm breadcrumbs">
          <ul>
            <li><Link href="/" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Dashboard</Link></li>
            <li><Link href="/announcements" className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>Announcements</Link></li>
            <li className="font-semibold">Edit Announcement</li>
          </ul>
        </nav>
        <Link href="/announcements" className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
          <FaArrowLeft className="mr-2" /> Back to Announcements
        </Link>
      </div>

      <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Edit Announcement</h1>

      {error && (
        <div className={`alert mb-6 ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={(e)=>handleSubmit(e, formData.is_posted ?? false)} className={`p-6 rounded-lg shadow ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Announcement Details</h2>
              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Title</div>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className={`input w-full border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
                    required
                    placeholder="Enter announcement title"
                  />
                </div>

                {/* WYSIWYG CONTENT */}
                <div>
                  <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                    Content <span className="text-red-500">*</span>
                  </div>

                  <Slate
                    key={slateKey}
                    editor={editor}
                    initialValue={editorValue}
                    onChange={setEditorValue}
                  >
                    {/* Toolbar */}
                    <div
                      className={`flex items-center gap-2 p-2 border-b ${
                        theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700'
                      }`}
                    >
                      <MarkButton format="bold" theme={theme} icon={<FaBold />} label="Bold" />
                      <MarkButton format="italic" theme={theme} icon={<FaItalic />} label="Italic" />
                      <MarkButton format="underline" theme={theme} icon={<FaUnderline />} label="Underline" />
                    </div>

                    {/* Editor */}
                    <div
                      className={`rounded-lg border p-3 min-h-[220px] ${
                        theme === 'light'
                          ? 'bg-white border-slate-300 focus-within:ring-2 focus-within:ring-blue-500'
                          : 'bg-slate-700 border-slate-600 focus-within:ring-2 focus-within:ring-blue-400'
                      }`}
                    >
                      <Editable
                        renderLeaf={(props) => <Leaf {...props} />}
                        placeholder="Type your announcement here…"
                        spellCheck
                        className="min-h-[200px] w-full outline-none focus:outline-none ring-0 focus:ring-0 border-0"
                        style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                        onKeyDown={(e) => {
                          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
                            e.preventDefault();
                            toggleMark(editor, 'bold');
                          }
                          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
                            e.preventDefault();
                            toggleMark(editor, 'italic');
                          }
                          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'u') {
                            e.preventDefault();
                            toggleMark(editor, 'underline');
                          }
                        }}
                      />
                    </div>
                  </Slate>
                </div>

                {/* Attachments */}
                <div className="mt-2">
                  <div className={`mb-2 font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Attachments</div>
                  <div className={`border rounded-lg p-4 ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
                    <div className="flex justify-between flex-row mb-2">
                      <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Announcement Attachments</h3>
                      <label htmlFor="attachment-upload" className={`btn btn-sm btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
                        Add
                      </label>
                      <input
                        id="attachment-upload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (!e.target.files?.length) return;
                          const files = Array.from(e.target.files);
                          const newAttachments = files.map(file => ({
                            name: file.name,
                            file,
                            documentType: 'AnnouncementAttachment'
                          })) as unknown as EmployeeDocument[];
                          setFormData(prev => ({
                            ...prev,
                            attachments: [...(prev.attachments || []), ...newAttachments]
                          }));
                        }}
                      />
                    </div>

                    {/* Existing attachments */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {documents.map((doc) => {
                        const isMarkedForDeletion = formData.documentsToDelete?.includes(doc.id);
                        return (
                          <div key={`doc-${doc.id}`} className={`card border ${isMarkedForDeletion ? 'hidden' : ''} ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-700 border-slate-600'}`}>
                            <div className="card-body p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className={`card-title text-sm mb-1 truncate ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`} title={doc.original_filename}>
                                    {doc.original_filename}
                                  </h4>
                                  <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                                    Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  className={`btn btn-ghost btn-xs ${isMarkedForDeletion ? 'text-green-500' : 'text-red-500'}`}
                                  onClick={() => {
                                    setFormData(prev => {
                                      const del = prev.documentsToDelete || [];
                                      return isMarkedForDeletion
                                        ? { ...prev, documentsToDelete: del.filter(did => did !== doc.id) }
                                        : { ...prev, documentsToDelete: [...del, doc.id] };
                                    });
                                  }}
                                >
                                  {isMarkedForDeletion ? 'Undo' : 'Remove'}
                                </button>
                              </div>
                              <div className="mt-2">
                                <a href={doc.download_url} target="_blank" rel="noopener noreferrer" className={`btn btn-sm w-full ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}>
                                  View Document
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* New uploads */}
                      {formData.attachments?.map((file, index) => (
                        <div key={`upload-${index}`} className={`card border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-700 border-slate-600'}`}>
                          <div className="card-body p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className={`card-title text-sm mb-1 truncate ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`} title={(file as any).name}>
                                  {(file as any).name} <span className="ml-1 text-xs text-blue-500">(New)</span>
                                </h4>
                              </div>
                              <button
                                type="button"
                                className="btn btn-ghost btn-xs text-red-500"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    attachments: prev.attachments?.filter((_, i) => i !== index) || []
                                  }));
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* /Attachments */}
              </div>
            </div>

            {/* Schedule */}
            {!formData.is_posted && (
              <div className={`mb-8 p-4 rounded-lg ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule Options</h3>
                <div className="space-y-4">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
                      checked={formData.scheduleEnabled}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduleEnabled: e.target.checked }))}
                    />
                    <div>
                      <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Schedule this announcement</span>
                      <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>It will be published at the specified date and time</p>
                    </div>
                  </label>
                  {formData.scheduleEnabled && (
                    <div>
                      <label className="label">
                        <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Publication Date and Time</span>
                      </label>
                      <input
                        type="datetime-local"
                        className={`input border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-600 border-slate-500 text-slate-100 focus:border-blue-400'} rounded-lg px-3 py-2`}
                        value={formData.scheduledAt}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                        min={new Date().toISOString().slice(0, 16)}
                        required={formData.scheduleEnabled}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right column: recipients */}
          <div className="lg:col-span-1">
            <div className={`card border p-4 mb-4 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
              <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Recipient Information</h2>
              <div className={`flex flex-col space-y-3 p-4 rounded-lg mb-4 max-h-64 overflow-y-auto overflow-x-hidden ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                <div className={`text-sm font-medium flex justify-start w-full border-b pb-2 ${theme === 'light' ? 'text-blue-600 border-slate-300' : 'text-blue-400 border-slate-600'}`}>
                  {getRecipientTypeLabel(recipientInfo.type)}
                </div>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  {listName.map((name, index) => (
                    <div key={index} className={`flex items-center p-3 rounded-md shadow-sm hover:shadow-md transition-shadow border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-600 border-slate-500'}`}>
                      <div className="w-full">
                        <div className={`font-medium truncate ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{name.name}</div>
                        <div className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                          {name.position_title ? `${name.company_name} • ${name.department_name} • ${name.position_title} • ${name.job_level}` :
                           name.department_name ? `${name.company_name} • ${name.department_name}` :
                           name.company_name ? `${name.company_name}` : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 text-sm">
                <p className={`${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Recipients cannot be changed after creation. To target different recipients, create a new announcement.</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-8 pt-4 border-t flex justify-end ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
          <div className="flex-1">
            {!formData.is_posted && (
              <button
                type="button"
                onClick={()=> {
                  const syntheticEvent = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;
                  handleSubmit(syntheticEvent, true);
                }}
                className={`btn btn-outline ${theme === 'light' ? 'border-green-600 text-green-600 hover:bg-green-600' : 'border-green-400 text-green-400 hover:bg-green-400'} hover:text-white`}
                disabled={submitDisabled}
              >
                {formData.scheduleEnabled ? 'Schedule' : 'Publish'}
              </button>
            )}
          </div>
          <Link href="/announcements" className={`btn btn-outline mr-3 ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}>
            Cancel
          </Link>
          <button
            type="submit"
            className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
            disabled={submitDisabled}
          >
            {loading ? (<><span className="loading loading-spinner loading-sm mr-2"></span>Updating...</>) : (<><FaSave className="mr-2" /> Update Announcement</>)}
          </button>
        </div>
      </form>
    </div>
  );
}
