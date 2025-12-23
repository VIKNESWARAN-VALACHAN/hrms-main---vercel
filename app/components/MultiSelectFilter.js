// // 'use client';

// // import { useState, useEffect, useMemo, useRef } from 'react';

// // // Define the Filters type using JSDoc
// // /**
// //  * @typedef {Object} Filters
// //  * @property {string[]} department_id
// //  * @property {string[]} position
// //  * @property {string[]} employment_type
// //  * @property {string[]} type
// //  * @property {string[]} nationality
// //  * @property {string[]} jobLevel
// //  * @property {string[]} company_id
// //  * @property {string} documentExpiry
// //  */

// // /**
// //  * A professional, reusable multi-select filter component with search and select-all functionality.
// //  * This component is designed to fit the UI structure from the user's provided code.
// //  * 
// //  * @param {object} props - Component props.
// //  * @param {keyof Filters} props.name - The key in the filters object this component controls.
// //  * @param {string[]} props.value - The currently selected values.
// //  * @param {(string | undefined | null)[]} props.options - The available options.
// //  * @param {(name: keyof Filters, value: string[]) => void} props.onChange - Callback function when selection changes.
// //  * @param {string} props.placeholder - The text to display (e.g., "Company", "Department").
// //  * @param {(value: string) => string} [props.displayTransform] - Function to transform the option value for display.
// //  * @param {'light' | 'dark'} [props.theme] - The current theme.
// //  */
// // const MultiSelectFilter = ({ 
// //   name, 
// //   value, 
// //   options, 
// //   onChange, 
// //   placeholder,
// //   displayTransform = (item) => typeof item === 'string' ? item : item.name,
// //   theme = 'light'
// // }) => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const searchInputRef = useRef(null);

// //   // Filter out null, undefined, and empty string options
// //   const validOptions = useMemo(() => options.filter(option => 
// //     option !== undefined && option !== null && option !== ''
// //   ), [options]);

// //   const filteredOptions = useMemo(() => {
// //     if (!searchTerm) return validOptions;
// //     return validOptions.filter(option => {
// //       const displayValue = typeof option === 'object' ? option.name : option;
// //       return displayValue.toLowerCase().includes(searchTerm.toLowerCase());
// //     });
// //   }, [validOptions, searchTerm]);

// //   const handleToggle = (optionValue) => {
// //     // Extract ID from object or use the value directly
// //     const id = typeof optionValue === 'object' ? optionValue.id : optionValue;
// //     const newValue = value.includes(id)
// //       ? value.filter(v => v !== id)
// //       : [...value, id];
// //     onChange(name, newValue);
// //   };

// //   const handleSelectAll = () => {
// //     onChange(name, [...validOptions]);
// //   };

// //   const handleClear = () => {
// //     onChange(name, []);
// //   };

// //   const selectedPercentage = validOptions.length > 0 
// //     ? Math.round((value.length / validOptions.length) * 100) 
// //     : 0;

// //   useEffect(() => {
// //     if (isOpen && searchInputRef.current) {
// //       // Focus the search input when the modal opens
// //       setTimeout(() => searchInputRef.current?.focus(), 100);
// //     }
// //   }, [isOpen]);

// //   return (
// //     <>
// //       {/* Trigger Button */}
// //       <div className="form-control w-full">
// //         <label className="label pb-3">
// //           <span className={`label-text font-semibold tracking-wide text-sm uppercase ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// //             {placeholder}
// //           </span>
// //         </label>
        
// //         <button
// //           type="button"
// //           onClick={() => setIsOpen(true)}
// //           className={`group relative flex items-center justify-between w-full p-4 text-left transition-all duration-200 border-2 rounded-lg ${
// //             theme === 'light' 
// //               ? 'bg-white border-slate-200 hover:border-slate-300' 
// //               : 'bg-slate-800 border-slate-600 hover:border-slate-500'
// //           } ${
// //             value.length > 0 
// //               ? 'border-blue-500 bg-blue-50 shadow-sm' 
// //               : ''
// //           }`}
// //         >
// //           <div className="flex flex-col items-start flex-1 min-w-0">
// //             {value.length === 0 ? (
// //               <span className={`text-base ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// //                 Select {placeholder.toLowerCase()}...
// //               </span>
// //             ) : (
// //               <div className="flex flex-wrap gap-2">
// //                 {value.slice(0, 2).map(val => (
// //                   <span 
// //                     key={val} 
// //                     className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-md border border-blue-200"
// //                   >
// //                     {displayTransform(val)}
// //                   </span>
// //                 ))}
// //                 {value.length > 2 && (
// //                   <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-slate-100 text-slate-600 rounded-md border border-slate-300">
// //                     +{value.length - 2} more
// //                   </span>
// //                 )}
// //               </div>
// //             )}
// //           </div>
          
