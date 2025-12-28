// 'use client';

// import React, { useState, useRef, ChangeEvent, useEffect, useCallback } from 'react';
// import { API_BASE_URL } from '../config';
// import { toast } from 'react-hot-toast';

// export interface EmployeeDocument {
//   id?: number;
//   name: string;
//   url?: string;
//   key?: string;
//   file?: File;
//   uploadDate?: string;
//   documentType: string;
// }

// interface DocumentTypeConfig {
//   type: string;
//   label: string;
//   description: string;
// }

// interface EmployeeDocumentManagerProps {
//   employeeId: number | null;
//   mode: "add" | "edit" | "view";
//   initialDocuments?: EmployeeDocument[];
//   onDocumentsUploaded?: () => void;
//   onDocumentDeleted?: (removedFile?: EmployeeDocument) => void;
//   documentTypes: DocumentTypeConfig[];
//   moduleName?: string;
//   customUploadEndpoint?: string;
//   customDeleteEndpoint?: string;
//   customViewEndpoint?: string;
//   onFilesSelected?: (files: EmployeeDocument[]) => void;
// }

// const DOCUMENT_TYPES = {
//   ID: 'ID',
//   Passport: 'Passport',
//   Work_Permit: 'Work_Permit',
//   Employment_Agreement: 'Employment_Agreement',
//   Education: 'Education',
//   Resume: 'Resume',
//   Other: 'Other'
// } as const;

// // Helper function to group documents by type
// const groupDocumentsByType = (documents: EmployeeDocument[]) => {
//   return documents.reduce((acc, doc) => {
//     if (!acc[doc.documentType]) {
//       acc[doc.documentType] = [];
//     }
//     acc[doc.documentType].push(doc);
//     return acc;
//   }, {} as { [key: string]: EmployeeDocument[] });
// };

// const EmployeeDocumentManager: React.FC<EmployeeDocumentManagerProps> = ({
//   employeeId,
//   mode,
//   initialDocuments = [],
//   onDocumentsUploaded,
//   onDocumentDeleted,
//   documentTypes,
//   moduleName = 'employee',
//   customUploadEndpoint,
//   customDeleteEndpoint,
//   customViewEndpoint,
//   onFilesSelected,
// }) => {
//   const [selectedFiles, setSelectedFiles] = useState<EmployeeDocument[]>([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isDeleting, setIsDeleting] = useState<{ [key: string]: boolean }>({});
//   const [deleteError, setDeleteError] = useState<{ [key: string]: string }>({});
//   const [uploadStatus, setUploadStatus] = useState<{
//     success: boolean;
//     message: string;
//   } | null>(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
//     show: boolean;
//     documentType: string;
//     index: number;
//     document: EmployeeDocument;
//   } | null>(null);
//   const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
//   const [previousEmployeeId, setPreviousEmployeeId] = useState<number | null>(employeeId);
//   const [documentsByType, setDocumentsByType] = useState<{ [key: string]: EmployeeDocument[] }>(
//     groupDocumentsByType(initialDocuments)
//   );

//   // Track changes to initialDocuments
//   useEffect(() => {
    
//     setDocumentsByType(groupDocumentsByType(initialDocuments));
//   }, [initialDocuments]);

//   // Function to set ref
//   const setFileInputRef = (documentType: string) => (el: HTMLInputElement | null) => {
//     fileInputRefs.current[documentType] = el;
//   };

//     const handleUploadClick = useCallback(async () => {//async () => {
    
//     if (employeeId) {
//       try {
//         setIsUploading(true);
//         setUploadStatus(null);

//         // Use newly selected files from initialDocuments for upload (all tabs)
//         const filesToUpload = initialDocuments.filter(doc => !doc.id && doc.file);

//         const results = await Promise.all(
//           filesToUpload.map(async (doc) => {
//             if (!doc.file) return null;

//             // Use custom endpoint if provided, otherwise use default
//             const uploadRequestEndpoint = customUploadEndpoint || 
//               `${API_BASE_URL}/api/employees/${employeeId}/documents/upload-request`;

//             const uploadRequestResponse = await fetch(uploadRequestEndpoint, {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 documentType: doc.documentType,
//                 filename: doc.name,
//                 contentType: doc.file.type,
//                 moduleName
//               }),
//             });

//             const responseData = await uploadRequestResponse.json();

//             if (!uploadRequestResponse.ok) {
//               throw new Error(`Failed to get upload URL for ${doc.name}: ${JSON.stringify(responseData)}`);
//             }

//             const { uploadUrl, s3Key, contentType } = responseData;

//             // Step 2: Upload file to S3 using the presigned URL
//             try {
//               const uploadToS3Response = await fetch(uploadUrl, {
//                 method: 'PUT',
//                 body: doc.file,
//                 headers: {
//                   'Content-Type': contentType
//                 }
//               });

//               if (!uploadToS3Response.ok) {
//                 const errorText = await uploadToS3Response.text();
//                 throw new Error(`Failed to upload ${doc.name} to storage: ${errorText}`);
//               }
//             } catch (error) {
//               console.error('S3 upload error:', error);
//               throw error;
//             }

//             // Use custom endpoint for metadata if provided
//             const metadataEndpoint = customUploadEndpoint || 
//               `${API_BASE_URL}/api/employees/${employeeId}/documents`;

//             const metadataResponse = await fetch(metadataEndpoint, {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 documentType: doc.documentType,
//                 s3Key,
//                 originalFilename: doc.name,
//                 fileSize: doc.file.size,
//                 contentType,
//                 moduleName
//               }),
//             });

//             if (!metadataResponse.ok) {
//               throw new Error(`Failed to save metadata for ${doc.name}`);
//             }

//             return await metadataResponse.json();
//           })
//         );

//         // Filter out null results (from failed uploads)
//         const successfulUploads = results.filter(result => result !== null);

//         setUploadStatus({
//           success: true,
//           message: `Successfully uploaded ${successfulUploads.length} document(s)`
//         });

//         // Show success toast
//         toast.success(`Successfully uploaded ${successfulUploads.length} document(s)`);

