'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, Info, Upload, X } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useTheme } from '../../components/ThemeProvider';

interface BenefitSummary {
  id: number;
  benefit_type: string;
  description: string;
  entitled: string;
  claimed: string;
  balance: string;
  status: 'Active' | 'Expired' | 'Upcoming' | 'Unknown';
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface FormData {
  benefit_type_id: string;
  amount: string;
  claim_date: string;
  employee_remark: string;
}

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
}

export default function NewClaimModal({ 
  isOpen, 
  onClose, 
  benefits 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  benefits: BenefitSummary[] 
}) {
      const { theme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitSummary | null>(null);
  const [amountError, setAmountError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);

  const [formData, setFormData] = useState<FormData>({
    benefit_type_id: '',
    amount: '',
    claim_date: new Date().toISOString().split('T')[0],
    employee_remark: '',
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      const userData = localStorage.getItem('hrms_user');
      if (userData) setUser(JSON.parse(userData));
      
      setFormData({
        benefit_type_id: '',
        amount: '',
        claim_date: new Date().toISOString().split('T')[0],
        employee_remark: '',
      });
      setSelectedFiles([]);
      setAmountError('');
    }
  }, [isOpen]);

  const handleBenefitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const benefitId = e.target.value;
    const benefit = benefits.find(b => b.id.toString() === benefitId);
    
    if (benefit) {
      setSelectedBenefit(benefit);
      setFormData(prev => ({
        ...prev,
        benefit_type_id: benefitId,
        amount: ''
      }));
      setAmountError('');
      
      if (parseFloat(benefit.balance) <= 0) {
        toast.error('This benefit has no available balance');
      }
    } else {
      setSelectedBenefit(null);
      setFormData(prev => ({
        ...prev,
        benefit_type_id: '',
        amount: ''
      }));
    }
  };
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, amount: value }));

    if (!selectedBenefit) return;

    const balance = parseFloat(selectedBenefit.balance);
    const amount = parseFloat(value);
    
    if (value === '') {
      setAmountError('');
    } else if (isNaN(amount)) {
      setAmountError('Please enter a valid amount');
    } else if (amount <= 0) {
      setAmountError('Amount must be greater than 0');
    } else if (amount > balance) {
      setAmountError(`Amount exceeds available balance of RM ${balance.toFixed(2)}`);
    } else {
      setAmountError('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(2, 9)
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(2, 9)
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleSubmit1 = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('User session expired. Please login again.');
      return;
    }

    if (!formData.benefit_type_id) {
      toast.error('Please select a benefit type.');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount greater than 0.');
      return;
    }

    if (amountError) {
      toast.error(amountError);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create the claim
      const payload = {
        employee_id: user.id,
        benefit_type_id: parseInt(formData.benefit_type_id),
        claim_date: formData.claim_date,
        amount: amount,
        employee_remark: formData.employee_remark,
      };

      const res = await axios.post(`${API_BASE_URL}/api/claims`, payload);
      const claimId = res.data.claim_id;

      // 2. Upload attachments if any
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(file => {
          const formData = new FormData();
          formData.append('attachment', file.file);
          formData.append('claim_id', claimId);
          formData.append('uploaded_by', user.id.toString());
          
          return axios.post(`${API_BASE_URL}/api/claims/${claimId}/attachments`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        });

        await Promise.all(uploadPromises);
      }

      toast.success('Claim submitted successfully!');
      onClose();
      router.refresh();
    } catch (err: any) {
      console.error('Error submitting claim:', err);
      toast.error(err.response?.data?.message || 'Error submitting claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleSubmit2 = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user) {
    toast.error('User session expired. Please login again.');
    return;
  }

  if (!formData.benefit_type_id) {
    toast.error('Please select a benefit type.');
    return;
  }

  const amount = parseFloat(formData.amount);
  if (isNaN(amount) || amount <= 0) {
    toast.error('Please enter a valid amount greater than 0.');
    return;
  }

  if (amountError) {
    toast.error(amountError);
    return;
  }

  setIsSubmitting(true);

  try {
    // 1. Create the claim
    const payload = {
      employee_id: user.id,
      benefit_type_id: parseInt(formData.benefit_type_id),
      claim_date: formData.claim_date,
      amount: amount,
      employee_remark: formData.employee_remark,
    };

    const res = await axios.post(`${API_BASE_URL}/api/claims`, payload);
    const claimId = res.data.claim_id;

    // 2. Upload attachments sequentially if any
if (selectedFiles.length > 0) {
  toast.loading('Uploading attachments...', { id: 'uploading-files' });
  for (const fileItem of selectedFiles) {
    try {
      const fileFormData = new FormData();
      fileFormData.append('attachment', fileItem.file);
      
      // Add other required fields
      fileFormData.append('claim_id', claimId.toString());
      fileFormData.append('uploaded_by', user.id.toString());

      await axios.post(`${API_BASE_URL}/api/claims/${claimId}/attachments`, fileFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: 10 * 1024 * 1024, // 10MB
        maxBodyLength: 10 * 1024 * 1024, // 10MB
        timeout: 60000 // 60 seconds timeout
      });
    } catch (err) {
      console.error('Error uploading file:', fileItem.file.name, err);
      toast.error(`Failed to upload ${fileItem.file.name}`);
      // Continue with other files
    }
  }
  toast.dismiss('uploading-files');
}

    toast.success('Claim submitted successfully! 🎉');
    onClose();
    router.refresh();
  } catch (err: any) {
    console.error('Error submitting claim:', err);
    toast.dismiss('uploading-files'); // Dismiss loading toast on error too
    const errorMessage = err.response?.data?.error || err.message || 'Error submitting claim. Please try again.';
    toast.error(`Submission failed: ${errorMessage} 😥`);
  } finally {
    setIsSubmitting(false);
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validation checks
  if (!user) {
    toast.error('User session expired. Please login again.');
    return;
  }

  if (!formData.benefit_type_id) {
    toast.error('Please select a benefit type.');
    return;
  }

  const amount = parseFloat(formData.amount);
  if (isNaN(amount) || amount <= 0) {
    toast.error('Please enter a valid amount greater than 0.');
    return;
  }

  if (amountError) {
    toast.error(amountError);
    return;
  }

  setIsSubmitting(true);
  const uploadToastId = 'upload-progress';
  let claimId: number | null = null;

  try {
    // 1. Create the claim first
    const payload = {
      employee_id: user.id,
      benefit_type_id: parseInt(formData.benefit_type_id),
      claim_date: formData.claim_date,
      amount: amount,
      employee_remark: formData.employee_remark,
    };

    const claimResponse = await axios.post(`${API_BASE_URL}/api/claims`, payload, {
      timeout: 30000 // 30 seconds for claim creation
    });
    claimId = claimResponse.data.claim_id;

    const safeClaimId = claimId?.toString() ?? '';
if (!safeClaimId) {
  throw new Error('Claim creation failed - no claim ID returned');
}

    // 2. Upload attachments if any exist
    if (selectedFiles.length > 0) {
      toast.loading(`Preparing to upload ${selectedFiles.length} file(s)...`, { id: uploadToastId });

      // Upload files sequentially with retry logic
      for (let i = 0; i < selectedFiles.length; i++) {
        const fileItem = selectedFiles[i];
        let uploadSuccess = false;
        let retryCount = 0;
        const maxRetries = 3;

        while (!uploadSuccess && retryCount < maxRetries) {
          try {
            
            const fileFormData = new FormData();
            fileFormData.append('attachment', fileItem.file);
            fileFormData.append('claim_id', safeClaimId);
            fileFormData.append('uploaded_by', user.id.toString());

            // Update progress message
            toast.loading(
              `Uploading file ${i + 1} of ${selectedFiles.length}: ${fileItem.file.name} ${
                retryCount > 0 ? `(Retry ${retryCount})` : ''
              }`, 
              { id: uploadToastId }
            );

            await axios.post(`${API_BASE_URL}/api/claims/${claimId}/attachments`, fileFormData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              maxContentLength: 10 * 1024 * 1024, // 10MB
              maxBodyLength: 10 * 1024 * 1024, // 10MB
              timeout: 120000, // 2 minutes per file
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  const percentComplete = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );
                  toast.loading(
                    `Uploading file ${i + 1} of ${selectedFiles.length}: ${fileItem.file.name} - ${percentComplete}%`,
                    { id: uploadToastId }
                  );
                }
              },
            });

            uploadSuccess = true;
          } catch (err) {
            retryCount++;
            console.error(`Error uploading ${fileItem.file.name} (attempt ${retryCount}):`, err);

            if (retryCount >= maxRetries) {
              toast.error(`Failed to upload ${fileItem.file.name} after ${maxRetries} attempts`);
              // Continue with next file even if this one fails
              break;
            }

            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        }
      }

      toast.success(`Successfully uploaded ${selectedFiles.length} file(s)`, { 
        id: uploadToastId,
        duration: 2000 
      });
    }

    // Final success message
    toast.success('Claim submitted successfully! 🎉', { duration: 3000 });
    onClose();
    router.refresh();

  } catch (err: any) {
    console.error('Error in claim submission:', err);
    
    // Clean up if claim was created but files failed
    if (claimId) {
      try {
        await axios.delete(`${API_BASE_URL}/api/claims/${claimId}`, {
          timeout: 10000
        });
        console.log('Cleaned up partially created claim due to failure');
      } catch (cleanupErr) {
        console.error('Error cleaning up failed claim:', cleanupErr);
      }
    }

    // User-friendly error messages
    let errorMessage = 'Error submitting claim. Please try again.';
    if (err.response) {
      if (err.response.status === 413) {
        errorMessage = 'File size too large (max 10MB)';
      } else if (err.response.status === 408 || err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection.';
      } else if (err.response.data?.error) {
        errorMessage = err.response.data.error;
      }
    } else if (err.message.includes('network error')) {
      errorMessage = 'Network error. Please check your connection.';
    }

    toast.error(`Submission failed: ${errorMessage}`, { 
      id: uploadToastId,
      duration: 5000 
    });

  } finally {
    setIsSubmitting(false);
    // Clean up any remaining toasts
    toast.dismiss(uploadToastId);
  }
};

  // Clean up object URLs
  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [selectedFiles]);

  if (!isOpen) return null;