// //           <div className="flex items-center gap-3 flex-shrink-0 ml-4">
// //             {value.length > 0 && (
// //               <div className="flex flex-col items-end">
// //                 <span className="text-sm font-semibold text-blue-600">{value.length} selected</span>
// //                 <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
// //                   <div 
// //                     className="h-full bg-blue-500 transition-all duration-300"
// //                     style={{ width: `${selectedPercentage}%` }}
// //                   />
// //                 </div>
// //               </div>
// //             )}
// //             <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
// //                 <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
// //             </svg>
// //           </div>
// //         </button>
// //       </div>

// //       {/* Modal */}
// //       <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
// //         <div className="modal-box max-w-2xl max-h-[80vh] flex flex-col p-0 overflow-hidden shadow-2xl rounded-xl">
// //           {/* Header */}
// //           <div className="flex items-center justify-between p-6 border-b bg-white">
// //             <div>
// //               <h3 className="text-lg font-semibold text-slate-800">Select {placeholder}</h3>
// //               <p className="text-sm text-slate-600 mt-1">
// //                 Choose multiple options to filter your results
// //               </p>
// //             </div>
// //             <button 
// //               type="button"
// //               onClick={() => setIsOpen(false)}
// //               className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //               </svg>
// //             </button>
// //           </div>

// //           {/* Search and Stats Bar */}
// //           <div className="p-4 border-b bg-slate-50">
// //             <div className="flex items-center gap-3 mb-3">
// //               <div className="form-control flex-1">
// //                 <input
// //                   ref={searchInputRef}
// //                   type="text"
// //                   placeholder={`Search ${placeholder.toLowerCase()}...`}
// //                   className="input input-bordered w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                 />
// //               </div>
// //             </div>

// //             {/* Progress and Actions */}
// //             <div className="flex items-center justify-between">
// //               <div className="flex items-center gap-3">
// //                 <div className="text-sm text-slate-600">
// //                   <span className="font-semibold">{value.length}</span> of{' '}
// //                   <span className="font-semibold">{validOptions.length}</span> selected
// //                 </div>
// //                 <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
// //                   <div 
// //                     className="h-full bg-green-500 transition-all duration-500"
// //                     style={{ width: `${selectedPercentage}%` }}
// //                   />
// //                 </div>
// //               </div>
              
// //               <div className="flex gap-2">
// //                 <button
// //                   type="button"
// //                   onClick={handleSelectAll}
// //                   className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800 hover:bg-white rounded border border-slate-300 transition-colors"
// //                   disabled={value.length === validOptions.length}
// //                 >
// //                   Select All
// //                 </button>
// //                 {value.length > 0 && (
// //                   <button
// //                     type="button"
// //                     onClick={handleClear}
// //                     className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-white rounded border border-red-300 transition-colors"
// //                   >
// //                     Clear All
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Options List */}
// //           <div className="flex-1 overflow-y-auto bg-white">
// //             {filteredOptions.length === 0 ? (
// //               <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
// //                 <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                   </svg>
// //                 </div>
// //                 <h4 className="font-semibold text-slate-700 mb-2">No options found</h4>
// //                 <p className="text-slate-500 text-sm">
// //                   {searchTerm ? `No matches for "${searchTerm}"` : 'No options available'}
// //                 </p>
// //               </div>
// //             ) : (
// //               <div className="p-4 space-y-2">
// //                {filteredOptions.map((option) => {
// //     const optionValue = typeof option === 'object' ? option.id : option;
// //     const displayText = displayTransform(option);
    
// //     return (
// //       <label
// //         key={optionValue}
// //         className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border transition-all duration-200 ${
// //           value.includes(optionValue)
// //             ? 'bg-blue-50 border-blue-200 shadow-sm'
// //             : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
// //         }`}
// //       >
// //         <input
// //           type="checkbox"
// //           checked={value.includes(optionValue)}
// //           onChange={() => handleToggle(option)}
// //           className="checkbox checkbox-primary"
// //         />
// //         <div className="flex-1 min-w-0">
// //           <span className="font-medium text-slate-800">
// //             {displayText}
// //           </span>
// //         </div>
// //       </label>
// //     );
// //   })}
// //               </div>
// //             )}
// //           </div>

// //           {/* Footer */}
// //           <div className="p-4 border-t bg-white">
// //             <div className="flex items-center justify-between">
// //               <div className="text-sm text-slate-600">
// //                 {value.length} options selected
// //               </div>
// //               <div className="flex gap-2">
// //                 <button
// //                   type="button"
// //                   onClick={() => setIsOpen(false)}
// //                   className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
// //                 >
// //                   Close
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
        
