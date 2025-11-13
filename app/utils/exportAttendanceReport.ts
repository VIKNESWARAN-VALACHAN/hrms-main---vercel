// // utils/exportAttendanceReport.ts
// import * as XLSX from 'xlsx';

// // --- helpers: safe local formatters ---
// const pad = (n: number) => String(n).padStart(2, '0');

// function toLocalDateTime(v?: string): string {
//   if (!v) return '';
//   const d = new Date(v);
//   if (isNaN(d.getTime())) return v;                  // already human text
//   return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
// }

// function toLocalDate(v?: string): string {
//   if (!v) return '';
//   // if already yyyy-MM-dd, keep it
//   if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
//   const d = new Date(v);
//   if (isNaN(d.getTime())) return v;
//   return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
// }

// // export interface AttendanceRow {
// //   employee_id?: number;
// //   employee_name: string;
// //   company_name: string;
// //   department_name: string;
// //   date: string;     // yyyy-MM-dd or ISO
// //   checkIn: string;  // may be ISO
// //   checkOut: string; // may be ISO
// //   status: string;   // for attendance rows; leave rows will be ''
// //   leave_type?: string;
// //   leave_approval_status?: string;
// //   //amended_status?: string;
// //   amended_by?: string;
// //   amended_date?: string;
// //   // Add clock in/out IP fields
// //   check_in_ip?: string;
// //   check_out_ip?: string;
// // }

// export interface AttendanceRow {
//   employee_id?: number;
//   employee_name: string;
//   company_name: string;
//   department_name: string;
//   date: string;
//   checkIn: string;
//   checkOut: string;
//   status: string;
//   worked_hours?: string; // Add this
//   leave_type?: string;
//   leave_approval_status?: string;
//   // Add amended status fields
//   //amended_status?: string;
//   amended_by?: string;
//   amended_date?: string;
//   // Add IP fields
//   check_in_ip?: string;
//   check_out_ip?: string;
//   check_in_ip_match_status?: string;
//   check_in_ip_policy_mode?: string;
//   check_out_ip_match_status?: string;
//   check_out_ip_policy_mode?: string;
//   office_name?: string;
// }

// export interface LeaveRow {
//   employee_id: number;
//   employee_name: string;
//   company_name: string;
//   department_name: string;
//   leave_type_name: string;
//   status: string;        // APPROVED/REJECTED/...
//   start_date: string;    // yyyy-MM-dd
//   end_date: string;      // yyyy-MM-dd
//   is_half_day?: 0 | 1 | boolean;
// }

// import { addDays } from 'date-fns';


// function expandLeavesToDailyRows(leaves: LeaveRow[] = []): AttendanceRow[] {
//   const out: AttendanceRow[] = [];
//   const LEAVE_STATUS_LABEL = 'LEAVE';

//   for (const lv of leaves) {
//     const s = new Date(lv.start_date);
//     const e = new Date(lv.end_date);
//     for (let d = s; d <= e; d = addDays(d, 1)) {
//       const dd = toLocalDate(d.toISOString());
//       out.push({
//         employee_id: lv.employee_id,
//         employee_name: lv.employee_name,
//         company_name: lv.company_name,
//         department_name: lv.department_name,
//         date: dd,
//         checkIn: '',
//         checkOut: '',
//         worked_hours: '0.00', // Add worked hours for leave rows
//         status: LEAVE_STATUS_LABEL,
//         // Empty IP fields for leave rows
//         check_in_ip: '',
//         check_in_ip_match_status: '',
//         check_in_ip_policy_mode: '',
//         check_out_ip: '',
//         check_out_ip_match_status: '',
//         check_out_ip_policy_mode: '',
//         office_name: '',
//         leave_type: lv.leave_type_name,
//         leave_approval_status: lv.status,
//         // Empty amend fields for leave rows
//         //amended_status: '',
//         amended_by: '',
//         amended_date: '',
//       });
//     }
//   }
//   return out;
// }


