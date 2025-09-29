// 'use client';

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { Download, Printer, ChevronDown, Calendar, FileBarChart2, Eye, EyeOff, X, AlertCircle } from 'lucide-react';
// import { API_BASE_URL } from "../config";

// /* ================= Types ================= */
// export type PayslipItemType = 'Earning' | 'Deduction' | 'Statutory' | 'Employer Contribution';

// export interface PayslipItem {
//   id: number;
//   payroll_id?: number;
//   label: string;
//   amount: number | string;
//   type: PayslipItemType | string;
//   origin?: string | null;
// }

// export interface EmployerContribution {
//   id?: number;
//   payroll_id?: number;
//   label?: string;
//   amount?: number | string;
//   type?: 'Employer Contribution';
//   created_at?: string;
// }

// /** New API blocks */
// interface CompanyInfo {
//   id?: number;
//   name?: string | null;
//   address?: string | null;
//   registration_no?: string | null;
//   epf_no?: string | null;
//   socso_no?: string | null;
//   tax_no?: string | null;
// }

// interface EmployeeProfile {
//   id?: number;
//   name?: string | null;
//   employee_no?: string | null;
//   ic_passport?: string | null;
//   department?: string | null;
//   position?: string | null;
//   currency?: string | null;
//   photo_url?: string | null;
// }

// interface BankStatutory {
//   bank_name?: string | null;
//   account_no?: string | null;
//   epf_no?: string | null;
//   socso_no?: string | null;
//   tax_ref_no?: string | null;
//   payroll_period_label?: string | null;
// }

// export interface PayrollRow {
//   id: number;
//   period_year: number;
//   period_month: number;
//   employee_id: number;

//   /** legacy flat fields kept for backward compatibility */
//   employee_name: string;
//   employee_no?: string | null;
//   ic_passport_no?: string | null;
//   department_name?: string | null;
//   position?: string | null;
//   bank_name?: string | null;
//   bank_account_no?: string | null;
//   epf_number?: string | null;
//   socso_number?: string | null;
//   tax_ref_no?: string | null;

//   /** new structured blocks */
//   company?: CompanyInfo | null;
//   employee_profile?: EmployeeProfile | null;
//   bank_statutory?: BankStatutory | null;

//   basic_salary: number | string;
//   total_allowance: number | string;
//   gross_salary: number | string;
//   total_deduction: number | string;

//   epf_employee: number | string;
//   epf_employer: number | string;
//   socso_employee: number | string;
//   socso_employer: number | string;
//   eis_employee: number | string;
//   eis_employer: number | string;
//   pcb: number | string;
//   net_salary: number | string;

//   status_code: string; // e.g., 'PAID'
//   payslip_items: PayslipItem[];
//   employer_contributions?: EmployerContribution[];
// }

// type DivRef = React.RefObject<HTMLDivElement | null>;

// /* ================= Helpers ================= */
// const FALLBACK_COMPANY_NAME = 'PROSPER NETWORK SDN BHD';
// const FALLBACK_COMPANY_ADDR = '55100 Kuala Lumpur, Federal Territory of Kuala Lumpur';

// const toMYR = (n: number) => n.toLocaleString('en-MY', { style: 'currency', currency: 'MYR' });
// const num = (s: string | number | null | undefined) => {
//   const v = typeof s === 'string' ? parseFloat(s) : (s ?? 0);
//   return Number.isFinite(v) ? Number(v) : 0;
// };
// const monthName = (m: number) =>
//   ['', 'January','February','March','April','May','June','July','August','September','October','November','December'][m] ?? String(m);

// function monthsOfYear(year: number) {
//   return Array.from({ length: 12 }, (_, i) => {
//     const m = i + 1;
//     return { year, month: m, key: `${year}-${String(m).padStart(2,'0')}`, label: `${monthName(m)} ${year}` };
//   });
// }

// function pxPerMM() {
//   const probe = document.createElement('div');
//   probe.style.width = '100mm';
//   probe.style.height = '0';
//   probe.style.position = 'absolute';
//   probe.style.visibility = 'hidden';
//   document.body.appendChild(probe);
//   const px = probe.offsetWidth / 100;
//   probe.remove();
//   return px;
// }

// /** Compute a uniform scale so the payslip fits inside one A4 page box */
// function setPrintScaleToFit(el: HTMLElement, marginMM = 0) {
//   const mm = pxPerMM();
//   const pageW = (210 - 2 * marginMM) * mm;
//   const pageH = (297 - 2 * marginMM) * mm;

//   // Measure the natural content size
//   const prev = document.documentElement.style.getPropertyValue('--print-scale');
//   document.documentElement.style.setProperty('--print-scale', '1');

//   // NOTE: we measure unscaled content; width is already 210mm on screen
//   const contentW = el.scrollWidth;
//   const contentH = el.scrollHeight;

//   const scale = Math.min(pageW / contentW, pageH / contentH, 1);
//   document.documentElement.style.setProperty('--print-scale', String(scale || 1));

//   if (!prev) return () => document.documentElement.style.removeProperty('--print-scale');
//   return () => document.documentElement.style.setProperty('--print-scale', prev);
// }


// function clearPrintScale() {
//   document.documentElement.style.removeProperty('--print-scale');
// }



// function lastNMonths(n = 6): string[] {
//   const out: string[] = [];
//   const now = new Date();
//   let y = now.getFullYear();
//   let m = now.getMonth() + 1;
//   for (let i = 0; i < n; i++) {
//     out.unshift(`${y}-${String(m).padStart(2,'0')}`);
//     m -= 1;
//     if (m === 0) { m = 12; y -= 1; }
//   }
//   return out;
// }

// /* ================= Page ================= */
// export default function PayslipsPage() {
//   const [loading, setLoading] = useState(false);
//   const [rows, setRows] = useState<PayrollRow[]>([]);

//   const currentYear = new Date().getFullYear();
//   const periodOptions = useMemo(() => monthsOfYear(currentYear), [currentYear]);
//   const [selectedKey, setSelectedKey] = useState<string>(() => {
//     const now = new Date();
//     return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,'0')}`;
//   });

//   const selectedRow: PayrollRow | null = useMemo(() => {
//     const [yy, mm] = selectedKey.split('-').map(Number);
//     return rows.find(r => r.period_year === yy && r.period_month === mm) ?? null;
//   }, [rows, selectedKey]);

//   const [isGenerating, setIsGenerating] = useState(false);
//   const [generatedForId, setGeneratedForId] = useState<number | null>(null);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const slipRef = useRef<HTMLDivElement | null>(null);
//   const [hideAmounts, setHideAmounts] = useState(true);

//   const EMPLOYEE_ID = 143;

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`${API_BASE_URL}/api/payroll/employee/${EMPLOYEE_ID}?status=PAID`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
//         });
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const data: PayrollRow[] = await res.json();
//         setRows((data || []).filter(d => d.status_code === 'PAID'));
//       } catch (e: any) {
//         toast.error(e?.message || 'Failed to load payslips');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   useEffect(() => setGeneratedForId(null), [selectedKey]);

//   const historyKeys6 = useMemo(() => lastNMonths(6), []);
//   const historySeries = useMemo(() => {
//     const map = new Map<string, { gross: number; net: number; ded: number }>();
//     for (const k of historyKeys6) map.set(k, { gross: 0, net: 0, ded: 0 });
//     rows.forEach(r => {
//       const k = `${r.period_year}-${String(r.period_month).padStart(2,'0')}`;
//       if (map.has(k)) {
//         map.set(k, {
//           gross: num(r.gross_salary),
//           net: num(r.net_salary),
//           ded: num(r.total_deduction) + num(r.epf_employee) + num(r.socso_employee) + num(r.eis_employee) + num(r.pcb),
//         });
//       }
//     });
//     return historyKeys6.map(k => ({ key: k, ...map.get(k)! }));
//   }, [rows, historyKeys6]);

//   const maxGross = useMemo(() => Math.max(...historySeries.map(d => d.gross), 1), [historySeries]);
//   const maxDed   = useMemo(() => Math.max(...historySeries.map(d => d.ded), 1), [historySeries]);