// //         {/* Backdrop */}
// //         <div className="modal-backdrop bg-black/40" onClick={() => setIsOpen(false)}></div>
// //       </div>
// //     </>
// //   );
// // };

// // export default MultiSelectFilter;
// 'use client';

// import { useState, useEffect, useMemo, useRef } from 'react';

// /**
//  * A professional, reusable multi-select filter component with search and select-all functionality.
//  * This component is designed to fit the UI structure from the user's provided code.
//  * 
//  * @param {MultiSelectFilterProps} props - Component props.
//  */
// const MultiSelectFilter = ({ 
//   name, 
//   value, 
//   options, 
//   onChange, 
//   placeholder,
//   displayTransform = (item: string | FilterOptionItem) => typeof item === 'string' ? item : item.name,
//   theme = 'light'
// }: MultiSelectFilterProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const searchInputRef = useRef<HTMLInputElement>(null);

//   // Filter out null, undefined, and empty options
//   const validOptions = useMemo(() => options.filter(option => 
//     option !== undefined && option !== null && option !== ''
//   ), [options]);

//   const filteredOptions = useMemo(() => {
//     if (!searchTerm) return validOptions;
//     return validOptions.filter(option => 
//       displayTransform(option).toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [validOptions, searchTerm, displayTransform]);

//   const handleToggle = (option: string | FilterOptionItem) => {
//     // Extract ID from object or use the value directly
//     const id = typeof option === 'object' ? option.id : option;
//     const newValue = value.includes(id)
//       ? value.filter(v => v !== id)
//       : [...value, id];
//     onChange(name, newValue);
//   };

//   const handleSelectAll = () => {
//     const allIds = validOptions.map(option => 
//       typeof option === 'object' ? option.id : option
//     );
//     onChange(name, allIds);
//   };

//   const handleClear = () => {
//     onChange(name, []);
//   };

//   const selectedPercentage = validOptions.length > 0 
//     ? Math.round((value.length / validOptions.length) * 100) 
//     : 0;

//   useEffect(() => {
//     if (isOpen && searchInputRef.current) {
//       // Focus the search input when the modal opens
//       setTimeout(() => searchInputRef.current?.focus(), 100);
//     }
//   }, [isOpen]);

//   return (
//     <>
//       {/* Trigger Button */}
//       <div className="form-control w-full">
//         <label className="label pb-3">
//           <span className={`label-text font-semibold tracking-wide text-sm uppercase ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
//             {placeholder}
//           </span>
//         </label>
        
//         <button
//           type="button"
//           onClick={() => setIsOpen(true)}
//           className={`group relative flex items-center justify-between w-full p-4 text-left transition-all duration-200 border-2 rounded-lg ${
//             theme === 'light' 
//               ? 'bg-white border-slate-200 hover:border-slate-300' 
//               : 'bg-slate-800 border-slate-600 hover:border-slate-500'
//           } ${
//             value.length > 0 
//               ? 'border-blue-500 bg-blue-50 shadow-sm' 
//               : ''
//           }`}
//         >
//           <div className="flex flex-col items-start flex-1 min-w-0">
//             {value.length === 0 ? (
//               <span className={`text-base ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                 Select {placeholder.toLowerCase()}...
//               </span>
//             ) : (
//               <div className="flex flex-wrap gap-2">
//                 {value.slice(0, 2).map(val => {
//                   // Find the option object to get the display name
//                   const option = validOptions.find(opt => {
//                     const optId = typeof opt === 'object' ? opt.id : opt;
//                     return optId === val;
//                   });
//                   const displayName = option ? displayTransform(option) : val;
                  
//                   return (
//                     <span 
//                       key={val} 
//                       className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-md border border-blue-200"
//                     >
//                       {displayName}
//                     </span>
//                   );
//                 })}
//                 {value.length > 2 && (
//                   <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-slate-100 text-slate-600 rounded-md border border-slate-300">
//                     +{value.length - 2} more
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>
          
//           <div className="flex items-center gap-3 flex-shrink-0 ml-4">
//             {value.length > 0 && (
//               <div className="flex flex-col items-end">
//                 <span className="text-sm font-semibold text-blue-600">{value.length} selected</span>
//                 <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
//                   <div 
//                     className="h-full bg-blue-500 transition-all duration-300"
//                     style={{ width: `${selectedPercentage}%` }}
//                   />
//                 </div>
//               </div>
//             )}
//             <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//             </svg>
//           </div>
//         </button>
//       </div>