// export function downloadAttendanceReport(
//   attendance: AttendanceRow[] = [],
//   options?: { leaves?: LeaveRow[]; includeLeaves?: boolean; fileName?: string }
// ) {
//   const fileName = options?.fileName || 'Attendance_Report.xlsx';

//   const leaveRows =
//     options?.includeLeaves && options?.leaves?.length
//       ? expandLeavesToDailyRows(options.leaves)
//       : [];

//   const rows: AttendanceRow[] = [...attendance, ...leaveRows].sort((a, b) => {
//     const an = a.employee_name.localeCompare(b.employee_name);
//     if (an !== 0) return an;
//     return toLocalDate(a.date).localeCompare(toLocalDate(b.date));
//   });

//   // Order + headers (with worked hours and other columns)
//   const ordered: (keyof AttendanceRow)[] = [
//     'employee_id',
//     'employee_name',
//     'company_name',
//     'department_name',
//     'date',
//     'checkIn',
//     'checkOut',
//     'worked_hours', // Add worked hours here
//     'status',
//     // IP columns
//     'check_in_ip',
//     'check_in_ip_match_status',
//     'check_in_ip_policy_mode',
//     'check_out_ip',
//     'check_out_ip_match_status',
//     'check_out_ip_policy_mode',
//     'office_name',
//     'leave_type',
//     'leave_approval_status',
//     // Amended status columns
//     //'amended_status',
//     'amended_by',
//     'amended_date',
//   ];

//   const headerMap: Record<keyof AttendanceRow, string> = {
//     employee_id: 'Employee ID',
//     employee_name: 'Employee',
//     company_name: 'Company',
//     department_name: 'Department',
//     date: 'Date',
//     checkIn: 'Check-in Time',
//     checkOut: 'Check-out Time',
//     worked_hours: 'Worked Hours', // Add worked hours header
//     status: 'Status',
//     // IP headers
//     check_in_ip: 'Check-in IP',
//     check_in_ip_match_status: 'Check-in IP Status',
//     check_in_ip_policy_mode: 'Check-in IP Policy',
//     check_out_ip: 'Check-out IP',
//     check_out_ip_match_status: 'Check-out IP Status',
//     check_out_ip_policy_mode: 'Check-out IP Policy',
//     office_name: 'Office',
//     leave_type: 'Leave Type',
//     leave_approval_status: 'Approval Status',
//     // Amended status headers
//     //amended_status: 'Amended Status',
//     amended_by: 'Amended By',
//     amended_date: 'Amended Date',
//   };

//   // Format date / time cells nicely on export
//   const exportRows = rows.map(r => ({
//     employee_id: r.employee_id ?? '',
//     employee_name: r.employee_name ?? '',
//     company_name: r.company_name ?? '',
//     department_name: r.department_name ?? '',
//     date: toLocalDate(r.date),
//     checkIn: toLocalDateTime(r.checkIn),
//     checkOut: toLocalDateTime(r.checkOut),
//     worked_hours: r.worked_hours ?? '0.00', // Add worked hours
//     status: r.status ?? '',
//     // IP fields
//     check_in_ip: r.check_in_ip ?? '',
//     check_in_ip_match_status: r.check_in_ip_match_status ?? '',
//     check_in_ip_policy_mode: r.check_in_ip_policy_mode ?? '',
//     check_out_ip: r.check_out_ip ?? '',
//     check_out_ip_match_status: r.check_out_ip_match_status ?? '',
//     check_out_ip_policy_mode: r.check_out_ip_policy_mode ?? '',
//     office_name: r.office_name ?? '',
//     leave_type: r.leave_type ?? '',
//     leave_approval_status: r.leave_approval_status ?? '',
//     // Amended status fields
//     //amended_status: r.amended_status ?? '',
//     amended_by: r.amended_by ?? '',
//     amended_date: r.amended_date ? toLocalDateTime(r.amended_date) : '',
//   }));

