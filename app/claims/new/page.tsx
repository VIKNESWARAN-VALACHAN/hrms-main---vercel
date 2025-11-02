// //NEW UPDATED


// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { API_BASE_URL } from '../../config';
// import { toast } from 'react-hot-toast';
// import axios, { AxiosProgressEvent } from 'axios';

// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

// interface Benefit {
//   id: number;
//   employee_id: number;
//   benefit_type: string;
//   description: string;
//   frequency: string;
//   entitled: string;
//   claimed: string;
//   balance: string;
//   effective_from: string;
//   effective_to: string;
//   status: 'Active' | 'Upcoming' | 'Expired' | 'Unknown';
// }

// interface FormData {
//   benefit_type_id: string;
//   amount: string;
//   claim_date: string;
//   employee_remark: string;
// }

// export default function NewClaimForm() {
//   const router = useRouter();
//   const [user, setUser] = useState<User | null>(null);
//   const [benefits, setBenefits] = useState<Benefit[]>([]);
//   const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
//   const [amountError, setAmountError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isDragActive, setIsDragActive] = useState(false);

//   const [formData, setFormData] = useState<FormData>({
//     benefit_type_id: '',
//     amount: '',
//     claim_date: new Date().toISOString().split('T')[0],
//     employee_remark: '',
//   });

//   useEffect(() => {
//     const loadUserData = () => {
//       try {
//         const userData = localStorage.getItem('hrms_user');
//         if (userData) {
//           const parsedUser = JSON.parse(userData) as User;
//           setUser(parsedUser);
//           return parsedUser;
//         }
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         toast.error('Failed to load user data');
//       }
//       return null;
//     };

//     const loadBenefits = async (userId: number) => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/employee-benefits/summary/${userId}`);
//         if (!response.ok) throw new Error('Failed to fetch benefits');

//         const data = await response.json();
//         const validatedBenefits = Array.isArray(data)
//           ? data.filter((b): b is Benefit => (
//               b &&
//               typeof b.id === 'number' &&
//               typeof b.benefit_type === 'string'
//             ))
//           : [];

//         setBenefits(validatedBenefits);
//       } catch (error) {
//         console.error('Failed to load benefits:', error);
//         toast.error('Failed to load benefits');
//       }
//     };

//     const u = loadUserData();
//     if (u) {
//       loadBenefits(u.id);
//     }
//   }, []);


//   const handleBenefitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//   const benefitId = e.target.value;
  
//   // Debug: Log the benefits array to see actual structure
//   console.log('All benefits:', benefits);
//   console.log('Selected benefit ID:', benefitId);
  
//   const benefit = benefits.find(b => {
//     // Try multiple possible ID fields since backend might use different structure
//     const possibleIds = [
//       b.id, 
//     ];
//     return possibleIds.some(id => id?.toString() === benefitId);
//   });
  
//   if (benefit) {
//     setSelectedBenefit(benefit);
//     setFormData(prev => ({
//       ...prev,
//       benefit_type_id: benefitId,
//       amount: ''
//     }));
//     setAmountError('');
    
//     // Calculate actual balance
//     const entitled = parseFloat(benefit.entitled) || 0;
//     const claimed = parseFloat(benefit.claimed) || 0;
//     const actualBalance = entitled - claimed;
    
//     console.log('Selected benefit details:', {
//       benefit,
//       entitled,
//       claimed,
//       actualBalance,
//       status: benefit.status
//     });
    
//     if (actualBalance <= 0) {
//       toast.error('This benefit has no available balance', {
//         duration: 4000,
//         position: 'top-center',
//         style: {
//           background: '#fee2e2',
//           color: '#b91c1c',
//           fontWeight: '500'
//         }
//       });
//     }
//   } else {
//     setSelectedBenefit(null);
//     setFormData(prev => ({
//       ...prev,
//       benefit_type_id: '',
//       amount: ''
//     }));
//   }
// };
  
//   const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setFormData(prev => ({ ...prev, amount: value }));

//     if (!selectedBenefit) return;

//     const balance = parseFloat(selectedBenefit.balance);
//     const amount = parseFloat(value);
    
//     if (value === '') {
//       setAmountError('');
//     } else if (isNaN(amount)) {
//       setAmountError('Please enter a valid amount');
//     } else if (amount <= 0) {
//       setAmountError('Amount must be greater than 0');
//     } else if (amount > balance) {
//       setAmountError(`Amount exceeds available balance of RM ${balance.toFixed(2)}`);
//     } else {
//       setAmountError('');
//     }
//   };