//       {/* Modal */}
//       <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
//         <div className="modal-box max-w-2xl max-h-[80vh] flex flex-col p-0 overflow-hidden shadow-2xl rounded-xl">
//           {/* Header */}
//           <div className="flex items-center justify-between p-6 border-b bg-white">
//             <div>
//               <h3 className="text-lg font-semibold text-slate-800">Select {placeholder}</h3>
//               <p className="text-sm text-slate-600 mt-1">
//                 Choose multiple options to filter your results
//               </p>
//             </div>
//             <button 
//               type="button"
//               onClick={() => setIsOpen(false)}
//               className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           {/* Search and Stats Bar */}
//           <div className="p-4 border-b bg-slate-50">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="form-control flex-1">
//                 <input
//                   ref={searchInputRef}
//                   type="text"
//                   placeholder={`Search ${placeholder.toLowerCase()}...`}
//                   className="input input-bordered w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Progress and Actions */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="text-sm text-slate-600">
//                   <span className="font-semibold">{value.length}</span> of{' '}
//                   <span className="font-semibold">{validOptions.length}</span> selected
//                 </div>
//                 <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
//                   <div 
//                     className="h-full bg-green-500 transition-all duration-500"
//                     style={{ width: `${selectedPercentage}%` }}
//                   />
//                 </div>
//               </div>
              
//               <div className="flex gap-2">
//                 <button
//                   type="button"
//                   onClick={handleSelectAll}
//                   className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800 hover:bg-white rounded border border-slate-300 transition-colors"
//                   disabled={value.length === validOptions.length}
//                 >
//                   Select All
//                 </button>
//                 {value.length > 0 && (
//                   <button
//                     type="button"
//                     onClick={handleClear}
//                     className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-white rounded border border-red-300 transition-colors"
//                   >
//                     Clear All
//                 </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Options List */}
//           <div className="flex-1 overflow-y-auto bg-white">
//             {filteredOptions.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
//                 <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </div>
//                 <h4 className="font-semibold text-slate-700 mb-2">No options found</h4>
//                 <p className="text-slate-500 text-sm">
//                   {searchTerm ? `No matches for "${searchTerm}"` : 'No options available'}
//                 </p>
//               </div>
//             ) : (
//               <div className="p-4 space-y-2">
//                 {filteredOptions.map((option) => {
//                   const optionId = typeof option === 'object' ? option.id : option;
//                   const displayName = displayTransform(option);
                  
//                   return (
//                     <label
//                       key={optionId}
//                       className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border transition-all duration-200 ${
//                         value.includes(optionId)
//                           ? 'bg-blue-50 border-blue-200 shadow-sm'
//                           : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
//                       }`}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={value.includes(optionId)}
//                         onChange={() => handleToggle(option)}
//                         className="checkbox checkbox-primary"
//                       />
//                       <div className="flex-1 min-w-0">
//                         <span className="font-medium text-slate-800">
//                           {displayName}
//                         </span>
//                       </div>
//                     </label>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="p-4 border-t bg-white">
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-slate-600">
//                 {value.length} options selected
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsOpen(false)}
//                   className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Backdrop */}
//         <div className="modal-backdrop bg-black/40" onClick={() => setIsOpen(false)}></div>
//       </div>
//     </>
//   );
// };

// export default MultiSelectFilter;


'use client';

import { useState, useEffect, useMemo, useRef } from 'react';

/**
 * A professional, reusable multi-select filter component with search and select-all functionality.
 * 
 * @typedef {Object} FilterOptionItem
 * @property {string} id
 * @property {string} name
 * 
 * @typedef {Object} Filters
 * @property {string[]} department_id
 * @property {string[]} position
 * @property {string[]} employment_type
 * @property {string[]} type
 * @property {string[]} nationality
 * @property {string[]} jobLevel
 * @property {string[]} company_id
 * @property {string} documentExpiry
 * 
 * @typedef {Object} MultiSelectFilterProps
 * @property {keyof Filters} name
 * @property {string[]} value
 * @property {(string|FilterOptionItem)[]} options
 * @property {(name: keyof Filters, value: string[]) => void} onChange
 * @property {string} placeholder
 * @property {(item: string|FilterOptionItem) => string} [displayTransform]
 * @property {'light'|'dark'} [theme]
 */

/**
 * MultiSelectFilter Component
 * @param {MultiSelectFilterProps} props
 */