//   const ws = XLSX.utils.json_to_sheet(exportRows, { header: ordered as string[] });
//   XLSX.utils.sheet_add_aoa(ws, [ordered.map(k => headerMap[k])], { origin: 'A1' });

//   // Update column widths (add worked hours column)
//   const lastCol = String.fromCharCode('A'.charCodeAt(0) + ordered.length - 1);
//   ws['!autofilter'] = { ref: `A1:${lastCol}${exportRows.length + 1}` };
//   ws['!cols'] = [
//     { wch: 12 }, { wch: 24 }, { wch: 20 }, { wch: 20 }, { wch: 12 },  // Original 5 columns
//     { wch: 16 }, { wch: 16 }, { wch: 12 },                           // Time/Worked hours columns
//     { wch: 10 },                                                    // Status
//     // IP columns
//     { wch: 16 }, { wch: 15 }, { wch: 15 },                          // Check-in IP columns
//     { wch: 16 }, { wch: 15 }, { wch: 15 },                          // Check-out IP columns
//     { wch: 20 },                                                    // Office
//     { wch: 22 }, { wch: 18 },                                       // Leave columns
//     { wch: 15 }, { wch: 20 }, { wch: 20 },                          // Amended status columns
//   ];

//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
//   XLSX.writeFile(wb, fileName);
// }

// utils/exportAttendanceReport.ts
import * as XLSX from 'xlsx';
import { addDays } from 'date-fns';

// --- helpers: safe local formatters ---
const pad = (n: number) => String(n).padStart(2, '0');

