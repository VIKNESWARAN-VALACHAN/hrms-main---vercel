// import React from 'react';

// interface BaseRecord {
//   id?: string;
//   status?: string;
//   attachments?: Array<{ id?: number; name: string; file?: File; url?: string }>;
// }

// interface TrainingRecord extends BaseRecord {
//   training_course: string;
//   venue: string;
//   start_datetime: string;
//   end_datetime: string;
//   status: 'pending' | 'completed' | 'cancelled';

//     // Bonding fields
//   has_bond?: boolean;
//   bond_period_months?: number;
//   bond_start_date?: string;
//   bond_end_date?: string;
//   bond_status?: 'active' | 'fulfilled' | 'breached';
// }

// interface DisciplinaryRecord extends BaseRecord {
//   issue_date: string;
//   type_of_letter: string;
//   reason: string;
// }

// interface RecordCardProps {
//   record: TrainingRecord | DisciplinaryRecord;
//   type: 'training' | 'disciplinary';
//   isEditing?: boolean;
//   onEdit?: (record: TrainingRecord | DisciplinaryRecord) => void;
//   onDelete?: (recordId: string) => void;
// }

// const getStatusBadgeClass = (status: string) => {
//   switch (status) {
//     case 'completed':
//       return 'badge-success';
//     case 'pending':
//       return 'badge-warning';
//     case 'cancelled':
//       return 'badge-error';
//     default:
//       return 'badge-neutral';
//   }
// };

// const formatDateTime = (dateTime: string) => {
//   if (!dateTime) return '';
//   return new Date(dateTime).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   });
// };

// const formatDate = (date: string) => {
//   if (!date) return '';
//   return new Date(date).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric'
//   });
// };


// const RecordCard: React.FC<RecordCardProps> = ({
//   record,
//   type,
//   isEditing = false,
//   onEdit,
//   onDelete
// }) => {
//   const isTraining = type === 'training';
//   const trainingRecord = isTraining ? (record as TrainingRecord) : null;
//   const disciplinaryRecord = !isTraining ? (record as DisciplinaryRecord) : null;

//   return (
//     <div className="card bg-base-100 border border-base-300 shadow-sm">
//       <div className="card-body p-4">
//         <div className="flex justify-between items-start mb-3">
//           <h3 className="card-title text-lg">
//             {isTraining ? trainingRecord?.training_course : disciplinaryRecord?.type_of_letter}
//           </h3>
//           <div className="flex items-center gap-2">
//             {isTraining && trainingRecord?.status && (
//               <div className={`badge ${getStatusBadgeClass(trainingRecord.status)} capitalize`}>
//                 {trainingRecord.status}
//               </div>
//             )}
//             {isEditing && (
//               <div className="flex gap-1">
//                 <button 
//                   type="button"
//                   className="btn btn-ghost btn-sm"
//                   onClick={() => onEdit?.(record)}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                   </svg>
//                 </button>
//                 <button 
//                   type="button"
//                   className="btn btn-ghost btn-sm text-error"
//                   onClick={() => record.id && onDelete?.(record.id)}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                   </svg>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
        
//         <div className="space-y-2 text-sm">
//           {isTraining ? (
//             <>
//               <div className="flex items-center gap-2">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                 </svg>
//                 <span className="text-gray-600">{trainingRecord?.venue || 'No venue specified'}</span>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 <span className="text-gray-600">
//                   {formatDateTime(trainingRecord?.start_datetime || '')} - {formatDateTime(trainingRecord?.end_datetime || '')}
//                 </span>
//               </div>