const MultiSelectFilter = ({ 
  name, 
  value, 
  options, 
  onChange, 
  placeholder,
  displayTransform = (item) => typeof item === 'string' ? item : item.name,
  theme = 'light'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  // Filter out null, undefined, and empty options
  const validOptions = useMemo(() => options.filter(option => 
    option !== undefined && option !== null && option !== ''
  ), [options]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return validOptions;
    return validOptions.filter(option => 
      displayTransform(option).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [validOptions, searchTerm, displayTransform]);

  /**
   * Handle toggling an option
   * @param {string|FilterOptionItem} option
   */
  const handleToggle = (option) => {
    // Extract ID from object or use the value directly
    const id = typeof option === 'object' ? option.id : option;
    const newValue = value.includes(id)
      ? value.filter(v => v !== id)
      : [...value, id];
    onChange(name, newValue);
  };

  const handleSelectAll = () => {
    const allIds = validOptions.map(option => 
      typeof option === 'object' ? option.id : option
    );
    onChange(name, allIds);
  };

  const handleClear = () => {
    onChange(name, []);
  };

  const selectedPercentage = validOptions.length > 0 
    ? Math.round((value.length / validOptions.length) * 100) 
    : 0;

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Focus the search input when the modal opens
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button */}
      <div className="form-control w-full">
        <label className="label pb-3">
          <span className={`label-text font-semibold tracking-wide text-sm uppercase ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
            {placeholder}
          </span>
        </label>
        
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`group relative flex items-center justify-between w-full p-4 text-left transition-all duration-200 border-2 rounded-lg ${
            theme === 'light' 
              ? 'bg-white border-slate-200 hover:border-slate-300' 
              : 'bg-slate-800 border-slate-600 hover:border-slate-500'
          } ${
            value.length > 0 
              ? 'border-blue-500 bg-blue-50 shadow-sm' 
              : ''
          }`}
        >
          <div className="flex flex-col items-start flex-1 min-w-0">
            {value.length === 0 ? (
              <span className={`text-base ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                Select {placeholder.toLowerCase()}...
              </span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {value.slice(0, 2).map(val => {
                  // Find the option object to get the display name
                  const option = validOptions.find(opt => {
                    const optId = typeof opt === 'object' ? opt.id : opt;
                    return optId === val;
                  });
                  const displayName = option ? displayTransform(option) : val;
                  
                  return (
                    <span 
                      key={val} 
                      className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-md border border-blue-200"
                    >
                      {displayName}
                    </span>
                  );
                })}
                {value.length > 2 && (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-slate-100 text-slate-600 rounded-md border border-slate-300">
                    +{value.length - 2} more
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            {value.length > 0 && (
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-blue-600">{value.length} selected</span>
                <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${selectedPercentage}%` }}
                  />
                </div>
              </div>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </button>
      </div>

      {/* Modal */}
      <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-2xl max-h-[80vh] flex flex-col p-0 overflow-hidden shadow-2xl rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Select {placeholder}</h3>
              <p className="text-sm text-slate-600 mt-1">
                Choose multiple options to filter your results
              </p>
            </div>
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search and Stats Bar */}
          <div className="p-4 border-b bg-slate-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="form-control flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={`Search ${placeholder.toLowerCase()}...`}
                  className="input input-bordered w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Progress and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-600">
                  <span className="font-semibold">{value.length}</span> of{' '}
                  <span className="font-semibold">{validOptions.length}</span> selected
                </div>
                <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${selectedPercentage}%` }}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800 hover:bg-white rounded border border-slate-300 transition-colors"
                  disabled={value.length === validOptions.length}
                >
                  Select All
                </button>
                {value.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-white rounded border border-red-300 transition-colors"
                  >
                    Clear All
                </button>
                )}
              </div>
            </div>
          </div>

          {/* Options List */}
          <div className="flex-1 overflow-y-auto bg-white">
            {filteredOptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-700 mb-2">No options found</h4>
                <p className="text-slate-500 text-sm">
                  {searchTerm ? `No matches for "${searchTerm}"` : 'No options available'}
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {filteredOptions.map((option) => {
                  const optionId = typeof option === 'object' ? option.id : option;
                  const displayName = displayTransform(option);
                  
                  return (
                    <label
                      key={optionId}
                      className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border transition-all duration-200 ${
                        value.includes(optionId)
                          ? 'bg-blue-50 border-blue-200 shadow-sm'
                          : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={value.includes(optionId)}
                        onChange={() => handleToggle(option)}
                        className="checkbox checkbox-primary"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-slate-800">
                          {displayName}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-white">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {value.length} options selected
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Backdrop */}
        <div className="modal-backdrop bg-black/40" onClick={() => setIsOpen(false)}></div>
      </div>
    </>
  );
};

export default MultiSelectFilter;