function toLocalDateTime(v?: string): string {
  if (!v) return '';
  const d = new Date(v);
  if (isNaN(d.getTime())) return v;                  // already human text
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toLocalDate(v?: string): string {
  if (!v) return '';
  // if already yyyy-MM-dd, keep it
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const d = new Date(v);
  if (isNaN(d.getTime())) return v;
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

export interface AttendanceRow {
  employee_id?: number;
  employee_name: string;
  company_name: string;
  department_name: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  worked_hours?: string;
  leave_type?: string;
  leave_approval_status?: string;
  // Add amended status fields
  amended_status?: string;
  amended_by?: string;
  amended_date?: string;
  // Add IP fields
  check_in_ip?: string;
  check_in_public_ip?: string;
  check_out_ip?: string;
  check_out_public_ip?: string;
  check_in_ip_match_status?: string;
  check_in_ip_policy_mode?: string;
  check_out_ip_match_status?: string;
  check_out_ip_policy_mode?: string;
  office_name?: string;
}

export interface LeaveRow {
  employee_id: number;
  employee_name: string;
  company_name: string;
  department_name: string;
  leave_type_name: string;
  status: string;        // APPROVED/REJECTED/...
  start_date: string;    // yyyy-MM-dd
  end_date: string;      // yyyy-MM-dd
  is_half_day?: 0 | 1 | boolean;
}

function expandLeavesToDailyRows(leaves: LeaveRow[] = []): AttendanceRow[] {
  const out: AttendanceRow[] = [];
  const LEAVE_STATUS_LABEL = 'LEAVE';

  for (const lv of leaves) {
    const s = new Date(lv.start_date);
    const e = new Date(lv.end_date);
    for (let d = s; d <= e; d = addDays(d, 1)) {
      const dd = toLocalDate(d.toISOString());
      out.push({
        employee_id: lv.employee_id,
        employee_name: lv.employee_name,
        company_name: lv.company_name,
        department_name: lv.department_name,
        date: dd,
        checkIn: '',
        checkOut: '',
        worked_hours: '0.00',
        status: LEAVE_STATUS_LABEL,
        // Empty IP fields for leave rows
        check_in_ip: '',
        check_in_public_ip: '',
        check_in_ip_match_status: '',
        check_in_ip_policy_mode: '',
        check_out_ip: '',
        check_out_public_ip: '',
        check_out_ip_match_status: '',
        check_out_ip_policy_mode: '',
        office_name: '',
        leave_type: lv.leave_type_name,
        leave_approval_status: lv.status,
        // Empty amend fields for leave rows
        amended_status: '',
        amended_by: '',
        amended_date: '',
      });
    }
  }
  return out;
}

// export function downloadAttendanceReport(
//   attendance: AttendanceRow[] = [],
//   options?: { leaves?: LeaveRow[]; includeLeaves?: boolean; fileName?: string }
// ) {
//   const fileName = options?.fileName || 'Attendance_Report.xlsx';

//   const leaveRows =
//     options?.includeLeaves && options?.leaves?.length
//       ? expandLeavesToDailyRows(options.leaves)
//       : [];

//   const rows: AttendanceRow[] = [...attendance, ...leaveRows].sort((a, b) => {
//     const an = a.employee_name.localeCompare(b.employee_name);
//     if (an !== 0) return an;
//     return toLocalDate(a.date).localeCompare(toLocalDate(b.date));
//   });

//   // Order + headers (with all new columns)
//   const ordered: (keyof AttendanceRow)[] = [
//     'employee_id',
//     'employee_name',
//     'company_name',
//     'department_name',
//     'date',
//     'checkIn',
//     'checkOut',
//     'worked_hours',
//     'status',
//     // IP columns - both internal and public
//     'check_in_ip',
//     'check_in_public_ip',
//     'check_in_ip_match_status',
//     'check_in_ip_policy_mode',
//     'check_out_ip',
//     'check_out_public_ip',
//     'check_out_ip_match_status',
//     'check_out_ip_policy_mode',
//     'office_name',
//     'leave_type',
//     'leave_approval_status',
//     // Amended status columns
//     'amended_status',
//     'amended_by',
//     'amended_date',
//   ];

//   const headerMap: Record<keyof AttendanceRow, string> = {
//     employee_id: 'Employee ID',
//     employee_name: 'Employee',
//     company_name: 'Company',
//     department_name: 'Department',
//     date: 'Date',
//     checkIn: 'Check-in Time',
//     checkOut: 'Check-out Time',
//     worked_hours: 'Worked Hours',
//     status: 'Status',
//     // IP headers - both internal and public
//     check_in_ip: 'Check-in Internal IP',
//     check_in_public_ip: 'Check-in Public IP',
//     check_in_ip_match_status: 'Check-in IP Status',
//     check_in_ip_policy_mode: 'Check-in IP Policy',
//     check_out_ip: 'Check-out Internal IP',
//     check_out_public_ip: 'Check-out Public IP',
//     check_out_ip_match_status: 'Check-out IP Status',
//     check_out_ip_policy_mode: 'Check-out IP Policy',
//     office_name: 'Office',
//     leave_type: 'Leave Type',
//     leave_approval_status: 'Approval Status',
//     // Amended status headers
//     amended_status: 'Amended Status',
//     amended_by: 'Amended By',
//     amended_date: 'Amended Date',
//   };

//   // Format date / time cells nicely on export
//   const exportRows = rows.map(r => ({
//     employee_id: r.employee_id ?? '',
//     employee_name: r.employee_name ?? '',
//     company_name: r.company_name ?? '',
//     department_name: r.department_name ?? '',
//     date: toLocalDate(r.date),
//     checkIn: toLocalDateTime(r.checkIn),
//     checkOut: toLocalDateTime(r.checkOut),
//     worked_hours: r.worked_hours ?? '0.00',
//     status: r.status ?? '',
//     // IP fields - both internal and public
//     check_in_ip: r.check_in_ip ?? '',
//     check_in_public_ip: r.check_in_public_ip ?? '',
//     check_in_ip_match_status: r.check_in_ip_match_status ?? '',
//     check_in_ip_policy_mode: r.check_in_ip_policy_mode ?? '',
//     check_out_ip: r.check_out_ip ?? '',
//     check_out_public_ip: r.check_out_public_ip ?? '',
//     check_out_ip_match_status: r.check_out_ip_match_status ?? '',
//     check_out_ip_policy_mode: r.check_out_ip_policy_mode ?? '',
//     office_name: r.office_name ?? '',
//     leave_type: r.leave_type ?? '',
//     leave_approval_status: r.leave_approval_status ?? '',
//     // Amended status fields
//     amended_status: r.amended_status ?? '',
//     amended_by: r.amended_by ?? '',
//     amended_date: r.amended_date ? toLocalDateTime(r.amended_date) : '',
//   }));

//   const ws = XLSX.utils.json_to_sheet(exportRows, { header: ordered as string[] });
//   XLSX.utils.sheet_add_aoa(ws, [ordered.map(k => headerMap[k])], { origin: 'A1' });

//   // Update column widths for all columns
//   const lastCol = String.fromCharCode('A'.charCodeAt(0) + ordered.length - 1);
//   ws['!autofilter'] = { ref: `A1:${lastCol}${exportRows.length + 1}` };
//   ws['!cols'] = [
//     { wch: 12 }, { wch: 24 }, { wch: 20 }, { wch: 20 }, { wch: 12 },  // Basic info columns
//     { wch: 16 }, { wch: 16 }, { wch: 12 },                           // Time/Worked hours columns
//     { wch: 10 },                                                    // Status
//     // IP columns - both internal and public
//     { wch: 16 }, { wch: 20 }, { wch: 15 }, { wch: 15 },             // Check-in IP columns
//     { wch: 16 }, { wch: 20 }, { wch: 15 }, { wch: 15 },             // Check-out IP columns
//     { wch: 20 },                                                    // Office
//     { wch: 22 }, { wch: 18 },                                       // Leave columns
//     { wch: 15 }, { wch: 20 }, { wch: 20 },                          // Amended status columns
//   ];

//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
//   XLSX.writeFile(wb, fileName);
// }

export function downloadAttendanceReport(
  attendance: AttendanceRow[] = [],
  options?: { leaves?: LeaveRow[]; includeLeaves?: boolean; fileName?: string }
) {
  const fileName = options?.fileName || 'Attendance_Report.xlsx';

  const leaveRows =
    options?.includeLeaves && options?.leaves?.length
      ? expandLeavesToDailyRows(options.leaves)
      : [];

  const rows: AttendanceRow[] = [...attendance, ...leaveRows].sort((a, b) => {
    const an = a.employee_name.localeCompare(b.employee_name);
    if (an !== 0) return an;
    return toLocalDate(a.date).localeCompare(toLocalDate(b.date));
  });

  // Apply amended status logic
  const rowsWithAmendedStatus = rows.map(row => ({
    ...row,
    // Amended Status Logic: "Amended" if amend_by is not null, otherwise "Original"
    amended_status: row.amended_by ? 'Amended' : 'Original'
  }));

  // Order + headers (REMOVED amended_by and amended_date)
  const ordered: (keyof AttendanceRow)[] = [
    'employee_id',
    'employee_name',
    'company_name',
    'department_name',
    'date',
    'checkIn',
    'checkOut',
    'worked_hours',
    'status',
    // IP columns - both internal and public
    'check_in_ip',
    'check_in_public_ip',
    'check_in_ip_match_status',
    'check_in_ip_policy_mode',
    'check_out_ip',
    'check_out_public_ip',
    'check_out_ip_match_status',
    'check_out_ip_policy_mode',
    'office_name',
    'leave_type',
    'leave_approval_status',
    // Amended status columns - ONLY amended_status remains
    'amended_status',
    // REMOVED: 'amended_by', 'amended_date'
  ];

  const headerMap: Record<keyof AttendanceRow, string> = {
    employee_id: 'Employee ID',
    employee_name: 'Employee',
    company_name: 'Company',
    department_name: 'Department',
    date: 'Date',
    checkIn: 'Check-in Time',
    checkOut: 'Check-out Time',
    worked_hours: 'Worked Hours',
    status: 'Status',
    // IP headers - both internal and public
    check_in_ip: 'Check-in Internal IP',
    check_in_public_ip: 'Check-in Public IP',
    check_in_ip_match_status: 'Check-in IP Status',
    check_in_ip_policy_mode: 'Check-in IP Policy',
    check_out_ip: 'Check-out Internal IP',
    check_out_public_ip: 'Check-out Public IP',
    check_out_ip_match_status: 'Check-out IP Status',
    check_out_ip_policy_mode: 'Check-out IP Policy',
    office_name: 'Office',
    leave_type: 'Leave Type',
    leave_approval_status: 'Approval Status',
    // Amended status headers - ONLY amended_status remains
    amended_status: 'Amended Status',
    amended_by: '',
    amended_date: ''
  };

  // Format date / time cells nicely on export
  const exportRows = rowsWithAmendedStatus.map(r => ({
    employee_id: r.employee_id ?? '',
    employee_name: r.employee_name ?? '',
    company_name: r.company_name ?? '',
    department_name: r.department_name ?? '',
    date: toLocalDate(r.date),
    checkIn: toLocalDateTime(r.checkIn),
    checkOut: toLocalDateTime(r.checkOut),
    worked_hours: r.worked_hours ?? '0.00',
    status: r.status ?? '',
    // IP fields - both internal and public
    check_in_ip: r.check_in_ip ?? '',
    check_in_public_ip: r.check_in_public_ip ?? '',
    check_in_ip_match_status: r.check_in_ip_match_status ?? '',
    check_in_ip_policy_mode: r.check_in_ip_policy_mode ?? '',
    check_out_ip: r.check_out_ip ?? '',
    check_out_public_ip: r.check_out_public_ip ?? '',
    check_out_ip_match_status: r.check_out_ip_match_status ?? '',
    check_out_ip_policy_mode: r.check_out_ip_policy_mode ?? '',
    office_name: r.office_name ?? '',
    leave_type: r.leave_type ?? '',
    leave_approval_status: r.leave_approval_status ?? '',
    // Amended status fields - ONLY amended_status remains
    amended_status: r.amended_status ?? (r.amended_by ? 'Amended' : 'Original'),
    // REMOVED: amended_by, amended_date
  }));

  const ws = XLSX.utils.json_to_sheet(exportRows, { header: ordered as string[] });
  XLSX.utils.sheet_add_aoa(ws, [ordered.map(k => headerMap[k])], { origin: 'A1' });

  // Update column widths for all columns (adjusted for removed columns)
  const lastCol = String.fromCharCode('A'.charCodeAt(0) + ordered.length - 1);
  ws['!autofilter'] = { ref: `A1:${lastCol}${exportRows.length + 1}` };
  ws['!cols'] = [
    { wch: 12 }, { wch: 24 }, { wch: 20 }, { wch: 20 }, { wch: 12 },  // Basic info columns
    { wch: 16 }, { wch: 16 }, { wch: 12 },                           // Time/Worked hours columns
    { wch: 10 },                                                    // Status
    // IP columns - both internal and public
    { wch: 16 }, { wch: 20 }, { wch: 15 }, { wch: 15 },             // Check-in IP columns
    { wch: 16 }, { wch: 20 }, { wch: 15 }, { wch: 15 },             // Check-out IP columns
    { wch: 20 },                                                    // Office
    { wch: 22 }, { wch: 18 },                                       // Leave columns
    { wch: 15 },                                                    // Amended status columns (only amended_status remains)
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
  XLSX.writeFile(wb, fileName);
}