//   const handleSubmit = async () => {
//     if (!user) {
//       toast.error('User session expired. Please login again.');
//       return;
//     }

//     if (!formData.benefit_type_id) {
//       toast.error('Please select a benefit type.');
//       return;
//     }

//     const amount = parseFloat(formData.amount);
//     if (isNaN(amount) || amount <= 0) {
//       toast.error('Please enter a valid amount greater than 0.');
//       return;
//     }

//     if (amountError) {
//       toast.error(amountError);
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const payload = {
//         employee_id: user.id,
//         benefit_type_id: parseInt(formData.benefit_type_id),
//         claim_date: formData.claim_date,
//         amount: amount,
//         employee_remark: formData.employee_remark,
//       };

//       const res = await fetch(`${API_BASE_URL}/api/claims`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(errorData.message || 'Failed to submit claim');
//       }

//       const { claim_id } = await res.json();

//       // Upload attachment
//       if (selectedFile) {
//         const fileData = new FormData();
//         fileData.append('attachment', selectedFile);
//         fileData.append('claim_id', claim_id.toString());
//         fileData.append('uploaded_by', user.id.toString());

//       const uploadRes = await axios.post(
//         `${API_BASE_URL}/api/claims/attachments`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             //'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
//           },
//           onUploadProgress: (progressEvent: AxiosProgressEvent) => {
//             if (progressEvent.total !== undefined) {
//               const percentCompleted = Math.round(
//                 (progressEvent.loaded * 100) / progressEvent.total
//               );
//               console.log(`Upload progress: ${percentCompleted}%`);
//             }
//           }
//         }
//       );

//               if (uploadRes.status !== 201) {
//                 throw new Error('Upload failed');
//               }
//       }

//       toast.success('Claim submitted successfully!', {
//         duration: 2000,
//         position: 'top-center',
//       });

//       setTimeout(() => router.push('/claims'), 2000);
//     } catch (err) {
//       console.error('Error submitting claim:', err);
//       toast.error(
//         err instanceof Error ? err.message : 'Error submitting claim. Please try again.',
//         {
//           duration: 4000,
//           position: 'top-center',
//         }
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

// const UPLOAD_UI_ENABLED = false; 
//   return (
//     <main className="container mx-auto p-4 max-w-3xl">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-base-content">Submit New Claim</h1>
//           <p className="text-sm text-base-content/70 mt-1">Fill in the details below to submit your claim</p>
//         </div>
//         <Link 
//           href="/claims" 
//           className="btn btn-outline btn-sm hover:bg-base-200 transition-colors"
//           aria-label="Back to claims list"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//           </svg>
//           Back to Claims
//         </Link>
//       </div>

//       <div className="bg-base-100 rounded-xl shadow-sm p-6 border border-base-200">
//         {/* Benefit Selection */}
//         <div className="mb-6">
//           <label htmlFor="benefit-type" className="block text-sm font-medium text-base-content mb-2">
//             Benefit Type
//             <span className="text-error ml-1">*</span>
//           </label>
//           {/* <select
//             id="benefit-type"
//             className="select select-bordered w-full focus:ring-2 focus:ring-primary focus:border-primary bg-base-100"
//             value={formData.benefit_type_id}
//             onChange={handleBenefitChange}
//             aria-required="true"
//             aria-invalid={!formData.benefit_type_id}
//           >
//             <option value="">Select Benefit Type</option>
//             {benefits.map((benefit) => {
//               const isActive = benefit.status === 'Active';
//               const hasBalance = parseFloat(benefit.balance) > 0;
//               const isDisabled = !isActive || !hasBalance;
              
//               return (
//                 <option 
//                   key={`benefit-${benefit.id}`}
//                   value={isActive ? benefit.id.toString() : ''}
//                   disabled={isDisabled}
//                   className={isDisabled ? 'text-base-content/40 italic' : ''}
//                 >
//                   {benefit.benefit_type}
//                   {!isActive && ` (${benefit.status})`}
//                   {isActive && !hasBalance && ' (No balance)'}
//                 </option>
//               );
//             })}
//           </select> */}
//           <select
//   id="benefit-type"
//   className="select select-bordered w-full focus:ring-2 focus:ring-primary focus:border-primary bg-base-100"
//   value={formData.benefit_type_id}
//   onChange={handleBenefitChange}
//   aria-required="true"
//   aria-invalid={!formData.benefit_type_id}
// >
//   <option value="">Select Benefit Type</option>
//   {benefits.map((benefit) => {
//     // Calculate actual balance
//     const entitled = parseFloat(benefit.entitled) || 0;
//     const claimed = parseFloat(benefit.claimed) || 0;
//     const balance = entitled - claimed;
//     const isActive = benefit.status === 'Active';
//     const hasBalance = balance > 0;
//     const isSelectable = isActive && hasBalance;
    
//     // Use the correct ID - try multiple possible fields
//     const benefitId = benefit.id || benefit.id;
    
//     console.log(`Benefit: ${benefit.benefit_type}, ID: ${benefitId}, Active: ${isActive}, Balance: ${balance}, Selectable: ${isSelectable}`);
    
//     return (
//       <option 
//         key={`benefit-${benefitId}`}
//         value={isSelectable ? benefitId.toString() : ''}
//         disabled={!isSelectable}
//         className={!isSelectable ? 'text-base-content/40 italic' : ''}
//       >
//         {benefit.benefit_type}
//         {!isActive && ` (${benefit.status})`}
//         {isActive && !hasBalance && ` (No balance - RM ${balance.toFixed(2)})`}
//         {isActive && hasBalance && ` (Available: RM ${balance.toFixed(2)})`}
//       </option>
//     );
//   })}
// </select>
//           {selectedBenefit && (
//             <div className="mt-4 p-4 bg-base-200 rounded-lg border border-base-300">
//               <div className="grid grid-cols-3 gap-4 mb-3">
//                 <div className="space-y-1">
//                   <p className="text-xs font-medium text-base-content/70">Entitled</p>
//                   <p className="text-lg font-bold text-primary">
//                     RM {parseFloat(selectedBenefit.entitled).toFixed(2)}
//                   </p>
//                 </div>
                
//                 <div className="space-y-1">
//                   <p className="text-xs font-medium text-base-content/70">Balance</p>
//                   <p className={`text-lg font-bold ${
//                     parseFloat(selectedBenefit.balance) <= 0 ? 'text-error' : 'text-success'
//                   }`}>
//                     RM {parseFloat(selectedBenefit.balance).toFixed(2)}
//                   </p>
//                 </div>
                
//                 <div className="space-y-1">
//                   <p className="text-xs font-medium text-base-content/70">Yearly Claimed</p>
//                   <p className="text-lg font-bold text-secondary">
//                     RM {parseFloat(selectedBenefit.claimed || '0').toFixed(2)}
//                   </p>
//                 </div>
//               </div>
              
//               {selectedBenefit.description && (
//                 <div className="flex items-start gap-2 p-3 bg-base-100 rounded border border-base-300">
//                   <svg 
//                     xmlns="http://www.w3.org/2000/svg" 
//                     className="h-5 w-5 text-info flex-shrink-0 mt-0.5" 
//                     fill="none" 
//                     viewBox="0 0 24 24" 
//                     stroke="currentColor"
//                     aria-hidden="true"
//                   >
//                     <path 
//                       strokeLinecap="round" 
//                       strokeLinejoin="round" 
//                       strokeWidth={2} 
//                       d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
//                     />
//                   </svg>
//                   <p className="text-sm text-base-content/80">{selectedBenefit.description}</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {benefits.length > 0 && !benefits.some(b => b.status === 'Active' && parseFloat(b.balance) > 0) && (
//             <div className="mt-4 alert alert-warning">
//               <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//               </svg>
//               <span>No benefits with available balance for claiming at this time.</span>
//             </div>
//           )}
//         </div>

//         {/* Amount Input */}
//         <div className="mb-6">
//           <label htmlFor="claim-amount" className="block text-sm font-medium text-base-content mb-2">
//             Claim Amount (RM)
//             <span className="text-error ml-1">*</span>
//           </label>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <span className="text-base-content/70">RM</span>
//             </div>
//             <input
//               id="claim-amount"
//               type="number"
//               className={`input input-bordered w-full pl-12 bg-base-100 ${amountError ? 'input-error' : ''}`}
//               placeholder="0.00"
//               value={formData.amount}
//               onChange={handleAmountChange}
//               step="0.01"
//               min="0"
//               aria-required="true"
//               aria-invalid={!!amountError}
//               aria-describedby={amountError ? "amount-error" : undefined}
//               disabled={!selectedBenefit}
//             />
//             {amountError && (
//               <div className="absolute right-3 top-3">
//                 <div className="tooltip tooltip-error" data-tip={amountError}>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                   </svg>
//                 </div>
//               </div>
//             )}
//           </div>
//           {amountError && (
//             <p id="amount-error" className="mt-1 text-sm text-error flex items-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//               </svg>
//               {amountError}
//             </p>
//           )}
//         </div>

//         {/* Date Input */}
//         <div className="mb-6">
//           <label htmlFor="claim-date" className="block text-sm font-medium text-base-content mb-2">
//             Claim Date
//             <span className="text-error ml-1">*</span>
//           </label>
//           <input
//             id="claim-date"
//             type="date"
//             className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-primary bg-base-100"
//             value={formData.claim_date}
//             onChange={(e) => setFormData(prev => ({ ...prev, claim_date: e.target.value }))}
//             max={new Date().toISOString().split('T')[0]}
//             aria-required="true"
//           />
//         </div>

//     {/* Remarks */}
//     <div className="mb-6">
//       <label htmlFor="claim-remarks" className="block text-sm font-medium text-base-content mb-2">
//         Description / Remarks
//       </label>
//       <textarea
//         id="claim-remarks"
//         className="textarea textarea-bordered w-full focus:ring-2 focus:ring-primary focus:border-primary bg-base-100"
//         placeholder="Enter any additional details about your claim (optional)"
//         rows={4}
//         value={formData.employee_remark}
//         onChange={(e) => setFormData(prev => ({ ...prev, employee_remark: e.target.value }))}
//         aria-label="Claim description or remarks"
//       ></textarea>
//     </div>


//      {/* Attachment Upload */}
//       {/* <div className="mb-6">
//         <label className="block text-sm font-medium text-base-content mb-2">Attachment</label>
//         <div
//           className={`border border-dashed rounded-lg p-4 transition-all duration-200 ${
//             isDragActive ? 'bg-blue-100 border-blue-400' : 'border-base-300 bg-base-200'
//           }`}
//           onDragOver={(e) => {
//             e.preventDefault();
//             setIsDragActive(true);
//           }}
//           onDragLeave={() => setIsDragActive(false)}
//           onDrop={(e) => {
//             e.preventDefault();
//             setIsDragActive(false);
//             if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//               setSelectedFile(e.dataTransfer.files[0]);
//             }
//           }}
//         >
//           <div className="flex justify-between items-center mb-2">
//             <p className="text-sm text-base-content/70">
//               {isDragActive ? 'Drop file here to upload' : 'Upload medical certificate or supporting document'}
//             </p>
//             {!selectedFile && (
//               <label className="btn btn-sm btn-outline btn-primary cursor-pointer">
//                 + Add
//                 <input
//                   type="file"
//                   hidden
//                   accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
//                   onChange={(e) => {
//                     if (e.target.files && e.target.files.length > 0) {
//                       setSelectedFile(e.target.files[0]);
//                     }
//                   }}
//                 />
//               </label>
//             )}
//           </div>
//           {selectedFile && (
//             <div className="flex items-center gap-2 flex-wrap">
//               <div className="bg-base-100 px-3 py-1 rounded-md border border-base-300 flex items-center">
//                 <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
//                 <button
//                   type="button"
//                   className="ml-2 text-error hover:text-error-content"
//                   onClick={() => setSelectedFile(null)}
//                 >
//                   &times;
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div> */}