//   const ytd = useMemo(() => {
//     const y = currentYear;
//     const list = rows.filter(r => r.period_year === y);
//     return {
//       year: y,
//       gross: list.reduce((s, r) => s + num(r.gross_salary), 0),
//       net: list.reduce((s, r) => s + num(r.net_salary), 0),
//       epfEmp: list.reduce((s, r) => s + num(r.epf_employee), 0),
//       epfEmpr: list.reduce((s, r) => s + num(r.epf_employer), 0),
//       socsoEmp: list.reduce((s, r) => s + num(r.socso_employee), 0),
//       socsoEmpr: list.reduce((s, r) => s + num(r.socso_employer), 0),
//       eisEmp: list.reduce((s, r) => s + num(r.eis_employee), 0),
//       eisEmpr: list.reduce((s, r) => s + num(r.eis_employer), 0),
//       pcb: list.reduce((s, r) => s + num(r.pcb), 0),
//       slips: list.length,
//     };
//   }, [rows, currentYear]);

//   const fmt = (n: number | string) => hideAmounts ? '••••' : toMYR(num(n));
//   const fmtKpi = (n: number | string) => hideAmounts ? '••••' : toMYR(num(n));

//   const displayName = useMemo(() => {
//     const ep = selectedRow?.employee_profile;
//     if (ep?.name) return ep.name;
//     return selectedRow?.employee_name || rows[0]?.employee_name || '—';
//   }, [selectedRow, rows]);

//   const currentMonthKey = useMemo(() => {
//     const n = new Date();
//     return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2,'0')}`;
//   }, []);
//   const currentMonthReleased = useMemo(() => {
//     const r = rows.find(rr => `${rr.period_year}-${String(rr.period_month).padStart(2,'0')}` === currentMonthKey);
//     return !!r;
//   }, [rows, currentMonthKey]);

//   const lastSlip = useMemo(() => {
//     if (!rows.length) return null;
//     const sorted = [...rows].sort((a, b) =>
//       a.period_year === b.period_year ? b.period_month - a.period_month : b.period_year - a.period_year);
//     return sorted[0];
//   }, [rows]);

//   const handleGenerate = () => {
//     if (!selectedRow) return;
//     setIsGenerating(true);
//     setTimeout(() => {
//       setGeneratedForId(selectedRow.id);
//       setIsGenerating(false);
//       setModalOpen(true);
//       toast.success('Payslip generated');
//     }, 600);
//   };

// async function handleDownloadPdf() {
//   if (!slipRef.current || !selectedRow) return;

//   try {
//     const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
//       import('html2canvas'),
//       import('jspdf')
//     ]);

//     const EMP = selectedRow.employee_profile || {};
//     const BNK = selectedRow.bank_statutory || {};
//     const CMP = selectedRow.company || {};

//     const earnings   = selectedRow.payslip_items.filter(i => String(i.type).toLowerCase() === 'earning');
//     const deductions = selectedRow.payslip_items.filter(i => String(i.type).toLowerCase() === 'deduction');
//     const statutory  = selectedRow.payslip_items.filter(i => String(i.type).toLowerCase() === 'statutory');

//     const employerContribs = (selectedRow.employer_contributions?.length ? selectedRow.employer_contributions : [
//       { label: 'EPF Employer',  amount: selectedRow.epf_employer },
//       { label: 'SOCSO Employer',amount: selectedRow.socso_employer },
//       { label: 'EIS Employer',  amount: selectedRow.eis_employer },
//     ]);

//     // IMPORTANT: keep this pure/basic HTML (no modern color functions)
//     const htmlContent = `
//       <div style="padding:20px;font-family:Arial, sans-serif;font-size:12px;line-height:1.4;color:#000;background:#fff;">
//         <!-- header, sections, etc. (your same htmlContent body) -->
//         <!-- ... your existing htmlContent from the current function ... -->
//       </div>
//     `;

//     // ====== START: patched isolation (prevents oklch() from global CSS) ======
//     // Host off-screen container
//     const tempHost = document.createElement('div');
//     tempHost.style.position = 'fixed';
//     tempHost.style.left = '-10000px';
//     tempHost.style.top = '0';
//     tempHost.style.width = '0';
//     tempHost.style.height = '0';
//     tempHost.style.overflow = 'hidden';
//     document.body.appendChild(tempHost);

//     // Wrapper that drops all inherited styles (DaisyUI/Tailwind variables)
//     const wrapper = document.createElement('div');
//     wrapper.style.setProperty('all', 'initial');               // reset cascade
//     wrapper.style.display = 'block';
//     wrapper.style.background = '#ffffff';
//     wrapper.style.fontFamily = 'Arial, sans-serif';
//     wrapper.style.width = '794px';                             // ~ A4 @ 96dpi
//     wrapper.innerHTML = htmlContent;

//     tempHost.appendChild(wrapper);

//     // Snapshot the WRAPPER (not the page)
//     const canvas = await html2canvas(wrapper, {
//       scale: 2,
//       useCORS: true,
//       backgroundColor: '#ffffff',
//       logging: false,
//       width: 794,
//       height: wrapper.scrollHeight
//     });
//     // ====== END: patched isolation ======

//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const imgData = canvas.toDataURL('image/jpeg', 0.98);

//     const imgWidth = 210; // mm
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//     pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
//     pdf.save(
//       `Payslip_${selectedRow.employee_profile?.name || selectedRow.employee_name}_${selectedRow.period_year}-${String(selectedRow.period_month).padStart(2, '0')}.pdf`
//     );

//     // Cleanup
//     document.body.removeChild(tempHost);

//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     toast.error('Failed to generate PDF. Please try again.');
//   }
// }


// const handlePrint = () => {
//   const root = slipRef.current;
//   if (!root) return;

//   // 0 mm margins -> full-bleed A4 in preview/PDF.
//   // If a physical printer clips, change to 5–10.
//   const restore = setPrintScaleToFit(root, 0);

//   const before = () => setPrintScaleToFit(root, 0);
//   const after  = () => restore?.();

//   window.addEventListener('beforeprint', before);
//   window.addEventListener('afterprint', after);

//   // Trigger print
//   setTimeout(() => {
//     window.print();
//     setTimeout(() => {
//       window.removeEventListener('beforeprint', before);
//       window.removeEventListener('afterprint', after);
//       restore?.();
//     }, 0);
//   }, 0);
// };




