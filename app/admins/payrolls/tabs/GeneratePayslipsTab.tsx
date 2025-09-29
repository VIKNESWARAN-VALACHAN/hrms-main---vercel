// "use client";

// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { toast, Toaster } from "react-hot-toast";
// import { Calendar, Clock, FileText, Search, X } from "lucide-react";
// import { API_BASE_URL } from "../../../config";

// /* =============================================================
//    Types
//    ============================================================= */

// type PayrollApiResponse = {
//   total: number;
//   page: number;
//   limit: number;
//   data: PayrollItem[];
// };

// type PayrollItem = {
//   payroll: {
//     payroll_id: number;
//     employee_id: number;
//     employee_name: string;
//     employee_no: string;
//     department_name: string;
//     position: string;
//     company_name: string;
//     ic_passport_no: string;
//     bank_name: string;
//     bank_code: string | null;
//     bank_account_no: string;
//     bank_account_name: string;
//     net_salary: string;
//     gross_salary: string;
//     status_code: string; // FINALIZED, DRAFT, RELEASED etc.
//     period_month?: number;
//     period_year?: number;
//   };
// };

// type Row = {
//   id: number; // payroll_id
//   employee_id: number;
//   employee_no: string;
//   employee_name: string;
//   department_name: string;
//   position: string;
//   gross_salary: number;
//   net_salary: number;
//   bank_name: string;
//   bank_code: string | null;
//   bank_account_no: string;
//   status_code: string;
//   period_month: number;
//   period_year: number;
// };

// type ReleaseMode = "now" | "schedule";

// type PayslipRelease = {
//   id: number;
//   created_at: string; // ISO
//   visible_from: string; // ISO
//   visible_until?: string | null;
//   total_payslips: number;
//   status: "scheduled" | "released" | "canceled";
//   payroll_ids: number[];
// };

// /* =============================================================
//    Helpers
//    ============================================================= */

// function fmtMoney(n: number) {
//   return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
// }

// function loadFromLocalStorage<T>(key: string, fallback: T): T {
//   try {
//     const raw = localStorage.getItem(key);
//     if (!raw) return fallback;
//     return JSON.parse(raw) as T;
//   } catch {
//     return fallback;
//   }
// }

// function saveToLocalStorage<T>(key: string, value: T) {
//   try {
//     localStorage.setItem(key, JSON.stringify(value));
//   } catch {}
// }

// function fmtDateTime(iso?: string | null) {
//   if (!iso) return "-";
//   try {
//     return new Date(iso).toLocaleString();
//   } catch {
//     return "-";
//   }
// }

// /* =============================================================
//    Component
//    ============================================================= */

// export default function GeneratePayslipsTab() {
//   // data
//   const [rows, setRows] = useState<Row[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

//   // filters / search
//   const [search, setSearch] = useState<string>("");
//   const [period, setPeriod] = useState<string>("all"); // "YYYY-MM" or "all"
//   const [statusFilter, setStatusFilter] = useState<"all" | "FINALIZED" | "DRAFT" | "RELEASED">("all");

//   // selection
//   const [selected, setSelected] = useState<number[]>([]);

//   // modal quick-view (view upcoming/history any time)
//   const [modal, setModal] = useState<"upcoming" | "history" | null>(null);

//   // wizard step control (3 = Summary)
//   const [step, setStep] = useState<1 | 2 | 3>(1);

//   // schedule
//   const [mode, setMode] = useState<ReleaseMode>("schedule");
//   const [visibleFrom, setVisibleFrom] = useState<string>(""); // datetime-local
//   const [visibleUntil, setVisibleUntil] = useState<string>(""); // datetime-local

//   // releases (persisted in localStorage)
//   const [upcomingReleases, setUpcomingReleases] = useState<PayslipRelease[]>([]);
//   const [releaseHistory, setReleaseHistory] = useState<PayslipRelease[]>([]);

//   const reconcilerTimer = useRef<number | null>(null);

//   /* ------------------------------ data fetch ------------------------------ */
//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const url = new URL(`${API_BASE_URL}/api/payroll/adjustments`);
//       // IMPORTANT: do NOT hard-filter on FINALIZED here; let UI filter via statusFilter
//       url.searchParams.set("all_data", "true");

//       const res = await fetch(url.toString(), {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//         },
//       });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data: PayrollApiResponse = await res.json();

//       const mapped: Row[] = (data.data || []).map((it: PayrollItem) => ({
//         id: it.payroll.payroll_id,
//         employee_id: it.payroll.employee_id,
//         employee_no: it.payroll.employee_no,
//         employee_name: it.payroll.employee_name,
//         department_name: it.payroll.department_name,
//         position: it.payroll.position,
//         gross_salary: Number(it.payroll.gross_salary || 0),
//         net_salary: Number(it.payroll.net_salary || 0),
//         bank_name: it.payroll.bank_name,
//         bank_code: it.payroll.bank_code,
//         bank_account_no: it.payroll.bank_account_no,
//         status_code: it.payroll.status_code,
//         period_month: it.payroll.period_month || new Date().getMonth() + 1,
//         period_year: it.payroll.period_year || new Date().getFullYear(),
//       }));

//       setRows(mapped);
//       setLastUpdated(new Date());

//       // Tiny debug: comment in/out as needed
//       // console.log("mapped count:", mapped.length, "statuses:", Array.from(new Set(mapped.map(r => r.status_code))));
//     } catch (err) {
//       console.warn("Falling back to mock data for payslip release", err);
//       const now = new Date();
//       const mock: Row[] = Array.from({ length: 18 }).map((_, i) => ({
//         id: 1000 + i,
//         employee_id: 5000 + i,
//         employee_no: `EMP-${String(2000 + i)}`,
//         employee_name: `Employee ${i + 1}`,
//         department_name: i % 3 === 0 ? "Sales" : i % 3 === 1 ? "Engineering" : "HR",
//         position: i % 3 === 0 ? "Sales Rep" : i % 3 === 1 ? "Software Engineer" : "HR Exec",
//         gross_salary: 4500 + i * 37,
//         net_salary: 3500 + i * 31,
//         bank_name: "Public Bank",
//         bank_code: "PBBEMYKL",
//         bank_account_no: `23810${String(546600 + i)}`,
//         status_code: i % 2 === 0 ? "DRAFT" : "FINALIZED",
//         period_month: now.getMonth() + 1,
//         period_year: now.getFullYear(),
//       }));
//       setRows(mock);
//       setLastUpdated(new Date());
//       toast.success("Using mock data");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /* ------------------------------ effects ------------------------------ */
//   useEffect(() => {
//     void fetchData();