//       {/* Attachment Upload */}
// <div className="mb-6">
//   <label className="block text-sm font-medium text-base-content mb-2">Attachment</label>

//      <div
//       className="border border-dashed rounded-lg p-4 border-base-300 bg-base-200 opacity-60 pointer-events-none select-none"
//       aria-disabled="true"
//     >
//       <div className="flex justify-between items-center mb-2">
//         <p className="text-sm text-base-content/60">
//           Attachments are currently disabled by admin.
//         </p>
//         {/* Show a disabled button for consistent layout */}
//         <button className="btn btn-sm btn-outline btn-primary" disabled>
//           + Add
//         </button>
//       </div>
//       {selectedFile && (
//         <div className="flex items-center gap-2 flex-wrap">
//           <div className="bg-base-100 px-3 py-1 rounded-md border border-base-300 flex items-center">
//             <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
//           </div>
//         </div>
//       )}
//     </div>
// </div>


//       {/* Submit Button */}
//       <div className="flex justify-end">
//         <button
//           className={`btn btn-primary px-8 ${isSubmitting ? 'loading' : ''}`}
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? 'Submitting...' : 'Submit Claim'}
//         </button>
//       </div>
//     </div>
//   </main>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '../../config';
import { toast } from 'react-hot-toast';
import axios, { AxiosProgressEvent } from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Benefit {
  id: number;
  employee_id: number;
  benefit_type: string;
  description: string;
  frequency: string;
  entitled: string;
  claimed: string;
  balance: string;
  effective_from: string;
  effective_to: string;
  status: 'Active' | 'Upcoming' | 'Expired' | 'Unknown';
}

