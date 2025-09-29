
import React from 'react';
import EmployeeDocumentManager from '@/app/components/DocumentManager';
import { EmployeeDocument } from './types';

interface DocumentsTabProps {
  employeeId: number | null;
  documentsTabFiles: EmployeeDocument[];
  onDocumentsTabFilesSelected: (files: EmployeeDocument[]) => void;
  onDocumentsTabDocumentDeleted: (removedFile?: EmployeeDocument) => void;
}

const EMPLOYEE_DOCUMENT_TYPES = [
  {
    type: 'ID',
    label: 'Identity Document',
    description: 'Upload a scan of ID card'
  },
  {
    type: 'Passport',
    label: 'Passport',
    description: 'Upload a scan of passport'
  },
  {
    type: 'Work_Permit',
    label: 'Work Permit',
    description: 'Upload visa or work permit documents'
  },
  {
    type: 'Employment_Agreement',
    label: 'Employment Agreement',
    description: 'Upload signed employment contract'
  },
  {
    type: 'Education',
    label: 'Education',
    description: 'Upload education certificates'
  },
  {
    type: 'Resume',
    label: 'Resume',
    description: 'Upload latest resume or CV'
  },
  {
    type: 'Other',
    label: 'Other Documents',
    description: 'Upload other documents'
  }
];

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  employeeId,
  documentsTabFiles,
  onDocumentsTabFilesSelected,
  onDocumentsTabDocumentDeleted,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Documents</h3>
      <EmployeeDocumentManager
        employeeId={employeeId}
        mode={employeeId ? "edit" : "add"}
        documentTypes={EMPLOYEE_DOCUMENT_TYPES}
        onFilesSelected={onDocumentsTabFilesSelected}
        initialDocuments={documentsTabFiles}
        onDocumentDeleted={onDocumentsTabDocumentDeleted}
      />
    </div>
  );
};

export default DocumentsTab;


