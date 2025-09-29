import React, { useEffect, useState } from 'react';
import EmployeeDocumentManager, { EmployeeDocument } from './EmployeeDocumentManager';
import { API_BASE_URL } from '../config';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  confirmButtonClass?: string;
}

interface TrainingRecord {
  id?: string;
  training_course: string;
  venue: string;
  start_datetime: string;
  end_datetime: string;
  status: 'pending' | 'completed' | 'cancelled';
  attachments?: EmployeeDocument[];

  // New bonding fields
  has_bond: boolean;
  bond_period_days?: number; // Changed from months to days
  bond_start_date?: string;
  bond_end_date?: string;
  bond_status?: 'active' | 'fulfilled' | 'breached';
  bond_agreement_document?: EmployeeDocument[] | null;
}

interface DisciplinaryRecord {
  id?: string;
  issue_date: string;
  type_of_letter: string;
  reason: string;
  attachments?: EmployeeDocument[];
}

interface RecordModalProps {
  type: 'training' | 'disciplinary';
  isOpen: boolean;
  record: TrainingRecord | DisciplinaryRecord | null;
  onSave: (record: TrainingRecord | DisciplinaryRecord) => void;
  onCancel: () => void;
  employeeId?: number | null;
  isLoading?: boolean;
  documentTypes?: Array<{
    type: string;
    label: string;
    description: string;
  }>;
  moduleName?: string;
}

// Legacy interface for backward compatibility
interface TrainingModalProps {
  isOpen: boolean;
  record: TrainingRecord | null;
  onSave: (record: TrainingRecord) => void;
  onCancel: () => void;
  employeeId?: number | null;
  isLoading?: boolean;
  documentTypes?: Array<{
    type: string;
    label: string;
    description: string;
  }>;
  moduleName?: string;
}


const daysBetween = (startISO?: string, endISO?: string) => {
  if (!startISO || !endISO) return 0;
  const start = new Date(startISO);
  const end = new Date(endISO);
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
};


// This function takes the full ISO date string and returns it in YYYY-MM-DD format.
const formatDateForInput = (isoDateString: string | undefined) => {
  if (!isoDateString) return '';
  return isoDateString.split('T')[0];
};

// Updated to calculate bond end date based on days
const calculateBondEndDate = (startDate: string, days: number): string => {
  if (!startDate || days === undefined || days === null) return '';
  const date = new Date(startDate);
  date.setDate(date.getDate() + days); // Add days
  return date.toISOString().split('T')[0];
};