//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-6 lg:px-8">
//       {/* HEADER */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">My Payslips</h1>
//             <p className="text-gray-600 mt-1">Welcome, {displayName}</p>
//           </div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setHideAmounts(h => !h)}
//               className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//               title={hideAmounts ? 'Show amounts' : 'Hide amounts'}
//             >
//               {hideAmounts ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
//               <span>{hideAmounts ? 'View amounts' : 'Hide amounts'}</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* KPI CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-xl shadow-sm p-4">
//           <div className="text-xs text-gray-500 mb-1">YTD Net ({ytd.year})</div>
//           <div className="text-xl font-semibold text-gray-900">{fmtKpi(ytd.net)}</div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4">
//           <div className="text-xs text-gray-500 mb-1">YTD Gross</div>
//           <div className="text-xl font-semibold text-gray-900">{fmtKpi(ytd.gross)}</div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4">
//           <div className="text-xs text-gray-500 mb-1">YTD EPF (Employee)</div>
//           <div className="text-xl font-semibold text-gray-900">{fmtKpi(ytd.epfEmp)}</div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4">
//           <div className="text-xs text-gray-500 mb-1">Current Month Released</div>
//           <div className={`text-sm font-medium inline-flex items-center px-2 py-1 rounded-full ${currentMonthReleased ? 'text-green-700 bg-green-50' : 'text-amber-700 bg-amber-50'}`}>
//             {currentMonthReleased ? 'Yes' : 'Not yet'}
//           </div>
//           {lastSlip && (
//             <div className="text-xs text-gray-500 mt-2">
//               Last slip: {monthName(lastSlip.period_month)} {lastSlip.period_year}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* CHARTS */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
//         <div className="bg-white rounded-xl shadow-sm p-5">
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="font-semibold text-gray-900">Gross vs Net (last 6 months)</h3>
//             <div className="text-xs text-gray-500">Values {hideAmounts ? 'hidden' : 'shown'}</div>
//           </div>
//           <div className="h-48">
//             <div className="flex items-end h-full gap-2">
//               {historySeries.map(d => {
//                 const [yy, mm] = d.key.split('-').map(Number);
//                 const grossH = Math.round((d.gross / maxGross) * 100);
//                 const netH   = Math.round((d.net / maxGross) * 100);
//                 return (
//                   <div key={d.key} className="flex-1 flex flex-col items-center">
//                     <div className="flex items-end gap-1 w-full h-36">
//                       <div className="flex-1 bg-blue-200 rounded-t-md" style={{ height: `${grossH}%` }} title={hideAmounts ? 'Gross: hidden' : `Gross: ${toMYR(d.gross)}`} />
//                       <div className="flex-1 bg-blue-500 rounded-t-md" style={{ height: `${netH}%` }} title={hideAmounts ? 'Net: hidden' : `Net: ${toMYR(d.net)}`} />
//                     </div>
//                     <div className="mt-1 text-[10px] text-gray-500 whitespace-nowrap">{monthName(mm).slice(0,3)} {String(yy).slice(2)}</div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-5">
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="font-semibold text-gray-900">Total Deductions (last 6 months)</h3>
//             <div className="text-xs text-gray-500">Values {hideAmounts ? 'hidden' : 'shown'}</div>
//           </div>
//           <div className="h-48">
//             <div className="flex items-end h-full gap-2">
//               {historySeries.map(d => {
//                 const [yy, mm] = d.key.split('-').map(Number);
//                 const h = Math.round((d.ded / maxDed) * 100);
//                 return (
//                   <div key={d.key} className="flex-1 flex flex-col items-center">
//                     <div className="w-full h-36 bg-indigo-200 rounded-t-md" style={{ height: `${h}%` }} title={hideAmounts ? 'Hidden' : `${toMYR(d.ded)}`} />
//                     <div className="mt-1 text-[10px] text-gray-500 whitespace-nowrap">{monthName(mm).slice(0,3)} {String(yy).slice(2)}</div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CONTROLS */}
//       <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
//         <div className="flex flex-col md:flex-row md:items-end gap-4">
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Select Pay Period</label>
//             <div className="relative">
//               <select
//                 className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
//                 value={selectedKey}
//                 onChange={e => setSelectedKey(e.target.value)}
//                 disabled={loading || isGenerating}
//               >
//                 {periodOptions.map(p => {
//                   const available = rows.some(r => r.period_year === p.year && r.period_month === p.month);
//                   return (
//                     <option key={p.key} value={p.key}>
//                       {p.label} {available ? '' : '(Not available)'}
//                     </option>
//                   );
//                 })}
//               </select>
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <Calendar className="w-5 h-5 text-gray-400" />
//               </div>
//               <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
//                 <ChevronDown className="w-5 h-5 text-gray-400" />
//               </div>
//             </div>
//             {!selectedRow && (
//               <div className="mt-2 inline-flex items-center text-sm text-amber-700 bg-amber-50 px-2 py-1 rounded">
//                 <AlertCircle className="w-4 h-4 mr-1" /> Payslip not available for this period.
//               </div>
//             )}
//           </div>

//           <div className="flex gap-2">
//             <button
//               className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 border border-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
//               onClick={handleGenerate}
//               disabled={!selectedRow || isGenerating}
//               title="Generate the payslip (opens modal)"
//             >
//               <FileBarChart2 className="w-4 h-4" />
//               <span>Generate Payslip</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* MODAL */}
//       {isModalOpen && selectedRow && generatedForId === selectedRow.id && (
//         <PayslipModal
//           isOpen={isModalOpen}
//           onClose={() => setModalOpen(false)}
//           refEl={slipRef}
//           row={selectedRow}
//           hideAmounts={hideAmounts}
//           ytd={{
//             epfEmp: ytd.epfEmp, epfEmpr: ytd.epfEmpr,
//             socsoEmp: ytd.socsoEmp, socsoEmpr: ytd.socsoEmpr,
//             eisEmp: ytd.eisEmp, eisEmpr: ytd.eisEmpr, pcbYtd: ytd.pcb
//           }}
//           onPrint={handlePrint}
//           onDownload={handleDownloadPdf}
//         />
//       )}

//       {/* PRINT + scrollbars */}
//       <style jsx global>{`
//       @media print {
//   /* Hard A4, no margins so we control the whole page box */
//   @page { size: 210mm 297mm; margin: 0; }

//   /* Hide everything except the payslip */
//   body { margin: 0 !important; }
//   body * { visibility: hidden !important; }

//   #payslip-print-root, #payslip-print-root * { visibility: visible !important; }

//   /* Single-page canvas */
//   #payslip-print-root {
//     position: fixed;
//     left: 0; top: 0;

//     /* Counter-scale so the FINAL (post-transform) size = A4 */
//     width: calc(210mm / var(--print-scale, 1));
//     height: calc(297mm / var(--print-scale, 1));
//     transform-origin: top left;
//     transform: scale(var(--print-scale, 1));

//     /* Prevent accidental second page due to shadows/borders/overflow */
//     /* background: #ffffff !important; */
//     margin: 0 !important; padding: 0 !important;
//     border: 0 !important; box-shadow: none !important;
//     overflow: hidden !important;

//     page-break-before: avoid;
//     page-break-after:  avoid;
//     page-break-inside: avoid;
    
//   }
// }


//       `}</style>
//     </div>
//   );
// }

// /* ================= Modal + Payslip Template ================= */
// function PayslipModal({
//   isOpen, onClose, refEl, row, hideAmounts, ytd, onPrint, onDownload
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   refEl: React.RefObject<HTMLDivElement | null>;
//   row: PayrollRow;
//   hideAmounts: boolean;
//   ytd: { epfEmp: number; epfEmpr: number; socsoEmp: number; socsoEmpr: number; eisEmp: number; eisEmpr: number; pcbYtd: number; };
//   onPrint: () => void;
//   onDownload: () => void;
// }) {
//   React.useEffect(() => {
//     if (isOpen) {
//       const { style } = document.documentElement;
//       const prev = style.overflow;
//       style.overflow = 'hidden';
//       return () => { style.overflow = prev; };
//     }
//   }, [isOpen]);
//   if (!isOpen) return null;

//   const fmt = (n: number | string) => hideAmounts ? '••••' : toMYR(num(n));
//   const Detail: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
//     <div className="flex items-center py-1">
//       <div className="w-44 text-[12px] text-gray-600">{label}</div>
//       <div className={`text-[12px] font-medium ${hideAmounts ? 'text-gray-400' : 'text-gray-900'}`}>
//         {hideAmounts ? (typeof value === 'number' ? '••••' : (value ?? '—')) : (value ?? '—')}
//       </div>
//     </div>
//   );

//   const EMP = row.employee_profile || {};
//   const BNK = row.bank_statutory || {};
//   const CMP = row.company || {};

//   const displayStatus = row.status_code || 'PAID';
//   const earnings = row.payslip_items.filter(i => String(i.type).toLowerCase() === 'earning');
//   const deductions = row.payslip_items.filter(i => String(i.type).toLowerCase() === 'deduction');
//   const statutory  = row.payslip_items.filter(i => String(i.type).toLowerCase() === 'statutory');

//   const employerContribs = (row.employer_contributions?.length ? row.employer_contributions : [
//     { label: 'EPF Employer', amount: row.epf_employer },
//     { label: 'SOCSO Employer', amount: row.socso_employer },
//     { label: 'EIS Employer', amount: row.eis_employer },
//   ]) as EmployerContribution[];

