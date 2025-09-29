'use client';

import { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

/* ================== Types ================== */
export interface Allowance {
  id: number;
  name: string;
  max_limit: string;
  description?: string;
  prorate_by_percentage?: boolean;
}

export interface PayrollConfigAllowanceRow {
  id?: number;
  payroll_config_id?: number;
  allowance_id?: number;
  is_default?: number;     // 0/1
  amount?: number;
  percentage?: number;
  company_id?: number;
  department_id?: number;
  branch_id?: number;
  remark?: string;
  allowance_name?: string;
  payroll_config_name?: string;
  company_name?: string;
  department_name?: string;
  cycle_start_month?: string | null;
  cycle_end_month?: string | null;
}

type Company = { id: number; name: string };
type Department = {
  id: number;
  department_name: string;
  company_id: number;
  company_name: string;
};

interface Props {
  initialData?: Partial<PayrollConfigAllowanceRow>;
  mode: 'edit' | 'add';
  onSave: (data: Partial<PayrollConfigAllowanceRow>) => Promise<void> | void;
  onCancel: () => void;
  configs: any[];
  companies: Company[];        // built from departments (unique company_id)
  departments: Department[];   // includes company_id & company_name
}

/* ================== Helpers ================== */
const toNum = (v: any, fb = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
};
const fmtRM = (v: any) => `RM ${toNum(v).toFixed(2)}`;
const monthISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;

/* Default form baseline */
const defaultData: Partial<PayrollConfigAllowanceRow> = {
  payroll_config_id: undefined,
  allowance_id: undefined,
  is_default: 1,
  amount: undefined,
  percentage: undefined,
  company_id: undefined,
  department_id: undefined,
  cycle_start_month: null,
  cycle_end_month: null,
  remark: '',
};

export default function PayrollConfigAllowanceForm({
  initialData = {},
  mode,
  onSave,
  onCancel,
  configs,
  companies,
  departments,
}: Props) {
  // sanitize incoming amount/percentage (strings -> numbers)
  const cleanedInitial = useMemo(
    () => ({
      ...initialData,
      amount:
        typeof initialData?.amount === 'string'
          ? parseFloat(initialData.amount as any)
          : initialData?.amount,
      percentage:
        typeof initialData?.percentage === 'string'
          ? parseFloat(initialData.percentage as any)
          : initialData?.percentage,
    }),
    [initialData]
  );

  /* Dates (month pickers) */
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const d = cleanedInitial?.cycle_start_month ? new Date(cleanedInitial.cycle_start_month) : null;
    return d && !isNaN(d.getTime()) ? d : null;
  });
  const [endDate, setEndDate] = useState<Date | null>(() => {
    const d = cleanedInitial?.cycle_end_month ? new Date(cleanedInitial.cycle_end_month) : null;
    return d && !isNaN(d.getTime()) ? d : null;
  });

  /* Form state */
  const [form, setForm] = useState<Partial<PayrollConfigAllowanceRow>>({
    ...defaultData,
    ...cleanedInitial,
  });

  /* Allowances + selected */
  const [allowances, setAllowances] = useState<Allowance[]>([]);
  const [selectedAllowance, setSelectedAllowance] = useState<Allowance | null>(null);

  /* UI state */
  const [fieldError, setFieldError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  /* Fetch allowances */
  useEffect(() => {
    let alive = true;
    fetch(`${API_BASE_URL}/api/master-data/allowances`)
      .then((r) => r.json())
      .then((data: Allowance[]) => {
        if (!alive) return;
        setAllowances(data || []);
      })
      .catch(() => {
        toast.error('Failed to load allowances');
      });
    return () => {
      alive = false;
    };
  }, []);

  /* Keep selectedAllowance in sync */
  useEffect(() => {
    if (!allowances?.length) return;
    if (form.allowance_id) {
      const sel = allowances.find((a) => a.id === form.allowance_id) || null;
      setSelectedAllowance(sel);
    } else {
      setSelectedAllowance(null);
    }
  }, [allowances, form.allowance_id]);

  /* EDIT mode: if department_id exists but company_id is missing, derive company_id from department */
  useEffect(() => {
    if (mode !== 'edit') return;
    if (form.department_id && !form.company_id) {
      const d = departments.find((x) => Number(x.id) === Number(form.department_id));
      if (d?.company_id) {
        setForm((p) => ({ ...p, company_id: Number(d.company_id) }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, form.department_id, departments]);

  /* Company options (already unique) */
  const companyOptions = useMemo(
    () =>
      (companies || [])
        .map((c) => ({ id: Number(c.id), label: c.name ?? `Company #${c.id}` }))
        .filter((x) => Number.isFinite(x.id)),
    [companies]
  );

  /* All departments (carry company_id for filtering) */
  const departmentOptionsAll = useMemo(
    () =>
      (departments || [])
        .map((d) => ({
          id: Number(d.id),
          label: d.department_name ?? `Department #${d.id}`,
          company_id: Number(d.company_id),
        }))
        .filter((x) => Number.isFinite(x.id)),
    [departments]
  );

  /* Filtered departments by selected company */
  const filteredDeptOptions = useMemo(() => {
    if (!form.company_id) return [];
    return departmentOptionsAll
      .filter((d) => d.company_id === Number(form.company_id))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [departmentOptionsAll, form.company_id]);

  /* Date handlers (keep range sane) */
  const handleStartDate = (d: Date | null) => {
    setStartDate(d);
    setForm((p) => ({ ...p, cycle_start_month: d ? monthISO(d) : null }));

    if (endDate && d && endDate < d) {
      setEndDate(d);
      setForm((p) => ({ ...p, cycle_end_month: monthISO(d) }));
    }
  };
  const handleEndDate = (d: Date | null) => {
    setEndDate(d);
    setForm((p) => ({ ...p, cycle_end_month: d ? monthISO(d) : null }));
  };

  /* Validation helpers */
  const validateFixedAmount = (amt: number, maxLimit: number) => {
    if (!(amt > 0)) return 'Amount must be greater than 0';
    if (maxLimit > 0 && amt > maxLimit) return `Amount cannot exceed ${fmtRM(maxLimit)}`;
    return '';
  };
  const validatePercentage = (pct: number) => {
    if (!Number.isFinite(pct)) return 'Please enter a valid percentage';
    if (pct < 0 || pct > 100) return 'Percentage must be between 0 and 100';
    return '';
  };

  /* Field change */
  const onField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let parsed: any = value === '' ? undefined : value;
    let next = { ...form };

    if (name === 'is_default') {
      parsed = parseInt(value, 10);
      if (!Number.isFinite(parsed)) parsed = 0;
      next.is_default = parsed;
    } else if (name.endsWith('_id')) {
      parsed = parseInt(value, 10);
      if (!Number.isFinite(parsed)) parsed = undefined;
      (next as any)[name] = parsed;

      // If company changes, clear department selection (cascading)
      if (name === 'company_id') {
        next.department_id = undefined;
      }
    } else if (name === 'amount') {
      parsed = parseFloat(value);
      (next as any)[name] = Number.isFinite(parsed) ? parsed : undefined;

      if (selectedAllowance && !selectedAllowance.prorate_by_percentage) {
        const err = validateFixedAmount(
          toNum(parsed),
          toNum(selectedAllowance.max_limit)
        );
        setFieldError(err);
      } else {
        setFieldError('');
      }
    } else if (name === 'percentage') {
      parsed = parseFloat(value);
      (next as any)[name] = Number.isFinite(parsed) ? parsed : undefined;

      const err = validatePercentage(toNum(parsed, NaN));
      setFieldError(err || '');
    } else {
      (next as any)[name] = parsed;
    }

    // When allowance changes → preset fields
    if (name === 'allowance_id') {
      const oldId = form.allowance_id;
      const sel = allowances.find((a) => a.id === parsed);
      setSelectedAllowance(sel || null);

      if (sel && (mode === 'add' || parsed !== oldId)) {
        if (sel.prorate_by_percentage) {
          next.amount = undefined;
          next.percentage = undefined;
          setFieldError('');
        } else {
          next.amount = toNum(sel.max_limit);
          next.percentage = undefined;
          setFieldError('');
        }
      }
    }

    // If prorated and we have percentage → compute amount
    if (
      selectedAllowance?.prorate_by_percentage &&
      typeof next.percentage === 'number' &&
      selectedAllowance.max_limit
    ) {
      const base = toNum(selectedAllowance.max_limit);
      next.amount = Number(((next.percentage / 100) * base).toFixed(2));
    }

    setForm(next);
  };


// Pick the active allowance from either the selected one or by ID lookup
const activeAllowance = useMemo(() => {
  if (selectedAllowance) return selectedAllowance;
  if (form.allowance_id && allowances.length) {
    return allowances.find(a => a.id === form.allowance_id) || null;
  }
  return null;
}, [selectedAllowance, allowances, form.allowance_id]);

// Use this flag everywhere you decide between % vs Amount
const isProrated = !!activeAllowance?.prorate_by_percentage;

// When editing a prorated allowance and we already have an amount, derive the percentage.
useEffect(() => {
  if (mode !== 'edit') return;
  if (!isProrated) return;

  const base = Number(activeAllowance?.max_limit);
  const amt  = Number(form.amount);

  if (Number.isFinite(base) && base > 0 && Number.isFinite(amt)) {
    const pct = (amt / base) * 100;
    // avoid loops due to float jitter
    if (!Number.isFinite(Number(form.percentage)) || Math.abs((form.percentage ?? 0) - pct) > 0.01) {
      setForm(prev => ({ ...prev, percentage: Number(pct.toFixed(2)) }));
    }
  }
}, [mode, isProrated, activeAllowance?.max_limit, form.amount]); 


  /* Submit */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.payroll_config_id || !form.allowance_id) {
      toast.error('Please select Payroll Config and Allowance.');
      return;
    }
    // Enforce company -> department flow
    if (form.department_id && !form.company_id) {
      toast.error('Please select Company first.');
      return;
    }

    if (selectedAllowance?.prorate_by_percentage) {
      const err = validatePercentage(toNum(form.percentage, NaN));
      if (err) {
        toast.error(err);
        return;
      }
      if (!Number.isFinite(form.amount as number)) {
        toast.error('Calculated amount is invalid.');
        return;
      }
    } else {
      const amt = toNum(form.amount, NaN);
      if (!Number.isFinite(amt)) {
        toast.error('Please enter a valid amount.');
        return;
      }
      const err = validateFixedAmount(amt, toNum(selectedAllowance?.max_limit));
      if (err) {
        toast.error(err);
        return;
      }
    }

    try {
      setSubmitting(true);
      const payload: Partial<PayrollConfigAllowanceRow> = {
        ...form,
        // Only send percentage if the allowance is prorated
        percentage: selectedAllowance?.prorate_by_percentage ? form.percentage : undefined,
        ...(mode === 'edit' && initialData?.id ? { id: initialData.id } : {}),
      };
      await onSave(payload);
    } finally {
      setSubmitting(false);
    }
  };

  /* Missing-value guards (for edit mode when options change) */
  const companyValueMissing =
    !!form.company_id && !companyOptions.some((o) => o.id === form.company_id);
  const currentDept = form.department_id
    ? departments.find((d) => Number(d.id) === Number(form.department_id))
    : undefined;
  const deptInFiltered = form.department_id
    ? filteredDeptOptions.some((d) => d.id === form.department_id)
    : true;

return (
  <form onSubmit={onSubmit} className="flex flex-col gap-6">
    {/* Mapping details */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <label className="label">
          <span className="label-text text-black font-medium">Payroll Config *</span>
        </label>
        <select
          name="payroll_config_id"
          className="select select-bordered w-full text-black"
          value={form.payroll_config_id ?? ''}
          onChange={onField}
          required
        >
          <option value="">-- Select --</option>
          {configs.map((cfg: any) => (
            <option key={cfg.id} value={cfg.id}>
              {(cfg.pay_interval ?? cfg.name ?? `Config #${cfg.id}`)} (ID {cfg.id})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">
          <span className="label-text text-black font-medium">Allowance *</span>
        </label>
        <select
          name="allowance_id"
          className="select select-bordered w-full text-black"
          value={form.allowance_id ?? ''}
          onChange={onField}
          required
        >
          <option value="">-- Select --</option>
          {allowances.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>
    </div>

    {/* Allowance info */}
    {selectedAllowance && (
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">Allowance Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600">Name</div>
            <div className="font-medium">{selectedAllowance.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Maximum Limit</div>
            <div className="font-medium text-green-700">{fmtRM(selectedAllowance.max_limit)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Prorated by %</div>
            <div className="font-medium">{selectedAllowance.prorate_by_percentage ? 'Yes' : 'No'}</div>
          </div>
          {selectedAllowance.description && (
            <div className="md:col-span-3">
              <div className="text-sm text-gray-600">Description</div>
              <div className="text-sm">{selectedAllowance.description}</div>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Amount / Percentage + Calculated preview */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left column: percentage or amount */}
      <div className={isProrated ? '' : 'lg:col-span-2'}>
        {isProrated ? (
          <>
            <label className="label">
              <span className="label-text text-black font-medium">
                Percentage (%) *
                {selectedAllowance && (
                  <span className="text-xs text-gray-500 ml-2">
                    Base: {fmtRM(selectedAllowance.max_limit)}
                  </span>
                )}
              </span>
            </label>
            <input
              type="number"
              name="percentage"
              step="0.01"
              min={0}
              max={100}
              className={`input input-bordered w-full text-black ${fieldError ? 'border-red-500' : ''}`}
              value={form.percentage ?? ''}
              onChange={onField}
              placeholder="Enter percentage (0–100)"
              required
            />
            {fieldError && <p className="text-red-500 text-xs mt-1">{fieldError}</p>}
          </>
        ) : (
          <>
            <label className="label">
              <span className="label-text text-black font-medium">
                Amount (RM) *
                {selectedAllowance && (
                  <span className="text-xs text-gray-500 ml-2">
                    Max: {fmtRM(selectedAllowance.max_limit)}
                  </span>
                )}
              </span>
            </label>
            <input
              type="number"
              name="amount"
              step="0.01"
              min={0}
              className={`input input-bordered w-full text-black ${fieldError ? 'border-red-500' : ''}`}
              value={form.amount ?? ''}
              onChange={onField}
              placeholder={
                selectedAllowance
                  ? `Enter amount (≤ ${fmtRM(selectedAllowance.max_limit)})`
                  : 'Select an allowance first'
              }
              disabled={!selectedAllowance}
              required
            />
            {fieldError && <p className="text-red-500 text-xs mt-1">{fieldError}</p>}
          </>
        )}
      </div>

      {/* Right column: calculated preview only when prorated */}
      {isProrated && (
        <div>
          <label className="label">
            <span className="label-text text-black font-medium">Calculated Allowance Amount</span>
          </label>
          <div className="p-3 border rounded bg-gray-50 font-semibold">
            {Number.isFinite(form.amount as number)
              ? fmtRM(form.amount)
              : 'Enter percentage to calculate'}
          </div>
        </div>
      )}
    </div>

    {/* Scope (cascading) */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Company */}
      <div>
        <label className="label">
          <span className="label-text text-black font-medium">Company</span>
        </label>
        <select
          name="company_id"
          className="select select-bordered w-full text-black"
          value={form.company_id ?? ''}
          onChange={onField}
        >
          <option value="">-- None --</option>
          {companyValueMissing && form.company_id && (
            <option value={form.company_id}>
              {initialData?.company_name || `Company #${form.company_id}`}
            </option>
          )}
          {companyOptions.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Department (filtered by company) */}
      <div>
        <label className="label">
          <span className="label-text text-black font-medium">Department</span>
        </label>
        <select
          name="department_id"
          className="select select-bordered w-full text-black"
          value={form.department_id ?? ''}
          onChange={onField}
          disabled={!form.company_id}
        >
          {!form.company_id ? (
            <option value="">Select company first</option>
          ) : (
            <>
              <option value="">-- None --</option>
              {filteredDeptOptions.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
              {form.department_id && !deptInFiltered && currentDept && (
                <option value={currentDept.id}>{currentDept.department_name}</option>
              )}
            </>
          )}
        </select>
      </div>
    </div>

    {/* Effective Period */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Start Month</label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDate}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          className="input input-bordered w-full text-gray-800 bg-white h-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholderText="Select start month"
          isClearable
          maxDate={endDate ?? undefined}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">End Month</label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDate}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          className="input input-bordered w-full text-gray-800 bg-white h-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholderText="Select end month"
          isClearable
          minDate={startDate ?? undefined}
        />
      </div>
    </div>

    {/* Remark */}
    <div>
      <label className="label">
        <span className="label-text text-black font-medium">Remark</span>
      </label>
      <textarea
        name="remark"
        className="textarea textarea-bordered w-full text-black"
        placeholder="Optional remark for this mapping"
        value={form.remark ?? ''}
        onChange={onField}
        rows={3}
      />
    </div>

    {/* Actions */}
    <div className="sticky bottom-0 bg-white pt-4 border-t -mx-6 px-6 flex justify-end gap-3">
      <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
        Cancel
      </button>
      <button
        type="submit"
        className="btn bg-blue-600 text-white hover:bg-blue-700"
        disabled={
          submitting ||
          !!fieldError ||
          !selectedAllowance ||
          (isProrated
            ? !Number.isFinite(form.percentage as number)
            : !Number.isFinite(form.amount as number))
        }
      >
        {submitting ? (
          <>
            <span className="loading loading-spinner loading-xs mr-2" /> Saving…
          </>
        ) : (
          mode === 'edit' ? 'Update' : 'Add'
        )}
      </button>
    </div>
  </form>
);

}
