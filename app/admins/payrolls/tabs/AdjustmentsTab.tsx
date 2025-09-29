'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import { toast } from 'react-hot-toast';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import React from 'react';

interface Payroll {
  id: number;
  period_year: number;
  period_month: number;
  employee_id: number;
  basic_salary: string;
  total_allowance: string;
  gross_salary: string;
  total_deduction: string;
  net_salary: string;
  epf_employee: string;
  epf_employer: string;
  socso_employee: string;
  socso_employer: string;
  eis_employee: string;
  eis_employer: string;
  pcb: string;
  status_code: string;
  generated_by: string | null;
  generated_at: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  remarks: string | null;
  row_order: number;
  employee_name: string;
  email: string;
  salary: string;
  currency: string;
  leave_balance: number;
  company_id: number;
  manager_id: number;
  role: string;
  joined_date: string;
  resigned_date: string | null;
  gender: string;
  employee_no: string;
  employment_type: string;
  job_level: string;
  department: string;
  position: string;
  superior: string;
  office: string;
  nationality: string;
  visa_expired_date: string | null;
  passport_expired_date: string | null;
  employee_status: string;
  activation: string;
  ic_passport: string | null;
  confirmation_date: string | null;
  marital_status: string;
  dob: string;
  age: number;
  mobile_number: string;
  country_code: string;
  payment_company: string;
  pay_interval: string;
  payment_method: string;
  bank_name: string;
  bank_currency: string;
  bank_account_name: string;
  bank_account_no: string;
  income_tax_no: string | null;
  socso_account_no: string | null;
  epf_account_no: string | null;
  employee_company: string | null;
  race: string;
  religion: string;
  attachment: string | null;
  address: string | null;
  qualification: string | null;
  education_level: string;
  emergency_contact_name: string | null;
  emergency_contact_relationship: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_email: string | null;
  is_superadmin: number;
  current_position_start_date: string;
}

interface Dependent {
  id: number;
  employee_id: number;
  full_name: string;
  relationship: string;
  birth_date: string;
  gender: string;
  is_disabled: number;
  is_studying: number;
  nationality: string;
  identification_no: string;
  notes: string;
  child_relief_percent: string;
  created_at: string;
  updated_at: string;
}

interface FieldRemark {
  field: string;
  remark: string;
}

interface ApiResponse {
  total: number;
  page: number;
  limit: number;
  data: Payroll[];
  dependents: Dependent[];
  remarks: { [id: number]: FieldRemark[] };
}

const allEditableFields = [
  'remarks',
  'total_allowance',
  'total_deduction',
  'gross_salary',
  'net_salary',
  'epf_employee',
  'epf_employer',
  'socso_employee',
  'socso_employer',
  'eis_employee',
  'eis_employer',
  'pcb',
  'basic_salary',
  'salary',
  'leave_balance',
  'employee_name',
  'period_month',
  'period_year',
  'email',
  'currency',
  'company_id',
  'manager_id',
  'role',
  'joined_date',
  'resigned_date',
  'gender',
  'employee_no',
  'employment_type',
  'job_level',
  'department',
  'position',
  'superior',
  'office',
  'nationality',
  'visa_expired_date',
  'passport_expired_date',
  'employee_status',
  'activation',
  'ic_passport',
  'confirmation_date',
  'marital_status',
  'dob',
  'age',
  'mobile_number',
  'country_code',
  'payment_company',
  'pay_interval',
  'payment_method',
  'bank_name',
  'bank_currency',
  'bank_account_name',
  'bank_account_no',
  'income_tax_no',
  'socso_account_no',
  'epf_account_no',
  'employee_company',
  'race',
  'religion',
  'attachment',
  'address',
  'qualification',
  'education_level',
  'emergency_contact_name',
  'emergency_contact_relationship',
  'emergency_contact_phone',
  'emergency_contact_email',
  'is_superadmin',
  'current_position_start_date'
] as const;