// New function to calculate remaining days (KEPT HERE FOR USE IN LIST COMPONENT)
export const getRemainingBondDays = (bondEndDate: string | undefined): number | null => {
  if (!bondEndDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day
  const endDate = new Date(bondEndDate);
  endDate.setHours(0, 0, 0, 0); // Normalize end date to start of day

  // If bond end date is in the past, remaining days is 0 or negative
  if (endDate < today) {
    return 0; // Bond has expired
  }

  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Use ceil to include the current day
  return diffDays;
};




// const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
//   isOpen,
//   title,
//   message,
//   confirmText = "Yes",
//   cancelText = "No",
//   onConfirm,
//   onCancel,
//   isLoading = false,
//   confirmButtonClass = "btn-primary"
// }) => {
  const ConfirmationModal: React.FC<ConfirmationModalProps> = (props) => {
  const { isOpen, title, message, confirmText = "Yes", cancelText = "No", onConfirm, onCancel, isLoading = false, confirmButtonClass = "btn-primary" } = props;

  
const [isEndDateManual, setIsEndDateManual] = useState(false);

if (!isOpen) return null;

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onCancel();
    }
  };

  // Handle escape key to close modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      onCancel();
    }
  };

  return (
    <div 
      className="modal modal-open modal-bottom sm:modal-middle"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg mb-4">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${confirmButtonClass} ${isLoading ? 'loading' : ''}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const TrainingModal: React.FC<TrainingModalProps> = ({
  isOpen,
  record,
  onSave,
  onCancel,
  employeeId = null,
  isLoading = false,
  documentTypes = [
    {
      type: 'Training_Records',
      label: 'Training Records',
      description: 'Upload training records'
    }
  ],
  moduleName = 'employee-data'
}) => {
  const [formData, setFormData] = React.useState<TrainingRecord>({
    training_course: '',
    venue: '',
    start_datetime: '',
    end_datetime: '',
    status: 'pending',
    attachments: [],
    has_bond: false,
    bond_period_days: undefined, // Changed from months
    bond_start_date: undefined,
    bond_end_date: undefined,
    bond_status: undefined,
    bond_agreement_document: null,
  });
  const [isModalLoading, setIsModalLoading] = React.useState(false);






  // Initialize form data when record changes or modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setIsModalLoading(true);
      
      // Small delay to show loading state when opening modal
      const timer = setTimeout(() => {
        if (record) {
          console.log("modal record", record);
          setFormData(record);
        } else {
          setFormData({
            training_course: '',
            venue: '',
            start_datetime: '',
            end_datetime: '',
            status: 'pending',
            attachments: [],
            has_bond: false,
            bond_period_days: undefined, // Changed from months
            bond_start_date: undefined,
            bond_end_date: undefined,
            bond_status: undefined,
            bond_agreement_document: null,
          });
        }
        setIsModalLoading(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [record, isOpen]);


  


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Special handling for bond_period_days to ensure it's a number or undefined
    if (name === 'bond_period_days') {
        const parsedValue = parseInt(value, 10);
        setFormData(prev => ({
            ...prev,
            bond_period_days: isNaN(parsedValue) ? undefined : parsedValue
        }));
    } else {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }
  };

  const handleAttachmentsChange = (files: EmployeeDocument[]) => {
    setFormData(prev => ({
      ...prev,
      attachments: files
    }));
  };

  const handleDocumentDeleted = (removedFile?: EmployeeDocument) => {
    if (removedFile) {
      setFormData(prev => ({
        ...prev,
        attachments: prev.attachments?.filter(file => 
          !(file.name === removedFile.name && 
            file.documentType === removedFile.documentType && 
            file.file === removedFile.file)
        ) || []
      }));
    }
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.training_course || !formData.venue || !formData.start_datetime || !formData.end_datetime) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate that end date is after start date
    if (new Date(formData.end_datetime) <= new Date(formData.start_datetime)) {
      alert('End date must be after start date');
      return;
    }

    onSave(formData);
  };

  const handleCancel = () => {
    onCancel();
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleCancel();
    }
  };

  // Handle escape key to close modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      handleCancel();
    }
  };

  // Remaining days calculation removed from here for display within the modal


  if (!isOpen) return null;

  return (
    <div 
      className="modal modal-open"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="modal-box max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg mb-4">
          {record ? 'Edit Training Record' : 'Add Training Record'}
        </h3>
        
        {isModalLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-3">
              <span className="loading loading-spinner loading-lg"></span>
              <span className="text-sm text-gray-500">Loading training record...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
          {/* Training Course */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Training Course <span className="text-error">*</span>
            </label>
            <input 
              type="text"
              name="training_course"
              placeholder="Enter training course name"
              value={formData.training_course}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              disabled={isLoading}
            />
          </div>

          {/* Venue */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Venue <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="venue"
              placeholder="Enter venue location"
              value={formData.venue}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              disabled={isLoading}
            />
          </div>
          
          {/* Start and End Date/Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Date & Time <span className="text-error">*</span>
              </label>
              <input
                type="datetime-local"
                name="start_datetime"
                value={formData.start_datetime ? new Date(formData.start_datetime).toISOString().slice(0, 16) : ''}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                End Date & Time <span className="text-error">*</span>
              </label>
              <input
                type="datetime-local"
                name="end_datetime"
                value={formData.end_datetime ? new Date(formData.end_datetime).toISOString().slice(0, 16) : ''}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="select select-bordered w-full"
              disabled={isLoading}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium mb-2">Attachments</label>
            <EmployeeDocumentManager
              employeeId={employeeId}
              mode={record ? "edit" : "add"}
              documentTypes={documentTypes} // This prop is correctly defined by default
              moduleName={moduleName}
              onFilesSelected={handleAttachmentsChange}
              initialDocuments={formData.attachments || []}
              onDocumentDeleted={handleDocumentDeleted}
            />
          </div>
          </div>
        )}

{/* Bonding Section */}
<div className="border-t pt-4 mt-6">
  <label className="flex items-center space-x-2 mb-3">
    <input
      type="checkbox"
      className="toggle toggle-primary"
      checked={formData.has_bond || false}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, has_bond: e.target.checked }))
      }
      disabled={isLoading}
    />
    <span className="text-sm font-medium">This training has a bonding agreement</span>
  </label>

  {formData.has_bond && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      {/* Bond Start Date */}
      <div>
        <label className="block text-sm font-medium mb-2">Bond Start Date</label>
        <input
          type="date"
          className="input input-bordered w-full"
          value={formData.bond_start_date ? formatDateForInput(formData.bond_start_date) : ''}
          onChange={(e) => {
            const startDate = e.target.value || '';
            let endDate = formData.bond_end_date || '';
            // Keep end >= start
            if (endDate && new Date(endDate) < new Date(startDate)) {
              endDate = startDate;
            }
            const period = startDate && endDate ? daysBetween(startDate, endDate) : undefined;

            setFormData(prev => ({
              ...prev,
              bond_start_date: startDate,
              bond_end_date: endDate,
              bond_period_days: period
            }));
          }}
          disabled={isLoading}
        />
      </div>

      {/* Bond End Date (user picks; days auto-calc) */}
      <div className="tooltip tooltip-bottom" data-tip="Pick an end date to auto-calculate Bond Period (Days).">
        <label className="block text-sm font-medium mb-2">Bond End Date</label>
        <input
          type="date"
          className="input input-bordered w-full"
          value={formData.bond_end_date ? formatDateForInput(formData.bond_end_date) : ''}
          min={formData.bond_start_date ? formatDateForInput(formData.bond_start_date) : undefined}
          onChange={(e) => {
            const endDate = e.target.value || '';
            const period = formData.bond_start_date && endDate
              ? daysBetween(formData.bond_start_date, endDate)
              : undefined;

            setFormData(prev => ({
              ...prev,
              bond_end_date: endDate,
              bond_period_days: period
            }));
          }}
          disabled={isLoading}
        />
      </div>

      {/* Bond Period (Days) - auto, disabled */}
      <div>
        <label className="block text-sm font-medium mb-2">Bond Period (Days)</label>
        <input
          type="number"
          className="input input-bordered w-full"
          value={
            formData.bond_start_date && formData.bond_end_date
              ? daysBetween(formData.bond_start_date, formData.bond_end_date)
              : (formData.bond_period_days ?? '')
          }
          readOnly
          disabled
        />
        {/* <p className="text-xs text-gray-500 mt-1">Auto-calculated from start and end dates.</p> */}
      </div>

      {/* Bond Status */}
      <div>
        <label className="block text-sm font-medium mb-2">Bond Status</label>
        <select
          className="select select-bordered w-full"
          value={formData.bond_status || ''}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              bond_status: e.target.value as 'active' | 'fulfilled' | 'breached',
            }))
          }
          disabled={isLoading}
        >
          <option value="">Select</option>
          <option value="active">Active</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="breached">Breached</option>
        </select>
      </div>

      {/* Bond Agreement Document */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-2">Bond Agreement Document</label>
        <EmployeeDocumentManager
          employeeId={employeeId}
          mode={record ? "edit" : "add"}
          documentTypes={[
            {
              type: 'Bond_Agreement',
              label: 'Bond Agreement',
              description: 'Upload bond agreement document'
            }
          ]}
          moduleName={moduleName}
          onFilesSelected={(files) => {
            setFormData((prev) => ({
              ...prev,
              bond_agreement_document: files
            }));
          }}
          initialDocuments={formData.bond_agreement_document || []}
          onDocumentDeleted={(removedFile) => {
            if (removedFile) {
              setFormData((prev) => ({
                ...prev,
                bond_agreement_document:
                  prev.bond_agreement_document?.filter(
                    (file) =>
                      !(
                        file.name === removedFile.name &&
                        file.documentType === removedFile.documentType &&
                        file.file === removedFile.file
                      )
                  ) || [],
              }));
            }
          }}
        />
      </div>
    </div>
  )}
