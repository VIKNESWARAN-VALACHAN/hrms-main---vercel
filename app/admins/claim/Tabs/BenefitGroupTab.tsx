'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '@/app/config';

/** ===============================
 * Types
 * =============================== */
interface BenefitGroup {
  id: number;
  name: string;
  description: string;
  is_active: number;      // 1 | 0
  is_recurring?: number;  // 1 | 0 (optional)
  created_at?: string;
  updated_at?: string;
  benefit_count?: number;
  assigned_count?: number;

  // optional if your API provides company context on groups
  company_id?: number;
  company_name?: string;
}

interface BenefitGroupItem {
  id: number;
  group_id: number;
  benefit_type_id: number;
  benefit_type_name: string;
  amount: number;
  frequency: string;
  start_date: string | null;
  end_date: string | null;
  is_active: number;
}

interface EmployeeWithMeta {
  id: number;
  name: string;
  company_id?: number | null;
  company_name?: string | null;
  department_id?: number | null;
  department_name?: string | null;
  assigned?: number; // 0/1
  assigned_at?: string | null;
}

interface BenefitTypeOption {
  id: number;
  name: string;
}

interface Company {
  id: number;
  name: string;
}

interface ApprovalConfig {
  id: number;
  module: string;
  company_id: number;
  final_level: number;
}

/** ======================
 * Constants & Utils
 * ====================== */
const PAGE_SIZE = 10;
const APPROVAL_MODULE = 'benefit_group';

const approvalLevelDescription = (level: number) => {
  const map: Record<number, string> = {
    1: 'Level 1 → HR',
    2: 'Level 1 → Manager → HR',
    3: 'Level 1 → Superior → HR',
    4: 'Level 1 → Superior → Manager → HR',
  };
  return map[level] || 'Unknown';
};

function formatDateTime(value?: string | null) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

// relaxed typing & generic Event listeners (fixes TS overload errors)
function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const onEvent = (evt: Event) => {
      const target = evt.target as Node | null;
      if (!ref.current || (target && ref.current.contains(target))) return;
      handler();
    };
    document.addEventListener('mousedown', onEvent as EventListener);
    document.addEventListener('touchstart', onEvent as EventListener);
    return () => {
      document.removeEventListener('mousedown', onEvent as EventListener);
      document.removeEventListener('touchstart', onEvent as EventListener);
    };
  }, [ref, handler]);
}

/** =================
 * Confirm Dialog UI
 * ================= */
type ConfirmState = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => Promise<void> | void;
};