//         // Clear selected files after successful upload
//         setSelectedFiles([]);
//         setDocumentsByType(groupDocumentsByType(initialDocuments));

//         // Reset file inputs
//         Object.values(fileInputRefs.current).forEach(input => {
//           if (input) input.value = '';
//         });

//         // Call the upload callback if provided
//         if (onDocumentsUploaded) {
//           onDocumentsUploaded();
//         }
//       } catch (error) {
//         console.error('Error uploading documents:', error);
//         setUploadStatus({
//           success: false,
//           message: error instanceof Error ? error.message : 'Failed to upload documents'
//         });
//       } finally {
//         setIsUploading(false);
//       }
//     } else {
//       if (mode === "add") {
//         setUploadStatus({
//           success: true,
//           message: 'Files selected and ready for upload when employee is created'
//         });
//       } else {
//         setUploadStatus({
//           success: false,
//           message: 'Upload is only available in edit mode with a valid employee ID'
//         });
//       }
//     }
//   }, [
//   employeeId,
//   initialDocuments,
//   customUploadEndpoint,
//   moduleName,
//   onDocumentsUploaded,
//   mode
// ]);
//     //};

//   // Watch for employeeId changes in "add" mode
//   useEffect(() => {
//     // Get all files that need to be uploaded (files without IDs from all tabs)
//     const newlySelectedFiles = initialDocuments.filter(doc => !doc.id && doc.file);
    
//     const shouldTriggerUpload =
//       mode === "add" &&
//       previousEmployeeId === null &&
//       employeeId !== null &&
//       newlySelectedFiles.length > 0;


//     if (shouldTriggerUpload) {
//       handleUploadClick();
//     }