//              {/* Bond Info */}
// {trainingRecord?.has_bond && (
//   <div className="border border-base-300 rounded-lg p-4 bg-base-100 shadow-sm mt-4">
//     <div className="flex items-center justify-between mb-2">
//       <h4 className="text-sm font-semibold text-base-content">Training Bond Details</h4>
//       <span
//         className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
//           trainingRecord.bond_status === 'active'
//             ? 'bg-green-100 text-green-800'
//             : trainingRecord.bond_status === 'fulfilled'
//             ? 'bg-blue-100 text-blue-800'
//             : 'bg-red-100 text-red-800'
//         }`}
//       >
//         {trainingRecord.bond_status}
//       </span>
//     </div>
//     <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-700">
//       <div>
//         <span className="font-medium text-gray-500">Bond Period</span>
//         <div className="text-base-content">{trainingRecord.bond_period_months} months</div>
//       </div>
//       <div>
//         <span className="font-medium text-gray-500">Start Date</span>
//         <div className="text-base-content">{formatDate(trainingRecord.bond_start_date || '')}</div>
//       </div>
//       <div>
//         <span className="font-medium text-gray-500">End Date</span>
//         <div className="text-base-content">{formatDate(trainingRecord.bond_end_date || '')}</div>
//       </div>
//     </div>
//   </div>
// )}



//             </>
//           ) : (
//             <>
//               <div className="flex items-center gap-2">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 <span className="text-gray-600">Issue Date: {formatDate(disciplinaryRecord?.issue_date || '')}</span>
//               </div>
              
//               <div className="flex items-start gap-2">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//                 <div className="text-gray-600">
//                   <div className="font-medium">Reason:</div>
//                   <div className="text-sm">{disciplinaryRecord?.reason || 'No reason specified'}</div>
//                 </div>
//               </div>
//             </>
//           )}
          
//           {record.attachments && record.attachments.length > 0 && (
//             <div className="flex items-center gap-2">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
//               </svg>
//               <span className="text-gray-600">{record.attachments.length} attachment(s)</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecordCard;
// export type { TrainingRecord, DisciplinaryRecord };
import React from 'react';

interface BaseRecord {
  id?: string;
  status?: string;
  attachments?: Array<{ id?: number; name: string; file?: File; url?: string }>;
}

interface TrainingRecord extends BaseRecord {
  training_course: string;
  venue: string;
  start_datetime: string;
  end_datetime: string;
  status: 'pending' | 'completed' | 'cancelled';

  // Bonding fields
  has_bond?: boolean;
  bond_period_days?: number; // Changed from months to days
  bond_start_date?: string;
  bond_end_date?: string;
  bond_status?: 'active' | 'fulfilled' | 'breached';
}

interface DisciplinaryRecord extends BaseRecord {
  issue_date: string;
  type_of_letter: string;
  reason: string;
}

interface RecordCardProps {
  record: TrainingRecord | DisciplinaryRecord;
  type: 'training' | 'disciplinary';
  isEditing?: boolean;
  onEdit?: (record: TrainingRecord | DisciplinaryRecord) => void;
  onDelete?: (recordId: string) => void;
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'badge-success';
    case 'pending':
      return 'badge-warning';
    case 'cancelled':
      return 'badge-error';
    default:
      return 'badge-neutral';
  }
};