function ConfirmDialog({
  state,
  setState,
  z = 80,
}: {
  state: ConfirmState;
  setState: React.Dispatch<React.SetStateAction<ConfirmState>>;
  z?: number;
}) {
  const onCancel = () => setState(s => ({ ...s, open: false }));
  const onConfirm = async () => {
    try {
      await state.onConfirm?.();
    } finally {
      setState(s => ({ ...s, open: false }));
    }
  };

  if (!state.open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: z }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{state.title || 'Confirm'}</h3>
        </div>
        <div className="px-6 py-5">
          <p className="text-gray-700">{state.message || 'Are you sure?'}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50" onClick={onCancel}>
            {state.cancelText || 'Cancel'}
          </button>
          <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={onConfirm}>
            {state.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

/** ==========================
 * Floating Action Menu
 * ========================== */
type ActionMenuState = {
  open: boolean;
  group?: BenefitGroup | null;
  x?: number;
  y?: number;
};
function ActionMenu({
  state,
  onClose,
  onView,
  onAddBenefit,
  onAssign,
  onApprovalFlow,
  onEdit,
  onDelete,
}: {
  state: ActionMenuState;
  onClose: () => void;
  onView: (g: BenefitGroup) => void;
  onAddBenefit: (g: BenefitGroup) => void;
  onAssign: (g: BenefitGroup) => void;
  onApprovalFlow: (g: BenefitGroup) => void;
  onEdit: (g: BenefitGroup) => void;
  onDelete: (g: BenefitGroup) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref as React.RefObject<HTMLElement | null>, onClose);

  if (!state.open || !state.group) return null;

  const style: React.CSSProperties = {
    position: 'fixed',
    top: (state.y || 0) + 8,
    left: (state.x || 0) - 200,
    zIndex: 90,
    minWidth: 220,
  };

  return (
    <div style={style} className="shadow-xl">
      <div ref={ref} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <ul className="menu p-2">
          <li><button className="justify-start" onClick={() => { onClose(); onView(state.group!); }}>View Details</button></li>
          <li><button className="justify-start" onClick={() => { onClose(); onAddBenefit(state.group!); }}>Add Benefit</button></li>
          <li><button className="justify-start" onClick={() => { onClose(); onAssign(state.group!); }}>Assign to Employees</button></li>
          <li><button className="justify-start" onClick={() => { onClose(); onApprovalFlow(state.group!); }}>Approval Flow</button></li>
          <li><button className="justify-start" onClick={() => { onClose(); onEdit(state.group!); }}>Edit Group</button></li>
          <li><button className="justify-start text-red-600" onClick={() => { onClose(); onDelete(state.group!); }}>Delete</button></li>
        </ul>
      </div>
    </div>
  );
}

/** ==============
 * Main Component
 * ============== */
export default function BenefitGroupTab() {
  /** ======== State ======== */
  const [rows, setRows] = useState<BenefitGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Menu and dialogs
  const [actionMenu, setActionMenu] = useState<ActionMenuState>({ open: false });
  const closeActionMenu = () => setActionMenu({ open: false });

  const [confirm, setConfirm] = useState<ConfirmState>({ open: false });

  // Modals
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showBenefitModal, setShowBenefitModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // Selected group (for details/assign/approval)
  const [selectedGroup, setSelectedGroup] = useState<BenefitGroup | null>(null);

  // Data for details
  const [groupBenefits, setGroupBenefits] = useState<BenefitGroupItem[]>([]);
  const [assignedEmployees, setAssignedEmployees] = useState<EmployeeWithMeta[]>([]);

  // Assign modal employee list with "assigned" flag
  const [employeesForAssign, setEmployeesForAssign] = useState<EmployeeWithMeta[]>([]);

  // Forms
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    is_active: '1',
    is_recurring: '0',
  });

  const [benefitForm, setBenefitForm] = useState({
    group_id: '',
    benefit_type_id: '',
    amount: '0.00',
    frequency: 'Yearly',
    start_date: '',
    end_date: '',
    is_active: '1',
  });

  const [assignForm, setAssignForm] = useState({
    group_id: '',
    employee_ids: [] as string[],
  });

  // Approval flow modal state
  const [companies, setCompanies] = useState<Company[]>([]);
  const [approvalCompanyId, setApprovalCompanyId] = useState<string>('');
  const [approvalLevel, setApprovalLevel] = useState<number>(1);
  const [existingApproval, setExistingApproval] = useState<ApprovalConfig | null>(null);

  // Dropdown options
  const [benefitTypes, setBenefitTypes] = useState<BenefitTypeOption[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // NEW: Approval config(s) shown inside View Details
  const [approvalConfigsDetails, setApprovalConfigsDetails] = useState<ApprovalConfig[]>([]);

  /** ======== Fetchers ======== */
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/benefit-groups`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load benefit groups');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const benefitTypesRes = await fetch(`${API_BASE_URL}/api/benefit-types`).then(r => r.json());
      setBenefitTypes(Array.isArray(benefitTypesRes) ? benefitTypesRes : []);
    } catch {
      toast.error('Failed to fetch dropdown data');
    }
  };

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('hrms_token');
      const res = await fetch(`${API_BASE_URL}/api/admin/companies`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = await res.json();
      const result = Array.isArray(data) ? data : data.data ?? [];
      const formatted = result.map((c: any) => ({
        id: c.id ?? c.company_id,
        name: c.name ?? c.company_name ?? `Company ${c.id || c.company_id}`,
      }));
      setCompanies(formatted);
    } catch (err) {
      console.error('Error fetching companies:', err);
      toast.error('Unable to load companies');
    }
  };

  // Details (items + assigned employees)
  const fetchGroupDetails = async (groupId: number) => {
    try {
      const [detailRes, assignedRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/benefit-groups/${groupId}`),
        fetch(`${API_BASE_URL}/api/benefit-groups/${groupId}/assigned-employees`),
      ]);
      if (!detailRes.ok) throw new Error('Failed');
      const detail = await detailRes.json();

      // If your backend returns company info on group:
      // Merge into selectedGroup if present
      setSelectedGroup(prev =>
        prev && prev.id === groupId
          ? {
              ...prev,
              benefit_count: Array.isArray(detail.items) ? detail.items.length : prev.benefit_count,
              assigned_count: Array.isArray(detail.employees) ? detail.employees.length : prev.assigned_count,
              company_id: detail.company_id ?? prev.company_id,
              company_name: detail.company_name ?? prev.company_name,
            }
          : prev
      );

      setGroupBenefits(Array.isArray(detail.items) ? detail.items : []);

      if (assignedRes.ok) {
        const data = await assignedRes.json();
        setAssignedEmployees(Array.isArray(data) ? data : []);
      } else {
        setAssignedEmployees([]);
      }

      // refresh list counts too
      await fetchGroups();
    } catch {
      toast.error('Failed to load group details');
      setGroupBenefits([]);
      setAssignedEmployees([]);
    }
  };

  // For Assign modal: show all employees with an "assigned" flag
  const fetchEmployeesWithAssignment = async (groupId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/benefit-groups/${groupId}/employees-with-assignment`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const list: EmployeeWithMeta[] = Array.isArray(data) ? data : [];
      setEmployeesForAssign(list);
      // pre-check the already assigned ones
      setAssignForm(prev => ({
        ...prev,
        employee_ids: list.filter(e => e.assigned === 1).map(e => String(e.id)),
      }));
    } catch {
      toast.error('Failed to load employees');
      setEmployeesForAssign([]);
    }
  };

  // Approval: fetch existing config for module+company
  const fetchApprovalConfig = async (companyId: string) => {
    if (!companyId) {
      setExistingApproval(null);
      setApprovalLevel(1);
      return;
    }
    try {
      const url = `${API_BASE_URL}/api/approval-config?module=${encodeURIComponent(APPROVAL_MODULE)}&company_id=${encodeURIComponent(companyId)}`;
      const res = await fetch(url);
      const data = await res.json();
      const list: ApprovalConfig[] = Array.isArray(data) ? data : [];
      const found = list[0] || null;
      setExistingApproval(found);
      setApprovalLevel(found ? found.final_level : 1);
    } catch (err) {
      console.error('Failed to load approval config', err);
      toast.error('Failed to load approval config');
      setExistingApproval(null);
      setApprovalLevel(1);
    }
  };

  // NEW: fetch approval configs for the View Details panel
  const fetchApprovalConfigsForDetails = async (group: BenefitGroup) => {
    try {
      let url = `${API_BASE_URL}/api/approval-config?module=${encodeURIComponent(APPROVAL_MODULE)}`;
      if (group.company_id) {
        url += `&company_id=${encodeURIComponent(String(group.company_id))}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      const list: ApprovalConfig[] = Array.isArray(data) ? data : [];
      setApprovalConfigsDetails(list);
    } catch (err) {
      console.error('Failed to load approval configs for details', err);
      setApprovalConfigsDetails([]);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchDropdowns();
    fetchCompanies();
  }, []);

  /** ======== Filtering & Pagination ======== */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(r => {
      const matchesSearch = !q || r.name.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && r.is_active === 1) ||
        (statusFilter === 'Inactive' && r.is_active === 0);
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  const totalRecords = rows.length;
  const filteredCount = filtered.length;
  const isFiltered = search.trim() !== '' || statusFilter !== 'All';

  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const pageItems = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  const startIndex = filteredCount ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endIndex = Math.min(page * PAGE_SIZE, filteredCount);

  /** ======== Handlers (open/close) ======== */
  const openCreateGroup = () => {
    closeActionMenu();
    setEditingId(null);
    setGroupForm({ name: '', description: '', is_active: '1', is_recurring: '0' });
    setShowGroupModal(true);
  };

  const openEditGroup = (group: BenefitGroup) => {
    closeActionMenu();
    setEditingId(group.id);
    setGroupForm({
      name: group.name,
      description: group.description || '',
      is_active: String(group.is_active ?? 1),
      is_recurring: String(group.is_recurring ?? 0),
    });
    setShowGroupModal(true);
  };

  const openAddBenefit = (group: BenefitGroup) => {
    closeActionMenu();
    setSelectedGroup(group);
    setBenefitForm({
      group_id: String(group.id),
      benefit_type_id: '',
      amount: '0.00',
      frequency: 'Yearly',
      start_date: '',
      end_date: '',
      is_active: '1',
    });
    setShowBenefitModal(true);
  };

  const openViewDetails = async (group: BenefitGroup) => {
    closeActionMenu();
    setSelectedGroup(group);
    await Promise.all([
      fetchGroupDetails(group.id),
      fetchApprovalConfigsForDetails(group),
    ]);
    setShowDetailsModal(true);
  };

  const openAssignGroup = async (group: BenefitGroup) => {
    closeActionMenu();
    setSelectedGroup(group);
    setAssignForm({
      group_id: String(group.id),
      employee_ids: [],
    });
    await fetchEmployeesWithAssignment(group.id);
    setShowAssignModal(true);
  };

  // Approval Flow modal
  const openApprovalFlow = async (group: BenefitGroup) => {
    closeActionMenu();
    setSelectedGroup(group);
    // reset state
    setApprovalCompanyId('');
    setExistingApproval(null);
    setApprovalLevel(1);
    setShowApprovalModal(true);
  };

  /** ======== CRUD ======== */
  const saveGroup = async () => {
    if (!groupForm.name.trim()) {
      toast.error('Group name is required');
      return;
    }

    try {
      const url = editingId ? `${API_BASE_URL}/api/benefit-groups/${editingId}` : `${API_BASE_URL}/api/benefit-groups`;
      const method = editingId ? 'PUT' : 'POST';

      const payload = {
        name: groupForm.name.trim(),
        description: groupForm.description.trim(),
        is_active: parseInt(groupForm.is_active, 10),
        is_recurring: parseInt(groupForm.is_recurring, 10),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.message || 'Save failed');
      }

      toast.success(editingId ? 'Group updated successfully' : 'Group created successfully');
      setShowGroupModal(false);
      await fetchGroups();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save group');
    }
  };

  const deleteGroup = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/benefit-groups/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.message || 'Delete failed');
      }
      toast.success('Group deleted');
      await fetchGroups();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete group');
    }
  };

  const askDeleteGroup = (group: BenefitGroup) => {
    setConfirm({
      open: true,
      title: 'Delete Benefit Group',
      message:
        'This will delete the group, its items, and all employee assignments created via this group. This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        await deleteGroup(group.id);
      },
    });
  };

  const saveBenefit = async () => {
    if (!benefitForm.benefit_type_id || !benefitForm.amount) {
      toast.error('Benefit Type and Amount are required');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/benefit-group-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_id: parseInt(benefitForm.group_id, 10),
          benefit_type_id: parseInt(benefitForm.benefit_type_id, 10),
          amount: parseFloat(benefitForm.amount),
          frequency: benefitForm.frequency,
          start_date: benefitForm.start_date || null,
          end_date: benefitForm.end_date || null,
          is_active: parseInt(benefitForm.is_active, 10),
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.message || 'Save failed');
      }

      toast.success('Benefit added to group');
      setShowBenefitModal(false);
      if (selectedGroup) await fetchGroupDetails(selectedGroup.id);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add benefit');
    }
  };

  const assignGroup = async () => {
    if (assignForm.employee_ids.length === 0) {
      toast.error('Select at least one employee');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/benefit-groups/${assignForm.group_id}/assign-employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_ids: assignForm.employee_ids.map(id => parseInt(id, 10)),
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.message || 'Assignment failed');
      }

      toast.success('Group assigned to employees');
      setShowAssignModal(false);
      await fetchGroups(); // refresh list counts
      if (selectedGroup) {
        await fetchGroupDetails(selectedGroup.id); // refresh details + table
        await fetchApprovalConfigsForDetails(selectedGroup); // keep details panel fresh
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign group');
    }
  };

  const removeBenefitFromGroup = async (benefitId: number) => {
    setConfirm({
      open: true,
      title: 'Remove Benefit from Group',
      message: 'This will remove the selected benefit item from the group.',
      confirmText: 'Remove',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/benefit-group-items/${benefitId}`, { method: 'DELETE' });
          if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error?.message || 'Remove failed');
          }
          toast.success('Benefit removed');
          if (selectedGroup) await fetchGroupDetails(selectedGroup.id);
        } catch (err: any) {
          toast.error(err.message || 'Failed to remove benefit');
        }
      },
    });
  };

  // Approval flow CRUD (modal)
  const saveApproval = async () => {
    if (!approvalCompanyId) {
      toast.error('Please select a company');
      return;
    }
    try {
      const method = existingApproval ? 'PUT' : 'POST';
      const url = existingApproval
        ? `${API_BASE_URL}/api/approval-config/${existingApproval.id}`
        : `${API_BASE_URL}/api/approval-config`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: APPROVAL_MODULE,
          company_id: approvalCompanyId,
          final_level: approvalLevel,
        }),
      });
      if (!res.ok) throw new Error('Failed to save approval flow');
      toast.success(existingApproval ? 'Approval flow updated' : 'Approval flow created');
      setExistingApproval(null);
      setApprovalCompanyId('');
      setApprovalLevel(1);
      setShowApprovalModal(false);

      // refresh details panel if open
      if (selectedGroup) await fetchApprovalConfigsForDetails(selectedGroup);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to save approval flow');
    }
  };

  const deleteApproval = async () => {
    if (!existingApproval) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/approval-config/${existingApproval.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete approval flow');
      toast.success('Approval flow deleted');
      setExistingApproval(null);
      setApprovalCompanyId('');
      setApprovalLevel(1);
      setShowApprovalModal(false);

      if (selectedGroup) await fetchApprovalConfigsForDetails(selectedGroup);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Delete failed');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setPage(1);
  };

  /** ======== Render ======== */
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center py-10">
          <span className="loading loading-spinner text-primary" />
          <p className="mt-2">Loading benefit groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Floating action menu */}
      <ActionMenu
        state={actionMenu}
        onClose={closeActionMenu}
        onView={openViewDetails}
        onAddBenefit={openAddBenefit}
        onAssign={openAssignGroup}
        onApprovalFlow={openApprovalFlow}
        onEdit={openEditGroup}
        onDelete={askDeleteGroup}
      />

      {/* Confirm dialog */}
      <ConfirmDialog state={confirm} setState={setConfirm} z={95} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Benefit Groups</h1>
          <p className="text-gray-600">Create and manage benefit groups and items</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={openCreateGroup}>
            + Create Group
          </button>
        </div>
      </div>

      {/* Search + Filters row */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <input
            className="input input-bordered w-full pl-10"
            placeholder="Search by group name or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button
          className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-4 py-2 rounded-md 
                     hover:bg-gray-700 hover:text-white hover:border-gray-700 transition-colors"
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          Filters
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Status</span>
              </label>
              <select
                className="select select-bordered select-sm w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button className="btn btn-sm btn-ghost text-blue-600" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Results info */}
      {filteredCount > 0 && (
        <div className="text-sm text-gray-600 mb-2">
          {isFiltered ? (
            <>
              Showing <span className="font-medium">{filteredCount}</span> of{' '}
              <span className="font-medium">{totalRecords}</span> <span className="text-gray-500">(filtered)</span>
            </>
          ) : (
            <>
              Showing <span className="font-medium">{startIndex}</span> to <span className="font-medium">{endIndex}</span> of{' '}
              <span className="font-medium">{totalRecords}</span>
            </>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th className="font-medium text-gray-700">Group Name</th>
                <th className="font-medium text-gray-700">Description</th>
                <th className="font-medium text-gray-700">Benefits</th>
                <th className="font-medium text-gray-700">Assigned</th>
                <th className="font-medium text-gray-700">Status</th>
                <th className="font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length > 0 ? (
                pageItems.map(group => (
                  <tr key={group.id}>
                    <td className="font-medium">{group.name}</td>
                    <td>{group.description}</td>
                    <td>
                      <span className="badge badge-info">
                        {group.benefit_count ?? 0} loaded
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-ghost">
                        {group.assigned_count ?? 0} employees
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${group.is_active ? 'badge-success' : 'badge-ghost'}`}>
                        {group.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                          setActionMenu({
                            open: true,
                            group,
                            x: rect.right,
                            y: rect.bottom,
                          });
                        }}
                        aria-label="Actions"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No benefit groups found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="join">
            <button className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400" disabled={page === 1} onClick={() => setPage(1)}>First</button>
            <button className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>«</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`join-item btn btn-sm border border-gray-300 ${p === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>»</button>
            <button className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400" disabled={page === totalPages} onClick={() => setPage(totalPages)}>Last</button>
          </div>
        </div>
      )}

      {/* Create/Edit Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">{editingId ? 'Edit Benefit Group' : 'Create Benefit Group'}</h3>
              </div>
              <button onClick={() => setShowGroupModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Group Name</span></label>
                <input className="input input-bordered w-full" placeholder="e.g., Executive Benefits Package" value={groupForm.name} onChange={e => setGroupForm({ ...groupForm, name: e.target.value })} />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Description</span></label>
                <textarea className="textarea textarea-bordered w-full" placeholder="Description of the benefit group..." rows={3} value={groupForm.description} onChange={e => setGroupForm({ ...groupForm, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Status</span></label>
                  <select className="select select-bordered w-full" value={groupForm.is_active} onChange={e => setGroupForm({ ...groupForm, is_active: e.target.value })}>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Recurring?</span></label>
                  <select className="select select-bordered w-full" value={groupForm.is_recurring} onChange={e => setGroupForm({ ...groupForm, is_recurring: e.target.value })}>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
              <button className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => setShowGroupModal(false)}>Cancel</button>
              <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={saveGroup}>{editingId ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Benefit Modal (above details) */}
      {showBenefitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 70 }}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">Add Benefit to {selectedGroup?.name}</h3>
              </div>
              <button onClick={() => setShowBenefitModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Benefit Type</span></label>
                  <select className="select select-bordered w-full" value={benefitForm.benefit_type_id} onChange={e => setBenefitForm({ ...benefitForm, benefit_type_id: e.target.value })}>
                    <option value="">Select Benefit Type</option>
                    {benefitTypes.map(bt => <option key={bt.id} value={bt.id}>{bt.name}</option>)}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Amount</span></label>
                  <input type="number" className="input input-bordered w-full" placeholder="0.00" value={benefitForm.amount} onChange={e => setBenefitForm({ ...benefitForm, amount: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Frequency</span></label>
                  <select className="select select-bordered w-full" value={benefitForm.frequency} onChange={e => setBenefitForm({ ...benefitForm, frequency: e.target.value })}>
                    <option value="Yearly">Yearly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Status</span></label>
                  <select className="select select-bordered w-full" value={benefitForm.is_active} onChange={e => setBenefitForm({ ...benefitForm, is_active: e.target.value })}>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Start Date</span></label>
                  <input type="date" className="input input-bordered w-full" value={benefitForm.start_date} onChange={e => setBenefitForm({ ...benefitForm, start_date: e.target.value })} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">End Date</span></label>
                  <input type="date" className="input input-bordered w-full" value={benefitForm.end_date} onChange={e => setBenefitForm({ ...benefitForm, end_date: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
              <button className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => setShowBenefitModal(false)}>Cancel</button>
              <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={saveBenefit}>Add Benefit</button>
            </div>
          </div>
        </div>
      )}

{/* Group Details Modal (responsive, fixed header/footer, scrollable body) */}
{showDetailsModal && selectedGroup && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4"
    style={{ zIndex: 60 }}
    role="dialog"
    aria-modal="true"
    onClick={() => setShowDetailsModal(false)} // click outside to close
  >
    <div
      className="relative bg-white w-full max-w-6xl mx-auto rounded-none sm:rounded-lg shadow-lg flex h-screen sm:h-[85vh]"
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
    >
      <div className="flex flex-col w-full h-full">
        {/* Header (stays visible) */}
        <div className="shrink-0 border-b px-4 sm:px-6 py-3 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedGroup.name} - Details
              </h3>
            </div>
          </div>
        </div>

        {/* Body (scrolls independently) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-8">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Benefits</div>
              <div className="text-xl font-semibold">
                {selectedGroup.benefit_count ?? groupBenefits.length}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Assigned Employees</div>
              <div className="text-xl font-semibold">
                {selectedGroup.assigned_count ?? assignedEmployees.length}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Status</div>
              <div>
                <span
                  className={`badge ${
                    selectedGroup.is_active ? 'badge-success' : 'badge-ghost'
                  }`}
                >
                  {selectedGroup.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Company</div>
              <div className="font-medium">
                {selectedGroup.company_name || '-'}
              </div>
            </div>
          </div>

          {/* Approval Flow Config */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-800">
                Approval Flow Configuration
              </h4>
              <button
                className="btn btn-xs bg-blue-600 hover:bg-blue-700 text-white border-0"
                onClick={() => openApprovalFlow(selectedGroup)}
              >
                Configure
              </button>
            </div>

            {approvalConfigsDetails.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Final Level</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvalConfigsDetails.map((cfg) => {
                      const companyName =
                        companies.find((c) => c.id === cfg.company_id)?.name ||
                        selectedGroup.company_name ||
                        `Company ${cfg.company_id}`;
                      return (
                        <tr key={cfg.id}>
                          <td>{companyName}</td>
                          <td>{cfg.final_level}</td>
                          <td>{approvalLevelDescription(cfg.final_level)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                No approval flow configured{' '}
                {selectedGroup.company_name
                  ? `for ${selectedGroup.company_name}`
                  : 'for this module'}
                . Click <span className="font-medium">Configure</span> to create
                one.
              </div>
            )}
          </div>

          {/* Benefits table */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-800">Benefits in this Group</h4>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-sm min-w-[800px]">
                <thead>
                  <tr>
                    <th>Benefit Type</th>
                    <th>Amount</th>
                    <th>Frequency</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupBenefits.length > 0 ? (
                    groupBenefits.map((benefit) => (
                      <tr key={benefit.id}>
                        <td>{benefit.benefit_type_name}</td>
                        <td>RM {Number(benefit.amount).toFixed(2)}</td>
                        <td>{benefit.frequency}</td>
                        <td>{formatDateTime(benefit.start_date)}</td>
                        <td>{formatDateTime(benefit.end_date)}</td>
                        <td>
                          <span
                            className={`badge badge-sm ${
                              benefit.is_active ? 'badge-success' : 'badge-ghost'
                            }`}
                          >
                            {benefit.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-xs btn-outline border-red-600 text-red-600 hover:bg-red-50"
                            onClick={() => removeBenefitFromGroup(benefit.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center text-gray-500 py-4"
                      >
                        No benefits added to this group yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assigned Employees table */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-800">Assigned Employees</h4>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-sm min-w-[700px]">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Department</th>
                    <th>Assigned On</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedEmployees.length > 0 ? (
                    assignedEmployees.map((emp) => (
                      <tr key={emp.id}>
                        <td>{emp.name}</td>
                        <td>{emp.company_name || '-'}</td>
                        <td>{emp.department_name || '-'}</td>
                        <td>{formatDateTime(emp.assigned_at)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center text-gray-500 py-4"
                      >
                        No employees assigned yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer (stays visible) */}
        <div className="shrink-0 border-t px-4 sm:px-6 py-3 bg-white">
          <div className="flex items-center justify-end gap-2">
            <button
              className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0"
              onClick={() => openAddBenefit(selectedGroup)}
            >
              + Add Benefit
            </button>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setShowDetailsModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


      {/* Assign Group Modal */}
      {showAssignModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 65 }}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">Assign {selectedGroup.name} to Employees</h3>
              </div>
              <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="text-sm text-gray-600">
                Select employees (already assigned are pre-checked and marked).
              </div>

              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th style={{ width: 48 }}></th>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Department</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeesForAssign.length > 0 ? (
                      employeesForAssign.map(emp => {
                        const checked = assignForm.employee_ids.includes(String(emp.id));
                        const assigned = emp.assigned === 1;
                        return (
                          <tr key={emp.id}>
                            <td>
                              <input
                                type="checkbox"
                                className="checkbox checkbox-sm"
                                checked={checked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setAssignForm(prev => ({ ...prev, employee_ids: [...prev.employee_ids, String(emp.id)] }));
                                  } else {
                                    setAssignForm(prev => ({ ...prev, employee_ids: prev.employee_ids.filter(id => id !== String(emp.id)) }));
                                  }
                                }}
                              />
                            </td>
                            <td>{emp.name}</td>
                            <td>{emp.company_name || '-'}</td>
                            <td>{emp.department_name || '-'}</td>
                            <td>
                              {assigned ? (
                                <span className="badge badge-success badge-sm">Assigned</span>
                              ) : (
                                <span className="badge badge-ghost badge-sm">Not Assigned</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center text-gray-500 py-4">No employees found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="text-sm text-gray-500">
                {assignForm.employee_ids.length} employees selected
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
              <button className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => setShowAssignModal(false)}>
                Cancel
              </button>
              <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={assignGroup}>
                Assign Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Flow Modal */}
      {showApprovalModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 85 }}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.75 10.75V3.5a.75.75 0 00-1.5 0v7.25H3.5a.75.75 0 000 1.5h5.75V17a.75.75 0 001.5 0v-4.75H17a.75.75 0 000-1.5h-6.25z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">Approval Flow — {selectedGroup.name}</h3>
              </div>
              <button onClick={() => setShowApprovalModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Module</span></label>
                  <input className="input input-bordered w-full" value={APPROVAL_MODULE} disabled />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Company</span></label>
                  <select
                    className="select select-bordered w-full"
                    value={approvalCompanyId}
                    onChange={async (e) => {
                      const v = e.target.value;
                      setApprovalCompanyId(v);
                      await fetchApprovalConfig(v);
                    }}
                  >
                    <option value="">-- Select Company --</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Approval Level</span></label>
                <select
                  className="select select-bordered w-full"
                  value={approvalLevel}
                  onChange={(e) => setApprovalLevel(parseInt(e.target.value, 10))}
                  disabled={!approvalCompanyId}
                >
                  <option value={1}>1 - Level 1 → HR</option>
                  <option value={2}>2 - Level 1 → Manager → HR</option>
                  <option value={3}>3 - Level 1 → Superior → HR</option>
                  <option value={4}>4 - Level 1 → Superior → Manager → HR</option>
                </select>
              </div>

              <p className="text-sm text-gray-500">
                <strong>Configured Flow:</strong> {approvalLevelDescription(approvalLevel)}
              </p>
            </div>

            <div className="flex justify-between items-center border-t px-6 py-4 bg-gray-50">
              {existingApproval ? (
                <button className="btn btn-error btn-outline" onClick={deleteApproval}>
                  Delete
                </button>
              ) : <span />}
              <div className="flex gap-3">
                <button className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => setShowApprovalModal(false)}>Cancel</button>
                <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={saveApproval} disabled={!approvalCompanyId}>
                  {existingApproval ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}