return (
  // Use a dialog element for a native and accessible modal
  <dialog 
    id="new_claim_request_modal" 
    className="modal modal-open" // Use modal-open to show it by default or conditionally
  >
    <div className="modal-box max-w-2xl p-0 overflow-hidden max-h-[90vh]">
      {/* Modal Header */}
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b">
        <div className="flex justify-between items-start">
          <h3 className="text-lg leading-6 font-medium text-gray-900">New Claim Request</h3>
          <form method="dialog">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </form>
        </div>
      </div>

      {/* Modal Content - Padded to separate from header/footer */}
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Benefit Type</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.benefit_type_id}
                onChange={handleBenefitChange}
                required
              >
                <option value="">Select Benefit Type</option>
                {benefits.map((benefit) => {
                  const isActive = benefit.status === 'Active';
                  const hasBalance = parseFloat(benefit.balance) > 0;
                  const isDisabled = !isActive || !hasBalance;
                  
                  return (
                    <option 
                      key={`benefit-${benefit.id}`}
                      value={isActive ? benefit.id.toString() : ''}
                      disabled={isDisabled}
                      className={isDisabled ? 'text-gray-400 italic' : ''}
                    >
                      {benefit.benefit_type}
                      {!isActive && ` (${benefit.status})`}
                      {isActive && !hasBalance && ' (No balance)'}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Claim Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={formData.claim_date}
                onChange={(e) => setFormData(prev => ({ ...prev, claim_date: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {selectedBenefit && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-600">Entitled</p>
                  <p className="text-lg font-bold text-blue-600">
                    RM {parseFloat(selectedBenefit.entitled).toFixed(2)}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-600">Balance</p>
                  <p className={`text-lg font-bold ${
                    parseFloat(selectedBenefit.balance) <= 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    RM {parseFloat(selectedBenefit.balance).toFixed(2)}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-600">Yearly Claimed</p>
                  <p className="text-lg font-bold text-purple-600">
                    RM {parseFloat(selectedBenefit.claimed || '0').toFixed(2)}
                  </p>
                </div>
              </div>
              
              {selectedBenefit.description && (
                <div className="flex items-start gap-2 p-3 bg-white rounded border border-gray-200">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{selectedBenefit.description}</p>
                </div>
              )}
            </div>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text">Amount (RM)</span>
              {amountError && <span className="label-text-alt text-error">{amountError}</span>}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">RM</span>
              </div>
              <input
                type="number"
                className={`input input-bordered w-full pl-12 ${amountError ? 'input-error' : ''}`}
                placeholder="0.00"
                value={formData.amount}
                onChange={handleAmountChange}
                step="0.01"
                min="0.01"
                required
                disabled={!selectedBenefit}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description / Remarks</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Enter any additional details about your claim"
              rows={4}
              value={formData.employee_remark}
              onChange={(e) => setFormData(prev => ({ ...prev, employee_remark: e.target.value }))}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Supporting Documents</span>
              <span className="label-text-alt">(Optional)</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {isDragActive ? 'Drop files here' : 'Drag and drop files here, or click to select'}
                </p>
                <label className="btn btn-sm btn-outline mt-2">
                  Select Files
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  PDF, JPG, PNG, DOC up to 10MB
                </p>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {selectedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                    <div className="flex items-center space-x-2 truncate">
                      {file.file.type.startsWith('image/') ? (
                        <img src={file.preview} alt="Preview" className="h-10 w-10 object-cover rounded" />
                      ) : (
                        <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded">
                          <span className="text-xs font-medium text-gray-500">
                            {file.file.name.split('.').pop()?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-sm truncate">{file.file.name}</span>
                      <span className="text-xs text-gray-500">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost text-error"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !!amountError}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Submitting...
                </>
              ) : (
                'Submit Claim'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    {/* This form and button create the modal backdrop */}
    <form method="dialog" className="modal-backdrop">
      <button onClick={onClose}>close</button>
    </form>
  </dialog>
);
}