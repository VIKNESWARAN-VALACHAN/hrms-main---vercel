// // 'use client';

// // import React, { useState, useMemo, useEffect, useCallback, useRef, JSX } from 'react';
// // import { useRouter } from 'next/navigation';
// // import {
// //   Calendar, Clock, Download, Upload, Plus, Edit, Trash2, Moon,
// //   Settings, Filter, Save, X, ChevronLeft, ChevronRight,
// //   ChevronsUpDown, ArrowUpDown, MoreVertical
// // } from 'lucide-react';
// // import { API_BASE_URL } from '../../config';

// // /* =========================== Types =========================== */
// // type ShiftStatus = 'working' | 'off' | 'leave';

// // interface User {
// //   id: number;
// //   role: 'admin' | 'manager' | 'employee' | string;
// //   [k: string]: unknown;
// // }

// // interface Employee {
// //   id: number;
// //   name: string;
// //   email: string;
// //   position: string;
// //   department_id: string | number | null;
// //   company_id: string | number | null;
// //   status: string;
// //   activation: string;
// //   joined_date: string;
// //   employee_no: string;
// //   employment_type: string;
// //   gender: string;
// //   role: string;
// //   race: string | null;
// //   religion: string | null;
// //   job_level: string | null;
// //   department_name: string | null;
// //   passport_expired_date: string;
// //   visa_expired_date: string;
// //   nationality: string;
// //   time_zone?: string;
// // }

// // interface Company { id: number; name: string }
// // interface Department { id: number; name: string }

// // interface ShiftTemplate {
// //   id: number;
// //   name: string;
// //   start: string; // "HH:mm"
// //   end: string;   // "HH:mm"
// //   color: string; // tailwind classes (UI-only)
// //   label: string | null;
// //   break_mins: number;
// //   overnight?: boolean;
// //   description?: string | null;
// // }

// // type AlignMode = 'range-start' | 'next-monday';
// // type WeekendPolicy = 'ignore' | 'weekends-off';

// // interface PatternStepWork { type: 'work'; template: number }
// // interface PatternStepOff  { type: 'off' }
// // type PatternStep = PatternStepWork | PatternStepOff;

// // interface PatternMeta {
// //   align: AlignMode;
// //   weekendPolicy: WeekendPolicy;
// //   weekendDays: number[];
// // }

// // interface WorkPattern {
// //   id: number;
// //   name: string;
// //   description: string | null;
// //   sequence: PatternStep[];
// //   meta?: PatternMeta;
// // }

// // interface CellSchedule {
// //   status: ShiftStatus;
// //   start: string;
// //   end: string;
// //   template: number | null;
// //   isCustom: boolean;
// //   notes: string;
// //   break_mins?: number;
// //   overnight?: boolean;
// //   pattern_id?: number | null;
// // }

// // interface EditingCell { employeeId: number; day: number }

// // /** Server pattern shape (handles both old and new API formats) */
// // type ApiPatternStep = {
// //   type?: 'work' | 'off';
// //   template?: number | string | null;
// //   step_type?: 'work' | 'off';
// //   template_id?: number | string | null;
// // };
// // interface ApiPattern {
// //   id: number;
// //   name: string;
// //   description?: string | null;
// //   sequence?: ApiPatternStep[];
// //   meta?: PatternMeta;
// // }

// // /* =========================== Helpers =========================== */
// // const TZ_OPTIONS = [
// //   'Asia/Kuala_Lumpur',
// //   'Asia/Singapore',
// //   'Asia/Jakarta',
// //   'Asia/Manila',
// //   'Asia/Bangkok',
// //   'Asia/Tokyo',
// //   'Asia/Seoul',
// //   'Asia/Dubai',
// //   'Europe/London',
// //   'Europe/Berlin',
// //   'America/New_York',
// //   'America/Los_Angeles',
// //   'Australia/Sydney',
// //   'Australia/Melbourne',
// //   'America/Chicago',
// //   'America/Denver',
// //   'Europe/Paris',
// //   'Europe/Moscow',
// //   'Africa/Johannesburg',
// //   'Asia/Hong_Kong',
// //   'Asia/Shanghai',
// //   'Asia/Kolkata',
// //   'America/Mexico_City',
// //   'America/Sao_Paulo'
// // ];
// // const labelToColor = (label?: string | null) => {
// //   const l = (label || '').toLowerCase();
// //   if (l.includes('night')) return 'bg-purple-50 text-purple-700 border-purple-200';
// //   if (l.includes('evening')) return 'bg-green-50 text-green-700 border-green-200';
// //   if (l.includes('office') || l.includes('morning')) return 'bg-blue-50 text-blue-700 border-blue-200';
// //   return 'bg-slate-50 text-slate-700 border-slate-200';
// // };

// // const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
// // const formatHours = (hours: number) => `${hours.toFixed(1)}h`;

// // const calculateHours = (start: string, end: string, overnight = false): number => {
// //   if (!start || !end) return 0;
// //   const [sh, sm] = start.split(':').map(Number);
// //   const [eh, em] = end.split(':').map(Number);
// //   let s = sh * 60 + sm, e = eh * 60 + em;
// //   if (overnight && e < s) e += 24 * 60;
// //   return Math.max(0, (e - s) / 60);
// // };

// // const calcNetHours = (start: string, end: string, overnight: boolean | undefined, breakMins: number | undefined) => {
// //   const gross = calculateHours(start, end, !!overnight);
// //   const net = Math.max(0, gross - (breakMins ?? 0) / 60);
// //   return net;
// // };

// // const monthDateToISO = (y: number, m: number, d: number) => {
// //   const dt = new Date(y, m, d);
// //   const yyyy = dt.getFullYear();
// //   const mm = String(dt.getMonth() + 1).padStart(2, '0');
// //   const dd = String(dt.getDate()).padStart(2, '0');
// //   return `${yyyy}-${mm}-${dd}`;
// // };

// // const toDisplayDate = (iso: string) =>
// //   new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

// // /* ===== Local date helpers (fixed to avoid timezone ISO loops) ===== */
// // const parseISO = (iso: string) => {
// //   const [y, m, d] = iso.split('-').map(Number);
// //   return new Date(y, m - 1, d); // local midnight
// // };
// // const formatLocalISO = (dt: Date) => {
// //   const yyyy = dt.getFullYear();
// //   const mm = String(dt.getMonth() + 1).padStart(2, '0');
// //   const dd = String(dt.getDate()).padStart(2, '0');
// //   return `${yyyy}-${mm}-${dd}`;
// // };
// // const isoAtMidnight = (iso: string) => parseISO(iso);
// // const addDaysISO = (iso: string, n: number) => {
// //   const d = parseISO(iso);
// //   d.setDate(d.getDate() + n);
// //   return formatLocalISO(d);
// // };
// // const jsDow = (iso: string) => parseISO(iso).getDay();
// // const nextMondayISO = (iso: string) => {
// //   let cur = iso;
// //   for (let i = 0; i < 7; i++) {
// //     if (jsDow(cur) === 1) return cur;
// //     cur = addDaysISO(cur, 1);
// //   }
// //   return iso;
// // };
// // const forEachDayISO = (startISO: string, endISO: string, fn: (iso: string, date: Date) => void) => {
// //   const end = parseISO(endISO);
// //   for (let cur = parseISO(startISO); cur <= end; cur.setDate(cur.getDate() + 1)) {
// //     fn(formatLocalISO(cur), new Date(cur)); // pass clone
// //   }
// // };

// // /* =========================== Page =========================== */
// // export default function HRMSScheduler(): JSX.Element {
// //   const router = useRouter();

// //   /* ---- Auth/User ---- */
// //   const [user, setUser] = useState<User | null>(null);
// //   const [loading, setLoading] = useState<boolean>(false);

// //   /* ---- Master data ---- */
// //   const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
// //   const [companies, setCompanies] = useState<Company[]>([]);
// //   const [allDepartments, setAllDepartments] = useState<Department[]>([]);
// //   const [departments, setDepartments] = useState<Department[]>([]);

// //   /* ---- Tabs & UI ---- */
// //   const [activeView, setActiveView] = useState<'scheduler'|'templates'|'patterns'>('scheduler');
// //   const [showFilters, setShowFilters] = useState<boolean>(true);

// //   /* ---- Filters ---- */
// //   const now = new Date();
// //   const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
// //   const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
// //   const [selectedCompany, setSelectedCompany] = useState<string | number>('All');
// //   const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | number>('All');
// //   const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
// //   const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | number>('All');
// //   const [selectedStatus, setSelectedStatus] = useState<'All' | ShiftStatus>('All');
// //   const [searchTerm, setSearchTerm] = useState<string>('');

// //   const [dateFrom, setDateFrom] = useState<string>(() => monthDateToISO(now.getFullYear(), now.getMonth(), 1));
// //   const [dateTo, setDateTo] = useState<string>(() => monthDateToISO(now.getFullYear(), now.getMonth(), daysInMonth(now.getFullYear(), now.getMonth())));

// //   // Bulk selections (table rows)
// //   const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

// //   // Bulk: Time, Template, Pattern
// //   const [bulkStart, setBulkStart] = useState<string>('09:00');
// //   const [bulkEnd, setBulkEnd] = useState<string>('18:00');
// //   const [templateToApply, setTemplateToApply] = useState<number | ''>('');
// //   const [patternToApply, setPatternToApply] = useState<number | ''>('');

// //   // New: Bulk scope + save scope
// //   type BulkScope = 'selected' | 'page' | 'all';
// //   const [bulkScope, setBulkScope] = useState<BulkScope>('page');

// //   type SaveScope = 'changed' | 'selected' | 'page' | 'all';
// //   const [saveScope, setSaveScope] = useState<SaveScope>('changed');

// //   // For pattern application mode (range vs selected rows)
// //   type PatternApplyMode = 'range';
// //   const [patternApplyMode] = useState<PatternApplyMode>('range'); // keep simple and robust

// //   // Table pagination
// //   const [tablePage, setTablePage] = useState<number>(1);
// //   const [tablePageSize, setTablePageSize] = useState<number>(20);

// //   // Sorting (table)
// //   type SortKey = 'employeeName' | 'employeeNo' | 'department' | 'date' | 'netHours' | 'status' | 'pattern';
// //   const [sortKey, setSortKey] = useState<SortKey>('date');
// //   const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');

// //   // Save state
// //   const [dirty, setDirty] = useState<boolean>(false);
// //   const [saving, setSaving] = useState<boolean>(false);
// //   const [saveError, setSaveError] = useState<string>('');
// //   const [lastSavedAt, setLastSavedAt] = useState<string>('');
// //   const [changedKeys, setChangedKeys] = useState<Set<string>>(new Set());

// //   /* ---- Template & Pattern state (CRUD via API) ---- */
// //   const [shiftTemplates, setShiftTemplates] = useState<ShiftTemplate[]>([]);
// //   const [patterns, setPatterns] = useState<WorkPattern[]>([]);

// //   // Search filters for Templates/Patterns pages
// //   const [templateQuery, setTemplateQuery] = useState<string>('');
// //   const [patternQuery, setPatternQuery] = useState<string>('');

// //   // Modals (create/edit)
// //   const [showTemplateModal, setShowTemplateModal] = useState(false);
// //   const [editingTemplate, setEditingTemplate] = useState<ShiftTemplate | null>(null);

// //   const [showPatternModal, setShowPatternModal] = useState(false);
// //   const [editingPattern, setEditingPattern] = useState<WorkPattern | null>(null);

// //   const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);
// //   const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

// //   /* ================= Auth bootstrap ================= */
// //   useEffect(() => {
// //     const userStr = localStorage.getItem('hrms_user');
// //     const isAuthenticated = localStorage.getItem('hrms_authenticated');
// //     if (!userStr || isAuthenticated !== 'true') {
// //       router.push('/auth/login');
// //       return;
// //     }
// //     try { setUser(JSON.parse(userStr)); } catch { router.push('/auth/login'); }
// //   }, [router]);

// //   /* ================= Fetchers ================= */
// //   const fetchTemplates = useCallback(async () => {
// //     try {
// //       const res = await fetch(`${API_BASE_URL}/api/schedules/templates`);
// //       if (!res.ok) throw new Error(`Templates HTTP ${res.status}`);
// //       const data = await res.json();
// //       const mapped: ShiftTemplate[] = (data || []).map((t: any) => ({
// //         id: t.id,
// //         name: t.name,
// //         start: t.start_time,
// //         end: t.end_time,
// //         break_mins: t.break_mins ?? 0,
// //         overnight: !!t.overnight,
// //         label: t.label ?? null,
// //         description: t.description ?? null,
// //         color: labelToColor(t.label)
// //       }));
// //       setShiftTemplates(mapped);
// //     } catch (e) {
// //       console.error('fetch templates failed', e);
// //     }
// //   }, []);

// //   const fetchPatterns = useCallback(async () => {
// //     try {
// //       const res = await fetch(`${API_BASE_URL}/api/schedules/patterns`);
// //       if (!res.ok) throw new Error(`Patterns HTTP ${res.status}`);
// //       const data: unknown = await res.json();

// //       const arr: ApiPattern[] = Array.isArray(data) ? (data as ApiPattern[]) : [];

// //       const mapped: WorkPattern[] = arr.map((p: ApiPattern): WorkPattern => {
// //         const seq: PatternStep[] = Array.isArray(p.sequence)
// //           ? p.sequence.map((s: ApiPatternStep): PatternStep =>
// //               (s.type ?? s.step_type) === 'work'
// //                 ? { type: 'work', template: Number((s.template ?? s.template_id) ?? 0) }
// //                 : { type: 'off' }
// //             )
// //           : [];
// //         const meta: PatternMeta = p.meta ?? {
// //           align: 'next-monday',
// //           weekendPolicy: 'ignore',     // keep old patterns unchanged by default
// //           weekendDays: [6, 0],         // Sat & Sun
// //         };
// //         return {
// //           id: p.id,
// //           name: p.name,
// //           description: p.description ?? null,
// //           sequence: seq.map(s => (s.type === 'work' ? { type: 'work', template: Number(s.template) } : { type: 'off' })),
// //           meta,
// //         };
// //       });

// //       setPatterns(mapped);
// //     } catch (e) {
// //       console.error('fetch patterns failed', e);
// //     }
// //   }, []);

// //   const fetchAllEmployees = useCallback(async () => {
// //     if (!user) return;
// //     try {
// //       setLoading(true);
// //       const queryParams = new URLSearchParams();
// //       if (user?.role === 'manager') queryParams.append('manager_id', String(user.id));

// //       const res = await fetch(`${API_BASE_URL}/api/admin/employees${queryParams.toString() ? `?${queryParams}` : ''}`);
// //       if (!res.ok) throw new Error(`Employees HTTP ${res.status}`);
// //       const data: any[] = await res.json();

// //       const mapped: Employee[] = data
// //         .filter((emp: any) => emp.role !== 'admin')
// //         .map((emp: any): Employee => ({
// //           id: emp.id,
// //           name: emp.name,
// //           email: emp.email,
// //           position: emp.position || '',
// //           department_id: emp.department_id ?? '',
// //           company_id: emp.company_id ?? '',
// //           status: (emp.status?.toLowerCase() || 'active'),
// //           activation: emp.activation || 'Activated',
// //           joined_date: emp.joined_date || '',
// //           employee_no: emp.employee_no || '',
// //           employment_type: emp.employment_type || '',
// //           gender: emp.gender || '',
// //           role: emp.role || 'employee',
// //           race: emp.race ?? null,
// //           religion: emp.religion ?? null,
// //           job_level: emp.job_level ?? null,
// //           department_name: emp.department_name ?? null,
// //           passport_expired_date: emp.passport_expired_date || '',
// //           visa_expired_date: emp.visa_expired_date || '',
// //           nationality: emp.nationality || '',
// //           time_zone: emp.time_zone || 'Asia/Kuala_Lumpur'
// //         }));

// //       setAllEmployees(mapped);
// //     } catch (e) {
// //       console.error('fetch employees failed', e);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [user]);

// //   const [scheduleData, setScheduleData] = useState<Record<string, CellSchedule>>({}); // key: empId-year-month-day
// //   const KEY_RE = /^(\d+)-(\d+)-(\d+)-(\d+)$/; // empId-year-monthIndex-day
// //   const getScheduleKey = (employeeId: number, day: number) => `${employeeId}-${selectedYear}-${selectedMonth}-${day}`;

// //   const getCellSchedule = (employeeId: number, day: number): CellSchedule => {
// //     const key = getScheduleKey(employeeId, day);
// //     return scheduleData[key] ?? { status: 'off', start: '', end: '', template: null, isCustom: false, notes: '', pattern_id: null };
// //   };

// //   // SAFE base used inside state updaters
// //   const emptyCell: CellSchedule = { status: 'off', start: '', end: '', template: null, isCustom: false, notes: '', pattern_id: null };

// //   const markChanged = (key: string) => {
// //     setChangedKeys(prev => {
// //       if (prev.has(key)) return prev;
// //       const next = new Set(prev);
// //       next.add(key);
// //       return next;
// //     });
// //   };

// //   const setCellSchedule = (employeeId: number, day: number, patch: Partial<CellSchedule>) => {
// //     const key = getScheduleKey(employeeId, day);
// //     setScheduleData(prev => {
// //       const base = prev[key] ?? emptyCell;
// //       const merged = { ...base, ...patch };
// //       return { ...prev, [key]: merged };
// //     });
// //     markChanged(key);
// //     setDirty(true);
// //   };

// //   /** Batch apply many updates in a single setState to avoid UI lockups */
// //   const applyBulkPatches = (patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }>) => {
// //     if (!patches.length) return;
// //     setScheduleData(prev => {
// //       const next = { ...prev };
// //       for (const { employeeId, day, patch } of patches) {
// //         const key = getScheduleKey(employeeId, day);
// //         const base = next[key] ?? emptyCell;
// //         next[key] = { ...base, ...patch };
// //         // mark changed
// //         changedKeys.add(key);
// //       }
// //       return next;
// //     });
// //     setChangedKeys(new Set(changedKeys));
// //     setDirty(true);
// //   };

// //   // Update the fetchSchedules function to ensure all days are populated
// //   const fetchSchedules = useCallback(
// //     async (employeeIds: number[], fromISO: string, toISO: string) => {
// //       try {
// //         if (!fromISO || !toISO || employeeIds.length === 0) return;

// //         // Group employees by timezone
// //         const employeesByTimezone: Record<string, number[]> = {};
// //         employeeIds.forEach(empId => {
// //           const emp = allEmployees.find(e => e.id === empId);
// //           const tz = emp?.time_zone || 'Asia/Kuala_Lumpur';
// //           if (!employeesByTimezone[tz]) employeesByTimezone[tz] = [];
// //           employeesByTimezone[tz].push(empId);
// //         });

// //         const allServerData: Record<string, CellSchedule> = {};
// //         const errors: string[] = [];
// //         await Promise.all(Object.entries(employeesByTimezone).map(async ([timezone, empIds]) => {
// //           try {
// //             const params = new URLSearchParams();
// //             params.set('from', fromISO);
// //             params.set('to', toISO);
// //             params.set('employee_id', empIds.join(','));
// //             params.set('timezone', timezone);

// //             const res = await fetch(`${API_BASE_URL}/api/schedules?${params.toString()}`);
// //             if (!res.ok) throw new Error(`HTTP ${res.status} for timezone ${timezone}`);
// //             const data = await res.json();

// //             for (const row of data) {
// //               const empId = row.employee_id;
// //               const localDate = new Date(row.schedule_date);
// //               const y = localDate.getFullYear();
// //               const m = localDate.getMonth(); // 0-based
// //               const d = localDate.getDate();
// //               const key = `${empId}-${y}-${m}-${d}`;
// //               allServerData[key] = {
// //                 status: row.status,
// //                 start: row.start_time || '',
// //                 end: row.end_time || '',
// //                 template: row.template_id || null,
// //                 isCustom: !row.template_id,
// //                 notes: row.notes || '',
// //                 break_mins: row.break_mins || 0,
// //                 overnight: !!row.overnight,
// //                 pattern_id: row.pattern_id || null,
// //               };
// //             }
// //           } catch (error: any) {
// //             errors.push(`Timezone ${timezone}: ${error.message}`);
// //             console.error(`Failed to fetch schedules for timezone ${timezone}:`, error);
// //           }
// //         }));

// //         if (errors.length > 0) console.warn('Some timezone groups failed to fetch:', errors);

// //         // Create default schedules for ALL filtered employees for ALL days in range
// //         const defaultSchedules: Record<string, CellSchedule> = {};
// //         forEachDayISO(fromISO, toISO, (iso, date) => {
// //           const day = date.getDate();
// //           const y = date.getFullYear();
// //           const m = date.getMonth(); // 0-based
// //           for (const empId of employeeIds) {
// //             const key = `${empId}-${y}-${m}-${day}`;
// //             if (!allServerData[key]) {
// //               defaultSchedules[key] = {
// //                 status: 'off',
// //                 start: '',
// //                 end: '',
// //                 template: null,
// //                 isCustom: false,
// //                 notes: '',
// //                 break_mins: 0,
// //                 overnight: false,
// //                 pattern_id: null,
// //               };
// //             }
// //           }
// //         });

// //         const merged = { ...defaultSchedules, ...allServerData };
// //         setScheduleData(prev => {
// //           const next = { ...prev };
// //           Object.keys(merged).forEach(key => { next[key] = merged[key]; });
// //           return next;
// //         });

// //         // on fetch, clear dirty markers for this range
// //         setDirty(false);
// //         setChangedKeys(new Set());
// //       } catch (e) {
// //         console.error('fetch schedules failed', e);
// //       }
// //     },
// //     [allEmployees]
// //   );

// //   useEffect(() => {
// //     if (!user) return;
// //     fetchAllEmployees();
// //     fetchTemplates();
// //     fetchPatterns();

// //     const fetchCompanies = async () => {
// //       try {
// //         const res = await fetch(`${API_BASE_URL}/api/admin/companies`);
// //         const data = await res.json();
// //         setCompanies(
// //           (Array.isArray(data) ? data : data?.data ?? []).map((c: any) => ({
// //             id: c.id ?? c.company_id,
// //             name: c.name ?? c.company_name ?? `Company ${c.id || c.company_id}`,
// //           }))
// //         );
// //       } catch (e) { console.error(e); }
// //     };

// //     const fetchAllDepartments = async () => {
// //       try {
// //         const res = await fetch(`${API_BASE_URL}/api/admin/departments`);
// //         const data = await res.json();
// //         const normalized: Department[] = (Array.isArray(data) ? data : data?.data ?? []).map((d: any) => ({
// //           id: d.id ?? d.department_id,
// //           name: d.name ?? d.department_name ?? `Dept ${d.id || d.department_id}`,
// //         }));
// //         setAllDepartments(normalized);
// //         setDepartments(normalized);
// //       } catch (e) { console.error(e); }
// //     };

// //     fetchCompanies();
// //     fetchAllDepartments();
// //   }, [user, fetchAllEmployees, fetchTemplates, fetchPatterns]);

// //   /* ================= Derived data ================= */
// //   const totalDays = useMemo(() => daysInMonth(selectedYear, selectedMonth), [selectedYear, selectedMonth]);
// //   const monthYearLabel = useMemo(
// //     () => new Date(selectedYear, selectedMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
// //     [selectedYear, selectedMonth]
// //   );

// //   // reset date range when month changes
// //   useEffect(() => {
// //     setDateFrom(monthDateToISO(selectedYear, selectedMonth, 1));
// //     setDateTo(monthDateToISO(selectedYear, selectedMonth, daysInMonth(selectedYear, selectedMonth)));
// //     setTablePage(1);
// //   }, [selectedYear, selectedMonth]);

// //   const employeesForDropdown = useMemo(() => {
// //     return allEmployees
// //       .filter(e => selectedCompany === 'All' ? true : String(e.company_id ?? '') === String(selectedCompany))
// //       .filter(e => selectedDepartment === 'All' ? true : (e.department_name || '') === selectedDepartment);
// //   }, [allEmployees, selectedCompany, selectedDepartment]);

// //   const baseFilteredEmployees: Employee[] = useMemo(() => {
// //     let out = allEmployees;
// //     if (selectedCompany !== 'All') out = out.filter(e => String(e.company_id ?? '') === String(selectedCompany));
// //     if (selectedDepartment !== 'All') out = out.filter(e => (e.department_name || '') === selectedDepartment);
// //     if (selectedEmployeeId !== 'All') out = out.filter(e => String(e.id) === String(selectedEmployeeId));
// //     if (searchTerm.trim()) {
// //       const t = searchTerm.toLowerCase();
// //       out = out.filter(e =>
// //         e.name.toLowerCase().includes(t) ||
// //         (e.employee_no || '').toLowerCase().includes(t) ||
// //         (e.department_name || '').toLowerCase().includes(t)
// //       );
// //     }
// //     return out;
// //   }, [allEmployees, selectedCompany, selectedDepartment, selectedEmployeeId, searchTerm]);

// //   const employeeIds = useMemo(() => baseFilteredEmployees.map(e => e.id), [baseFilteredEmployees]);

// //   useEffect(() => {
// //     if (!employeeIds.length) return;
// //     fetchSchedules(employeeIds, dateFrom, dateTo);
// //   }, [employeeIds, dateFrom, dateTo, fetchSchedules]);

// //   /* ====== Apply helpers: Pattern / Template / Time ====== */
// //   const mondayOfWeekISO = (iso: string) => {
// //     const d = parseISO(iso);
// //     const diff = (d.getDay() + 6) % 7; // 0..6 -> days back to Monday
// //     d.setDate(d.getDate() - diff);
// //     return formatLocalISO(d);
// //   };

// //   const applyPatternRange = (
// //     targetEmployeeIds: number[],
// //     patternId: number,
// //     startISO: string,
// //     endISO: string
// //   ) => {
// //     const pat = patterns.find(p => p.id === patternId);
// //     if (!pat || !pat.sequence?.length) return;

// //     const meta: PatternMeta = pat.meta ?? {
// //       align: 'next-monday',
// //       weekendPolicy: 'ignore',
// //       weekendDays: [6, 0]
// //     };

// //     let initialIdx = 0;
// //     if (meta.align === 'next-monday') {
// //       const weekMon = mondayOfWeekISO(startISO);
// //       let eligibleBefore = 0;
// //       forEachDayISO(weekMon, addDaysISO(startISO, -1), (_iso, date) => {
// //         const dow = date.getDay();
// //         const isWknd = meta.weekendPolicy === 'weekends-off' && meta.weekendDays.includes(dow);
// //         if (!isWknd) eligibleBefore++;
// //       });
// //       initialIdx = eligibleBefore % pat.sequence.length;
// //     }

// //     const patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }> = [];

// //     for (const eid of targetEmployeeIds) {
// //       let stepIndex = initialIdx;

// //       forEachDayISO(startISO, endISO, (_iso, date) => {
// //         const dow = date.getDay();
// //         const isWknd = meta.weekendPolicy === 'weekends-off' && meta.weekendDays.includes(dow);
// //         const dd = date.getDate();

// //         if (isWknd) {
// //           patches.push({
// //             employeeId: eid,
// //             day: dd,
// //             patch: {
// //               status: 'off',
// //               start: '',
// //               end: '',
// //               template: null,
// //               isCustom: false,
// //               break_mins: 0,
// //               overnight: false,
// //               pattern_id: patternId
// //             }
// //           });
// //           return; // don’t advance
// //         }

// //         const step = pat.sequence[stepIndex % pat.sequence.length];
// //         if (step.type === 'work') {
// //           const tpl = shiftTemplates.find(t => t.id === step.template);
// //           patches.push({
// //             employeeId: eid,
// //             day: dd,
// //             patch: tpl
// //               ? {
// //                   status: 'working',
// //                   start: tpl.start,
// //                   end: tpl.end,
// //                   template: tpl.id,
// //                   isCustom: false,
// //                   break_mins: tpl.break_mins,
// //                   overnight: tpl.overnight,
// //                   pattern_id: patternId
// //                 }
// //               : { status: 'off', start: '', end: '', template: null, isCustom: false, break_mins: 0, overnight: false, pattern_id: patternId }
// //           });
// //         } else {
// //           patches.push({
// //             employeeId: eid,
// //             day: dd,
// //             patch: { status: 'off', start: '', end: '', template: null, isCustom: false, break_mins: 0, overnight: false, pattern_id: patternId }
// //           });
// //         }

// //         stepIndex++;
// //       });
// //     }

// //     applyBulkPatches(patches);
// //   };

// //   // Helpers to apply by explicit row keys (Selected / Page / All)
// //   const rowIdToParts = (rowId: string) => {
// //     const [empIdStr, dayStr] = rowId.split('-');
// //     return { empId: parseInt(empIdStr, 10), day: parseInt(dayStr, 10) };
// //     // NOTE: rowId format we render in table is `${empId}-${day}`, not the schedule key
// //   };

// //   const patchRowsTime = (rowIds: string[], startTime: string, endTime: string) => {
// //     const patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }> = rowIds.map(rid => {
// //       const { empId, day } = rowIdToParts(rid);
// //       return {
// //         employeeId: empId,
// //         day,
// //         patch: { status: 'working', start: startTime, end: endTime, template: null, isCustom: true }
// //       };
// //     });
// //     applyBulkPatches(patches);
// //   };

// //   const patchRowsTemplate = (rowIds: string[], templateId: number) => {
// //     const tpl = shiftTemplates.find(t => t.id === templateId);
// //     if (!tpl) return;
// //     const patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }> = rowIds.map(rid => {
// //       const { empId, day } = rowIdToParts(rid);
// //       return {
// //         employeeId: empId,
// //         day,
// //         patch: {
// //           status: 'working',
// //           start: tpl.start,
// //           end: tpl.end,
// //           template: tpl.id,
// //           isCustom: false,
// //           break_mins: tpl.break_mins,
// //           overnight: tpl.overnight
// //         }
// //       };
// //     });
// //     applyBulkPatches(patches);
// //   };

// //   /* ====================== List/Table data ====================== */
// //   type RowItem = {
// //     id: string;                // `${empId}-${day}`
// //     employeeId: number;
// //     employeeName: string;
// //     employeeNo: string;
// //     department: string;
// //     dateISO: string;
// //     status: ShiftStatus;
// //     startTime: string;
// //     endTime: string;
// //     netHours: number;
// //     changeShift: boolean;
// //     remarks: string;
// //     patternName: string;
// //     templateName: string;
// //   };

// //   type BulkTool = 'time' | 'template' | 'pattern';
// //   const [bulkTool, setBulkTool] = useState<BulkTool>('time');

// //   const monthRows: RowItem[] = useMemo(() => {
// //     const rows: RowItem[] = [];
// //     for (const emp of baseFilteredEmployees) {
// //       for (let d = 1; d <= totalDays; d++) {
// //         const sch = getCellSchedule(emp.id, d);
// //         const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;
// //         const net = sch.status === 'working'
// //           ? calcNetHours(sch.start, sch.end, sch.overnight ?? tpl?.overnight, sch.break_mins ?? tpl?.break_mins)
// //           : 0;
// //         const dateISO = monthDateToISO(selectedYear, selectedMonth, d);
// //         const patternName = sch.pattern_id ? (patterns.find(p => p.id === sch.pattern_id)?.name ?? '') : '';
// //         rows.push({
// //           id: `${emp.id}-${d}`,
// //           employeeId: emp.id,
// //           employeeName: emp.name,
// //           employeeNo: emp.employee_no || '',
// //           department: emp.department_name ?? '-',
// //           dateISO,
// //           status: sch.status,
// //           startTime: sch.start || '',
// //           endTime: sch.end || '',
// //           netHours: net,
// //           changeShift: !!sch.isCustom,
// //           remarks: sch.notes || '',
// //           patternName,
// //           templateName: tpl?.name ?? '',
// //         });
// //       }
// //     }
// //     return rows;
// //   }, [baseFilteredEmployees, selectedYear, selectedMonth, scheduleData, totalDays, shiftTemplates, patterns]);

// //   // Apply date/status filters
// //   const rowsFilteredByDateStatus = useMemo(() => {
// //     const from = dateFrom;
// //     const to = dateTo;
// //     return monthRows.filter(r => (r.dateISO >= from && r.dateISO <= to) && (selectedStatus === 'All' ? true : r.status === selectedStatus));
// //   }, [monthRows, dateFrom, dateTo, selectedStatus]);

// //   /* ================= Sorting & Pagination ================= */
// //   const handleSort = (key: SortKey) => {
// //     if (key === sortKey) setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
// //     else { setSortKey(key); setSortDir('asc'); }
// //   };

// //   const getSortIcon = (key: SortKey) => {
// //     if (key !== sortKey) return <ChevronsUpDown className="w-4 h-4 inline-block ml-1 text-slate-400" />;
// //     return <ArrowUpDown className="w-4 h-4 inline-block ml-1 text-slate-700" />;
// //   };

// //   const sortedData = useMemo(() => {
// //     const arr = [...rowsFilteredByDateStatus];
// //     arr.sort((a, b) => {
// //       const dir = sortDir === 'asc' ? 1 : -1;
// //       switch (sortKey) {
// //         case 'employeeName': return a.employeeName.localeCompare(b.employeeName) * dir;
// //         case 'employeeNo': return a.employeeNo.localeCompare(b.employeeNo) * dir;
// //         case 'department': return (a.department || '').localeCompare(b.department || '') * dir;
// //         case 'date': return (a.dateISO < b.dateISO ? -1 : a.dateISO > b.dateISO ? 1 : 0) * dir;
// //         case 'netHours': return (a.netHours - b.netHours) * dir;
// //         case 'status': return a.status.localeCompare(b.status) * dir;
// //         case 'pattern': return (a.patternName || '').localeCompare(b.patternName || '') * dir;
// //         default: return 0;
// //       }
// //     });
// //     return arr;
// //   }, [rowsFilteredByDateStatus, sortKey, sortDir]);

// //   // table pagination
// //   const totalRows = sortedData.length;
// //   const totalTablePages = Math.max(1, Math.ceil(totalRows / tablePageSize));
// //   const pageStartIdx = (tablePage - 1) * tablePageSize;
// //   const pageEndIdx = Math.min(pageStartIdx + tablePageSize, totalRows);
// //   const paginatedData = sortedData.slice(pageStartIdx, pageEndIdx);

// //   // header checkbox helpers
// //   const pageRowIds = paginatedData.map(r => r.id);
// //   const allPageSelected = pageRowIds.length > 0 && pageRowIds.every(id => selectedRowIds.has(id));

// //   const toggleSelectPage = (checked: boolean) => {
// //     setSelectedRowIds(prev => {
// //       const next = new Set(prev);
// //       pageRowIds.forEach(id => {
// //         if (checked) next.add(id);
// //         else next.delete(id);
// //       });
// //       return next;
// //     });
// //   };

// //   // reset pagination when filters change
// //   useEffect(() => { setTablePage(1); setSelectedRowIds(new Set()); }, [selectedCompany, selectedDepartment, selectedEmployeeId, selectedStatus, selectedYear, selectedMonth, dateFrom, dateTo, searchTerm]);

// //   /* ================= Row updates ================= */

// //   const statusOptions: ShiftStatus[] = ['working', 'off', 'leave'];

// //   const updateScheduleItem = (rowId: string, field: keyof RowItem | 'workingToggle', value: any) => {
// //     const [empIdStr, dayStr] = rowId.split('-');
// //     const employeeId = parseInt(empIdStr, 10);
// //     const day = parseInt(dayStr, 10);
// //     const sch = getCellSchedule(employeeId, day);

// //     if (field === 'workingToggle') {
// //       const nextStatus: ShiftStatus = value ? 'working' : 'off';
// //       const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;
// //       setCellSchedule(employeeId, day, {
// //         status: nextStatus,
// //         start: nextStatus === 'working' ? (sch.start || tpl?.start || '09:00') : '',
// //         end: nextStatus === 'working' ? (sch.end || tpl?.end || '17:00') : '',
// //       });
// //       return;
// //     }

// //     switch (field) {
// //       case 'status': {
// //         const nextStatus = value as ShiftStatus;
// //         if (nextStatus === 'working') {
// //           const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;
// //           setCellSchedule(employeeId, day, {
// //             status: 'working',
// //             start: sch.start || tpl?.start || '09:00',
// //             end: sch.end || tpl?.end || '17:00',
// //           });
// //         } else {
// //           setCellSchedule(employeeId, day, { status: nextStatus, start: '', end: '', template: nextStatus==='off'? null : sch.template });
// //         }
// //         break;
// //       }
// //       case 'startTime': setCellSchedule(employeeId, day, { start: value, status: 'working' }); break;
// //       case 'endTime': setCellSchedule(employeeId, day, { end: value, status: 'working' }); break;
// //       case 'remarks': setCellSchedule(employeeId, day, { notes: value }); break;
// //       case 'changeShift': setCellSchedule(employeeId, day, { isCustom: !!(value as boolean) }); break;
// //       default: break;
// //     }
// //   };

// //   /* ================= Save (scoped) ================= */

// //   // common builder from *row IDs*
// //   const buildItemsFromRowIds = (rowIds: string[]) => {
// //     type Item = {
// //       employee_id: number;
// //       day: number;
// //       status: ShiftStatus;
// //       start: string | null;
// //       end: string | null;
// //       break_mins: number;
// //       overnight: boolean;
// //       template_id: number | null;
// //       notes: string;
// //       pattern_id: number | null;
// //     };
// //     const items: Item[] = [];
// //     const uniq = new Set(rowIds);

// //     for (const rid of uniq) {
// //       const [empIdStr, dayStr] = rid.split('-');
// //       const empId = Number(empIdStr);
// //       const d = Number(dayStr);
// //       if (!Number.isInteger(empId) || empId <= 0 || !Number.isInteger(d) || d <= 0) continue;

// //       const sch = getCellSchedule(empId, d);
// //       const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;
// //       const isWorking = sch.status === 'working';

// //       items.push({
// //         employee_id: empId,
// //         day: d,
// //         status: sch.status,
// //         start: isWorking ? (sch.start ?? tpl?.start ?? null) : null,
// //         end:   isWorking ? (sch.end   ?? tpl?.end   ?? null) : null,
// //         break_mins: isWorking ? (sch.break_mins ?? tpl?.break_mins ?? 0) : 0,
// //         overnight:  isWorking ? Boolean(sch.overnight ?? tpl?.overnight) : false,
// //         template_id: isWorking ? (sch.template ?? null) : null,
// //         notes: sch.notes || '',
// //         pattern_id: sch.pattern_id ?? null,
// //       });
// //     }
// //     return items;
// //   };

// //   // scope helpers for SAVE/APPLY
// //   const getRowIdsForScope = (scope: 'selected' | 'page' | 'all') => {
// //     if (scope === 'selected') return Array.from(selectedRowIds);
// //     if (scope === 'page') return paginatedData.map(r => r.id);
// //     return rowsFilteredByDateStatus.map(r => r.id); // 'all'
// //   };

// //   // BUILD rowIds set for CHANGED scope
// //   const getChangedRowIdsForCurrentMonth = () => {
// //     const ids: string[] = [];
// //     for (const key of Array.from(changedKeys)) {
// //       const m = KEY_RE.exec(key);
// //       if (!m) continue;
// //       const [, empIdStr, yStr, moStr, dStr] = m;
// //       const y = Number(yStr), mo = Number(moStr);
// //       if (y === selectedYear && mo === selectedMonth) {
// //         ids.push(`${empIdStr}-${dStr}`);
// //       }
// //     }
// //     return ids;
// //   };

// //   const saveScoped = async (scope: SaveScope) => {
// //     type Item = ReturnType<typeof buildItemsFromRowIds>[number];

// //     let rowIds: string[] = [];
// //     if (scope === 'changed') {
// //       rowIds = getChangedRowIdsForCurrentMonth();
// //     } else {
// //       rowIds = getRowIdsForScope(scope);
// //     }

// //     if (rowIds.length === 0) {
// //       setSaveError('Nothing to save for the selected scope.');
// //       return;
// //     }

// //     const items: Item[] = buildItemsFromRowIds(rowIds);

// //     // chunked write
// //     const CHUNK_SIZE = 100;
// //     let successCount = 0;
// //     let errorCount = 0;
// //     const errors: string[] = [];

// //     for (let i = 0; i < items.length; i += CHUNK_SIZE) {
// //       const chunk = items.slice(i, i + CHUNK_SIZE);
// //       const chunkNumber = Math.floor(i / CHUNK_SIZE) + 1;
// //       const totalChunks = Math.ceil(items.length / CHUNK_SIZE);

// //       try {
// //         const res = await fetch(`${API_BASE_URL}/api/schedules/bulk`, {
// //           method: 'POST',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify({
// //             year: selectedYear,
// //             month: selectedMonth + 1,
// //             items: chunk
// //           }),
// //         });

// //         if (!res.ok) {
// //           let detail = '';
// //           try { detail = (await res.json()).error || ''; } catch {}
// //           const errorMsg = `Chunk ${chunkNumber}/${totalChunks} failed: HTTP ${res.status}${detail ? ` — ${detail}` : ''}`;
// //           errors.push(errorMsg);
// //           console.error(errorMsg);
// //           errorCount += chunk.length;
// //         } else {
// //           successCount += chunk.length;
// //         }
// //       } catch (err: any) {
// //         const errorMsg = `Chunk ${chunkNumber}/${totalChunks} failed: ${err.message || 'Network error'}`;
// //         errors.push(errorMsg);
// //         console.error(errorMsg);
// //         errorCount += chunk.length;
// //       }
// //     }

// //     if (errorCount > 0) {
// //       throw new Error(
// //         `Saved ${successCount} items, but ${errorCount} failed. ` +
// //         `First error: ${errors[0]}${errors.length > 1 ? ` (+${errors.length - 1} more)` : ''}`
// //       );
// //     }

// //     // success -> refresh and clear dirty
// //     await fetchSchedules(
// //       baseFilteredEmployees.map(e => e.id),
// //       monthDateToISO(selectedYear, selectedMonth, 1),
// //       monthDateToISO(selectedYear, selectedMonth, daysInMonth(selectedYear, selectedMonth))
// //     );
// //     setDirty(false);
// //     setChangedKeys(new Set());
// //     setLastSavedAt(new Date().toLocaleString());
// //   };

// //   const handleSave = async () => {
// //     try {
// //       setSaving(true);
// //       setSaveError('');
// //       await saveScoped(saveScope);
// //     } catch (err: any) {
// //       console.error(err);
// //       setSaveError(err?.message || 'Failed to save.');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   /* ===================== Export ================= */
// //   const handleExportExcel = async () => {
// //     const XLSX = await import('xlsx'); // npm i xlsx

// //     const wb = XLSX.utils.book_new();
// //     const usedNames = new Set<string>();
// //     const sanitizeSheetName = (raw: string) => {
// //       let base = (raw || '').replace(/[\\/?*[\]:]/g, '').slice(0, 31) || 'Sheet';
// //       let name = base;
// //       let i = 1;
// //       while (usedNames.has(name)) {
// //         const tail = `_${i++}`;
// //         name = (base.slice(0, Math.max(0, 31 - tail.length)) + tail);
// //       }
// //       usedNames.add(name);
// //       return name;
// //     };

// //     const header = [
// //       'no', 'employeeid', 'name', 'date', 'total hours',
// //       'start time', 'end time', 'status', 'is working day', 'pattern', 'template', 'remark'
// //     ];

// //     for (const emp of baseFilteredEmployees) {
// //       const rows: any[] = [];
// //       let n = 1;

// //       for (let d = 1; d <= totalDays; d++) {
// //         const iso = monthDateToISO(selectedYear, selectedMonth, d);
// //         if (iso < dateFrom || iso > dateTo) continue;

// //         const sch = getCellSchedule(emp.id, d);
// //         const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;
// //         const net = sch.status === 'working'
// //           ? calcNetHours(sch.start, sch.end, sch.overnight ?? tpl?.overnight, sch.break_mins ?? tpl?.break_mins)
// //           : 0;
// //         const patternName = sch.pattern_id ? (patterns.find(p => p.id === sch.pattern_id)?.name ?? '') : '';

// //         rows.push({
// //           'no': n++,
// //           'employeeid': emp.id,
// //           'name': emp.name,
// //           'date': toDisplayDate(iso),
// //           'total hours': Number(net.toFixed(2)),
// //           'start time': sch.start || '',
// //           'end time': sch.end || '',
// //           'status': sch.status,
// //           'is working day': sch.status === 'working' ? 'Yes' : 'No',
// //           'pattern': patternName,
// //           'template': tpl?.name ?? '',
// //           'remark': sch.notes || ''
// //         });
// //       }

// //       const ws = XLSX.utils.json_to_sheet(rows, { header });
// //       const colWidths = header.map((key, colIdx) => {
// //         const maxCell = Math.max(key.length, ...rows.map(r => String(r[key] ?? '').length));
// //         return { wch: Math.min(Math.max(10, maxCell + 2), 40) };
// //       });
// //       (ws as any)['!cols'] = colWidths;

// //       XLSX.utils.book_append_sheet(wb, ws, sanitizeSheetName(emp.name));
// //     }

// //     const fileName = `Schedule_${new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).replace(' ', '_')}.xlsx`;
// //     XLSX.writeFile(wb, fileName);
// //   };

// //   /* ===================== Modals: Custom Time, Template, Pattern ===================== */
 
 
// //   const CustomTimeModal = () => {
// //     const [start, setStart] = useState<string>('09:00');
// //     const [end, setEnd] = useState<string>('17:00');
// //     const [breakMins, setBreakMins] = useState<number>(60);
// //     const [overnight, setOvernight] = useState<boolean>(false);
// //     const [notes, setNotes] = useState<string>('');

// //     useEffect(() => {
// //       if (!editingCell) return;
// //       const sch = getCellSchedule(editingCell.employeeId, editingCell.day);
// //       if (sch.status === 'working') {
// //         setStart(sch.start || '09:00');
// //         setEnd(sch.end || '17:00');
// //         setBreakMins(sch.break_mins ?? 60);
// //         setOvernight(!!sch.overnight);
// //         setNotes(sch.notes || '');
// //       } else {
// //         setStart('09:00'); setEnd('17:00'); setBreakMins(60); setOvernight(false); setNotes('');
// //       }
// //     }, [editingCell?.employeeId, editingCell?.day, showCustomTimeModal]);

// //     if (!showCustomTimeModal || !editingCell) return null;

// //     return (
// //       <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
// //         <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
// //           <div className="flex items-center justify-between border-b px-6 py-4">
// //             <div className="flex items-center gap-3">
// //               <div className="p-2 bg-blue-100 rounded-lg"><Clock className="w-5 h-5 text-blue-600" /></div>
// //               <div>
// //                 <h3 className="text-lg font-semibold">Custom Time</h3>
// //                 <p className="text-sm text-gray-500">Set custom hours</p>
// //               </div>
// //             </div>
// //             <button onClick={() => setShowCustomTimeModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
// //               <X className="w-5 h-5 text-gray-400" />
// //             </button>
// //           </div>

// //           <div className="p-6 space-y-6">
// //             <div className="grid grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium mb-2">Start Time</label>
// //                 <input type="time" className="input input-bordered w-full" value={start} onChange={(e) => setStart(e.target.value)} />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium mb-2">End Time</label>
// //                 <input type="time" className="input input-bordered w-full" value={end} onChange={(e) => setEnd(e.target.value)} />
// //               </div>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium mb-2">Break (mins)</label>
// //               <input type="number" className="input input-bordered w-full" min={0} step={15} value={breakMins} onChange={(e) => setBreakMins(parseInt(e.target.value || '0', 10))} />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium mb-2">Notes</label>
// //               <textarea className="textarea textarea-bordered w-full" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
// //             </div>

// //             <div className="flex items-center gap-3">
// //               <input id="overnight" type="checkbox" className="checkbox checkbox-primary" checked={overnight} onChange={(e) => setOvernight(e.target.checked)} />
// //               <label htmlFor="overnight" className="text-sm">Overnight shift</label>
// //             </div>

// //             <div className="text-sm text-gray-600">
// //               Net hours:&nbsp;<span className="font-semibold">{formatHours(calcNetHours(start, end, overnight, breakMins))}</span>
// //             </div>
// //           </div>

// //           <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
// //             <button className="btn btn-ghost" onClick={() => setShowCustomTimeModal(false)}>Cancel</button>
// //             <button
// //               className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
// //               onClick={() => {
// //                 const { employeeId, day } = editingCell;
// //                 setCellSchedule(employeeId, day, {
// //                   status: 'working',
// //                   start, end, isCustom: true, notes, template: null,
// //                   break_mins: breakMins, overnight
// //                 });
// //                 setShowCustomTimeModal(false);
// //               }}
// //             >
// //               Apply
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   const TemplateModal = () => {
// //     const isEdit = !!editingTemplate;
// //     const [form, setForm] = useState<ShiftTemplate>(() => editingTemplate ?? {
// //       id: 0, name: '', start: '09:00', end: '17:00',
// //       color: labelToColor('Office'), label: 'Office', break_mins: 60, overnight: false, description: ''
// //     });

// //     useEffect(() => { if (editingTemplate) setForm(editingTemplate); }, [editingTemplate]);

// //     if (!showTemplateModal) return null;
// //     const total = calculateHours(form.start, form.end, !!form.overnight);
// //     const net = Math.max(0, total - (form.break_mins ?? 0) / 60);

// //     const save = async () => {
// //       try {
// //         if (isEdit) {
// //           const res = await fetch(`${API_BASE_URL}/api/schedules/templates/${form.id}`, {
// //             method: 'PUT',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify({
// //               name: form.name,
// //               start_time: form.start,
// //               end_time: form.end,
// //               break_mins: form.break_mins,
// //               overnight: !!form.overnight,
// //               label: form.label,
// //               description: form.description
// //             })
// //           });
// //           if (!res.ok) throw new Error(`Update template HTTP ${res.status}`);
// //           setShiftTemplates(prev => prev.map(t => t.id === form.id ? { ...form, color: labelToColor(form.label || undefined) } : t));
// //         } else {
// //           const res = await fetch(`${API_BASE_URL}/api/schedules/templates`, {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify({
// //               name: form.name,
// //               start_time: form.start,
// //               end_time: form.end,
// //               break_mins: form.break_mins,
// //               overnight: !!form.overnight,
// //               label: form.label,
// //               description: form.description
// //             })
// //           });
// //           if (!res.ok) throw new Error(`Create template HTTP ${res.status}`);
// //           const data = await res.json();
// //           const newTemplate: ShiftTemplate = { ...form, id: data.id, color: labelToColor(form.label || undefined) };
// //           setShiftTemplates(prev => [...prev, newTemplate]);
// //         }
// //         setShowTemplateModal(false);
// //         setEditingTemplate(null);
// //       } catch (e) {
// //         console.error(e);
// //         alert('Failed to save template');
// //       }
// //     };

// //     return (
// //       <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
// //         <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
// //           <div className="flex items-center justify-between border-b px-6 py-4">
// //             <div className="flex items-center gap-3">
// //               <div className="p-2 bg-green-100 rounded-lg"><Clock className="w-5 h-5 text-green-600" /></div>
// //               <div>
// //                 <h3 className="text-lg font-semibold">{isEdit ? 'Edit Shift Template' : 'Create Shift Template'}</h3>
// //                 <p className="text-sm text-gray-500">Reusable shift schedules</p>
// //               </div>
// //             </div>
// //             <button onClick={() => { setShowTemplateModal(false); setEditingTemplate(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
// //               <X className="w-5 h-5 text-gray-400" />
// //             </button>
// //           </div>

// //           <div className="p-6 space-y-6">
// //             <div className="grid grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium mb-2">Template Name</label>
// //                 <input className="input input-bordered w-full" value={form.name} onChange={(e)=>setForm(p=>({...p,name:e.target.value}))}/>
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium mb-2">Label/Category</label>
// //                 <input className="input input-bordered w-full" value={form.label ?? ''} onChange={(e)=>setForm(p=>({...p,label:e.target.value, color: labelToColor(e.target.value)}))}/>
// //               </div>
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium mb-2">Description</label>
// //               <textarea className="textarea textarea-bordered w-full" rows={2} value={form.description ?? ''} onChange={(e)=>setForm(p=>({...p,description:e.target.value}))}/>
// //             </div>

// //             <div className="grid grid-cols-3 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium mb-2">Start</label>
// //                 <input type="time" className="input input-bordered w-full" value={form.start} onChange={(e)=>setForm(p=>({...p,start:e.target.value}))}/>
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium mb-2">End</label>
// //                 <input type="time" className="input input-bordered w-full" value={form.end} onChange={(e)=>setForm(p=>({...p,end:e.target.value}))}/>
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium mb-2">Break (mins)</label>
// //                 <input type="number" className="input input-bordered w-full" min={0} step={15} value={form.break_mins} onChange={(e)=>setForm(p=>({...p,break_mins:parseInt(e.target.value||'0',10)}))}/>
// //               </div>
// //             </div>

// //             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
// //               <div className="flex items-center gap-2">
// //                 <input id="tpl-overnight" type="checkbox" className="checkbox checkbox-primary" checked={!!form.overnight} onChange={(e)=>setForm(p=>({...p,overnight:e.target.checked}))}/>
// //                 <label htmlFor="tpl-overnight" className="text-sm font-medium">Overnight Shift</label>
// //               </div>
// //               <div className="text-right">
// //                 <div className="text-sm font-medium">Gross: {formatHours(total)}</div>
// //                 <div className="text-xs text-gray-500">Net: {formatHours(net)}</div>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
// //             <button className="btn btn-ghost" onClick={() => { setShowTemplateModal(false); setEditingTemplate(null); }}>Cancel</button>
// //             <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={save}>
// //               <Save className="w-4 h-4 mr-2" /> {isEdit ? 'Save Changes' : 'Create Template'}
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   const PatternModal = () => {

// //     interface WorkPatternForm extends Omit<WorkPattern, 'meta'> {
// //       meta: PatternMeta; // non-optional in the form state
// //     }

// //   // 1.  which day index is waiting for confirmation
// //   const [pendingRemove, setPendingRemove] = useState<number | null>(null);

// //   // 2.  open confirmation
// //   const askRemoveDay = (idx: number) => {
// //     if (form.sequence.length === 1) return; // keep at least one day
// //     setPendingRemove(idx);
// //   };

// //   // 3.  confirmed → remove
// //   const confirmRemoveDay = () => {
// //     if (pendingRemove === null) return;
// //     removeDay(pendingRemove);
// //     setPendingRemove(null);
// //   };

// //     const isEdit = !!editingPattern;

// //     type SeqItem = WorkPattern['sequence'][number];
// //     const isWork = (s: SeqItem): s is Extract<SeqItem, { type: 'work' }> => s.type === 'work';

// //     const DEFAULT_META: PatternMeta = {
// //       align: 'next-monday',
// //       weekendPolicy: 'weekends-off',
// //       weekendDays: [6, 0], // Sat & Sun
// //     };

// //     const [form, setForm] = useState<WorkPatternForm>(() =>
// //       editingPattern
// //         ? {
// //             ...editingPattern,
// //             meta: editingPattern.meta ?? DEFAULT_META,
// //           }
// //         : {
// //             id: 0,
// //             name: '',
// //             description: '',
// //             sequence: [shiftTemplates[0] ? { type: 'work', template: shiftTemplates[0].id } : { type: 'off' }],
// //             meta: DEFAULT_META,
// //           }
// //     );

// //     useEffect(() => {
// //       if (editingPattern) {
// //         setForm({
// //           ...editingPattern,
// //           meta: editingPattern.meta ?? DEFAULT_META,
// //         });
// //       }
// //     }, [editingPattern]);

// //     const addDay = () =>
// //       setForm(prev => {
// //         const next: SeqItem = shiftTemplates[0]
// //           ? { type: 'work', template: shiftTemplates[0].id }
// //           : ({ type: 'off' } as SeqItem);
// //         return { ...prev, sequence: [...prev.sequence, next] };
// //       });

// //     const removeDay = (idx: number) =>
// //       setForm(prev => ({ ...prev, sequence: prev.sequence.filter((_, i) => i !== idx) }));

// //     const changeType = (idx: number, val: 'work' | 'off') =>
// //       setForm(prev => {
// //         const seq = [...prev.sequence] as SeqItem[];
// //         if (val === 'off') {
// //           seq[idx] = { type: 'off' } as SeqItem;
// //         } else {
// //           const current = seq[idx];
// //           const tplId = isWork(current) ? current.template : (shiftTemplates[0]?.id ?? 0);
// //           seq[idx] = tplId ? ({ type: 'work', template: tplId } as SeqItem) : ({ type: 'off' } as SeqItem);
// //         }
// //         return { ...prev, sequence: seq };
// //       });

// //     const changeTpl = (idx: number, tplId: number) =>
// //       setForm(prev => {
// //         const seq = [...prev.sequence] as SeqItem[];
// //         seq[idx] = { type: 'work', template: tplId } as SeqItem;
// //         return { ...prev, sequence: seq };
// //       });

// //     if (!showPatternModal) return null;

// //     const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// //     const jsDowFromMonIndex = (i: number) => [1, 2, 3, 4, 5, 6, 0][i % 7];

// //     const previewDays: SeqItem[] = (() => {
// //       const out: SeqItem[] = [];
// //       if (!form.sequence.length) return out;
// //       let stepIndex = 0;
// //       for (let i = 0; i < 28; i++) {
// //         const jsDow = jsDowFromMonIndex(i);
// //         const isWknd = (form.meta?.weekendPolicy ?? DEFAULT_META.weekendPolicy) === 'weekends-off'
// //           && (form.meta?.weekendDays ?? DEFAULT_META.weekendDays).includes(jsDow);
// //         if (isWknd) {
// //           out.push({ type: 'off' } as SeqItem);
// //           continue;
// //         }
// //         const step = form.sequence[stepIndex % form.sequence.length];
// //         out.push(step);
// //         stepIndex++;
// //       }
// //       return out;
// //     })();

// //     const save = async () => {
// //       try {
// //         const payload = {
// //           name: form.name,
// //           description: form.description ?? null,
// //           sequence: form.sequence.map(s =>
// //             isWork(s) ? { type: 'work', template: s.template } : { type: 'off' }
// //           ),
// //           meta: form.meta ?? DEFAULT_META,
// //         };

// //         if (isEdit) {
// //           const res = await fetch(`${API_BASE_URL}/api/schedules/patterns/${form.id}`, {
// //             method: 'PUT',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify(payload),
// //           });
// //           if (!res.ok) throw new Error(`Update pattern HTTP ${res.status}`);
// //           setPatterns(prev => prev.map(p => (p.id === form.id ? { ...form } : p)));
// //         } else {
// //           const res = await fetch(`${API_BASE_URL}/api/schedules/patterns`, {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify(payload),
// //           });
// //           if (!res.ok) throw new Error(`Create pattern HTTP ${res.status}`);
// //           const data = await res.json();
// //           setPatterns(prev => [...prev, { ...form, id: data.id }]);
// //         }

// //         setShowPatternModal(false);
// //         setEditingPattern(null);
// //       } catch (e) {
// //         console.error(e);
// //         alert('Failed to save pattern');
// //       }
// //     };

// //   return (
// //     <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
// //       <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
// //         {/* Header */}
// //         <div className="flex items-center justify-between border-b px-4 sm:px-6 py-4">
// //           <div className="flex items-center gap-3">
// //             <div className="p-2 bg-green-100 rounded-lg">
// //               <Settings className="w-5 h-5 text-green-600" />
// //             </div>
// //             <div>
// //               <h3 className="text-lg font-semibold">{isEdit ? 'Edit Pattern' : 'Create Pattern'}</h3>
// //               <p className="text-sm text-gray-500">Define a repeating sequence of work/off days</p>
// //             </div>
// //           </div>
// //           <button
// //             onClick={() => {
// //               setShowPatternModal(false);
// //               setEditingPattern(null);
// //             }}
// //             className="p-2 hover:bg-gray-100 rounded-lg"
// //           >
// //             <X className="w-5 h-5 text-gray-400" />
// //           </button>
// //         </div>

// //         {/* Content - Stack on mobile, side-by-side on larger screens */}
// //         <div className="flex-1 overflow-auto flex flex-col lg:flex-row">
// //           {/* Left: Form */}
// //           <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r p-4 sm:p-6 overflow-y-auto">
// //             <div className="space-y-4 sm:space-y-6">
// //               <div>
// //                 <label className="block text-sm font-medium mb-2">Pattern Name</label>
// //                 <input
// //                   className="input input-bordered w-full"
// //                   value={form.name}
// //                   onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium mb-2">Description</label>
// //                 <textarea
// //                   className="textarea textarea-bordered w-full"
// //                   rows={3}
// //                   value={form.description ?? ''}
// //                   onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
// //                 />
// //               </div>

// //               {/* Application Rules */}
// //               <div className="border rounded-lg p-4 bg-gray-50">
// //                 <h4 className="font-semibold mb-3">Application rules</h4>
// //                 <div className="grid gap-4">
// //                   <div>
// //                     <label className="block text-sm font-medium mb-1">Alignment</label>
// //                     <select
// //                       className="select select-bordered select-sm w-full"
// //                       value={form.meta?.align ?? 'next-monday'}
// //                       onChange={e =>
// //                         setForm(p => ({
// //                           ...p,
// //                           meta: { ...p.meta, align: e.target.value as AlignMode },
// //                         }))
// //                       }
// //                     >
// //                       <option value="range-start">Start at selected range start</option>
// //                       <option value="next-monday">Start on next Monday</option>
// //                     </select>
// //                     <p className="text-xs text-gray-500 mt-1">
// //                       "Start on next Monday" keeps 5/2 patterns aligned to Mon-Fri.
// //                     </p>
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium mb-1">Weekend handling</label>
// //                     <select
// //                       className="select select-bordered select-sm w-full"
// //                       value={form.meta?.weekendPolicy ?? 'weekends-off'}
// //                       onChange={e =>
// //                         setForm(p => ({
// //                           ...p,
// //                           meta: { ...p.meta, weekendPolicy: e.target.value as WeekendPolicy },
// //                         }))
// //                       }
// //                     >
// //                       <option value="ignore">Ignore (apply every day)</option>
// //                       <option value="weekends-off">Weekends Off (don't advance pattern)</option>
// //                     </select>

// //                     {(form.meta?.weekendPolicy ?? 'weekends-off') === 'weekends-off' && (
// //                       <div className="mt-2">
// //                         <label className="block text-sm font-medium mb-1">Weekend days</label>
// //                         <select
// //                           className="select select-bordered select-sm w-full"
// //                           value={JSON.stringify(form.meta?.weekendDays ?? [6,0])}
// //                           onChange={e =>
// //                             setForm(p => ({
// //                               ...p,
// //                               meta: { ...p.meta, weekendDays: JSON.parse(e.target.value) as number[] },
// //                             }))
// //                           }
// //                         >
// //                           <option value="[6,0]">Saturday & Sunday</option>
// //                           <option value="[5,6]">Friday & Saturday</option>
// //                           <option value="[0]">Sunday only</option>
// //                           <option value="[6]">Saturday only</option>
// //                         </select>
// //                         <p className="text-xs text-gray-500 mt-1">
// //                           Choose how weekends are defined for your company/site.
// //                         </p>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Sequence editor */}
// //               <div>
// // {/* Sequence — wider cards, no horizontal scroll, menus visible */}
// // <div>
// //   <label className="block text-sm font-medium mb-3">Sequence</label>

// //   {/* Fewer columns at desktop so each card is wider */}
// //   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
// //     {form.sequence.map((step, idx) => (
// //       <div
// //         key={idx}
// //         className="rounded-xl border bg-white p-4 shadow-sm space-y-3 min-w-0 relative z-10"
// //       >
// //         {/* Header */}
// //         <div className="flex items-center justify-between">
// //           <span className="text-sm font-semibold text-gray-700">
// //             Day {idx + 1}
// //           </span>
// // <button
// //   type="button"
// //   className="btn btn-ghost btn-xs text-red-600"
// //   onClick={() => askRemoveDay(idx)}
// //   aria-label={`Remove Day ${idx + 1}`}
// // >
// //   <Trash2 className="w-4 h-4" />
// // </button>
// //         </div>

// //         {/* Segmented toggle — full width, stable */}
// //         <div className="join w-full">
// //           <button
// //             type="button"
// //             className={`btn btn-md join-item basis-1/2 grow min-w-0 ${
// //               step.type === 'work' ? 'btn bg-blue-600 hover:bg-blue-700 text-white border-0' : 'btn-outline'
// //             }`}
// //             onClick={() => changeType(idx, 'work')}
// //           >
// //             Work
// //           </button>
// //           <button
// //             type="button"
// //             className={`btn btn-md join-item basis-1/2 grow min-w-0 ${
// //               step.type === 'off' ? 'btn bg-blue-600 hover:bg-blue-700 text-white border-0' : 'btn-outline'
// //             }`}
// //             onClick={() => changeType(idx, 'off')}
// //           >
// //             Off
// //           </button>
// //         </div>

// //         {/* Template select for Work only — full width */}
// //         {step.type === 'work' ? (
// //           <div>
// //             <label className="block text-xs text-gray-500 mb-1">Template</label>
// //             <select
// //               className="select select-bordered select-md w-full"
// //               value={String((step as PatternStepWork).template)}
// //               onChange={(e) => changeTpl(idx, parseInt(e.target.value, 10))}
// //               aria-label="Shift Template"
// //             >
// //               {shiftTemplates.length ? (
// //                 shiftTemplates.map((t) => (
// //                   <option key={t.id} value={t.id}>
// //                     {t.name}
// //                   </option>
// //                 ))
// //               ) : (
// //                 <option value="">No templates available</option>
// //               )}
// //             </select>
// //           </div>
// //         ) : (
// //           <div className="text-xs text-gray-500">Day Off</div>
// //         )}
// //       </div>
// //     ))}
// //   </div>

// //   <button className="btn btn-md btn-outline w-full mt-3" onClick={addDay}>
// //     <Plus className="w-4 h-4" />
// //     Add Day
// //   </button>
// // </div>



// //               </div>
// //             </div>
// //           </div>

// //           {/* Right: Preview */}
// //           <div className="w-full lg:w-2/3 p-4 sm:p-6 overflow-y-auto">
// //             <h4 className="text-lg font-semibold mb-4">Preview (28 days)</h4>

// //             <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
// //               {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => {
// //                 const jsd = [1,2,3,4,5,6,0][i];
// //                 const isWknd =
// //                   (form.meta?.weekendPolicy ?? 'weekends-off') === 'weekends-off' &&
// //                   (form.meta?.weekendDays ?? [6,0]).includes(jsd);
// //                 return (
// //                   <div
// //                     key={d}
// //                     className={`text-center text-xs font-medium px-1 sm:px-2 py-1 rounded ${
// //                       isWknd ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-700'
// //                     }`}
// //                   >
// //                     {d}
// //                   </div>
// //                 );
// //               })}
// //             </div>

// //             <div className="grid grid-cols-7 gap-1 sm:gap-2">
// //               {previewDays.map((step, i) => {
// //                 const jsd = [1,2,3,4,5,6,0][i % 7];
// //                 const isWeekend =
// //                   (form.meta?.weekendPolicy ?? 'weekends-off') === 'weekends-off' &&
// //                   (form.meta?.weekendDays ?? [6,0]).includes(jsd);

// //                 const tpl = step.type === 'work'
// //                   ? shiftTemplates.find(t => t.id === (step as PatternStepWork).template)
// //                   : undefined;

// //                 return (
// //                   <div key={i} className={`border rounded p-1 sm:p-2 ${isWeekend ? 'bg-red-50' : ''}`}>
// //                     <div className="text-[10px] sm:text-[11px] font-medium text-gray-600 mb-1">
// //                       {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i % 7].slice(0, 1)} • {i + 1}
// //                     </div>
// //                     {step.type === 'work' && tpl ? (
// //                       <div className={`text-[10px] sm:text-xs p-1 sm:p-2 rounded text-center ${tpl.color}`}>
// //                         <div className="font-medium">{tpl.start}</div>
// //                         <div>{tpl.end}</div>
// //                       </div>
// //                     ) : (
// //                       <div className="text-[10px] sm:text-xs text-gray-400 text-center p-1 sm:p-2">Off</div>
// //                     )}
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Footer */}
// //         <div className="flex justify-end gap-3 border-t px-4 sm:px-6 py-4 bg-gray-50">
// //           <button
// //             className="btn btn-ghost"
// //             onClick={() => {
// //               setShowPatternModal(false);
// //               setEditingPattern(null);
// //             }}
// //           >
// //             Cancel
// //           </button>
// //           <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={save}>
// //             <Save className="w-4 h-4 mr-2" /> {isEdit ? 'Save Changes' : 'Create Pattern'}
// //           </button>
// //         </div>
// //       </div>

// // {/* Confirm remove day */}
// // {pendingRemove !== null && (
// //   <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
// //     <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
// //       <h4 className="font-semibold text-gray-900 mb-2">Remove this day?</h4>
// //       <p className="text-sm text-gray-600 mb-4">
// //         Day {pendingRemove + 1} will be removed from the sequence.
// //       </p>
// //       <div className="flex justify-end gap-3">
// //         <button
// //           className="btn btn-ghost btn-sm"
// //           onClick={() => setPendingRemove(null)}
// //         >
// //           Cancel
// //         </button>
// //         <button
// //           className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-0"
// //           onClick={confirmRemoveDay}
// //         >
// //           Remove
// //         </button>
// //       </div>
// //     </div>
// //   </div>
// // )}

// //     </div>
// //   );
// // };


// //   /* ===================== Remarks draft buffer ===================== */
// //   const [remarkDrafts, setRemarkDrafts] = useState<Record<string, string>>({});
// //   const handleRemarkInput = (rowId: string, val: string) => {
// //     setRemarkDrafts(prev => ({ ...prev, [rowId]: val }));
// //   };
// //   const commitRemark = (rowId: string) => {
// //     const draft = remarkDrafts[rowId];
// //     if (draft === undefined) return;
// //     updateScheduleItem(rowId, 'remarks', draft);
// //   };

// //   /* ===================== Quick Apply (compact) ===================== */
// //   const QuickApplySelect: React.FC<{ rowId: string; employeeId: number; day: number; }> = ({ rowId, employeeId, day }) => {
// //     return (
// //       <select
// //         className="select select-xs w-48"
// //         defaultValue=""
// //         onChange={(e) => {
// //           const val = e.target.value;
// //           if (!val) return;

// //           if (val === 'custom:time') {
// //             setEditingCell({ employeeId, day });
// //             setShowCustomTimeModal(true);
// //             e.currentTarget.value = '';
// //             return;
// //           }

// //           const [kind, idStr] = val.split(':'); // tpl:ID or pat:ID
// //           const id = parseInt(idStr, 10);
// //           if (kind === 'tpl') {
// //             const tpl = shiftTemplates.find(t => t.id === id);
// //             if (tpl) {
// //               setCellSchedule(employeeId, day, {
// //                 status: 'working',
// //                 start: tpl.start,
// //                 end: tpl.end,
// //                 template: tpl.id,
// //                 isCustom: false,
// //                 break_mins: tpl.break_mins,
// //                 overnight: tpl.overnight
// //               });
// //             }
// //           } else if (kind === 'pat') {
// //             // Apply pattern across current date range but only for this employee
// //             applyPatternRange([employeeId], id, dateFrom, dateTo);
// //           }

// //           e.currentTarget.value = '';
// //         }}
// //       >
// //         <option value="">Quick…</option>
// //         <optgroup label="Templates">
// //           {shiftTemplates.map(t => (
// //             <option key={`tpl-${t.id}`} value={`tpl:${t.id}`}>{t.name}</option>
// //           ))}
// //         </optgroup>
// //         <optgroup label="Patterns (range)">
// //           {patterns.map(p => (
// //             <option key={`pat-${p.id}`} value={`pat:${p.id}`}>{p.name}</option>
// //           ))}
// //         </optgroup>
// //         <option value="custom:time">Custom time…</option>
// //       </select>
// //     );
// //   };

// //   /* ===================== Filters & Settings ===================== */
// //   const resetFilters = () => {
// //     setSelectedCompany('All');
// //     setSelectedDepartment('All');
// //     setSelectedEmployeeId('All');
// //     setSelectedStatus('All');
// //     setSearchTerm('');
// //     setDateFrom(monthDateToISO(selectedYear, selectedMonth, 1));
// //     setDateTo(monthDateToISO(selectedYear, selectedMonth, totalDays));
// //     setTablePage(1);
// //     setSelectedRowIds(new Set());
// //   };

// //   // scopes for bulk
// //   const idsOnPage = Array.from(new Set(paginatedData.map(r => r.employeeId)));
// //   const idsAll = baseFilteredEmployees.map(e => e.id); // within company/department/employee filters

// //   const applyBulkTime = () => {
// //     if (bulkScope === 'selected') {
// //       const rowIds = Array.from(selectedRowIds);
// //       patchRowsTime(rowIds, bulkStart, bulkEnd);
// //     } else if (bulkScope === 'page') {
// //       patchRowsTime(pageRowIds, bulkStart, bulkEnd);
// //     } else {
// //       patchRowsTime(rowsFilteredByDateStatus.map(r => r.id), bulkStart, bulkEnd);
// //     }
// //   };
// //   const applyBulkTemplate = () => {
// //     if (!templateToApply) return;
// //     const tplId = Number(templateToApply);
// //     if (bulkScope === 'selected') {
// //       patchRowsTemplate(Array.from(selectedRowIds), tplId);
// //     } else if (bulkScope === 'page') {
// //       patchRowsTemplate(pageRowIds, tplId);
// //     } else {
// //       patchRowsTemplate(rowsFilteredByDateStatus.map(r => r.id), tplId);
// //     }
// //   };
// //   const applyBulkPattern = () => {
// //     if (!patternToApply) return;
// //     const patId = Number(patternToApply);
// //     // patterns apply across continuous date range per employee (page/all)
// //     const ids = bulkScope === 'page' ? idsOnPage : idsAll;
// //     applyPatternRange(ids, patId, dateFrom, dateTo);
// //   };

// //   /* ===================== Table View ===================== */
// //   const ScheduleListTable = () => (
// //     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
// //       {/* ======  NEW: Search + Filters (Scheduler only)  ====== */}
// //       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3 border-b bg-gray-50">
// //         <div className="flex items-center gap-3 w-full md:w-auto">
// //           {/* Search */}
// //           <div className="relative flex-1 max-w-2xl min-w-[260px]">
// //             <input
// //               className="input input-bordered input-sm w-full pl-9 pr-9 rounded-lg shadow-sm
// //                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               placeholder="Name, employee no., or department…"
// //               value={searchTerm}
// //               onChange={(e) => { setSearchTerm(e.target.value); setTablePage(1); }}
// //             />
// //             <svg
// //               className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
// //               viewBox="0 0 24 24" fill="none"
// //             >
// //               <path stroke="currentColor" strokeWidth="2" d="m21 21-4.3-4.3M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
// //             </svg>
// //             {searchTerm && (
// //               <button
// //                 type="button"
// //                 onClick={() => { setSearchTerm(''); setTablePage(1); }}
// //                 className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-xs btn-ghost"
// //                 aria-label="Clear search"
// //               >
// //                 ×
// //               </button>
// //             )}
// //           </div>

// //           <button
// //             onClick={() => setShowFilters(s => !s)}
// //             className={`btn btn-sm border border-gray-300 ${showFilters ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-white text-gray-700'}`}
// //           >
// //             <Filter className="w-4 h-4" /> Filters
// //           </button>
// //         </div>
// //       </div>
// //       {/* Controls row */}
// //       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3 border-b bg-gray-50">
// //         <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
// //           <span>
// //             Showing <strong>{totalRows ? pageStartIdx + 1 : 0}-{pageEndIdx}</strong> of <strong>{totalRows}</strong> rows {loading && '(loading...)'}
// //           </span>
// //           <label className="flex items-center gap-2">
// //             <span className="text-gray-500">Rows:</span>
// //             <select className="select select-xs" value={tablePageSize} onChange={(e) => { setTablePageSize(parseInt(e.target.value, 10)); setTablePage(1); }}>
// //               {[10, 20, 30, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
// //             </select>
// //           </label>
// //           <div className="flex items-center gap-1">
// //             <button className="btn btn-xs" disabled={tablePage <= 1} onClick={() => setTablePage(p => Math.max(1, p - 1))} title="Previous page">
// //               <ChevronLeft className="w-4 h-4" />
// //             </button>
// //             <span className="text-gray-600 text-xs">Page {tablePage} / {totalTablePages}</span>
// //             <button className="btn btn-xs" disabled={tablePage >= totalTablePages} onClick={() => setTablePage(p => Math.min(totalTablePages, p + 1))} title="Next page">
// //               <ChevronRight className="w-4 h-4" />
// //             </button>
// //           </div>
// //         </div>

// //         <div className="flex items-center gap-2">
// //           {/* Save scope selector */}
// //           <div className="flex items-center gap-2">
// //             <label className="text-xs text-gray-600">Save scope</label>
// //             <select
// //               className="select select-xs"
// //               value={saveScope}
// //               onChange={(e) => setSaveScope(e.target.value as SaveScope)}
// //               title="Choose what to save"
// //             >
// //               <option value="changed">Changes only</option>
// //               <option value="selected">Selected rows</option>
// //               <option value="page">Current page</option>
// //               <option value="all">All filtered</option>
// //             </select>
// //           </div>

// //           <div className={`badge ${dirty ? 'badge-warning' : 'badge-ghost'} text-xs`}>
// //             {dirty ? `${changedKeys.size} unsaved change${changedKeys.size!==1?'s':''}` : lastSavedAt ? `Saved ${lastSavedAt}` : ''}
// //           </div>
// //           <button className={`btn btn-sm ${dirty ? 'bg-blue-600 hover:bg-blue-700 text-white border-0' : 'btn-ghost border border-gray-300 text-gray-700'}`} onClick={handleSave} disabled={saving || (!dirty && saveScope==='changed')}>
// //             <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Error / success bar */}
// //       {(saveError || (!dirty && lastSavedAt)) && (
// //         <div className={`px-4 py-2 border-b ${saveError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
// //           {saveError ? saveError : `Saved successfully at ${lastSavedAt}`}
// //         </div>
// //       )}

// //       {/* Table */}
// //       <div className="overflow-x-auto">
// //         <table className="table w-full">
// //           <thead>
// //             <tr className="bg-slate-100">
// //               <th className="text-slate-700">
// //                 <label className="flex items-center gap-2">
// //                   <input type="checkbox" className="checkbox checkbox-sm" checked={allPageSelected} onChange={(e)=>toggleSelectPage(e.target.checked)} />
// //                   <span className="text-sm">Select Page</span>
// //                 </label>
// //               </th>
// //               <th className="cursor-pointer text-slate-700" onClick={() => handleSort('employeeName')}>
// //                 Name {getSortIcon('employeeName')}
// //               </th>
// //               <th className="cursor-pointer text-slate-700" onClick={() => handleSort('employeeNo')}>
// //                 Employee No {getSortIcon('employeeNo')}
// //               </th>
// //               <th className="cursor-pointer text-slate-700" onClick={() => handleSort('department')}>
// //                 Department {getSortIcon('department')}
// //               </th>
// //               <th className="text-slate-700">TZ</th>
// //               <th className="text-slate-900 whitespace-nowrap min-w-[180px]" onClick={() => handleSort('date')}>
// //                 Date {getSortIcon('date')}
// //               </th>
// //               <th className="cursor-pointer text-slate-700" onClick={() => handleSort('netHours')}>
// //                 Total {getSortIcon('netHours')}
// //               </th>
// //               <th className="text-slate-700">Working Day</th>
// //               <th className="text-slate-700">Change Shift?</th>
// //               <th className="cursor-pointer text-slate-700" onClick={() => handleSort('status')}>
// //                 Status {getSortIcon('status')}
// //               </th>
// //               <th className="text-slate-700">Start Time</th>
// //               <th className="text-slate-700">End Time</th>
// //               <th className="cursor-pointer text-slate-700" onClick={() => handleSort('pattern')}>
// //                 Pattern {getSortIcon('pattern')}
// //               </th>
// //               <th className="text-slate-700">Template</th>
// //               <th className="text-slate-700">Remark</th>
// //               <th className="text-slate-700">Quick</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {paginatedData.length === 0 ? (
// //               <tr>
// //                 <td colSpan={16}>
// //                   <div className="text-center py-8">
// //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
// //                     </svg>
// //                     <h3 className="text-lg font-medium text-slate-900">No schedule entries found</h3>
// //                     <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filter.</p>
// //                   </div>
// //                 </td>
// //               </tr>
// //             ) : (
// //               paginatedData.map((item, idx) => {
// //                 const emp = allEmployees.find(e => e.id === item.employeeId);
// //                 const tzVal = emp?.time_zone || 'Asia/Kuala_Lumpur';
// //                 const rid = item.id;
// //                 const [empIdStr, dayStr] = rid.split('-');
// //                 const eId = parseInt(empIdStr, 10);
// //                 const d = parseInt(dayStr, 10);
// //                 const remarkValue = remarkDrafts[rid] ?? item.remarks;

// //                 return (
// //                   <tr key={rid} className={`hover:bg-slate-50 ${idx !== paginatedData.length - 1 ? 'border-b border-slate-200' : ''}`}>
// //                     <td>
// //                       <input
// //                         type="checkbox"
// //                         className="checkbox checkbox-sm"
// //                         checked={selectedRowIds.has(rid)}
// //                         onChange={(e) => {
// //                           setSelectedRowIds(prev => {
// //                             const next = new Set(prev);
// //                             if (e.target.checked) next.add(rid);
// //                             else next.delete(rid);
// //                             return next;
// //                           });
// //                         }}
// //                       />
// //                     </td>
// //                     <td className="font-medium text-slate-900">{item.employeeName}</td>
// //                     <td className="text-slate-900">{item.employeeNo}</td>
// //                     <td className="text-slate-900">{item.department}</td>
// //                     <td className="text-slate-900">
// //                       <select
// //                         className="select select-xs w-40"
// //                         value={tzVal}
// //                         onChange={async (e) => {
// //                           const tz = e.target.value;
// //                           try {
// //                             const resp = await fetch(`${API_BASE_URL}/api/admin/${item.employeeId}/timezone`, {
// //                               method: 'PATCH',
// //                               headers: { 'Content-Type': 'application/json'},
// //                               body: JSON.stringify({ time_zone: tz })
// //                             });
// //                             if (!resp.ok) throw new Error('Failed to update TZ');
// //                             setAllEmployees(prev => prev.map(emp => emp.id === item.employeeId ? { ...emp, time_zone: tz } : emp));
// //                           } catch (err) {
// //                             console.error(err);
// //                             alert('Failed to update timezone');
// //                           }
// //                         }}
// //                       >
// //                         {TZ_OPTIONS.map(z => <option key={z} value={z}>{z}</option>)}
// //                       </select>
// //                     </td>
// //                     <td className="text-slate-900">
// //                       {new Date(item.dateISO).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
// //                     </td>
// //                     <td className="text-slate-900">{formatHours(item.netHours)}</td>
// //                     <td>
// //                       <input
// //                         type="checkbox"
// //                         checked={item.status !== 'off'}
// //                         onChange={(e) => updateScheduleItem(rid, 'workingToggle', e.target.checked)}
// //                         className="checkbox checkbox-sm"
// //                       />
// //                     </td>
// //                     <td>
// //                       <input
// //                         type="checkbox"
// //                         checked={item.changeShift}
// //                         onChange={(e) => updateScheduleItem(rid, 'changeShift', e.target.checked)}
// //                         className="checkbox checkbox-sm"
// //                       />
// //                     </td>
// //                     <td>
// //                       <select
// //                         value={item.status}
// //                         onChange={(e) => updateScheduleItem(rid, 'status', e.target.value as ShiftStatus)}
// //                         className={`select select-xs w-24 border-0 focus:ring-2 focus:ring-blue-500 ${
// //                           item.status === 'off' ? 'bg-red-100 text-red-800' :
// //                           item.status === 'working' ? 'bg-green-100 text-green-800' :
// //                           'bg-yellow-100 text-yellow-800'
// //                         }`}
// //                       >
// //                         {statusOptions.map((s) => (
// //                           <option key={s} value={s}>{s}</option>
// //                         ))}
// //                       </select>
// //                     </td>
// //                     <td>
// //                       <input
// //                         type="time"
// //                         value={item.startTime}
// //                         onChange={(e) => updateScheduleItem(rid, 'startTime', e.target.value)}
// //                         className="input input-xs w-24 bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                       />
// //                     </td>
// //                     <td>
// //                       <input
// //                         type="time"
// //                         value={item.endTime}
// //                         onChange={(e) => updateScheduleItem(rid, 'endTime', e.target.value)}
// //                         className="input input-xs w-24 bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                       />
// //                     </td>
// //                     <td className="text-slate-900">{item.patternName || '-'}</td>
// //                     <td className="text-slate-900">{item.templateName || '-'}</td>
// //                     <td>
// //                       <input
// //                         type="text"
// //                         value={remarkValue}
// //                         onChange={(e) => handleRemarkInput(rid, e.target.value)}
// //                         onBlur={() => commitRemark(rid)}
// //                         placeholder="Add remark..."
// //                         className="input input-xs w-40 bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                       />
// //                     </td>
// //                     <td>
// //                       <div className="flex items-center gap-1">
// //                         <QuickApplySelect rowId={rid} employeeId={eId} day={d} />
// //                         <button className="btn btn-xs btn-ghost" title="Custom time" onClick={()=>{
// //                           setEditingCell({ employeeId: eId, day: d });
// //                           setShowCustomTimeModal(true);
// //                         }}>
// //                           <MoreVertical className="w-4 h-4"/>
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 );
// //               })
// //             )}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );

// //   /* ===================== Templates Tab ===================== */
// //   const TemplatesTab = () => {

// //   const [templateToDelete, setTemplateToDelete] = useState<ShiftTemplate | null>(null);

// //   const confirmDeleteTemplate = async () => {
// //     if (!templateToDelete) return;
// //     try {
// //       const res = await fetch(
// //         `${API_BASE_URL}/api/schedules/templates/${templateToDelete.id}`,
// //         { method: 'DELETE' }
// //       );
// //       if (!res.ok) throw new Error(`Delete template HTTP ${res.status}`);
// //       setShiftTemplates(prev => prev.filter(t => t.id !== templateToDelete.id));
// //     } catch (e) {
// //       console.error(e);
// //       alert('Failed to delete template');
// //     } finally {
// //       setTemplateToDelete(null);
// //     }
// //   };

// //     const filteredTemplates = useMemo(() => {
// //       const q = templateQuery.trim().toLowerCase();
// //       if (!q) return shiftTemplates;
// //       return shiftTemplates.filter(t =>
// //         t.name.toLowerCase().includes(q) ||
// //         (t.label ?? '').toLowerCase().includes(q) ||
// //         (t.description ?? '').toLowerCase().includes(q)
// //       );
// //     }, [shiftTemplates, templateQuery]);

// //     return (
// //       <div className="space-y-6">
// //         <div className="flex items-center justify-between">
// //           <div>
// //             <h2 className="text-xl font-semibold text-gray-900">Shift Templates</h2>
// //             <p className="text-gray-600">Create, edit and delete templates.</p>
// //           </div>
// //           <div className="flex items-center gap-3">
// //             <input
// //               className="input input-bordered input-sm"
// //               placeholder="Search templates…"
// //               value={templateQuery}
// //               onChange={(e) => setTemplateQuery(e.target.value)}//onChange={(e)=>setTemplateQuery(e.target.value)}
// //             />
// //             <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={() => { setEditingTemplate(null); setShowTemplateModal(true); }}>
// //               <Plus className="w-4 h-4" /> New Template
// //             </button>
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {filteredTemplates.map(t => (
// //             <div key={t.id} className={`
// //                 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow
// //               `}>
// //               <div className="p-6">
// //                 <div className="flex items-center justify-between mb-4">
// //                   <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${t.color}`}>{t.name}</div>
// //                   <div className="flex gap-2">
// //                     <button className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50" onClick={()=>{ setEditingTemplate(t); setShowTemplateModal(true); }}>
// //                       <Edit className="w-4 h-4" />
// //                     </button>
// // <button
// //   className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50"
// //   onClick={() => setTemplateToDelete(t)}
// // >
// //   <Trash2 className="w-4 h-4" />
// // </button>
// //                   </div>
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-y-1 text-sm">
// //                   <span className="text-gray-600">Start</span><span className="font-medium">{t.start}</span>
// //                   <span className="text-gray-600">End</span><span className="font-medium">{t.end}</span>
// //                   <span className="text-gray-600">Break</span><span className="font-medium">{t.break_mins} mins</span>
// //                   <span className="text-gray-600">Net</span>
// //                   <span className="font-medium text-blue-600">{formatHours(calcNetHours(t.start,t.end,!!t.overnight,t.break_mins))}</span>
// //                 </div>
// //                 {t.overnight && <div className="flex items-center gap-1 text-purple-600 mt-2"><Moon className="w-4 h-4" /><span>Overnight</span></div>}
// //                 {t.description && <div className="mt-4 pt-4 border-t text-gray-600 text-sm">{t.description}</div>}
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         <TemplateModal />

// //         {/* Confirm delete template */}
// // {templateToDelete && (
// //   <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
// //     <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
// //       <h4 className="font-semibold text-gray-900 mb-2">Delete template?</h4>
// //       <p className="text-sm text-gray-600 mb-4">
// //         “{templateToDelete.name}” will be permanently removed.
// //       </p>
// //       <div className="flex justify-end gap-3">
// //         <button
// //           className="btn btn-ghost btn-sm"
// //           onClick={() => setTemplateToDelete(null)}
// //         >
// //           Cancel
// //         </button>
// //         <button
// //           className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-0"
// //           onClick={confirmDeleteTemplate}
// //         >
// //           Delete
// //         </button>
// //       </div>
// //     </div>
// //   </div>
// // )}
// //       </div>
// //     );
// //   };

// //   /* ===================== Patterns Tab ===================== */
// //   const PatternsTab = () => {
// //     const filteredPatterns = useMemo(() => {
// //       const q = patternQuery.trim().toLowerCase();
// //       if (!q) return patterns;
// //       return patterns.filter(p =>
// //         p.name.toLowerCase().includes(q) ||
// //         (p.description ?? '').toLowerCase().includes(q)
// //       );
// //     }, [patterns, patternQuery]);

// //     return (
// //       <div className="space-y-6">
// //         <div className="flex items-center justify-between">
// //           <div>
// //             <h2 className="text-xl font-semibold text-gray-900">Work Patterns</h2>
// //             <p className="text-gray-600">Create, edit and delete patterns.</p>
// //           </div>
// //         <div className="flex items-center gap-3">
// //          <input
// //             className="input input-bordered input-sm"
// //             placeholder="Search patterns…"
// //             value={patternQuery}
// //             onChange={(e) => setPatternQuery(e.target.value)}
// //           />
// //             <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={() => { setEditingPattern(null); setShowPatternModal(true); }}>
// //               <Plus className="w-4 h-4" /> New Pattern
// //             </button>
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //           {filteredPatterns.map(p => (
// //             <div key={p.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
// //               <div className="p-6">
// //                 <div className="flex items-center justify-between mb-4">
// //                   <div>
// //                     <h3 className="font-semibold text-gray-900">{p.name}</h3>
// //                     <p className="text-sm text-gray-600">{p.description}</p>
// //                   </div>
// //                   <div className="flex gap-2">
// //                     <button className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50" onClick={()=>{ setEditingPattern(p); setShowPatternModal(true); }}>
// //                       <Edit className="w-4 h-4" />
// //                     </button>
// //                     <button
// //                       className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50"
// //                       onClick={async () => {
// //                         if (!confirm('Delete this pattern?')) return;
// //                         try {
// //                           const res = await fetch(`${API_BASE_URL}/api/schedules/patterns/${p.id}`, { method: 'DELETE' });
// //                           if (!res.ok) throw new Error(`Delete pattern HTTP ${res.status}`);
// //                           setPatterns(prev => prev.filter(x => x.id !== p.id));
// //                         } catch (e) {
// //                           console.error(e);
// //                           alert('Failed to delete pattern');
// //                         }
// //                       }}
// //                     >
// //                       <Trash2 className="w-4 h-4" />
// //                     </button>
// //                   </div>
// //                 </div>

// //                 <div className="mb-4">
// //                   <div className="text-sm font-medium text-gray-700 mb-2">Preview</div>
// //                   <div className="grid grid-cols-7 gap-1">
// //                     {p.sequence.slice(0,7).map((s, i) => {
// //                       const tpl = s.type==='work' ? shiftTemplates.find(t => t.id === (s as PatternStepWork).template) : undefined;
// //                       return (
// //                         <div key={i} className="aspect-square border border-gray-200 rounded text-xs">
// //                           {s.type==='work' && tpl
// //                             ? <div className={`w-full h-full rounded text-center flex flex-col justify-center ${tpl.color}`}>
// //                                 <div className="font-medium text-xs">{tpl.start}</div>
// //                                 <div className="text-xs">{tpl.end}</div>
// //                               </div>
// //                             : <div className="w-full h-full flex items-center justify-center text-gray-400">Off</div>}
// //                         </div>
// //                       );
// //                     })}
// //                   </div>
// //                 </div>

// //                 <div className="text-sm text-gray-600">
// //                   {p.sequence.filter(s=>s.type==='work').length} work days, {p.sequence.filter(s=>s.type==='off').length} off days
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         <PatternModal />
// //       </div>
// //     );
// //   };

// //   /* ================= Render ================= */
// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <div className="p-6 max-w-full">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <div className="flex items-center justify-between mb-4">
// //             <div>
// //               <h1 className="text-3xl font-bold text-gray-900">Task Scheduler</h1>
// //               <p className="text-gray-600 mt-1">Dynamic per-employee or bulk scheduling.</p>
// //             </div>
// //             <div className="flex items-center gap-3">
// //               <div className="text-sm text-gray-600">
// //                 {new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
// //               </div>
// //               <div className="divider divider-horizontal mx-2" />
// //               <button className="btn btn-ghost border border-gray-300 text-gray-700" onClick={handleExportExcel}>
// //                 <Download className="w-4 h-4" /> Export
// //               </button>
// //               <button className="btn btn-ghost border border-gray-300 text-gray-700">
// //                 <Upload className="w-4 h-4" /> Import
// //               </button>
// //             </div>
// //           </div>

// //           <div className="flex items-center justify-between">
// //             <div className="tabs tabs-boxed bg-white border border-gray-200 shadow-sm">
// //               <button className={`tab gap-2 ${activeView==='scheduler' ? 'tab-active bg-blue-600 text-white' : 'hover:bg-gray-50'}`} onClick={() => setActiveView('scheduler')}>
// //                 <Calendar className="w-4 h-4" /> Scheduler
// //               </button>
// //               <button className={`tab gap-2 ${activeView==='templates' ? 'tab-active bg-blue-600 text-white' : 'hover:bg-gray-50'}`} onClick={() => setActiveView('templates')}>
// //                 <Clock className="w-4 h-4" /> Templates
// //               </button>
// //               <button className={`tab gap-2 ${activeView==='patterns' ? 'tab-active bg-blue-600 text-white' : 'hover:bg-gray-50'}`} onClick={() => setActiveView('patterns')}>
// //                 <Settings className="w-4 h-4" /> Patterns
// //               </button>
// //             </div>

// //             <div className="flex items-center gap-3 w-full md:w-auto">
// //               {/* Search */}
// //               {/* <div className="relative flex-1 max-w-2xl min-w-[260px]">
// //                 <input
// //                   className="input input-bordered input-sm w-full pl-9 pr-9 rounded-lg shadow-sm
// //                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                   placeholder="Name, employee no., or department…"
// //                   value={searchTerm}
// //                   onChange={(e) => { setSearchTerm(e.target.value); setTablePage(1); }}
// //                 />
// //                 <svg
// //                   className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
// //                   viewBox="0 0 24 24" fill="none"
// //                 >
// //                   <path stroke="currentColor" strokeWidth="2" d="m21 21-4.3-4.3M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
// //                 </svg>
// //                 {searchTerm && (
// //                   <button
// //                     type="button"
// //                     onClick={() => { setSearchTerm(''); setTablePage(1); }}
// //                     className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-xs btn-ghost"
// //                     aria-label="Clear search"
// //                   >
// //                     ×
// //                   </button>
// //                 )}
// //               </div> */}

// //               {/* <button
// //                 onClick={() => setShowFilters(s => !s)}
// //                 className={`btn btn-sm border border-gray-300 ${showFilters ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-white text-gray-700'}`}
// //               >
// //                 <Filter className="w-4 h-4" /> Filters
// //               </button> */}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Filters (collapsible) */}
// //         {showFilters && activeView === 'scheduler' && (
// //           <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
// //             <div className="p-6">
// //               <div className="grid grid-cols-1 xl:grid-cols-6 gap-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">Month & Year</label>
// //                   <select
// //                     className="select select-bordered select-sm w-full"
// //                     value={`${selectedYear}-${selectedMonth}`}
// //                     onChange={(e) => {
// //                       const [y, m] = e.target.value.split('-').map(Number);
// //                       setSelectedYear(y); setSelectedMonth(m);
// //                     }}
// //                   >
// //                     {Array.from({length:12},(_,m)=>(
// //                       <option key={m} value={`${selectedYear}-${m}`}>
// //                         {new Date(selectedYear, m).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium mb-2">Company</label>
// //                   <select className="select select-bordered select-sm w-full" value={String(selectedCompany)} onChange={(e)=>{ setSelectedCompany(e.target.value==='All'?'All':e.target.value); setSelectedEmployeeId('All'); }}>
// //                     <option value="All">All Companies</option>
// //                     {companies.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
// //                   </select>
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium mb-2">Employee</label>
// //                   <select className="select select-bordered select-sm w-full" value={String(selectedEmployeeId)} onChange={(e)=>setSelectedEmployeeId(e.target.value==='All'?'All':e.target.value)}>
// //                     <option value="All">All Employees</option>
// //                     {employeesForDropdown.map(e => <option key={e.id} value={String(e.id)}>{e.name}</option>)}
// //                   </select>
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium mb-2">Start Date</label>
// //                   <input type="date" className="input input-bordered input-sm w-full" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium mb-2">End Date</label>
// //                   <input type="date" className="input input-bordered input-sm w-full" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium mb-2">Status</label>
// //                   <select className="select select-bordered select-sm w-full" value={selectedStatus} onChange={(e)=>setSelectedStatus(e.target.value as any)}>
// //                     <option value="All">All Status</option>
// //                     <option value="working">working</option>
// //                     <option value="off">off</option>
// //                     <option value="leave">leave</option>
// //                   </select>
// //                 </div>
// //               </div>

// //               {/* Bulk tools */}
// //               <div className="mt-6">
// //                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
// //                   <h4 className="font-semibold text-slate-900">Bulk Tools</h4>
// //                   <div className="flex items-end gap-3">
// //                     <div>
// //                       <label className="block text-sm font-medium mb-1">Tool</label>
// //                       <select
// //                         className="select select-bordered select-sm w-64"
// //                         value={bulkTool}
// //                         onChange={(e) => setBulkTool(e.target.value as BulkTool)}
// //                       >
// //                         <option value="time">Bulk Time Settings</option>
// //                         <option value="template">Template Settings</option>
// //                         <option value="pattern">Pattern Settings</option>
// //                       </select>
// //                     </div>

// //                     <div>
// //                       <label className="block text-sm font-medium mb-1">Scope</label>
// //                       <select
// //                         className="select select-bordered select-sm w-48"
// //                         value={bulkScope}
// //                         onChange={(e) => setBulkScope(e.target.value as BulkScope)}
// //                         title="Where to apply"
// //                       >
// //                         <option value="selected">Selected rows</option>
// //                         <option value="page">Current page</option>
// //                         <option value="all">All filtered</option>
// //                       </select>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {bulkTool === 'time' && (
// //                   <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
// //                     <h5 className="font-semibold text-slate-900 mb-4">Bulk Time Settings</h5>
// //                     <div className="flex flex-col md:flex-row md:items-end gap-3">
// //                       <div>
// //                         <label className="block text-sm font-medium mb-1">Start Time</label>
// //                         <input
// //                           type="time"
// //                           className="input input-bordered input-sm w-44"
// //                           value={bulkStart}
// //                           onChange={(e) => setBulkStart(e.target.value)}
// //                         />
// //                       </div>
// //                       <div>
// //                         <label className="block text-sm font-medium mb-1">End Time</label>
// //                         <input
// //                           type="time"
// //                           className="input input-bordered input-sm w-44"
// //                           value={bulkEnd}
// //                           onChange={(e) => setBulkEnd(e.target.value)}
// //                         />
// //                       </div>
// //                       <div className="flex gap-2">
// //                         <button className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white" onClick={applyBulkTime}>Apply</button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {bulkTool === 'template' && (
// //                   <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
// //                     <h5 className="font-semibold text-slate-900 mb-4">Template Settings</h5>
// //                     <div className="flex flex-col md:flex-row md:items-end gap-3">
// //                       <div>
// //                         <label className="block text-sm font-medium mb-1">Template</label>
// //                         <select
// //                           className="select select-bordered select-sm w-64"
// //                           value={String(templateToApply)}
// //                           onChange={(e) => setTemplateToApply(e.target.value ? Number(e.target.value) : '')}
// //                         >
// //                           <option value="">Select a template</option>
// //                           {shiftTemplates.map((t) => (
// //                             <option key={t.id} value={String(t.id)}>
// //                               {t.name}
// //                             </option>
// //                           ))}
// //                         </select>
// //                       </div>
// //                       <div className="flex gap-2">
// //                         <button className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white" onClick={applyBulkTemplate} disabled={!templateToApply}>Apply</button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {bulkTool === 'pattern' && (
// //                   <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
// //                     <h5 className="font-semibold text-slate-900 mb-4">Pattern Settings</h5>
// //                     <p className="text-xs text-gray-500 mb-3">Patterns apply across the current date range per employee.</p>
// //                     <div className="flex flex-col md:flex-row md:items-end gap-3">
// //                       <div>
// //                         <label className="block text-sm font-medium mb-1">Pattern</label>
// //                         <select
// //                           className="select select-bordered select-sm w-64"
// //                           value={String(patternToApply)}
// //                           onChange={(e) => setPatternToApply(e.target.value ? Number(e.target.value) : '')}
// //                         >
// //                           <option value="">Select a pattern</option>
// //                           {patterns.map((p) => (
// //                             <option key={p.id} value={String(p.id)}>
// //                               {p.name}
// //                             </option>
// //                           ))}
// //                         </select>
// //                       </div>

// //                       <div className="flex gap-2">
// //                         <button className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white" onClick={applyBulkPattern} disabled={!patternToApply}>
// //                           Apply to {bulkScope === 'page' ? 'current page employees' : bulkScope === 'all' ? 'all filtered employees' : 'selected employees'}
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>

// //               <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
// //                 <div className="text-sm text-gray-600">
// //                   Filtered employees: <strong>{baseFilteredEmployees.length}</strong> • Selected rows: <strong>{selectedRowIds.size}</strong>
// //                 </div>
// //                 <button className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50" onClick={resetFilters}>
// //                   Reset Filters
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Views */}
// //         {activeView === 'scheduler' && (<><ScheduleListTable /></>)}
// //         {activeView === 'templates' && <TemplatesTab />}
// //         {activeView === 'patterns' && <PatternsTab />}

// //         {/* Modals */}
// //         <CustomTimeModal />
// //         <TemplateModal />
// //         <PatternModal />
// //       </div>
// //     </div>
// //   );
// // }


// 'use client';
// import { TimezoneUtils } from '../../utils/timezoneUtils'; // adjust path as needed
// import React, { useState, useMemo, useEffect, useCallback, useRef, JSX } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   Calendar, Clock, Download, Upload, Plus, Edit, Trash2, Moon,
//   Settings, Filter, Save, X, ChevronLeft, ChevronRight,
//   ChevronsUpDown, ArrowUpDown, MoreVertical
// } from 'lucide-react';
// import { API_BASE_URL } from '../../config';

// /* =========================== Types =========================== */
// type ShiftStatus = 'working' | 'off' | 'leave';

// interface User {
//   id: number;
//   role: 'admin' | 'manager' | 'employee' | string;
//   [k: string]: unknown;
// }

// interface Employee {
//   id: number;
//   name: string;
//   email: string;
//   position: string;
//   department_id: string | number | null;
//   company_id: string | number | null;
//   status: string;
//   activation: string;
//   joined_date: string;
//   employee_no: string;
//   employment_type: string;
//   gender: string;
//   role: string;
//   race: string | null;
//   religion: string | null;
//   job_level: string | null;
//   department_name: string | null;
//   passport_expired_date: string;
//   visa_expired_date: string;
//   nationality: string;
//   time_zone?: string;
// }

// interface Company { id: number; name: string }
// interface Department { id: number; name: string }

// interface ShiftTemplate {
//   id: number;
//   name: string;
//   start: string;
//   end: string;
//   color: string;
//   label: string | null;
//   break_mins: number;
//   overnight?: boolean;
//   description?: string | null;
// }

// type AlignMode = 'range-start' | 'next-monday';
// type WeekendPolicy = 'ignore' | 'weekends-off';

// interface PatternStepWork { type: 'work'; template: number }
// interface PatternStepOff  { type: 'off' }
// type PatternStep = PatternStepWork | PatternStepOff;

// interface PatternMeta {
//   align: AlignMode;
//   weekendPolicy: WeekendPolicy;
//   weekendDays: number[];
// }

// interface WorkPattern {
//   id: number;
//   name: string;
//   description: string | null;
//   sequence: PatternStep[];
//   meta?: PatternMeta;
// }

// interface CellSchedule {
//   status: ShiftStatus;
//   start: string;
//   end: string;
//   template: number | null;
//   isCustom: boolean;
//   notes: string;
//   break_mins?: number;
//   overnight?: boolean;
//   pattern_id?: number | null;
// }

// interface EditingCell { employeeId: number; day: number }

// type ApiPatternStep = {
//   type?: 'work' | 'off';
//   template?: number | string | null;
//   step_type?: 'work' | 'off';
//   template_id?: number | string | null;
// };
// interface ApiPattern {
//   id: number;
//   name: string;
//   description?: string | null;
//   sequence?: ApiPatternStep[];
//   meta?: PatternMeta;
// }

// /* =========================== Helpers =========================== */
// const TZ_OPTIONS = TimezoneUtils.TZ_OPTIONS;

// const labelToColor = (label?: string | null) => {
//   const l = (label || '').toLowerCase();
//   if (l.includes('night')) return 'bg-purple-100 text-purple-800 border-purple-200';
//   if (l.includes('evening')) return 'bg-green-100 text-green-800 border-green-200';
//   if (l.includes('office') || l.includes('morning')) return 'bg-blue-100 text-blue-800 border-blue-200';
//   return 'bg-base-200 text-base-800 border-base-300';
// };

// const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
// const formatHours = (hours: number) => `${hours.toFixed(1)}h`;

// const calculateHours = (start: string, end: string, overnight = false): number => {
//   if (!start || !end) return 0;
//   const [sh, sm] = start.split(':').map(Number);
//   const [eh, em] = end.split(':').map(Number);
//   let s = sh * 60 + sm, e = eh * 60 + em;
//   if (overnight && e < s) e += 24 * 60;
//   return Math.max(0, (e - s) / 60);
// };

// const calcNetHours = (start: string, end: string, overnight: boolean | undefined, breakMins: number | undefined) => {
//   const gross = calculateHours(start, end, !!overnight);
//   const net = Math.max(0, gross - (breakMins ?? 0) / 60);
//   return net;
// };

// const monthDateToISO = (y: number, m: number, d: number) => {
//   const dt = new Date(y, m, d);
//   const yyyy = dt.getFullYear();
//   const mm = String(dt.getMonth() + 1).padStart(2, '0');
//   const dd = String(dt.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// };

// const parseISO = (iso: string) => {
//   const [y, m, d] = iso.split('-').map(Number);
//   return new Date(y, m - 1, d);
// };
// const formatLocalISO = (dt: Date) => {
//   const yyyy = dt.getFullYear();
//   const mm = String(dt.getMonth() + 1).padStart(2, '0');
//   const dd = String(dt.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// };
// const addDaysISO = (iso: string, n: number) => {
//   const d = parseISO(iso);
//   d.setDate(d.getDate() + n);
//   return formatLocalISO(d);
// };
// const jsDow = (iso: string) => parseISO(iso).getDay();
// const forEachDayISO = (startISO: string, endISO: string, fn: (iso: string, date: Date) => void) => {
//   const end = parseISO(endISO);
//   for (let cur = parseISO(startISO); cur <= end; cur.setDate(cur.getDate() + 1)) {
//     fn(formatLocalISO(cur), new Date(cur));
//   }
// };

// // SearchBox for Scheduler Tab
// const SearchBox = React.memo(({
//   onSearchApply,
//   onClearSearch
// }: {
//   onSearchApply: (term: string) => void;
//   onClearSearch: () => void;
// }) => {
//   const [localSearchInput, setLocalSearchInput] = useState<string>('');
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleApplySearch = () => {
//     onSearchApply(localSearchInput);
//   };

//   const handleClear = () => {
//     setLocalSearchInput('');
//     onClearSearch();
//     inputRef.current?.focus();
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleApplySearch();
//     }
//   };

//   return (
//     <div className="flex items-center gap-3 w-full md:w-auto">
//       <div className="relative flex-1 max-w-2xl min-w-[260px]">
//         <input
//           ref={inputRef}
//           className="input input-bordered w-full pl-10"
//           placeholder="Search employees..."
//           value={localSearchInput}
//           onChange={(e) => setLocalSearchInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//         />
//         <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" viewBox="0 0 24 24" fill="none">
//           <path stroke="currentColor" strokeWidth="2" d="m21 21-4.3-4.3M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
//         </svg>
//         {localSearchInput && (
//           <button
//             type="button"
//             onClick={handleClear}
//             className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-xs btn-ghost"
//             aria-label="Clear search"
//           >
//             ×
//           </button>
//         )}
//       </div>
//       <button
//         className="btn btn-primary"
//         onClick={handleApplySearch}
//         disabled={!localSearchInput.trim()}
//       >
//         Search
//       </button>
//     </div>
//   );
// });

// SearchBox.displayName = 'SearchBox';

// // SearchBox for Template tab
// const TemplateSearchBox = React.memo(({
//   onSearchApply,
//   onClearSearch
// }: {
//   onSearchApply: (term: string) => void;
//   onClearSearch: () => void;
// }) => {
//   const [localSearchInput, setLocalSearchInput] = useState<string>('');
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleApplySearch = () => {
//     onSearchApply(localSearchInput);
//   };

//   const handleClear = () => {
//     setLocalSearchInput('');
//     onClearSearch();
//     inputRef.current?.focus();
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleApplySearch();
//     }
//   };

//   return (
//     <div className="flex items-center gap-2">
//       <div className="relative">
//         <input
//           ref={inputRef}
//           className="input input-bordered input-sm"
//           placeholder="Search templates…"
//           value={localSearchInput}
//           onChange={(e) => setLocalSearchInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//         />
//         {localSearchInput && (
//           <button
//             type="button"
//             onClick={handleClear}
//             className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-xs btn-ghost"
//             aria-label="Clear search"
//           >
//             ×
//           </button>
//         )}
//       </div>
//       <button
//         className="btn btn-primary btn-sm"
//         onClick={handleApplySearch}
//         disabled={!localSearchInput.trim()}
//       >
//         Search
//       </button>
//     </div>
//   );
// });

// TemplateSearchBox.displayName = 'TemplateSearchBox';

// // SearchBox for Pattern tab
// const PatternSearchBox = React.memo(({
//   onSearchApply,
//   onClearSearch
// }: {
//   onSearchApply: (term: string) => void;
//   onClearSearch: () => void;
// }) => {
//   const [localSearchInput, setLocalSearchInput] = useState<string>('');
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleApplySearch = () => {
//     onSearchApply(localSearchInput);
//   };

//   const handleClear = () => {
//     setLocalSearchInput('');
//     onClearSearch();
//     inputRef.current?.focus();
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleApplySearch();
//     }
//   };

//   return (
//     <div className="flex items-center gap-2">
//       <div className="relative">
//         <input
//           ref={inputRef}
//           className="input input-bordered input-sm"
//           placeholder="Search patterns…"
//           value={localSearchInput}
//           onChange={(e) => setLocalSearchInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//         />
//         {localSearchInput && (
//           <button
//             type="button"
//             onClick={handleClear}
//             className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-xs btn-ghost"
//             aria-label="Clear search"
//           >
//             ×
//           </button>
//         )}
//       </div>
//       <button
//         className="btn btn-primary btn-sm"
//         onClick={handleApplySearch}
//         disabled={!localSearchInput.trim()}
//       >
//         Search
//       </button>
//     </div>
//   );
// });

// PatternSearchBox.displayName = 'PatternSearchBox';

// /* =========================== Page =========================== */
// export default function HRMSScheduler(): JSX.Element {
//   const router = useRouter();

//   /* ---- State ---- */
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [allDepartments, setAllDepartments] = useState<Department[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [activeView, setActiveView] = useState<'scheduler'|'templates'|'patterns'>('scheduler');
//   const [showFilters, setShowFilters] = useState<boolean>(true);

//   /* ---- Filters ---- */
//   const now = new Date();
//   const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
//   const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
//   const [selectedCompany, setSelectedCompany] = useState<string | number>('All');
//   const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | number>('All');
//   const [selectedStatus, setSelectedStatus] = useState<'All' | ShiftStatus>('All');

//   const [searchInput, setSearchInput] = useState<string>(''); // Input field value
//   const [appliedSearchTerm, setAppliedSearchTerm] = useState<string>('');
//   const [appliedTemplateSearch, setAppliedTemplateSearch] = useState<string>('');
//   const [appliedPatternSearch, setAppliedPatternSearch] = useState<string>('');

//   const [dateFrom, setDateFrom] = useState<string>(() => monthDateToISO(now.getFullYear(), now.getMonth(), 1));
//   const [dateTo, setDateTo] = useState<string>(() => monthDateToISO(now.getFullYear(), now.getMonth(), daysInMonth(now.getFullYear(), now.getMonth())));

//   /* ---- Table State ---- */
//   const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
//   const [tablePage, setTablePage] = useState<number>(1);
//   const [tablePageSize, setTablePageSize] = useState<number>(20);
//   type SortKey = 'employeeName' | 'employeeNo' | 'department' | 'date' | 'netHours' | 'status' | 'pattern';
//   const [sortKey, setSortKey] = useState<SortKey>('date');
//   const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');

//   /* ---- Bulk Operations ---- */
//   const [bulkStart, setBulkStart] = useState<string>('09:00');
//   const [bulkEnd, setBulkEnd] = useState<string>('18:00');
//   const [templateToApply, setTemplateToApply] = useState<number | ''>('');
//   const [patternToApply, setPatternToApply] = useState<number | ''>('');
//   type BulkScope = 'selected' | 'page' | 'all';
//   const [bulkScope, setBulkScope] = useState<BulkScope>('page');
//   type SaveScope = 'changed' | 'selected' | 'page' | 'all';
//   const [saveScope, setSaveScope] = useState<SaveScope>('changed');
//   type BulkTool = 'time' | 'template' | 'pattern';
//   const [bulkTool, setBulkTool] = useState<BulkTool>('time');

//   /* ---- Data State ---- */
//   const [scheduleData, setScheduleData] = useState<Record<string, CellSchedule>>({});
//   const [shiftTemplates, setShiftTemplates] = useState<ShiftTemplate[]>([]);
//   const [patterns, setPatterns] = useState<WorkPattern[]>([]);
//   const [dirty, setDirty] = useState<boolean>(false);
//   const [saving, setSaving] = useState<boolean>(false);
//   const [saveError, setSaveError] = useState<string>('');
//   const [lastSavedAt, setLastSavedAt] = useState<string>('');
//   const [changedKeys, setChangedKeys] = useState<Set<string>>(new Set());

//   /* ---- UI State ---- */
//   //const [templateQuery, setTemplateQuery] = useState<string>('');
//   //const [patternQuery, setPatternQuery] = useState<string>('');
//   const [showTemplateModal, setShowTemplateModal] = useState(false);
//   const [editingTemplate, setEditingTemplate] = useState<ShiftTemplate | null>(null);
//   const [showPatternModal, setShowPatternModal] = useState(false);
//   const [editingPattern, setEditingPattern] = useState<WorkPattern | null>(null);
//   const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);
//   const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
//   const [remarkDrafts, setRemarkDrafts] = useState<Record<string, string>>({});
//   const [templateToDelete, setTemplateToDelete] = useState<ShiftTemplate | null>(null);
//   const [pendingRemove, setPendingRemove] = useState<number | null>(null);
//   const [userCompanyId, setUserCompanyId] = useState<string | number | null>(null);

// // Add to your types
// interface ImportProgress {
//   stage: 'uploading' | 'parsing' | 'validating' | 'importing' | 'complete' | 'error';
//   message: string;
//   processed: number;
//   total: number;
//   errors: string[];
// }

// interface ImportConfig {
//   type: 'schedules' | 'templates' | 'patterns' | 'mixed';
//   overwrite: boolean;
//   createMissing: boolean;
// }

// // Add to state variables
// const [showImportModal, setShowImportModal] = useState(false);
// const [importConfig, setImportConfig] = useState<ImportConfig>({
//   type: 'schedules',
//   overwrite: false,
//   createMissing: true
// });
// const [importProgress, setImportProgress] = useState<ImportProgress | null>(null);

// useEffect(() => {
//   const userStr = localStorage.getItem('hrms_user');
//   const isAuthenticated = localStorage.getItem('hrms_authenticated');
//   if (!userStr || isAuthenticated !== 'true') {
//     router.push('/auth/login');
//     return;
//   }
//   try { 
//     const userData = JSON.parse(userStr);
//     setUser(userData);
//     // Store user's company ID
//     if (userData.company_id) {
//       setUserCompanyId(userData.company_id);
//       // Auto-select user's company for employees
//       if (userData.role === 'employee') {
//         setSelectedCompany(String(userData.company_id));
//       }
//     }
//   } catch { 
//     router.push('/auth/login'); 
//   }
// }, [router]);

//   const fetchTemplates = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/schedules/templates`);
//       if (!res.ok) throw new Error(`Templates HTTP ${res.status}`);
//       const data = await res.json();
//       const mapped: ShiftTemplate[] = (data || []).map((t: any) => ({
//         id: t.id,
//         name: t.name,
//         start: t.start_time,
//         end: t.end_time,
//         break_mins: t.break_mins ?? 0,
//         overnight: !!t.overnight,
//         label: t.label ?? null,
//         description: t.description ?? null,
//         color: labelToColor(t.label)
//       }));
//       setShiftTemplates(mapped);
//     } catch (e) {
//       console.error('fetch templates failed', e);
//     }
//   }, []);

//   const fetchPatterns = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/schedules/patterns`);
//       if (!res.ok) throw new Error(`Patterns HTTP ${res.status}`);
//       const data: unknown = await res.json();
//       const arr: ApiPattern[] = Array.isArray(data) ? (data as ApiPattern[]) : [];
//       const mapped: WorkPattern[] = arr.map((p: ApiPattern): WorkPattern => {
//         const seq: PatternStep[] = Array.isArray(p.sequence)
//           ? p.sequence.map((s: ApiPatternStep): PatternStep =>
//               (s.type ?? s.step_type) === 'work'
//                 ? { type: 'work', template: Number((s.template ?? s.template_id) ?? 0) }
//                 : { type: 'off' }
//             )
//           : [];
//         const meta: PatternMeta = p.meta ?? {
//           align: 'next-monday',
//           weekendPolicy: 'ignore',
//           weekendDays: [6, 0],
//         };
//         return {
//           id: p.id,
//           name: p.name,
//           description: p.description ?? null,
//           sequence: seq,
//           meta,
//         };
//       });
//       setPatterns(mapped);
//     } catch (e) {
//       console.error('fetch patterns failed', e);
//     }
//   }, []);

// const fetchAllEmployees = useCallback(async () => {
//   if (!user) return;
//   try {
//     setLoading(true);
//     const queryParams = new URLSearchParams();
    
//     // Role-based filtering
//     if (user.role === 'employee') {
//       // For employees, fetch employees from their company only
//       queryParams.append('company_id', String(user.company_id));
//     } else if (user.role === 'manager') {
//       queryParams.append('manager_id', String(user.id));
//     }
//     // For admin, no restrictions - fetch all employees

//     const res = await fetch(`${API_BASE_URL}/api/admin/employees${queryParams.toString() ? `?${queryParams}` : ''}`);
//     if (!res.ok) throw new Error(`Employees HTTP ${res.status}`);
//     const data: any[] = await res.json();
    
//     const mapped: Employee[] = data
//       .filter((emp: any) => emp.role !== 'admin')
//       .map((emp: any): Employee => ({
//         id: emp.id,
//         name: emp.name,
//         email: emp.email,
//         position: emp.position || '',
//         department_id: emp.department_id ?? '',
//         company_id: emp.company_id ?? '',
//         status: (emp.status?.toLowerCase() || 'active'),
//         activation: emp.activation || 'Activated',
//         joined_date: emp.joined_date || '',
//         employee_no: emp.employee_no || '',
//         employment_type: emp.employment_type || '',
//         gender: emp.gender || '',
//         role: emp.role || 'employee',
//         race: emp.race ?? null,
//         religion: emp.religion ?? null,
//         job_level: emp.job_level ?? null,
//         department_name: emp.department_name ?? null,
//         passport_expired_date: emp.passport_expired_date || '',
//         visa_expired_date: emp.visa_expired_date || '',
//         nationality: emp.nationality || '',
//         time_zone: emp.time_zone || 'Asia/Kuala_Lumpur'
//       }));
//     setAllEmployees(mapped);
//   } catch (e) {
//     console.error('fetch employees failed', e);
//   } finally {
//     setLoading(false);
//   }
// }, [user]);


// //SearchBox for Schedular tab
// const handleSearchApply = useCallback((term: string) => {
//   setAppliedSearchTerm(term);
//   setTablePage(1);
// }, []);

// const handleClearSearch = useCallback(() => {
//   setAppliedSearchTerm('');
//   setTablePage(1);
// }, []);

// //SearchBox for Template tab
// const handleTemplateSearchApply = useCallback((term: string) => {
//   setAppliedTemplateSearch(term);
// }, []);

// const handleTemplateSearchClear = useCallback(() => {
//   setAppliedTemplateSearch('');
// }, []);

// //SearchBox for Pattern tab
// const handlePatternSearchApply = useCallback((term: string) => {
//   setAppliedPatternSearch(term);
// }, []);

// const handlePatternSearchClear = useCallback(() => {
//   setAppliedPatternSearch('');
// }, []);

//   useEffect(() => {
//     if (!user) return;
//     fetchAllEmployees();
//     fetchTemplates();
//     fetchPatterns();

//     const fetchCompanies = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/api/admin/companies`);
//         const data = await res.json();
//         setCompanies(
//           (Array.isArray(data) ? data : data?.data ?? []).map((c: any) => ({
//             id: c.id ?? c.company_id,
//             name: c.name ?? c.company_name ?? `Company ${c.id || c.company_id}`,
//           }))
//         );
//       } catch (e) { console.error(e); }
//     };

//     const fetchAllDepartments = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/api/admin/departments`);
//         const data = await res.json();
//         const normalized: Department[] = (Array.isArray(data) ? data : data?.data ?? []).map((d: any) => ({
//           id: d.id ?? d.department_id,
//           name: d.name ?? d.department_name ?? `Dept ${d.id || d.department_id}`,
//         }));
//         setAllDepartments(normalized);
//         setDepartments(normalized);
//       } catch (e) { console.error(e); }
//     };

//     fetchCompanies();
//     fetchAllDepartments();
//   }, [user, fetchAllEmployees, fetchTemplates, fetchPatterns]);

//   /* ================= Schedule Data Management ================= */
//   const KEY_RE = /^(\d+)-(\d+)-(\d+)-(\d+)$/;
//   const getScheduleKey = (employeeId: number, day: number) => `${employeeId}-${selectedYear}-${selectedMonth}-${day}`;
//   const emptyCell: CellSchedule = { status: 'off', start: '', end: '', template: null, isCustom: false, notes: '', pattern_id: null };

//   const getCellSchedule = (employeeId: number, day: number): CellSchedule => {
//     const key = getScheduleKey(employeeId, day);
//     return scheduleData[key] ?? emptyCell;
//   };

//   const markChanged = (key: string) => {
//     setChangedKeys(prev => {
//       if (prev.has(key)) return prev;
//       const next = new Set(prev);
//       next.add(key);
//       return next;
//     });
//   };

//   const setCellSchedule = (employeeId: number, day: number, patch: Partial<CellSchedule>) => {
//     const key = getScheduleKey(employeeId, day);
//     setScheduleData(prev => {
//       const base = prev[key] ?? emptyCell;
//       const merged = { ...base, ...patch };
//       return { ...prev, [key]: merged };
//     });
//     markChanged(key);
//     setDirty(true);
//   };

//   const applyBulkPatches = (patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }>) => {
//     if (!patches.length) return;
//     setScheduleData(prev => {
//       const next = { ...prev };
//       for (const { employeeId, day, patch } of patches) {
//         const key = getScheduleKey(employeeId, day);
//         const base = next[key] ?? emptyCell;
//         next[key] = { ...base, ...patch };
//         changedKeys.add(key);
//       }
//       return next;
//     });
//     setChangedKeys(new Set(changedKeys));
//     setDirty(true);
//   };

//   const fetchSchedules = useCallback(
//   async (employeeIds: number[], fromISO: string, toISO: string) => {
//     try {
//       if (!fromISO || !toISO || employeeIds.length === 0) return;
      
//       // Role-based security: Filter employeeIds based on user role
//       let filteredEmployeeIds = employeeIds;
      
//       if (user?.role === 'employee' && userCompanyId) {
//         // For employees, only allow access to employees in their company
//         filteredEmployeeIds = employeeIds.filter(empId => {
//           const emp = allEmployees.find(e => e.id === empId);
//           return emp && String(emp.company_id) === String(userCompanyId);
//         });
        
//         if (filteredEmployeeIds.length === 0) {
//           console.log('No accessible employees found for this employee user');
//           return;
//         }
//       } else if (user?.role === 'manager') {
//         // For managers, use existing manager filtering (your existing logic)
//         // This maintains your current manager restrictions
//         filteredEmployeeIds = employeeIds; // Keep existing manager logic
//       }
//       // For admin, no filtering needed

//       const employeesByTimezone: Record<string, number[]> = {};
//       filteredEmployeeIds.forEach(empId => {
//         const emp = allEmployees.find(e => e.id === empId);
//         // Additional security check
//         if (user?.role === 'employee' && emp && String(emp.company_id) !== String(userCompanyId)) {
//           return; // Skip employees not in user's company (double security)
//         }
//         const tz = emp?.time_zone || 'Asia/Kuala_Lumpur';
//         if (!employeesByTimezone[tz]) employeesByTimezone[tz] = [];
//         employeesByTimezone[tz].push(empId);
//       });

//       const allServerData: Record<string, CellSchedule> = {};
//       const errors: string[] = [];
      
//       await Promise.all(Object.entries(employeesByTimezone).map(async ([timezone, empIds]) => {
//         try {
//           const params = new URLSearchParams();
//           params.set('from', fromISO);
//           params.set('to', toISO);
//           params.set('employee_id', empIds.join(','));
//           params.set('timezone', timezone);
//           const res = await fetch(`${API_BASE_URL}/api/schedules?${params.toString()}`);
//           if (!res.ok) throw new Error(`HTTP ${res.status} for timezone ${timezone}`);
//           const data = await res.json();
//           for (const row of data) {
//             const empId = row.employee_id;
//             const localDate = new Date(row.schedule_date);
//             const y = localDate.getFullYear();
//             const m = localDate.getMonth();
//             const d = localDate.getDate();
//             const key = `${empId}-${y}-${m}-${d}`;
//             allServerData[key] = {
//               status: row.status,
//               start: row.start_time || '',
//               end: row.end_time || '',
//               template: row.template_id || null,
//               isCustom: !row.template_id,
//               notes: row.notes || '',
//               break_mins: row.break_mins || 0,
//               overnight: !!row.overnight,
//               pattern_id: row.pattern_id || null,
//             };
//           }
//         } catch (error: any) {
//           errors.push(`Timezone ${timezone}: ${error.message}`);
//         }
//       }));

//       if (errors.length > 0) console.warn('Some timezone groups failed to fetch:', errors);
      
//       const defaultSchedules: Record<string, CellSchedule> = {};
//       forEachDayISO(fromISO, toISO, (iso, date) => {
//         const day = date.getDate();
//         const y = date.getFullYear();
//         const m = date.getMonth();
//         for (const empId of filteredEmployeeIds) {
//           const key = `${empId}-${y}-${m}-${day}`;
//           if (!allServerData[key]) {
//             defaultSchedules[key] = emptyCell;
//           }
//         }
//       });

//       const merged = { ...defaultSchedules, ...allServerData };
//       setScheduleData(prev => {
//         const next = { ...prev };
//         Object.keys(merged).forEach(key => { next[key] = merged[key]; });
//         return next;
//       });

//       setDirty(false);
//       setChangedKeys(new Set());
//     } catch (e) {
//       console.error('fetch schedules failed', e);
//     }
//   },
//   [allEmployees, user, userCompanyId] // Add user and userCompanyId to dependencies
// );

//   const fetchSchedules_all = useCallback(
//     async (employeeIds: number[], fromISO: string, toISO: string) => {
//       try {
//         if (!fromISO || !toISO || employeeIds.length === 0) return;
//         const employeesByTimezone: Record<string, number[]> = {};
//         employeeIds.forEach(empId => {
//           const emp = allEmployees.find(e => e.id === empId);
//           const tz = emp?.time_zone || 'Asia/Kuala_Lumpur';
//           if (!employeesByTimezone[tz]) employeesByTimezone[tz] = [];
//           employeesByTimezone[tz].push(empId);
//         });

//         const allServerData: Record<string, CellSchedule> = {};
//         const errors: string[] = [];
//         await Promise.all(Object.entries(employeesByTimezone).map(async ([timezone, empIds]) => {
//           try {
//             const params = new URLSearchParams();
//             params.set('from', fromISO);
//             params.set('to', toISO);
//             params.set('employee_id', empIds.join(','));
//             params.set('timezone', timezone);
//             const res = await fetch(`${API_BASE_URL}/api/schedules?${params.toString()}`);
//             if (!res.ok) throw new Error(`HTTP ${res.status} for timezone ${timezone}`);
//             const data = await res.json();
//             for (const row of data) {
//               const empId = row.employee_id;
//               const localDate = new Date(row.schedule_date);
//               const y = localDate.getFullYear();
//               const m = localDate.getMonth();
//               const d = localDate.getDate();
//               const key = `${empId}-${y}-${m}-${d}`;
//               allServerData[key] = {
//                 status: row.status,
//                 start: row.start_time || '',
//                 end: row.end_time || '',
//                 template: row.template_id || null,
//                 isCustom: !row.template_id,
//                 notes: row.notes || '',
//                 break_mins: row.break_mins || 0,
//                 overnight: !!row.overnight,
//                 pattern_id: row.pattern_id || null,
//               };
//             }
//           } catch (error: any) {
//             errors.push(`Timezone ${timezone}: ${error.message}`);
//           }
//         }));

//         if (errors.length > 0) console.warn('Some timezone groups failed to fetch:', errors);
//         const defaultSchedules: Record<string, CellSchedule> = {};
//         forEachDayISO(fromISO, toISO, (iso, date) => {
//           const day = date.getDate();
//           const y = date.getFullYear();
//           const m = date.getMonth();
//           for (const empId of employeeIds) {
//             const key = `${empId}-${y}-${m}-${day}`;
//             if (!allServerData[key]) {
//               defaultSchedules[key] = emptyCell;
//             }
//           }
//         });

//         const merged = { ...defaultSchedules, ...allServerData };
//         setScheduleData(prev => {
//           const next = { ...prev };
//           Object.keys(merged).forEach(key => { next[key] = merged[key]; });
//           return next;
//         });

//         setDirty(false);
//         setChangedKeys(new Set());
//       } catch (e) {
//         console.error('fetch schedules failed', e);
//       }
//     },
//     [allEmployees]
//   );

//   /* ================= Derived Data ================= */
//   const totalDays = useMemo(() => daysInMonth(selectedYear, selectedMonth), [selectedYear, selectedMonth]);
//   const monthYearLabel = useMemo(
//     () => new Date(selectedYear, selectedMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
//     [selectedYear, selectedMonth]
//   );

//   useEffect(() => {
//     setDateFrom(monthDateToISO(selectedYear, selectedMonth, 1));
//     setDateTo(monthDateToISO(selectedYear, selectedMonth, daysInMonth(selectedYear, selectedMonth)));
//     setTablePage(1);
//   }, [selectedYear, selectedMonth]);

//   const employeesForDropdown_all = useMemo(() => {
//     return allEmployees
//       .filter(e => selectedCompany === 'All' ? true : String(e.company_id ?? '') === String(selectedCompany))
//       .filter(e => selectedDepartment === 'All' ? true : (e.department_name || '') === selectedDepartment);
//   }, [allEmployees, selectedCompany, selectedDepartment]);

// const employeesForDropdown = useMemo(() => {
//   let filtered = allEmployees;
  
//   // For employees, only show employees from their company
//   if (user?.role === 'employee' && userCompanyId) {
//     filtered = filtered.filter(e => String(e.company_id ?? '') === String(userCompanyId));
//   } else if (selectedCompany !== 'All') {
//     filtered = filtered.filter(e => String(e.company_id ?? '') === String(selectedCompany));
//   }
  
//   return filtered.filter(e => selectedDepartment === 'All' ? true : (e.department_name || '') === selectedDepartment);
// }, [allEmployees, user, userCompanyId, selectedCompany, selectedDepartment]);

// const baseFilteredEmployees: Employee[] = useMemo(() => {
//   let out = allEmployees;
  
//   // For employees, automatically filter to their company only
//   if (user?.role === 'employee' && userCompanyId) {
//     out = out.filter(e => String(e.company_id ?? '') === String(userCompanyId));
//   } else if (selectedCompany !== 'All') {
//     out = out.filter(e => String(e.company_id ?? '') === String(selectedCompany));
//   }
  
//   // Rest of the existing filters...
//   if (selectedDepartment !== 'All') out = out.filter(e => (e.department_name || '') === selectedDepartment);
//   if (selectedEmployeeId !== 'All') out = out.filter(e => String(e.id) === String(selectedEmployeeId));
  
//   // Use appliedSearchTerm here
//   if (appliedSearchTerm.trim()) {
//     const t = appliedSearchTerm.toLowerCase();
//     out = out.filter(e =>
//       e.name.toLowerCase().includes(t) ||
//       (e.employee_no || '').toLowerCase().includes(t) ||
//       (e.department_name || '').toLowerCase().includes(t)
//     );
//   }
//   return out;
// }, [allEmployees, user, userCompanyId, selectedCompany, selectedDepartment, selectedEmployeeId, appliedSearchTerm]);

// const employeeIds = useMemo(() => baseFilteredEmployees.map(e => e.id), [baseFilteredEmployees]);

//   useEffect(() => {
//     if (!employeeIds.length) return;
//     fetchSchedules(employeeIds, dateFrom, dateTo);
//   }, [employeeIds, dateFrom, dateTo, fetchSchedules]);

//   /* ================= Pattern Application ================= */
//   const mondayOfWeekISO = (iso: string) => {
//     const d = parseISO(iso);
//     const diff = (d.getDay() + 6) % 7;
//     d.setDate(d.getDate() - diff);
//     return formatLocalISO(d);
//   };

//   const applyPatternRange = (
//     targetEmployeeIds: number[],
//     patternId: number,
//     startISO: string,
//     endISO: string
//   ) => {
//     const pat = patterns.find(p => p.id === patternId);
//     if (!pat || !pat.sequence?.length) return;

//     const meta: PatternMeta = pat.meta ?? {
//       align: 'next-monday',
//       weekendPolicy: 'ignore',
//       weekendDays: [6, 0]
//     };

//     let initialIdx = 0;
//     if (meta.align === 'next-monday') {
//       const weekMon = mondayOfWeekISO(startISO);
//       let eligibleBefore = 0;
//       forEachDayISO(weekMon, addDaysISO(startISO, -1), (_iso, date) => {
//         const dow = date.getDay();
//         const isWknd = meta.weekendPolicy === 'weekends-off' && meta.weekendDays.includes(dow);
//         if (!isWknd) eligibleBefore++;
//       });
//       initialIdx = eligibleBefore % pat.sequence.length;
//     }

//     const patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }> = [];

//     for (const eid of targetEmployeeIds) {
//       let stepIndex = initialIdx;

//       forEachDayISO(startISO, endISO, (_iso, date) => {
//         const dow = date.getDay();
//         const isWknd = meta.weekendPolicy === 'weekends-off' && meta.weekendDays.includes(dow);
//         const dd = date.getDate();

//         if (isWknd) {
//           patches.push({
//             employeeId: eid,
//             day: dd,
//             patch: {
//               status: 'off',
//               start: '',
//               end: '',
//               template: null,
//               isCustom: false,
//               break_mins: 0,
//               overnight: false,
//               pattern_id: patternId
//             }
//           });
//           return;
//         }

//         const step = pat.sequence[stepIndex % pat.sequence.length];
//         if (step.type === 'work') {
//           const tpl = shiftTemplates.find(t => t.id === step.template);
//           patches.push({
//             employeeId: eid,
//             day: dd,
//             patch: tpl
//               ? {
//                   status: 'working',
//                   start: tpl.start,
//                   end: tpl.end,
//                   template: tpl.id,
//                   isCustom: false,
//                   break_mins: tpl.break_mins,
//                   overnight: tpl.overnight,
//                   pattern_id: patternId
//                 }
//               : { status: 'off', start: '', end: '', template: null, isCustom: false, break_mins: 0, overnight: false, pattern_id: patternId }
//           });
//         } else {
//           patches.push({
//             employeeId: eid,
//             day: dd,
//             patch: { status: 'off', start: '', end: '', template: null, isCustom: false, break_mins: 0, overnight: false, pattern_id: patternId }
//           });
//         }

//         stepIndex++;
//       });
//     }

//     applyBulkPatches(patches);
//   };

//   /* ================= Table Data & Sorting ================= */
//   type RowItem = {
//     id: string;
//     employeeId: number;
//     employeeName: string;
//     employeeNo: string;
//     department: string;
//     dateISO: string;
//     status: ShiftStatus;
//     startTime: string;
//     endTime: string;
//     netHours: number;
//     changeShift: boolean;
//     remarks: string;
//     patternName: string;
//     templateName: string;
//   };

//   const monthRows: RowItem[] = useMemo(() => {
//     const rows: RowItem[] = [];
//     for (const emp of baseFilteredEmployees) {
//       for (let d = 1; d <= totalDays; d++) {
//         const sch = getCellSchedule(emp.id, d);
//         const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;
//         const net = sch.status === 'working'
//           ? calcNetHours(sch.start, sch.end, sch.overnight ?? tpl?.overnight, sch.break_mins ?? tpl?.break_mins)
//           : 0;
//         const dateISO = monthDateToISO(selectedYear, selectedMonth, d);
//         const patternName = sch.pattern_id ? (patterns.find(p => p.id === sch.pattern_id)?.name ?? '') : '';
//         rows.push({
//           id: `${emp.id}-${d}`,
//           employeeId: emp.id,
//           employeeName: emp.name,
//           employeeNo: emp.employee_no || '',
//           department: emp.department_name ?? '-',
//           dateISO,
//           status: sch.status,
//           startTime: sch.start || '',
//           endTime: sch.end || '',
//           netHours: net,
//           changeShift: !!sch.isCustom,
//           remarks: sch.notes || '',
//           patternName,
//           templateName: tpl?.name ?? '',
//         });
//       }
//     }
//     return rows;
//   }, [baseFilteredEmployees, selectedYear, selectedMonth, scheduleData, totalDays, shiftTemplates, patterns]);

//   const rowsFilteredByDateStatus = useMemo(() => {
//     const from = dateFrom;
//     const to = dateTo;
//     return monthRows.filter(r => (r.dateISO >= from && r.dateISO <= to) && (selectedStatus === 'All' ? true : r.status === selectedStatus));
//   }, [monthRows, dateFrom, dateTo, selectedStatus]);

//   const handleSort = (key: SortKey) => {
//     if (key === sortKey) setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
//     else { setSortKey(key); setSortDir('asc'); }
//   };

//   const getSortIcon = (key: SortKey) => {
//     if (key !== sortKey) return <ChevronsUpDown className="w-4 h-4 inline-block ml-1 opacity-50" />;
//     return <ArrowUpDown className="w-4 h-4 inline-block ml-1" />;
//   };

//   const sortedData = useMemo(() => {
//     const arr = [...rowsFilteredByDateStatus];
//     arr.sort((a, b) => {
//       const dir = sortDir === 'asc' ? 1 : -1;
//       switch (sortKey) {
//         case 'employeeName': return a.employeeName.localeCompare(b.employeeName) * dir;
//         case 'employeeNo': return a.employeeNo.localeCompare(b.employeeNo) * dir;
//         case 'department': return (a.department || '').localeCompare(b.department || '') * dir;
//         case 'date': return (a.dateISO < b.dateISO ? -1 : a.dateISO > b.dateISO ? 1 : 0) * dir;
//         case 'netHours': return (a.netHours - b.netHours) * dir;
//         case 'status': return a.status.localeCompare(b.status) * dir;
//         case 'pattern': return (a.patternName || '').localeCompare(b.patternName || '') * dir;
//         default: return 0;
//       }
//     });
//     return arr;
//   }, [rowsFilteredByDateStatus, sortKey, sortDir]);

//   const totalRows = sortedData.length;
//   const totalTablePages = Math.max(1, Math.ceil(totalRows / tablePageSize));
//   const pageStartIdx = (tablePage - 1) * tablePageSize;
//   const pageEndIdx = Math.min(pageStartIdx + tablePageSize, totalRows);
//   const paginatedData = sortedData.slice(pageStartIdx, pageEndIdx);
//   const pageRowIds = paginatedData.map(r => r.id);
//   const allPageSelected = pageRowIds.length > 0 && pageRowIds.every(id => selectedRowIds.has(id));

//   const toggleSelectPage = (checked: boolean) => {
//     setSelectedRowIds(prev => {
//       const next = new Set(prev);
//       pageRowIds.forEach(id => {
//         if (checked) next.add(id);
//         else next.delete(id);
//       });
//       return next;
//     });
//   };

//   //useEffect(() => { setTablePage(1); setSelectedRowIds(new Set()); }, [selectedCompany, selectedDepartment, selectedEmployeeId, selectedStatus, selectedYear, selectedMonth, dateFrom, dateTo, searchTerm]);


//   useEffect(() => { 
//   setTablePage(1); 
//   setSelectedRowIds(new Set()); 
// }, [selectedCompany, selectedDepartment, selectedEmployeeId, selectedStatus, selectedYear, selectedMonth, dateFrom, dateTo, appliedSearchTerm]); // Changed to appliedSearchTerm
  
//   /* ================= Row Updates ================= */
//   const statusOptions: ShiftStatus[] = ['working', 'off', 'leave'];

//   const updateScheduleItem = (rowId: string, field: keyof RowItem | 'workingToggle', value: any) => {
//     const [empIdStr, dayStr] = rowId.split('-');
//     const employeeId = parseInt(empIdStr, 10);
//     const day = parseInt(dayStr, 10);
//     const sch = getCellSchedule(employeeId, day);

//     if (field === 'workingToggle') {
//       const nextStatus: ShiftStatus = value ? 'working' : 'off';
//       const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;
//       setCellSchedule(employeeId, day, {
//         status: nextStatus,
//         start: nextStatus === 'working' ? (sch.start || tpl?.start || '09:00') : '',
//         end: nextStatus === 'working' ? (sch.end || tpl?.end || '17:00') : '',
//       });
//       return;
//     }

//     switch (field) {
//       case 'status': {
//         const nextStatus = value as ShiftStatus;
//         if (nextStatus === 'working') {
//           const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;
//           setCellSchedule(employeeId, day, {
//             status: 'working',
//             start: sch.start || tpl?.start || '09:00',
//             end: sch.end || tpl?.end || '17:00',
//           });
//         } else {
//           setCellSchedule(employeeId, day, { status: nextStatus, start: '', end: '', template: nextStatus==='off'? null : sch.template });
//         }
//         break;
//       }
//       case 'startTime': setCellSchedule(employeeId, day, { start: value, status: 'working' }); break;
//       case 'endTime': setCellSchedule(employeeId, day, { end: value, status: 'working' }); break;
//       case 'remarks': setCellSchedule(employeeId, day, { notes: value }); break;
//       case 'changeShift': setCellSchedule(employeeId, day, { isCustom: !!(value as boolean) }); break;
//       default: break;
//     }
//   };

//   const handleRemarkInput = (rowId: string, val: string) => {
//     setRemarkDrafts(prev => ({ ...prev, [rowId]: val }));
//   };

//   const commitRemark = (rowId: string) => {
//     const draft = remarkDrafts[rowId];
//     if (draft === undefined) return;
//     updateScheduleItem(rowId, 'remarks', draft);
//   };

//   /* ================= Save Operations ================= */
//   const buildItemsFromRowIds = (rowIds: string[]) => {
//     type Item = {
//       employee_id: number;
//       day: number;
//       status: ShiftStatus;
//       start: string | null;
//       end: string | null;
//       break_mins: number;
//       overnight: boolean;
//       template_id: number | null;
//       notes: string;
//       pattern_id: number | null;
//     };
//     const items: Item[] = [];
//     const uniq = new Set(rowIds);

//     for (const rid of uniq) {
//       const [empIdStr, dayStr] = rid.split('-');
//       const empId = Number(empIdStr);
//       const d = Number(dayStr);
//       if (!Number.isInteger(empId) || empId <= 0 || !Number.isInteger(d) || d <= 0) continue;

//       const sch = getCellSchedule(empId, d);
//       const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;
//       const isWorking = sch.status === 'working';

//       items.push({
//         employee_id: empId,
//         day: d,
//         status: sch.status,
//         start: isWorking ? (sch.start ?? tpl?.start ?? null) : null,
//         end:   isWorking ? (sch.end   ?? tpl?.end   ?? null) : null,
//         break_mins: isWorking ? (sch.break_mins ?? tpl?.break_mins ?? 0) : 0,
//         overnight:  isWorking ? Boolean(sch.overnight ?? tpl?.overnight) : false,
//         template_id: isWorking ? (sch.template ?? null) : null,
//         notes: sch.notes || '',
//         pattern_id: sch.pattern_id ?? null,
//       });
//     }
//     return items;
//   };

//   const getRowIdsForScope = (scope: 'selected' | 'page' | 'all') => {
//     if (scope === 'selected') return Array.from(selectedRowIds);
//     if (scope === 'page') return paginatedData.map(r => r.id);
//     return rowsFilteredByDateStatus.map(r => r.id);
//   };

//   const getChangedRowIdsForCurrentMonth = () => {
//     const ids: string[] = [];
//     for (const key of Array.from(changedKeys)) {
//       const m = KEY_RE.exec(key);
//       if (!m) continue;
//       const [, empIdStr, yStr, moStr, dStr] = m;
//       const y = Number(yStr), mo = Number(moStr);
//       if (y === selectedYear && mo === selectedMonth) {
//         ids.push(`${empIdStr}-${dStr}`);
//       }
//     }
//     return ids;
//   };

//   const saveScoped = async (scope: SaveScope) => {
//     type Item = ReturnType<typeof buildItemsFromRowIds>[number];
//     let rowIds: string[] = [];
//     if (scope === 'changed') {
//       rowIds = getChangedRowIdsForCurrentMonth();
//     } else {
//       rowIds = getRowIdsForScope(scope);
//     }

//     if (rowIds.length === 0) {
//       setSaveError('Nothing to save for the selected scope.');
//       return;
//     }

//     const items: Item[] = buildItemsFromRowIds(rowIds);
//     const CHUNK_SIZE = 100;
//     let successCount = 0;
//     let errorCount = 0;
//     const errors: string[] = [];

//     for (let i = 0; i < items.length; i += CHUNK_SIZE) {
//       const chunk = items.slice(i, i + CHUNK_SIZE);
//       const chunkNumber = Math.floor(i / CHUNK_SIZE) + 1;
//       const totalChunks = Math.ceil(items.length / CHUNK_SIZE);

//       try {
//         const res = await fetch(`${API_BASE_URL}/api/schedules/bulk`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             year: selectedYear,
//             month: selectedMonth + 1,
//             items: chunk
//           }),
//         });

//         if (!res.ok) {
//           let detail = '';
//           try { detail = (await res.json()).error || ''; } catch {}
//           const errorMsg = `Chunk ${chunkNumber}/${totalChunks} failed: HTTP ${res.status}${detail ? ` — ${detail}` : ''}`;
//           errors.push(errorMsg);
//           errorCount += chunk.length;
//         } else {
//           successCount += chunk.length;
//         }
//       } catch (err: any) {
//         const errorMsg = `Chunk ${chunkNumber}/${totalChunks} failed: ${err.message || 'Network error'}`;
//         errors.push(errorMsg);
//         errorCount += chunk.length;
//       }
//     }

//     if (errorCount > 0) {
//       throw new Error(
//         `Saved ${successCount} items, but ${errorCount} failed. ` +
//         `First error: ${errors[0]}${errors.length > 1 ? ` (+${errors.length - 1} more)` : ''}`
//       );
//     }

//     await fetchSchedules(
//       baseFilteredEmployees.map(e => e.id),
//       monthDateToISO(selectedYear, selectedMonth, 1),
//       monthDateToISO(selectedYear, selectedMonth, daysInMonth(selectedYear, selectedMonth))
//     );
//     setDirty(false);
//     setChangedKeys(new Set());
//     setLastSavedAt(new Date().toLocaleString());
//   };

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       setSaveError('');
//       await saveScoped(saveScope);
//     } catch (err: any) {
//       console.error(err);
//       setSaveError(err?.message || 'Failed to save.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ================= Bulk Operations ================= */
//   const rowIdToParts = (rowId: string) => {
//     const [empIdStr, dayStr] = rowId.split('-');
//     return { empId: parseInt(empIdStr, 10), day: parseInt(dayStr, 10) };
//   };

//   const patchRowsTime = (rowIds: string[], startTime: string, endTime: string) => {
//     const patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }> = rowIds.map(rid => {
//       const { empId, day } = rowIdToParts(rid);
//       return {
//         employeeId: empId,
//         day,
//         patch: { status: 'working', start: startTime, end: endTime, template: null, isCustom: true }
//       };
//     });
//     applyBulkPatches(patches);
//   };

//   const patchRowsTemplate = (rowIds: string[], templateId: number) => {
//     const tpl = shiftTemplates.find(t => t.id === templateId);
//     if (!tpl) return;
//     const patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }> = rowIds.map(rid => {
//       const { empId, day } = rowIdToParts(rid);
//       return {
//         employeeId: empId,
//         day,
//         patch: {
//           status: 'working',
//           start: tpl.start,
//           end: tpl.end,
//           template: tpl.id,
//           isCustom: false,
//           break_mins: tpl.break_mins,
//           overnight: tpl.overnight
//         }
//       };
//     });
//     applyBulkPatches(patches);
//   };

//   const idsOnPage = Array.from(new Set(paginatedData.map(r => r.employeeId)));
//   const idsAll = baseFilteredEmployees.map(e => e.id);

//   // Add this helper function to fetch holidays
//   const fetchHolidays = useCallback(async (companyIds: (string | number)[], fromISO: string, toISO: string) => {
//     try {
//       const params = new URLSearchParams();
//       params.set('from', fromISO);
//       params.set('to', toISO);
      
//       // For admin, we need to fetch holidays for all companies
//       // For manager/employee, fetch based on their scope
//       if (companyIds.length > 0 && companyIds[0] !== 'All') {
//         params.set('company_ids', companyIds.join(','));
//       }
      
//       const res = await fetch(`${API_BASE_URL}/api/holiday/holidays?${params.toString()}`);
//       if (!res.ok) throw new Error(`Holidays HTTP ${res.status}`);
//       const data = await res.json();
      
//       // Group holidays by date for easy lookup
//       const holidaysByDate: Record<string, any[]> = {};
//       data.forEach((holiday: any) => {
//         const date = holiday.holiday_date;
//         if (!holidaysByDate[date]) {
//           holidaysByDate[date] = [];
//         }
//         holidaysByDate[date].push(holiday);
//       });
      
//       return holidaysByDate;
//     } catch (e) {
//       console.error('fetch holidays failed', e);
//       return {};
//     }
//   }, []);

//   const applyBulkTime = () => {
//     if (bulkScope === 'selected') {
//       const rowIds = Array.from(selectedRowIds);
//       patchRowsTime(rowIds, bulkStart, bulkEnd);
//     } else if (bulkScope === 'page') {
//       patchRowsTime(pageRowIds, bulkStart, bulkEnd);
//     } else {
//       patchRowsTime(rowsFilteredByDateStatus.map(r => r.id), bulkStart, bulkEnd);
//     }
//   };


//   // Modify applyBulkTime to check holidays
//   const applyBulkTimeWithHolidays = async () => {
//     // Get company IDs for filtered employees
//     const companyIds = Array.from(new Set(baseFilteredEmployees.map(e => String(e.company_id || '')))).filter(id => id);
    
//     // Fetch holidays for the date range
//     const holidaysByDate = await fetchHolidays(companyIds, dateFrom, dateTo);
    
//     // Get target row IDs based on scope
//     let rowIds: string[] = [];
//     if (bulkScope === 'selected') {
//       rowIds = Array.from(selectedRowIds);
//     } else if (bulkScope === 'page') {
//       rowIds = pageRowIds;
//     } else {
//       rowIds = rowsFilteredByDateStatus.map(r => r.id);
//     }

//     const patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }> = [];
    
//     for (const rid of rowIds) {
//       const { empId, day } = rowIdToParts(rid);
//       const emp = allEmployees.find(e => e.id === empId);
//       if (!emp) continue;
      
//       // Get the date for this cell
//       const dateISO = monthDateToISO(selectedYear, selectedMonth, day);
      
//       // Check if this date has a holiday applicable to this employee's company
//       const dayHolidays = holidaysByDate[dateISO] || [];
//       const isHoliday = dayHolidays.some(holiday => {
//         // Check if holiday applies to this employee
//         if (holiday.is_global) return true;
//         if (!holiday.company_ids || !holiday.company_ids.length) return false;
//         return holiday.company_ids.includes(Number(emp.company_id));
//       });
      
//       if (isHoliday) {
//         // Mark as holiday instead of applying the bulk time
//         patches.push({
//           employeeId: empId,
//           day,
//           patch: { 
//             status: 'off', 
//             start: '', 
//             end: '', 
//             template: null, 
//             isCustom: false,
//             notes: 'Public Holiday',
//             pattern_id: null
//           }
//         });
//       } else {
//         // Apply the bulk time as normal
//         patches.push({
//           employeeId: empId,
//           day,
//           patch: { 
//             status: 'working', 
//             start: bulkStart, 
//             end: bulkEnd, 
//             template: null, 
//             isCustom: true 
//           }
//         });
//       }
//     }
    
//     applyBulkPatches(patches);
//   };

//   const applyBulkTemplate = () => {
//     if (!templateToApply) return;
//     const tplId = Number(templateToApply);
//     if (bulkScope === 'selected') {
//       patchRowsTemplate(Array.from(selectedRowIds), tplId);
//     } else if (bulkScope === 'page') {
//       patchRowsTemplate(pageRowIds, tplId);
//     } else {
//       patchRowsTemplate(rowsFilteredByDateStatus.map(r => r.id), tplId);
//     }
//   };

// const applyBulkTemplateWithHolidays = async () => {
//   if (!templateToApply) return;
//   const tplId = Number(templateToApply);
  
//   // Get company IDs for filtered employees
//   const companyIds = Array.from(new Set(baseFilteredEmployees.map(e => String(e.company_id || '')))).filter(id => id);
  
//   // Fetch holidays for the date range
//   const holidaysByDate = await fetchHolidays(companyIds, dateFrom, dateTo);
  
//   let rowIds: string[] = [];
//   if (bulkScope === 'selected') {
//     rowIds = Array.from(selectedRowIds);
//   } else if (bulkScope === 'page') {
//     rowIds = pageRowIds;
//   } else {
//     rowIds = rowsFilteredByDateStatus.map(r => r.id);
//   }

//   const tpl = shiftTemplates.find(t => t.id === tplId);
//   if (!tpl) return;
  
//   const patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }> = rowIds.map(rid => {
//     const { empId, day } = rowIdToParts(rid);
//     const emp = allEmployees.find(e => e.id === empId);
    
//     // Get the date for this cell
//     const dateISO = monthDateToISO(selectedYear, selectedMonth, day);
    
//     // Check for holidays
//     let patchContent: Partial<CellSchedule>;
//     const dayHolidays = holidaysByDate[dateISO] || [];
//     const isHoliday = emp && dayHolidays.some(holiday => {
//       if (holiday.is_global) return true;
//       if (!holiday.company_ids || !holiday.company_ids.length) return false;
//       return holiday.company_ids.includes(Number(emp.company_id));
//     });

//     if (isHoliday) {
//       patchContent = {
//         status: 'off',
//         start: '',
//         end: '',
//         template: null,
//         isCustom: false,
//         notes: 'Public Holiday',
//         break_mins: 0,
//         overnight: false
//       };
//     } else {
//       patchContent = {
//         status: 'working',
//         start: tpl.start,
//         end: tpl.end,
//         template: tpl.id,
//         isCustom: false,
//         break_mins: tpl.break_mins,
//         overnight: tpl.overnight
//       };
//     }

//     return { employeeId: empId, day, patch: patchContent };
//   });
  
//   applyBulkPatches(patches);
// };


//   // Ensure bulk operations respect company boundaries
// const applyBulkPattern = () => {
//   if (!patternToApply) return;
//   const patId = Number(patternToApply);
  
//   let ids: number[];
//   if (bulkScope === 'page') {
//     ids = idsOnPage;
//   } else {
//     ids = baseFilteredEmployees.map(e => e.id);
//   }
  
//   // For employees, ensure we only apply to their company's employees
//   if (user?.role === 'employee' && userCompanyId) {
//     ids = ids.filter(id => {
//       const emp = allEmployees.find(e => e.id === id);
//       return emp && String(emp.company_id) === String(userCompanyId);
//     });
//   }
  
//   applyPatternRange(ids, patId, dateFrom, dateTo);
// };

// const applyBulkPatternWithHolidays = async () => {
//   if (!patternToApply) return;
//   const patId = Number(patternToApply);
  
//   // Get company IDs for filtered employees
//   const companyIds = Array.from(new Set(baseFilteredEmployees.map(e => String(e.company_id || '')))).filter(id => id);
  
//   // Fetch holidays for the date range
//   const holidaysByDate = await fetchHolidays(companyIds, dateFrom, dateTo);
  
//   let ids: number[];
//   if (bulkScope === 'page') {
//     ids = idsOnPage;
//   } else {
//     ids = baseFilteredEmployees.map(e => e.id);
//   }
  
//   // For employees, ensure we only apply to their company's employees
//   if (user?.role === 'employee' && userCompanyId) {
//     ids = ids.filter(id => {
//       const emp = allEmployees.find(e => e.id === id);
//       return emp && String(emp.company_id) === String(userCompanyId);
//     });
//   }
  
//   const pat = patterns.find(p => p.id === patId);
//   if (!pat || !pat.sequence?.length) return;

//   const meta: PatternMeta = pat.meta ?? {
//     align: 'next-monday',
//     weekendPolicy: 'ignore',
//     weekendDays: [6, 0]
//   };

//   let initialIdx = 0;
//   if (meta.align === 'next-monday') {
//     const weekMon = mondayOfWeekISO(dateFrom);
//     let eligibleBefore = 0;
//     forEachDayISO(weekMon, addDaysISO(dateFrom, -1), (_iso, date) => {
//       const dow = date.getDay();
//       const isWknd = meta.weekendPolicy === 'weekends-off' && meta.weekendDays.includes(dow);
//       if (!isWknd) eligibleBefore++;
//     });
//     initialIdx = eligibleBefore % pat.sequence.length;
//   }

//   const patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }> = [];

//   for (const eid of ids) {
//     const emp = allEmployees.find(e => e.id === eid);
//     if (!emp) continue;
    
//     let stepIndex = initialIdx;

//     forEachDayISO(dateFrom, dateTo, (iso, date) => {
//       const dow = date.getDay();
//       const day = date.getDate();
      
//       // Check for holidays first
//       const dayHolidays = holidaysByDate[iso] || [];
//       const isHoliday = dayHolidays.some(holiday => {
//         if (holiday.is_global) return true;
//         if (!holiday.company_ids || !holiday.company_ids.length) return false;
//         return holiday.company_ids.includes(Number(emp.company_id));
//       });

//       if (isHoliday) {
//         // HOLIDAY: Mark as off but STILL ADVANCE pattern step
//         const currentStep = pat.sequence[stepIndex % pat.sequence.length];
//         patches.push({
//           employeeId: eid,
//           day,
//           patch: {
//             status: 'off',
//             start: '',
//             end: '',
//             template: null,
//             isCustom: false,
//             notes: 'Public Holiday',
//             pattern_id: patId,
//             break_mins: 0,
//             overnight: false,
//           }
//         });
//         stepIndex++; // CRITICAL: Advance the pattern even for holidays
//         return; // Skip weekend/pattern logic
//       }

//       // Check weekends according to pattern settings
//       const isWknd = meta.weekendPolicy === 'weekends-off' && meta.weekendDays.includes(dow);
      
//       if (isWknd) {
//         // WEEKEND: Apply weekend logic from pattern meta
//         patches.push({
//           employeeId: eid,
//           day,
//           patch: {
//             status: 'off',
//             start: '',
//             end: '',
//             template: null,
//             isCustom: false,
//             break_mins: 0,
//             overnight: false,
//             pattern_id: patId
//           }
//         });
//         // DO NOT advance stepIndex for weekends when weekendPolicy is 'weekends-off'
//         return;
//       }

//       // NORMAL DAY (not holiday, not weekend): Apply pattern step
//       const step = pat.sequence[stepIndex % pat.sequence.length];
//       if (step.type === 'work') {
//         const tpl = shiftTemplates.find(t => t.id === step.template);
//         patches.push({
//           employeeId: eid,
//           day,
//           patch: tpl
//             ? {
//                 status: 'working',
//                 start: tpl.start,
//                 end: tpl.end,
//                 template: tpl.id,
//                 isCustom: false,
//                 break_mins: tpl.break_mins,
//                 overnight: tpl.overnight,
//                 pattern_id: patId
//               }
//             : { 
//                 status: 'off', 
//                 start: '', 
//                 end: '', 
//                 template: null, 
//                 isCustom: false, 
//                 break_mins: 0, 
//                 overnight: false, 
//                 pattern_id: patId 
//               }
//         });
//       } else {
//         // Pattern step is 'off'
//         patches.push({
//           employeeId: eid,
//           day,
//           patch: { 
//             status: 'off', 
//             start: '', 
//             end: '', 
//             template: null, 
//             isCustom: false, 
//             break_mins: 0, 
//             overnight: false, 
//             pattern_id: patId 
//           }
//         });
//       }

//       stepIndex++; // Advance to next pattern step
//     });
//   }

//   applyBulkPatches(patches);
// };

//   const applyBulkPattern_all = () => {
//     if (!patternToApply) return;
//     const patId = Number(patternToApply);
//     const ids = bulkScope === 'page' ? idsOnPage : idsAll;
//     applyPatternRange(ids, patId, dateFrom, dateTo);
//   };

//   /* ================= Export ================= */
//   const handleExportExcel = async () => {
//     const XLSX = await import('xlsx');
//     const wb = XLSX.utils.book_new();
//     const usedNames = new Set<string>();
//     const sanitizeSheetName = (raw: string) => {
//       let base = (raw || '').replace(/[\\/?*[\]:]/g, '').slice(0, 31) || 'Sheet';
//       let name = base;
//       let i = 1;
//       while (usedNames.has(name)) {
//         const tail = `_${i++}`;
//         name = (base.slice(0, Math.max(0, 31 - tail.length)) + tail);
//       }
//       usedNames.add(name);
//       return name;
//     };

//     const header = [
//       'no', 'employeeid', 'name', 'date', 'total hours',
//       'start time', 'end time', 'status', 'is working day', 'pattern', 'template', 'remark'
//     ];

//     for (const emp of baseFilteredEmployees) {
//       const rows: any[] = [];
//       let n = 1;

//       for (let d = 1; d <= totalDays; d++) {
//         const iso = monthDateToISO(selectedYear, selectedMonth, d);
//         if (iso < dateFrom || iso > dateTo) continue;

//         const sch = getCellSchedule(emp.id, d);
//         const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;
//         const net = sch.status === 'working'
//           ? calcNetHours(sch.start, sch.end, sch.overnight ?? tpl?.overnight, sch.break_mins ?? tpl?.break_mins)
//           : 0;
//         const patternName = sch.pattern_id ? (patterns.find(p => p.id === sch.pattern_id)?.name ?? '') : '';

//         rows.push({
//           'no': n++,
//           'employeeid': emp.id,
//           'name': emp.name,
//           'date': new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
//           'total hours': Number(net.toFixed(2)),
//           'start time': sch.start || '',
//           'end time': sch.end || '',
//           'status': sch.status,
//           'is working day': sch.status === 'working' ? 'Yes' : 'No',
//           'pattern': patternName,
//           'template': tpl?.name ?? '',
//           'remark': sch.notes || ''
//         });
//       }

//       const ws = XLSX.utils.json_to_sheet(rows, { header });
//       const colWidths = header.map((key, colIdx) => {
//         const maxCell = Math.max(key.length, ...rows.map(r => String(r[key] ?? '').length));
//         return { wch: Math.min(Math.max(10, maxCell + 2), 40) };
//       });
//       (ws as any)['!cols'] = colWidths;

//       XLSX.utils.book_append_sheet(wb, ws, sanitizeSheetName(emp.name));
//     }

//     const fileName = `Schedule_${new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).replace(' ', '_')}.xlsx`;
//     XLSX.writeFile(wb, fileName);
//   };

//   /* ================= UI Components ================= */
//   const QuickApplySelect: React.FC<{ rowId: string; employeeId: number; day: number; }> = ({ rowId, employeeId, day }) => {
//     return (
//       <select
//         className="select select-xs w-48"
//         defaultValue=""
//         onChange={(e) => {
//           const val = e.target.value;
//           if (!val) return;

//           if (val === 'custom:time') {
//             setEditingCell({ employeeId, day });
//             setShowCustomTimeModal(true);
//             e.currentTarget.value = '';
//             return;
//           }

//           const [kind, idStr] = val.split(':');
//           const id = parseInt(idStr, 10);
//           if (kind === 'tpl') {
//             const tpl = shiftTemplates.find(t => t.id === id);
//             if (tpl) {
//               setCellSchedule(employeeId, day, {
//                 status: 'working',
//                 start: tpl.start,
//                 end: tpl.end,
//                 template: tpl.id,
//                 isCustom: false,
//                 break_mins: tpl.break_mins,
//                 overnight: tpl.overnight
//               });
//             }
//           } else if (kind === 'pat') {
//             applyPatternRange([employeeId], id, dateFrom, dateTo);
//           }

//           e.currentTarget.value = '';
//         }}
//       >
//         <option value="">Quick…</option>
//         <optgroup label="Templates">
//           {shiftTemplates.map(t => (
//             <option key={`tpl-${t.id}`} value={`tpl:${t.id}`}>{t.name}</option>
//           ))}
//         </optgroup>
//         <optgroup label="Patterns (range)">
//           {patterns.map(p => (
//             <option key={`pat-${p.id}`} value={`pat:${p.id}`}>{p.name}</option>
//           ))}
//         </optgroup>
//         <option value="custom:time">Custom time…</option>
//       </select>
//     );
//   };

//   const resetFilters = () => {
//     setSelectedCompany('All');
//     setSelectedDepartment('All');
//     setSelectedEmployeeId('All');
//     setSelectedStatus('All');
//     //setSearchTerm('');
//       setSearchInput(''); // Clear input
//   setAppliedSearchTerm(''); // Clear applied filter
//     setDateFrom(monthDateToISO(selectedYear, selectedMonth, 1));
//     setDateTo(monthDateToISO(selectedYear, selectedMonth, totalDays));
//     setTablePage(1);
//     setSelectedRowIds(new Set());
//   };

//   /* ================= Modals ================= */
//   const CustomTimeModal = () => {
//     const [start, setStart] = useState<string>('09:00');
//     const [end, setEnd] = useState<string>('17:00');
//     const [breakMins, setBreakMins] = useState<number>(60);
//     const [overnight, setOvernight] = useState<boolean>(false);
//     const [notes, setNotes] = useState<string>('');

//     useEffect(() => {
//       if (!editingCell) return;
//       const sch = getCellSchedule(editingCell.employeeId, editingCell.day);
//       if (sch.status === 'working') {
//         setStart(sch.start || '09:00');
//         setEnd(sch.end || '17:00');
//         setBreakMins(sch.break_mins ?? 60);
//         setOvernight(!!sch.overnight);
//         setNotes(sch.notes || '');
//       } else {
//         setStart('09:00'); setEnd('17:00'); setBreakMins(60); setOvernight(false); setNotes('');
//       }
//     }, [editingCell?.employeeId, editingCell?.day, showCustomTimeModal]);

//     if (!showCustomTimeModal || !editingCell) return null;

//     return (
//       <div className="modal modal-open">
//         <div className="modal-box max-w-md">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-primary/10 rounded-lg"><Clock className="w-5 h-5 text-primary" /></div>
//               <div>
//                 <h3 className="text-lg font-semibold">Custom Time</h3>
//                 <p className="text-sm opacity-70">Set custom hours</p>
//               </div>
//             </div>
//             <button onClick={() => setShowCustomTimeModal(false)} className="btn btn-ghost btn-sm">
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="label">Start Time</label>
//                 <input type="time" className="input input-bordered w-full" value={start} onChange={(e) => setStart(e.target.value)} />
//               </div>
//               <div>
//                 <label className="label">End Time</label>
//                 <input type="time" className="input input-bordered w-full" value={end} onChange={(e) => setEnd(e.target.value)} />
//               </div>
//             </div>

//             <div>
//               <label className="label">Break (mins)</label>
//               <input type="number" className="input input-bordered w-full" min={0} step={15} value={breakMins} onChange={(e) => setBreakMins(parseInt(e.target.value || '0', 10))} />
//             </div>

//             <div>
//               <label className="label">Notes</label>
//               <textarea className="textarea textarea-bordered w-full" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
//             </div>

//             <div className="form-control">
//               <label className="label cursor-pointer justify-start gap-3">
//                 <input type="checkbox" className="checkbox checkbox-primary" checked={overnight} onChange={(e) => setOvernight(e.target.checked)} />
//                 <span className="label-text">Overnight shift</span>
//               </label>
//             </div>

//             <div className="text-sm opacity-70">
//               Net hours: <span className="font-semibold">{formatHours(calcNetHours(start, end, overnight, breakMins))}</span>
//             </div>
//           </div>

//           <div className="modal-action">
//             <button className="btn btn-ghost" onClick={() => setShowCustomTimeModal(false)}>Cancel</button>
//             <button
//               className="btn btn-primary"
//               onClick={() => {
//                 const { employeeId, day } = editingCell;
//                 setCellSchedule(employeeId, day, {
//                   status: 'working',
//                   start, end, isCustom: true, notes, template: null,
//                   break_mins: breakMins, overnight
//                 });
//                 setShowCustomTimeModal(false);
//               }}
//             >
//               Apply
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const TemplateModal = () => {
//     const isEdit = !!editingTemplate;
//     const [form, setForm] = useState<ShiftTemplate>(() => editingTemplate ?? {
//       id: 0, name: '', start: '09:00', end: '17:00',
//       color: labelToColor('Office'), label: 'Office', break_mins: 60, overnight: false, description: ''
//     });

//     useEffect(() => { if (editingTemplate) setForm(editingTemplate); }, [editingTemplate]);

//     if (!showTemplateModal) return null;
//     const total = calculateHours(form.start, form.end, !!form.overnight);
//     const net = Math.max(0, total - (form.break_mins ?? 0) / 60);

//     const save = async () => {
//       try {
//         if (isEdit) {
//           const res = await fetch(`${API_BASE_URL}/api/schedules/templates/${form.id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               name: form.name,
//               start_time: form.start,
//               end_time: form.end,
//               break_mins: form.break_mins,
//               overnight: !!form.overnight,
//               label: form.label,
//               description: form.description
//             })
//           });
//           if (!res.ok) throw new Error(`Update template HTTP ${res.status}`);
//           setShiftTemplates(prev => prev.map(t => t.id === form.id ? { ...form, color: labelToColor(form.label || undefined) } : t));
//         } else {
//           const res = await fetch(`${API_BASE_URL}/api/schedules/templates`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               name: form.name,
//               start_time: form.start,
//               end_time: form.end,
//               break_mins: form.break_mins,
//               overnight: !!form.overnight,
//               label: form.label,
//               description: form.description
//             })
//           });
//           if (!res.ok) throw new Error(`Create template HTTP ${res.status}`);
//           const data = await res.json();
//           const newTemplate: ShiftTemplate = { ...form, id: data.id, color: labelToColor(form.label || undefined) };
//           setShiftTemplates(prev => [...prev, newTemplate]);
//         }
//         setShowTemplateModal(false);
//         setEditingTemplate(null);
//       } catch (e) {
//         console.error(e);
//         alert('Failed to save template');
//       }
//     };

//     return (
//       <div className="modal modal-open">
//         <div className="modal-box max-w-2xl">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-primary/10 rounded-lg"><Clock className="w-5 h-5 text-primary" /></div>
//               <div>
//                 <h3 className="text-lg font-semibold">{isEdit ? 'Edit Shift Template' : 'Create Shift Template'}</h3>
//                 <p className="text-sm opacity-70">Reusable shift schedules</p>
//               </div>
//             </div>
//             <button onClick={() => { setShowTemplateModal(false); setEditingTemplate(null); }} className="btn btn-ghost btn-sm">
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="label">Template Name</label>
//                 <input className="input input-bordered w-full" value={form.name} onChange={(e)=>setForm(p=>({...p,name:e.target.value}))}/>
//               </div>
//               <div>
//                 <label className="label">Label/Category</label>
//                 <input className="input input-bordered w-full" value={form.label ?? ''} onChange={(e)=>setForm(p=>({...p,label:e.target.value, color: labelToColor(e.target.value)}))}/>
//               </div>
//             </div>
//             <div>
//               <label className="label">Description</label>
//               <textarea className="textarea textarea-bordered w-full" rows={2} value={form.description ?? ''} onChange={(e)=>setForm(p=>({...p,description:e.target.value}))}/>
//             </div>

//             <div className="grid grid-cols-3 gap-4">
//               <div>
//                 <label className="label">Start</label>
//                 <input type="time" className="input input-bordered w-full" value={form.start} onChange={(e)=>setForm(p=>({...p,start:e.target.value}))}/>
//               </div>
//               <div>
//                 <label className="label">End</label>
//                 <input type="time" className="input input-bordered w-full" value={form.end} onChange={(e)=>setForm(p=>({...p,end:e.target.value}))}/>
//               </div>
//               <div>
//                 <label className="label">Break (mins)</label>
//                 <input type="number" className="input input-bordered w-full" min={0} step={15} value={form.break_mins} onChange={(e)=>setForm(p=>({...p,break_mins:parseInt(e.target.value||'0',10)}))}/>
//               </div>
//             </div>

//             <div className="card bg-base-200 p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <input id="tpl-overnight" type="checkbox" className="checkbox checkbox-primary" checked={!!form.overnight} onChange={(e)=>setForm(p=>({...p,overnight:e.target.checked}))}/>
//                   <label htmlFor="tpl-overnight" className="font-medium">Overnight Shift</label>
//                 </div>
//                 <div className="text-right">
//                   <div className="font-medium">Gross: {formatHours(total)}</div>
//                   <div className="text-sm opacity-70">Net: {formatHours(net)}</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="modal-action">
//             <button className="btn btn-ghost" onClick={() => { setShowTemplateModal(false); setEditingTemplate(null); }}>Cancel</button>
//             <button className="btn btn-primary" onClick={save}>
//               <Save className="w-4 h-4 mr-2" /> {isEdit ? 'Save Changes' : 'Create Template'}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const PatternModal = () => {
//     interface WorkPatternForm extends Omit<WorkPattern, 'meta'> {
//       meta: PatternMeta;
//     }

//     const isEdit = !!editingPattern;
//     const isWork = (s: PatternStep): s is Extract<PatternStep, { type: 'work' }> => s.type === 'work';

//     const DEFAULT_META: PatternMeta = {
//       align: 'next-monday',
//       weekendPolicy: 'weekends-off',
//       weekendDays: [6, 0],
//     };

//     const [form, setForm] = useState<WorkPatternForm>(() =>
//       editingPattern
//         ? {
//             ...editingPattern,
//             meta: editingPattern.meta ?? DEFAULT_META,
//           }
//         : {
//             id: 0,
//             name: '',
//             description: '',
//             sequence: [shiftTemplates[0] ? { type: 'work', template: shiftTemplates[0].id } : { type: 'off' }],
//             meta: DEFAULT_META,
//           }
//     );

//     useEffect(() => {
//       if (editingPattern) {
//         setForm({
//           ...editingPattern,
//           meta: editingPattern.meta ?? DEFAULT_META,
//         });
//       }
//     }, [editingPattern]);

//     const addDay = () =>
//       setForm(prev => {
//         const next: PatternStep = shiftTemplates[0]
//           ? { type: 'work', template: shiftTemplates[0].id }
//           : { type: 'off' };
//         return { ...prev, sequence: [...prev.sequence, next] };
//       });

//     const removeDay = (idx: number) =>
//       setForm(prev => ({ ...prev, sequence: prev.sequence.filter((_, i) => i !== idx) }));

//     const changeType = (idx: number, val: 'work' | 'off') =>
//       setForm(prev => {
//         const seq = [...prev.sequence];
//         if (val === 'off') {
//           seq[idx] = { type: 'off' };
//         } else {
//           const current = seq[idx];
//           const tplId = isWork(current) ? current.template : (shiftTemplates[0]?.id ?? 0);
//           seq[idx] = tplId ? { type: 'work', template: tplId } : { type: 'off' };
//         }
//         return { ...prev, sequence: seq };
//       });

//     const changeTpl = (idx: number, tplId: number) =>
//       setForm(prev => {
//         const seq = [...prev.sequence];
//         seq[idx] = { type: 'work', template: tplId };
//         return { ...prev, sequence: seq };
//       });

//     if (!showPatternModal) return null;

//     const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
//     const jsDowFromMonIndex = (i: number) => [1, 2, 3, 4, 5, 6, 0][i % 7];

//     const previewDays: PatternStep[] = (() => {
//       const out: PatternStep[] = [];
//       if (!form.sequence.length) return out;
//       let stepIndex = 0;
//       for (let i = 0; i < 28; i++) {
//         const jsDow = jsDowFromMonIndex(i);
//         const isWknd = (form.meta?.weekendPolicy ?? DEFAULT_META.weekendPolicy) === 'weekends-off'
//           && (form.meta?.weekendDays ?? DEFAULT_META.weekendDays).includes(jsDow);
//         if (isWknd) {
//           out.push({ type: 'off' });
//           continue;
//         }
//         const step = form.sequence[stepIndex % form.sequence.length];
//         out.push(step);
//         stepIndex++;
//       }
//       return out;
//     })();

//     const save = async () => {
//       try {
//         const payload = {
//           name: form.name,
//           description: form.description ?? null,
//           sequence: form.sequence.map(s =>
//             isWork(s) ? { type: 'work', template: s.template } : { type: 'off' }
//           ),
//           meta: form.meta ?? DEFAULT_META,
//         };

//         if (isEdit) {
//           const res = await fetch(`${API_BASE_URL}/api/schedules/patterns/${form.id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload),
//           });
//           if (!res.ok) throw new Error(`Update pattern HTTP ${res.status}`);
//           setPatterns(prev => prev.map(p => (p.id === form.id ? { ...form } : p)));
//         } else {
//           const res = await fetch(`${API_BASE_URL}/api/schedules/patterns`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload),
//           });
//           if (!res.ok) throw new Error(`Create pattern HTTP ${res.status}`);
//           const data = await res.json();
//           setPatterns(prev => [...prev, { ...form, id: data.id }]);
//         }

//         setShowPatternModal(false);
//         setEditingPattern(null);
//       } catch (e) {
//         console.error(e);
//         alert('Failed to save pattern');
//       }
//     };

//     return (
//       <div className="modal modal-open">
//         <div className="modal-box max-w-6xl max-h-[95vh] flex flex-col">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-primary/10 rounded-lg">
//                 <Settings className="w-5 h-5 text-primary" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold">{isEdit ? 'Edit Pattern' : 'Create Pattern'}</h3>
//                 <p className="text-sm opacity-70">Define a repeating sequence of work/off days</p>
//               </div>
//             </div>
//             <button
//               onClick={() => {
//                 setShowPatternModal(false);
//                 setEditingPattern(null);
//               }}
//               className="btn btn-ghost btn-sm"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           <div className="flex-1 overflow-auto flex flex-col lg:flex-row gap-6">
//             <div className="w-full lg:w-1/2 space-y-6">
//               <div>
//                 <label className="label">Pattern Name</label>
//                 <input
//                   className="input input-bordered w-full"
//                   value={form.name}
//                   onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
//                 />
//               </div>

//               <div>
//                 <label className="label">Description</label>
//                 <textarea
//                   className="textarea textarea-bordered w-full"
//                   rows={3}
//                   value={form.description ?? ''}
//                   onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
//                 />
//               </div>

//               <div className="card bg-base-200 p-4">
//                 <h4 className="font-semibold mb-3">Application rules</h4>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="label">Alignment</label>
//                     <select
//                       className="select select-bordered w-full"
//                       value={form.meta?.align ?? 'next-monday'}
//                       onChange={e =>
//                         setForm(p => ({
//                           ...p,
//                           meta: { ...p.meta, align: e.target.value as AlignMode },
//                         }))
//                       }
//                     >
//                       <option value="range-start">Start at selected range start</option>
//                       <option value="next-monday">Start on next Monday</option>
//                     </select>
//                     <div className="text-xs opacity-70 mt-1">
//                       "Start on next Monday" keeps 5/2 patterns aligned to Mon-Fri.
//                     </div>
//                   </div>

//                   <div>
//                     <label className="label">Weekend handling</label>
//                     <select
//                       className="select select-bordered w-full"
//                       value={form.meta?.weekendPolicy ?? 'weekends-off'}
//                       onChange={e =>
//                         setForm(p => ({
//                           ...p,
//                           meta: { ...p.meta, weekendPolicy: e.target.value as WeekendPolicy },
//                         }))
//                       }
//                     >
//                       <option value="ignore">Ignore (apply every day)</option>
//                       <option value="weekends-off">Weekends Off (don't advance pattern)</option>
//                     </select>

//                     {(form.meta?.weekendPolicy ?? 'weekends-off') === 'weekends-off' && (
//                       <div className="mt-2">
//                         <label className="label">Weekend days</label>
//                         <select
//                           className="select select-bordered w-full"
//                           value={JSON.stringify(form.meta?.weekendDays ?? [6,0])}
//                           onChange={e =>
//                             setForm(p => ({
//                               ...p,
//                               meta: { ...p.meta, weekendDays: JSON.parse(e.target.value) as number[] },
//                             }))
//                           }
//                         >
//                           <option value="[6,0]">Saturday & Sunday</option>
//                           <option value="[5,6]">Friday & Saturday</option>
//                           <option value="[0]">Sunday only</option>
//                           <option value="[6]">Saturday only</option>
//                         </select>
//                         <div className="text-xs opacity-70 mt-1">
//                           Choose how weekends are defined for your company/site.
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="label">Sequence</label>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   {form.sequence.map((step, idx) => (
//                     <div key={idx} className="card bg-base-100 border p-4">
//                       <div className="flex items-center justify-between mb-3">
//                         <span className="font-semibold">Day {idx + 1}</span>
//                         {form.sequence.length > 1 && (
//                           <button
//                             type="button"
//                             className="btn btn-ghost btn-xs text-error"
//                             onClick={() => setPendingRemove(idx)}
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         )}
//                       </div>

//                       <div className="join w-full mb-3">
//                         <button
//                           type="button"
//                           className={`btn join-item flex-1 ${step.type === 'work' ? 'btn-primary' : 'btn-ghost'}`}
//                           onClick={() => changeType(idx, 'work')}
//                         >
//                           Work
//                         </button>
//                         <button
//                           type="button"
//                           className={`btn join-item flex-1 ${step.type === 'off' ? 'btn-primary' : 'btn-ghost'}`}
//                           onClick={() => changeType(idx, 'off')}
//                         >
//                           Off
//                         </button>
//                       </div>

//                       {step.type === 'work' ? (
//                         <div>
//                           <label className="label text-xs">Template</label>
//                           <select
//                             className="select select-bordered w-full"
//                             value={String((step as PatternStepWork).template)}
//                             onChange={(e) => changeTpl(idx, parseInt(e.target.value, 10))}
//                           >
//                             {shiftTemplates.length ? (
//                               shiftTemplates.map((t) => (
//                                 <option key={t.id} value={t.id}>
//                                   {t.name}
//                                 </option>
//                               ))
//                             ) : (
//                               <option value="">No templates available</option>
//                             )}
//                           </select>
//                         </div>
//                       ) : (
//                         <div className="text-sm opacity-70 text-center py-2">Day Off</div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <button className="btn btn-outline w-full mt-3" onClick={addDay}>
//                   <Plus className="w-4 h-4" />
//                   Add Day
//                 </button>
//               </div>
//             </div>

//             <div className="w-full lg:w-1/2">
//               <h4 className="text-lg font-semibold mb-4">Preview (28 days)</h4>
//               <div className="grid grid-cols-7 gap-1 mb-2">
//                 {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => {
//                   const jsd = [1,2,3,4,5,6,0][i];
//                   const isWknd =
//                     (form.meta?.weekendPolicy ?? 'weekends-off') === 'weekends-off' &&
//                     (form.meta?.weekendDays ?? [6,0]).includes(jsd);
//                   return (
//                     <div
//                       key={d}
//                       className={`text-center text-xs font-medium p-1 rounded ${
//                         isWknd ? 'bg-error text-error-content' : 'bg-base-200'
//                       }`}
//                     >
//                       {d}
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="grid grid-cols-7 gap-1">
//                 {previewDays.map((step, i) => {
//                   const jsd = [1,2,3,4,5,6,0][i % 7];
//                   const isWeekend =
//                     (form.meta?.weekendPolicy ?? 'weekends-off') === 'weekends-off' &&
//                     (form.meta?.weekendDays ?? [6,0]).includes(jsd);

//                   const tpl = step.type === 'work'
//                     ? shiftTemplates.find(t => t.id === (step as PatternStepWork).template)
//                     : undefined;

//                   return (
//                     <div key={i} className={`border rounded p-1 ${isWeekend ? 'bg-error/10' : ''}`}>
//                       <div className="text-[10px] font-medium opacity-70 mb-1">
//                         {['M','T','W','T','F','S','S'][i % 7]} • {i + 1}
//                       </div>
//                       {step.type === 'work' && tpl ? (
//                         <div className={`text-[10px] p-1 rounded text-center ${tpl.color}`}>
//                           <div className="font-medium">{tpl.start}</div>
//                           <div>{tpl.end}</div>
//                         </div>
//                       ) : (
//                         <div className="text-[10px] opacity-50 text-center p-1">Off</div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           <div className="modal-action mt-6">
//             <button
//               className="btn btn-ghost"
//               onClick={() => {
//                 setShowPatternModal(false);
//                 setEditingPattern(null);
//               }}
//             >
//               Cancel
//             </button>
//             <button className="btn btn-primary" onClick={save}>
//               <Save className="w-4 h-4 mr-2" /> {isEdit ? 'Save Changes' : 'Create Pattern'}
//             </button>
//           </div>
//         </div>

//         {pendingRemove !== null && (
//           <div className="modal modal-open">
//             <div className="modal-box">
//               <h4 className="font-semibold mb-2">Remove this day?</h4>
//               <p className="text-sm opacity-70 mb-4">
//                 Day {pendingRemove + 1} will be removed from the sequence.
//               </p>
//               <div className="modal-action">
//                 <button
//                   className="btn btn-ghost"
//                   onClick={() => setPendingRemove(null)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn btn-error"
//                   onClick={() => {
//                     removeDay(pendingRemove);
//                     setPendingRemove(null);
//                   }}
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

  

//   /* ================= Main Views ================= */
//   const ScheduleListTable = () => (
//     <div className="card bg-base-100 shadow-lg">
//       <div className="card-body p-0">
        
// {/* Header Controls */}
// <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border-b">
//   <div className="flex items-center gap-3 w-full md:w-auto">
//     <SearchBox
//       onSearchApply={handleSearchApply}
//       onClearSearch={handleClearSearch}
//     />
//     <button
//       onClick={() => setShowFilters(s => !s)}
//       className={`btn ${showFilters ? 'btn-primary' : 'btn-ghost'}`}
//     >
//       <Filter className="w-4 h-4" /> Filters
//     </button>
//   </div>
  
//   {/* Search status indicator */}
//   {appliedSearchTerm && (
//     <div className="flex items-center gap-2 text-sm">
//       <span className="opacity-70">Search:</span>
//       <span className="font-semibold">"{appliedSearchTerm}"</span>
//       <span className="opacity-70">•</span>
//       <span className="opacity-70">{baseFilteredEmployees.length} results</span>
//     </div>
//   )}
// </div>


//         {/* Table Controls */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 bg-base-200">
//           <div className="flex flex-wrap items-center gap-3 text-sm">
//             <span>
//               Showing <strong>{totalRows ? pageStartIdx + 1 : 0}-{pageEndIdx}</strong> of <strong>{totalRows}</strong> rows
//             </span>
//             <label className="flex items-center gap-2">
//               <span className="opacity-70">Rows:</span>
//               <select className="select select-xs" value={tablePageSize} onChange={(e) => { setTablePageSize(parseInt(e.target.value, 10)); setTablePage(1); }}>
//                 {[10, 20, 30, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
//               </select>
//             </label>
//             <div className="flex items-center gap-1">
//               <button className="btn btn-xs" disabled={tablePage <= 1} onClick={() => setTablePage(p => Math.max(1, p - 1))}>
//                 <ChevronLeft className="w-4 h-4" />
//               </button>
//               <span className="opacity-70 text-xs">Page {tablePage} / {totalTablePages}</span>
//               <button className="btn btn-xs" disabled={tablePage >= totalTablePages} onClick={() => setTablePage(p => Math.min(totalTablePages, p + 1))}>
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <div className="flex items-center gap-2">
//               <label className="text-xs opacity-70">Save scope</label>
//               <select
//                 className="select select-xs"
//                 value={saveScope}
//                 onChange={(e) => setSaveScope(e.target.value as SaveScope)}
//               >
//                 <option value="changed">Changes only</option>
//                 <option value="selected">Selected rows</option>
//                 <option value="page">Current page</option>
//                 <option value="all">All filtered</option>
//               </select>
//             </div>

//             <div className={`badge ${dirty ? 'badge-warning' : 'badge-ghost'}`}>
//               {dirty ? `${changedKeys.size} unsaved` : lastSavedAt ? `Saved ${lastSavedAt}` : ''}
//             </div>
//             <button className={`btn btn-sm ${dirty ? 'btn-primary' : 'btn-ghost'}`} onClick={handleSave} disabled={saving || (!dirty && saveScope==='changed')}>
//               <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
//             </button>
//           </div>
//         </div>

//         {/* Error/Success Message */}
//         {(saveError || (!dirty && lastSavedAt)) && (
//           <div className={`p-3 border-b ${saveError ? 'bg-error text-error-content' : 'bg-success text-success-content'}`}>
//             {saveError ? saveError : `Saved successfully at ${lastSavedAt}`}
//           </div>
//         )}

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="table table-zebra">
//             <thead>
//               <tr>
//                 <th>
//                   <label className="flex items-center gap-2">
//                     <input type="checkbox" className="checkbox checkbox-sm" checked={allPageSelected} onChange={(e)=>toggleSelectPage(e.target.checked)} />
//                     <span className="text-sm">Select</span>
//                   </label>
//                 </th>
//                 <th className="cursor-pointer" onClick={() => handleSort('employeeName')}>
//                   Name {getSortIcon('employeeName')}
//                 </th>
//                 <th className="cursor-pointer" onClick={() => handleSort('employeeNo')}>
//                   Employee No {getSortIcon('employeeNo')}
//                 </th>
//                 <th className="cursor-pointer" onClick={() => handleSort('department')}>
//                   Department {getSortIcon('department')}
//                 </th>
//                 <th>TZ</th>
//                 <th className="cursor-pointer" onClick={() => handleSort('date')}>
//                   Date {getSortIcon('date')}
//                 </th>
//                 <th className="cursor-pointer" onClick={() => handleSort('netHours')}>
//                   Total {getSortIcon('netHours')}
//                 </th>
//                 <th>Working Day</th>
//                 <th>Change Shift?</th>
//                 <th className="cursor-pointer" onClick={() => handleSort('status')}>
//                   Status {getSortIcon('status')}
//                 </th>
//                 <th>Start Time</th>
//                 <th>End Time</th>
//                 <th className="cursor-pointer" onClick={() => handleSort('pattern')}>
//                   Pattern {getSortIcon('pattern')}
//                 </th>
//                 <th>Template</th>
//                 <th>Remark</th>
//                 <th>Quick</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedData.length === 0 ? (
//                 <tr>
//                   <td colSpan={16}>
//                     <div className="text-center py-8">
//                       <div className="text-4xl mb-4">📅</div>
//                       <h3 className="text-lg font-medium">No schedule entries found</h3>
//                       <p className="mt-1 text-sm opacity-70">Try adjusting your search or filter.</p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 paginatedData.map((item, idx) => {
//                   const emp = allEmployees.find(e => e.id === item.employeeId);
//                   const tzVal = emp?.time_zone || 'Asia/Kuala_Lumpur';
//                   const rid = item.id;
//                   const [empIdStr, dayStr] = rid.split('-');
//                   const eId = parseInt(empIdStr, 10);
//                   const d = parseInt(dayStr, 10);
//                   const remarkValue = remarkDrafts[rid] ?? item.remarks;

//                   return (
//                     <tr key={rid} className="hover">
//                       <td>
//                         <input
//                           type="checkbox"
//                           className="checkbox checkbox-sm"
//                           checked={selectedRowIds.has(rid)}
//                           onChange={(e) => {
//                             setSelectedRowIds(prev => {
//                               const next = new Set(prev);
//                               if (e.target.checked) next.add(rid);
//                               else next.delete(rid);
//                               return next;
//                             });
//                           }}
//                         />
//                       </td>
//                       <td className="font-semibold">{item.employeeName}</td>
//                       <td>{item.employeeNo}</td>
//                       <td>{item.department}</td>
//                       <td>
//                         <select
//                           className="select select-xs w-40"
//                           value={tzVal}
//                           onChange={async (e) => {
//                             const tz = e.target.value;
//                             try {
//                               const resp = await fetch(`${API_BASE_URL}/api/admin/${item.employeeId}/timezone`, {
//                                 method: 'PATCH',
//                                 headers: { 'Content-Type': 'application/json'},
//                                 body: JSON.stringify({ time_zone: tz })
//                               });
//                               if (!resp.ok) throw new Error('Failed to update TZ');
//                               setAllEmployees(prev => prev.map(emp => emp.id === item.employeeId ? { ...emp, time_zone: tz } : emp));
//                             } catch (err) {
//                               console.error(err);
//                               alert('Failed to update timezone');
//                             }
//                           }}
//                         >
//                           {TZ_OPTIONS.map(z => <option key={z} value={z}>{z}</option>)}
//                         </select>
//                       </td>
//                       <td>
//                         {new Date(item.dateISO).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
//                       </td>
//                       <td>{formatHours(item.netHours)}</td>
//                       <td>
//                         <input
//                           type="checkbox"
//                           checked={item.status !== 'off'}
//                           onChange={(e) => updateScheduleItem(rid, 'workingToggle', e.target.checked)}
//                           className="checkbox checkbox-sm"
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="checkbox"
//                           checked={item.changeShift}
//                           onChange={(e) => updateScheduleItem(rid, 'changeShift', e.target.checked)}
//                           className="checkbox checkbox-sm"
//                         />
//                       </td>
//                       <td>
//                         <select
//                           value={item.status}
//                           onChange={(e) => updateScheduleItem(rid, 'status', e.target.value as ShiftStatus)}
//                           className={`select select-xs ${
//                             item.status === 'off' ? 'bg-error text-error-content' :
//                             item.status === 'working' ? 'bg-success text-success-content' :
//                             'bg-warning text-warning-content'
//                           }`}
//                         >
//                           {statusOptions.map((s) => (
//                             <option key={s} value={s}>{s}</option>
//                           ))}
//                         </select>
//                       </td>
//                       <td>
//                         <input
//                           type="time"
//                           value={item.startTime}
//                           onChange={(e) => updateScheduleItem(rid, 'startTime', e.target.value)}
//                           className="input input-xs"
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="time"
//                           value={item.endTime}
//                           onChange={(e) => updateScheduleItem(rid, 'endTime', e.target.value)}
//                           className="input input-xs"
//                         />
//                       </td>
//                       <td>{item.patternName || '-'}</td>
//                       <td>{item.templateName || '-'}</td>
//                       <td>
//                         <input
//                           type="text"
//                           value={remarkValue}
//                           onChange={(e) => handleRemarkInput(rid, e.target.value)}
//                           onBlur={() => commitRemark(rid)}
//                           placeholder="Add remark..."
//                           className="input input-xs"
//                         />
//                       </td>
//                       <td>
//                         <div className="flex items-center gap-1">
//                           <QuickApplySelect rowId={rid} employeeId={eId} day={d} />
//                           <button className="btn btn-xs btn-ghost" onClick={()=>{
//                             setEditingCell({ employeeId: eId, day: d });
//                             setShowCustomTimeModal(true);
//                           }}>
//                             <MoreVertical className="w-4 h-4"/>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );


//   const TemplatesTab = () => {
//   const filteredTemplates = useMemo(() => {
//     const q = appliedTemplateSearch.trim().toLowerCase(); // Use appliedTemplateSearch instead of templateQuery
//     if (!q) return shiftTemplates;
//     return shiftTemplates.filter(t =>
//       t.name.toLowerCase().includes(q) ||
//       (t.label ?? '').toLowerCase().includes(q) ||
//       (t.description ?? '').toLowerCase().includes(q)
//     );
//   }, [shiftTemplates, appliedTemplateSearch]); // Changed to appliedTemplateSearch

//   const confirmDeleteTemplate = async () => {
//     if (!templateToDelete) return;
//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/api/schedules/templates/${templateToDelete.id}`,
//         { method: 'DELETE' }
//       );
//       if (!res.ok) throw new Error(`Delete template HTTP ${res.status}`);
//       setShiftTemplates(prev => prev.filter(t => t.id !== templateToDelete.id));
//     } catch (e) {
//       console.error(e);
//       alert('Failed to delete template');
//     } finally {
//       setTemplateToDelete(null);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Shift Templates</h2>
//           <p className="opacity-70">Create, edit and delete templates.</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <TemplateSearchBox
//             onSearchApply={handleTemplateSearchApply}
//             onClearSearch={handleTemplateSearchClear}
//           />
//           <button className="btn btn-primary" onClick={() => { setEditingTemplate(null); setShowTemplateModal(true); }}>
//             <Plus className="w-4 h-4" /> New Template
//           </button>
//         </div>
//       </div>

//       {/* Search status indicator */}
//       {appliedTemplateSearch && (
//         <div className="flex items-center gap-2 text-sm p-3 bg-base-200 rounded-lg">
//           <span className="opacity-70">Searching templates:</span>
//           <span className="font-semibold">"{appliedTemplateSearch}"</span>
//           <span className="opacity-70">•</span>
//           <span className="opacity-70">{filteredTemplates.length} results</span>
//           <button
//             className="btn btn-xs btn-ghost"
//             onClick={handleTemplateSearchClear}
//           >
//             Clear
//           </button>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredTemplates.map(t => (
//           <div key={t.id} className="card bg-base-100 shadow-lg border">
//             <div className="card-body">
//               <div className="flex items-center justify-between mb-4">
//                 <div className={`badge ${t.color} badge-lg`}>{t.name}</div>
//                 <div className="flex gap-2">
//                   <button className="btn btn-ghost btn-sm" onClick={()=>{ setEditingTemplate(t); setShowTemplateModal(true); }}>
//                     <Edit className="w-4 h-4" />
//                   </button>
//                   <button
//                     className="btn btn-ghost btn-sm text-error"
//                     onClick={() => setTemplateToDelete(t)}
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-y-2 text-sm">
//                 <span className="opacity-70">Start</span><span className="font-semibold">{t.start}</span>
//                 <span className="opacity-70">End</span><span className="font-semibold">{t.end}</span>
//                 <span className="opacity-70">Break</span><span className="font-semibold">{t.break_mins} mins</span>
//                 <span className="opacity-70">Net</span>
//                 <span className="font-semibold text-primary">{formatHours(calcNetHours(t.start,t.end,!!t.overnight,t.break_mins))}</span>
//               </div>
//               {t.overnight && <div className="flex items-center gap-1 text-secondary mt-2"><Moon className="w-4 h-4" /><span>Overnight</span></div>}
//               {t.description && <div className="mt-4 pt-4 border-t opacity-70 text-sm">{t.description}</div>}
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredTemplates.length === 0 && appliedTemplateSearch && (
//         <div className="text-center py-8">
//           <div className="text-4xl mb-4">🔍</div>
//           <h3 className="text-lg font-medium">No templates found</h3>
//           <p className="mt-1 text-sm opacity-70">No templates match "{appliedTemplateSearch}"</p>
//           <button
//             className="btn btn-ghost btn-sm mt-2"
//             onClick={handleTemplateSearchClear}
//           >
//             Clear search
//           </button>
//         </div>
//       )}

//       <TemplateModal />

//       {templateToDelete && (
//         <div className="modal modal-open">
//           <div className="modal-box">
//             <h4 className="font-semibold mb-2">Delete template?</h4>
//             <p className="text-sm opacity-70 mb-4">
//               "{templateToDelete.name}" will be permanently removed.
//             </p>
//             <div className="modal-action">
//               <button
//                 className="btn btn-ghost"
//                 onClick={() => setTemplateToDelete(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="btn btn-error"
//                 onClick={confirmDeleteTemplate}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const PatternsTab = () => {
//   const filteredPatterns = useMemo(() => {
//     const q = appliedPatternSearch.trim().toLowerCase();
//     if (!q) return patterns;
//     return patterns.filter(p =>
//       p.name.toLowerCase().includes(q) ||
//       (p.description ?? '').toLowerCase().includes(q)
//     );
//   }, [patterns, appliedPatternSearch]);

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Work Patterns</h2>
//           <p className="opacity-70">Create, edit and delete patterns.</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <TemplateSearchBox // Reusing the same component
//             onSearchApply={handlePatternSearchApply}
//             onClearSearch={handlePatternSearchClear}
//           />
//           <button className="btn btn-primary" onClick={() => { setEditingPattern(null); setShowPatternModal(true); }}>
//             <Plus className="w-4 h-4" /> New Pattern
//           </button>
//         </div>
//       </div>

//       {/* Search status indicator */}
//       {appliedPatternSearch && (
//         <div className="flex items-center gap-2 text-sm p-3 bg-base-200 rounded-lg">
//           <span className="opacity-70">Searching patterns:</span>
//           <span className="font-semibold">"{appliedPatternSearch}"</span>
//           <span className="opacity-70">•</span>
//           <span className="opacity-70">{filteredPatterns.length} results</span>
//           <button
//             className="btn btn-xs btn-ghost"
//             onClick={handlePatternSearchClear}
//           >
//             Clear
//           </button>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {filteredPatterns.map(p => (
//           <div key={p.id} className="card bg-base-100 shadow-lg border">
//             <div className="card-body">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h3 className="font-semibold">{p.name}</h3>
//                   <p className="text-sm opacity-70">{p.description}</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <button className="btn btn-ghost btn-sm" onClick={()=>{ setEditingPattern(p); setShowPatternModal(true); }}>
//                     <Edit className="w-4 h-4" />
//                   </button>
//                   <button
//                     className="btn btn-ghost btn-sm text-error"
//                     onClick={async () => {
//                       if (!confirm('Delete this pattern?')) return;
//                       try {
//                         const res = await fetch(`${API_BASE_URL}/api/schedules/patterns/${p.id}`, { method: 'DELETE' });
//                         if (!res.ok) throw new Error(`Delete pattern HTTP ${res.status}`);
//                         setPatterns(prev => prev.filter(x => x.id !== p.id));
//                       } catch (e) {
//                         console.error(e);
//                         alert('Failed to delete pattern');
//                       }
//                     }}
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <div className="font-medium text-sm mb-2">Preview</div>
//                 <div className="grid grid-cols-7 gap-1">
//                   {p.sequence.slice(0,7).map((s, i) => {
//                     const tpl = s.type==='work' ? shiftTemplates.find(t => t.id === (s as PatternStepWork).template) : undefined;
//                     return (
//                       <div key={i} className="aspect-square border rounded">
//                         {s.type==='work' && tpl
//                           ? <div className={`w-full h-full rounded flex flex-col justify-center items-center text-xs ${tpl.color}`}>
//                               <div className="font-bold">{tpl.start}</div>
//                               <div>{tpl.end}</div>
//                             </div>
//                           : <div className="w-full h-full flex items-center justify-center opacity-50">Off</div>}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="text-sm opacity-70">
//                 {p.sequence.filter(s=>s.type==='work').length} work days, {p.sequence.filter(s=>s.type==='off').length} off days
//               </div>

//               {p.meta && (
//                 <div className="mt-3 pt-3 border-t text-xs opacity-60">
//                   <div>Align: {p.meta.align === 'next-monday' ? 'Next Monday' : 'Range Start'}</div>
//                   <div>Weekends: {p.meta.weekendPolicy === 'weekends-off' ? 'Off' : 'Ignore'}</div>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredPatterns.length === 0 && appliedPatternSearch && (
//         <div className="text-center py-8">
//           <div className="text-4xl mb-4">🔍</div>
//           <h3 className="text-lg font-medium">No patterns found</h3>
//           <p className="mt-1 text-sm opacity-70">No patterns match "{appliedPatternSearch}"</p>
//           <button
//             className="btn btn-ghost btn-sm mt-2"
//             onClick={handlePatternSearchClear}
//           >
//             Clear search
//           </button>
//         </div>
//       )}

//       {filteredPatterns.length === 0 && !appliedPatternSearch && (
//         <div className="text-center py-8">
//           <div className="text-4xl mb-4">📊</div>
//           <h3 className="text-lg font-medium">No patterns created yet</h3>
//           <p className="mt-1 text-sm opacity-70">Create your first work pattern to get started</p>
//           <button
//             className="btn btn-primary mt-4"
//             onClick={() => { setEditingPattern(null); setShowPatternModal(true); }}
//           >
//             <Plus className="w-4 h-4 mr-2" /> Create Pattern
//           </button>
//         </div>
//       )}

//       <PatternModal />
//     </div>
//   );
// };

// const ImportModal = () => {
//   const [dragActive, setDragActive] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === 'dragenter' || e.type === 'dragover') {
//       setDragActive(true);
//     } else if (e.type === 'dragleave') {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
    
//     const files = e.dataTransfer.files;
//     if (files && files[0]) {
//       setSelectedFile(files[0]);
//     }
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files[0]) {
//       setSelectedFile(files[0]);
//     }
//   };

//   const parseExcelFile = async (file: File) => {
//     const XLSX = await import('xlsx');
//     const reader = new FileReader();
    
//     return new Promise<any>((resolve, reject) => {
//       reader.onload = (e) => {
//         try {
//           const data = e.target?.result;
//           const workbook = XLSX.read(data, { type: 'binary' });
          
//           // Parse all sheets
//           const result: Record<string, any[]> = {};
//           workbook.SheetNames.forEach(sheetName => {
//             const worksheet = workbook.Sheets[sheetName];
//             const jsonData = XLSX.utils.sheet_to_json(worksheet);
//             result[sheetName] = jsonData;
//           });
          
//           resolve(result);
//         } catch (error) {
//           reject(error);
//         }
//       };
      
//       reader.onerror = () => reject(new Error('Failed to read file'));
//       reader.readAsBinaryString(file);
//     });
//   };

//   const validateScheduleData = (data: any[]) => {
//     const errors: string[] = [];
//     const requiredFields = ['employeeid', 'date', 'status'];
    
//     data.forEach((row, index) => {
//       // Check required fields
//       requiredFields.forEach(field => {
//         if (row[field] === undefined || row[field] === '') {
//           errors.push(`Row ${index + 1}: Missing ${field}`);
//         }
//       });
      
//       // Validate date format
//       if (row.date) {
//         const date = new Date(row.date);
//         if (isNaN(date.getTime())) {
//           errors.push(`Row ${index + 1}: Invalid date format "${row.date}"`);
//         }
//       }
      
//       // Validate status
//       if (row.status && !['working', 'off', 'leave'].includes(row.status.toLowerCase())) {
//         errors.push(`Row ${index + 1}: Invalid status "${row.status}"`);
//       }
      
//       // Validate times if working
//       if (row.status === 'working') {
//         const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
//         if (row['start time'] && !timeRegex.test(row['start time'])) {
//           errors.push(`Row ${index + 1}: Invalid start time "${row['start time']}"`);
//         }
//         if (row['end time'] && !timeRegex.test(row['end time'])) {
//           errors.push(`Row ${index + 1}: Invalid end time "${row['end time']}"`);
//         }
//       }
//     });
    
//     return errors;
//   };

//   const mapExcelToSchedule = (excelRow: any) => {
//     // Parse date from various formats
//     let dateObj: Date | undefined;
    
//     if (excelRow.date instanceof Date) {
//       dateObj = excelRow.date;
//     } else if (typeof excelRow.date === 'string') {
//       const dateStr = excelRow.date;
      
//       // Try different date formats
//       if (dateStr.includes('/')) {
//         const parts = dateStr.split('/');
//         // Try DD/MM/YYYY format
//         if (parts[0].length <= 2 && parts[1].length <= 2 && parts[2].length === 4) {
//           dateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
//         } else if (parts[0].length <= 2 && parts[1].length <= 2 && parts[2].length === 4) {
//           dateObj = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
//         }
//       } else if (dateStr.includes('-')) {
//         const parts = dateStr.split('-');
//         if (parts[0].length === 4) {
//           // YYYY-MM-DD
//           dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
//         } else if (parts[2].length === 4) {
//           // DD-MM-YYYY
//           dateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
//         }
//       }
      
//       // If still not parsed, try Date constructor directly
//       if (!dateObj || isNaN(dateObj.getTime())) {
//         const parsed = new Date(dateStr);
//         if (!isNaN(parsed.getTime())) {
//           dateObj = parsed;
//         }
//       }
//     }
    
//     if (!dateObj || isNaN(dateObj.getTime())) {
//       throw new Error(`Invalid date: ${excelRow.date}`);
//     }
    
//     const year = dateObj.getFullYear();
//     const month = dateObj.getMonth();
//     const day = dateObj.getDate();
    
//     // Find employee
//     const employee = allEmployees.find(emp => 
//       emp.id === parseInt(excelRow.employeeid) || 
//       emp.employee_no === excelRow.employeeid?.toString()
//     );
    
//     if (!employee && !importConfig.createMissing) {
//       throw new Error(`Employee not found: ${excelRow.employeeid}`);
//     }
    
//     // Map to schedule format
//     return {
//       employee_id: employee?.id || parseInt(excelRow.employeeid),
//       day,
//       year,
//       month: month + 1, // API expects 1-based month
//       status: excelRow.status?.toLowerCase() || 'off',
//       start: excelRow['start time'] || null,
//       end: excelRow['end time'] || null,
//       break_mins: excelRow.break || excelRow['break minutes'] || 0,
//       overnight: excelRow.overnight === 'Yes' || excelRow.overnight === true,
//       notes: excelRow.remark || excelRow.notes || '',
//       template_id: null,
//       pattern_id: null
//     };
//   };

//   const processImport = async () => {
//     if (!selectedFile) return;
    
//     try {
//       setImportProgress({
//         stage: 'uploading',
//         message: 'Uploading file...',
//         processed: 0,
//         total: 0,
//         errors: []
//       });
      
//       // Parse Excel file
//       setImportProgress(prev => ({
//         ...prev!,
//         stage: 'parsing',
//         message: 'Parsing Excel file...'
//       }));
      
//       const excelData = await parseExcelFile(selectedFile);
      
//       // Validate data
//       setImportProgress(prev => ({
//         ...prev!,
//         stage: 'validating',
//         message: 'Validating schedule data...'
//       }));
      
//       const allErrors: string[] = [];
//       const scheduleData: any[] = [];
      
//       // Process each sheet
//       Object.entries(excelData).forEach(([sheetName, sheetData]) => {
//         if (Array.isArray(sheetData)) {
//           const errors = validateScheduleData(sheetData);
//           allErrors.push(...errors.map(e => `${sheetName}: ${e}`));
          
//           // Map valid rows
//           sheetData.forEach((row, index) => {
//             try {
//               const scheduleItem = mapExcelToSchedule(row);
//               scheduleData.push(scheduleItem);
//             } catch (error: any) {
//               allErrors.push(`${sheetName} Row ${index + 1}: ${error.message}`);
//             }
//           });
//         }
//       });
      
//       if (allErrors.length > 10) {
//         throw new Error(`Too many errors (${allErrors.length}). Please fix the file. First error: ${allErrors[0]}`);
//       }
      
//       if (allErrors.length > 0 && !window.confirm(
//         `Found ${allErrors.length} validation errors. Continue anyway?\n\n${allErrors.slice(0, 5).join('\n')}${allErrors.length > 5 ? '\n...' : ''}`
//       )) {
//         return;
//       }
      
//       // Import data
//       setImportProgress(prev => ({
//         ...prev!,
//         stage: 'importing',
//         message: 'Importing schedule data...',
//         total: scheduleData.length
//       }));
      
//       // Chunk and upload
//       const CHUNK_SIZE = 50;
//       const chunks = [];
//       for (let i = 0; i < scheduleData.length; i += CHUNK_SIZE) {
//         chunks.push(scheduleData.slice(i, i + CHUNK_SIZE));
//       }
      
//       let successCount = 0;
//       const importErrors: string[] = [];
      
//       for (let i = 0; i < chunks.length; i++) {
//         const chunk = chunks[i];
        
//         try {
//           const res = await fetch(`${API_BASE_URL}/api/schedules/bulk`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               items: chunk,
//               overwrite: importConfig.overwrite
//             })
//           });
          
//           if (!res.ok) {
//             const error = await res.text();
//             importErrors.push(`Chunk ${i + 1}: ${error}`);
//           } else {
//             successCount += chunk.length;
//           }
//         } catch (error: any) {
//           importErrors.push(`Chunk ${i + 1}: ${error.message}`);
//         }
        
//         setImportProgress(prev => ({
//           ...prev!,
//           processed: (i + 1) * CHUNK_SIZE,
//           message: `Imported ${successCount} of ${scheduleData.length} records...`
//         }));
//       }
      
//       if (importErrors.length > 0) {
//         throw new Error(
//           `Imported ${successCount} records with ${importErrors.length} errors:\n${importErrors.slice(0, 3).join('\n')}`
//         );
//       }
      
//       setImportProgress({
//         stage: 'complete',
//         message: `Successfully imported ${successCount} schedule records`,
//         processed: scheduleData.length,
//         total: scheduleData.length,
//         errors: []
//       });
      
//       // Refresh data
//       fetchAllEmployees();
//       if (employeeIds.length > 0) {
//         fetchSchedules(employeeIds, dateFrom, dateTo);
//       }
      
//     } catch (error: any) {
//       setImportProgress(prev => ({
//         ...prev!,
//         stage: 'error',
//         message: `Import failed: ${error.message}`,
//         errors: [error.message]
//       }));
//     }
//   };

//   const resetImport = () => {
//     setSelectedFile(null);
//     setImportProgress(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   if (!showImportModal) return null;

//   return (
//     <div className="modal modal-open">
//       <div className="modal-box max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <Upload className="w-5 h-5 text-primary" />
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold">Import Schedules</h3>
//               <p className="text-sm opacity-70">Upload Excel file with schedule data</p>
//             </div>
//           </div>
//           <button
//             onClick={() => {
//               setShowImportModal(false);
//               resetImport();
//             }}
//             className="btn btn-ghost btn-sm"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="flex-1 overflow-auto space-y-4">
//           {/* File Upload Area */}
//           {!importProgress && (
//             <div className="space-y-4">
//               <div className="card bg-base-100 border-2 border-dashed border-base-300 p-6">
//                 <div
//                   className={`flex flex-col items-center justify-center gap-4 ${dragActive ? 'bg-primary/5' : ''}`}
//                   onDragEnter={handleDrag}
//                   onDragLeave={handleDrag}
//                   onDragOver={handleDrag}
//                   onDrop={handleDrop}
//                 >
//                   <Upload className="w-12 h-12 opacity-50" />
//                   <div className="text-center">
//                     <p className="font-medium">Drop your Excel file here</p>
//                     <p className="text-sm opacity-70 mt-1">or</p>
//                   </div>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     className="hidden"
//                     accept=".xlsx,.xls,.csv"
//                     onChange={handleFileSelect}
//                     id="file-upload"
//                   />
//                   <label htmlFor="file-upload" className="btn btn-primary">
//                     Browse Files
//                   </label>
//                   <p className="text-xs opacity-70">
//                     Supported formats: Excel (.xlsx, .xls), CSV
//                   </p>
//                 </div>
                
//                 {selectedFile && (
//                   <div className="mt-4 p-3 bg-success/10 rounded-lg">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-success/20 rounded">
//                           <Download className="w-4 h-4 text-success" />
//                         </div>
//                         <div>
//                           <p className="font-medium">{selectedFile.name}</p>
//                           <p className="text-xs opacity-70">
//                             {(selectedFile.size / 1024).toFixed(2)} KB
//                           </p>
//                         </div>
//                       </div>
//                       <button
//                         className="btn btn-ghost btn-sm"
//                         onClick={() => setSelectedFile(null)}
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Import Options */}
//               <div className="card bg-base-200 p-4">
//                 <h4 className="font-semibold mb-3">Import Options</h4>
//                 <div className="space-y-4">
//                   <div className="form-control">
//                     <label className="label cursor-pointer justify-start gap-3">
//                       <input
//                         type="checkbox"
//                         className="checkbox checkbox-primary"
//                         checked={importConfig.overwrite}
//                         onChange={(e) => setImportConfig(prev => ({ ...prev, overwrite: e.target.checked }))}
//                       />
//                       <span className="label-text">Overwrite existing schedules</span>
//                     </label>
//                     <div className="text-xs opacity-70 ml-9">
//                       If checked, existing schedules will be replaced. If unchecked, only empty slots will be filled.
//                     </div>
//                   </div>
                  
//                   <div className="form-control">
//                     <label className="label cursor-pointer justify-start gap-3">
//                       <input
//                         type="checkbox"
//                         className="checkbox checkbox-primary"
//                         checked={importConfig.createMissing}
//                         onChange={(e) => setImportConfig(prev => ({ ...prev, createMissing: e.target.checked }))}
//                       />
//                       <span className="label-text">Create missing employees</span>
//                     </label>
//                     <div className="text-xs opacity-70 ml-9">
//                       If checked, new employees will be created if employee ID doesn't exist.
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Template Download */}
//               <div className="card bg-base-200 p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <h4 className="font-semibold">Need a template?</h4>
//                   <button
//                     className="btn btn-outline btn-sm"
//                     onClick={async () => {
//                       const XLSX = await import('xlsx');
//                       const wb = XLSX.utils.book_new();
                      
//                       // Create sample data
//                       const sampleData = [
//                         {
//                           employeeid: 1001,
//                           name: 'John Doe',
//                           date: '2024-01-15',
//                           'start time': '09:00',
//                           'end time': '17:00',
//                           status: 'working',
//                           break: 60,
//                           overnight: 'No',
//                           remark: 'Regular shift',
//                           'total hours': 8,
//                           'is working day': 'Yes',
//                           pattern: '',
//                           template: 'Office Shift'
//                         }
//                       ];
                      
//                       const ws = XLSX.utils.json_to_sheet(sampleData);
//                       XLSX.utils.book_append_sheet(wb, ws, 'Schedule');
                      
//                       // Add instructions sheet
//                       const instructions = [
//                         ['Field', 'Description', 'Required', 'Format/Values'],
//                         ['employeeid', 'Employee ID or Employee Number', 'Yes', 'Number or String'],
//                         ['name', 'Employee Name', 'No', 'String'],
//                         ['date', 'Schedule Date', 'Yes', 'YYYY-MM-DD or DD/MM/YYYY'],
//                         ['start time', 'Shift Start Time', 'If working', 'HH:MM (24h)'],
//                         ['end time', 'Shift End Time', 'If working', 'HH:MM (24h)'],
//                         ['status', 'Shift Status', 'Yes', 'working, off, leave'],
//                         ['break', 'Break Minutes', 'No', 'Number (e.g., 60)'],
//                         ['overnight', 'Overnight Shift', 'No', 'Yes/No'],
//                         ['remark', 'Notes', 'No', 'String'],
//                         ['total hours', 'Calculated Hours', 'No', 'Number'],
//                         ['is working day', 'Is Working Day', 'No', 'Yes/No'],
//                         ['pattern', 'Pattern Name', 'No', 'String'],
//                         ['template', 'Template Name', 'No', 'String']
//                       ];
                      
//                       const ws2 = XLSX.utils.aoa_to_sheet(instructions);
//                       XLSX.utils.book_append_sheet(wb, ws2, 'Instructions');
                      
//                       XLSX.writeFile(wb, 'Schedule_Import_Template.xlsx');
//                     }}
//                   >
//                     Download Template
//                   </button>
//                 </div>
//                 <p className="text-sm opacity-70">
//                   Download our template file to ensure proper formatting. The template includes all required fields and examples.
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Progress Section */}
//           {importProgress && (
//             <div className="card bg-base-100 p-6">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h4 className="font-semibold">Import Progress</h4>
//                   <div className={`badge ${
//                     importProgress.stage === 'complete' ? 'badge-success' :
//                     importProgress.stage === 'error' ? 'badge-error' :
//                     'badge-info'
//                   }`}>
//                     {importProgress.stage.toUpperCase()}
//                   </div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span>{importProgress.message}</span>
//                     {importProgress.total > 0 && (
//                       <span>{importProgress.processed} / {importProgress.total}</span>
//                     )}
//                   </div>
                  
//                   {importProgress.total > 0 && (
//                     <progress
//                       className="progress progress-primary w-full"
//                       value={importProgress.processed}
//                       max={importProgress.total}
//                     />
//                   )}
//                 </div>
                
//                 {importProgress.errors.length > 0 && (
//                   <div className="mt-4">
//                     <h5 className="font-medium text-error mb-2">Errors:</h5>
//                     <div className="max-h-40 overflow-y-auto bg-error/10 p-3 rounded">
//                       {importProgress.errors.map((error, index) => (
//                         <div key={index} className="text-sm text-error mb-1">
//                           • {error}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
                
//                 {importProgress.stage === 'complete' && (
//                   <div className="alert alert-success">
//                     <div>
//                       <span>✅ Import completed successfully!</span>
//                       <div className="text-sm mt-1">
//                         Imported {importProgress.processed} schedule records.
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 {importProgress.stage === 'error' && (
//                   <div className="alert alert-error">
//                     <div>
//                       <span>❌ Import failed. Please check the errors above.</span>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Modal Actions */}
//         <div className="modal-action mt-6">
//           {!importProgress || importProgress.stage === 'complete' || importProgress.stage === 'error' ? (
//             <>
//               <button
//                 className="btn btn-ghost"
//                 onClick={() => {
//                   setShowImportModal(false);
//                   resetImport();
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="btn btn-primary"
//                 onClick={processImport}
//                 disabled={!selectedFile || !!importProgress}
//               >
//                 Start Import
//               </button>
//             </>
//           ) : (
//             <button
//               className="btn btn-ghost"
//               onClick={() => {
//                 setShowImportModal(false);
//                 resetImport();
//               }}
//               disabled={['uploading', 'parsing', 'importing'].includes(importProgress.stage)}
//             >
//               Close
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

//   /* ================= Main Render ================= */
//   return (
//     <div className="min-h-screen bg-base-100">
//       <div className="p-6 max-w-full">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className="text-3xl font-bold">Task Scheduler</h1>
//               <p className="opacity-70 mt-1">Dynamic per-employee or bulk scheduling.</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="text-sm opacity-70">
//                 {new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//               </div>
//               <div className="divider divider-horizontal mx-2" />
//               <button className="btn btn-ghost" onClick={handleExportExcel}>
//                 <Download className="w-4 h-4" /> Export
//               </button>
//               <button className="btn btn-ghost"  onClick={() => setShowImportModal(true)}>
//                 <Upload className="w-4 h-4" /> Import
//               </button>
//             </div>
//           </div>


//   {/* ADD VISUAL FEEDBACK FOR RESTRICTED VIEW HERE */}
//   <div className="flex items-center gap-4 mb-4 p-3 bg-base-200 rounded-lg">
//     {user?.role === 'employee' && (
//       <div className="flex items-center gap-2">
//         <div className="badge badge-info badge-lg p-3">
//           👤 Employee View • My Company Only
//         </div>
//         <div className="text-sm opacity-70">
//           Viewing schedules for {companies.find(c => String(c.id) === String(userCompanyId))?.name || 'your company'}
//         </div>
//       </div>
//     )}
//     {user?.role === 'manager' && (
//       <div className="flex items-center gap-2">
//         <div className="badge badge-warning badge-lg p-3">
//           👨‍💼 Manager View • Managed Employees
//         </div>
//         <div className="text-sm opacity-70">
//           Viewing schedules for employees you manage
//         </div>
//       </div>
//     )}
//     {user?.role === 'admin' && (
//       <div className="flex items-center gap-2">
//         <div className="badge badge-success badge-lg p-3">
//           ⚙️ Admin View • All Companies
//         </div>
//         <div className="text-sm opacity-70">
//           Full access to all schedules and companies
//         </div>
//       </div>
//     )}
//   </div>

//           <div className="flex items-center justify-between">
//             <div className="tabs tabs-boxed">
//               <button className={`tab gap-2 ${activeView==='scheduler' ? 'tab-active' : ''}`} onClick={() => setActiveView('scheduler')}>
//                 <Calendar className="w-4 h-4" /> Scheduler
//               </button>
//               <button className={`tab gap-2 ${activeView==='templates' ? 'tab-active' : ''}`} onClick={() => setActiveView('templates')}>
//                 <Clock className="w-4 h-4" /> Templates
//               </button>
//               <button className={`tab gap-2 ${activeView==='patterns' ? 'tab-active' : ''}`} onClick={() => setActiveView('patterns')}>
//                 <Settings className="w-4 h-4" /> Patterns
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         {showFilters && activeView === 'scheduler' && (
//           <div className="card bg-base-100 shadow-lg mb-6">
//             <div className="card-body">
//               <div className="grid grid-cols-1 xl:grid-cols-6 gap-4">
//                 <div>
//                   <label className="label">Month & Year</label>
//                   <select
//                     className="select select-bordered w-full"
//                     value={`${selectedYear}-${selectedMonth}`}
//                     onChange={(e) => {
//                       const [y, m] = e.target.value.split('-').map(Number);
//                       setSelectedYear(y); setSelectedMonth(m);
//                     }}
//                   >
//                     {Array.from({length:12},(_,m)=>(
//                       <option key={m} value={`${selectedYear}-${m}`}>
//                         {new Date(selectedYear, m).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* <div>
//                   <label className="label">Company</label>
//                   <select className="select select-bordered w-full" value={String(selectedCompany)} onChange={(e)=>{ setSelectedCompany(e.target.value==='All'?'All':e.target.value); setSelectedEmployeeId('All'); }}>
//                     <option value="All">All Companies</option>
//                     {companies.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
//                   </select>
//                 </div> */}


// <div>
//   <label className="label">Company</label>
//   <select 
//     className="select select-bordered w-full" 
//     value={String(selectedCompany)} 
//     onChange={(e)=>{ setSelectedCompany(e.target.value==='All'?'All':e.target.value); setSelectedEmployeeId('All'); }}
//   >
//     {user?.role === 'employee' ? (
//       // For employees, show only their company (not disabled)
//       companies
//         .filter(c => String(c.id) === String(userCompanyId))
//         .map(c => (
//           <option key={c.id} value={String(c.id)}>
//             {c.name}
//           </option>
//         ))
//     ) : (
//       // For admin/manager, show all companies
//       <>
//         <option value="All">All Companies</option>
//         {companies.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
//       </>
//     )}
//   </select>
// </div>

// <div>
//   <label className="label">Employee</label>
//   <select 
//     className="select select-bordered w-full" 
//     value={String(selectedEmployeeId)} 
//     onChange={(e)=>setSelectedEmployeeId(e.target.value==='All'?'All':e.target.value)}
//   >
//     <option value="All">All Employees</option>
//     {employeesForDropdown.map(e => (
//       <option key={e.id} value={String(e.id)}>{e.name}</option>
//     ))}
//   </select>
// </div>

//                 <div>
//                   <label className="label">Start Date</label>
//                   <input type="date" className="input input-bordered w-full" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
//                 </div>

//                 <div>
//                   <label className="label">End Date</label>
//                   <input type="date" className="input input-bordered w-full" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
//                 </div>

//                 <div>
//                   <label className="label">Status</label>
//                   <select className="select select-bordered w-full" value={selectedStatus} onChange={(e)=>setSelectedStatus(e.target.value as any)}>
//                     <option value="All">All Status</option>
//                     <option value="working">working</option>
//                     <option value="off">off</option>
//                     <option value="leave">leave</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Bulk Tools */}
//               <div className="mt-6">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
//                   <h4 className="font-semibold">Bulk Tools</h4>
//                   <div className="flex items-end gap-3">
//                     <div>
//                       <label className="label">Tool</label>
//                       <select
//                         className="select select-bordered"
//                         value={bulkTool}
//                         onChange={(e) => setBulkTool(e.target.value as BulkTool)}
//                       >
//                         <option value="time">Bulk Time Settings</option>
//                         <option value="template">Template Settings</option>
//                         <option value="pattern">Pattern Settings</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="label">Scope</label>
//                       <select
//                         className="select select-bordered"
//                         value={bulkScope}
//                         onChange={(e) => setBulkScope(e.target.value as BulkScope)}
//                       >
//                         <option value="selected">Selected rows</option>
//                         <option value="page">Current page</option>
//                         <option value="all">All filtered</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 {bulkTool === 'time' && (
//                   <div className="card bg-base-200 p-4">
//                     <h5 className="font-semibold mb-4">Bulk Time Settings</h5>
//                     <div className="flex flex-col md:flex-row md:items-end gap-3">
//                       <div>
//                         <label className="label">Start Time</label>
//                         <input
//                           type="time"
//                           className="input input-bordered"
//                           value={bulkStart}
//                           onChange={(e) => setBulkStart(e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <label className="label">End Time</label>
//                         <input
//                           type="time"
//                           className="input input-bordered"
//                           value={bulkEnd}
//                           onChange={(e) => setBulkEnd(e.target.value)}
//                         />
//                       </div>
//                       <div className="flex gap-2">
//                         {/* applyBulkTime */}
//                         <button className="btn btn-primary" onClick={applyBulkTimeWithHolidays}>Apply</button>
//                       </div>
//                       <p className="text-xs text-warning mt-2">
//                         Note: Public holidays will be automatically marked as "off" days
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {bulkTool === 'template' && (
//                   <div className="card bg-base-200 p-4">
//                     <h5 className="font-semibold mb-4">Template Settings</h5>
//                     <div className="flex flex-col md:flex-row md:items-end gap-3">
//                       <div>
//                         <label className="label">Template</label>
//                         <select
//                           className="select select-bordered"
//                           value={String(templateToApply)}
//                           onChange={(e) => setTemplateToApply(e.target.value ? Number(e.target.value) : '')}
//                         >
//                           <option value="">Select a template</option>
//                           {shiftTemplates.map((t) => (
//                             <option key={t.id} value={String(t.id)}>
//                               {t.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <div className="flex gap-2">
//                         {/* applyBulkTemplate */}
//                         <button className="btn btn-primary" onClick={applyBulkTemplateWithHolidays} disabled={!templateToApply}>Apply</button>
//                       </div>
//                       <p className="text-xs text-warning mt-2">
//                         Note: Public holidays will be automatically marked as "off" days
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* {bulkTool === 'pattern' && (
//                   <div className="card bg-base-200 p-4">
//                     <h5 className="font-semibold mb-4">Pattern Settings</h5>
//                     <p className="text-sm opacity-70 mb-3">Patterns apply across the current date range per employee.</p>
//                     <div className="flex flex-col md:flex-row md:items-end gap-3">
//                       <div>
//                         <label className="label">Pattern</label>
//                         <select
//                           className="select select-bordered"
//                           value={String(patternToApply)}
//                           onChange={(e) => setPatternToApply(e.target.value ? Number(e.target.value) : '')}
//                         >
//                           <option value="">Select a pattern</option>
//                           {patterns.map((p) => (
//                             <option key={p.id} value={String(p.id)}>
//                               {p.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div className="flex gap-2">
//                        applyBulkPattern 
//                         <button className="btn btn-primary" onClick={applyBulkPatternWithHolidays} disabled={!patternToApply}>
//                           Apply to {bulkScope === 'page' ? 'current page employees' : bulkScope === 'all' ? 'all filtered employees' : 'selected employees'}
//                         </button>
//                         <p className="text-xs text-warning mt-2">
//                           Note: Public holidays will be automatically marked as "off" days
//                       </p>
//                       </div>
//                     </div>
//                   </div>
//                 )} */}

//                 {bulkTool === 'pattern' && (
//   <div className="card bg-base-200 p-4">
//     <h5 className="font-semibold mb-4">Pattern Settings</h5>
//     <p className="text-sm text-info mb-3">
//       ⓘ Holidays will override pattern days. Pattern sequence continues normally.
//     </p>
//     <div className="flex flex-col md:flex-row md:items-end gap-3">
//       <div>
//         <label className="label">Pattern</label>
//         <select
//           className="select select-bordered"
//           value={String(patternToApply)}
//           onChange={(e) => setPatternToApply(e.target.value ? Number(e.target.value) : '')}
//         >
//           <option value="">Select a pattern</option>
//           {patterns.map((p) => (
//             <option key={p.id} value={String(p.id)}>
//               {p.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="flex gap-2">
//         <button 
//           className="btn btn-primary" 
//           onClick={applyBulkPatternWithHolidays} 
//           disabled={!patternToApply}
//         >
//           Apply Pattern (Respect Holidays)
//         </button>
//         <button 
//           className="btn btn-secondary" 
//           onClick={applyBulkPattern}  // Original function without holiday check
//           disabled={!patternToApply}
//           title="Apply pattern ignoring holidays"
//         >
//           Apply (Ignore Holidays)
//         </button>
//       </div>
//     </div>
//     <div className="mt-2 text-xs opacity-70">
//       Example: Pattern Mon-Fri work with holiday on Wednesday → Mon:Work, Tue:Work, Wed:Holiday, Thu:Work, Fri:Work
//     </div>
//   </div>
// )}
//               </div>

//               <div className="flex justify-between items-center mt-4 pt-4 border-t">
//                 <div className="text-sm opacity-70">
//                   Filtered employees: <strong>{baseFilteredEmployees.length}</strong> • Selected rows: <strong>{selectedRowIds.size}</strong>
//                 </div>
//                 <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
//                   Reset Filters
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Main Content */}
//         {activeView === 'scheduler' && <ScheduleListTable />}
//         {activeView === 'templates' && <TemplatesTab />}
//         {activeView === 'patterns' && <PatternsTab />}

//         {/* Modals */}
//         <CustomTimeModal />
//         <TemplateModal />
//         <PatternModal />
//         <ImportModal />
//       </div>
//     </div>
//   );
// }

'use client';
import { TimezoneUtils } from '../../utils/timezoneUtils'; // adjust path as needed
import React, { useState, useMemo, useEffect, useCallback, useRef, JSX } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar, Clock, Download, Upload, Plus, Edit, Trash2, Moon,
  Settings, Filter, Save, X, ChevronLeft, ChevronRight,
  ChevronsUpDown, ArrowUpDown, MoreVertical
} from 'lucide-react';
import { API_BASE_URL } from '../../config';



// Add this interface for import data
interface ImportScheduleRow {
  employeeId?: string | number;
  employeeNo?: string;
  name?: string;
  department?: string;
  date: string;
  status: 'working' | 'off' | 'leave';
  startTime?: string;
  endTime?: string;
  remarks?: string;
}

/* =========================== Types =========================== */
type ShiftStatus = 'working' | 'off' | 'leave';

interface User {
  id: number;
  role: 'admin' | 'manager' | 'employee' | string;
  [k: string]: unknown;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department_id: string | number | null;
  company_id: string | number | null;
  status: string;
  activation: string;
  joined_date: string;
  employee_no: string;
  employment_type: string;
  gender: string;
  role: string;
  race: string | null;
  religion: string | null;
  job_level: string | null;
  department_name: string | null;
  passport_expired_date: string;
  visa_expired_date: string;
  nationality: string;
  time_zone?: string;
}

interface Company { id: number; name: string }
interface Department { id: number; name: string }

interface ShiftTemplate {
  id: number;
  name: string;
  start: string;
  end: string;
  color: string;
  label: string | null;
  break_mins: number;
  overnight?: boolean;
  description?: string | null;
}

type AlignMode = 'range-start' | 'next-monday';
type WeekendPolicy = 'ignore' | 'weekends-off';

interface PatternStepWork { type: 'work'; template: number }
interface PatternStepOff  { type: 'off' }
type PatternStep = PatternStepWork | PatternStepOff;

interface PatternMeta {
  align: AlignMode;
  weekendPolicy: WeekendPolicy;
  weekendDays: number[];
}

interface WorkPattern {
  id: number;
  name: string;
  description: string | null;
  sequence: PatternStep[];
  meta?: PatternMeta;
}

interface CellSchedule {
  status: ShiftStatus;
  start: string;
  end: string;
  template: number | null;
  isCustom: boolean;
  notes: string;
  break_mins?: number;
  overnight?: boolean;
  pattern_id?: number | null;
}

interface EditingCell { employeeId: number; day: number }

type ApiPatternStep = {
  type?: 'work' | 'off';
  template?: number | string | null;
  step_type?: 'work' | 'off';
  template_id?: number | string | null;
};
interface ApiPattern {
  id: number;
  name: string;
  description?: string | null;
  sequence?: ApiPatternStep[];
  meta?: PatternMeta;
}

// Add Export Scope Type
type ExportScope = 'selected' | 'page' | 'filtered' | 'all';



/* =========================== Helpers =========================== */
const TZ_OPTIONS = TimezoneUtils.TZ_OPTIONS;

const labelToColor = (label?: string | null) => {
  const l = (label || '').toLowerCase();
  if (l.includes('night')) return 'bg-purple-100 text-purple-800 border-purple-200';
  if (l.includes('evening')) return 'bg-green-100 text-green-800 border-green-200';
  if (l.includes('office') || l.includes('morning')) return 'bg-blue-100 text-blue-800 border-blue-200';
  return 'bg-base-200 text-base-800 border-base-300';
};

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const formatHours = (hours: number) => `${hours.toFixed(1)}h`;



const calculateHours = (start: string, end: string, overnight = false): number => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let s = sh * 60 + sm, e = eh * 60 + em;
  if (overnight && e < s) e += 24 * 60;
  return Math.max(0, (e - s) / 60);
};

const calcNetHours = (start: string, end: string, overnight: boolean | undefined, breakMins: number | undefined) => {
  const gross = calculateHours(start, end, !!overnight);
  const net = Math.max(0, gross - (breakMins ?? 0) / 60);
  return net;
};

const monthDateToISO = (y: number, m: number, d: number) => {
  const dt = new Date(y, m, d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const parseISO = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const formatLocalISO = (dt: Date) => {
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
const addDaysISO = (iso: string, n: number) => {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return formatLocalISO(d);
};
const jsDow = (iso: string) => parseISO(iso).getDay();
const forEachDayISO = (startISO: string, endISO: string, fn: (iso: string, date: Date) => void) => {
  const end = parseISO(endISO);
  for (let cur = parseISO(startISO); cur <= end; cur.setDate(cur.getDate() + 1)) {
    fn(formatLocalISO(cur), new Date(cur));
  }
};

// SearchBox for Scheduler Tab
const SearchBox = React.memo(({
  onSearchApply,
  onClearSearch
}: {
  onSearchApply: (term: string) => void;
  onClearSearch: () => void;
}) => {
  const [localSearchInput, setLocalSearchInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleApplySearch = () => {
    onSearchApply(localSearchInput);
  };

  const handleClear = () => {
    setLocalSearchInput('');
    onClearSearch();
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplySearch();
    }
  };

  return (
    <div className="flex items-center gap-3 w-full md:w-auto">
      <div className="relative flex-1 max-w-2xl min-w-[260px]">
        <input
          ref={inputRef}
          className="input input-bordered w-full pl-10"
          placeholder="Search employees..."
          value={localSearchInput}
          onChange={(e) => setLocalSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" viewBox="0 0 24 24" fill="none">
          <path stroke="currentColor" strokeWidth="2" d="m21 21-4.3-4.3M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
        </svg>
        {localSearchInput && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-xs btn-ghost"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      <button
        className="btn btn-primary"
        onClick={handleApplySearch}
        disabled={!localSearchInput.trim()}
      >
        Search
      </button>
    </div>
  );
});

SearchBox.displayName = 'SearchBox';

// SearchBox for Template tab
const TemplateSearchBox = React.memo(({
  onSearchApply,
  onClearSearch
}: {
  onSearchApply: (term: string) => void;
  onClearSearch: () => void;
}) => {
  const [localSearchInput, setLocalSearchInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleApplySearch = () => {
    onSearchApply(localSearchInput);
  };

  const handleClear = () => {
    setLocalSearchInput('');
    onClearSearch();
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplySearch();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          ref={inputRef}
          className="input input-bordered input-sm"
          placeholder="Search templates…"
          value={localSearchInput}
          onChange={(e) => setLocalSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {localSearchInput && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-xs btn-ghost"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      <button
        className="btn btn-primary btn-sm"
        onClick={handleApplySearch}
        disabled={!localSearchInput.trim()}
      >
        Search
      </button>
    </div>
  );
});

TemplateSearchBox.displayName = 'TemplateSearchBox';

// SearchBox for Pattern tab
const PatternSearchBox = React.memo(({
  onSearchApply,
  onClearSearch
}: {
  onSearchApply: (term: string) => void;
  onClearSearch: () => void;
}) => {
  const [localSearchInput, setLocalSearchInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleApplySearch = () => {
    onSearchApply(localSearchInput);
  };

  const handleClear = () => {
    setLocalSearchInput('');
    onClearSearch();
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplySearch();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          ref={inputRef}
          className="input input-bordered input-sm"
          placeholder="Search patterns…"
          value={localSearchInput}
          onChange={(e) => setLocalSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {localSearchInput && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-xs btn-ghost"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      <button
        className="btn btn-primary btn-sm"
        onClick={handleApplySearch}
        disabled={!localSearchInput.trim()}
      >
        Search
      </button>
    </div>
  );
});

PatternSearchBox.displayName = 'PatternSearchBox';

/* =========================== Page =========================== */
export default function HRMSScheduler(): JSX.Element {
  const router = useRouter();

/* ---- Import State ---- */
const [importFile, setImportFile] = useState<File | null>(null);
const [importing, setImporting] = useState(false);

  /* ---- State ---- */
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [allDepartments, setAllDepartments] = useState<Department[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [activeView, setActiveView] = useState<'scheduler'|'templates'|'patterns'>('scheduler');
  const [showFilters, setShowFilters] = useState<boolean>(true);

  /* ---- Filters ---- */
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedCompany, setSelectedCompany] = useState<string | number>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | number>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | ShiftStatus>('All');

  const [searchInput, setSearchInput] = useState<string>(''); // Input field value
  const [appliedSearchTerm, setAppliedSearchTerm] = useState<string>('');
  const [appliedTemplateSearch, setAppliedTemplateSearch] = useState<string>('');
  const [appliedPatternSearch, setAppliedPatternSearch] = useState<string>('');

  const [dateFrom, setDateFrom] = useState<string>(() => monthDateToISO(now.getFullYear(), now.getMonth(), 1));
  const [dateTo, setDateTo] = useState<string>(() => monthDateToISO(now.getFullYear(), now.getMonth(), daysInMonth(now.getFullYear(), now.getMonth())));

  /* ---- Table State ---- */
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [tablePage, setTablePage] = useState<number>(1);
  const [tablePageSize, setTablePageSize] = useState<number>(20);
  type SortKey = 'employeeName' | 'employeeNo' | 'department' | 'date' | 'netHours' | 'status' | 'pattern';
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');

  /* ---- Bulk Operations ---- */
  const [bulkStart, setBulkStart] = useState<string>('09:00');
  const [bulkEnd, setBulkEnd] = useState<string>('18:00');
  const [templateToApply, setTemplateToApply] = useState<number | ''>('');
  const [patternToApply, setPatternToApply] = useState<number | ''>('');
  type BulkScope = 'selected' | 'page' | 'all';
  const [bulkScope, setBulkScope] = useState<BulkScope>('page');
  type SaveScope = 'changed' | 'selected' | 'page' | 'all';
  const [saveScope, setSaveScope] = useState<SaveScope>('changed');
  type BulkTool = 'time' | 'template' | 'pattern';
  const [bulkTool, setBulkTool] = useState<BulkTool>('time');

  /* ---- Data State ---- */
  const [scheduleData, setScheduleData] = useState<Record<string, CellSchedule>>({});
  const [shiftTemplates, setShiftTemplates] = useState<ShiftTemplate[]>([]);
  const [patterns, setPatterns] = useState<WorkPattern[]>([]);
  const [dirty, setDirty] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>('');
  const [lastSavedAt, setLastSavedAt] = useState<string>('');
  const [changedKeys, setChangedKeys] = useState<Set<string>>(new Set());

  /* ---- UI State ---- */
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ShiftTemplate | null>(null);
  const [showPatternModal, setShowPatternModal] = useState(false);
  const [editingPattern, setEditingPattern] = useState<WorkPattern | null>(null);
  const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [remarkDrafts, setRemarkDrafts] = useState<Record<string, string>>({});
  const [templateToDelete, setTemplateToDelete] = useState<ShiftTemplate | null>(null);
  const [pendingRemove, setPendingRemove] = useState<number | null>(null);
  const [userCompanyId, setUserCompanyId] = useState<string | number | null>(null);

  // Add Export State
  const [exportScope, setExportScope] = useState<ExportScope>('filtered');
  const [exporting, setExporting] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportIncludeSummary, setExportIncludeSummary] = useState<boolean>(true);
  const [exportIncludeMetadata, setExportIncludeMetadata] = useState<boolean>(true);
  const [exportIncludeHolidays, setExportIncludeHolidays] = useState<boolean>(true);

  // Add Import State
  const [showImportModal, setShowImportModal] = useState(false);

  /* ---- Import Progress ---- */
interface ImportProgress {
  processed: number;
  total: number;
  message: string;
  errors: string[];
}


interface ImportConfig {
  overwriteExisting: boolean;
  createMissingEmployees: boolean;
}

const [importConfig, setImportConfig] = useState<ImportConfig>({
  overwriteExisting: false,
  createMissingEmployees: false
});

const [importProgress, setImportProgress] = useState<ImportProgress>({
  processed: 0,
  total: 0,
  message: '',
  errors: []
});

  useEffect(() => {
    const userStr = localStorage.getItem('hrms_user');
    const isAuthenticated = localStorage.getItem('hrms_authenticated');
    if (!userStr || isAuthenticated !== 'true') {
      router.push('/auth/login');
      return;
    }
    try { 
      const userData = JSON.parse(userStr);
      setUser(userData);
      // Store user's company ID
      if (userData.company_id) {
        setUserCompanyId(userData.company_id);
        // Auto-select user's company for employees
        if (userData.role === 'employee') {
          setSelectedCompany(String(userData.company_id));
        }
      }
    } catch { 
      router.push('/auth/login'); 
    }
  }, [router]);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/schedules/templates`);
      if (!res.ok) throw new Error(`Templates HTTP ${res.status}`);
      const data = await res.json();
      const mapped: ShiftTemplate[] = (data || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        start: t.start_time,
        end: t.end_time,
        break_mins: t.break_mins ?? 0,
        overnight: !!t.overnight,
        label: t.label ?? null,
        description: t.description ?? null,
        color: labelToColor(t.label)
      }));
      setShiftTemplates(mapped);
    } catch (e) {
      console.error('fetch templates failed', e);
    }
  }, []);

  const fetchPatterns = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/schedules/patterns`);
      if (!res.ok) throw new Error(`Patterns HTTP ${res.status}`);
      const data: unknown = await res.json();
      const arr: ApiPattern[] = Array.isArray(data) ? (data as ApiPattern[]) : [];
      const mapped: WorkPattern[] = arr.map((p: ApiPattern): WorkPattern => {
        const seq: PatternStep[] = Array.isArray(p.sequence)
          ? p.sequence.map((s: ApiPatternStep): PatternStep =>
              (s.type ?? s.step_type) === 'work'
                ? { type: 'work', template: Number((s.template ?? s.template_id) ?? 0) }
                : { type: 'off' }
            )
          : [];
        const meta: PatternMeta = p.meta ?? {
          align: 'next-monday',
          weekendPolicy: 'ignore',
          weekendDays: [6, 0],
        };
        return {
          id: p.id,
          name: p.name,
          description: p.description ?? null,
          sequence: seq,
          meta,
        };
      });
      setPatterns(mapped);
    } catch (e) {
      console.error('fetch patterns failed', e);
    }
  }, []);

  const fetchAllEmployees = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      // Role-based filtering
      if (user.role === 'employee') {
        // For employees, fetch employees from their company only
        queryParams.append('company_id', String(user.company_id));
      } else if (user.role === 'manager') {
        queryParams.append('manager_id', String(user.id));
      }
      // For admin, no restrictions - fetch all employees

      const res = await fetch(`${API_BASE_URL}/api/admin/employees${queryParams.toString() ? `?${queryParams}` : ''}`);
      if (!res.ok) throw new Error(`Employees HTTP ${res.status}`);
      const data: any[] = await res.json();
      
      const mapped: Employee[] = data
        .filter((emp: any) => emp.role !== 'admin')
        .map((emp: any): Employee => ({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          position: emp.position || '',
          department_id: emp.department_id ?? '',
          company_id: emp.company_id ?? '',
          status: (emp.status?.toLowerCase() || 'active'),
          activation: emp.activation || 'Activated',
          joined_date: emp.joined_date || '',
          employee_no: emp.employee_no || '',
          employment_type: emp.employment_type || '',
          gender: emp.gender || '',
          role: emp.role || 'employee',
          race: emp.race ?? null,
          religion: emp.religion ?? null,
          job_level: emp.job_level ?? null,
          department_name: emp.department_name ?? null,
          passport_expired_date: emp.passport_expired_date || '',
          visa_expired_date: emp.visa_expired_date || '',
          nationality: emp.nationality || '',
          time_zone: emp.time_zone || 'Asia/Kuala_Lumpur'
        }));
      setAllEmployees(mapped);
    } catch (e) {
      console.error('fetch employees failed', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  //SearchBox for Schedular tab
  const handleSearchApply = useCallback((term: string) => {
    setAppliedSearchTerm(term);
    setTablePage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setAppliedSearchTerm('');
    setTablePage(1);
  }, []);

  //SearchBox for Template tab
  const handleTemplateSearchApply = useCallback((term: string) => {
    setAppliedTemplateSearch(term);
  }, []);

  const handleTemplateSearchClear = useCallback(() => {
    setAppliedTemplateSearch('');
  }, []);

  //SearchBox for Pattern tab
  const handlePatternSearchApply = useCallback((term: string) => {
    setAppliedPatternSearch(term);
  }, []);

  const handlePatternSearchClear = useCallback(() => {
    setAppliedPatternSearch('');
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchAllEmployees();
    fetchTemplates();
    fetchPatterns();

    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/companies`);
        const data = await res.json();
        setCompanies(
          (Array.isArray(data) ? data : data?.data ?? []).map((c: any) => ({
            id: c.id ?? c.company_id,
            name: c.name ?? c.company_name ?? `Company ${c.id || c.company_id}`,
          }))
        );
      } catch (e) { console.error(e); }
    };

    const fetchAllDepartments = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/departments`);
        const data = await res.json();
        const normalized: Department[] = (Array.isArray(data) ? data : data?.data ?? []).map((d: any) => ({
          id: d.id ?? d.department_id,
          name: d.name ?? d.department_name ?? `Dept ${d.id || d.department_id}`,
        }));
        setAllDepartments(normalized);
        setDepartments(normalized);
      } catch (e) { console.error(e); }
    };

    fetchCompanies();
    fetchAllDepartments();
  }, [user, fetchAllEmployees, fetchTemplates, fetchPatterns]);

  /* ================= Schedule Data Management ================= */
  const KEY_RE = /^(\d+)-(\d+)-(\d+)-(\d+)$/;
  const getScheduleKey = (employeeId: number, day: number) => `${employeeId}-${selectedYear}-${selectedMonth}-${day}`;
  const emptyCell: CellSchedule = { status: 'off', start: '', end: '', template: null, isCustom: false, notes: '', pattern_id: null };

  const getCellSchedule = (employeeId: number, day: number): CellSchedule => {
    const key = getScheduleKey(employeeId, day);
    return scheduleData[key] ?? emptyCell;
  };

  const markChanged = (key: string) => {
    setChangedKeys(prev => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  const setCellSchedule = (employeeId: number, day: number, patch: Partial<CellSchedule>) => {
    const key = getScheduleKey(employeeId, day);
    setScheduleData(prev => {
      const base = prev[key] ?? emptyCell;
      const merged = { ...base, ...patch };
      return { ...prev, [key]: merged };
    });
    markChanged(key);
    setDirty(true);
  };

  const applyBulkPatches = (patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }>) => {
    if (!patches.length) return;
    setScheduleData(prev => {
      const next = { ...prev };
      for (const { employeeId, day, patch } of patches) {
        const key = getScheduleKey(employeeId, day);
        const base = next[key] ?? emptyCell;
        next[key] = { ...base, ...patch };
        changedKeys.add(key);
      }
      return next;
    });
    setChangedKeys(new Set(changedKeys));
    setDirty(true);
  };

  const fetchSchedules = useCallback(
  async (employeeIds: number[], fromISO: string, toISO: string) => {
    try {
      if (!fromISO || !toISO || employeeIds.length === 0) return;
      
      // Role-based security: Filter employeeIds based on user role
      let filteredEmployeeIds = employeeIds;
      
      if (user?.role === 'employee' && userCompanyId) {
        // For employees, only allow access to employees in their company
        filteredEmployeeIds = employeeIds.filter(empId => {
          const emp = allEmployees.find(e => e.id === empId);
          return emp && String(emp.company_id) === String(userCompanyId);
        });
        
        if (filteredEmployeeIds.length === 0) {
          console.log('No accessible employees found for this employee user');
          return;
        }
      } else if (user?.role === 'manager') {
        // For managers, use existing manager filtering (your existing logic)
        // This maintains your current manager restrictions
        filteredEmployeeIds = employeeIds; // Keep existing manager logic
      }
      // For admin, no filtering needed

      const employeesByTimezone: Record<string, number[]> = {};
      filteredEmployeeIds.forEach(empId => {
        const emp = allEmployees.find(e => e.id === empId);
        // Additional security check
        if (user?.role === 'employee' && emp && String(emp.company_id) !== String(userCompanyId)) {
          return; // Skip employees not in user's company (double security)
        }
        const tz = emp?.time_zone || 'Asia/Kuala_Lumpur';
        if (!employeesByTimezone[tz]) employeesByTimezone[tz] = [];
        employeesByTimezone[tz].push(empId);
      });

      const allServerData: Record<string, CellSchedule> = {};
      const errors: string[] = [];
      
      await Promise.all(Object.entries(employeesByTimezone).map(async ([timezone, empIds]) => {
        try {
          const params = new URLSearchParams();
          params.set('from', fromISO);
          params.set('to', toISO);
          params.set('employee_id', empIds.join(','));
          params.set('timezone', timezone);
          const res = await fetch(`${API_BASE_URL}/api/schedules?${params.toString()}`);
          if (!res.ok) throw new Error(`HTTP ${res.status} for timezone ${timezone}`);
          const data = await res.json();
          for (const row of data) {
            const empId = row.employee_id;
            const localDate = new Date(row.schedule_date);
            const y = localDate.getFullYear();
            const m = localDate.getMonth();
            const d = localDate.getDate();
            const key = `${empId}-${y}-${m}-${d}`;
            allServerData[key] = {
              status: row.status,
              start: row.start_time || '',
              end: row.end_time || '',
              template: row.template_id || null,
              isCustom: !row.template_id,
              notes: row.notes || '',
              break_mins: row.break_mins || 0,
              overnight: !!row.overnight,
              pattern_id: row.pattern_id || null,
            };
          }
        } catch (error: any) {
          errors.push(`Timezone ${timezone}: ${error.message}`);
        }
      }));

      if (errors.length > 0) console.warn('Some timezone groups failed to fetch:', errors);
      
      const defaultSchedules: Record<string, CellSchedule> = {};
      forEachDayISO(fromISO, toISO, (iso, date) => {
        const day = date.getDate();
        const y = date.getFullYear();
        const m = date.getMonth();
        for (const empId of filteredEmployeeIds) {
          const key = `${empId}-${y}-${m}-${day}`;
          if (!allServerData[key]) {
            defaultSchedules[key] = emptyCell;
          }
        }
      });

      const merged = { ...defaultSchedules, ...allServerData };
      setScheduleData(prev => {
        const next = { ...prev };
        Object.keys(merged).forEach(key => { next[key] = merged[key]; });
        return next;
      });

      setDirty(false);
      setChangedKeys(new Set());
    } catch (e) {
      console.error('fetch schedules failed', e);
    }
  },
  [allEmployees, user, userCompanyId]
);

  const fetchSchedules_all = useCallback(
    async (employeeIds: number[], fromISO: string, toISO: string) => {
      try {
        if (!fromISO || !toISO || employeeIds.length === 0) return;
        const employeesByTimezone: Record<string, number[]> = {};
        employeeIds.forEach(empId => {
          const emp = allEmployees.find(e => e.id === empId);
          const tz = emp?.time_zone || 'Asia/Kuala_Lumpur';
          if (!employeesByTimezone[tz]) employeesByTimezone[tz] = [];
          employeesByTimezone[tz].push(empId);
        });

        const allServerData: Record<string, CellSchedule> = {};
        const errors: string[] = [];
        await Promise.all(Object.entries(employeesByTimezone).map(async ([timezone, empIds]) => {
          try {
            const params = new URLSearchParams();
            params.set('from', fromISO);
            params.set('to', toISO);
            params.set('employee_id', empIds.join(','));
            params.set('timezone', timezone);
            const res = await fetch(`${API_BASE_URL}/api/schedules?${params.toString()}`);
            if (!res.ok) throw new Error(`HTTP ${res.status} for timezone ${timezone}`);
            const data = await res.json();
            for (const row of data) {
              const empId = row.employee_id;
              const localDate = new Date(row.schedule_date);
              const y = localDate.getFullYear();
              const m = localDate.getMonth();
              const d = localDate.getDate();
              const key = `${empId}-${y}-${m}-${d}`;
              allServerData[key] = {
                status: row.status,
                start: row.start_time || '',
                end: row.end_time || '',
                template: row.template_id || null,
                isCustom: !row.template_id,
                notes: row.notes || '',
                break_mins: row.break_mins || 0,
                overnight: !!row.overnight,
                pattern_id: row.pattern_id || null,
              };
            }
          } catch (error: any) {
            errors.push(`Timezone ${timezone}: ${error.message}`);
          }
        }));

        if (errors.length > 0) console.warn('Some timezone groups failed to fetch:', errors);
        const defaultSchedules: Record<string, CellSchedule> = {};
        forEachDayISO(fromISO, toISO, (iso, date) => {
          const day = date.getDate();
          const y = date.getFullYear();
          const m = date.getMonth();
          for (const empId of employeeIds) {
            const key = `${empId}-${y}-${m}-${day}`;
            if (!allServerData[key]) {
              defaultSchedules[key] = emptyCell;
            }
          }
        });

        const merged = { ...defaultSchedules, ...allServerData };
        setScheduleData(prev => {
          const next = { ...prev };
          Object.keys(merged).forEach(key => { next[key] = merged[key]; });
          return next;
        });

        setDirty(false);
        setChangedKeys(new Set());
      } catch (e) {
        console.error('fetch schedules failed', e);
      }
    },
    [allEmployees]
  );

  /* ================= Derived Data ================= */
  const totalDays = useMemo(() => daysInMonth(selectedYear, selectedMonth), [selectedYear, selectedMonth]);
  const monthYearLabel = useMemo(
    () => new Date(selectedYear, selectedMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    [selectedYear, selectedMonth]
  );

  useEffect(() => {
    setDateFrom(monthDateToISO(selectedYear, selectedMonth, 1));
    setDateTo(monthDateToISO(selectedYear, selectedMonth, daysInMonth(selectedYear, selectedMonth)));
    setTablePage(1);
  }, [selectedYear, selectedMonth]);

  const employeesForDropdown_all = useMemo(() => {
    return allEmployees
      .filter(e => selectedCompany === 'All' ? true : String(e.company_id ?? '') === String(selectedCompany))
      .filter(e => selectedDepartment === 'All' ? true : (e.department_name || '') === selectedDepartment);
  }, [allEmployees, selectedCompany, selectedDepartment]);

  const employeesForDropdown = useMemo(() => {
    let filtered = allEmployees;
    
    // For employees, only show employees from their company
    if (user?.role === 'employee' && userCompanyId) {
      filtered = filtered.filter(e => String(e.company_id ?? '') === String(userCompanyId));
    } else if (selectedCompany !== 'All') {
      filtered = filtered.filter(e => String(e.company_id ?? '') === String(selectedCompany));
    }
    
    return filtered.filter(e => selectedDepartment === 'All' ? true : (e.department_name || '') === selectedDepartment);
  }, [allEmployees, user, userCompanyId, selectedCompany, selectedDepartment]);

  const baseFilteredEmployees: Employee[] = useMemo(() => {
    let out = allEmployees;
    
    // For employees, automatically filter to their company only
    if (user?.role === 'employee' && userCompanyId) {
      out = out.filter(e => String(e.company_id ?? '') === String(userCompanyId));
    } else if (selectedCompany !== 'All') {
      out = out.filter(e => String(e.company_id ?? '') === String(selectedCompany));
    }
    
    // Rest of the existing filters...
    if (selectedDepartment !== 'All') out = out.filter(e => (e.department_name || '') === selectedDepartment);
    if (selectedEmployeeId !== 'All') out = out.filter(e => String(e.id) === String(selectedEmployeeId));
    
    // Use appliedSearchTerm here
    if (appliedSearchTerm.trim()) {
      const t = appliedSearchTerm.toLowerCase();
      out = out.filter(e =>
        e.name.toLowerCase().includes(t) ||
        (e.employee_no || '').toLowerCase().includes(t) ||
        (e.department_name || '').toLowerCase().includes(t)
      );
    }
    return out;
  }, [allEmployees, user, userCompanyId, selectedCompany, selectedDepartment, selectedEmployeeId, appliedSearchTerm]);

  const employeeIds = useMemo(() => baseFilteredEmployees.map(e => e.id), [baseFilteredEmployees]);

  useEffect(() => {
    if (!employeeIds.length) return;
    fetchSchedules(employeeIds, dateFrom, dateTo);
  }, [employeeIds, dateFrom, dateTo, fetchSchedules]);

  /* ================= Pattern Application ================= */
  const mondayOfWeekISO = (iso: string) => {
    const d = parseISO(iso);
    const diff = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - diff);
    return formatLocalISO(d);
  };

  const applyPatternRange = (
    targetEmployeeIds: number[],
    patternId: number,
    startISO: string,
    endISO: string
  ) => {
    const pat = patterns.find(p => p.id === patternId);
    if (!pat || !pat.sequence?.length) return;

    const meta: PatternMeta = pat.meta ?? {
      align: 'next-monday',
      weekendPolicy: 'ignore',
      weekendDays: [6, 0]
    };

    let initialIdx = 0;
    if (meta.align === 'next-monday') {
      const weekMon = mondayOfWeekISO(startISO);
      let eligibleBefore = 0;
      forEachDayISO(weekMon, addDaysISO(startISO, -1), (_iso, date) => {
        const dow = date.getDay();
        const isWknd = meta.weekendPolicy === 'weekends-off' && meta.weekendDays.includes(dow);
        if (!isWknd) eligibleBefore++;
      });
      initialIdx = eligibleBefore % pat.sequence.length;
    }

    const patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }> = [];

    for (const eid of targetEmployeeIds) {
      let stepIndex = initialIdx;

      forEachDayISO(startISO, endISO, (_iso, date) => {
        const dow = date.getDay();
        const isWknd = meta.weekendPolicy === 'weekends-off' && meta.weekendDays.includes(dow);
        const dd = date.getDate();

        if (isWknd) {
          patches.push({
            employeeId: eid,
            day: dd,
            patch: {
              status: 'off',
              start: '',
              end: '',
              template: null,
              isCustom: false,
              break_mins: 0,
              overnight: false,
              pattern_id: patternId
            }
          });
          return;
        }

        const step = pat.sequence[stepIndex % pat.sequence.length];
        if (step.type === 'work') {
          const tpl = shiftTemplates.find(t => t.id === step.template);
          patches.push({
            employeeId: eid,
            day: dd,
            patch: tpl
              ? {
                  status: 'working',
                  start: tpl.start,
                  end: tpl.end,
                  template: tpl.id,
                  isCustom: false,
                  break_mins: tpl.break_mins,
                  overnight: tpl.overnight,
                  pattern_id: patternId
                }
              : { status: 'off', start: '', end: '', template: null, isCustom: false, break_mins: 0, overnight: false, pattern_id: patternId }
          });
        } else {
          patches.push({
            employeeId: eid,
            day: dd,
            patch: { status: 'off', start: '', end: '', template: null, isCustom: false, break_mins: 0, overnight: false, pattern_id: patternId }
          });
        }

        stepIndex++;
      });
    }

    applyBulkPatches(patches);
  };

  /* ================= Table Data & Sorting ================= */
  type RowItem = {
    id: string;
    employeeId: number;
    employeeName: string;
    employeeNo: string;
    department: string;
    dateISO: string;
    status: ShiftStatus;
    startTime: string;
    endTime: string;
    netHours: number;
    changeShift: boolean;
    remarks: string;
    patternName: string;
    templateName: string;
  };

  const monthRows: RowItem[] = useMemo(() => {
    const rows: RowItem[] = [];
    for (const emp of baseFilteredEmployees) {
      for (let d = 1; d <= totalDays; d++) {
        const sch = getCellSchedule(emp.id, d);
        const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;
        const net = sch.status === 'working'
          ? calcNetHours(sch.start, sch.end, sch.overnight ?? tpl?.overnight, sch.break_mins ?? tpl?.break_mins)
          : 0;
        const dateISO = monthDateToISO(selectedYear, selectedMonth, d);
        const patternName = sch.pattern_id ? (patterns.find(p => p.id === sch.pattern_id)?.name ?? '') : '';
        rows.push({
          id: `${emp.id}-${d}`,
          employeeId: emp.id,
          employeeName: emp.name,
          employeeNo: emp.employee_no || '',
          department: emp.department_name ?? '-',
          dateISO,
          status: sch.status,
          startTime: sch.start || '',
          endTime: sch.end || '',
          netHours: net,
          changeShift: !!sch.isCustom,
          remarks: sch.notes || '',
          patternName,
          templateName: tpl?.name ?? '',
        });
      }
    }
    return rows;
  }, [baseFilteredEmployees, selectedYear, selectedMonth, scheduleData, totalDays, shiftTemplates, patterns]);

  const rowsFilteredByDateStatus = useMemo(() => {
    const from = dateFrom;
    const to = dateTo;
    return monthRows.filter(r => (r.dateISO >= from && r.dateISO <= to) && (selectedStatus === 'All' ? true : r.status === selectedStatus));
  }, [monthRows, dateFrom, dateTo, selectedStatus]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const getSortIcon = (key: SortKey) => {
    if (key !== sortKey) return <ChevronsUpDown className="w-4 h-4 inline-block ml-1 opacity-50" />;
    return <ArrowUpDown className="w-4 h-4 inline-block ml-1" />;
  };

  const sortedData = useMemo(() => {
    const arr = [...rowsFilteredByDateStatus];
    arr.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortKey) {
        case 'employeeName': return a.employeeName.localeCompare(b.employeeName) * dir;
        case 'employeeNo': return a.employeeNo.localeCompare(b.employeeNo) * dir;
        case 'department': return (a.department || '').localeCompare(b.department || '') * dir;
        case 'date': return (a.dateISO < b.dateISO ? -1 : a.dateISO > b.dateISO ? 1 : 0) * dir;
        case 'netHours': return (a.netHours - b.netHours) * dir;
        case 'status': return a.status.localeCompare(b.status) * dir;
        case 'pattern': return (a.patternName || '').localeCompare(b.patternName || '') * dir;
        default: return 0;
      }
    });
    return arr;
  }, [rowsFilteredByDateStatus, sortKey, sortDir]);

  const totalRows = sortedData.length;
  const totalTablePages = Math.max(1, Math.ceil(totalRows / tablePageSize));
  const pageStartIdx = (tablePage - 1) * tablePageSize;
  const pageEndIdx = Math.min(pageStartIdx + tablePageSize, totalRows);
  const paginatedData = sortedData.slice(pageStartIdx, pageEndIdx);
  const pageRowIds = paginatedData.map(r => r.id);
  const allPageSelected = pageRowIds.length > 0 && pageRowIds.every(id => selectedRowIds.has(id));


  useEffect(() => { 
    setTablePage(1); 
    setSelectedRowIds(new Set()); 
  }, [selectedCompany, selectedDepartment, selectedEmployeeId, selectedStatus, selectedYear, selectedMonth, dateFrom, dateTo, appliedSearchTerm]);

  /* ================= Row Updates ================= */
  const statusOptions: ShiftStatus[] = ['working', 'off', 'leave'];

  const updateScheduleItem = (rowId: string, field: keyof RowItem | 'workingToggle', value: any) => {
    const [empIdStr, dayStr] = rowId.split('-');
    const employeeId = parseInt(empIdStr, 10);
    const day = parseInt(dayStr, 10);
    const sch = getCellSchedule(employeeId, day);

    if (field === 'workingToggle') {
      const nextStatus: ShiftStatus = value ? 'working' : 'off';
      const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;
      setCellSchedule(employeeId, day, {
        status: nextStatus,
        start: nextStatus === 'working' ? (sch.start || tpl?.start || '09:00') : '',
        end: nextStatus === 'working' ? (sch.end || tpl?.end || '17:00') : '',
      });
      return;
    }

    switch (field) {
      case 'status': {
        const nextStatus = value as ShiftStatus;
        if (nextStatus === 'working') {
          const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;
          setCellSchedule(employeeId, day, {
            status: 'working',
            start: sch.start || tpl?.start || '09:00',
            end: sch.end || tpl?.end || '17:00',
          });
        } else {
          setCellSchedule(employeeId, day, { status: nextStatus, start: '', end: '', template: nextStatus==='off'? null : sch.template });
        }
        break;
      }
      case 'startTime': setCellSchedule(employeeId, day, { start: value, status: 'working' }); break;
      case 'endTime': setCellSchedule(employeeId, day, { end: value, status: 'working' }); break;
      case 'remarks': setCellSchedule(employeeId, day, { notes: value }); break;
      case 'changeShift': setCellSchedule(employeeId, day, { isCustom: !!(value as boolean) }); break;
      default: break;
    }
  };

  const handleRemarkInput = (rowId: string, val: string) => {
    setRemarkDrafts(prev => ({ ...prev, [rowId]: val }));
  };

  const commitRemark = (rowId: string) => {
    const draft = remarkDrafts[rowId];
    if (draft === undefined) return;
    updateScheduleItem(rowId, 'remarks', draft);
  };

  /* ================= Save Operations ================= */
  const buildItemsFromRowIds = (rowIds: string[]) => {
    type Item = {
      employee_id: number;
      day: number;
      status: ShiftStatus;
      start: string | null;
      end: string | null;
      break_mins: number;
      overnight: boolean;
      template_id: number | null;
      notes: string;
      pattern_id: number | null;
    };
    const items: Item[] = [];
    const uniq = new Set(rowIds);

    for (const rid of uniq) {
      const [empIdStr, dayStr] = rid.split('-');
      const empId = Number(empIdStr);
      const d = Number(dayStr);
      if (!Number.isInteger(empId) || empId <= 0 || !Number.isInteger(d) || d <= 0) continue;

      const sch = getCellSchedule(empId, d);
      const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;
      const isWorking = sch.status === 'working';

      items.push({
        employee_id: empId,
        day: d,
        status: sch.status,
        start: isWorking ? (sch.start ?? tpl?.start ?? null) : null,
        end:   isWorking ? (sch.end   ?? tpl?.end   ?? null) : null,
        break_mins: isWorking ? (sch.break_mins ?? tpl?.break_mins ?? 0) : 0,
        overnight:  isWorking ? Boolean(sch.overnight ?? tpl?.overnight) : false,
        template_id: isWorking ? (sch.template ?? null) : null,
        notes: sch.notes || '',
        pattern_id: sch.pattern_id ?? null,
      });
    }
    return items;
  };

  const getRowIdsForScope = (scope: 'selected' | 'page' | 'all') => {
    if (scope === 'selected') return Array.from(selectedRowIds);
    if (scope === 'page') return paginatedData.map(r => r.id);
    return rowsFilteredByDateStatus.map(r => r.id);
  };

  const getChangedRowIdsForCurrentMonth = () => {
    const ids: string[] = [];
    for (const key of Array.from(changedKeys)) {
      const m = KEY_RE.exec(key);
      if (!m) continue;
      const [, empIdStr, yStr, moStr, dStr] = m;
      const y = Number(yStr), mo = Number(moStr);
      if (y === selectedYear && mo === selectedMonth) {
        ids.push(`${empIdStr}-${dStr}`);
      }
    }
    return ids;
  };

  const saveScoped = async (scope: SaveScope) => {
    type Item = ReturnType<typeof buildItemsFromRowIds>[number];
    let rowIds: string[] = [];
    if (scope === 'changed') {
      rowIds = getChangedRowIdsForCurrentMonth();
    } else {
      rowIds = getRowIdsForScope(scope);
    }

    if (rowIds.length === 0) {
      setSaveError('Nothing to save for the selected scope.');
      return;
    }

    const items: Item[] = buildItemsFromRowIds(rowIds);
    const CHUNK_SIZE = 100;
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < items.length; i += CHUNK_SIZE) {
      const chunk = items.slice(i, i + CHUNK_SIZE);
      const chunkNumber = Math.floor(i / CHUNK_SIZE) + 1;
      const totalChunks = Math.ceil(items.length / CHUNK_SIZE);

      try {
        const res = await fetch(`${API_BASE_URL}/api/schedules/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            year: selectedYear,
            month: selectedMonth + 1,
            items: chunk
          }),
        });

        if (!res.ok) {
          let detail = '';
          try { detail = (await res.json()).error || ''; } catch {}
          const errorMsg = `Chunk ${chunkNumber}/${totalChunks} failed: HTTP ${res.status}${detail ? ` — ${detail}` : ''}`;
          errors.push(errorMsg);
          errorCount += chunk.length;
        } else {
          successCount += chunk.length;
        }
      } catch (err: any) {
        const errorMsg = `Chunk ${chunkNumber}/${totalChunks} failed: ${err.message || 'Network error'}`;
        errors.push(errorMsg);
        errorCount += chunk.length;
      }
    }

    if (errorCount > 0) {
      throw new Error(
        `Saved ${successCount} items, but ${errorCount} failed. ` +
        `First error: ${errors[0]}${errors.length > 1 ? ` (+${errors.length - 1} more)` : ''}`
      );
    }

    await fetchSchedules(
      baseFilteredEmployees.map(e => e.id),
      monthDateToISO(selectedYear, selectedMonth, 1),
      monthDateToISO(selectedYear, selectedMonth, daysInMonth(selectedYear, selectedMonth))
    );
    setDirty(false);
    setChangedKeys(new Set());
    setLastSavedAt(new Date().toLocaleString());
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError('');
      await saveScoped(saveScope);
    } catch (err: any) {
      console.error(err);
      setSaveError(err?.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  /* ================= Bulk Operations ================= */
  const rowIdToParts = (rowId: string) => {
    const [empIdStr, dayStr] = rowId.split('-');
    return { empId: parseInt(empIdStr, 10), day: parseInt(dayStr, 10) };
  };

  const patchRowsTime = (rowIds: string[], startTime: string, endTime: string) => {
    const patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }> = rowIds.map(rid => {
      const { empId, day } = rowIdToParts(rid);
      return {
        employeeId: empId,
        day,
        patch: { status: 'working', start: startTime, end: endTime, template: null, isCustom: true }
      };
    });
    applyBulkPatches(patches);
  };

  const patchRowsTemplate = (rowIds: string[], templateId: number) => {
    const tpl = shiftTemplates.find(t => t.id === templateId);
    if (!tpl) return;
    const patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }> = rowIds.map(rid => {
      const { empId, day } = rowIdToParts(rid);
      return {
        employeeId: empId,
        day,
        patch: {
          status: 'working',
          start: tpl.start,
          end: tpl.end,
          template: tpl.id,
          isCustom: false,
          break_mins: tpl.break_mins,
          overnight: tpl.overnight
        }
      };
    });
    applyBulkPatches(patches);
  };

  const idsOnPage = Array.from(new Set(paginatedData.map(r => r.employeeId)));
  const idsAll = baseFilteredEmployees.map(e => e.id);

  // Add this helper function to fetch holidays
  const fetchHolidays = useCallback(async (companyIds: (string | number)[], fromISO: string, toISO: string) => {
    try {
      const params = new URLSearchParams();
      params.set('from', fromISO);
      params.set('to', toISO);
      
      // For admin, we need to fetch holidays for all companies
      // For manager/employee, fetch based on their scope
      if (companyIds.length > 0 && companyIds[0] !== 'All') {
        params.set('company_ids', companyIds.join(','));
      }
      
      const res = await fetch(`${API_BASE_URL}/api/holiday/holidays?${params.toString()}`);
      if (!res.ok) throw new Error(`Holidays HTTP ${res.status}`);
      const data = await res.json();
      
      // Group holidays by date for easy lookup
      const holidaysByDate: Record<string, any[]> = {};
      data.forEach((holiday: any) => {
        const date = holiday.holiday_date;
        if (!holidaysByDate[date]) {
          holidaysByDate[date] = [];
        }
        holidaysByDate[date].push(holiday);
      });
      
      return holidaysByDate;
    } catch (e) {
      console.error('fetch holidays failed', e);
      return {};
    }
  }, []);

  const applyBulkTime = () => {
    if (bulkScope === 'selected') {
      const rowIds = Array.from(selectedRowIds);
      patchRowsTime(rowIds, bulkStart, bulkEnd);
    } else if (bulkScope === 'page') {
      patchRowsTime(pageRowIds, bulkStart, bulkEnd);
    } else {
      patchRowsTime(rowsFilteredByDateStatus.map(r => r.id), bulkStart, bulkEnd);
    }
  };

  const applyBulkTimeWithHolidays = async () => {
    // Get company IDs for filtered employees
    const companyIds = Array.from(new Set(baseFilteredEmployees.map(e => String(e.company_id || '')))).filter(id => id);
    
    // Fetch holidays for the date range
    const holidaysByDate = await fetchHolidays(companyIds, dateFrom, dateTo);
    
    // Get target row IDs based on scope
    let rowIds: string[] = [];
    if (bulkScope === 'selected') {
      rowIds = Array.from(selectedRowIds);
    } else if (bulkScope === 'page') {
      rowIds = pageRowIds;
    } else {
      rowIds = rowsFilteredByDateStatus.map(r => r.id);
    }

    const patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }> = [];
    
    for (const rid of rowIds) {
      const { empId, day } = rowIdToParts(rid);
      const emp = allEmployees.find(e => e.id === empId);
      if (!emp) continue;
      
      // Get the date for this cell
      const dateISO = monthDateToISO(selectedYear, selectedMonth, day);
      
      // Check if this date has a holiday applicable to this employee's company
      const dayHolidays = holidaysByDate[dateISO] || [];
      const isHoliday = dayHolidays.some(holiday => {
        // Check if holiday applies to this employee
        if (holiday.is_global) return true;
        if (!holiday.company_ids || !holiday.company_ids.length) return false;
        return holiday.company_ids.includes(Number(emp.company_id));
      });
      
      if (isHoliday) {
        // Mark as holiday instead of applying the bulk time
        patches.push({
          employeeId: empId,
          day,
          patch: { 
            status: 'off', 
            start: '', 
            end: '', 
            template: null, 
            isCustom: false,
            notes: 'Public Holiday',
            pattern_id: null
          }
        });
      } else {
        // Apply the bulk time as normal
        patches.push({
          employeeId: empId,
          day,
          patch: { 
            status: 'working', 
            start: bulkStart, 
            end: bulkEnd, 
            template: null, 
            isCustom: true 
          }
        });
      }
    }
    
    applyBulkPatches(patches);
  };

  const applyBulkTemplate = () => {
    if (!templateToApply) return;
    const tplId = Number(templateToApply);
    if (bulkScope === 'selected') {
      patchRowsTemplate(Array.from(selectedRowIds), tplId);
    } else if (bulkScope === 'page') {
      patchRowsTemplate(pageRowIds, tplId);
    } else {
      patchRowsTemplate(rowsFilteredByDateStatus.map(r => r.id), tplId);
    }
  };

  const applyBulkTemplateWithHolidays = async () => {
    if (!templateToApply) return;
    const tplId = Number(templateToApply);
    
    // Get company IDs for filtered employees
    const companyIds = Array.from(new Set(baseFilteredEmployees.map(e => String(e.company_id || '')))).filter(id => id);
    
    // Fetch holidays for the date range
    const holidaysByDate = await fetchHolidays(companyIds, dateFrom, dateTo);
    
    let rowIds: string[] = [];
    if (bulkScope === 'selected') {
      rowIds = Array.from(selectedRowIds);
    } else if (bulkScope === 'page') {
      rowIds = pageRowIds;
    } else {
      rowIds = rowsFilteredByDateStatus.map(r => r.id);
    }

    const tpl = shiftTemplates.find(t => t.id === tplId);
    if (!tpl) return;
    
    const patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }> = rowIds.map(rid => {
      const { empId, day } = rowIdToParts(rid);
      const emp = allEmployees.find(e => e.id === empId);
      
      // Get the date for this cell
      const dateISO = monthDateToISO(selectedYear, selectedMonth, day);
      
      // Check for holidays
      let patchContent: Partial<CellSchedule>;
      const dayHolidays = holidaysByDate[dateISO] || [];
      const isHoliday = emp && dayHolidays.some(holiday => {
        if (holiday.is_global) return true;
        if (!holiday.company_ids || !holiday.company_ids.length) return false;
        return holiday.company_ids.includes(Number(emp.company_id));
      });

      if (isHoliday) {
        patchContent = {
          status: 'off',
          start: '',
          end: '',
          template: null,
          isCustom: false,
          notes: 'Public Holiday',
          break_mins: 0,
          overnight: false
        };
      } else {
        patchContent = {
          status: 'working',
          start: tpl.start,
          end: tpl.end,
          template: tpl.id,
          isCustom: false,
          break_mins: tpl.break_mins,
          overnight: tpl.overnight
        };
      }

      return { employeeId: empId, day, patch: patchContent };
    });
    
    applyBulkPatches(patches);
  };

  // Ensure bulk operations respect company boundaries
  const applyBulkPattern = () => {
    if (!patternToApply) return;
    const patId = Number(patternToApply);
    
    let ids: number[];
    if (bulkScope === 'page') {
      ids = idsOnPage;
    } else {
      ids = baseFilteredEmployees.map(e => e.id);
    }
    
    // For employees, ensure we only apply to their company's employees
    if (user?.role === 'employee' && userCompanyId) {
      ids = ids.filter(id => {
        const emp = allEmployees.find(e => e.id === id);
        return emp && String(emp.company_id) === String(userCompanyId);
      });
    }
    
    applyPatternRange(ids, patId, dateFrom, dateTo);
  };

  const applyBulkPatternWithHolidays = async () => {
    if (!patternToApply) return;
    const patId = Number(patternToApply);
    
    // Get company IDs for filtered employees
    const companyIds = Array.from(new Set(baseFilteredEmployees.map(e => String(e.company_id || '')))).filter(id => id);
    
    // Fetch holidays for the date range
    const holidaysByDate = await fetchHolidays(companyIds, dateFrom, dateTo);
    
    let ids: number[];
    if (bulkScope === 'page') {
      ids = idsOnPage;
    } else {
      ids = baseFilteredEmployees.map(e => e.id);
    }
    
    // For employees, ensure we only apply to their company's employees
    if (user?.role === 'employee' && userCompanyId) {
      ids = ids.filter(id => {
        const emp = allEmployees.find(e => e.id === id);
        return emp && String(emp.company_id) === String(userCompanyId);
      });
    }
    
    const pat = patterns.find(p => p.id === patId);
    if (!pat || !pat.sequence?.length) return;

    const meta: PatternMeta = pat.meta ?? {
      align: 'next-monday',
      weekendPolicy: 'ignore',
      weekendDays: [6, 0]
    };

    let initialIdx = 0;
    if (meta.align === 'next-monday') {
      const weekMon = mondayOfWeekISO(dateFrom);
      let eligibleBefore = 0;
      forEachDayISO(weekMon, addDaysISO(dateFrom, -1), (_iso, date) => {
        const dow = date.getDay();
        const isWknd = meta.weekendPolicy === 'weekends-off' && meta.weekendDays.includes(dow);
        if (!isWknd) eligibleBefore++;
      });
      initialIdx = eligibleBefore % pat.sequence.length;
    }

    const patches: Array<{ employeeId: number; day: number; patch: Partial<CellSchedule> }> = [];

    for (const eid of ids) {
      const emp = allEmployees.find(e => e.id === eid);
      if (!emp) continue;
      
      let stepIndex = initialIdx;

      forEachDayISO(dateFrom, dateTo, (iso, date) => {
        const dow = date.getDay();
        const day = date.getDate();
        
        // Check for holidays first
        const dayHolidays = holidaysByDate[iso] || [];
        const isHoliday = dayHolidays.some(holiday => {
          if (holiday.is_global) return true;
          if (!holiday.company_ids || !holiday.company_ids.length) return false;
          return holiday.company_ids.includes(Number(emp.company_id));
        });

        if (isHoliday) {
          // HOLIDAY: Mark as off but STILL ADVANCE pattern step
          const currentStep = pat.sequence[stepIndex % pat.sequence.length];
          patches.push({
            employeeId: eid,
            day,
            patch: {
              status: 'off',
              start: '',
              end: '',
              template: null,
              isCustom: false,
              notes: 'Public Holiday',
              pattern_id: patId,
              break_mins: 0,
              overnight: false,
            }
          });
          stepIndex++; // CRITICAL: Advance the pattern even for holidays
          return; // Skip weekend/pattern logic
        }

        // Check weekends according to pattern settings
        const isWknd = meta.weekendPolicy === 'weekends-off' && meta.weekendDays.includes(dow);
        
        if (isWknd) {
          // WEEKEND: Apply weekend logic from pattern meta
          patches.push({
            employeeId: eid,
            day,
            patch: {
              status: 'off',
              start: '',
              end: '',
              template: null,
              isCustom: false,
              break_mins: 0,
              overnight: false,
              pattern_id: patId
            }
          });
          // DO NOT advance stepIndex for weekends when weekendPolicy is 'weekends-off'
          return;
        }

        // NORMAL DAY (not holiday, not weekend): Apply pattern step
        const step = pat.sequence[stepIndex % pat.sequence.length];
        if (step.type === 'work') {
          const tpl = shiftTemplates.find(t => t.id === step.template);
          patches.push({
            employeeId: eid,
            day,
            patch: tpl
              ? {
                  status: 'working',
                  start: tpl.start,
                  end: tpl.end,
                  template: tpl.id,
                  isCustom: false,
                  break_mins: tpl.break_mins,
                  overnight: tpl.overnight,
                  pattern_id: patId
                }
              : { 
                  status: 'off', 
                  start: '', 
                  end: '', 
                  template: null, 
                  isCustom: false, 
                  break_mins: 0, 
                  overnight: false, 
                  pattern_id: patId 
                }
          });
        } else {
          // Pattern step is 'off'
          patches.push({
            employeeId: eid,
            day,
            patch: { 
              status: 'off', 
              start: '', 
              end: '', 
              template: null, 
              isCustom: false, 
              break_mins: 0, 
              overnight: false, 
              pattern_id: patId 
            }
          });
        }

        stepIndex++; // Advance to next pattern step
      });
    }

    applyBulkPatches(patches);
  };

  const applyBulkPattern_all = () => {
    if (!patternToApply) return;
    const patId = Number(patternToApply);
    const ids = bulkScope === 'page' ? idsOnPage : idsAll;
    applyPatternRange(ids, patId, dateFrom, dateTo);
  };

  /* ================= ENHANCED EXPORT FUNCTION ================= */
  const handleEnhancedExport = async () => {
    try {
      setExporting(true);
      
      // Determine which employees to export based on scope
      let employeesToExport: Employee[] = [];
      let exportTitle = '';
      
      switch (exportScope) {
        case 'selected':
          // Get unique employee IDs from selected rows
          const selectedEmpIds = new Set(
            Array.from(selectedRowIds)
              .map(id => {
                const [empId] = id.split('-');
                return parseInt(empId, 10);
              })
              .filter(id => !isNaN(id))
          );
          employeesToExport = baseFilteredEmployees.filter(emp => 
            selectedEmpIds.has(emp.id)
          );
          exportTitle = `Selected_${selectedEmpIds.size}_Employees`;
          break;
          
        case 'page':
          // Get employee IDs from current page
          const pageEmpIds = new Set(paginatedData.map(row => row.employeeId));
          employeesToExport = baseFilteredEmployees.filter(emp => 
            pageEmpIds.has(emp.id)
          );
          exportTitle = `Page_${tablePage}_Employees`;
          break;
          
        case 'filtered':
          employeesToExport = baseFilteredEmployees;
          exportTitle = `Filtered_${employeesToExport.length}_Employees`;
          break;
          
        case 'all':
          employeesToExport = allEmployees;
          exportTitle = `All_${employeesToExport.length}_Employees`;
          break;
      }
      
      if (employeesToExport.length === 0) {
        alert('No employees to export');
        setExporting(false);
        return;
      }
      
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();
      const usedNames = new Set<string>();
      
      const sanitizeSheetName = (raw: string, index?: number) => {
        let base = (raw || `Employee_${index}`).replace(/[\\/?*[\]:]/g, '').slice(0, 31);
        let name = base;
        let i = 1;
        while (usedNames.has(name)) {
          const tail = `_${i++}`;
          name = (base.slice(0, Math.max(0, 31 - tail.length)) + tail);
        }
        usedNames.add(name);
        return name;
      };
      
      // ========== CREATE METADATA SHEET ==========
      if (exportIncludeMetadata) {
        const metadata = [
          ['Schedule Export Report', '', '', '', ''],
          ['Export Date', new Date().toLocaleString(), '', '', ''],
          ['Export Scope', exportScope, '', '', ''],
          ['Month/Year', monthYearLabel, '', '', ''],
          ['Date Range', `${dateFrom} to ${dateTo}`, '', '', ''],
          ['Company Filter', selectedCompany === 'All' ? 'All' : companies.find(c => String(c.id) === String(selectedCompany))?.name || selectedCompany, '', '', ''],
          ['Department Filter', selectedDepartment === 'All' ? 'All' : selectedDepartment, '', '', ''],
          ['Status Filter', selectedStatus === 'All' ? 'All' : selectedStatus, '', '', ''],
          ['Total Employees', employeesToExport.length, '', '', ''],
          ['', '', '', '', ''],
          ['Column Descriptions:', '', '', '', ''],
          ['No', 'Row number', '', '', ''],
          ['Employee ID', 'Unique employee identifier', '', '', ''],
          ['Employee No', 'Employee number/code', '', '', ''],
          ['Name', 'Employee full name', '', '', ''],
          ['Department', 'Employee department', '', '', ''],
          ['Date', 'Schedule date (DD/MM/YYYY)', '', '', ''],
          ['Day', 'Day of week', '', '', ''],
          ['Total Hours', 'Net working hours (excluding breaks)', '', '', ''],
          ['Start Time', 'Shift start time', '', '', ''],
          ['End Time', 'Shift end time', '', '', ''],
          ['Status', 'working/off/leave/holiday', '', '', ''],
          ['Is Working Day', 'Yes/No indicator', '', '', ''],
          ['Pattern', 'Applied work pattern name', '', '', ''],
          ['Template', 'Shift template name', '', '', ''],
          ['Remark', 'Additional notes', '', '', ''],
          ['Holiday', 'Public holiday indicator', '', '', ''],
          ['Break (mins)', 'Break duration in minutes', '', '', ''],
          ['Overnight', 'Overnight shift indicator', '', '', ''],
          ['Timezone', 'Employee timezone', '', '', '']
        ];
        
        const wsMeta = XLSX.utils.aoa_to_sheet(metadata);
        XLSX.utils.book_append_sheet(wb, wsMeta, 'Metadata');
      }
      
      // ========== PROCESS EACH EMPLOYEE ==========
      // Fetch holidays once for all employees if needed
      let holidaysByDate: Record<string, any[]> = {};
      if (exportIncludeHolidays) {
        const companyIds = Array.from(new Set(employeesToExport.map(e => String(e.company_id || '')))).filter(id => id);
        holidaysByDate = await fetchHolidays(companyIds, dateFrom, dateTo);
      }
      
      const summaryData: any[] = [];
      
      employeesToExport.forEach((emp, empIndex) => {
        const rows: any[] = [];
        let workingDays = 0;
        let totalHours = 0;
        let leaveDays = 0;
        let offDays = 0;
        let holidayDays = 0;
        let patternUsed = '';
        
        for (let d = 1; d <= totalDays; d++) {
          const iso = monthDateToISO(selectedYear, selectedMonth, d);
          if (iso < dateFrom || iso > dateTo) continue;
          
          const sch = getCellSchedule(emp.id, d);
          const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;
          const net = sch.status === 'working'
            ? calcNetHours(sch.start, sch.end, sch.overnight ?? tpl?.overnight, sch.break_mins ?? tpl?.break_mins)
            : 0;
          const patternName = sch.pattern_id ? (patterns.find(p => p.id === sch.pattern_id)?.name ?? '') : '';
          
          // Check for holidays
          let isHoliday = false;
          let holidayNote = '';
          if (exportIncludeHolidays) {
            const dayHolidays = holidaysByDate[iso] || [];
            isHoliday = dayHolidays.some(holiday => {
              if (holiday.is_global) return true;
              if (!holiday.company_ids || !holiday.company_ids.length) return false;
              return holiday.company_ids.includes(Number(emp.company_id));
            });
            
            if (isHoliday) {
              holidayNote = dayHolidays.map(h => h.name).join(', ');
            }
          }
          
          // Update summary counters
          if (isHoliday) {
            holidayDays++;
          } else if (sch.status === 'working') {
            workingDays++;
            totalHours += net;
          } else if (sch.status === 'leave') {
            leaveDays++;
          } else if (sch.status === 'off') {
            offDays++;
          }
          
          if (patternName && !patternUsed.includes(patternName)) {
            patternUsed = patternUsed ? `${patternUsed}, ${patternName}` : patternName;
          }
          
          const rowData: Record<string, any> = {
            'No': rows.length + 1,
            'Employee ID': emp.id,
            'Employee No': emp.employee_no || '',
            'Name': emp.name,
            'Department': emp.department_name || '-',
            'Date': new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            'Day': new Date(iso).toLocaleDateString('en-US', { weekday: 'long' }),
            'Total Hours': Number(net.toFixed(2)),
            'Start Time': sch.start || '',
            'End Time': sch.end || '',
            'Status': isHoliday ? 'Holiday' : sch.status,
            'Is Working Day': (sch.status === 'working' && !isHoliday) ? 'Yes' : 'No',
            'Pattern': patternName,
            'Template': tpl?.name || '',
            'Remark': sch.notes || (isHoliday ? holidayNote : ''),
            'Break (mins)': sch.break_mins ?? tpl?.break_mins ?? 0,
            'Overnight': sch.overnight || tpl?.overnight ? 'Yes' : 'No',
            'Timezone': emp.time_zone || 'Asia/Kuala_Lumpur'
          };
          
          if (exportIncludeHolidays) {
            rowData['Holiday'] = isHoliday ? 'Yes' : 'No';
            if (isHoliday) {
              rowData['Holiday Name'] = holidayNote;
            }
          }
          
          rows.push(rowData);
        }
        
        // Add employee to summary
        summaryData.push({
          'Employee ID': emp.id,
          'Employee No': emp.employee_no || '',
          'Name': emp.name,
          'Department': emp.department_name || '-',
          'Timezone': emp.time_zone || 'Asia/Kuala_Lumpur',
          'Total Working Days': workingDays,
          'Total Hours': Number(totalHours.toFixed(2)),
          'Avg Daily Hours': workingDays > 0 ? Number((totalHours / workingDays).toFixed(2)) : 0,
          'Leave Days': leaveDays,
          'Off Days': offDays,
          'Holiday Days': holidayDays,
          'Pattern Used': patternUsed || '-'
        });
        
        // Create employee sheet
        if (rows.length > 0) {
          const ws = XLSX.utils.json_to_sheet(rows);
          
          // Add auto-filter
          ws['!autofilter'] = { ref: XLSX.utils.encode_range({ 
            s: { r: 0, c: 0 }, 
            e: { r: rows.length, c: Object.keys(rows[0]).length - 1 } 
          })};
          
          // Set column widths
          const colWidths = [
            { wch: 5 },   // No
            { wch: 10 },  // Employee ID
            { wch: 12 },  // Employee No
            { wch: 20 },  // Name
            { wch: 15 },  // Department
            { wch: 12 },  // Date
            { wch: 10 },  // Day
            { wch: 10 },  // Total Hours
            { wch: 10 },  // Start Time
            { wch: 10 },  // End Time
            { wch: 12 },  // Status
            { wch: 12 },  // Is Working Day
            { wch: 15 },  // Pattern
            { wch: 15 },  // Template
            { wch: 25 },  // Remark
            { wch: 10 },  // Break (mins)
            { wch: 10 },  // Overnight
            { wch: 20 }   // Timezone
          ];
          
          if (exportIncludeHolidays) {
            colWidths.splice(15, 0, { wch: 8 });   // Holiday
            colWidths.splice(16, 0, { wch: 20 });  // Holiday Name
          }
          
          ws['!cols'] = colWidths;
          
          XLSX.utils.book_append_sheet(wb, ws, sanitizeSheetName(emp.name, empIndex));
        }
      });
      
      // ========== CREATE SUMMARY SHEET ==========
      if (exportIncludeSummary && summaryData.length > 0) {
        const wsSummary = XLSX.utils.json_to_sheet(summaryData);
        
        // Add totals row
        const totalRow: Record<string, any> = {
          'Employee ID': 'TOTALS / AVERAGES',
          'Employee No': '',
          'Name': '',
          'Department': '',
          'Timezone': '',
          'Total Working Days': summaryData.reduce((sum, row) => sum + row['Total Working Days'], 0),
          'Total Hours': Number(summaryData.reduce((sum, row) => sum + row['Total Hours'], 0).toFixed(2)),
          'Avg Daily Hours': Number((summaryData.reduce((sum, row) => sum + row['Total Hours'], 0) / 
                                    summaryData.reduce((sum, row) => sum + row['Total Working Days'], 1)).toFixed(2)),
          'Leave Days': summaryData.reduce((sum, row) => sum + row['Leave Days'], 0),
          'Off Days': summaryData.reduce((sum, row) => sum + row['Off Days'], 0),
          'Pattern Used': ''
        };
        
        if (exportIncludeHolidays) {
          totalRow['Holiday Days'] = summaryData.reduce((sum, row) => sum + row['Holiday Days'], 0);
        }
        
        const nextRow = summaryData.length + 1;
        XLSX.utils.sheet_add_json(wsSummary, [totalRow], { origin: `A${nextRow + 1}`, skipHeader: true });
        
        // Style the totals row by adding a note
        const totalCell = XLSX.utils.encode_cell({ r: nextRow, c: 0 });
        if (!wsSummary[totalCell]) wsSummary[totalCell] = { t: 's', v: '' };
        wsSummary[totalCell].s = {
          font: { bold: true, sz: 11 }
        };
        
        // Set column widths for summary
        const summaryColWidths = [
          { wch: 12 },  // Employee ID
          { wch: 12 },  // Employee No
          { wch: 20 },  // Name
          { wch: 15 },  // Department
          { wch: 20 },  // Timezone
          { wch: 15 },  // Total Working Days
          { wch: 12 },  // Total Hours
          { wch: 15 },  // Avg Daily Hours
          { wch: 12 },  // Leave Days
          { wch: 12 },  // Off Days
          { wch: 25 }   // Pattern Used
        ];
        
        if (exportIncludeHolidays) {
          summaryColWidths.splice(10, 0, { wch: 12 }); // Holiday Days
        }
        
        wsSummary['!cols'] = summaryColWidths;
        
        XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
      }
      
      // ========== EXPORT FILE ==========
      const fileName = `Schedule_Export_${exportTitle}_${monthYearLabel.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      // Show success message
      const exportModal = document.createElement('div');
      exportModal.className = 'toast toast-top toast-end';
      exportModal.innerHTML = `
        <div class="alert alert-success">
          <span>✓ Exported ${employeesToExport.length} employees to ${fileName}</span>
        </div>
      `;
      document.body.appendChild(exportModal);
      setTimeout(() => exportModal.remove(), 3000);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setExporting(false);
      setShowExportModal(false);
    }
  };

  // Original export function (kept for backward compatibility)
// Simplified export handler as fallback
const handleExportExcel = async () => {
  try {
    setExporting(true);
    const XLSX = await import('xlsx');
    const wb = XLSX.utils.book_new();
    
    // Basic export - one sheet per employee
    baseFilteredEmployees.forEach((emp) => {
      const rows: any[] = [];
      
      for (let d = 1; d <= totalDays; d++) {
        const iso = monthDateToISO(selectedYear, selectedMonth, d);
        if (iso < dateFrom || iso > dateTo) continue;
        
        const sch = getCellSchedule(emp.id, d);
        const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;
        const net = sch.status === 'working'
          ? calcNetHours(sch.start, sch.end, sch.overnight ?? tpl?.overnight, sch.break_mins ?? tpl?.break_mins)
          : 0;
        const patternName = sch.pattern_id ? (patterns.find(p => p.id === sch.pattern_id)?.name ?? '') : '';
        
        rows.push({
          'No': rows.length + 1,
          'Employee ID': emp.id,
          'Name': emp.name,
          'Department': emp.department_name || '-',
          'Date': new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          'Day': new Date(iso).toLocaleDateString('en-US', { weekday: 'long' }),
          'Total Hours': Number(net.toFixed(2)),
          'Start Time': sch.start || '',
          'End Time': sch.end || '',
          'Status': sch.status,
          'Pattern': patternName,
          'Template': tpl?.name || '',
          'Remark': sch.notes || '',
          'Timezone': emp.time_zone || 'Asia/Kuala_Lumpur'
        });
      }
      
      if (rows.length > 0) {
        const ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, emp.name.slice(0, 31));
      }
    });
    
    const fileName = `Schedule_${monthYearLabel.replace(/\s+/g, '_')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    alert(`Exported ${baseFilteredEmployees.length} employees to ${fileName}`);
  } catch (error) {
    console.error('Export failed:', error);
    alert('Export failed');
  } finally {
    setExporting(false);
  }
};

  /* ================= Export Modal Component ================= */
const ImportModal = () => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setImportFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setImportFile(files[0]);
    }
  };

  const resetImport = () => {
    setImportFile(null);
    setImportProgress({
      processed: 0,
      total: 0,
      message: '',
      errors: []
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const parseExcelFile = async (file: File) => {
    const XLSX = await import('xlsx');
    return new Promise<any[]>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  };

  const validateImportData = (data: any[]): ImportScheduleRow[] => {
    const validated: ImportScheduleRow[] = [];
    const errors: string[] = [];

    data.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because Excel rows are 1-indexed and we skip header

      // Check required fields
      if (!row.date) {
        errors.push(`Row ${rowNumber}: Missing date`);
        return;
      }

      // Parse date - accept multiple formats
      let dateObj: Date | null = null;
      const dateStr = String(row.date).trim();
      
      // Try different date formats
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          // Try DD/MM/YYYY
          if (parts[0].length <= 2 && parts[1].length <= 2 && parts[2].length === 4) {
            dateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          } else if (parts[0].length <= 2 && parts[1].length <= 2 && parts[2].length === 4) {
            // Try MM/DD/YYYY
            dateObj = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
          }
        }
      } else if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            // YYYY-MM-DD
            dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          } else if (parts[2].length === 4) {
            // DD-MM-YYYY
            dateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          }
        }
      }
      
      // Try direct parsing
      if (!dateObj || isNaN(dateObj.getTime())) {
        const parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) {
          dateObj = parsed;
        }
      }

      if (!dateObj || isNaN(dateObj.getTime())) {
        errors.push(`Row ${rowNumber}: Invalid date format "${dateStr}"`);
        return;
      }

      // Validate status
      const status = String(row.status || '').toLowerCase().trim();
      if (!['working', 'off', 'leave'].includes(status)) {
        errors.push(`Row ${rowNumber}: Invalid status "${row.status}". Must be "working", "off", or "leave"`);
        return;
      }

      // Validate times if working
      let startTime = '';
      let endTime = '';
      if (status === 'working') {
        startTime = String(row.startTime || row['start time'] || '').trim();
        endTime = String(row.endTime || row['end time'] || '').trim();
        
        const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        
        if (startTime && !timeRegex.test(startTime)) {
          errors.push(`Row ${rowNumber}: Invalid start time format "${startTime}". Use HH:MM 24-hour format`);
          return;
        }
        
        if (endTime && !timeRegex.test(endTime)) {
          errors.push(`Row ${rowNumber}: Invalid end time format "${endTime}". Use HH:MM 24-hour format`);
          return;
        }
      }

      validated.push({
        employeeId: row.employeeId || row.employeeid || row['employee id'],
        employeeNo: row.employeeNo || row.employeeNo || row['employee no'],
        name: row.name || row.employeeName || row['employee name'],
        department: row.department || row.departmentName || row['department name'],
        date: dateObj.toISOString().split('T')[0], // Format as YYYY-MM-DD
        status: status as 'working' | 'off' | 'leave',
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        remarks: row.remarks || row.notes || row.note || ''
      });
    });

    if (errors.length > 10) {
      throw new Error(`Too many validation errors (${errors.length}). Please fix the file.`);
    }

    setImportProgress(prev => ({ ...prev, errors }));
    return validated;
  };

  const findEmployeeId = (row: ImportScheduleRow): number | null => {
    // Priority 1: Employee ID
    if (row.employeeId) {
      const emp = allEmployees.find(e => String(e.id) === String(row.employeeId));
      if (emp) return emp.id;
    }

    // Priority 2: Employee No
    if (row.employeeNo) {
      const emp = allEmployees.find(e => e.employee_no && e.employee_no === row.employeeNo);
      if (emp) return emp.id;
    }

    // Priority 3: Name + Department
    if (row.name && row.department) {
      const emp = allEmployees.find(e => 
        e.name.toLowerCase() === row.name!.toLowerCase() && 
        e.department_name?.toLowerCase() === row.department!.toLowerCase()
      );
      if (emp) return emp.id;
    }

    // Priority 4: Name only
    if (row.name) {
      const emp = allEmployees.find(e => e.name.toLowerCase() === row.name!.toLowerCase());
      if (emp) return emp.id;
    }

    return null;
  };

  const handleImport = async () => {
    if (!importFile) return;
    
    try {
      setImporting(true);
      setImportProgress({
        processed: 0,
        total: 0,
        message: 'Parsing Excel file...',
        errors: []
      });

      // Parse Excel
      const excelData = await parseExcelFile(importFile);
      setImportProgress(prev => ({ ...prev, total: excelData.length, message: 'Validating data...' }));

      // Validate data
      const validatedData = validateImportData(excelData);
      
      if (importProgress.errors.length > 0) {
        if (!window.confirm(
          `Found ${importProgress.errors.length} validation errors. Continue anyway?\n\n${importProgress.errors.slice(0, 5).join('\n')}${importProgress.errors.length > 5 ? '\n...' : ''}`
        )) {
          return;
        }
      }

      setImportProgress(prev => ({ ...prev, message: 'Importing schedule data...' }));

      // Group by employee for batch processing
      const employeeGroups: Record<number, Array<{
        date: string;
        status: 'working' | 'off' | 'leave';
        start?: string;
        end?: string;
        notes: string;
      }>> = {};

      let processedCount = 0;
      const missingEmployees: string[] = [];

      validatedData.forEach((row) => {
        const employeeId = findEmployeeId(row);
        
        if (!employeeId) {
          const identifier = row.employeeId || row.employeeNo || row.name || 'Unknown';
          missingEmployees.push(`${identifier} (Date: ${row.date})`);
          return;
        }

        if (!employeeGroups[employeeId]) {
          employeeGroups[employeeId] = [];
        }

        employeeGroups[employeeId].push({
          date: row.date,
          status: row.status,
          start: row.startTime,
          end: row.endTime,
          notes: row.remarks || ''
        });

        processedCount++;
        setImportProgress(prev => ({ ...prev, processed: processedCount }));
      });

      // Show warning about missing employees
      if (missingEmployees.length > 0) {
        const message = `Could not find ${missingEmployees.length} employee(s):\n\n${missingEmployees.slice(0, 5).join('\n')}${missingEmployees.length > 5 ? '\n...' : ''}\n\nDo you want to continue importing the rest?`;
        
        if (!confirm(message)) {
          setImporting(false);
          return;
        }
      }

      // Import data in chunks
      const CHUNK_SIZE = 50;
      const employeeIds = Object.keys(employeeGroups).map(Number);
      let successCount = 0;
      const importErrors: string[] = [];

      for (let i = 0; i < employeeIds.length; i += CHUNK_SIZE) {
        const chunkIds = employeeIds.slice(i, i + CHUNK_SIZE);
        const chunkData = chunkIds.map(empId => ({
          employee_id: empId,
          schedules: employeeGroups[empId]
        }));

        try {
          const res = await fetch(`${API_BASE_URL}/api/schedules/import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: chunkData,
              overwrite: importConfig.overwriteExisting
            })
          });

          if (!res.ok) {
            const error = await res.text();
            importErrors.push(`Chunk ${Math.floor(i / CHUNK_SIZE) + 1}: ${error}`);
          } else {
            successCount += chunkIds.length;
          }
        } catch (error: any) {
          importErrors.push(`Chunk ${Math.floor(i / CHUNK_SIZE) + 1}: ${error.message}`);
        }

        setImportProgress(prev => ({
          ...prev,
          processed: (i + CHUNK_SIZE) > employeeIds.length ? employeeIds.length : i + CHUNK_SIZE,
          message: `Imported ${successCount} of ${employeeIds.length} employees...`
        }));
      }

      if (importErrors.length > 0) {
        throw new Error(
          `Imported ${successCount} employees with ${importErrors.length} errors:\n${importErrors.slice(0, 3).join('\n')}`
        );
      }

      // Success
      setImportProgress(prev => ({
        ...prev,
        message: `Successfully imported ${processedCount} schedule records for ${successCount} employees`,
        errors: []
      }));

      // Refresh data
      setTimeout(() => {
        if (employeeIds.length > 0) {
          fetchSchedules(employeeIds, dateFrom, dateTo);
        }
        fetchAllEmployees();
      }, 1000);

    } catch (error: any) {
      console.error('Import failed:', error);
      setImportProgress(prev => ({
        ...prev,
        message: `Import failed: ${error.message}`,
        errors: [error.message]
      }));
    } finally {
      setImporting(false);
    }
  };

  if (!showImportModal) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Import Schedules</h3>
              <p className="text-sm opacity-70">Upload Excel file with schedule data</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowImportModal(false);
              resetImport();
            }}
            className="btn btn-ghost btn-sm"
            disabled={importing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto space-y-4">
          {/* File Upload Area */}
          {!importing && importProgress.processed === 0 && (
            <div className="space-y-4">
              <div className="card bg-base-100 border-2 border-dashed border-base-300 p-6">
                <div
                  className={`flex flex-col items-center justify-center gap-4 ${dragActive ? 'bg-primary/5' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 opacity-50" />
                  <div className="text-center">
                    <p className="font-medium">Drop your Excel file here</p>
                    <p className="text-sm opacity-70 mt-1">or</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="btn btn-primary">
                    Browse Files
                  </label>
                  <p className="text-xs opacity-70">
                    Supported formats: Excel (.xlsx, .xls), CSV
                  </p>
                </div>
                
                {importFile && (
                  <div className="mt-4 p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-success/20 rounded">
                          <Download className="w-4 h-4 text-success" />
                        </div>
                        <div>
                          <p className="font-medium">{importFile.name}</p>
                          <p className="text-xs opacity-70">
                            {(importFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setImportFile(null)}
                        disabled={importing}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Import Options */}
              <div className="card bg-base-200 p-4">
                <h4 className="font-semibold mb-3">Import Options</h4>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-3">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={importConfig.overwriteExisting}
                        onChange={(e) => setImportConfig(prev => ({ ...prev, overwriteExisting: e.target.checked }))}
                      />
                      <span className="label-text">Overwrite existing schedules</span>
                    </label>
                    <div className="text-xs opacity-70 ml-9">
                      If checked, existing schedules will be replaced. If unchecked, only empty slots will be filled.
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Format */}
              <div className="card bg-base-200 p-4">
                <h4 className="font-semibold mb-3">Required Format</h4>
                <div className="overflow-x-auto">
                  <table className="table table-xs">
                    <thead>
                      <tr>
                        <th>Column</th>
                        <th>Description</th>
                        <th>Required</th>
                        <th>Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>employeeId / employeeNo / name</td>
                        <td>Employee identifier (at least one required)</td>
                        <td>✓ At least one</td>
                        <td>1001 / "EMP001" / "John Doe"</td>
                      </tr>
                      <tr>
                        <td>department</td>
                        <td>Department name (helps identification)</td>
                        <td>Optional</td>
                        <td>"Sales"</td>
                      </tr>
                      <tr>
                        <td>date</td>
                        <td>Schedule date</td>
                        <td>✓ Required</td>
                        <td>"2024-01-15" or "15/01/2024"</td>
                      </tr>
                      <tr>
                        <td>status</td>
                        <td>Shift status</td>
                        <td>✓ Required</td>
                        <td>"working", "off", or "leave"</td>
                      </tr>
                      <tr>
                        <td>startTime / endTime</td>
                        <td>Shift times (required if status is "working")</td>
                        <td>Conditional</td>
                        <td>"09:00" / "17:00"</td>
                      </tr>
                      <tr>
                        <td>remarks</td>
                        <td>Notes</td>
                        <td>Optional</td>
                        <td>"Morning shift"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Progress Section */}
          {(importing || importProgress.processed > 0) && (
            <div className="card bg-base-100 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Import Progress</h4>
                  <div className={`badge ${
                    importProgress.errors.length > 0 ? 'badge-error' :
                    importProgress.processed === importProgress.total && importProgress.total > 0 ? 'badge-success' :
                    'badge-info'
                  }`}>
                    {importProgress.errors.length > 0 ? 'ERROR' :
                     importProgress.processed === importProgress.total && importProgress.total > 0 ? 'COMPLETE' :
                     'PROCESSING'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{importProgress.message}</span>
                    {importProgress.total > 0 && (
                      <span>{importProgress.processed} / {importProgress.total}</span>
                    )}
                  </div>
                  
                  {importProgress.total > 0 && (
                    <progress
                      className="progress progress-primary w-full"
                      value={importProgress.processed}
                      max={importProgress.total}
                    />
                  )}
                </div>
                
                {importProgress.errors.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-error mb-2">Errors:</h5>
                    <div className="max-h-40 overflow-y-auto bg-error/10 p-3 rounded">
                      {importProgress.errors.map((error, index) => (
                        <div key={index} className="text-sm text-error mb-1">
                          • {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="modal-action mt-6">
          {!importing && importProgress.processed === 0 ? (
            <>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowImportModal(false);
                  resetImport();
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleImport}
                disabled={!importFile}
              >
                Start Import
              </button>
            </>
          ) : (
            <button
              className="btn btn-ghost"
              onClick={() => {
                setShowImportModal(false);
                resetImport();
              }}
              disabled={importing}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ExportOptionsModal = () => {
  if (!showExportModal) return null;
  
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Export Options</h3>
              <p className="text-sm opacity-70">Customize your export</p>
            </div>
          </div>
          <button 
            onClick={() => setShowExportModal(false)} 
            className="btn btn-ghost btn-sm"
            disabled={exporting}
          >
            <X className="w-5 h-4" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="label">Export Scope</label>
            <select
              className="select select-bordered w-full"
              value={exportScope}
              onChange={(e) => setExportScope(e.target.value as ExportScope)}
              disabled={exporting}
            >
              <option value="selected">Selected rows only ({selectedRowIds.size} rows)</option>
              <option value="page">Current page ({paginatedData.length} rows)</option>
              <option value="filtered">All filtered ({baseFilteredEmployees.length} employees)</option>
              <option value="all">All employees ({allEmployees.length} employees)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-primary" 
                  checked={exportIncludeSummary}
                  onChange={(e) => setExportIncludeSummary(e.target.checked)}
                  disabled={exporting}
                />
                <span className="label-text">Include summary sheet</span>
              </label>
            </div>
            
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-primary" 
                  checked={exportIncludeMetadata}
                  onChange={(e) => setExportIncludeMetadata(e.target.checked)}
                  disabled={exporting}
                />
                <span className="label-text">Include metadata sheet</span>
              </label>
            </div>
            
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-primary" 
                  checked={exportIncludeHolidays}
                  onChange={(e) => setExportIncludeHolidays(e.target.checked)}
                  disabled={exporting}
                />
                <span className="label-text">Include holiday information</span>
              </label>
            </div>
          </div>
          
          <div className="alert alert-info">
            <div className="text-sm">
              <strong>File will include:</strong>
              <ul className="mt-1 list-disc list-inside">
                <li>One sheet per employee</li>
                {exportIncludeSummary && <li>Summary sheet with totals</li>}
                {exportIncludeMetadata && <li>Metadata with export details</li>}
                <li>Auto-filter on all columns</li>
                <li>Formatted column widths</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="modal-action">
          <button 
            className="btn btn-ghost" 
            onClick={() => setShowExportModal(false)}
            disabled={exporting}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleEnhancedExport}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Exporting...
              </>
            ) : (
              'Export Excel'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

  /* ================= Row Updates ================= */
  const toggleSelectPage = (checked: boolean) => {
    setSelectedRowIds(prev => {
      const next = new Set(prev);
      pageRowIds.forEach(id => {
        if (checked) next.add(id);
        else next.delete(id);
      });
      return next;
    });
  };

  const QuickApplySelect: React.FC<{ rowId: string; employeeId: number; day: number; }> = ({ rowId, employeeId, day }) => {
    return (
      <select
        className="select select-xs w-48"
        defaultValue=""
        onChange={(e) => {
          const val = e.target.value;
          if (!val) return;

          if (val === 'custom:time') {
            setEditingCell({ employeeId, day });
            setShowCustomTimeModal(true);
            e.currentTarget.value = '';
            return;
          }

          const [kind, idStr] = val.split(':');
          const id = parseInt(idStr, 10);
          if (kind === 'tpl') {
            const tpl = shiftTemplates.find(t => t.id === id);
            if (tpl) {
              setCellSchedule(employeeId, day, {
                status: 'working',
                start: tpl.start,
                end: tpl.end,
                template: tpl.id,
                isCustom: false,
                break_mins: tpl.break_mins,
                overnight: tpl.overnight
              });
            }
          } else if (kind === 'pat') {
            applyPatternRange([employeeId], id, dateFrom, dateTo);
          }

          e.currentTarget.value = '';
        }}
      >
        <option value="">Quick…</option>
        <optgroup label="Templates">
          {shiftTemplates.map(t => (
            <option key={`tpl-${t.id}`} value={`tpl:${t.id}`}>{t.name}</option>
          ))}
        </optgroup>
        <optgroup label="Patterns (range)">
          {patterns.map(p => (
            <option key={`pat-${p.id}`} value={`pat:${p.id}`}>{p.name}</option>
          ))}
        </optgroup>
        <option value="custom:time">Custom time…</option>
      </select>
    );
  };

  const resetFilters = () => {
    setSelectedCompany('All');
    setSelectedDepartment('All');
    setSelectedEmployeeId('All');
    setSelectedStatus('All');
    setSearchInput('');
    setAppliedSearchTerm('');
    setDateFrom(monthDateToISO(selectedYear, selectedMonth, 1));
    setDateTo(monthDateToISO(selectedYear, selectedMonth, totalDays));
    setTablePage(1);
    setSelectedRowIds(new Set());
  };

  /* ================= Modals ================= */
  const CustomTimeModal = () => {
    const [start, setStart] = useState<string>('09:00');
    const [end, setEnd] = useState<string>('17:00');
    const [breakMins, setBreakMins] = useState<number>(60);
    const [overnight, setOvernight] = useState<boolean>(false);
    const [notes, setNotes] = useState<string>('');

    useEffect(() => {
      if (!editingCell) return;
      const sch = getCellSchedule(editingCell.employeeId, editingCell.day);
      if (sch.status === 'working') {
        setStart(sch.start || '09:00');
        setEnd(sch.end || '17:00');
        setBreakMins(sch.break_mins ?? 60);
        setOvernight(!!sch.overnight);
        setNotes(sch.notes || '');
      } else {
        setStart('09:00'); setEnd('17:00'); setBreakMins(60); setOvernight(false); setNotes('');
      }
    }, [editingCell?.employeeId, editingCell?.day, showCustomTimeModal]);

    if (!showCustomTimeModal || !editingCell) return null;

    return (
      <div className="modal modal-open">
        <div className="modal-box max-w-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg"><Clock className="w-5 h-5 text-primary" /></div>
              <div>
                <h3 className="text-lg font-semibold">Custom Time</h3>
                <p className="text-sm opacity-70">Set custom hours</p>
              </div>
            </div>
            <button onClick={() => setShowCustomTimeModal(false)} className="btn btn-ghost btn-sm">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Start Time</label>
                <input type="time" className="input input-bordered w-full" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div>
                <label className="label">End Time</label>
                <input type="time" className="input input-bordered w-full" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="label">Break (mins)</label>
              <input type="number" className="input input-bordered w-full" min={0} step={15} value={breakMins} onChange={(e) => setBreakMins(parseInt(e.target.value || '0', 10))} />
            </div>

            <div>
              <label className="label">Notes</label>
              <textarea className="textarea textarea-bordered w-full" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" checked={overnight} onChange={(e) => setOvernight(e.target.checked)} />
                <span className="label-text">Overnight shift</span>
              </label>
            </div>

            <div className="text-sm opacity-70">
              Net hours: <span className="font-semibold">{formatHours(calcNetHours(start, end, overnight, breakMins))}</span>
            </div>
          </div>

          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setShowCustomTimeModal(false)}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                const { employeeId, day } = editingCell;
                setCellSchedule(employeeId, day, {
                  status: 'working',
                  start, end, isCustom: true, notes, template: null,
                  break_mins: breakMins, overnight
                });
                setShowCustomTimeModal(false);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TemplateModal = () => {
    const isEdit = !!editingTemplate;
    const [form, setForm] = useState<ShiftTemplate>(() => editingTemplate ?? {
      id: 0, name: '', start: '09:00', end: '17:00',
      color: labelToColor('Office'), label: 'Office', break_mins: 60, overnight: false, description: ''
    });

    useEffect(() => { if (editingTemplate) setForm(editingTemplate); }, [editingTemplate]);

    if (!showTemplateModal) return null;
    const total = calculateHours(form.start, form.end, !!form.overnight);
    const net = Math.max(0, total - (form.break_mins ?? 0) / 60);

    const save = async () => {
      try {
        if (isEdit) {
          const res = await fetch(`${API_BASE_URL}/api/schedules/templates/${form.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: form.name,
              start_time: form.start,
              end_time: form.end,
              break_mins: form.break_mins,
              overnight: !!form.overnight,
              label: form.label,
              description: form.description
            })
          });
          if (!res.ok) throw new Error(`Update template HTTP ${res.status}`);
          setShiftTemplates(prev => prev.map(t => t.id === form.id ? { ...form, color: labelToColor(form.label || undefined) } : t));
        } else {
          const res = await fetch(`${API_BASE_URL}/api/schedules/templates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: form.name,
              start_time: form.start,
              end_time: form.end,
              break_mins: form.break_mins,
              overnight: !!form.overnight,
              label: form.label,
              description: form.description
            })
          });
          if (!res.ok) throw new Error(`Create template HTTP ${res.status}`);
          const data = await res.json();
          const newTemplate: ShiftTemplate = { ...form, id: data.id, color: labelToColor(form.label || undefined) };
          setShiftTemplates(prev => [...prev, newTemplate]);
        }
        setShowTemplateModal(false);
        setEditingTemplate(null);
      } catch (e) {
        console.error(e);
        alert('Failed to save template');
      }
    };

    return (
      <div className="modal modal-open">
        <div className="modal-box max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg"><Clock className="w-5 h-5 text-primary" /></div>
              <div>
                <h3 className="text-lg font-semibold">{isEdit ? 'Edit Shift Template' : 'Create Shift Template'}</h3>
                <p className="text-sm opacity-70">Reusable shift schedules</p>
              </div>
            </div>
            <button onClick={() => { setShowTemplateModal(false); setEditingTemplate(null); }} className="btn btn-ghost btn-sm">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Template Name</label>
                <input className="input input-bordered w-full" value={form.name} onChange={(e)=>setForm(p=>({...p,name:e.target.value}))}/>
              </div>
              <div>
                <label className="label">Label/Category</label>
                <input className="input input-bordered w-full" value={form.label ?? ''} onChange={(e)=>setForm(p=>({...p,label:e.target.value, color: labelToColor(e.target.value)}))}/>
              </div>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="textarea textarea-bordered w-full" rows={2} value={form.description ?? ''} onChange={(e)=>setForm(p=>({...p,description:e.target.value}))}/>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Start</label>
                <input type="time" className="input input-bordered w-full" value={form.start} onChange={(e)=>setForm(p=>({...p,start:e.target.value}))}/>
              </div>
              <div>
                <label className="label">End</label>
                <input type="time" className="input input-bordered w-full" value={form.end} onChange={(e)=>setForm(p=>({...p,end:e.target.value}))}/>
              </div>
              <div>
                <label className="label">Break (mins)</label>
                <input type="number" className="input input-bordered w-full" min={0} step={15} value={form.break_mins} onChange={(e)=>setForm(p=>({...p,break_mins:parseInt(e.target.value||'0',10)}))}/>
              </div>
            </div>

            <div className="card bg-base-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input id="tpl-overnight" type="checkbox" className="checkbox checkbox-primary" checked={!!form.overnight} onChange={(e)=>setForm(p=>({...p,overnight:e.target.checked}))}/>
                  <label htmlFor="tpl-overnight" className="font-medium">Overnight Shift</label>
                </div>
                <div className="text-right">
                  <div className="font-medium">Gross: {formatHours(total)}</div>
                  <div className="text-sm opacity-70">Net: {formatHours(net)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => { setShowTemplateModal(false); setEditingTemplate(null); }}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>
              <Save className="w-4 h-4 mr-2" /> {isEdit ? 'Save Changes' : 'Create Template'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PatternModal = () => {
    interface WorkPatternForm extends Omit<WorkPattern, 'meta'> {
      meta: PatternMeta;
    }

    const isEdit = !!editingPattern;
    const isWork = (s: PatternStep): s is Extract<PatternStep, { type: 'work' }> => s.type === 'work';

    const DEFAULT_META: PatternMeta = {
      align: 'next-monday',
      weekendPolicy: 'weekends-off',
      weekendDays: [6, 0],
    };

    const [form, setForm] = useState<WorkPatternForm>(() =>
      editingPattern
        ? {
            ...editingPattern,
            meta: editingPattern.meta ?? DEFAULT_META,
          }
        : {
            id: 0,
            name: '',
            description: '',
            sequence: [shiftTemplates[0] ? { type: 'work', template: shiftTemplates[0].id } : { type: 'off' }],
            meta: DEFAULT_META,
          }
    );

    useEffect(() => {
      if (editingPattern) {
        setForm({
          ...editingPattern,
          meta: editingPattern.meta ?? DEFAULT_META,
        });
      }
    }, [editingPattern]);

    const addDay = () =>
      setForm(prev => {
        const next: PatternStep = shiftTemplates[0]
          ? { type: 'work', template: shiftTemplates[0].id }
          : { type: 'off' };
        return { ...prev, sequence: [...prev.sequence, next] };
      });

    const removeDay = (idx: number) =>
      setForm(prev => ({ ...prev, sequence: prev.sequence.filter((_, i) => i !== idx) }));

    const changeType = (idx: number, val: 'work' | 'off') =>
      setForm(prev => {
        const seq = [...prev.sequence];
        if (val === 'off') {
          seq[idx] = { type: 'off' };
        } else {
          const current = seq[idx];
          const tplId = isWork(current) ? current.template : (shiftTemplates[0]?.id ?? 0);
          seq[idx] = tplId ? { type: 'work', template: tplId } : { type: 'off' };
        }
        return { ...prev, sequence: seq };
      });

    const changeTpl = (idx: number, tplId: number) =>
      setForm(prev => {
        const seq = [...prev.sequence];
        seq[idx] = { type: 'work', template: tplId };
        return { ...prev, sequence: seq };
      });

    if (!showPatternModal) return null;

    const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const jsDowFromMonIndex = (i: number) => [1, 2, 3, 4, 5, 6, 0][i % 7];

    const previewDays: PatternStep[] = (() => {
      const out: PatternStep[] = [];
      if (!form.sequence.length) return out;
      let stepIndex = 0;
      for (let i = 0; i < 28; i++) {
        const jsDow = jsDowFromMonIndex(i);
        const isWknd = (form.meta?.weekendPolicy ?? DEFAULT_META.weekendPolicy) === 'weekends-off'
          && (form.meta?.weekendDays ?? DEFAULT_META.weekendDays).includes(jsDow);
        if (isWknd) {
          out.push({ type: 'off' });
          continue;
        }
        const step = form.sequence[stepIndex % form.sequence.length];
        out.push(step);
        stepIndex++;
      }
      return out;
    })();

    const save = async () => {
      try {
        const payload = {
          name: form.name,
          description: form.description ?? null,
          sequence: form.sequence.map(s =>
            isWork(s) ? { type: 'work', template: s.template } : { type: 'off' }
          ),
          meta: form.meta ?? DEFAULT_META,
        };

        if (isEdit) {
          const res = await fetch(`${API_BASE_URL}/api/schedules/patterns/${form.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(`Update pattern HTTP ${res.status}`);
          setPatterns(prev => prev.map(p => (p.id === form.id ? { ...form } : p)));
        } else {
          const res = await fetch(`${API_BASE_URL}/api/schedules/patterns`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(`Create pattern HTTP ${res.status}`);
          const data = await res.json();
          setPatterns(prev => [...prev, { ...form, id: data.id }]);
        }

        setShowPatternModal(false);
        setEditingPattern(null);
      } catch (e) {
        console.error(e);
        alert('Failed to save pattern');
      }
    };

    return (
      <div className="modal modal-open">
        <div className="modal-box max-w-6xl max-h-[95vh] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{isEdit ? 'Edit Pattern' : 'Create Pattern'}</h3>
                <p className="text-sm opacity-70">Define a repeating sequence of work/off days</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowPatternModal(false);
                setEditingPattern(null);
              }}
              className="btn btn-ghost btn-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-auto flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/2 space-y-6">
              <div>
                <label className="label">Pattern Name</label>
                <input
                  className="input input-bordered w-full"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows={3}
                  value={form.description ?? ''}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                />
              </div>

              <div className="card bg-base-200 p-4">
                <h4 className="font-semibold mb-3">Application rules</h4>
                <div className="space-y-4">
                  <div>
                    <label className="label">Alignment</label>
                    <select
                      className="select select-bordered w-full"
                      value={form.meta?.align ?? 'next-monday'}
                      onChange={e =>
                        setForm(p => ({
                          ...p,
                          meta: { ...p.meta, align: e.target.value as AlignMode },
                        }))
                      }
                    >
                      <option value="range-start">Start at selected range start</option>
                      <option value="next-monday">Start on next Monday</option>
                    </select>
                    <div className="text-xs opacity-70 mt-1">
                      "Start on next Monday" keeps 5/2 patterns aligned to Mon-Fri.
                    </div>
                  </div>

                  <div>
                    <label className="label">Weekend handling</label>
                    <select
                      className="select select-bordered w-full"
                      value={form.meta?.weekendPolicy ?? 'weekends-off'}
                      onChange={e =>
                        setForm(p => ({
                          ...p,
                          meta: { ...p.meta, weekendPolicy: e.target.value as WeekendPolicy },
                        }))
                      }
                    >
                      <option value="ignore">Ignore (apply every day)</option>
                      <option value="weekends-off">Weekends Off (don't advance pattern)</option>
                    </select>

                    {(form.meta?.weekendPolicy ?? 'weekends-off') === 'weekends-off' && (
                      <div className="mt-2">
                        <label className="label">Weekend days</label>
                        <select
                          className="select select-bordered w-full"
                          value={JSON.stringify(form.meta?.weekendDays ?? [6,0])}
                          onChange={e =>
                            setForm(p => ({
                              ...p,
                              meta: { ...p.meta, weekendDays: JSON.parse(e.target.value) as number[] },
                            }))
                          }
                        >
                          <option value="[6,0]">Saturday & Sunday</option>
                          <option value="[5,6]">Friday & Saturday</option>
                          <option value="[0]">Sunday only</option>
                          <option value="[6]">Saturday only</option>
                        </select>
                        <div className="text-xs opacity-70 mt-1">
                          Choose how weekends are defined for your company/site.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Sequence</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {form.sequence.map((step, idx) => (
                    <div key={idx} className="card bg-base-100 border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold">Day {idx + 1}</span>
                        {form.sequence.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs text-error"
                            onClick={() => setPendingRemove(idx)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="join w-full mb-3">
                        <button
                          type="button"
                          className={`btn join-item flex-1 ${step.type === 'work' ? 'btn-primary' : 'btn-ghost'}`}
                          onClick={() => changeType(idx, 'work')}
                        >
                          Work
                        </button>
                        <button
                          type="button"
                          className={`btn join-item flex-1 ${step.type === 'off' ? 'btn-primary' : 'btn-ghost'}`}
                          onClick={() => changeType(idx, 'off')}
                        >
                          Off
                        </button>
                      </div>

                      {step.type === 'work' ? (
                        <div>
                          <label className="label text-xs">Template</label>
                          <select
                            className="select select-bordered w-full"
                            value={String((step as PatternStepWork).template)}
                            onChange={(e) => changeTpl(idx, parseInt(e.target.value, 10))}
                          >
                            {shiftTemplates.length ? (
                              shiftTemplates.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name}
                                </option>
                              ))
                            ) : (
                              <option value="">No templates available</option>
                            )}
                          </select>
                        </div>
                      ) : (
                        <div className="text-sm opacity-70 text-center py-2">Day Off</div>
                      )}
                    </div>
                  ))}
                </div>
                <button className="btn btn-outline w-full mt-3" onClick={addDay}>
                  <Plus className="w-4 h-4" />
                  Add Day
                </button>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <h4 className="text-lg font-semibold mb-4">Preview (28 days)</h4>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => {
                  const jsd = [1,2,3,4,5,6,0][i];
                  const isWknd =
                    (form.meta?.weekendPolicy ?? 'weekends-off') === 'weekends-off' &&
                    (form.meta?.weekendDays ?? [6,0]).includes(jsd);
                  return (
                    <div
                      key={d}
                      className={`text-center text-xs font-medium p-1 rounded ${
                        isWknd ? 'bg-error text-error-content' : 'bg-base-200'
                      }`}
                    >
                      {d}
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {previewDays.map((step, i) => {
                  const jsd = [1,2,3,4,5,6,0][i % 7];
                  const isWeekend =
                    (form.meta?.weekendPolicy ?? 'weekends-off') === 'weekends-off' &&
                    (form.meta?.weekendDays ?? [6,0]).includes(jsd);

                  const tpl = step.type === 'work'
                    ? shiftTemplates.find(t => t.id === (step as PatternStepWork).template)
                    : undefined;

                  return (
                    <div key={i} className={`border rounded p-1 ${isWeekend ? 'bg-error/10' : ''}`}>
                      <div className="text-[10px] font-medium opacity-70 mb-1">
                        {['M','T','W','T','F','S','S'][i % 7]} • {i + 1}
                      </div>
                      {step.type === 'work' && tpl ? (
                        <div className={`text-[10px] p-1 rounded text-center ${tpl.color}`}>
                          <div className="font-medium">{tpl.start}</div>
                          <div>{tpl.end}</div>
                        </div>
                      ) : (
                        <div className="text-[10px] opacity-50 text-center p-1">Off</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="modal-action mt-6">
            <button
              className="btn btn-ghost"
              onClick={() => {
                setShowPatternModal(false);
                setEditingPattern(null);
              }}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={save}>
              <Save className="w-4 h-4 mr-2" /> {isEdit ? 'Save Changes' : 'Create Pattern'}
            </button>
          </div>
        </div>

        {pendingRemove !== null && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h4 className="font-semibold mb-2">Remove this day?</h4>
              <p className="text-sm opacity-70 mb-4">
                Day {pendingRemove + 1} will be removed from the sequence.
              </p>
              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => setPendingRemove(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => {
                    removeDay(pendingRemove);
                    setPendingRemove(null);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ================= Import Modal ================= */
  // [Keep your existing ImportModal component here - it's quite long]
  // For brevity, I'm keeping the ImportModal as you had it

  /* ================= Main Views ================= */
  const ScheduleListTable = () => (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-0">
        
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border-b">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <SearchBox
              onSearchApply={handleSearchApply}
              onClearSearch={handleClearSearch}
            />
            <button
              onClick={() => setShowFilters(s => !s)}
              className={`btn ${showFilters ? 'btn-primary' : 'btn-ghost'}`}
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
          
          {/* Search status indicator */}
          {appliedSearchTerm && (
            <div className="flex items-center gap-2 text-sm">
              <span className="opacity-70">Search:</span>
              <span className="font-semibold">"{appliedSearchTerm}"</span>
              <span className="opacity-70">•</span>
              <span className="opacity-70">{baseFilteredEmployees.length} results</span>
            </div>
          )}
        </div>

        {/* Table Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 bg-base-200">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span>
              Showing <strong>{totalRows ? pageStartIdx + 1 : 0}-{pageEndIdx}</strong> of <strong>{totalRows}</strong> rows
            </span>
            <label className="flex items-center gap-2">
              <span className="opacity-70">Rows:</span>
              <select className="select select-xs" value={tablePageSize} onChange={(e) => { setTablePageSize(parseInt(e.target.value, 10)); setTablePage(1); }}>
                {[10, 20, 30, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <div className="flex items-center gap-1">
              <button className="btn btn-xs" disabled={tablePage <= 1} onClick={() => setTablePage(p => Math.max(1, p - 1))}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="opacity-70 text-xs">Page {tablePage} / {totalTablePages}</span>
              <button className="btn btn-xs" disabled={tablePage >= totalTablePages} onClick={() => setTablePage(p => Math.min(totalTablePages, p + 1))}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs opacity-70">Save scope</label>
              <select
                className="select select-xs"
                value={saveScope}
                onChange={(e) => setSaveScope(e.target.value as SaveScope)}
              >
                <option value="changed">Changes only</option>
                <option value="selected">Selected rows</option>
                <option value="page">Current page</option>
                <option value="all">All filtered</option>
              </select>
            </div>

            <div className={`badge ${dirty ? 'badge-warning' : 'badge-ghost'}`}>
              {dirty ? `${changedKeys.size} unsaved` : lastSavedAt ? `Saved ${lastSavedAt}` : ''}
            </div>
            <button className={`btn btn-sm ${dirty ? 'btn-primary' : 'btn-ghost'}`} onClick={handleSave} disabled={saving || (!dirty && saveScope==='changed')}>
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {/* Error/Success Message */}
        {(saveError || (!dirty && lastSavedAt)) && (
          <div className={`p-3 border-b ${saveError ? 'bg-error text-error-content' : 'bg-success text-success-content'}`}>
            {saveError ? saveError : `Saved successfully at ${lastSavedAt}`}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="checkbox checkbox-sm" checked={allPageSelected} onChange={(e)=>toggleSelectPage(e.target.checked)} />
                    <span className="text-sm">Select</span>
                  </label>
                </th>
                <th className="cursor-pointer" onClick={() => handleSort('employeeName')}>
                  Name {getSortIcon('employeeName')}
                </th>
                <th className="cursor-pointer" onClick={() => handleSort('employeeNo')}>
                  Employee No {getSortIcon('employeeNo')}
                </th>
                <th className="cursor-pointer" onClick={() => handleSort('department')}>
                  Department {getSortIcon('department')}
                </th>
                <th>TZ</th>
                <th className="cursor-pointer" onClick={() => handleSort('date')}>
                  Date {getSortIcon('date')}
                </th>
                <th className="cursor-pointer" onClick={() => handleSort('netHours')}>
                  Total {getSortIcon('netHours')}
                </th>
                <th>Working Day</th>
                <th>Change Shift?</th>
                <th className="cursor-pointer" onClick={() => handleSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th>Start Time</th>
                <th>End Time</th>
                <th className="cursor-pointer" onClick={() => handleSort('pattern')}>
                  Pattern {getSortIcon('pattern')}
                </th>
                <th>Template</th>
                <th>Remark</th>
                <th>Quick</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={16}>
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">📅</div>
                      <h3 className="text-lg font-medium">No schedule entries found</h3>
                      <p className="mt-1 text-sm opacity-70">Try adjusting your search or filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => {
                  const emp = allEmployees.find(e => e.id === item.employeeId);
                  const tzVal = emp?.time_zone || 'Asia/Kuala_Lumpur';
                  const rid = item.id;
                  const [empIdStr, dayStr] = rid.split('-');
                  const eId = parseInt(empIdStr, 10);
                  const d = parseInt(dayStr, 10);
                  const remarkValue = remarkDrafts[rid] ?? item.remarks;

                  return (
                    <tr key={rid} className="hover">
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={selectedRowIds.has(rid)}
                          onChange={(e) => {
                            setSelectedRowIds(prev => {
                              const next = new Set(prev);
                              if (e.target.checked) next.add(rid);
                              else next.delete(rid);
                              return next;
                            });
                          }}
                        />
                      </td>
                      <td className="font-semibold">{item.employeeName}</td>
                      <td>{item.employeeNo}</td>
                      <td>{item.department}</td>
                      <td>
                        <select
                          className="select select-xs w-40"
                          value={tzVal}
                          onChange={async (e) => {
                            const tz = e.target.value;
                            try {
                              const resp = await fetch(`${API_BASE_URL}/api/admin/${item.employeeId}/timezone`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json'},
                                body: JSON.stringify({ time_zone: tz })
                              });
                              if (!resp.ok) throw new Error('Failed to update TZ');
                              setAllEmployees(prev => prev.map(emp => emp.id === item.employeeId ? { ...emp, time_zone: tz } : emp));
                            } catch (err) {
                              console.error(err);
                              alert('Failed to update timezone');
                            }
                          }}
                        >
                          {TZ_OPTIONS.map(z => <option key={z} value={z}>{z}</option>)}
                        </select>
                      </td>
                      <td>
                        {new Date(item.dateISO).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td>{formatHours(item.netHours)}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={item.status !== 'off'}
                          onChange={(e) => updateScheduleItem(rid, 'workingToggle', e.target.checked)}
                          className="checkbox checkbox-sm"
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={item.changeShift}
                          onChange={(e) => updateScheduleItem(rid, 'changeShift', e.target.checked)}
                          className="checkbox checkbox-sm"
                        />
                      </td>
                      <td>
                        <select
                          value={item.status}
                          onChange={(e) => updateScheduleItem(rid, 'status', e.target.value as ShiftStatus)}
                          className={`select select-xs ${
                            item.status === 'off' ? 'bg-error text-error-content' :
                            item.status === 'working' ? 'bg-success text-success-content' :
                            'bg-warning text-warning-content'
                          }`}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="time"
                          value={item.startTime}
                          onChange={(e) => updateScheduleItem(rid, 'startTime', e.target.value)}
                          className="input input-xs"
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          value={item.endTime}
                          onChange={(e) => updateScheduleItem(rid, 'endTime', e.target.value)}
                          className="input input-xs"
                        />
                      </td>
                      <td>{item.patternName || '-'}</td>
                      <td>{item.templateName || '-'}</td>
                      <td>
                        <input
                          type="text"
                          value={remarkValue}
                          onChange={(e) => handleRemarkInput(rid, e.target.value)}
                          onBlur={() => commitRemark(rid)}
                          placeholder="Add remark..."
                          className="input input-xs"
                        />
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <QuickApplySelect rowId={rid} employeeId={eId} day={d} />
                          <button className="btn btn-xs btn-ghost" onClick={()=>{
                            setEditingCell({ employeeId: eId, day: d });
                            setShowCustomTimeModal(true);
                          }}>
                            <MoreVertical className="w-4 h-4"/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const TemplatesTab = () => {
    const filteredTemplates = useMemo(() => {
      const q = appliedTemplateSearch.trim().toLowerCase();
      if (!q) return shiftTemplates;
      return shiftTemplates.filter(t =>
        t.name.toLowerCase().includes(q) ||
        (t.label ?? '').toLowerCase().includes(q) ||
        (t.description ?? '').toLowerCase().includes(q)
      );
    }, [shiftTemplates, appliedTemplateSearch]);

    const confirmDeleteTemplate = async () => {
      if (!templateToDelete) return;
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/schedules/templates/${templateToDelete.id}`,
          { method: 'DELETE' }
        );
        if (!res.ok) throw new Error(`Delete template HTTP ${res.status}`);
        setShiftTemplates(prev => prev.filter(t => t.id !== templateToDelete.id));
      } catch (e) {
        console.error(e);
        alert('Failed to delete template');
      } finally {
        setTemplateToDelete(null);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Shift Templates</h2>
            <p className="opacity-70">Create, edit and delete templates.</p>
          </div>
          <div className="flex items-center gap-3">
            <TemplateSearchBox
              onSearchApply={handleTemplateSearchApply}
              onClearSearch={handleTemplateSearchClear}
            />
            <button className="btn btn-primary" onClick={() => { setEditingTemplate(null); setShowTemplateModal(true); }}>
              <Plus className="w-4 h-4" /> New Template
            </button>
          </div>
        </div>

        {/* Search status indicator */}
        {appliedTemplateSearch && (
          <div className="flex items-center gap-2 text-sm p-3 bg-base-200 rounded-lg">
            <span className="opacity-70">Searching templates:</span>
            <span className="font-semibold">"{appliedTemplateSearch}"</span>
            <span className="opacity-70">•</span>
            <span className="opacity-70">{filteredTemplates.length} results</span>
            <button
              className="btn btn-xs btn-ghost"
              onClick={handleTemplateSearchClear}
            >
              Clear
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(t => (
            <div key={t.id} className="card bg-base-100 shadow-lg border">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div className={`badge ${t.color} badge-lg`}>{t.name}</div>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={()=>{ setEditingTemplate(t); setShowTemplateModal(true); }}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-error"
                      onClick={() => setTemplateToDelete(t)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="opacity-70">Start</span><span className="font-semibold">{t.start}</span>
                  <span className="opacity-70">End</span><span className="font-semibold">{t.end}</span>
                  <span className="opacity-70">Break</span><span className="font-semibold">{t.break_mins} mins</span>
                  <span className="opacity-70">Net</span>
                  <span className="font-semibold text-primary">{formatHours(calcNetHours(t.start,t.end,!!t.overnight,t.break_mins))}</span>
                </div>
                {t.overnight && <div className="flex items-center gap-1 text-secondary mt-2"><Moon className="w-4 h-4" /><span>Overnight</span></div>}
                {t.description && <div className="mt-4 pt-4 border-t opacity-70 text-sm">{t.description}</div>}
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && appliedTemplateSearch && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium">No templates found</h3>
            <p className="mt-1 text-sm opacity-70">No templates match "{appliedTemplateSearch}"</p>
            <button
              className="btn btn-ghost btn-sm mt-2"
              onClick={handleTemplateSearchClear}
            >
              Clear search
            </button>
          </div>
        )}

        <TemplateModal />

        {templateToDelete && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h4 className="font-semibold mb-2">Delete template?</h4>
              <p className="text-sm opacity-70 mb-4">
                "{templateToDelete.name}" will be permanently removed.
              </p>
              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => setTemplateToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error"
                  onClick={confirmDeleteTemplate}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const PatternsTab = () => {
    const filteredPatterns = useMemo(() => {
      const q = appliedPatternSearch.trim().toLowerCase();
      if (!q) return patterns;
      return patterns.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q)
      );
    }, [patterns, appliedPatternSearch]);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Work Patterns</h2>
            <p className="opacity-70">Create, edit and delete patterns.</p>
          </div>
          <div className="flex items-center gap-3">
            <TemplateSearchBox // Reusing the same component
              onSearchApply={handlePatternSearchApply}
              onClearSearch={handlePatternSearchClear}
            />
            <button className="btn btn-primary" onClick={() => { setEditingPattern(null); setShowPatternModal(true); }}>
              <Plus className="w-4 h-4" /> New Pattern
            </button>
          </div>
        </div>

        {/* Search status indicator */}
        {appliedPatternSearch && (
          <div className="flex items-center gap-2 text-sm p-3 bg-base-200 rounded-lg">
            <span className="opacity-70">Searching patterns:</span>
            <span className="font-semibold">"{appliedPatternSearch}"</span>
            <span className="opacity-70">•</span>
            <span className="opacity-70">{filteredPatterns.length} results</span>
            <button
              className="btn btn-xs btn-ghost"
              onClick={handlePatternSearchClear}
            >
              Clear
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPatterns.map(p => (
            <div key={p.id} className="card bg-base-100 shadow-lg border">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-sm opacity-70">{p.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={()=>{ setEditingPattern(p); setShowPatternModal(true); }}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-error"
                      onClick={async () => {
                        if (!confirm('Delete this pattern?')) return;
                        try {
                          const res = await fetch(`${API_BASE_URL}/api/schedules/patterns/${p.id}`, { method: 'DELETE' });
                          if (!res.ok) throw new Error(`Delete pattern HTTP ${res.status}`);
                          setPatterns(prev => prev.map(x => x.id === p.id ? x : p));
                        } catch (e) {
                          console.error(e);
                          alert('Failed to delete pattern');
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="font-medium text-sm mb-2">Preview</div>
                  <div className="grid grid-cols-7 gap-1">
                    {p.sequence.slice(0,7).map((s, i) => {
                      const tpl = s.type==='work' ? shiftTemplates.find(t => t.id === (s as PatternStepWork).template) : undefined;
                      return (
                        <div key={i} className="aspect-square border rounded">
                          {s.type==='work' && tpl
                            ? <div className={`w-full h-full rounded flex flex-col justify-center items-center text-xs ${tpl.color}`}>
                                <div className="font-bold">{tpl.start}</div>
                                <div>{tpl.end}</div>
                              </div>
                            : <div className="w-full h-full flex items-center justify-center opacity-50">Off</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-sm opacity-70">
                  {p.sequence.filter(s=>s.type==='work').length} work days, {p.sequence.filter(s=>s.type==='off').length} off days
                </div>

                {p.meta && (
                  <div className="mt-3 pt-3 border-t text-xs opacity-60">
                    <div>Align: {p.meta.align === 'next-monday' ? 'Next Monday' : 'Range Start'}</div>
                    <div>Weekends: {p.meta.weekendPolicy === 'weekends-off' ? 'Off' : 'Ignore'}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredPatterns.length === 0 && appliedPatternSearch && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium">No patterns found</h3>
            <p className="mt-1 text-sm opacity-70">No patterns match "{appliedPatternSearch}"</p>
            <button
              className="btn btn-ghost btn-sm mt-2"
              onClick={handlePatternSearchClear}
            >
              Clear search
            </button>
          </div>
        )}

        {filteredPatterns.length === 0 && !appliedPatternSearch && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium">No patterns created yet</h3>
            <p className="mt-1 text-sm opacity-70">Create your first work pattern to get started</p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => { setEditingPattern(null); setShowPatternModal(true); }}
            >
              <Plus className="w-4 h-4 mr-2" /> Create Pattern
            </button>
          </div>
        )}

        <PatternModal />
      </div>
    );
  };

  /* ================= Main Render ================= */
  return (
    <div className="min-h-screen bg-base-100">
      <div className="p-6 max-w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Task Scheduler</h1>
              <p className="opacity-70 mt-1">Dynamic per-employee or bulk scheduling.</p>
            </div>
<div className="flex items-center gap-3">
  <div className="text-sm opacity-70">
    {new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
  </div>
  <div className="divider divider-horizontal mx-2" />
  <button 
    className="btn btn-ghost" 
    onClick={() => setShowExportModal(true)}
    disabled={exporting}
  >
    {exporting ? (
      <>
        <span className="loading loading-spinner loading-sm"></span> Exporting...
      </>
    ) : (
      <>
        <Download className="w-4 h-4" /> Export
      </>
    )}
  </button>
  <button 
    className="btn btn-ghost" 
    onClick={() => setShowImportModal(true)}
    disabled={importing}
  >
    {importing ? (
      <>
        <span className="loading loading-spinner loading-sm"></span> Importing...
      </>
    ) : (
      <>
        <Upload className="w-4 h-4" /> Import
      </>
    )}
  </button>
</div>
          </div>

          {/* ADD VISUAL FEEDBACK FOR RESTRICTED VIEW HERE */}
          <div className="flex items-center gap-4 mb-4 p-3 bg-base-200 rounded-lg">
            {user?.role === 'employee' && (
              <div className="flex items-center gap-2">
                <div className="badge badge-info badge-lg p-3">
                  👤 Employee View • My Company Only
                </div>
                <div className="text-sm opacity-70">
                  Viewing schedules for {companies.find(c => String(c.id) === String(userCompanyId))?.name || 'your company'}
                </div>
              </div>
            )}
            {user?.role === 'manager' && (
              <div className="flex items-center gap-2">
                <div className="badge badge-warning badge-lg p-3">
                  👨‍💼 Manager View • Managed Employees
                </div>
                <div className="text-sm opacity-70">
                  Viewing schedules for employees you manage
                </div>
              </div>
            )}
            {user?.role === 'admin' && (
              <div className="flex items-center gap-2">
                <div className="badge badge-success badge-lg p-3">
                  ⚙️ Admin View • All Companies
                </div>
                <div className="text-sm opacity-70">
                  Full access to all schedules and companies
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="tabs tabs-boxed">
              <button className={`tab gap-2 ${activeView==='scheduler' ? 'tab-active' : ''}`} onClick={() => setActiveView('scheduler')}>
                <Calendar className="w-4 h-4" /> Scheduler
              </button>
              <button className={`tab gap-2 ${activeView==='templates' ? 'tab-active' : ''}`} onClick={() => setActiveView('templates')}>
                <Clock className="w-4 h-4" /> Templates
              </button>
              <button className={`tab gap-2 ${activeView==='patterns' ? 'tab-active' : ''}`} onClick={() => setActiveView('patterns')}>
                <Settings className="w-4 h-4" /> Patterns
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && activeView === 'scheduler' && (
          <div className="card bg-base-100 shadow-lg mb-6">
            <div className="card-body">
              <div className="grid grid-cols-1 xl:grid-cols-6 gap-4">
                <div>
                  <label className="label">Month & Year</label>
                  <select
                    className="select select-bordered w-full"
                    value={`${selectedYear}-${selectedMonth}`}
                    onChange={(e) => {
                      const [y, m] = e.target.value.split('-').map(Number);
                      setSelectedYear(y); setSelectedMonth(m);
                    }}
                  >
                    {Array.from({length:12},(_,m)=>(
                      <option key={m} value={`${selectedYear}-${m}`}>
                        {new Date(selectedYear, m).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Company</label>
                  <select 
                    className="select select-bordered w-full" 
                    value={String(selectedCompany)} 
                    onChange={(e)=>{ setSelectedCompany(e.target.value==='All'?'All':e.target.value); setSelectedEmployeeId('All'); }}
                  >
                    {user?.role === 'employee' ? (
                      // For employees, show only their company (not disabled)
                      companies
                        .filter(c => String(c.id) === String(userCompanyId))
                        .map(c => (
                          <option key={c.id} value={String(c.id)}>
                            {c.name}
                          </option>
                        ))
                    ) : (
                      // For admin/manager, show all companies
                      <>
                        <option value="All">All Companies</option>
                        {companies.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="label">Employee</label>
                  <select 
                    className="select select-bordered w-full" 
                    value={String(selectedEmployeeId)} 
                    onChange={(e)=>setSelectedEmployeeId(e.target.value==='All'?'All':e.target.value)}
                  >
                    <option value="All">All Employees</option>
                    {employeesForDropdown.map(e => (
                      <option key={e.id} value={String(e.id)}>{e.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Start Date</label>
                  <input type="date" className="input input-bordered w-full" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
                </div>

                <div>
                  <label className="label">End Date</label>
                  <input type="date" className="input input-bordered w-full" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
                </div>

                <div>
                  <label className="label">Status</label>
                  <select className="select select-bordered w-full" value={selectedStatus} onChange={(e)=>setSelectedStatus(e.target.value as any)}>
                    <option value="All">All Status</option>
                    <option value="working">working</option>
                    <option value="off">off</option>
                    <option value="leave">leave</option>
                  </select>
                </div>
              </div>

              {/* Bulk Tools */}
              <div className="mt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                  <h4 className="font-semibold">Bulk Tools</h4>
                  <div className="flex items-end gap-3">
                    <div>
                      <label className="label">Tool</label>
                      <select
                        className="select select-bordered"
                        value={bulkTool}
                        onChange={(e) => setBulkTool(e.target.value as BulkTool)}
                      >
                        <option value="time">Bulk Time Settings</option>
                        <option value="template">Template Settings</option>
                        <option value="pattern">Pattern Settings</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">Scope</label>
                      <select
                        className="select select-bordered"
                        value={bulkScope}
                        onChange={(e) => setBulkScope(e.target.value as BulkScope)}
                      >
                        <option value="selected">Selected rows</option>
                        <option value="page">Current page</option>
                        <option value="all">All filtered</option>
                      </select>
                    </div>
                  </div>
                </div>

                {bulkTool === 'time' && (
                  <div className="card bg-base-200 p-4">
                    <h5 className="font-semibold mb-4">Bulk Time Settings</h5>
                    <div className="flex flex-col md:flex-row md:items-end gap-3">
                      <div>
                        <label className="label">Start Time</label>
                        <input
                          type="time"
                          className="input input-bordered"
                          value={bulkStart}
                          onChange={(e) => setBulkStart(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="label">End Time</label>
                        <input
                          type="time"
                          className="input input-bordered"
                          value={bulkEnd}
                          onChange={(e) => setBulkEnd(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        {/* applyBulkTime */}
                        <button className="btn btn-primary" onClick={applyBulkTimeWithHolidays}>Apply</button>
                      </div>
                      <p className="text-xs text-warning mt-2">
                        Note: Public holidays will be automatically marked as "off" days
                      </p>
                    </div>
                  </div>
                )}

                {bulkTool === 'template' && (
                  <div className="card bg-base-200 p-4">
                    <h5 className="font-semibold mb-4">Template Settings</h5>
                    <div className="flex flex-col md:flex-row md:items-end gap-3">
                      <div>
                        <label className="label">Template</label>
                        <select
                          className="select select-bordered"
                          value={String(templateToApply)}
                          onChange={(e) => setTemplateToApply(e.target.value ? Number(e.target.value) : '')}
                        >
                          <option value="">Select a template</option>
                          {shiftTemplates.map((t) => (
                            <option key={t.id} value={String(t.id)}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        {/* applyBulkTemplate */}
                        <button className="btn btn-primary" onClick={applyBulkTemplateWithHolidays} disabled={!templateToApply}>Apply</button>
                      </div>
                      <p className="text-xs text-warning mt-2">
                        Note: Public holidays will be automatically marked as "off" days
                      </p>
                    </div>
                  </div>
                )}

                {bulkTool === 'pattern' && (
                  <div className="card bg-base-200 p-4">
                    <h5 className="font-semibold mb-4">Pattern Settings</h5>
                    <p className="text-sm text-info mb-3">
                      ⓘ Holidays will override pattern days. Pattern sequence continues normally.
                    </p>
                    <div className="flex flex-col md:flex-row md:items-end gap-3">
                      <div>
                        <label className="label">Pattern</label>
                        <select
                          className="select select-bordered"
                          value={String(patternToApply)}
                          onChange={(e) => setPatternToApply(e.target.value ? Number(e.target.value) : '')}
                        >
                          <option value="">Select a pattern</option>
                          {patterns.map((p) => (
                            <option key={p.id} value={String(p.id)}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          className="btn btn-primary" 
                          onClick={applyBulkPatternWithHolidays} 
                          disabled={!patternToApply}
                        >
                          Apply Pattern (Respect Holidays)
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          onClick={applyBulkPattern}  // Original function without holiday check
                          disabled={!patternToApply}
                          title="Apply pattern ignoring holidays"
                        >
                          Apply (Ignore Holidays)
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs opacity-70">
                      Example: Pattern Mon-Fri work with holiday on Wednesday → Mon:Work, Tue:Work, Wed:Holiday, Thu:Work, Fri:Work
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-sm opacity-70">
                  Filtered employees: <strong>{baseFilteredEmployees.length}</strong> • Selected rows: <strong>{selectedRowIds.size}</strong>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {activeView === 'scheduler' && <ScheduleListTable />}
        {activeView === 'templates' && <TemplatesTab />}
        {activeView === 'patterns' && <PatternsTab />}

        {/* Modals */}
        <ExportOptionsModal />
        <CustomTimeModal />
        <TemplateModal />
        <PatternModal />
        {/* Keep your existing ImportModal component here */}
        <ImportModal />
      </div>
    </div>
  );
}
