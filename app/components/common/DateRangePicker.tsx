// import React, { useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// export const DateRangePicker = ({ onChange, initialStartDate, initialEndDate }) => {
//     const [startDate, setStartDate] = useState(initialStartDate);
//     const [endDate, setEndDate] = useState(initialEndDate);

//     const handleOnChange = (dates) => {
//         const [start, end] = dates;
//         setStartDate(start);
//         setEndDate(end);
//         onChange(dates);
//     };

//     return (
//         <div className="form-control">
//             <label className="label">
//                 <span className="label-text">Date Range</span>
//             </label>
//             <DatePicker
//                 selectsRange={true}
//                 startDate={startDate}
//                 endDate={endDate}
//                 onChange={handleOnChange}
//                 isClearable={true}
//                 className="input input-bordered w-full"
//                 placeholderText="Select date range"
//             />
//         </div>
//     );
// };

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export type DateRange = [Date | null, Date | null];

export type DateRangePickerProps = {
  onChange: (dates: DateRange) => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  label?: string; // optional if you want custom label
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onChange,
  initialStartDate = null,
  initialEndDate = null,
  label = 'Date Range',
}) => {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);

  const handleOnChange = (dates: DateRange) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onChange(dates);
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>

      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={handleOnChange}
        isClearable
        className="input input-bordered w-full"
        placeholderText="Select date range"
      />
    </div>
  );
};
