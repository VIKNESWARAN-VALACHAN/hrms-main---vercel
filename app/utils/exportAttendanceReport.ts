// // // utils/exportAttendanceReport.ts
// // import * as XLSX from 'xlsx';
// // import { format } from 'date-fns';

// // interface AttendanceRow {
// //   employee_name: string;
// //   company_name: string;
// //   department_name: string;
// //   date: string;
// //   checkIn: string;
// //   checkOut: string;
// //   status: string;
// // }

// // export function downloadAttendanceReport(
// //   data: AttendanceRow[],
// //   fileName = `Attendance_Report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
// // ) {
// //   // group rows by employee
// //   const map = new Map<string, AttendanceRow[]>();
// //   data.forEach((row) => {
// //     const key = row.employee_name;
// //     if (!map.has(key)) map.set(key, []);
// //     map.get(key)!.push(row);
// //   });

// //   const wb = XLSX.utils.book_new();

// //   map.forEach((rows, emp) => {
// //     // convert rows to sheet
// //     const ws = XLSX.utils.json_to_sheet(rows, {
// //       header: [
// //         'employee_name',
// //         'company_name',
// //         'department_name',
// //         'date',
// //         'checkIn',
// //         'checkOut',
// //         'status',
// //       ],
// //     });

// //     // friendly column headers
// //     const header: Record<string, string> = {
// //       employee_name: 'Employee',
// //       company_name: 'Company',
// //       department_name: 'Department',
// //       date: 'Date',
// //       checkIn: 'Check-in',
// //       checkOut: 'Check-out',
// //       status: 'Status',
// //     };
// //     XLSX.utils.sheet_add_aoa(ws, [Object.values(header)], { origin: 'A1' });

// //     XLSX.utils.book_append_sheet(wb, ws, emp.slice(0, 31)); // Excel tab ≤31 chars
// //   });

// //   XLSX.writeFile(wb, fileName);
// // }

// // utils/exportAttendanceReport.ts
// import * as XLSX from 'xlsx';
// import { format, addDays } from 'date-fns';

// export interface AttendanceRow {
//   employee_id?: number;
//   employee_name: string;
//   company_name: string;
//   department_name: string;
//   date: string;     // yyyy-MM-dd
//   checkIn: string;
//   checkOut: string;
//   status: string;
// }

// export interface LeaveRow {
//   id?: number;
//   employee_id: number;
//   employee_name: string;
//   company_name: string;
//   department_name: string;
//   leave_type_name: string;
//   status: string;           // PENDING/APPROVED/REJECTED/...
//   start_date: string;       // yyyy-MM-dd
//   end_date: string;         // yyyy-MM-dd
//   is_half_day?: 0 | 1 | boolean;
// }

// // turn each leave into per-day rows so it can live in the same sheet
// function expandLeavesToDailyRows(leaves: LeaveRow[]): AttendanceRow[] {
//   const out: AttendanceRow[] = [];
//   for (const lv of leaves || []) {
//     const s = new Date(lv.start_date);
//     const e = new Date(lv.end_date);
//     for (let d = s; d <= e; d = addDays(d, 1)) {
//       const dd = d.toISOString().slice(0, 10);
//       const half = lv.is_half_day ? ' (Half Day)' : '';
//       out.push({
//         employee_id: lv.employee_id,
//         employee_name: lv.employee_name,
//         company_name: lv.company_name,
//         department_name: lv.department_name,
//         date: dd,
//         checkIn: '',
//         checkOut: '',
//         status: `LEAVE${half} - ${lv.leave_type_name} (${lv.status})`,
//       });
//     }
//   }
//   return out;
// }

// /**
//  * Keeps your existing call signature compatible:
//  *   downloadAttendanceReport(amendAttendanceData)
//  * Optional second arg to include leave rows:
//  *   downloadAttendanceReport(data, { includeLeaves: true, leaves, fileName })
//  */
// export function downloadAttendanceReport(
//   attendance: AttendanceRow[],
//   options?: {
//     leaves?: LeaveRow[];
//     includeLeaves?: boolean;
//     fileName?: string;
//   }
// ) {
//   const fileName =
//     options?.fileName || `Attendance_Report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;

//   const leaveRows =
//     options?.includeLeaves && options?.leaves?.length
//       ? expandLeavesToDailyRows(options.leaves)
//       : [];

//   const rows: AttendanceRow[] = [...attendance, ...leaveRows].sort((a, b) => {
//     const an = a.employee_name.localeCompare(b.employee_name);
//     if (an !== 0) return an;
//     return a.date.localeCompare(b.date);
//   });