interface FormData {
  benefit_type_id: string;
  amount: string;
  claim_date: string;
  employee_remark: string;
}

interface ClaimAttachment {
  id: number;
  file_name: string;
  file_url: string;
  mime_type: string;
  uploaded_at: string;
  s3_key: string;
  uploaded_by_name: string;
}

export default function NewClaimForm() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [amountError, setAmountError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    benefit_type_id: '',
    amount: '',
    claim_date: new Date().toISOString().split('T')[0],
    employee_remark: '',
  });

  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = localStorage.getItem('hrms_user');
        if (userData) {
          const parsedUser = JSON.parse(userData) as User;
          setUser(parsedUser);
          return parsedUser;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        toast.error('Failed to load user data');
      }
      return null;
    };

    const loadBenefits = async (userId: number) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/employee-benefits/summary/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch benefits');

        const data = await response.json();
        const validatedBenefits = Array.isArray(data)
          ? data.filter((b): b is Benefit => (
              b &&
              typeof b.id === 'number' &&
              typeof b.benefit_type === 'string'
            ))
          : [];

        setBenefits(validatedBenefits);
      } catch (error) {
        console.error('Failed to load benefits:', error);
        toast.error('Failed to load benefits');
      }
    };

    const u = loadUserData();
    if (u) {
      loadBenefits(u.id);
    }
  }, []);

  const handleBenefitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const benefitId = e.target.value;
    
    console.log('All benefits:', benefits);
    console.log('Selected benefit ID:', benefitId);
    
    const benefit = benefits.find(b => b.id?.toString() === benefitId);
    
    if (benefit) {
      setSelectedBenefit(benefit);
      setFormData(prev => ({
        ...prev,
        benefit_type_id: benefitId,
        amount: ''
      }));
      setAmountError('');
      
      // Calculate actual balance
      const entitled = parseFloat(benefit.entitled) || 0;
      const claimed = parseFloat(benefit.claimed) || 0;
      const actualBalance = entitled - claimed;
      
      console.log('Selected benefit details:', {
        benefit,
        entitled,
        claimed,
        actualBalance,
        status: benefit.status
      });
      
      if (actualBalance <= 0) {
        toast.error('This benefit has no available balance', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#fee2e2',
            color: '#b91c1c',
            fontWeight: '500'
          }
        });
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

  // 🚨 FIXED: Enhanced submit function with proper file upload
  const handleSubmit = async () => {
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
      // Step 1: Create the claim
      const payload = {
        employee_id: user.id,
        benefit_type_id: parseInt(formData.benefit_type_id),
        claim_date: formData.claim_date,
        amount: amount,
        employee_remark: formData.employee_remark,
      };

      console.log('📤 Submitting claim:', payload);

      const claimRes = await fetch(`${API_BASE_URL}/api/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!claimRes.ok) {
        const errorData = await claimRes.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit claim');
      }

      const claimResponse = await claimRes.json();
      const claim_id = claimResponse.claim_id;
      console.log('✅ Claim created with ID:', claim_id);

      // Step 2: Upload attachment if file is selected
      if (selectedFile && claim_id) {
        setIsUploading(true);
        setUploadProgress(0);

        console.log('📎 Starting file upload...', {
          claim_id,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          file_type: selectedFile.type
        });

        const formData = new FormData();
        
        // 🚨 CRITICAL: Use the correct field name for express-fileupload
        formData.append('attachment', selectedFile);
        formData.append('uploaded_by', user.id.toString());

        console.log('🔄 Uploading to:', `${API_BASE_URL}/api/claims/${claim_id}/attachments`);
        
        try {
          const uploadRes = await axios.post(
            `${API_BASE_URL}/api/claims/${claim_id}/attachments`,
            formData,
            {
              // 🚨 IMPORTANT: Let axios set Content-Type automatically
              headers: {
                // Don't set Content-Type manually - axios will set multipart/form-data with boundary
              },
              timeout: 60000,
              onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                if (progressEvent.total) {
                  const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );
                  setUploadProgress(percentCompleted);
                  console.log(`Upload progress: ${percentCompleted}%`);
                }
              }
            }
          );

          console.log('✅ Upload successful:', uploadRes.data);
          toast.success('Attachment uploaded successfully');
          
        } catch (uploadError: any) {
          console.error('❌ Upload failed:', uploadError);
          console.error('Error response:', uploadError.response?.data);
          
          // Don't fail the entire claim if upload fails
          toast.error('Claim submitted but attachment upload failed: ' + 
            (uploadError.response?.data?.error || uploadError.message));
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      }

      toast.success('Claim submitted successfully!', {
        duration: 3000,
        position: 'top-center',
      });

      // Redirect after a short delay
      setTimeout(() => router.push('/claims'), 2000);

    } catch (err: any) {
      console.error('❌ Error submitting claim:', err);
      toast.error(
        err instanceof Error ? err.message : 'Error submitting claim. Please try again.',
        {
          duration: 4000,
          position: 'top-center',
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // File validation
  const validateFile = (file: File): string | null => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return 'Please select a valid file type (PDF, JPG, PNG, DOC, DOCX)';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setSelectedFile(file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Submit New Claim</h1>
          <p className="text-sm text-base-content/70 mt-1">Fill in the details below to submit your claim</p>
        </div>
        <Link 
          href="/claims" 
          className="btn btn-outline btn-sm hover:bg-base-200 transition-colors"
          aria-label="Back to claims list"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Claims
        </Link>
      </div>

      <div className="bg-base-100 rounded-xl shadow-sm p-6 border border-base-200">
        {/* Benefit Selection */}
        <div className="mb-6">
          <label htmlFor="benefit-type" className="block text-sm font-medium text-base-content mb-2">
            Benefit Type
            <span className="text-error ml-1">*</span>
          </label>
          <select
            id="benefit-type"
            className="select select-bordered w-full focus:ring-2 focus:ring-primary focus:border-primary bg-base-100"
            value={formData.benefit_type_id}
            onChange={handleBenefitChange}
            aria-required="true"
            aria-invalid={!formData.benefit_type_id}
          >
            <option value="">Select Benefit Type</option>
            {benefits.map((benefit) => {
              // Calculate actual balance
              const entitled = parseFloat(benefit.entitled) || 0;
              const claimed = parseFloat(benefit.claimed) || 0;
              const balance = entitled - claimed;
              const isActive = benefit.status === 'Active';
              const hasBalance = balance > 0;
              const isSelectable = isActive && hasBalance;
              
              console.log(`Benefit: ${benefit.benefit_type}, ID: ${benefit.id}, Active: ${isActive}, Balance: ${balance}, Selectable: ${isSelectable}`);
              
              return (
                <option 
                  key={`benefit-${benefit.id}`}
                  value={isSelectable ? benefit.id.toString() : ''}
                  disabled={!isSelectable}
                  className={!isSelectable ? 'text-base-content/40 italic' : ''}
                >
                  {benefit.benefit_type}
                  {!isActive && ` (${benefit.status})`}
                  {isActive && !hasBalance && ` (No balance - RM ${balance.toFixed(2)})`}
                  {isActive && hasBalance && ` (Available: RM ${balance.toFixed(2)})`}
                </option>
              );
            })}
          </select>
          
          {selectedBenefit && (
            <div className="mt-4 p-4 bg-base-200 rounded-lg border border-base-300">
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-base-content/70">Entitled</p>
                  <p className="text-lg font-bold text-primary">
                    RM {parseFloat(selectedBenefit.entitled).toFixed(2)}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-base-content/70">Balance</p>
                  <p className={`text-lg font-bold ${
                    parseFloat(selectedBenefit.balance) <= 0 ? 'text-error' : 'text-success'
                  }`}>
                    RM {parseFloat(selectedBenefit.balance).toFixed(2)}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-base-content/70">Yearly Claimed</p>
                  <p className="text-lg font-bold text-secondary">
                    RM {parseFloat(selectedBenefit.claimed || '0').toFixed(2)}
                  </p>
                </div>
              </div>
              
              {selectedBenefit.description && (
                <div className="flex items-start gap-2 p-3 bg-base-100 rounded border border-base-300">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-info flex-shrink-0 mt-0.5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  <p className="text-sm text-base-content/80">{selectedBenefit.description}</p>
                </div>
              )}
            </div>
          )}

          {benefits.length > 0 && !benefits.some(b => b.status === 'Active' && parseFloat(b.balance) > 0) && (
            <div className="mt-4 alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>No benefits with available balance for claiming at this time.</span>
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label htmlFor="claim-amount" className="block text-sm font-medium text-base-content mb-2">
            Claim Amount (RM)
            <span className="text-error ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-base-content/70">RM</span>
            </div>
            <input
              id="claim-amount"
              type="number"
              className={`input input-bordered w-full pl-12 bg-base-100 ${amountError ? 'input-error' : ''}`}
              placeholder="0.00"
              value={formData.amount}
              onChange={handleAmountChange}
              step="0.01"
              min="0"
              aria-required="true"
              aria-invalid={!!amountError}
              aria-describedby={amountError ? "amount-error" : undefined}
              disabled={!selectedBenefit}
            />
            {amountError && (
              <div className="absolute right-3 top-3">
                <div className="tooltip tooltip-error" data-tip={amountError}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          {amountError && (
            <p id="amount-error" className="mt-1 text-sm text-error flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {amountError}
            </p>
          )}
        </div>

        {/* Date Input */}
        <div className="mb-6">
          <label htmlFor="claim-date" className="block text-sm font-medium text-base-content mb-2">
            Claim Date
            <span className="text-error ml-1">*</span>
          </label>
          <input
            id="claim-date"
            type="date"
            className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-primary bg-base-100"
            value={formData.claim_date}
            onChange={(e) => setFormData(prev => ({ ...prev, claim_date: e.target.value }))}
            max={new Date().toISOString().split('T')[0]}
            aria-required="true"
          />
        </div>

        {/* Remarks */}
        <div className="mb-6">
          <label htmlFor="claim-remarks" className="block text-sm font-medium text-base-content mb-2">
            Description / Remarks
          </label>
          <textarea
            id="claim-remarks"
            className="textarea textarea-bordered w-full focus:ring-2 focus:ring-primary focus:border-primary bg-base-100"
            placeholder="Enter any additional details about your claim (optional)"
            rows={4}
            value={formData.employee_remark}
            onChange={(e) => setFormData(prev => ({ ...prev, employee_remark: e.target.value }))}
            aria-label="Claim description or remarks"
          ></textarea>
        </div>

        {/* Attachment Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-base-content mb-2">
            Attachment (Optional)
          </label>
          <div
            className={`border border-dashed rounded-lg p-4 transition-all duration-200 ${
              isDragActive ? 'bg-blue-100 border-blue-400' : 'border-base-300 bg-base-200'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={handleFileDrop}
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-base-content/70">
                {isDragActive ? 'Drop file here to upload' : 'Upload supporting document (optional)'}
              </p>
              {!selectedFile && (
                <label className="btn btn-sm btn-outline btn-primary cursor-pointer">
                  + Add
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileInputChange}
                  />
                </label>
              )}
            </div>
            
            {selectedFile && (
              <div className="flex items-center justify-between p-3 bg-base-100 rounded-md border border-base-300">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    selectedFile.type?.startsWith('image/') ? 'bg-blue-100 text-blue-600' :
                    selectedFile.type === 'application/pdf' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedFile.type?.startsWith('image/') ? '🖼️' : 
                     selectedFile.type === 'application/pdf' ? '📄' : 
                     '📎'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost text-error hover:bg-error hover:text-error-content"
                  onClick={() => setSelectedFile(null)}
                >
                  &times;
                </button>
              </div>
            )}

            {isUploading && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <progress 
                  className="progress progress-primary w-full" 
                  value={uploadProgress} 
                  max="100"
                ></progress>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Link 
            href="/claims" 
            className="btn btn-outline px-8"
          >
            Cancel
          </Link>
          <button
            className={`btn btn-primary px-8 ${isSubmitting ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? 'Submitting...' : 
             isUploading ? 'Uploading...' : 'Submit Claim'}
          </button>
        </div>
      </div>
    </main>
  );
}