//     // load persisted releases
//     const up = loadFromLocalStorage<PayslipRelease[]>("payslip_upcoming", []);
//     const hist = loadFromLocalStorage<PayslipRelease[]>("payslip_history", []);
//     setUpcomingReleases(up);
//     setReleaseHistory(hist);
//   }, [fetchData]);

//   // auto-refresh (every 2 min)
//   useEffect(() => {
//     const t = window.setInterval(() => void fetchData(), 120_000) as unknown as number;
//     return () => window.clearInterval(t);
//   }, [fetchData]);

//   useEffect(() => {
//     saveToLocalStorage("payslip_upcoming", upcomingReleases);
//   }, [upcomingReleases]);

//   useEffect(() => {
//     saveToLocalStorage("payslip_history", releaseHistory);
//   }, [releaseHistory]);

//   useEffect(() => {
//     const tick = () => reconcileReleases();
//     tick(); // run once on mount
//     reconcilerTimer.current = window.setInterval(tick, 30_000) as unknown as number; // auto "check due"
//     return () => {
//       if (reconcilerTimer.current) window.clearInterval(reconcilerTimer.current);
//     };
//   }, [upcomingReleases]);

//   /* ------------------------------ computed ------------------------------ */
//   const periods = useMemo(() => {
//     const s = new Set<string>();
//     rows.forEach((r) => s.add(`${r.period_year}-${String(r.period_month).padStart(2, "0")}`));
//     return ["all", ...Array.from(s).sort().reverse()];
//   }, [rows]);

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     return rows.filter((r) => {
//       const matchesText =
//         !q || [r.employee_name, r.employee_no, r.department_name, r.position]
//           .some((v) => v && v.toLowerCase().includes(q));
//       const matchesPeriod =
//         period === "all" ||
//         `${r.period_year}-${String(r.period_month).padStart(2, "0")}` === period;
//       const matchesStatus = statusFilter === "all" || r.status_code === statusFilter;
//       return matchesText && matchesPeriod && matchesStatus;
//     });
//   }, [rows, search, period, statusFilter]);

//   const allSelected = useMemo(
//     () => filtered.length > 0 && selected.length === filtered.length,
//     [filtered, selected]
//   );

//   /* ------------------------------ actions ------------------------------ */
//   const toggleAll = () => {
//     if (allSelected) setSelected([]);
//     else setSelected(filtered.map((r) => r.id));
//   };

//   const toggleOne = (id: number) => {
//     setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
//   };

//   const createRelease = () => {
//     if (selected.length === 0) {
//       toast.error("Select at least one employee");
//       return;
//     }
//     if (mode === "schedule" && !visibleFrom) {
//       toast.error("Please select Visible From");
//       return;
//     }

//     const nowISO = new Date().toISOString();
//     const visibleFromISO = mode === "now" ? nowISO : new Date(visibleFrom).toISOString();
//     const visibleUntilISO = visibleUntil ? new Date(visibleUntil).toISOString() : null;

//     const release: PayslipRelease = {
//       id: Date.now(),
//       created_at: nowISO,
//       visible_from: visibleFromISO,
//       visible_until: visibleUntilISO,
//       total_payslips: selected.length,
//       status: mode === "now" ? "released" : "scheduled",
//       payroll_ids: [...selected],
//     };

//     if (release.status === "released") {
//       setReleaseHistory((h) => [release, ...h]);
//       toast.success("Payslips released to employees");
//     } else {
//       setUpcomingReleases((u) => [release, ...u]);
//       toast.success("Payslip release scheduled");
//     }

//     // go to summary page
//     setStep(3);

//     // reset selection/inputs
//     setSelected([]);
//     setVisibleFrom("");
//     setVisibleUntil("");
//   };

//   const cancelRelease = (id: number) => {
//     setUpcomingReleases((u) => u.filter((x) => x.id !== id));
//     toast.success("Scheduled release canceled");
//   };

//   // Run the "check due" logic: move any upcoming whose visible_from <= now into history as released
//   const reconcileReleases = () => {
//     if (upcomingReleases.length === 0) return;
//     const now = Date.now();
//     const remaining: PayslipRelease[] = [];
//     const moved: PayslipRelease[] = [];
//     for (const r of upcomingReleases) {
//       const due = new Date(r.visible_from).getTime();
//       if (due <= now) moved.push({ ...r, status: "released" });
//       else remaining.push(r);
//     }
//     if (moved.length > 0) {
//       setUpcomingReleases(remaining);
//       setReleaseHistory((h) => [...moved, ...h]);
//       toast.success(`${moved.length} scheduled release(s) executed`);
//     }
//   };

//   /* =============================================================
//      Small Components
//      ============================================================= */

//   const ReleaseCard: React.FC<{
//     title?: string;
//     release: PayslipRelease;
//     action?: React.ReactNode;
//     badgeClass?: string;
//   }> = ({ title, release, action, badgeClass }) => (
//     <div className="border rounded-lg p-4 flex flex-col gap-2 bg-base-100">
//       {title && <div className="font-semibold">{title}</div>}
//       <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
//         <div>
//           <div className="opacity-60 text-xs">Release ID</div>
//           <div className="font-medium">{release.id}</div>
//         </div>
//         <div>
//           <div className="opacity-60 text-xs">Created</div>
//           <div>{fmtDateTime(release.created_at)}</div>
//         </div>
//         <div>
//           <div className="opacity-60 text-xs">Visible From</div>
//           <div>{fmtDateTime(release.visible_from)}</div>
//         </div>
//         <div>
//           <div className="opacity-60 text-xs">Visible Until</div>
//           <div>{fmtDateTime(release.visible_until ?? null)}</div>
//         </div>
//         <div>
//           <div className="opacity-60 text-xs">Total Payslips</div>
//           <div>{release.total_payslips}</div>
//         </div>
//         <div>
//           <div className="opacity-60 text-xs">Status</div>
//           <div>
//             <span className={`badge ${badgeClass ?? ""}`}>{release.status}</span>
//           </div>
//         </div>
//         {action && <div className="ml-auto">{action}</div>}
//       </div>
//     </div>
//   );

//   /* =============================================================
//      UI
//      ============================================================= */

//   return (
//     <div className="space-y-6">
//       <Toaster position="top-right" />

//       {/* Title + actions */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-semibold flex items-center gap-2">
//           <FileText className="w-6 h-6" /> Generate Payslips
//         </h1>
//         <div className="flex items-center gap-2">
//           <button className="btn btn-ghost btn-sm" onClick={() => setModal("upcoming")}>
//             Upcoming ({upcomingReleases.length})
//           </button>
//           <button className="btn btn-ghost btn-sm" onClick={() => setModal("history")}>
//             History ({releaseHistory.length})
//           </button>
//         </div>
//       </div>

//       {/* Stepper (hide on Summary) */}
//       {step !== 3 && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <div
//             className={`card shadow-sm border ${step === 1 ? "ring-1 ring-blue-600 border-blue-600 bg-blue-50/40" : "opacity-80"}`}
//             onClick={() => setStep(1)}
//           >
//             <div className="card-body py-4">
//               <div className="flex items-center gap-3">
//                 <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-semibold">1</span>
//                 <div>
//                   <div className="font-semibold">Choose Employees</div>
//                   <div className="text-xs opacity-70">Pick who will receive their payslip</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div
//             className={`card shadow-sm border ${step === 2 ? "ring-1 ring-blue-600 border-blue-600 bg-blue-50/40" : selected.length === 0 ? "opacity-50 pointer-events-none" : "opacity-80 cursor-pointer"}`}
//             onClick={() => selected.length > 0 && setStep(2)}
//           >
//             <div className="card-body py-4">
//               <div className="flex items-center gap-3">
//                 <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>2</span>
//                 <div>
//                   <div className="font-semibold">Schedule Release</div>
//                   <div className="text-xs opacity-70">Set visibility date and time</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Step 1 */}
//       {step === 1 && (
//         <div className="card bg-base-100 shadow">
//           <div className="card-body">
//             <div className="flex items-center gap-2 mb-2">
//               <span className="badge badge-primary">1</span>
//               <h2 className="card-title">Choose Employees</h2>
//             </div>

//             <div className="flex flex-col md:flex-row md:items-end gap-3 mb-4">
//               <div className="form-control w-full md:max-w-md">
//                 <label className="label"><span className="label-text">Search</span></label>
//                 <div className="relative">
//                   <input
//                     className="input input-bordered w-full pl-9"
//                     placeholder="Search by name, number, department, or position"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                   />
//                   <Search className="w-4 h-4 absolute left-3 top-3.5 opacity-60" />
//                 </div>
//               </div>

//               <div className="form-control w-full md:max-w-xs">
//                 <label className="label"><span className="label-text">Period</span></label>
//                 <select className="select select-bordered" value={period} onChange={(e) => setPeriod(e.target.value)}>
//                   {periods.map((p: string) => (
//                     <option key={p} value={p}>
//                       {p === "all" ? "All" : `${p.split("-")[1]}/${p.split("-")[0]}`}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="form-control w-full md:max-w-xs">
//                 <label className="label"><span className="label-text">Status</span></label>
//                 <select
//                   className="select select-bordered"
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value as any)}
//                 >
//                   <option value="all">All</option>
//                   <option value="FINALIZED">FINALIZED</option>
//                   <option value="DRAFT">DRAFT</option>
//                   <option value="RELEASED">RELEASED</option>
//                 </select>
//               </div>