//   const headerMap: Record<keyof AttendanceRow, string> = {
//     employee_id: 'Employee ID',
//     employee_name: 'Employee',
//     company_name: 'Company',
//     department_name: 'Department',
//     date: 'Date',
//     checkIn: 'Check-in',
//     checkOut: 'Check-out',
//     status: 'Status',
//   };

//   const ordered: (keyof AttendanceRow)[] = [
//     'employee_id',
//     'employee_name',
//     'company_name',
//     'department_name',
//     'date',
//     'checkIn',
//     'checkOut',
//     'status',
//   ];

//   const exportRows = rows.map(r => {
//     const o: any = {};
//     for (const k of ordered) o[k] = (r as any)[k] ?? '';
//     return o;
//   });

//   const ws = XLSX.utils.json_to_sheet(exportRows, { header: ordered as string[] });
//   XLSX.utils.sheet_add_aoa(ws, [ordered.map(k => headerMap[k])], { origin: 'A1' });

//   const lastCol = String.fromCharCode('A'.charCodeAt(0) + ordered.length - 1);
//   ws['!autofilter'] = { ref: `A1:${lastCol}${exportRows.length + 1}` };
//   ws['!cols'] = [
//     { wch: 12 }, // id
//     { wch: 24 }, // emp
//     { wch: 20 }, // company
//     { wch: 20 }, // dept
//     { wch: 12 }, // date
//     { wch: 10 }, // in
//     { wch: 10 }, // out
//     { wch: 36 }, // status
//   ];

//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
//   XLSX.writeFile(wb, fileName);
// }



// utils/exportAttendanceReport.ts
import * as XLSX from 'xlsx';

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
  date: string;     // yyyy-MM-dd or ISO
  checkIn: string;  // may be ISO
  checkOut: string; // may be ISO
  status: string;   // for attendance rows; leave rows will be ''
  leave_type?: string;
  leave_approval_status?: string;
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

// Expand leaves into per-day rows, but KEEP Status EMPTY.
// Details live in Leave Type + Approval Status columns.
import { addDays } from 'date-fns';
// utils/exportAttendanceReport.ts

function expandLeavesToDailyRows(leaves: LeaveRow[] = []): AttendanceRow[] {
  const out: AttendanceRow[] = [];
  const LEAVE_STATUS_LABEL = 'LEAVE'; // <- what shows in Status column for leave days

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
        status: LEAVE_STATUS_LABEL,        // <-- ONLY "LEAVE"
        leave_type: lv.leave_type_name,    // e.g., "Bereavement Leave"
        leave_approval_status: lv.status,  // e.g., "APPROVED"
      });
    }
  }
  return out;
}

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

  // Order + headers (with new columns)
  const ordered: (keyof AttendanceRow)[] = [
    'employee_id',
    'employee_name',
    'company_name',
    'department_name',
    'date',
    'checkIn',
    'checkOut',
    'status',
    'leave_type',
    'leave_approval_status',
  ];

  const headerMap: Record<keyof AttendanceRow, string> = {
    employee_id: 'Employee ID',
    employee_name: 'Employee',
    company_name: 'Company',
    department_name: 'Department',
    date: 'Date',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    status: 'Status',
    leave_type: 'Leave Type',
    leave_approval_status: 'Approval Status',
  };

  // Format date / time cells nicely on export
  const exportRows = rows.map(r => ({
    employee_id: r.employee_id ?? '',
    employee_name: r.employee_name ?? '',
    company_name: r.company_name ?? '',
    department_name: r.department_name ?? '',
    date: toLocalDate(r.date),
    checkIn: toLocalDateTime(r.checkIn),
    checkOut: toLocalDateTime(r.checkOut),
    status: r.status ?? '',
    leave_type: r.leave_type ?? '',
    leave_approval_status: r.leave_approval_status ?? '',
  }));

  const ws = XLSX.utils.json_to_sheet(exportRows, { header: ordered as string[] });
  XLSX.utils.sheet_add_aoa(ws, [ordered.map(k => headerMap[k])], { origin: 'A1' });

  // width + filter
  const lastCol = String.fromCharCode('A'.charCodeAt(0) + ordered.length - 1);
  ws['!autofilter'] = { ref: `A1:${lastCol}${exportRows.length + 1}` };
  ws['!cols'] = [
    { wch: 12 }, { wch: 24 }, { wch: 20 }, { wch: 20 }, { wch: 12 },
    { wch: 16 }, { wch: 16 }, { wch: 10 }, { wch: 22 }, { wch: 18 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
  XLSX.writeFile(wb, fileName);
}