//     setPreviousEmployeeId(employeeId);
//   }, [employeeId, mode, initialDocuments, previousEmployeeId, handleUploadClick]);//}, [employeeId, mode, initialDocuments]);

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>, documentType: keyof typeof DOCUMENT_TYPES) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     const newFiles: EmployeeDocument[] = Array.from(files).map(file => ({
//       name: file.name,
//       file: file,
//       documentType: documentType
//     }));

//     setSelectedFiles(prev => [...prev, ...newFiles]);
//     setDocumentsByType(prev => ({
//       ...prev,
//       [documentType]: [...(prev[documentType] || []), ...newFiles]
//     }));

//     // Notify parent component about selected files
//     if (onFilesSelected) {
//       onFilesSelected([...selectedFiles, ...newFiles]);
//     }
//   };

//   const handleRemoveFile = async (documentType: string, index: number) => {
//     const document = documentsByType[documentType][index];

//     // If it's a new file that hasn't been uploaded yet
//     if (!document.id) {
//       setDocumentsByType(prev => ({
//         ...prev,
//         [documentType]: prev[documentType].filter((_, i) => i !== index)
//       }));

//       const updatedFiles = selectedFiles.filter(file => file !== document);
//       setSelectedFiles(updatedFiles);
      
//       // Notify parent component about the removed file
//       if (onDocumentDeleted) {
//         onDocumentDeleted(document);
//       }
//       return;
//     }

//     // For existing documents, show confirmation dialog
//     setShowDeleteConfirm({
//       show: true,
//       documentType,
//       index,
//       document
//     });
//   };

//   const confirmDelete = async () => {
//     if (!showDeleteConfirm) return;

//     const { documentType, index, document } = showDeleteConfirm;

//     if (!employeeId || !document.id) return;

//     try {
//       setIsDeleting(prev => ({ ...prev, [document.id!]: true }));
//       setDeleteError(prev => ({ ...prev, [document.id!]: '' }));

//       // Use custom delete endpoint if provided
//       const deleteEndpoint = customDeleteEndpoint || 
//         `${API_BASE_URL}/api/employees/${employeeId}/documents/${document.id}`;

//       const response = await fetch(deleteEndpoint, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to delete document');
//       }

//       // Remove from local state on success
//       setDocumentsByType(prev => ({
//         ...prev,
//         [documentType]: prev[documentType].filter((_, i) => i !== index)
//       }));

//       // Show success toast
//       toast.success('Document deleted successfully');

//       // Call the delete callback if provided
//       if (onDocumentDeleted) {
//         onDocumentDeleted();
//       }
//     } catch (error) {
//       console.error('Error deleting document:', error);
//       const errorMessage = error instanceof Error ? error.message : 'Failed to delete document';
//       setDeleteError(prev => ({
//         ...prev,
//         [document.id!]: errorMessage
//       }));
//       toast.error(errorMessage);
//     } finally {
//       setIsDeleting(prev => ({ ...prev, [document.id!]: false }));
//       setShowDeleteConfirm(null);
//     }
//   };

//   const cancelDelete = () => {
//     setShowDeleteConfirm(null);
//   };



//   const handleViewFile = async (doc: EmployeeDocument) => {
//     if (!employeeId || !doc.id) return;

//     try {
//       // Use custom view endpoint if provided
//       const viewEndpoint = customViewEndpoint || 
//         `${API_BASE_URL}/api/employees/${employeeId}/documents/${doc.id}/view-url`;

//       const response = await fetch(viewEndpoint);

//       if (!response.ok) {
//         throw new Error('Failed to get document URL');
//       }

//       const data = await response.json();
//       if (data.success && data.viewUrl) {
//         window.open(data.viewUrl, '_blank');
//       } else {
//         throw new Error('Invalid response format');
//       }
//     } catch (error) {
//       console.error('Error viewing document:', error);
//       toast.error('Failed to open document');
//     }
//   };

//   const renderDocumentSection = (documentType: string) => {
//     const documents = documentsByType[documentType] || [];
//     const typeConfig = documentTypes.find(t => t.type === documentType);
    
//     if (!typeConfig) return null;

//     return (
//       <div key={documentType} className="mb-8">
//         <div className="border border-gray-200 rounded-lg p-4">
//           <div className='flex justify-between flex-row mb-2'>
//             <h3 className="text-lg font-semibold">{typeConfig.label}</h3>
//             {mode !== "view" && (
//               <button
//                 type="button"
//                 className="btn btn-sm btn-outline"
//                 onClick={() => fileInputRefs.current[documentType]?.click()}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                 </svg>
//                 Add
//               </button>
//             )}
//           </div>
//           <div className="items-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
//             <div className='flex justify-between flex-row'>
//               <div>
//                 <p className="text-sm text-center text-gray-600 mb-2">
//                   {typeConfig.description}
//                 </p>
//               </div>
//             </div>

//             {mode !== "view" && (
//               <input
//                 type="file"
//                 ref={setFileInputRef(documentType)}
//                 onChange={(e) => handleFileChange(e, documentType as keyof typeof DOCUMENT_TYPES)}
//                 className="hidden"
//                 multiple
//               />
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {documents.map((doc, index) => (
//                 <div key={`${doc.name}-${index}`} className="card bg-white border border-black">
//                   <div className="card-body p-4">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <h4 className="card-title text-sm mb-1 truncate" title={doc.name}>{doc.name}</h4>
//                         {doc.uploadDate && (
//                           <p className="text-xs text-gray-500">
//                             Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
//                           </p>
//                         )}
//                       </div>
//                       {mode !== "view" && (
//                         <button
//                           type="button"
//                           className="btn btn-ghost btn-xs text-error"
//                           onClick={() => handleRemoveFile(documentType, index)}
//                           disabled={isDeleting[doc.id || '']}
//                         >
//                           {isDeleting[doc.id || ''] ? (
//                             <span className="loading loading-spinner loading-xs"></span>
//                           ) : (
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                           )}
//                         </button>
//                       )}
//                     </div>

//                     {deleteError[doc.id || ''] && (
//                       <div className="mt-2 text-error text-xs">
//                         {deleteError[doc.id || '']}
//                       </div>
//                     )}

//                     {doc.url && (
//                       <div className="mt-2">
//                         <button
//                           type="button"
//                           onClick={() => handleViewFile(doc)}
//                           className="btn btn-sm btn-primary w-full"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                           </svg>
//                           View Document
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Document sections */}
//       {documentTypes.map((type) =>
//         renderDocumentSection(type.type)
//       )}

//       {/* Delete Confirmation Dialog */}
//       {showDeleteConfirm && (
//         <div className="modal modal-open">
//           <div className="modal-box">
//             <h3 className="font-bold text-lg">Confirm Delete</h3>
//             <p className="py-4">
//               Are you sure you want to delete "{showDeleteConfirm.document.name}"?
//               This action cannot be undone.
//             </p>
//             <div className="modal-action">
//               <button
//                 className="btn btn-ghost"
//                 onClick={cancelDelete}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="btn btn-error"
//                 onClick={confirmDelete}
//                 disabled={isDeleting[showDeleteConfirm.document.id || '']}
//               >
//                 {isDeleting[showDeleteConfirm.document.id || ''] ? (
//                   <>
//                     <span className="loading loading-spinner loading-sm mr-2"></span>
//                     Deleting...
//                   </>
//                 ) : (
//                   'Delete'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Upload status and button */}
//       {mode !== "view" && uploadStatus && (
//         <div className={`alert ${uploadStatus.success ? 'alert-success' : 'alert-error'} mb-4`}>
//           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//             {uploadStatus.success ? (
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             ) : (
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             )}
//           </svg>
//           <span>{uploadStatus.message}</span>
//         </div>
//       )}

//       {mode !== "view" && selectedFiles.length > 0 && mode === "edit" && (
//         <div className="flex justify-end">
//           <button
//             type="button"
//             className="btn btn-primary"
//             onClick={handleUploadClick}
//             disabled={isUploading}
//           >
//             {isUploading ? (
//               <>
//                 <span className="loading loading-spinner loading-sm"></span>
//                 Uploading...
//               </>
//             ) : (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
//                 </svg>
//                 Upload Documents
//               </>
//             )}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeeDocumentManager; 


'use client';

import React, { useState, useRef, ChangeEvent, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config';
import { toast } from 'react-hot-toast';

export interface EmployeeDocument {
  id?: number;
  name: string;
  url?: string;
  key?: string;
   s3Key?: string;
  file?: File;
  uploadDate?: string;
  documentType: string;
  size?: number;
  contentType?: string;
  originalFilename?: string;
   filename?: string;
  relatedType?: 'employee' | 'training' | 'disciplinary';
  relatedId?: number;
}

interface UploadedDocumentResponse {
  id: number;
  filename: string;
  originalFilename: string;
  url: string;
  s3Key: string;
  size: number;
  contentType: string;
  documentType: string;
  relatedType: string;
  relatedId: number;
  uploadedAt: string;
}

interface ApiUploadResponse {
  success: boolean;
  message: string;
  employee_id: number;
  documents: UploadedDocumentResponse[];
  errors?: Array<{ filename: string; error: string; code: string }>;
  timestamp: string;
}

interface APIDocument {
  id: number;
  name: string;
  url?: string;
  key?: string;
  file_name: string;  // from main API
  file_url: string;   // from main API
  uploadDate: string;
  documentType: 'ID' | 'Passport' | 'Work_Permit' | 'Employment_Agreement' | 'Education' | 'Resume' | 'Other';
  // ADD THESE FIELDS FROM UPLOAD API:
  filename?: string;
  originalFilename?: string;
  download_url?: string;
  s3Key?: string;
  size?: number;
  contentType?: string;
  uploadedAt?: string;
}

interface DocumentTypeConfig {
  type: string;
  label: string;
  description: string;
}

interface EmployeeDocumentManagerProps {
  employeeId: number | null;
  mode: "add" | "edit" | "view";
  initialDocuments?: EmployeeDocument[];
  onDocumentsUploaded?: () => void;
  onDocumentDeleted?: (removedFile?: EmployeeDocument) => void;
  documentTypes: DocumentTypeConfig[];
  moduleName?: string;
  customUploadEndpoint?: string;
  customDeleteEndpoint?: string;
  customViewEndpoint?: string;
  onFilesSelected?: (files: EmployeeDocument[]) => void;
}

const DOCUMENT_TYPES = {
  ID: 'ID',
  Passport: 'Passport',
  Work_Permit: 'Work_Permit',
  Employment_Agreement: 'Employment_Agreement',
  Education: 'Education',
  Resume: 'Resume',
  Other: 'Other'
} as const;

// Helper function to group documents by type
const groupDocumentsByType = (documents: EmployeeDocument[]) => {
  return documents.reduce((acc, doc) => {
    if (!acc[doc.documentType]) {
      acc[doc.documentType] = [];
    }
    acc[doc.documentType].push(doc);
    return acc;
  }, {} as { [key: string]: EmployeeDocument[] });
};

const EmployeeDocumentManager: React.FC<EmployeeDocumentManagerProps> = ({
  employeeId,
  mode,
  initialDocuments = [],
  onDocumentsUploaded,
  onDocumentDeleted,
  documentTypes,
  moduleName = 'employee',
  customUploadEndpoint,
  customDeleteEndpoint,
  customViewEndpoint,
  onFilesSelected,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<EmployeeDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<{ [key: string]: boolean }>({});
  const [deleteError, setDeleteError] = useState<{ [key: string]: string }>({});
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    show: boolean;
    documentType: string;
    index: number;
    document: EmployeeDocument;
  } | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [previousEmployeeId, setPreviousEmployeeId] = useState<number | null>(employeeId);
  const [documentsByType, setDocumentsByType] = useState<{ [key: string]: EmployeeDocument[] }>(
    groupDocumentsByType(initialDocuments)
  );

  // Track changes to initialDocuments
  useEffect(() => {
    setDocumentsByType(groupDocumentsByType(initialDocuments));
  }, [initialDocuments]);

  // Function to set ref
  const setFileInputRef = (documentType: string) => (el: HTMLInputElement | null) => {
    fileInputRefs.current[documentType] = el;
  };

const handleUploadClick1 = useCallback(async () => {
  console.log('=== Starting employee document upload ===');

  if (!employeeId) {
    toast.error('Employee ID is required for upload');
    return;
  }

  // Helper: normalize any doc object from backend into your UI shape
  const normalizeDoc1 = (doc: any, fallbackType: string) => {
    const docType = doc?.documentType || doc?.document_type || fallbackType || 'Other';

    const id = doc?.id;
    const name =
      doc?.filename ||
      doc?.originalFilename ||
      doc?.original_filename ||
      doc?.name ||
      'Untitled';

    const url = doc?.url || doc?.download_url || doc?.downloadUrl || null;

    const key = doc?.s3Key || doc?.s3_key || doc?.key || null;

    const uploadDate =
      doc?.uploadedAt ||
      doc?.uploaded_at ||
      doc?.uploadDate ||
      new Date().toISOString();

    const size = doc?.size ?? doc?.file_size ?? null;

    const contentType = doc?.contentType || doc?.content_type || null;

return {
  id,
  name,  // Only include properties that exist in EmployeeDocument interface
  url,
  key,
  documentType: docType,
  uploadDate,
  size,
  contentType,
  originalFilename: doc?.originalFilename || doc?.original_filename || name,
  // Remove filename, s3Key, and other non-interface properties
  relatedType: doc?.relatedType || doc?.related_type,
  relatedId: doc?.relatedId || doc?.related_id,
};
  };
  
// Update the normalizeDoc function to properly map API properties
const normalizeDoc = (doc: any, fallbackType: string): EmployeeDocument => {
  console.log('🔍 NORMALIZE - Raw document:', doc);
  console.log('🔍 NORMALIZE - Available keys:', Object.keys(doc || {}));
  
  // Get document type
  const docType = doc?.documentType || doc?.document_type || fallbackType || 'Other';
  
  // Get name - prioritize originalFilename, then filename, then name
  const name = doc?.originalFilename || 
               doc?.filename || 
               doc?.name || 
               'Untitled Document';
  
  // Get upload date - handle both formats
  const rawDate = doc?.uploadedAt || doc?.uploaded_at || doc?.uploadDate;
  let uploadDate = new Date().toISOString();
  
  if (rawDate) {
    try {
      // Handle MySQL format: "2025-12-28 13:43:55"
      if (typeof rawDate === 'string' && rawDate.includes(' ')) {
        uploadDate = new Date(rawDate.replace(' ', 'T') + 'Z').toISOString();
      } else {
        uploadDate = new Date(rawDate).toISOString();
      }
    } catch (e) {
      console.error('❌ Error parsing date:', e);
    }
  }
  
  // Get display name - use originalFilename if available
  const displayName = doc?.originalFilename || doc?.filename || name;
  
  const result: EmployeeDocument = {
    id: doc?.id,
    name: displayName, // Use the proper display name
    url: doc?.download_url || doc?.url || null,
    key: doc?.s3Key || doc?.key || null,
    documentType: docType,
    uploadDate: uploadDate,
    size: doc?.size ?? null,
    contentType: doc?.contentType || doc?.content_type || null,
    originalFilename: doc?.originalFilename || doc?.filename || name,
    relatedType: doc?.relatedType || doc?.related_type,
    relatedId: doc?.relatedId || doc?.related_id,
  };
  
  console.log('✅ NORMALIZE - Final document:', result);
  return result;
};


  // Helper: robust duplicate check
  const isDuplicate = (list: any[], incoming: any) => {
    if (!Array.isArray(list)) return false;
    return list.some((existing) => {
      // Prefer id match if present
      if (existing?.id && incoming?.id) return String(existing.id) === String(incoming.id);

      // Otherwise compare key or url or name
      const eKey = existing?.key || existing?.s3Key;
      const iKey = incoming?.key || incoming?.s3Key;

      if (eKey && iKey) return String(eKey) === String(iKey);
      if (existing?.url && incoming?.url) return String(existing.url) === String(incoming.url);

      return String(existing?.name || '').toLowerCase() === String(incoming?.name || '').toLowerCase();
    });
  };

  try {
    setIsUploading(true);
    setUploadStatus(null);

    // Upload only new files (no id yet)
    const filesToUpload = initialDocuments.filter((doc) => !doc.id && doc.file instanceof File);

    console.log('Files to upload:', filesToUpload.length);

    if (filesToUpload.length === 0) {
      toast.error('No new files to upload');
      return;
    }

    const token = localStorage.getItem('hrms_token');
    if (!token) {
      toast.error('Please login again');
      return;
    }

    // Group by documentType
    const filesByType: Record<string, File[]> = {};
    filesToUpload.forEach((doc) => {
      if (!(doc.file instanceof File)) return;
      if (!filesByType[doc.documentType]) filesByType[doc.documentType] = [];
      filesByType[doc.documentType].push(doc.file);
    });

    const documentTypes = Object.keys(filesByType);
    if (documentTypes.length > 1) {
      toast.error('Please upload files of the same document type together');
      return;
    }

    const documentType = documentTypes[0] || 'Other';
    const files = filesByType[documentType] || [];

    const formData = new FormData();

    // Use the SAME field names as announcements
    if (files.length > 1) {
      files.forEach((file) => formData.append('attachments[]', file));
    } else if (files.length === 1) {
      formData.append('attachment', files[0]);
    }

    formData.append('documentType', documentType);
    formData.append('relatedType', 'employee');
    formData.append('relatedId', employeeId.toString());

    const remarks = filesToUpload.map((doc) => doc.name).join(', ');
    if (remarks) formData.append('remarks', remarks);

    const uploadEndpoint = `${API_BASE_URL}/api/employees/${employeeId}/documents/server-upload`;

    console.log('Upload details:', {
      endpoint: uploadEndpoint,
      employeeId,
      documentType,
      fileCount: files.length,
      fileNames: files.map((f) => f.name),
    });

    // Optional debug: show FormData keys
    console.log('FormData entries:');
    for (const pair of formData.entries()) {
      console.log(
        pair[0],
        pair[1] instanceof File ? `${pair[1].name} (${pair[1].size} bytes)` : pair[1]
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    try {
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Do not set Content-Type for FormData
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseText = await response.text();
      console.log('Response status:', response.status, response.statusText);
      console.log(
        'Raw response:',
        responseText.length > 300 ? responseText.slice(0, 300) + '...' : responseText
      );

      let result: any;
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        console.error('Raw response was:', responseText);
        throw new Error('Invalid server response format');
      }

      // Debug helper (keep for now if you’re still validating)
      console.log('✅ Full server response:', result);
      console.log('✅ First document:', result?.documents?.[0]);
      if (result?.documents?.[0]) {
        console.log('✅ Keys:', Object.keys(result.documents[0]));
      }

      if (!response.ok) {
        let errorMessage = result.message || result.error || `HTTP ${response.status}: ${response.statusText}`;

        if (response.status === 400) {
          if (result.code === 'NO_FILES') errorMessage = 'No files were uploaded';
          if (result.code === 'FILE_TOO_LARGE') errorMessage = 'File size exceeds 10MB limit';
          if (result.code === 'MISSING_DOCUMENT_TYPE') errorMessage = 'Document type is required';
        }
        if (response.status === 404) errorMessage = 'Employee not found';

        throw new Error(errorMessage);
      }

      // NEW controller format
      const isNewFormat = !!result?.message && result?.employee_id !== undefined;
      const docsFromServer: any[] = Array.isArray(result?.documents) ? result.documents : [];

      if (isNewFormat) {
        const uploadedCount = docsFromServer.length;

        if (uploadedCount > 0) {
          toast.success(`Successfully uploaded ${uploadedCount} document(s)`);
        } else {
          toast.error('No documents were uploaded');
        }

        // Clear selected files list (you used selectedFiles elsewhere)
        setSelectedFiles((prev) => prev.filter((doc) => doc.id)); // keep only uploaded ones (with id)

        // Reset file inputs
        Object.values(fileInputRefs.current).forEach((input) => {
          if (input) input.value = '';
        });

        // Update UI documentsByType
        if (uploadedCount > 0) {
          setDocumentsByType((prev) => {
            const newDocsByType = { ...prev };

            docsFromServer.forEach((doc) => {
              const normalized = normalizeDoc(doc, documentType);
              const docType = normalized.documentType;

              if (!newDocsByType[docType]) newDocsByType[docType] = [];

              if (!isDuplicate(newDocsByType[docType], normalized)) {
                newDocsByType[docType] = [...newDocsByType[docType], normalized];
              }
            });

            return newDocsByType;
          });
        }

        if (uploadedCount > 0 && onDocumentsUploaded) {
          onDocumentsUploaded();
        }

        setUploadStatus({
          success: true,
          message: result.message || 'Upload completed successfully',
        });

        return;
      }

      // OLD fallback format
      if (result?.success) {
        const uploadedCount = (result.documents?.length || 0) as number;
        const errorCount = (result.errors?.length || 0) as number;

        if (uploadedCount > 0) {
          toast.success(
            errorCount > 0
              ? `Uploaded ${uploadedCount} document(s) (${errorCount} failed)`
              : `Successfully uploaded ${uploadedCount} document(s)`
          );
        } else {
          toast.error('No documents were uploaded');
        }

        if (Array.isArray(result.documents) && result.documents.length > 0) {
          setDocumentsByType((prev) => {
            const newDocsByType = { ...prev };

            result.documents.forEach((doc: any) => {
              const normalized = normalizeDoc(doc, documentType);
              const docType = normalized.documentType;

              if (!newDocsByType[docType]) newDocsByType[docType] = [];

              if (!isDuplicate(newDocsByType[docType], normalized)) {
                newDocsByType[docType] = [...newDocsByType[docType], normalized];
              }
            });

            return newDocsByType;
          });
        }

        setUploadStatus({
          success: true,
          message: result.message || 'Upload completed successfully',
        });

        if (onDocumentsUploaded) onDocumentsUploaded();
        return;
      }

      throw new Error(result?.message || 'Upload reported failure');
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      let errorMessage = 'Upload failed';
      if (fetchError?.name === 'AbortError') {
        errorMessage = 'Request timeout (120 seconds) - upload took too long';
      } else if (fetchError instanceof Error) {
        errorMessage = fetchError.message;
      }

      console.error('Fetch error:', fetchError);

      toast.error(errorMessage);
      setUploadStatus({ success: false, message: errorMessage });
    }
  } catch (error: any) {
    console.error('Unexpected error in handleUploadClick:', error);
    const errorMessage = error instanceof Error ? error.message : 'Upload failed due to unexpected error';

    toast.error(errorMessage);
    setUploadStatus({ success: false, message: errorMessage });
  } finally {
    setIsUploading(false);
    console.log('=== Upload finished ===');
  }
}, [employeeId, initialDocuments, onDocumentsUploaded]);


const handleUploadClick = useCallback(async () => {
  console.log('=== Starting employee document upload ===');

  if (!employeeId) {
    toast.error('Employee ID is required for upload');
    return;
  }

  // Helper: normalize any doc object from backend into your UI shape
  const normalizeDoc = (doc: any, fallbackType: string): EmployeeDocument => {
    console.log('🔍 NORMALIZE - Raw document:', doc);
    console.log('🔍 NORMALIZE - Available keys:', Object.keys(doc || {}));
    
    // Get document type
    const docType = doc?.documentType || doc?.document_type || fallbackType || 'Other';
    
    // Get name - prioritize originalFilename, then filename, then name
    const name = doc?.originalFilename || 
                 doc?.filename || 
                 doc?.name || 
                 'Untitled Document';
    
    // Get upload date - handle both formats
    const rawDate = doc?.uploadedAt || doc?.uploaded_at || doc?.uploadDate;
    let uploadDate = new Date().toISOString();
    
    if (rawDate) {
      try {
        // Handle MySQL format: "2025-12-28 13:43:55"
        if (typeof rawDate === 'string' && rawDate.includes(' ')) {
          uploadDate = new Date(rawDate.replace(' ', 'T') + 'Z').toISOString();
        } else {
          uploadDate = new Date(rawDate).toISOString();
        }
      } catch (e) {
        console.error('❌ Error parsing date:', e);
      }
    }
    
    // Get display name - use originalFilename if available
    const displayName = doc?.originalFilename || doc?.filename || name;
    
    const result: EmployeeDocument = {
      id: doc?.id,
      name: displayName, // Use the proper display name
      url: doc?.download_url || doc?.url || null,
      key: doc?.s3Key || doc?.key || null,
      documentType: docType,
      uploadDate: uploadDate,
      size: doc?.size ?? null,
      contentType: doc?.contentType || doc?.content_type || null,
      originalFilename: doc?.originalFilename || doc?.filename || name,
      relatedType: doc?.relatedType || doc?.related_type,
      relatedId: doc?.relatedId || doc?.related_id,
    };
    
    console.log('✅ NORMALIZE - Final document:', result);
    return result;
  };

  // Helper: robust duplicate check
  const isDuplicate = (list: any[], incoming: any) => {
    if (!Array.isArray(list)) return false;
    return list.some((existing) => {
      // Prefer id match if present
      if (existing?.id && incoming?.id) return String(existing.id) === String(incoming.id);

      // Otherwise compare key or url or name
      const eKey = existing?.key || existing?.s3Key;
      const iKey = incoming?.key || incoming?.s3Key;

      if (eKey && iKey) return String(eKey) === String(iKey);
      if (existing?.url && incoming?.url) return String(existing.url) === String(incoming.url);

      return String(existing?.name || '').toLowerCase() === String(incoming?.name || '').toLowerCase();
    });
  };

  try {
    setIsUploading(true);
    setUploadStatus(null);

    // Upload only new files (no id yet)
    const filesToUpload = initialDocuments.filter((doc) => !doc.id && doc.file instanceof File);

    console.log('Files to upload count:', filesToUpload.length);
    console.log('Files:', filesToUpload.map(f => ({
      name: f.name,
      size: f.file?.size,
      type: f.file?.type,
      documentType: f.documentType
    })));

    if (filesToUpload.length === 0) {
      toast.error('No new files to upload');
      return;
    }

    const token = localStorage.getItem('hrms_token');
    if (!token) {
      toast.error('Please login again');
      return;
    }

    // Group by documentType (express-fileupload prefers single type per request)
    const filesByType: Record<string, File[]> = {};
    filesToUpload.forEach((doc) => {
      if (!(doc.file instanceof File)) return;
      if (!filesByType[doc.documentType]) filesByType[doc.documentType] = [];
      filesByType[doc.documentType].push(doc.file);
    });

    const documentTypes = Object.keys(filesByType);
    
    // For express-fileupload, it's best to upload one type at a time
    if (documentTypes.length > 1) {
      toast.error('Please upload files of the same document type together');
      return;
    }

    const documentType = documentTypes[0] || 'Other';
    const files = filesByType[documentType] || [];

    // Create FormData - CRITICAL: Match what express-fileupload expects
    const formData = new FormData();

    // For express-fileupload, use consistent field name
    // The backend should check for 'attachments' field (array) or 'attachment' field (single)
    if (files.length === 1) {
      // Single file - use 'attachment' field
      formData.append('attachment', files[0]);
      console.log('Using field name: attachment');
    } else {
      // Multiple files - ALL use 'attachments' field (not 'attachments[]')
      files.forEach((file) => {
        formData.append('attachments', file); // Note: not 'attachments[]'
      });
      console.log(`Using field name: attachments (${files.length} files)`);
    }

    // Add metadata
    formData.append('documentType', documentType);
    formData.append('relatedType', 'employee');
    formData.append('relatedId', employeeId.toString());

    // Optional remarks
    const remarks = filesToUpload.map((doc) => doc.name).join(', ');
    if (remarks) formData.append('remarks', remarks);

    const uploadEndpoint = `${API_BASE_URL}/api/employees/${employeeId}/documents/server-upload`;

    console.log('Upload details:', {
      endpoint: uploadEndpoint,
      employeeId,
      documentType,
      fileCount: files.length,
      fileNames: files.map((f) => f.name),
    });

    // Debug: Show FormData contents
    console.log('=== FormData Contents ===');
    for (const pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}: ${pair[1].name} (${pair[1].size} bytes, ${pair[1].type})`);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    try {
      console.log('🔄 Sending upload request...');
      
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // IMPORTANT: Do NOT set Content-Type header for FormData
          // Browser will set it automatically with correct boundary
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status, response.statusText);
      
      const responseText = await response.text();
      console.log('Raw response (first 500 chars):', 
        responseText.length > 500 ? responseText.slice(0, 500) + '...' : responseText
      );

      let result: any;
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('❌ Failed to parse JSON:', e);
        console.error('❌ Raw response was:', responseText);
        throw new Error('Invalid server response format');
      }

      // Debug the response structure
      console.log('✅ Parsed server response:', {
        success: result.success,
        message: result.message,
        documentCount: result.documents?.length || 0,
        hasErrors: !!result.errors?.length,
        keys: Object.keys(result)
      });

      if (result.documents && result.documents.length > 0) {
        console.log('✅ First document keys:', Object.keys(result.documents[0]));
      }

      if (!response.ok) {
        let errorMessage = result.message || result.error || `HTTP ${response.status}: ${response.statusText}`;

        // Handle specific error cases
        if (response.status === 400) {
          if (result.code === 'NO_FILES') errorMessage = 'No files were uploaded';
          if (result.code === 'FILE_TOO_LARGE') errorMessage = 'File size exceeds 10MB limit';
          if (result.code === 'MISSING_DOCUMENT_TYPE') errorMessage = 'Document type is required';
          if (result.code === 'NO_VALID_FILES') errorMessage = 'No valid files found in request';
        }
        if (response.status === 404) errorMessage = 'Employee not found';
        if (response.status === 413) errorMessage = 'File too large';
        if (response.status === 415) errorMessage = 'Unsupported file type';

        throw new Error(errorMessage);
      }

      // Process successful response
      const docsFromServer: any[] = Array.isArray(result?.documents) ? result.documents : [];
      const uploadedCount = docsFromServer.length;
      const errorCount = result?.errors?.length || 0;

      if (uploadedCount === 0 && errorCount === 0) {
        // Check if maybe files are in a different response structure
        console.warn('⚠️ No documents in response, checking alternative structures...');
        
        // Alternative: maybe result itself is the document array
        if (Array.isArray(result) && result.length > 0) {
          console.log('⚠️ Found documents in root array');
          docsFromServer.push(...result);
        }
        // Alternative: maybe document is in a data property
        else if (result.data && Array.isArray(result.data)) {
          console.log('⚠️ Found documents in result.data');
          docsFromServer.push(...result.data);
        }
      }

      if (uploadedCount > 0) {
        toast.success(
          errorCount > 0
            ? `Uploaded ${uploadedCount} document(s) (${errorCount} failed)`
            : `Successfully uploaded ${uploadedCount} document(s)`
        );
      } else if (errorCount > 0) {
        toast.error(`${errorCount} file(s) failed to upload`);
      } else {
        toast.error('No documents were uploaded');
      }

      // Update UI with uploaded documents
      if (uploadedCount > 0) {
        setDocumentsByType((prev) => {
          const newDocsByType = { ...prev };

          docsFromServer.forEach((doc) => {
            const normalized = normalizeDoc(doc, documentType);
            const docType = normalized.documentType;

            if (!newDocsByType[docType]) {
              newDocsByType[docType] = [];
            }

            if (!isDuplicate(newDocsByType[docType], normalized)) {
              newDocsByType[docType] = [...newDocsByType[docType], normalized];
            } else {
              console.log('Skipping duplicate:', normalized.name);
            }
          });

          console.log('📊 Updated documentsByType:', Object.keys(newDocsByType).map(k => ({
            type: k,
            count: newDocsByType[k].length
          })));

          return newDocsByType;
        });

        // Clear selected files
        setSelectedFiles([]);
        
        // Reset file inputs
        Object.values(fileInputRefs.current).forEach((input) => {
          if (input) input.value = '';
        });

        // Refresh the document list if callback provided
        if (onDocumentsUploaded) {
          onDocumentsUploaded();
        }
      }

      // Set upload status (FIXED: removed details property)
      setUploadStatus({
        success: uploadedCount > 0,
        message: result.message || 
          (uploadedCount > 0 ? `Uploaded ${uploadedCount} document(s) successfully` : 'Upload completed')
      });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      let errorMessage = 'Upload failed';
      if (fetchError?.name === 'AbortError') {
        errorMessage = 'Request timeout (120 seconds) - upload took too long';
      } else if (fetchError instanceof Error) {
        errorMessage = fetchError.message;
      } else if (fetchError?.message) {
        errorMessage = fetchError.message;
      }

      console.error('❌ Fetch error:', fetchError);

      toast.error(errorMessage);
      setUploadStatus({ 
        success: false, 
        message: errorMessage
      });
    }
  } catch (error: any) {
    console.error('❌ Unexpected error in handleUploadClick:', error);
    const errorMessage = error instanceof Error ? error.message : 'Upload failed due to unexpected error';

    toast.error(errorMessage);
    setUploadStatus({ 
      success: false, 
      message: errorMessage 
    });
  } finally {
    setIsUploading(false);
    console.log('=== Upload process finished ===');
  }
}, [employeeId, initialDocuments, onDocumentsUploaded, setDocumentsByType, setSelectedFiles, setUploadStatus, setIsUploading]);

  // Watch for employeeId changes in "add" mode
  useEffect(() => {
    const newlySelectedFiles = initialDocuments.filter((doc): doc is EmployeeDocument & { file: File } => 
      !doc.id && !!doc.file
    );
    
    const shouldTriggerUpload =
      mode === "add" &&
      previousEmployeeId === null &&
      employeeId !== null &&
      newlySelectedFiles.length > 0;

    if (shouldTriggerUpload) {
      console.log('Auto-triggering upload for newly created employee');
      handleUploadClick();
    }

    setPreviousEmployeeId(employeeId);
  }, [employeeId, mode, initialDocuments, previousEmployeeId, handleUploadClick]);

const handleFileChange = (e: ChangeEvent<HTMLInputElement>, documentType: string) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const newFiles: EmployeeDocument[] = Array.from(files).map(file => ({
    name: file.name,
    file: file,
    documentType: documentType,
    size: file.size,
    contentType: file.type || 'application/octet-stream'
  }));

  // Update selected files
  setSelectedFiles(prev => [...prev, ...newFiles]);
  
  // Update documents by type for display
  setDocumentsByType(prev => {
    const currentDocs = prev[documentType] || [];
    return {
      ...prev,
      [documentType]: [...currentDocs, ...newFiles]
    };
  });

  // Notify parent component
  if (onFilesSelected) {
    onFilesSelected([...selectedFiles, ...newFiles]);
  }
};

  const handleRemoveFile = async (documentType: string, index: number) => {
    const document = documentsByType[documentType][index];

    // If it's a new file that hasn't been uploaded yet
    if (!document.id) {
      setDocumentsByType(prev => ({
        ...prev,
        [documentType]: prev[documentType].filter((_, i) => i !== index)
      }));

      const updatedFiles = selectedFiles.filter(file => file !== document);
      setSelectedFiles(updatedFiles);
      
      // Notify parent component about the removed file
      if (onDocumentDeleted) {
        onDocumentDeleted(document);
      }
      return;
    }

    // For existing documents, show confirmation dialog
    setShowDeleteConfirm({
      show: true,
      documentType,
      index,
      document
    });
  };

  const confirmDelete = async () => {
    if (!showDeleteConfirm) return;

    const { documentType, index, document } = showDeleteConfirm;

    if (!employeeId || !document.id) return;

    try {
      setIsDeleting(prev => ({ ...prev, [document.id!]: true }));
      setDeleteError(prev => ({ ...prev, [document.id!]: '' }));

      // Use custom delete endpoint if provided
      const deleteEndpoint = customDeleteEndpoint || 
        `${API_BASE_URL}/api/employees/${employeeId}/documents/${document.id}`;

      const response = await fetch(deleteEndpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete document');
      }

      // Remove from local state on success
      setDocumentsByType(prev => ({
        ...prev,
        [documentType]: prev[documentType].filter((_, i) => i !== index)
      }));

      // Show success toast
      toast.success('Document deleted successfully');

      // Call the delete callback if provided
      if (onDocumentDeleted) {
        onDocumentDeleted();
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete document';
      setDeleteError(prev => ({
        ...prev,
        [document.id!]: errorMessage
      }));
      toast.error(errorMessage);
    } finally {
      setIsDeleting(prev => ({ ...prev, [document.id!]: false }));
      setShowDeleteConfirm(null);
    }
  };


  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleViewFile = async (doc: EmployeeDocument) => {
    if (!employeeId || !doc.id) return;

    try {
      // Use custom view endpoint if provided
      const viewEndpoint = customViewEndpoint || 
        `${API_BASE_URL}/api/employees/${employeeId}/documents/${doc.id}/view-url`;

      const response = await fetch(viewEndpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get document URL');
      }

      const data = await response.json();
      if (data.success && data.viewUrl) {
        window.open(data.viewUrl, '_blank');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      toast.error('Failed to open document');
    }
  };

  const renderDocumentSection = (documentType: string) => {
    const documents = documentsByType[documentType] || [];
    const typeConfig = documentTypes.find(t => t.type === documentType);
    
    if (!typeConfig) return null;

    return (
      <div key={documentType} className="mb-8">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className='flex justify-between flex-row mb-2'>
            <h3 className="text-lg font-semibold">{typeConfig.label}</h3>
            {mode !== "view" && (
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => fileInputRefs.current[documentType]?.click()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </button>
            )}
          </div>
          <div className="items-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className='flex justify-between flex-row'>
              <div>
                <p className="text-sm text-center text-gray-600 mb-2">
                  {typeConfig.description}
                </p>
              </div>
            </div>

            {mode !== "view" && (
              <input
                type="file"
                ref={setFileInputRef(documentType)}
                onChange={(e) => handleFileChange(e, documentType as keyof typeof DOCUMENT_TYPES)}
                className="hidden"
                multiple
              />
            )}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {documents.map((doc, index) => (
    <div key={`${doc.id || doc.name}-${index}`} className="card bg-white border border-gray-200 shadow-sm">
      <div className="card-body p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* File name */}
            <h4 className="card-title text-sm font-medium mb-2 truncate" title={doc.name}>
              {doc.name || doc.originalFilename || 'Untitled Document'}
            </h4>
            
            {/* Upload date */}
            {doc.uploadDate ? (
              <p className="text-xs text-gray-500">
                Uploaded: {new Date(doc.uploadDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            ) : (
              <p className="text-xs text-gray-400">Date not available</p>
            )}
          </div>
          
          {mode !== "view" && (
            <button
              type="button"
              className="btn btn-ghost btn-xs text-error ml-2"
              onClick={() => handleRemoveFile(documentType, index)}
              disabled={isDeleting[doc.id || '']}
              title="Delete document"
            >
              {isDeleting[doc.id || ''] ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          )}
        </div>

        {deleteError[doc.id || ''] && (
          <div className="mt-2 text-error text-xs">
            {deleteError[doc.id || '']}
          </div>
        )}

        {doc.url && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => handleViewFile(doc)}
              className="btn btn-sm btn-primary w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Document
            </button>
          </div>
        )}
      </div>
    </div>
  ))}
</div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Document sections */}
      {documentTypes.map((type) =>
        renderDocumentSection(type.type)
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete "{showDeleteConfirm.document.name}"?
              This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={confirmDelete}
                disabled={isDeleting[showDeleteConfirm.document.id || '']}
              >
                {isDeleting[showDeleteConfirm.document.id || ''] ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload status and button */}
      {mode !== "view" && uploadStatus && (
        <div className={`alert ${uploadStatus.success ? 'alert-success' : 'alert-error'} mb-4`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            {uploadStatus.success ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
          <span>{uploadStatus.message}</span>
        </div>
      )}

      {mode !== "view" && mode === "edit" && (
        <div className="flex justify-end">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Uploading...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Documents
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeDocumentManager;