const formatDateTime = (dateTime: string) => {
  if (!dateTime) return '';
  return new Date(dateTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Function to calculate remaining bond days
const getRemainingBondDays = (bondEndDate: string | undefined): number | null => {
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

const RecordCard: React.FC<RecordCardProps> = ({
  record,
  type,
  isEditing = false,
  onEdit,
  onDelete
}) => {
  const isTraining = type === 'training';
  const trainingRecord = isTraining ? (record as TrainingRecord) : null;
  const disciplinaryRecord = !isTraining ? (record as DisciplinaryRecord) : null;

  // Calculate remaining bond days if bond exists
  const remainingBondDays = trainingRecord?.has_bond && trainingRecord.bond_end_date 
    ? getRemainingBondDays(trainingRecord.bond_end_date)
    : null;

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="card-title text-lg">
            {isTraining ? trainingRecord?.training_course : disciplinaryRecord?.type_of_letter}
          </h3>
          <div className="flex items-center gap-2">
            {isTraining && trainingRecord?.status && (
              <div className={`badge ${getStatusBadgeClass(trainingRecord.status)} capitalize`}>
                {trainingRecord.status}
              </div>
            )}
            {isEditing && (
              <div className="flex gap-1">
                <button 
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => onEdit?.(record)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  type="button"
                  className="btn btn-ghost btn-sm text-error"
                  onClick={() => record.id && onDelete?.(record.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          {isTraining ? (
            <>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600">{trainingRecord?.venue || 'No venue specified'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">
                  {formatDateTime(trainingRecord?.start_datetime || '')} - {formatDateTime(trainingRecord?.end_datetime || '')}
                </span>
              </div>

              {/* Bond Info */}
              {trainingRecord?.has_bond && (
                <div className="border border-base-300 rounded-lg p-4 bg-base-100 shadow-sm mt-4">
<div className="flex items-center flex-wrap gap-2 mb-2">
  <h4 className="text-sm font-semibold text-base-content">
    Training Bond Details
  </h4>

  {/* Bond Status Badge (Active/Fulfilled/Breached) */}
  <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
    trainingRecord.bond_status === 'active'
      ? 'bg-green-100 text-green-800'
      : trainingRecord.bond_status === 'fulfilled'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-red-100 text-red-800'
  }`}>
    {trainingRecord.bond_status}
  </span>

  {/* Remaining Days/Bond Completed Badge */}
  {remainingBondDays !== null && (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
      remainingBondDays <= 0
        ? 'bg-gray-100 text-gray-800'
        : remainingBondDays <= 30
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-green-100 text-green-800'
    }`}>
      {remainingBondDays <= 0
        ? 'Bond Completed'
        : remainingBondDays === 1
        ? 'Last day'
        : `${remainingBondDays} days remaining`}
    </span>
  )}
</div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-700">
                    <div>
                      <span className="font-medium text-gray-500">Bond Period</span>
                      <div className="text-base-content">
                        {trainingRecord.bond_period_days} days
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Start Date</span>
                      <div className="text-base-content">
                        {formatDate(trainingRecord.bond_start_date || '')}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">End Date</span>
                      <div className="text-base-content">
                        {formatDate(trainingRecord.bond_end_date || '')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">Issue Date: {formatDate(disciplinaryRecord?.issue_date || '')}</span>
              </div>
              
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="text-gray-600">
                  <div className="font-medium">Reason:</div>
                  <div className="text-sm">{disciplinaryRecord?.reason || 'No reason specified'}</div>
                </div>
              </div>
            </>
          )}
          
          {record.attachments && record.attachments.length > 0 && (
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className="text-gray-600">{record.attachments.length} attachment(s)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordCard;
export type { TrainingRecord, DisciplinaryRecord };


                  // <div className="flex items-center justify-between mb-2">
                  //   <h4 className="text-sm font-semibold text-base-content">Training Bond Details</h4>
                  //   <div className="flex items-center gap-2">
                  //     {/* Bond Status Badge (Active/Fulfilled/Breached) */}
                  //     <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                  //       trainingRecord.bond_status === 'active'
                  //         ? 'bg-green-100 text-green-800'
                  //         : trainingRecord.bond_status === 'fulfilled'
                  //         ? 'bg-blue-100 text-blue-800'
                  //         : 'bg-red-100 text-red-800'
                  //     }`}>
                  //       {trainingRecord.bond_status}
                  //     </span>

                  //     {/* Remaining Days/Bond Completed Badge */}
                  //     {remainingBondDays !== null && (
                  //       <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  //         remainingBondDays <= 0
                  //           ? 'bg-gray-100 text-gray-800'
                  //           : remainingBondDays <= 30
                  //           ? 'bg-yellow-100 text-yellow-800'
                  //           : 'bg-green-100 text-green-800'
                  //       }`}>
                  //         {remainingBondDays <= 0
                  //           ? 'Bond Completed'
                  //           : remainingBondDays === 1
                  //           ? 'Last day'
                  //           : `${remainingBondDays} days remaining`}
                  //       </span>
                  //     )}
                  //   </div>
                  // </div>