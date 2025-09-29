'use client';

import React, { useState, useRef, ChangeEvent, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config';
import { toast } from 'react-hot-toast';

export interface EmployeeDocument {
  id?: number;
  name: string;
  url?: string;
  key?: string;
  file?: File;
  uploadDate?: string;
  documentType: string;
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

    const handleUploadClick = useCallback(async () => {//async () => {
    
    if (employeeId) {
      try {
        setIsUploading(true);
        setUploadStatus(null);

        // Use newly selected files from initialDocuments for upload (all tabs)
        const filesToUpload = initialDocuments.filter(doc => !doc.id && doc.file);

        const results = await Promise.all(
          filesToUpload.map(async (doc) => {
            if (!doc.file) return null;

            // Use custom endpoint if provided, otherwise use default
            const uploadRequestEndpoint = customUploadEndpoint || 
              `${API_BASE_URL}/api/employees/${employeeId}/documents/upload-request`;

            const uploadRequestResponse = await fetch(uploadRequestEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                documentType: doc.documentType,
                filename: doc.name,
                contentType: doc.file.type,
                moduleName
              }),
            });

            const responseData = await uploadRequestResponse.json();

            if (!uploadRequestResponse.ok) {
              throw new Error(`Failed to get upload URL for ${doc.name}: ${JSON.stringify(responseData)}`);
            }

            const { uploadUrl, s3Key, contentType } = responseData;

            // Step 2: Upload file to S3 using the presigned URL
            try {
              const uploadToS3Response = await fetch(uploadUrl, {
                method: 'PUT',
                body: doc.file,
                headers: {
                  'Content-Type': contentType
                }
              });

              if (!uploadToS3Response.ok) {
                const errorText = await uploadToS3Response.text();
                throw new Error(`Failed to upload ${doc.name} to storage: ${errorText}`);
              }
            } catch (error) {
              console.error('S3 upload error:', error);
              throw error;
            }

            // Use custom endpoint for metadata if provided
            const metadataEndpoint = customUploadEndpoint || 
              `${API_BASE_URL}/api/employees/${employeeId}/documents`;

            const metadataResponse = await fetch(metadataEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                documentType: doc.documentType,
                s3Key,
                originalFilename: doc.name,
                fileSize: doc.file.size,
                contentType,
                moduleName
              }),
            });

            if (!metadataResponse.ok) {
              throw new Error(`Failed to save metadata for ${doc.name}`);
            }

            return await metadataResponse.json();
          })
        );

        // Filter out null results (from failed uploads)
        const successfulUploads = results.filter(result => result !== null);

        setUploadStatus({
          success: true,
          message: `Successfully uploaded ${successfulUploads.length} document(s)`
        });

        // Show success toast
        toast.success(`Successfully uploaded ${successfulUploads.length} document(s)`);

        // Clear selected files after successful upload
        setSelectedFiles([]);
        setDocumentsByType(groupDocumentsByType(initialDocuments));

        // Reset file inputs
        Object.values(fileInputRefs.current).forEach(input => {
          if (input) input.value = '';
        });

        // Call the upload callback if provided
        if (onDocumentsUploaded) {
          onDocumentsUploaded();
        }
      } catch (error) {
        console.error('Error uploading documents:', error);
        setUploadStatus({
          success: false,
          message: error instanceof Error ? error.message : 'Failed to upload documents'
        });
      } finally {
        setIsUploading(false);
      }
    } else {
      if (mode === "add") {
        setUploadStatus({
          success: true,
          message: 'Files selected and ready for upload when employee is created'
        });
      } else {
        setUploadStatus({
          success: false,
          message: 'Upload is only available in edit mode with a valid employee ID'
        });
      }
    }
  }, [
  employeeId,
  initialDocuments,
  customUploadEndpoint,
  moduleName,
  onDocumentsUploaded,
  mode
]);
    //};

  // Watch for employeeId changes in "add" mode
  useEffect(() => {
    // Get all files that need to be uploaded (files without IDs from all tabs)
    const newlySelectedFiles = initialDocuments.filter(doc => !doc.id && doc.file);
    
    const shouldTriggerUpload =
      mode === "add" &&
      previousEmployeeId === null &&
      employeeId !== null &&
      newlySelectedFiles.length > 0;


    if (shouldTriggerUpload) {
      handleUploadClick();
    }

    setPreviousEmployeeId(employeeId);
  }, [employeeId, mode, initialDocuments, previousEmployeeId, handleUploadClick]);//}, [employeeId, mode, initialDocuments]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, documentType: keyof typeof DOCUMENT_TYPES) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: EmployeeDocument[] = Array.from(files).map(file => ({
      name: file.name,
      file: file,
      documentType: documentType
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setDocumentsByType(prev => ({
      ...prev,
      [documentType]: [...(prev[documentType] || []), ...newFiles]
    }));

    // Notify parent component about selected files
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
      });

      if (!response.ok) {
        const errorData = await response.json();
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

      const response = await fetch(viewEndpoint);

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
                <div key={`${doc.name}-${index}`} className="card bg-white border border-black">
                  <div className="card-body p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="card-title text-sm mb-1 truncate" title={doc.name}>{doc.name}</h4>
                        {doc.uploadDate && (
                          <p className="text-xs text-gray-500">
                            Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {mode !== "view" && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() => handleRemoveFile(documentType, index)}
                          disabled={isDeleting[doc.id || '']}
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
                      <div className="mt-2">
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

      {mode !== "view" && selectedFiles.length > 0 && mode === "edit" && (
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