//   const transferItems = row.payslip_items.filter(i =>
//     String(i.type).toLowerCase() === 'transfer' || /transfer/i.test(i.label)
//   );
//   const transferTotal = transferItems.reduce((s, i) => s + num(i.amount), 0);

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center">
//       <button aria-label="Close overlay" className="absolute inset-0 bg-black/50" onClick={onClose} />
//       <div
//         role="dialog"
//         aria-modal="true"
//         className="relative w-[98vw] max-w-[980px] h-[96vh] md:h-auto md:max-h-[92vh] bg-white rounded-none md:rounded-xl shadow-2xl flex flex-col pointer-events-auto"
//       >
//         <div className="sticky top-0 z-10 px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
//           <div className="font-semibold text-gray-900">
//             Payslip • {BNK.payroll_period_label || `${monthName(row.period_month)} ${row.period_year}`}
//           </div>
//           <div className="flex items-center gap-2">
//             <button onClick={onPrint} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50">
//               <Printer className="w-4 h-4" /><span>Print</span>
//             </button>
//             <button onClick={onDownload} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
//               <Download className="w-4 h-4" /><span>Download PDF</span>
//             </button>
//             <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Close payslip modal">
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         <div className="flex-1 overflow-auto thin-scrollbar p-4 md:p-6 bg-white" style={{ WebkitOverflowScrolling: 'touch' }}>
//           <div
//             id="payslip-print-root"
//             ref={refEl}
//             className="mx-auto text-gray-900 rounded-xl border border-gray-200 overflow-hidden bg-white"
//             style={{ width: '210mm', minHeight: '297mm' }}   // screen size; print CSS will handle exact fit
//           >
//           {/* Header */}
//             <div className="px-8 pt-8 pb-5 border-b border-gray-200 bg-[#f1f5f9]">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-start gap-3">
//                   <div>
//                     <h2 className="text-xl font-extrabold tracking-wide text-gray-900">
//                       {CMP.name || FALLBACK_COMPANY_NAME}
//                     </h2>
//                     <div className="text-[12px] text-gray-600">
//                       {CMP.address || FALLBACK_COMPANY_ADDR}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-[11px] uppercase text-gray-500">Payroll Period</div>
//                   <div className="text-[15px] font-semibold">
//                     {BNK.payroll_period_label || `${monthName(row.period_month)} ${row.period_year}`}
//                   </div>
//                   <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
//                     displayStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
//                   }`}>{displayStatus}</div>
//                 </div>
//               </div>
//             </div>

//             {/* Employee + Bank & Statutory */}
//             <div className="px-8 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Employee (no picture) */}
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <h3 className="text-[12px] font-medium text-gray-700 uppercase tracking-wider mb-2">Employee</h3>
//                 <Detail label="Name" value={EMP.name ?? row.employee_name} />
//                 <Detail label="Employee No." value={EMP.employee_no ?? row.employee_no ?? '—'} />
//                 <Detail label="IC/Passport No." value={EMP.ic_passport ?? row.ic_passport_no ?? '—'} />
//                 <Detail label="Department" value={EMP.department ?? row.department_name ?? '—'} />
//                 <Detail label="Position" value={EMP.position ?? row.position ?? '—'} />
//                 <Detail label="Currency" value={EMP.currency ?? 'MYR'} />
//               </div>

//               {/* Bank & Statutory */}
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <h3 className="text-[12px] font-medium text-gray-700 uppercase tracking-wider mb-2">Bank & Statutory</h3>
//                 <Detail label="Bank Name" value={BNK.bank_name ?? row.bank_name ?? '—'} />
//                 <Detail label="Account Number" value={BNK.account_no ?? row.bank_account_no ?? '—'} />
//                 <Detail label="EPF Number" value={BNK.epf_no ?? row.epf_number ?? '—'} />
//                 <Detail label="SOCSO Number" value={BNK.socso_no ?? row.socso_number ?? '—'} />
//                 <Detail label="Tax Ref No." value={BNK.tax_ref_no ?? row.tax_ref_no ?? '—'} />
//                 <Detail label="Payroll Date (Period)" value={BNK.payroll_period_label || `${monthName(row.period_month)} ${row.period_year}`} />
//               </div>
//             </div>


//             {/* Earnings / Deductions */}
//             <div className="px-8 pt-5">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="rounded-lg border border-gray-200 overflow-hidden">
//                   <div className="px-4 py-2.5 bg-gray-50 font-semibold">Earnings</div>
//                   <div>
//                     {earnings.length === 0 && <div className="px-4 py-3 text-sm text-gray-500">No earnings</div>}
//                     {earnings.map(i => (
//                       <div key={i.id} className="px-4 py-2.5 flex items-center justify-between border-t border-gray-100">
//                         <span className="text-[13px] text-gray-700">{i.label}</span>
//                         <span className={`text-[13px] font-medium ${hideAmounts ? 'text-gray-400' : 'text-gray-900'}`}>{fmt(i.amount)}</span>
//                       </div>
//                     ))}
//                     <div className="px-4 py-2.5 flex items-center justify-between border-t-2 border-gray-300 bg-gray-50">
//                       <span className="text-[13px] font-semibold text-gray-800">Total Earnings</span>
//                       <span className="text-[13px] font-semibold text-blue-600">
//                         {fmt(earnings.reduce((s,i)=>s+num(i.amount),0))}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="rounded-lg border border-gray-200 overflow-hidden">
//                   <div className="px-4 py-2.5 bg-gray-50 font-semibold">Deductions</div>
//                   <div>
//                     {[...deductions, ...statutory].map(i => (
//                       <div key={i.id} className="px-4 py-2.5 flex items-center justify-between border-t border-gray-100">
//                         <span className="text-[13px] text-gray-700">{i.label}</span>
//                         <span className={`text-[13px] font-medium ${hideAmounts ? 'text-gray-400' : 'text-gray-900'}`}>{fmt(i.amount)}</span>
//                       </div>
//                     ))}
//                     <div className="px-4 py-2.5 flex items-center justify-between border-t-2 border-gray-300 bg-gray-50">
//                       <span className="text-[13px] font-semibold text-gray-800">Total Deduction</span>
//                       <span className={`text-[13px] font-semibold ${hideAmounts ? 'text-gray-400' : 'text-red-600'}`}>
//                         {fmt(deductions.reduce((s,i)=>s+num(i.amount),0) + statutory.reduce((s,i)=>s+num(i.amount),0))}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Salary Summary */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
//                 <div className="rounded-lg border border-gray-200 p-4">
//                   <div className="text-[12px] text-gray-600">Gross Salary</div>
//                   <div className={`text-[16px] font-semibold ${hideAmounts ? 'text-gray-400' : 'text-gray-900'}`}>{fmt(row.gross_salary)}</div>
//                 </div>
//                 <div className="rounded-lg border border-gray-200 p-4">
//                   <div className="text-[12px] text-gray-600">Total Deductions</div>
//                   <div className={`text-[16px] font-semibold ${hideAmounts ? 'text-gray-400' : 'text-red-600'}`}>
//                     {fmt(num(row.total_deduction) + num(row.epf_employee) + num(row.socso_employee) + num(row.eis_employee) + num(row.pcb))}
//                   </div>
//                 </div>
//                 <div className="rounded-lg border border-gray-200 p-4 bg-blue-50">
//                   <div className="text-[12px] text-blue-800 font-medium">Net Salary</div>
//                   <div className={`text-[18px] font-bold ${hideAmounts ? 'text-gray-400' : 'text-blue-700'}`}>{fmt(row.net_salary)}</div>
//                 </div>
//               </div>