//               <div className="flex-1" />
//               <div className="text-sm md:self-center">
//                 Selected {selected.length} of {filtered.length}
//               </div>
//             </div>

//             <div className="overflow-x-auto border rounded-lg">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th className="w-10">
//                       <input type="checkbox" className="checkbox" checked={allSelected} onChange={toggleAll} />
//                     </th>
//                     <th>ID</th>
//                     <th>Employee</th>
//                     <th>Department</th>
//                     <th>Position</th>
//                     <th>Gross</th>
//                     <th>Net</th>
//                     <th>Bank</th>
//                     <th>Account</th>
//                     <th>Period</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loading && (
//                     <tr><td colSpan={11}><div className="py-8 text-center">Loading…</div></td></tr>
//                   )}
//                   {!loading && filtered.length === 0 && (
//                     <tr><td colSpan={11}><div className="py-8 text-center opacity-70">No rows</div></td></tr>
//                   )}
//                   {!loading && filtered.map((r: Row) => (
//                     <tr key={r.id} className="hover">
//                       <td>
//                         <input
//                           type="checkbox"
//                           className="checkbox"
//                           checked={selected.includes(r.id)}
//                           onChange={() => toggleOne(r.id)}
//                         />
//                       </td>
//                       <td>{r.id}</td>
//                       <td className="font-medium">
//                         {r.employee_name}
//                         <div className="text-xs opacity-70">{r.employee_no}</div>
//                       </td>
//                       <td>{r.department_name}</td>
//                       <td>{r.position}</td>
//                       <td>{fmtMoney(r.gross_salary)}</td>
//                       <td>{fmtMoney(r.net_salary)}</td>
//                       <td>{r.bank_name}</td>
//                       <td>{r.bank_account_no}</td>
//                       <td>{String(r.period_month).padStart(2, "0")}/{r.period_year}</td>
//                       <td>
//                         <span className={`badge ${r.status_code === "FINALIZED" ? "badge-success" : r.status_code === "DRAFT" ? "" : "badge-ghost"}`}>
//                           {r.status_code}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-4 flex items-center justify-between">
//               <button className="btn btn-outline" onClick={() => setSelected([])}>
//                 Clear Selection
//               </button>
//               <button className="btn btn-primary" disabled={selected.length === 0} onClick={() => setStep(2)}>
//                 Next: Schedule Release
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Step 2 */}
//       {step === 2 && (
//         <div className="card bg-base-100 shadow">
//           <div className="card-body">
//             <div className="flex items-center gap-2 mb-2">
//               <span className="badge badge-primary">2</span>
//               <h2 className="card-title">Schedule Release</h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Release Mode</span></label>
//                 <select className="select select-bordered" value={mode} onChange={(e) => setMode(e.target.value as ReleaseMode)}>
//                   <option value="now">Release Immediately</option>
//                   <option value="schedule">Schedule Release</option>
//                 </select>
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Visible From</span></label>
//                 <input
//                   type="datetime-local"
//                   className="input input-bordered"
//                   disabled={mode !== "schedule"}
//                   value={visibleFrom}
//                   onChange={(e) => setVisibleFrom(e.target.value)}
//                 />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Visible Until (optional)</span></label>
//                 <input
//                   type="datetime-local"
//                   className="input input-bordered"
//                   value={visibleUntil}
//                   onChange={(e) => setVisibleUntil(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="mt-4 flex flex-wrap items-center gap-3 justify-between">
//               <button className="btn" onClick={() => setStep(1)}>← Back to Step 1</button>
//               <div className="flex gap-3">
//                 {/* <button className="btn btn-outline" onClick={() => setSelected([])}>
//                   <X className="w-4 h-4" /> Clear Selection
//                 </button> */}
//                 <button className="btn btn-primary" onClick={createRelease}>
//                   <Calendar className="w-4 h-4" /> Create Release ({selected.length} employees)
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Summary page (stacked, row view) */}
//       {step === 3 && (
//         <>
//           <div className="card bg-base-100 shadow">
//             <div className="card-body">
//               <h2 className="card-title">Release Summary</h2>
//               <p className="text-sm opacity-70">
//                 Your release has been created. Review upcoming and past releases below, or open them in a quick view.
//               </p>
//               <div className="mt-4 flex gap-3">
//                 <button className="btn" onClick={() => setStep(1)}>Create Another Release</button>
//                 <button className="btn btn-outline" onClick={() => setModal("upcoming")}>View Upcoming</button>
//                 <button className="btn btn-outline" onClick={() => setModal("history")}>View History</button>
//               </div>
//             </div>
//           </div>