</div>


        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleCancel}
            disabled={isLoading || isModalLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
            onClick={handleSave}
            disabled={isLoading || isModalLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              record ? 'Update' : 'Add'
            )} Training Record
          </button>
        </div>
      </div>
    </div>
  );
};

const RecordModal: React.FC<RecordModalProps> = ({
  type,
  isOpen,
  record,
  onSave,
  onCancel,
  employeeId = null,
  isLoading = false,
  documentTypes = [
    {
      type: type === 'training' ? 'Training_Records' : 'Disciplinary_Records',
      label: type === 'training' ? 'Training Records' : 'Disciplinary Records',
      description: `Upload ${type} records`
    }
  ],
  moduleName = 'employee-data'
}) => {
  const isTraining = type === 'training';
  
  const [formData, setFormData] = React.useState<TrainingRecord | DisciplinaryRecord>(
    isTraining 
      ? {
          training_course: '',
          venue: '',
          start_datetime: '',
          end_datetime: '',
          status: 'pending' as const,
          attachments: [],
          has_bond: false,
          bond_period_days: undefined, // Changed from months
          bond_start_date: undefined,
          bond_end_date: undefined,
          bond_status: undefined,
          bond_agreement_document: null,
        }
      : {
          issue_date: '',
          type_of_letter: '',
          reason: '',
          attachments: []
        }
  );
  const [isModalLoading, setIsModalLoading] = React.useState(false);
  const [letterTypes, setLetterTypes] = useState<{ id: number; name: string }[]>([]);


useEffect(() => {
  const fetchLetterTypes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/disciplinary-types`);
      const data = await res.json();
      setLetterTypes(data || []);
    } catch (err) {
      console.error('Failed to fetch letter types:', err);
    }
  };

  fetchLetterTypes();
}, []);

  // Initialize form data when record changes or modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setIsModalLoading(true);
      
      // Small delay to show loading state when opening modal
      const timer = setTimeout(() => {
        if (record) {
          setFormData(record);
        } else {
          setFormData(
            isTraining 
              ? {
                  training_course: '',
                  venue: '',
                  start_datetime: '',
                  end_datetime: '',
                  status: 'pending' as const,
                  attachments: [],
                  has_bond: false,
                  bond_period_days: undefined, // Changed from months
                  bond_start_date: undefined,
                  bond_end_date: undefined,
                  bond_status: undefined,
                  bond_agreement_document: null,
                }
              : {
                  issue_date: '',
                  type_of_letter: '',
                  reason: '',
                  attachments: []
                }
          );
        }
        setIsModalLoading(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [record, isOpen, isTraining]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Special handling for bond_period_days to ensure it's a number or undefined
    if (name === 'bond_period_days' && isTraining) {
        const parsedValue = parseInt(value, 10);
        setFormData(prev => ({
            ...prev as TrainingRecord, // Type assertion for clarity
            bond_period_days: isNaN(parsedValue) ? undefined : parsedValue
        }));
    } else {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }
  };


  const handleAttachmentsChange = (files: EmployeeDocument[]) => {
    setFormData(prev => ({
      ...prev,
      attachments: files
    }));
  };

  const handleDocumentDeleted = (removedFile?: EmployeeDocument) => {
    if (removedFile) {
      setFormData(prev => ({
        ...prev,
        attachments: prev.attachments?.filter(file => 
          !(file.name === removedFile.name && 
            file.documentType === removedFile.documentType && 
            file.file === removedFile.file)
        ) || []
      }));
    }
  };

  const handleSave = () => {
    if (isTraining) {
      const trainingData = formData as TrainingRecord;
      // Validate required fields for training
      if (!trainingData.training_course || !trainingData.venue || !trainingData.start_datetime || !trainingData.end_datetime) {
        alert('Please fill in all required fields');
        return;
      }

      // Validate that end date is after start date
      if (new Date(trainingData.end_datetime) <= new Date(trainingData.start_datetime)) {
        alert('End date must be after start date');
        return;
      }
    } else {
      const disciplinaryData = formData as DisciplinaryRecord;
      // Validate required fields for disciplinary
      if (!disciplinaryData.issue_date || !disciplinaryData.type_of_letter || !disciplinaryData.reason) {
        alert('Please fill in all required fields');
        return;
      }
    }

    onSave(formData);
  };

  const handleCancel = () => {
    onCancel();
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleCancel();
    }
  };

  // Handle escape key to close modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      handleCancel();
    }
  };

  // Remaining days calculation removed from here for display within the modal


  if (!isOpen) return null;

  return (
    <div 
      className="modal modal-open"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="modal-box max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg mb-4">
          {record ? `Edit ${isTraining ? 'Training' : 'Disciplinary'} Record` : `Add ${isTraining ? 'Training' : 'Disciplinary'} Record`}
        </h3>
        
        {isModalLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-3">
              <span className="loading loading-spinner loading-lg"></span>
              <span className="text-sm text-gray-500">Loading {type} record...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isTraining ? (
              <>
                {/* Training Course */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Training Course <span className="text-error">*</span>
                  </label>
                  <input 
                    type="text"
                    name="training_course"
                    placeholder="Enter training course name"
                    value={(formData as TrainingRecord).training_course}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    disabled={isLoading}
                  />
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Venue <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="venue"
                    placeholder="Enter venue location"
                    value={(formData as TrainingRecord).venue}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    disabled={isLoading}
                  />
                </div>
                
                {/* Start and End Date/Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Start Date & Time <span className="text-error">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="start_datetime"
                      value={(formData as TrainingRecord).start_datetime ? new Date((formData as TrainingRecord).start_datetime).toISOString().slice(0, 16) : ''}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      End Date & Time <span className="text-error">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="end_datetime"
                      value={(formData as TrainingRecord).end_datetime ? new Date((formData as TrainingRecord).end_datetime).toISOString().slice(0, 16) : ''}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    name="status"
                    value={(formData as TrainingRecord).status}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                    disabled={isLoading}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                {/* Issue Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Issue Date <span className="text-error">*</span>
                  </label>
                  <input 
                    type="date"
                    name="issue_date"
                    value={(formData as DisciplinaryRecord).issue_date}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    disabled={isLoading}
                  />
                </div>

                {/* Type of Letter */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type of Letter <span className="text-error">*</span>
                  </label>
                  <select
                    name="type_of_letter"
                    value={(formData as DisciplinaryRecord).type_of_letter}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                    disabled={isLoading}
                  >
                    <option value="" disabled>Select type of letter</option>
                {letterTypes.map((type: { id: number; name: string }) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
                  </select>
                </div>


                
                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reason <span className="text-error">*</span>
                  </label>
                  <textarea
                    name="reason"
                    placeholder="Enter the reason for disciplinary action"
                    value={(formData as DisciplinaryRecord).reason}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered w-full h-24"
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium mb-2">Attachments</label>
              <EmployeeDocumentManager
                employeeId={employeeId}
                mode={record ? "edit" : "add"}
                documentTypes={documentTypes}
                moduleName={moduleName}
                onFilesSelected={handleAttachmentsChange}
                initialDocuments={formData.attachments || []}
                onDocumentDeleted={handleDocumentDeleted}
              />
            </div>
          </div>
        )}
        
        {/* Conditional Bonding Section for Training Records */}
        {isTraining && (
          <div className="border-t pt-4 mt-6">
            <label className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={(formData as TrainingRecord).has_bond || false}
                onChange={(e) =>
                  setFormData((prev) => ({ 
                    ...(prev as TrainingRecord), 
                    has_bond: e.target.checked 
                  }))
                }
                disabled={isLoading}
              />
              <span className="text-sm font-medium">This training has a bonding agreement</span>
            </label>

            {(formData as TrainingRecord).has_bond && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {/* Bond Start Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">Bond Start Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={(formData as TrainingRecord).bond_start_date ? formatDateForInput((formData as TrainingRecord).bond_start_date) : ''}
                    onChange={(e) => {
                      const startDate = e.target.value;
                      const trainingFormData = formData as TrainingRecord;
                      const endDate = trainingFormData.bond_period_days 
                        ? calculateBondEndDate(startDate, trainingFormData.bond_period_days)
                        : '';
                      
                      setFormData(prev => ({
                        ...(prev as TrainingRecord),
                        bond_start_date: startDate,
                        bond_end_date: endDate
                      }));
                    }}
                    disabled={isLoading}
                  />
                </div>

                {/* Bond End Date (Read-only) with Tooltip */}
                <div className="tooltip tooltip-bottom" data-tip="Bond End Date is automatically calculated based on Bond Start Date and Bond Period (Days).">
                  <label className="block text-sm font-medium mb-2">Bond End Date</label>
                  <div> {/* Removed flex container, now just the input */}
                      <input
                          type="date"
                          className="input input-bordered w-full"
                          value={(formData as TrainingRecord).bond_end_date ? formatDateForInput((formData as TrainingRecord).bond_end_date) : ''}
                          readOnly
                          disabled
                      />
                  </div>
                </div>
                
                {/* Bond Period (Days) */}
                <div>
                  <label className="block text-sm font-medium mb-2">Bond Period (Days)</label>
                  <input
                    type="number"
                    min="0"
                    className="input input-bordered w-full"
                    value={(formData as TrainingRecord).bond_period_days === undefined ? '' : (formData as TrainingRecord).bond_period_days}
                    onChange={(e) => {
                      const days = parseInt(e.target.value) || 0;
                      const trainingFormData = formData as TrainingRecord;
                      const endDate = trainingFormData.bond_start_date 
                        ? calculateBondEndDate(trainingFormData.bond_start_date, days)
                        : '';
                      
                      setFormData(prev => ({
                        ...(prev as TrainingRecord),
                        bond_period_days: days,
                        bond_end_date: endDate
                      }));
                    }}
                    disabled={isLoading}
                  />
                </div>

                {/* Bond Status */}
                <div>
                  <label className="block text-sm font-medium mb-2">Bond Status</label>
                  <select
                    className="select select-bordered w-full"
                    value={(formData as TrainingRecord).bond_status || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...(prev as TrainingRecord),
                        bond_status: e.target.value as 'active' | 'fulfilled' | 'breached',
                      }))
                    }
                    disabled={isLoading}
                  >
                    <option value="">Select</option>
                    <option value="active">Active</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="breached">Breached</option>
                  </select>
                </div>

                {/* Bond Agreement Document */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Bond Agreement Document</label>
                  <EmployeeDocumentManager
                    employeeId={employeeId}
                    mode={record ? "edit" : "add"}
                    documentTypes={[
                      {
                        type: 'Bond_Agreement',
                        label: 'Bond Agreement',
                        description: 'Upload bond agreement document'
                      }
                    ]}
                    moduleName={moduleName}
                    onFilesSelected={(files) => {
                      setFormData((prev) => ({
                        ...(prev as TrainingRecord),
                        bond_agreement_document: files
                      }));
                    }}
                    initialDocuments={(formData as TrainingRecord).bond_agreement_document || []}
                    onDocumentDeleted={(removedFile) => {
                      if (removedFile) {
                        setFormData((prev) => ({
                          ...(prev as TrainingRecord),
                          bond_agreement_document:
                            (prev as TrainingRecord).bond_agreement_document?.filter(
                              (file) =>
                                !(
                                  file.name === removedFile.name &&
                                  file.documentType === removedFile.documentType &&
                                  file.file === removedFile.file
                                )
                            ) || [],
                        }));
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}


        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleCancel}
            disabled={isLoading || isModalLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
            onClick={handleSave}
            disabled={isLoading || isModalLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              record ? 'Update' : 'Add'
            )} {isTraining ? 'Training' : 'Disciplinary'} Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
export { TrainingModal, RecordModal };
export type { TrainingRecord, DisciplinaryRecord };
