// import React, { useState, useRef, useEffect } from 'react';

// export const MultiSelectFilter = ({ label, options, selectedValues, onChange }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const ref = useRef(null);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (ref.current && !ref.current.contains(event.target)) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [ref]);

//     const handleSelect = (value) => {
//         const newSelected = selectedValues.includes(value)
//             ? selectedValues.filter(v => v !== value)
//             : [...selectedValues, value];
//         onChange(newSelected);
//     };

//     return (
//         <div className="form-control" ref={ref}>
//             <label className="label">
//                 <span className="label-text">{label}</span>
//             </label>
//             <div className="dropdown w-full">
//                 <div tabIndex={0} role="button" className="btn btn-outline w-full justify-start" onClick={() => setIsOpen(!isOpen)}>
//                     <span className="truncate">
//                         {selectedValues.length > 0 ? `${selectedValues.length} selected` : `Select ${label}`}
//                     </span>
//                 </div>
//                 {isOpen && (
//                     <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full mt-1">
//                         {options.map(option => (
//                             <li key={option.id}>
//                                 <a onClick={(e) => { e.preventDefault(); handleSelect(option.id); }}>
//                                     <label className="label cursor-pointer w-full">
//                                         <span className="label-text">{option.name}</span> 
//                                         <input 
//                                             type="checkbox" 
//                                             checked={selectedValues.includes(option.id)}
//                                             className="checkbox checkbox-primary"
//                                             readOnly
//                                         />
//                                     </label>
//                                 </a>
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>
//         </div>
//     );
// };

import React, { useState, useRef, useEffect } from 'react';

export type MultiSelectOption = {
  id: string;
  name: string;
};

export type MultiSelectFilterProps = {
  label: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
};

export const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  label,
  options,
  selectedValues,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (ref.current && target && !ref.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    onChange(newSelected);
  };

  return (
    <div className="form-control" ref={ref}>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>

      <div className="dropdown w-full">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-outline w-full justify-start"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="truncate">
            {selectedValues.length > 0 ? `${selectedValues.length} selected` : `Select ${label}`}
          </span>
        </div>

        {isOpen && (
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full mt-1"
          >
            {options.map((option) => (
              <li key={option.id}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelect(option.id);
                  }}
                >
                  <label className="label cursor-pointer w-full">
                    <span className="label-text">{option.name}</span>
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option.id)}
                      className="checkbox checkbox-primary"
                      readOnly
                    />
                  </label>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