//               {/* Other + Transfer */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
//                 <div className="rounded-lg border border-gray-200 overflow-hidden">
//                   <div className="px-4 py-2.5 bg-gray-50 font-semibold">Other Information</div>
//                   <div>
//                     {employerContribs.map((c, idx) => (
//                       <div key={`${c.label}-${idx}`} className="px-4 py-2.5 flex items-center justify-between border-t border-gray-100">
//                         <span className="text-[13px] text-gray-700">{c.label}</span>
//                         <span className={`text-[13px] font-medium ${hideAmounts ? 'text-gray-400' : 'text-gray-900'}`}>{fmt(c.amount ?? 0)}</span>
//                       </div>
//                     ))}
//                     <div className="px-4 py-2.5 flex items-center justify-between border-t-2 border-gray-300 bg-gray-50">
//                       <span className="text-[13px] font-semibold text-gray-800">Total Other</span>
//                       <span className="text-[13px] font-semibold text-blue-600">
//                         {fmt(employerContribs.reduce((s, c) => s + num(c.amount), 0))}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="rounded-lg border border-gray-200 overflow-hidden">
//                   <div className="px-4 py-2.5 bg-gray-50 font-semibold">Transfer To</div>
//                   <div>
//                     <div className="px-4 py-2.5 border-t border-gray-100 text-[13px] text-gray-700">{BNK.bank_name ?? row.bank_name ?? '—'}</div>
//                     <div className="px-4 py-2.5 border-t border-gray-100 text-[13px] text-gray-700">{BNK.account_no ?? row.bank_account_no ?? '—'}</div>
//                     {transferItems.length > 0 ? transferItems.map(i => (
//                       <div key={i.id} className="px-4 py-2.5 flex items-center justify-between border-t border-gray-100">
//                         <span className="text-[13px] text-gray-700">{i.label}</span>
//                         <span className={`text-[13px] font-medium ${hideAmounts ? 'text-gray-400' : 'text-gray-900'}`}>{fmt(i.amount)}</span>
//                       </div>
//                     )) : (
//                       <div className="px-4 py-2.5 border-t border-gray-100 text-[13px] text-gray-500">—</div>
//                     )}
//                     <div className="px-4 py-2.5 flex items-center justify-between border-t-2 border-gray-300 bg-gray-50">
//                       <span className="text-[13px] font-semibold text-gray-800">Total Transfer</span>
//                       <span className={`text-[13px] font-semibold ${hideAmounts ? 'text-gray-400' : 'text-gray-900'}`}>{fmt(transferTotal)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Contributions + PCB */}
//               <div className="grid grid-cols-1 mt-5">
//                 <div className="rounded-lg border border-gray-200 overflow-hidden">
//                   <div className="px-4 py-2.5 bg-gray-50 font-semibold">Contributions</div>
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full text-[12px]">
//                       <thead>
//                         <tr className="border-t border-b border-gray-200 bg-white">
//                           <th className="px-4 py-2 text-left w-44"></th>
//                           <th className="px-4 py-2 text-center">EPF</th>
//                           <th className="px-4 py-2 text-center">SOCSO</th>
//                           <th className="px-4 py-2 text-center">EIS</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         <tr className="border-t border-gray-100">
//                           <td className="px-4 py-2 font-medium">Employee MTD (RM)</td>
//                           <td className="px-4 py-2 text-center">{fmt(row.epf_employee)}</td>
//                           <td className="px-4 py-2 text-center">{fmt(row.socso_employee)}</td>
//                           <td className="px-4 py-2 text-center">{fmt(row.eis_employee)}</td>
//                         </tr>
//                         <tr className="border-t border-gray-100">
//                           <td className="px-4 py-2 font-medium">Employer MTD (RM)</td>
//                           <td className="px-4 py-2 text-center">{fmt(row.epf_employer)}</td>
//                           <td className="px-4 py-2 text-center">{fmt(row.socso_employer)}</td>
//                           <td className="px-4 py-2 text-center">{fmt(row.eis_employer)}</td>
//                         </tr>
//                         <tr className="border-t border-gray-100">
//                           <td className="px-4 py-2 font-medium">Employee YTD (RM)</td>
//                           <td className="px-4 py-2 text-center">{fmt(ytd.epfEmp)}</td>
//                           <td className="px-4 py-2 text-center">{fmt(ytd.socsoEmp)}</td>
//                           <td className="px-4 py-2 text-center">{fmt(ytd.eisEmp)}</td>
//                         </tr>
//                         <tr className="border-t border-gray-100">
//                           <td className="px-4 py-2 font-medium">Employer YTD (RM)</td>
//                           <td className="px-4 py-2 text-center">{fmt(ytd.epfEmpr)}</td>
//                           <td className="px-4 py-2 text-center">{fmt(ytd.socsoEmpr)}</td>
//                           <td className="px-4 py-2 text-center">{fmt(ytd.eisEmpr)}</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>

//                   <div className="grid grid-cols-2 gap-0 border-t border-gray-200">
//                     <div className="px-4 py-2 text-[12px] font-semibold">Income Tax PCB</div>
//                     <div className="px-4 py-2 text-[12px]">{fmt(row.pcb)}</div>
//                     <div className="px-4 py-2 text-[12px] font-semibold border-t border-gray-100">PCB YTD</div>
//                     <div className="px-4 py-2 text-[12px] border-t border-gray-100">{fmt(ytd.pcbYtd)}</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="pt-6 pb-8 text-center text-[11px] text-gray-500">
//                 <div>This payslip is computer-generated and does not require a signature.</div>
//                 <div className="text-gray-400 mt-1">
//                   Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()} • Employee #{row.employee_id}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div> 
//     </div>
//   );
// }


'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Download, Printer, ChevronDown, Calendar, FileBarChart2, Eye, EyeOff, X, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from "../config";

/* ================= Types ================= */
export type PayslipItemType = 'Earning' | 'Deduction' | 'Statutory' | 'Employer Contribution';

export interface PayslipItem {
  id: number;
  payroll_id?: number;
  label: string;
  amount: number | string;
  type: PayslipItemType | string;
  origin?: string | null;
}

export interface EmployerContribution {
  id?: number;
  payroll_id?: number;
  label?: string;
  amount?: number | string;
  type?: 'Employer Contribution';
  created_at?: string;
}

/** New API blocks */
interface CompanyInfo {
  id?: number;
  name?: string | null;
  address?: string | null;
  registration_no?: string | null;
  epf_no?: string | null;
  socso_no?: string | null;
  tax_no?: string | null;
}

interface EmployeeProfile {
  id?: number;
  name?: string | null;
  employee_no?: string | null;
  ic_passport?: string | null;
  department?: string | null;
  position?: string | null;
  currency?: string | null;
  photo_url?: string | null;
}

interface BankStatutory {
  bank_name?: string | null;
  account_no?: string | null;
  epf_no?: string | null;
  socso_no?: string | null;
  tax_ref_no?: string | null;
  payroll_period_label?: string | null;
}

export interface PayrollRow {
  id: number;
  period_year: number;
  period_month: number;
  employee_id: number;

  /** legacy flat fields kept for backward compatibility */
  employee_name: string;
  employee_no?: string | null;
  ic_passport_no?: string | null;
  department_name?: string | null;
  position?: string | null;
  bank_name?: string | null;
  bank_account_no?: string | null;
  epf_number?: string | null;
  socso_number?: string | null;
  tax_ref_no?: string | null;

  /** new structured blocks */
  company?: CompanyInfo | null;
  employee_profile?: EmployeeProfile | null;
  bank_statutory?: BankStatutory | null;

  basic_salary: number | string;
  total_allowance: number | string;
  gross_salary: number | string;
  total_deduction: number | string;

  epf_employee: number | string;
  epf_employer: number | string;
  socso_employee: number | string;
  socso_employer: number | string;
  eis_employee: number | string;
  eis_employer: number | string;
  pcb: number | string;
  net_salary: number | string;

  status_code: string; // e.g., 'PAID'
  payslip_items: PayslipItem[];
  employer_contributions?: EmployerContribution[];
}

/* ================= Helpers ================= */
const FALLBACK_COMPANY_NAME = 'PROSPER NETWORK SDN BHD';
const FALLBACK_COMPANY_ADDR = '55100 Kuala Lumpur, Federal Territory of Kuala Lumpur';

const toMYR = (n: number) => n.toLocaleString('en-MY', { style: 'currency', currency: 'MYR' });
const num = (s: string | number | null | undefined) => {
  const v = typeof s === 'string' ? parseFloat(s) : (s ?? 0);
  return Number.isFinite(v) ? Number(v) : 0;
};
const monthName = (m: number) =>
  ['', 'January','February','March','April','May','June','July','August','September','October','November','December'][m] ?? String(m);

function monthsOfYear(year: number) {
  return Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    return { year, month: m, key: `${year}-${String(m).padStart(2,'0')}`, label: `${monthName(m)} ${year}` };
  });
}

function pxPerMM() {
  const probe = document.createElement('div');
  probe.style.width = '100mm';
  probe.style.height = '0';
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  document.body.appendChild(probe);
  const px = probe.offsetWidth / 100;
  probe.remove();
  return px;
}