type EditableField = typeof allEditableFields[number];
type TableColumn = EditableField | `${EditableField}_remark`;

const defaultPinnedColumns: TableColumn[] = ['employee_name', 'period_month', 'period_year', 'basic_salary'];

export default function AdjustmentsTab() {
  const [apiResponse, setApiResponse] = useState<ApiResponse>({
    total: 0,
    page: 1,
    limit: 20,
    data: [],
    dependents: [],
    remarks: {}
  });
  const [loading, setLoading] = useState(true);
  const [modified, setModified] = useState<{ [id: number]: Partial<Payroll> }>({});
  const [remarks, setRemarks] = useState<{ [id: number]: FieldRemark[] }>({});
  const [editMode, setEditMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [columnOrder, setColumnOrder] = useState<EditableField[]>(() => {
    const saved = localStorage.getItem('payrollColumnOrder');
return saved ? (JSON.parse(saved) as EditableField[]) : [...allEditableFields];

  });
  const [pinnedColumns, setPinnedColumns] = useState<TableColumn[]>(() => {
    const saved = localStorage.getItem('pinnedColumns');
    return saved ? JSON.parse(saved) : defaultPinnedColumns;
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [activeRemarkEdit, setActiveRemarkEdit] = useState<{id: number | null, field: string | null}>({id: null, field: null});
  const tableContainerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//   fetchData();
// }, [page, limit]);




  useEffect(() => {
    localStorage.setItem('payrollColumnOrder', JSON.stringify(columnOrder));
    localStorage.setItem('pinnedColumns', JSON.stringify(pinnedColumns));
  }, [columnOrder, pinnedColumns]);

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get<ApiResponse>(`${API_BASE_URL}/api/payroll/adjustments`);
  //     setApiResponse(res.data);
  //     // Initialize remarks state from API response
  //     const initialRemarks: { [id: number]: FieldRemark[] } = {};
  //     // res.data.data.forEach(payroll => {
  //     //   initialRemarks[payroll.id] = res.data.remarks[payroll.id] || [];
  //     // });
  //     setRemarks(initialRemarks);
  //   } catch (err) {
  //     toast.error('Failed to fetch payroll data');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const fetchData1 = async () => {
  setLoading(true);
  try {
    const res = await axios.get<ApiResponse>(
      `${API_BASE_URL}/api/payroll/adjustments?page=${page}&limit=${limit}`
    );
    setApiResponse(res.data);

    const initialRemarks: { [id: number]: FieldRemark[] } = {};
    res.data.data.forEach(payroll => {
      initialRemarks[payroll.id] = res.data.remarks[payroll.id] || [];
    });
    setRemarks(initialRemarks);
  } catch (err) {
    toast.error('Failed to fetch payroll data');
  } finally {
    setLoading(false);
  }
};

// ...state/hooks above

// 1) Define fetchData first
const fetchData = useCallback(async () => {
  setLoading(true);
  try {
    const res = await axios.get<ApiResponse>(
      `${API_BASE_URL}/api/payroll/adjustments?page=${page}&limit=${limit}`
    );
    setApiResponse(res.data);

    const initialRemarks: { [id: number]: FieldRemark[] } = {};
    res.data.data.forEach(payroll => {
      initialRemarks[payroll.id] = res.data.remarks[payroll.id] || [];
    });
    setRemarks(initialRemarks);
  } catch (err) {
    toast.error('Failed to fetch payroll data');
  } finally {
    setLoading(false);
  }
}, [page, limit]); // keep deps here

// 2) Now call it from the effect
useEffect(() => {
  fetchData();
}, [fetchData]);





  const handleFieldChange = (id: number, field: keyof Payroll, value: string) => {
    if (field !== 'remarks' && value && isNaN(Number(value))) return;
    setModified((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleRemarkChange = (id: number, field: string, value: string) => {
    setRemarks(prev => {
      const existingRemarks = prev[id] || [];
      const existingRemarkIndex = existingRemarks.findIndex(r => r.field === field);
      
      if (existingRemarkIndex >= 0) {
        const updated = [...existingRemarks];
        updated[existingRemarkIndex] = { field, remark: value };
        return { ...prev, [id]: updated };
      } else {
        return { ...prev, [id]: [...existingRemarks, { field, remark: value }] };
      }
    });
  };

  const getRemarkForField = (id: number, field: string): string => {
    const recordRemarks = remarks[id] || [];
    const remark = recordRemarks.find(r => r.field === field);
    return remark ? remark.remark : '';
  };

  const saveChanges = async (id: number) => {
    const updates = modified[id];
    const remarkUpdates = remarks[id] || [];
    
    if (!updates && remarkUpdates.length === 0) return;
    
    try {
      const payload = {
        ...updates,
        remarks: remarkUpdates
      };
      
      await axios.patch(`${API_BASE_URL}/api/payroll/${id}`, payload);
      toast.success(`Saved changes for ${apiResponse.data.find(p => p.id === id)?.employee_name || 'record'}`);
      
      // Clear modified state for this record
      setModified(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      
      // Clear remarks edit state
      setActiveRemarkEdit({id: null, field: null});
      
      // Refresh data
      fetchData();
    } catch (err) {
      toast.error(`Failed to save changes`);
    }
  };

  const saveAll = async () => {
    const ids = Object.keys(modified);
    const remarkIds = Object.keys(remarks).filter(id => (remarks[Number(id)] || []).length > 0);
    const allIds = [...new Set([...ids, ...remarkIds])];
    
    if (allIds.length === 0) return toast('Nothing to save');
    
    const toastId = toast.loading(`Saving ${allIds.length} changes...`);
    try {
      await Promise.all(
        allIds.map(id => {
          const payload = {
            ...modified[Number(id)],
            remarks: remarks[Number(id)] || []
          };
          return axios.patch(`${API_BASE_URL}/api/payroll/${id}`, payload);
        })
      );
      toast.success(`Saved all changes`, { id: toastId });
      setModified({});
      setRemarks({});
      setActiveRemarkEdit({id: null, field: null});
      fetchData();
    } catch (err) {
      toast.error(`Failed to save some changes`, { id: toastId });
    }
  };

  const onRowDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = [...apiResponse.data];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setApiResponse(prev => ({...prev, data: reordered}));
  };

  const onColumnDragEnd1 = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = [...columnOrder];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setColumnOrder(reordered);
  };


  // replace onColumnDragEnd with this:
const onColumnDragEnd = (result: DropResult) => {
  if (!result.destination) return;

  // We drag among *non-pinned base* columns only
  const from = result.source.index;
  const to = result.destination.index;

  const visible = [...nonPinnedBaseColumns];
  const [movedField] = visible.splice(from, 1);
  visible.splice(to, 0, movedField);

  // Rebuild columnOrder = pinned base (unchanged order) + reordered visible + any remaining base that were pinned
  const newOrder: EditableField[] = [];
  // 1) keep pinned base columns as they were (in their original columnOrder order)
  for (const f of columnOrder) {
    if (pinnedColumns.includes(f)) newOrder.push(f);
  }
  // 2) then the reordered non-pinned base columns
  newOrder.push(...visible);
  setColumnOrder(newOrder);
};

// add this memo near other state/memos
const nonPinnedBaseColumns = useMemo(
  () => columnOrder.filter((f) => !pinnedColumns.includes(f)),
  [columnOrder, pinnedColumns]
);


  const togglePinColumn = (field: TableColumn) => {
    setPinnedColumns(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field) 
        : [...prev, field]
    );
  };

  const calculateLeftPosition = (index: number) => {
    const basePosition = 48;
    const columnWidth = 150;
    return `${basePosition + (index * columnWidth)}px`;
  };

  const getAllPinnableColumns1 = (): TableColumn[] => {
    return [...defaultPinnedColumns, ...columnOrder, ...columnOrder.map(f => `${f}_remark` as TableColumn)];
  };

  // replace getAllPinnableColumns with this:
const getAllPinnableColumns = (): TableColumn[] => {
  const all: TableColumn[] = [
    ...defaultPinnedColumns,
    ...columnOrder,
    ...columnOrder.map(f => `${f}_remark` as TableColumn),
  ];
  // de-duplicate while preserving order
  const seen = new Set<string>();
  const uniq: TableColumn[] = [];
  for (const c of all) {
    const k = String(c);
    if (!seen.has(k)) {
      seen.add(k);
      uniq.push(c);
    }
  }
  return uniq;
};


  // Generate all columns including remark columns
  const getAllColumns = (): TableColumn[] => {
    const columns: TableColumn[] = [];
    columnOrder.forEach(field => {
      columns.push(field);
      columns.push(`${field}_remark` as TableColumn);
    });
    return columns;
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <button 
            className={`btn btn-sm ${editMode ? 'btn-warning' : 'btn-primary'}`}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel Edit
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Mode
              </>
            )}
          </button>
          
          <div className="tooltip" data-tip="Pin columns to keep them visible while scrolling">
            <div className="dropdown dropdown-bottom">
              <label tabIndex={0} className="btn btn-sm btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Pin Columns
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
                {getAllPinnableColumns().map((field) => (
                  <li key={field}>
                    <label className="label cursor-pointer justify-start">
                      <input
                        type="checkbox"
                        checked={pinnedColumns.includes(field)}
                        onChange={() => togglePinColumn(field)}
                        className="checkbox checkbox-sm mr-2"
                      />
                      <span className="label-text capitalize">
                        {field.toString().replace(/_remark$/, '').replace(/_/g, ' ')}
                        {field.endsWith('_remark') ? ' (Remark)' : ''}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">
            {loading ? 'Loading...' : `${apiResponse.data.length} of ${apiResponse.total} records`}
          </span>
          
          <button
            className={`btn btn-sm btn-success ${Object.keys(modified).length || Object.values(remarks).some(r => r.length > 0) ? '' : 'btn-disabled'}`}
            onClick={saveAll}
            disabled={Object.keys(modified).length === 0 && Object.values(remarks).every(r => r.length === 0)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save All ({Object.keys(modified).length + Object.values(remarks).filter(r => r.length > 0).length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div 
          ref={tableContainerRef}
          className="overflow-x-auto border rounded-lg bg-base-100 shadow-sm"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          <DragDropContext
            onDragEnd={(result) => {
              if (result.type === 'column' && editMode) onColumnDragEnd(result);
              else if (result.type === 'row' && editMode) onRowDragEnd(result);
            }}
          >
            <Droppable droppableId="payrollTable" type="row">
              {(provided) => (
                <table
                  className="table table-auto whitespace-nowrap text-sm relative"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
<thead className="sticky top-0 z-20">
  <Droppable droppableId="columns" direction="horizontal" type="column">
    {(provided) => (
      <tr ref={provided.innerRef} {...provided.droppableProps}>
        <th className="sticky left-0 bg-base-200 z-30 w-12">#</th>

        {/* Pinned headers */}
        {pinnedColumns.map((field, index) => (
          <th
            key={`pinned-${field}`}
            className="sticky bg-base-200 z-20 min-w-[150px]"
            style={{ left: calculateLeftPosition(index) }}
          >
            <div className="flex items-center gap-1">
              <span className="capitalize">
                {String(field).replace(/_remark$/, '').replace(/_/g, ' ')}
                {String(field).endsWith('_remark') ? ' (Remark)' : ''}
              </span>
              <button
                onClick={() => togglePinColumn(field)}
                className="btn btn-xs btn-ghost p-0 hover:bg-base-300"
                title="Unpin column"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </th>
        ))}

        {/* Draggable non-pinned base headers, followed by their remark headers */}
        {nonPinnedBaseColumns.map((field, index) => (
          <React.Fragment key={`frag-${field}`}>
            <Draggable key={`col-base-${field}`} draggableId={`col-base-${field}`} index={index}>
              {(drag) => (
                <th
                  {...drag.draggableProps}
                  {...drag.dragHandleProps}
                  ref={drag.innerRef}
                  className={`min-w-[150px] ${editMode ? 'cursor-move bg-base-300' : 'bg-base-200'}`}
                >
                  <div className="flex items-center gap-1">
                    <span className="capitalize">
                      {String(field).replace(/_/g, ' ')}
                    </span>
                    <button
                      onClick={() => togglePinColumn(field)}
                      className="btn btn-xs btn-ghost p-0 hover:bg-base-300"
                      title="Pin column"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                </th>
              )}
            </Draggable>

            {/* remark header (non-draggable) */}
            <th key={`col-remark-${field}`} className="min-w-[150px] bg-base-200">
              <div className="flex items-center gap-1">
                <span className="capitalize">
                  {String(field).replace(/_/g, ' ')} (Remark)
                </span>
                <button
                  onClick={() => togglePinColumn(`${field}_remark` as TableColumn)}
                  className="btn btn-xs btn-ghost p-0 hover:bg-base-300"
                  title="Pin column"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            </th>
          </React.Fragment>
        ))}

        <th className="min-w-[150px] bg-base-200">Dependents</th>
        <th className="min-w-[100px] bg-base-200">Action</th>

        {provided.placeholder}
      </tr>
    )}
  </Droppable>
</thead>

                  <tbody>
                    {apiResponse.data.map((p, index) => (
                      <Draggable key={p.id} draggableId={p.id.toString()} index={index}>
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`group hover:bg-base-100 ${modified[p.id] ? 'bg-yellow-50' : ''}`}
                          >
                            <td className="sticky left-0 bg-inherit z-10 w-12">
                              {index + 1}
                            </td>
                            
                            {pinnedColumns.map((field, idx) => {
                              if (field.endsWith('_remark')) {
                                const baseField = field.replace('_remark', '') as EditableField;
                                return (
                                  <td 
                                    key={field} 
                                    className="sticky bg-inherit z-10 min-w-[150px]"
                                    style={{ left: calculateLeftPosition(idx) }}
                                  >
                                    {editMode ? (
                                      <div className="flex gap-1">
                                        <input
                                          type="text"
                                          value={getRemarkForField(p.id, baseField)}
                                          onChange={(e) => handleRemarkChange(p.id, baseField, e.target.value)}
                                          className="input input-xs w-full bg-white"
                                          placeholder="Add remark..."
                                        />
                                      </div>
                                    ) : (
                                      <div className="text-xs text-gray-500 truncate">
                                        {getRemarkForField(p.id, baseField)}
                                      </div>
                                    )}
                                  </td>
                                );
                              } else {
                                return (
                                  <td 
                                    key={field} 
                                    className="sticky bg-inherit z-10 min-w-[150px]"
                                    style={{ left: calculateLeftPosition(idx) }}
                                  >
                                    <div className="truncate">
                                      {editMode && selectedRows.includes(p.id) ? (
                                        <input
                                          type="text"
                                          value={modified[p.id]?.[field as keyof Payroll] ?? p[field as keyof Payroll] ?? ''}
                                          onChange={(e) => handleFieldChange(p.id, field as keyof Payroll, e.target.value)}
                                          className="input input-sm w-full bg-white"
                                        />
                                      ) : (
                                        <span>{p[field as keyof Payroll]}</span>
                                      )}
                                    </div>
                                  </td>
                                );
                              }
                            })}
                            
                            {getAllColumns().map((field) => {
                              if (pinnedColumns.includes(field)) return null;
                              
                              if (field.endsWith('_remark')) {
                                const baseField = field.replace('_remark', '') as EditableField;
                                return (
                                  <td key={field} className="min-w-[150px]">
                                    {editMode ? (
                                      <div className="flex gap-1">
                                        <input
                                          type="text"
                                          value={getRemarkForField(p.id, baseField)}
                                          onChange={(e) => handleRemarkChange(p.id, baseField, e.target.value)}
                                          className="input input-xs w-full bg-white"
                                          placeholder="Add remark..."
                                        />
                                      </div>
                                    ) : (
                                      <div className="text-xs text-gray-500 truncate">
                                        {getRemarkForField(p.id, baseField)}
                                      </div>
                                    )}
                                  </td>
                                );
                              } else {
                                return (
                                  <td key={field} className="min-w-[150px]">
                                    <div className="truncate">
                                      {editMode && selectedRows.includes(p.id) ? (
                                        <input
                                          type="text"
                                         value={
  field.endsWith('_remark')
    ? getRemarkForField(p.id, field.replace('_remark', ''))
    : modified[p.id]?.[field as keyof Payroll] ?? p[field as keyof Payroll] ?? ''
}

                                        onChange={(e) =>
  !field.endsWith('_remark') &&
  handleFieldChange(p.id, field as keyof Payroll, e.target.value)
}

                                          className="input input-sm w-full bg-white"
                                        />
                                      ) : (
                                        <span>
  {field.endsWith('_remark')
    ? getRemarkForField(p.id, field.replace('_remark', ''))
    : p[field as keyof Payroll]}
</span>

                                      )}
                                    </div>
                                  </td>
                                );
                              }
                            })}
                            
                            <td className="min-w-[150px]">
                              <div className="flex flex-wrap gap-1">
                                {apiResponse.dependents
                                  .filter((d: Dependent) => d.employee_id === p.employee_id)
                                  .map((d: Dependent) => (
                                    <div 
                                      key={d.id} 
                                      className="badge badge-info badge-sm tooltip" 
                                      data-tip={`${d.full_name}, ${d.relationship}, ${d.birth_date}, ${d.child_relief_percent}%`}
                                    >
                                      {d.full_name.split(' ')[0]} ({d.child_relief_percent}%)
                                    </div>
                                  ))}
                              </div>
                            </td>
                            
                            <td className="min-w-[100px]">
                              <button
                                className={`btn btn-xs btn-success ${modified[p.id] || (remarks[p.id] && remarks[p.id].length > 0) ? '' : 'btn-disabled opacity-50'}`}
                                disabled={!modified[p.id] && (!remarks[p.id] || remarks[p.id].length === 0)}
                                onClick={() => saveChanges(p.id)}
                              >
                                Save
                              </button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>

                  
                </table>

                
              )}
              
            </Droppable>
          </DragDropContext>
        </div>

        
      )}

      <div className="flex justify-between items-center mt-4">
  <div className="text-sm">
    Showing page {page} of {Math.ceil(apiResponse.total / limit)} ({apiResponse.total} records)
  </div>
  <div className="flex gap-4 items-center">
    <div className="flex gap-2">
      <button
        className="btn btn-sm"
        onClick={() => setPage(prev => Math.max(1, prev - 1))}
        disabled={page === 1}
      >
        Previous
      </button>
      <button
        className="btn btn-sm"
        onClick={() => setPage(prev => prev + 1)}
        disabled={(page * limit) >= apiResponse.total}
      >
        Next
      </button>
    </div>
    <div className="flex items-center gap-2">
      <label className="text-sm">Rows per page:</label>
      <select
        className="select select-sm"
        value={limit}
        onChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);
        }}
      >
        {[10, 20, 50, 100].map(size => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>
    </div>
  </div>
</div>

    </div>
    
  );
}