//           {/* Upcoming (row cards, full width) */}
//           <div className="card bg-base-100 shadow">
//             <div className="card-body">
//               <div className="flex items-center gap-2 mb-2">
//                 <span className="badge">Upcoming Releases</span>
//               </div>

//               {upcomingReleases.length === 0 ? (
//                 <div className="py-6 text-center opacity-70">None</div>
//               ) : (
//                 <div className="space-y-3">
//                   {upcomingReleases.map((u) => (
//                     <ReleaseCard
//                       key={u.id}
//                       release={u}
//                       badgeClass="badge-warning"
//                       action={
//                         <button className="btn btn-xs" onClick={() => cancelRelease(u.id)}>
//                           Cancel
//                         </button>
//                       }
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* History (row cards, full width) */}
//           <div className="card bg-base-100 shadow">
//             <div className="card-body">
//               <div className="flex items-center gap-2 mb-2">
//                 <span className="badge">Release History</span>
//               </div>

//               {releaseHistory.length === 0 ? (
//                 <div className="py-6 text-center opacity-70">No history</div>
//               ) : (
//                 <div className="space-y-3">
//                   {releaseHistory.map((h) => (
//                     <ReleaseCard key={h.id} release={h} badgeClass="badge-success" />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {/* Centered Modal quick-view for Upcoming/History (viewable any time) */}
//       {modal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div className="absolute inset-0 bg-black/30" onClick={() => setModal(null)} />
//           <div className="relative bg-base-100 w-full max-w-5xl max-h-[85vh] rounded-xl shadow-2xl border overflow-hidden">
//             <div className="p-4 border-b flex items-center justify-between">
//               <h3 className="font-semibold">{modal === "upcoming" ? "Upcoming Releases" : "Release History"}</h3>
//               <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>Close</button>
//             </div>
//             <div className="p-4 overflow-auto space-y-3">
//               {modal === "upcoming" ? (
//                 upcomingReleases.length === 0 ? (
//                   <div className="py-6 text-center opacity-70">None</div>
//                 ) : (
//                   upcomingReleases.map((u) => (
//                     <ReleaseCard
//                       key={u.id}
//                       release={u}
//                       badgeClass="badge-warning"
//                       action={
//                         <button className="btn btn-xs" onClick={() => cancelRelease(u.id)}>
//                           Cancel
//                         </button>
//                       }
//                     />
//                   ))
//                 )
//               ) : releaseHistory.length === 0 ? (
//                 <div className="py-6 text-center opacity-70">No history</div>
//               ) : (
//                 releaseHistory.map((h) => (
//                   <ReleaseCard key={h.id} release={h} badgeClass="badge-success" />
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }


"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Calendar, FileText, Search } from "lucide-react";
import { API_BASE_URL } from "../../../config";

/* =============================================================
   Types
   ============================================================= */

type PayrollApiResponse = {
  total: number;
  page: number;
  limit: number;
  data: PayrollItem[];
};

type PayrollItem = {
  payroll: {
    payroll_id: number;
    employee_id: number;
    employee_name: string;
    employee_no: string;
    department_name: string;
    position: string;
    company_name: string;
    ic_passport_no: string;
    bank_name: string;
    bank_code: string | null;
    bank_account_no: string;
    bank_account_name: string;
    net_salary: string;
    gross_salary: string;
    status_code: string; // FINALIZED, DRAFT, RELEASED etc.
    period_month?: number;
    period_year?: number;
  };
};

type Row = {
  id: number; // payroll_id
  employee_id: number;
  employee_no: string;
  employee_name: string;
  department_name: string;
  position: string;
  gross_salary: number;
  net_salary: number;
  bank_name: string;
  bank_code: string | null;
  bank_account_no: string;
  status_code: string;
  period_month: number;
  period_year: number;
};