/** Compute a uniform scale so the payslip fits inside one A4 page box */
function setPrintScaleToFit(el: HTMLElement, marginMM = 0) {
  const mm = pxPerMM();
  const pageW = (210 - 2 * marginMM) * mm;
  const pageH = (297 - 2 * marginMM) * mm;

  const prev = document.documentElement.style.getPropertyValue('--print-scale');
  document.documentElement.style.setProperty('--print-scale', '1');

  const contentW = el.scrollWidth;
  const contentH = el.scrollHeight;

  const scale = Math.min(pageW / contentW, pageH / contentH, 1);
  document.documentElement.style.setProperty('--print-scale', String(scale || 1));

  if (!prev) return () => document.documentElement.style.removeProperty('--print-scale');
  return () => document.documentElement.style.setProperty('--print-scale', prev);
}

function lastNMonths(n = 6): string[] {
  const out: string[] = [];
  const now = new Date();
  let y = now.getFullYear();
  let m = now.getMonth() + 1;
  for (let i = 0; i < n; i++) {
    out.unshift(`${y}-${String(m).padStart(2,'0')}`);
    m -= 1;
    if (m === 0) { m = 12; y -= 1; }
  }
  return out;
}

/* ================= Page ================= */
export default function PayslipsPage() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<PayrollRow[]>([]);

  const currentYear = new Date().getFullYear();
  const periodOptions = useMemo(() => monthsOfYear(currentYear), [currentYear]);
  const [selectedKey, setSelectedKey] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,'0')}`;
  });

  const selectedRow: PayrollRow | null = useMemo(() => {
    const [yy, mm] = selectedKey.split('-').map(Number);
    return rows.find(r => r.period_year === yy && r.period_month === mm) ?? null;
  }, [rows, selectedKey]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedForId, setGeneratedForId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const slipRef = useRef<HTMLDivElement | null>(null);
  const [hideAmounts, setHideAmounts] = useState(true);

  const EMPLOYEE_ID = 143;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/payroll/employee/${EMPLOYEE_ID}?status=PAID`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: PayrollRow[] = await res.json();
        setRows((data || []).filter(d => d.status_code === 'PAID'));
      } catch (e: any) {
        toast.error(e?.message || 'Failed to load payslips');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => setGeneratedForId(null), [selectedKey]);

  const historyKeys6 = useMemo(() => lastNMonths(6), []);
  const historySeries = useMemo(() => {
    const map = new Map<string, { gross: number; net: number; ded: number }>();
    for (const k of historyKeys6) map.set(k, { gross: 0, net: 0, ded: 0 });
    rows.forEach(r => {
      const k = `${r.period_year}-${String(r.period_month).padStart(2,'0')}`;
      if (map.has(k)) {
        map.set(k, {
          gross: num(r.gross_salary),
          net: num(r.net_salary),
          ded: num(r.total_deduction) + num(r.epf_employee) + num(r.socso_employee) + num(r.eis_employee) + num(r.pcb),
        });
      }
    });
    return historyKeys6.map(k => ({ key: k, ...map.get(k)! }));
  }, [rows, historyKeys6]);

  const maxGross = useMemo(() => Math.max(...historySeries.map(d => d.gross), 1), [historySeries]);
  const maxDed   = useMemo(() => Math.max(...historySeries.map(d => d.ded), 1), [historySeries]);

  const ytd = useMemo(() => {
    const y = currentYear;
    const list = rows.filter(r => r.period_year === y);
    return {
      year: y,
      gross: list.reduce((s, r) => s + num(r.gross_salary), 0),
      net: list.reduce((s, r) => s + num(r.net_salary), 0),
      epfEmp: list.reduce((s, r) => s + num(r.epf_employee), 0),
      epfEmpr: list.reduce((s, r) => s + num(r.epf_employer), 0),
      socsoEmp: list.reduce((s, r) => s + num(r.socso_employee), 0),
      socsoEmpr: list.reduce((s, r) => s + num(r.socso_employer), 0),
      eisEmp: list.reduce((s, r) => s + num(r.eis_employee), 0),
      eisEmpr: list.reduce((s, r) => s + num(r.eis_employer), 0),
      pcb: list.reduce((s, r) => s + num(r.pcb), 0),
      slips: list.length,
    };
  }, [rows, currentYear]);

  const fmt = (n: number | string) => hideAmounts ? '••••' : toMYR(num(n));
  const fmtKpi = (n: number | string) => hideAmounts ? '••••' : toMYR(num(n));

  const displayName = useMemo(() => {
    const ep = selectedRow?.employee_profile;
    if (ep?.name) return ep.name;
    return selectedRow?.employee_name || rows[0]?.employee_name || '—';
  }, [selectedRow, rows]);

  const currentMonthKey = useMemo(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2,'0')}`;
  }, []);
  const currentMonthReleased = useMemo(() => {
    const r = rows.find(rr => `${rr.period_year}-${String(rr.period_month).padStart(2,'0')}` === currentMonthKey);
    return !!r;
  }, [rows, currentMonthKey]);

  const lastSlip = useMemo(() => {
    if (!rows.length) return null;
    const sorted = [...rows].sort((a, b) =>
      a.period_year === b.period_year ? b.period_month - a.period_month : b.period_year - a.period_year);
    return sorted[0];
  }, [rows]);

  const handleGenerate = () => {
    if (!selectedRow) return;
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedForId(selectedRow.id);
      setIsGenerating(false);
      setModalOpen(true);
      toast.success('Payslip generated');
    }, 600);
  };

  async function handleDownloadPdf() {
    if (!slipRef.current || !selectedRow) return;

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);

      const htmlContent = `
        <div style="padding:20px;font-family:Arial, sans-serif;font-size:12px;line-height:1.4;color:#000;background:#fff;">
          <div>Use the Print button for a high-quality PDF from the on-screen payslip.</div>
        </div>
      `;

      const tempHost = document.createElement('div');
      tempHost.style.position = 'fixed';
      tempHost.style.left = '-10000px';
      tempHost.style.top = '0';
      tempHost.style.width = '0';
      tempHost.style.height = '0';
      tempHost.style.overflow = 'hidden';
      document.body.appendChild(tempHost);

      const wrapper = document.createElement('div');
      wrapper.style.setProperty('all', 'initial');
      wrapper.style.display = 'block';
      wrapper.style.background = '#ffffff';
      wrapper.style.fontFamily = 'Arial, sans-serif';
      wrapper.style.width = '794px';
      wrapper.innerHTML = htmlContent;

      tempHost.appendChild(wrapper);

      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794,
        height: wrapper.scrollHeight
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      const imgWidth = 210; // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      pdf.save(
        `Payslip_${selectedRow.employee_profile?.name || selectedRow.employee_name}_${selectedRow.period_year}-${String(selectedRow.period_month).padStart(2, '0')}.pdf`
      );

      document.body.removeChild(tempHost);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  }

  const handlePrint = () => {
    const root = slipRef.current;
    if (!root) return;

    const restore = setPrintScaleToFit(root, 0);

    const before = () => setPrintScaleToFit(root, 0);
    const after  = () => restore?.();

    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        window.removeEventListener('beforeprint', before);
        window.removeEventListener('afterprint', after);
        restore?.();
      }, 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 lg:px-8">
      {/* HEADER */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Payslips</h1>
            <p className="text-gray-600 mt-1">Welcome, {displayName}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHideAmounts(h => !h)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              title={hideAmounts ? 'Show amounts' : 'Hide amounts'}
            >
              {hideAmounts ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{hideAmounts ? 'View amounts' : 'Hide amounts'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-xs text-gray-500 mb-1">YTD Net ({ytd.year})</div>
          <div className="text-xl font-semibold text-gray-900">{fmtKpi(ytd.net)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-xs text-gray-500 mb-1">YTD Gross</div>
          <div className="text-xl font-semibold text-gray-900">{fmtKpi(ytd.gross)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-xs text-gray-500 mb-1">YTD EPF (Employee)</div>
          <div className="text-xl font-semibold text-gray-900">{fmtKpi(ytd.epfEmp)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-xs text-gray-500 mb-1">Current Month Released</div>
          <div className={`text-sm font-medium inline-flex items-center px-2 py-1 rounded-full ${currentMonthReleased ? 'text-green-700 bg-green-50' : 'text-amber-700 bg-amber-50'}`}>
            {currentMonthReleased ? 'Yes' : 'Not yet'}
          </div>
          {lastSlip && (
            <div className="text-xs text-gray-500 mt-2">
              Last slip: {monthName(lastSlip.period_month)} {lastSlip.period_year}
            </div>
          )}
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Gross vs Net (last 6 months)</h3>
            <div className="text-xs text-gray-500">Values {hideAmounts ? 'hidden' : 'shown'}</div>
          </div>
          <div className="h-48">
            <div className="flex items-end h-full gap-2">
              {historySeries.map(d => {
                const [yy, mm] = d.key.split('-').map(Number);
                const grossH = Math.round((d.gross / maxGross) * 100);
                const netH   = Math.round((d.net / maxGross) * 100);
                return (
                  <div key={d.key} className="flex-1 flex flex-col items-center">
                    <div className="flex items-end gap-1 w-full h-36">
                      <div className="flex-1 bg-blue-200 rounded-t-md" style={{ height: `${grossH}%` }} title={hideAmounts ? 'Gross: hidden' : `Gross: ${toMYR(d.gross)}`} />
                      <div className="flex-1 bg-blue-500 rounded-t-md" style={{ height: `${netH}%` }} title={hideAmounts ? 'Net: hidden' : `Net: ${toMYR(d.net)}`} />
                    </div>
                    <div className="mt-1 text-[10px] text-gray-500 whitespace-nowrap">{monthName(mm).slice(0,3)} {String(yy).slice(2)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Total Deductions (last 6 months)</h3>
            <div className="text-xs text-gray-500">Values {hideAmounts ? 'hidden' : 'shown'}</div>
          </div>
          <div className="h-48">
            <div className="flex items-end h-full gap-2">
              {historySeries.map(d => {
                const [yy, mm] = d.key.split('-').map(Number);
                const h = Math.round((d.ded / maxDed) * 100);
                return (
                  <div key={d.key} className="flex-1 flex flex-col items-center">
                    <div className="w-full h-36 bg-indigo-200 rounded-t-md" style={{ height: `${h}%` }} title={hideAmounts ? 'Hidden' : `${toMYR(d.ded)}`} />
                    <div className="mt-1 text-[10px] text-gray-500 whitespace-nowrap">{monthName(mm).slice(0,3)} {String(yy).slice(2)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Pay Period</label>
            <div className="relative">
              <select
                className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                value={selectedKey}
                onChange={e => setSelectedKey(e.target.value)}
                disabled={loading || isGenerating}
              >
                {periodOptions.map(p => {
                  const available = rows.some(r => r.period_year === p.year && r.period_month === p.month);
                  return (
                    <option key={p.key} value={p.key}>
                      {p.label} {available ? '' : '(Not available)'}
                    </option>
                  );
                })}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            {!selectedRow && (
              <div className="mt-2 inline-flex items-center text-sm text-amber-700 bg-amber-50 px-2 py-1 rounded">
                <AlertCircle className="w-4 h-4 mr-1" /> Payslip not available for this period.
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 border border-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
              onClick={handleGenerate}
              disabled={!selectedRow || isGenerating}
              title="Generate the payslip (opens modal)"
            >
              <FileBarChart2 className="w-4 h-4" />
              <span>Generate Payslip</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && selectedRow && generatedForId === selectedRow.id && (
        <PayslipModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          refEl={slipRef}
          row={selectedRow}
          hideAmounts={hideAmounts}
          ytd={{
            epfEmp: ytd.epfEmp, epfEmpr: ytd.epfEmpr,
            socsoEmp: ytd.socsoEmp, socsoEmpr: ytd.socsoEmpr,
            eisEmp: ytd.eisEmp, eisEmpr: ytd.eisEmpr, pcbYtd: ytd.pcb
          }}
          onPrint={handlePrint}
          onDownload={handleDownloadPdf}
        />
      )}

      {/* PRINT + scrollbars */}
      <style jsx global>{`
      @media print {
        @page { size: 210mm 297mm; margin: 0; }
        body { margin: 0 !important; }
        body * { visibility: hidden !important; }
        #payslip-print-root, #payslip-print-root * { visibility: visible !important; }
        #payslip-print-root {
          position: fixed;
          left: 0; top: 0;
          width: calc(210mm / var(--print-scale, 1));
          height: calc(297mm / var(--print-scale, 1));
          transform-origin: top left;
          transform: scale(var(--print-scale, 1));
          margin: 0 !important; padding: 0 !important;
          border: 0 !important; box-shadow: none !important;
          overflow: hidden !important;
          page-break-before: avoid;
          page-break-after:  avoid;
          page-break-inside: avoid;
        }
      }
      `}</style>
    </div>
  );
}

/* ================= Modal + Payslip Template ================= */
function PayslipModal({
  isOpen, onClose, refEl, row, hideAmounts, ytd, onPrint, onDownload
}: {
  isOpen: boolean;
  onClose: () => void;
  refEl: React.RefObject<HTMLDivElement | null>;
  row: PayrollRow;
  hideAmounts: boolean;
  ytd: { epfEmp: number; epfEmpr: number; socsoEmp: number; socsoEmpr: number; eisEmp: number; eisEmpr: number; pcbYtd: number; };
  onPrint: () => void;
  onDownload: () => void;
}) {
  React.useEffect(() => {
    if (isOpen) {
      const { style } = document.documentElement;
      const prev = style.overflow;
      style.overflow = 'hidden';
      return () => { style.overflow = prev; };
    }
  }, [isOpen]);
  if (!isOpen) return null;

  const fmt = (n: number | string) => hideAmounts ? '••••' : toMYR(num(n));
  const Detail: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
    <div className="flex items-center py-1">
      <div className="w-44 text-[12px] text-gray-600">{label}</div>
      <div className={`text-[12px] font-medium ${hideAmounts ? 'text-gray-400' : 'text-gray-900'}`}>
        {hideAmounts ? (typeof value === 'number' ? '••••' : (value ?? '—')) : (value ?? '—')}
      </div>
    </div>
  );

  const EMP = row.employee_profile || {};
  const BNK = row.bank_statutory || {};
  const CMP = row.company || {};

  const displayStatus = row.status_code || 'PAID';

  const earnings   = row.payslip_items.filter(i => String(i.type).toLowerCase() === 'earning');
  const deductions = row.payslip_items.filter(i => String(i.type).toLowerCase() === 'deduction');

  // ---- Totals and derived rows for the new layout
  const totalEarnings = earnings.reduce((s, i) => s + num(i.amount), 0);
  const totalNonStatDeduction = deductions.reduce((s, i) => s + num(i.amount), 0);
  const totalStatutory = num(row.epf_employee) + num(row.socso_employee) + num(row.eis_employee) + num(row.pcb);
  const totalDeductionAll = totalNonStatDeduction + totalStatutory;

  
  const employerContribs = (row.employer_contributions?.length ? row.employer_contributions : [
    { label: 'EPF Employer', amount: row.epf_employer },
    { label: 'SOCSO Employer', amount: row.socso_employer },
    { label: 'EIS Employer', amount: row.eis_employer },
  ]) as EmployerContribution[];
const totalEmployerDeduction = employerContribs.reduce((s, c) => s + num(c.amount), 0);

  const employeeDeductionItems = [
    { label: 'EPF',   amount: row.epf_employee },
    { label: 'SOCSO', amount: row.socso_employee },
    { label: 'EIS',   amount: row.eis_employee },
    { label: 'PCB',   amount: row.pcb },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <button aria-label="Close overlay" className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-[98vw] max-w-[980px] h-[96vh] md:h-auto md:max-h-[92vh] bg-white rounded-none md:rounded-xl shadow-2xl flex flex-col pointer-events-auto"
      >
        <div className="sticky top-0 z-10 px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
          <div className="font-semibold text-gray-900">
            Payslip • {BNK.payroll_period_label || `${monthName(row.period_month)} ${row.period_year}`}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onPrint} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50">
              <Printer className="w-4 h-4" /><span>Print</span>
            </button>
            <button onClick={onDownload} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              <Download className="w-4 h-4" /><span>Download PDF</span>
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Close payslip modal">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto thin-scrollbar p-4 md:p-6 bg-white" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div
            id="payslip-print-root"
            ref={refEl}
            className="mx-auto text-gray-900 rounded-xl border border-gray-200 overflow-hidden bg-white"
            style={{ width: '210mm', minHeight: '297mm' }}
          >
            {/* Header */}
            <div className="px-8 pt-8 pb-5 border-b border-gray-200 bg-[#f1f5f9]">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div>
                    <h2 className="text-xl font-extrabold tracking-wide text-gray-900">
                      {CMP.name || FALLBACK_COMPANY_NAME}
                    </h2>
                    <div className="text-[12px] text-gray-600">
                      {CMP.address || FALLBACK_COMPANY_ADDR}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] uppercase text-gray-500">Payroll Period</div>
                  <div className="text-[15px] font-semibold">
                    {BNK.payroll_period_label || `${monthName(row.period_month)} ${row.period_year}`}
                  </div>
                  <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    displayStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>{displayStatus}</div>
                </div>
              </div>
            </div>

            {/* Employee + Bank & Statutory */}
            <div className="px-8 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-[12px] font-medium text-gray-700 uppercase tracking-wider mb-2">Employee</h3>
                <Detail label="Name" value={EMP.name ?? row.employee_name} />
                <Detail label="Employee No." value={EMP.employee_no ?? row.employee_no ?? '—'} />
                <Detail label="IC/Passport No." value={EMP.ic_passport ?? row.ic_passport_no ?? '—'} />
                <Detail label="Department" value={EMP.department ?? row.department_name ?? '—'} />
                <Detail label="Position" value={EMP.position ?? row.position ?? '—'} />
                <Detail label="Currency" value={EMP.currency ?? 'MYR'} />
              </div>

              {/* Bank & Statutory */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-[12px] font-medium text-gray-700 uppercase tracking-wider mb-2">Bank & Statutory</h3>
                <Detail label="Bank Name" value={BNK.bank_name ?? row.bank_name ?? '—'} />
                <Detail label="Account Number" value={BNK.account_no ?? row.bank_account_no ?? '—'} />
                <Detail label="EPF Number" value={BNK.epf_no ?? row.epf_number ?? '—'} />
                <Detail label="SOCSO Number" value={BNK.socso_no ?? row.socso_number ?? '—'} />
                <Detail label="Tax Ref No." value={BNK.tax_ref_no ?? row.tax_ref_no ?? '—'} />
                <Detail label="Payroll Date (Period)" value={BNK.payroll_period_label || `${monthName(row.period_month)} ${row.period_year}`} />
              </div>
            </div>

            {/* Earnings / Deductions (non-statutory only) */}
            <div className="px-8 pt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Earnings */}
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 py-2.5 bg-gray-50 font-semibold">Earnings</div>
                  <div>
                    {earnings.length === 0 && <div className="px-4 py-3 text-sm text-gray-500">No earnings</div>}
                    {earnings.map(i => (
                      <div key={i.id} className="px-4 py-2.5 flex items-center justify-between border-t border-gray-100">
                        <span className="text-[13px] text-gray-700">{i.label}</span>
                        <span className={`text-[13px] font-medium ${hideAmounts ? 'text-gray-400' : 'text-gray-900'}`}>{fmt(i.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deductions (exclude statutory) */}
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 py-2.5 bg-gray-50 font-semibold">Deductions</div>
                  <div>
                    {deductions.length === 0 && (
                      <div className="px-4 py-3 text-sm text-gray-500">No deductions</div>
                    )}
                    {deductions.map(i => (
                      <div key={i.id} className="px-4 py-2.5 flex items-center justify-between border-t border-gray-100">
                        <span className="text-[13px] text-gray-700">{i.label}</span>
                        <span className={`text-[13px] font-medium ${hideAmounts ? 'text-gray-400' : 'text-gray-900'}`}>
                          {fmt(i.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Combined totals row across the two columns */}
              <div className="mt-0 border-t-2 border-gray-300 bg-gray-50 px-4 py-2.5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-gray-800">Total Earnings</span>
                  <span className="text-[13px] font-semibold text-blue-600">{fmt(totalEarnings)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-gray-800">Total Deduction</span>
                  <span className={`text-[13px] font-semibold ${hideAmounts ? 'text-gray-400' : 'text-red-600'}`}>
                    {fmt(totalDeductionAll)}
                  </span>
                </div>
              </div>




{/* Employer Deduction + Employee Deduction (statutory) */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
  {/* Employer Deduction */}
  <div className="rounded-lg border border-gray-200 overflow-hidden">
    <div className="px-4 py-2.5 bg-gray-50 font-semibold">Employer Deduction</div>
    <div>
      {employerContribs.map((c, idx) => (
        <div
          key={`${c.label}-${idx}`}
          className="px-4 py-2.5 flex items-center justify-between border-t border-gray-100"
        >
          <span className="text-[13px] text-gray-700">{c.label}</span>
          <span className={`text-[13px] font-medium ${hideAmounts ? 'text-gray-400' : 'text-gray-900'}`}>
            {fmt(c.amount ?? 0)}
          </span>
        </div>
      ))}
      {/* removed per-card "Total Employer Deduction" footer */}
    </div>
  </div>

  {/* Employee Deduction (Statutory only) */}
  <div className="rounded-lg border border-gray-200 overflow-hidden">
    <div className="px-4 py-2.5 bg-gray-50 font-semibold">Employee Deduction</div>
    <div>
      {employeeDeductionItems.map((i, idx) => (
        <div
          key={`${i.label}-${idx}`}
          className="px-4 py-2.5 flex items-center justify-between border-t border-gray-100"
        >
          <span className="text-[13px] text-gray-700">{i.label}</span>
          <span className={`text-[13px] font-medium ${hideAmounts ? 'text-gray-400' : 'text-gray-900'}`}>
            {fmt(i.amount)}
          </span>
        </div>
      ))}
      {/* removed per-card "Total Employee Deduction" footer */}
    </div>
  </div>
</div>

{/* Combined totals row across the two columns */}
<div className="mt-0 border-t-2 border-gray-300 bg-gray-50 px-4 py-2.5 grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="flex items-center justify-between">
    <span className="text-[13px] font-semibold text-gray-800">Total Employer Deduction</span>
    <span className="text-[13px] font-semibold text-blue-600">
      {fmt(totalEmployerDeduction)}
    </span>
  </div>
  <div className="flex items-center justify-between">
    <span className="text-[13px] font-semibold text-gray-800">Total Employee Deduction</span>
    <span className={`text-[13px] font-semibold ${hideAmounts ? 'text-gray-400' : 'text-gray-900'}`}>
      {fmt(totalStatutory)}
    </span>
  </div>
</div>


{/* Salary Summary (moved to bottom) */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
  <div className="rounded-lg border border-gray-200 p-4">
    <div className="text-[12px] text-gray-600">Gross Salary</div>
    <div className={`text-[16px] font-semibold ${hideAmounts ? 'text-gray-400' : 'text-gray-900'}`}>{fmt(row.gross_salary)}</div>
  </div>
  <div className="rounded-lg border border-gray-200 p-4">
    <div className="text-[12px] text-gray-600">Total Deductions</div>
    <div className={`text-[16px] font-semibold ${hideAmounts ? 'text-gray-400' : 'text-red-600'}`}>
      {fmt(totalDeductionAll)}
    </div>
  </div>
  <div className="rounded-lg border border-gray-200 p-4 bg-blue-50">
    <div className="text-[12px] text-blue-800 font-medium">Net Salary</div>
    <div className={`text-[18px] font-bold ${hideAmounts ? 'text-gray-400' : 'text-blue-700'}`}>{fmt(row.net_salary)}</div>
  </div>
</div>

              {/* Footer */}
              <div className="pt-6 pb-8 text-center text-[11px] text-gray-500">
                <div>This payslip is computer-generated and does not require a signature.</div>
                <div className="text-gray-400 mt-1">
                  Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()} • Employee #{row.employee_id}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