type ReleaseMode = "now" | "schedule";

type PayslipRelease = {
  id: number;
  created_at: string; // ISO
  visible_from: string; // ISO
  visible_until?: string | null;
  total_payslips: number;
  status: "scheduled" | "released" | "canceled";
  payroll_ids: number[];
  target_status: StatusCode;   // <- always 'PAID' for this flow
  last_error?: string | null;  // <- store failure reason if any
};

/* =============================================================
   Helpers
   ============================================================= */
type StatusCode = 'DRAFT' | 'ADJUST' | 'FINAL' | 'PAID' | 'HOLD' | 'VOID';

function badgeClassFor(status: string) {
  switch (status) {
    case 'FINAL': return 'badge-success';
    case 'PAID': return 'badge-primary';
    case 'ADJUST': return 'badge-warning';
    case 'HOLD': return 'badge-neutral';
    case 'VOID': return 'badge-error';
    case 'DRAFT':
    default:
      return '';
  }
}

async function updateStatusBulk(ids: number[], status: StatusCode, remark?: string) {
  if (!ids || ids.length === 0) return;
  const res = await fetch(`${API_BASE_URL}/api/payroll/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
    body: JSON.stringify({
      payroll_ids: ids,
      status_code: status,
      remarks: remark ?? `Changed via Payslip Release UI`,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `HTTP ${res.status}`);
  }
}



function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function loadFromLocalStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToLocalStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function fmtDateTime(iso?: string | null) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "-";
  }
}

/* =============================================================
   Component
   ============================================================= */

export default function GeneratePayslipsTab() {
  // data
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // filters / search
  const [search, setSearch] = useState<string>("");
  const [period, setPeriod] = useState<string>("all"); // "YYYY-MM" or "all"
  //const [statusFilter, setStatusFilter] = useState<"all" | "FINALIZED" | "DRAFT" | "RELEASED">("all");
const [statusFilter, setStatusFilter] = useState<'all' | StatusCode>('all');

  // selection
  const [selected, setSelected] = useState<number[]>([]);

  // modal quick-view (view upcoming/history any time)
  const [modal, setModal] = useState<"upcoming" | "history" | null>(null);

  // wizard step control (3 = Summary)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // schedule
  const [mode, setMode] = useState<ReleaseMode>("schedule");
  const [visibleFrom, setVisibleFrom] = useState<string>(""); // datetime-local
  const [visibleUntil, setVisibleUntil] = useState<string>(""); // datetime-local

  // releases (persisted in localStorage)
  const [upcomingReleases, setUpcomingReleases] = useState<PayslipRelease[]>([]);
  const [releaseHistory, setReleaseHistory] = useState<PayslipRelease[]>([]);

  const reconcilerTimer = useRef<number | null>(null);

  /* ------------------------------ data fetch ------------------------------ */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/api/payroll/adjustments`);
      // Do not hard-filter by status here; UI handles statusFilter
      url.searchParams.set("all_data", "true");

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: PayrollApiResponse = await res.json();

      const mapped: Row[] = (data.data || []).map((it: PayrollItem) => ({
        id: it.payroll.payroll_id,
        employee_id: it.payroll.employee_id,
        employee_no: it.payroll.employee_no,
        employee_name: it.payroll.employee_name,
        department_name: it.payroll.department_name,
        position: it.payroll.position,
        gross_salary: Number(it.payroll.gross_salary || 0),
        net_salary: Number(it.payroll.net_salary || 0),
        bank_name: it.payroll.bank_name,
        bank_code: it.payroll.bank_code,
        bank_account_no: it.payroll.bank_account_no,
        status_code: (it.payroll.status_code === 'FINALIZED' ? 'FINAL' : it.payroll.status_code) as StatusCode,
//status_code: it.payroll.status_code,
        period_month: it.payroll.period_month || new Date().getMonth() + 1,
        period_year: it.payroll.period_year || new Date().getFullYear(),
      }));

      setRows(mapped);
      setLastUpdated(new Date());
    } catch (err) {
      console.warn("Falling back to mock data for payslip release", err);
      const now = new Date();
      const mock: Row[] = Array.from({ length: 120 }).map((_, i) => ({
        id: 1000 + i,
        employee_id: 5000 + i,
        employee_no: `EMP-${String(2000 + i)}`,
        employee_name: `Employee ${i + 1}`,
        department_name: i % 3 === 0 ? "Sales" : i % 3 === 1 ? "Engineering" : "HR",
        position: i % 3 === 0 ? "Sales Rep" : i % 3 === 1 ? "Software Engineer" : "HR Exec",
        gross_salary: 4500 + i * 37,
        net_salary: 3500 + i * 31,
        bank_name: "Public Bank",
        bank_code: "PBBEMYKL",
        bank_account_no: `23810${String(546600 + i)}`,
        status_code: i % 2 === 0 ? "DRAFT" : "FINALIZED",
        period_month: now.getMonth() + 1,
        period_year: now.getFullYear(),
      }));
      setRows(mock);
      setLastUpdated(new Date());
      toast.success("Using mock data");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ------------------------------ effects ------------------------------ */
  useEffect(() => {
    void fetchData();

    // load persisted releases
    const up = loadFromLocalStorage<PayslipRelease[]>("payslip_upcoming", []);
    const hist = loadFromLocalStorage<PayslipRelease[]>("payslip_history", []);
    setUpcomingReleases(up);
    setReleaseHistory(hist);
  }, [fetchData]);

  // auto-refresh (every 2 min)
  useEffect(() => {
    const t = window.setInterval(() => void fetchData(), 120_000) as unknown as number;
    return () => window.clearInterval(t);
  }, [fetchData]);

  useEffect(() => {
    saveToLocalStorage("payslip_upcoming", upcomingReleases);
  }, [upcomingReleases]);

  useEffect(() => {
    saveToLocalStorage("payslip_history", releaseHistory);
  }, [releaseHistory]);

  useEffect(() => {
    const tick = () => reconcileReleases();
    tick(); // run once on mount
    reconcilerTimer.current = window.setInterval(tick, 30_000) as unknown as number;
    return () => {
      if (reconcilerTimer.current) window.clearInterval(reconcilerTimer.current);
    };
  }, [upcomingReleases]);

  /* ------------------------------ computed ------------------------------ */
  const periods = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => s.add(`${r.period_year}-${String(r.period_month).padStart(2, "0")}`));
    return ["all", ...Array.from(s).sort().reverse()];
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesText =
        !q || [r.employee_name, r.employee_no, r.department_name, r.position].some(
          (v) => v && v.toLowerCase().includes(q)
        );
      const matchesPeriod =
        period === "all" ||
        `${r.period_year}-${String(r.period_month).padStart(2, "0")}` === period;
      const matchesStatus = statusFilter === "all" || r.status_code === statusFilter;
      return matchesText && matchesPeriod && matchesStatus;
    });
  }, [rows, search, period, statusFilter]);

  // ===== PAGING (client-side) =====
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // 10 | 20 | 50 | 100

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setPage(1);
  }, [search, period, statusFilter]);

  const totalFiltered = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const clampedPage = Math.min(page, pageCount);
  const startIdx = (clampedPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalFiltered);
  const pageRows = filtered.slice(startIdx, endIdx);

  // Selection helpers
  const allSelectedOnPage =
    pageRows.length > 0 && pageRows.every((r) => selected.includes(r.id));

  /* ------------------------------ actions ------------------------------ */
  // Select all *on this page*
  const toggleAllOnPage = () => {
    if (allSelectedOnPage) {
      // unselect only current page rows
      setSelected((prev) => prev.filter((id) => !pageRows.some((r) => r.id === id)));
    } else {
      // add current page rows (dedup)
      setSelected((prev) => Array.from(new Set([...prev, ...pageRows.map((r) => r.id)])));
    }
  };

  // Keep for per-row toggles
  const toggleOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };


  const createRelease = async () => {
  if (selected.length === 0) {
    toast.error("Select at least one employee");
    return;
  }
  if (mode === "schedule" && !visibleFrom) {
    toast.error("Please select Visible From");
    return;
  }

  const nowISO = new Date().toISOString();
  const visibleFromISO = mode === "now" ? nowISO : new Date(visibleFrom).toISOString();
  const visibleUntilISO = visibleUntil ? new Date(visibleUntil).toISOString() : null;

  const release: PayslipRelease = {
    id: Date.now(),
    created_at: nowISO,
    visible_from: visibleFromISO,
    visible_until: visibleUntilISO,
    total_payslips: selected.length,
    status: mode === "now" ? "released" : "scheduled",
    payroll_ids: [...selected],
    target_status: 'PAID',
    last_error: null,
  };

  try {
    if (release.status === 'released') {
      // Immediate: update DB first
      await updateStatusBulk(release.payroll_ids, 'PAID', 'Payslip released now');
      // reflect in UI rows
      setRows(prev =>
        prev.map(r => release.payroll_ids.includes(r.id) ? { ...r, status_code: 'PAID' } : r)
      );
      setReleaseHistory(h => [release, ...h]);
      toast.success("Payslips marked as PAID");
    } else {
      // Scheduled: persist locally for the reconciler to execute later
      setUpcomingReleases(u => [release, ...u]);
      toast.success("Payslip release scheduled (will mark PAID at due time)");
    }
    setStep(3);
    setSelected([]);
    setVisibleFrom("");
    setVisibleUntil("");
  } catch (e: any) {
    toast.error(e?.message || "Failed to update status");
  }
};


  const createRelease1 = () => {
    if (selected.length === 0) {
      toast.error("Select at least one employee");
      return;
    }
    if (mode === "schedule" && !visibleFrom) {
      toast.error("Please select Visible From");
      return;
    }

    const nowISO = new Date().toISOString();
    const visibleFromISO = mode === "now" ? nowISO : new Date(visibleFrom).toISOString();
    const visibleUntilISO = visibleUntil ? new Date(visibleUntil).toISOString() : null;

    const release: PayslipRelease = {
      id: Date.now(),
      created_at: nowISO,
      visible_from: visibleFromISO,
      visible_until: visibleUntilISO,
      total_payslips: selected.length,
      status: mode === "now" ? "released" : "scheduled",
      payroll_ids: [...selected],
       target_status: 'PAID',
    last_error: null,
    };

    if (release.status === "released") {
      setReleaseHistory((h) => [release, ...h]);
      toast.success("Payslips released to employees");
    } else {
      setUpcomingReleases((u) => [release, ...u]);
      toast.success("Payslip release scheduled");
    }

    setStep(3);
    setSelected([]);
    setVisibleFrom("");
    setVisibleUntil("");
  };

  const cancelRelease = (id: number) => {
    setUpcomingReleases((u) => u.filter((x) => x.id !== id));
    toast.success("Scheduled release canceled");
  };

  const reconcileReleases1 = () => {
    if (upcomingReleases.length === 0) return;
    const now = Date.now();
    const remaining: PayslipRelease[] = [];
    const moved: PayslipRelease[] = [];
    for (const r of upcomingReleases) {
      const due = new Date(r.visible_from).getTime();
      if (due <= now) moved.push({ ...r, status: "released" });
      else remaining.push(r);
    }
    if (moved.length > 0) {
      setUpcomingReleases(remaining);
      setReleaseHistory((h) => [...moved, ...h]);
      toast.success(`${moved.length} scheduled release(s) executed`);
    }
  };

  const reconcileReleases = async () => {
  if (upcomingReleases.length === 0) return;
  const now = Date.now();

  const remaining: PayslipRelease[] = [];
  const moved: PayslipRelease[] = [];

  for (const r of upcomingReleases) {
    const due = new Date(r.visible_from).getTime();
    if (due <= now) {
      try {
        await updateStatusBulk(r.payroll_ids, r.target_status, 'Scheduled payslip release');
        // reflect in the grid
        setRows(prev =>
          prev.map(row => r.payroll_ids.includes(row.id) ? { ...row, status_code: r.target_status } : row)
        );
        moved.push({ ...r, status: 'released', last_error: null });
      } catch (err: any) {
        // keep it scheduled but note the error; it will retry next tick
        remaining.push({ ...r, last_error: err?.message || 'Unknown error' });
      }
    } else {
      remaining.push(r);
    }
  }

  if (moved.length > 0) {
    setUpcomingReleases(remaining);
    setReleaseHistory(h => [...moved, ...h]);
    toast.success(`${moved.length} scheduled release(s) executed`);
  } else if (remaining.length !== upcomingReleases.length) {
    setUpcomingReleases(remaining);
  }
};


  /* =============================================================
     Small Components
     ============================================================= */

  const ReleaseCard: React.FC<{
    title?: string;
    release: PayslipRelease;
    action?: React.ReactNode;
    badgeClass?: string;
  }> = ({ title, release, action, badgeClass }) => (
    <div className="border rounded-lg p-4 flex flex-col gap-2 bg-base-100">
      {title && <div className="font-semibold">{title}</div>}
      <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div>
          <div className="opacity-60 text-xs">Release ID</div>
          <div className="font-medium">{release.id}</div>
        </div>
        <div>
          <div className="opacity-60 text-xs">Created</div>
          <div>{fmtDateTime(release.created_at)}</div>
        </div>
        <div>
          <div className="opacity-60 text-xs">Visible From</div>
          <div>{fmtDateTime(release.visible_from)}</div>
        </div>
        <div>
          <div className="opacity-60 text-xs">Visible Until</div>
          <div>{fmtDateTime(release.visible_until ?? null)}</div>
        </div>
        <div>
          <div className="opacity-60 text-xs">Total Payslips</div>
          <div>{release.total_payslips}</div>
        </div>
        <div>
          <div className="opacity-60 text-xs">Status</div>
          <div>
            <span className={`badge ${badgeClass ?? ""}`}>{release.status}</span>
          </div>
        </div>
        {action && <div className="ml-auto">{action}</div>}
      </div>
    </div>
  );

  /* =============================================================
     UI
     ============================================================= */

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Title + actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <FileText className="w-6 h-6" /> Generate Payslips
        </h1>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm" onClick={() => setModal("upcoming")}>
            Upcoming ({upcomingReleases.length})
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setModal("history")}>
            History ({releaseHistory.length})
          </button>
        </div>
      </div>

      {/* Stepper (hide on Summary) */}
      {step !== 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            className={`card shadow-sm border ${step === 1 ? "ring-1 ring-blue-600 border-blue-600 bg-blue-50/40" : "opacity-80"}`}
            onClick={() => setStep(1)}
          >
            <div className="card-body py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-semibold">1</span>
                <div>
                  <div className="font-semibold">Choose Employees</div>
                  <div className="text-xs opacity-70">Pick who will receive their payslip</div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`card shadow-sm border ${step === 2 ? "ring-1 ring-blue-600 border-blue-600 bg-blue-50/40" : selected.length === 0 ? "opacity-50 pointer-events-none" : "opacity-80 cursor-pointer"}`}
            onClick={() => selected.length > 0 && setStep(2)}
          >
            <div className="card-body py-4">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>2</span>
                <div>
                  <div className="font-semibold">Schedule Release</div>
                  <div className="text-xs opacity-70">Set visibility date and time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-primary">1</span>
              <h2 className="card-title">Choose Employees</h2>
            </div>

            <div className="flex flex-col md:flex-row md:items-end gap-3 mb-4">
              <div className="form-control w-full md:max-w-md">
                <label className="label"><span className="label-text">Search</span></label>
                <div className="relative">
                  <input
                    className="input input-bordered w-full pl-9"
                    placeholder="Search by name, number, department, or position"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search className="w-4 h-4 absolute left-3 top-3.5 opacity-60" />
                </div>
              </div>

              <div className="form-control w-full md:max-w-xs">
                <label className="label"><span className="label-text">Period</span></label>
                <select className="select select-bordered" value={period} onChange={(e) => setPeriod(e.target.value)}>
                  {periods.map((p: string) => (
                    <option key={p} value={p}>
                      {p === "all" ? "All" : `${p.split("-")[1]}/${p.split("-")[0]}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control w-full md:max-w-xs">
                <label className="label"><span className="label-text">Status</span></label>
              <select
                className="select select-bordered"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">All</option>
                <option value="FINAL">FINAL</option>
                <option value="DRAFT">DRAFT</option>
                <option value="PAID">PAID</option>
                <option value="ADJUST">ADJUST</option>
                <option value="HOLD">HOLD</option>
                <option value="VOID">VOID</option>
              </select>

              </div>

              <div className="flex-1" />
              <div className="text-sm md:self-center">
                Selected {selected.length} of {filtered.length}
              </div>
            </div>

            <div className="overflow-x-auto border rounded-lg">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-10">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={allSelectedOnPage}
                        onChange={toggleAllOnPage}
                        aria-label="Select all on this page"
                      />
                    </th>
                    <th>ID</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Gross</th>
                    <th>Net</th>
                    <th>Bank</th>
                    <th>Account</th>
                    <th>Period</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={11}><div className="py-8 text-center">Loading…</div></td></tr>
                  )}
                  {!loading && pageRows.length === 0 && (
                    <tr><td colSpan={11}><div className="py-8 text-center opacity-70">No rows</div></td></tr>
                  )}
                  {!loading && pageRows.map((r: Row) => (
                    <tr key={r.id} className="hover">
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={selected.includes(r.id)}
                          onChange={() => toggleOne(r.id)}
                        />
                      </td>
                      <td>{r.id}</td>
                      <td className="font-medium">
                        {r.employee_name}
                        <div className="text-xs opacity-70">{r.employee_no}</div>
                      </td>
                      <td>{r.department_name}</td>
                      <td>{r.position}</td>
                      <td>{fmtMoney(r.gross_salary)}</td>
                      <td>{fmtMoney(r.net_salary)}</td>
                      <td>{r.bank_name}</td>
                      <td>{r.bank_account_no}</td>
                      <td>{String(r.period_month).padStart(2, "0")}/{r.period_year}</td>
                      <td>
                        {/* <span className={`badge ${r.status_code === "FINALIZED" ? "badge-success" : r.status_code === "DRAFT" ? "" : "badge-ghost"}`}>
                          {r.status_code}
                        </span> */}
                          <span className={`badge ${badgeClassFor(r.status_code)}`}>
    {r.status_code}
  </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paging footer */}
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              {/* Left: info + select-all-filtered */}
              <div className="text-sm">
                Showing <span className="font-medium">{totalFiltered === 0 ? 0 : startIdx + 1}</span>–
                <span className="font-medium">{endIdx}</span> of
                <span className="font-medium"> {totalFiltered}</span> results.
                <span className="mx-2">•</span>
                Selected <span className="font-medium">{selected.length}</span> of
                <span className="font-medium"> {totalFiltered}</span>
                {selected.length < totalFiltered && totalFiltered > 0 && (
                  <>
                    {" "}
                    <button
                      className="link link-primary"
                      onClick={() =>
                        setSelected((prev) =>
                          Array.from(new Set([...prev, ...filtered.map((r) => r.id)]))
                        )
                      }
                    >
                      Select all {totalFiltered}
                    </button>
                  </>
                )}
                {selected.length > 0 && (
                  <>
                    {" "}
                    <button className="link link-error" onClick={() => setSelected([])}>
                      Clear all
                    </button>
                  </>
                )}
              </div>

              {/* Right: rows-per-page + controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-70">Rows per page</span>
                  <select
                    className="select select-bordered select-sm"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <div className="join">
                  <button
                    className="join-item btn btn-sm"
                    onClick={() => setPage(1)}
                    disabled={clampedPage === 1}
                    aria-label="First page"
                  >
                    «
                  </button>
                  <button
                    className="join-item btn btn-sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={clampedPage === 1}
                    aria-label="Previous page"
                  >
                    Prev
                  </button>
                  <div className="join-item btn btn-sm btn-ghost no-animation cursor-default">
                    Page {clampedPage} / {pageCount}
                  </div>
                  <button
                    className="join-item btn btn-sm"
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    disabled={clampedPage === pageCount}
                    aria-label="Next page"
                  >
                    Next
                  </button>
                  <button
                    className="join-item btn btn-sm"
                    onClick={() => setPage(pageCount)}
                    disabled={clampedPage === pageCount}
                    aria-label="Last page"
                  >
                    »
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button className="btn btn-outline" onClick={() => setSelected([])}>
                Clear Selection
              </button>
              <button className="btn btn-primary" disabled={selected.length === 0} onClick={() => setStep(2)}>
                Next: Schedule Release
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-primary">2</span>
              <h2 className="card-title">Schedule Release</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Release Mode</span></label>
                <select className="select select-bordered" value={mode} onChange={(e) => setMode(e.target.value as ReleaseMode)}>
                  <option value="now">Release Immediately</option>
                  <option value="schedule">Schedule Release</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Visible From</span></label>
                <input
                  type="datetime-local"
                  className="input input-bordered"
                  disabled={mode !== "schedule"}
                  value={visibleFrom}
                  onChange={(e) => setVisibleFrom(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Visible Until (optional)</span></label>
                <input
                  type="datetime-local"
                  className="input input-bordered"
                  value={visibleUntil}
                  onChange={(e) => setVisibleUntil(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 justify-between">
              <button className="btn" onClick={() => setStep(1)}>← Back to Step 1</button>
              <div className="flex gap-3">
                <button className="btn btn-primary" onClick={createRelease}>
                  <Calendar className="w-4 h-4" /> Create Release ({selected.length} employees)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary page (stacked, row view) */}
      {step === 3 && (
        <>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">Release Summary</h2>
              <p className="text-sm opacity-70">
                Your release has been created. Review upcoming and past releases below, or open them in a quick view.
              </p>
              <div className="mt-4 flex gap-3">
                <button className="btn" onClick={() => setStep(1)}>Create Another Release</button>
                <button className="btn btn-outline" onClick={() => setModal("upcoming")}>View Upcoming</button>
                <button className="btn btn-outline" onClick={() => setModal("history")}>View History</button>
              </div>
            </div>
          </div>

          {/* Upcoming (row cards) */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge">Upcoming Releases</span>
              </div>

              {upcomingReleases.length === 0 ? (
                <div className="py-6 text-center opacity-70">None</div>
              ) : (
                <div className="space-y-3">
                  {upcomingReleases.map((u) => (
                    <ReleaseCard
                      key={u.id}
                      release={u}
                      badgeClass="badge-warning"
                      action={
                        <button className="btn btn-xs" onClick={() => cancelRelease(u.id)}>
                          Cancel
                        </button>
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* History (row cards) */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge">Release History</span>
              </div>

              {releaseHistory.length === 0 ? (
                <div className="py-6 text-center opacity-70">No history</div>
              ) : (
                <div className="space-y-3">
                  {releaseHistory.map((h) => (
                    <ReleaseCard key={h.id} release={h} badgeClass="badge-success" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Centered Modal quick-view */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setModal(null)} />
          <div className="relative bg-base-100 w-full max-w-5xl max-h-[85vh] rounded-xl shadow-2xl border overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">{modal === "upcoming" ? "Upcoming Releases" : "Release History"}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>Close</button>
            </div>
            <div className="p-4 overflow-auto space-y-3">
              {modal === "upcoming" ? (
                upcomingReleases.length === 0 ? (
                  <div className="py-6 text-center opacity-70">None</div>
                ) : (
                  upcomingReleases.map((u) => (
                    <ReleaseCard
                      key={u.id}
                      release={u}
                      badgeClass="badge-warning"
                      action={
                        <button className="btn btn-xs" onClick={() => cancelRelease(u.id)}>
                          Cancel
                        </button>
                      }
                    />
                  ))
                )
              ) : releaseHistory.length === 0 ? (
                <div className="py-6 text-center opacity-70">No history</div>
              ) : (
                releaseHistory.map((h) => (
                  <ReleaseCard key={h.id} release={h} badgeClass="badge-success" />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
