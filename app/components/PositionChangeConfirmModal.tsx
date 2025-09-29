
'use client';

import React, { useCallback, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X, ArrowRightLeft, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { toast } from 'react-hot-toast';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm?: (p: { effectiveDate: string }) => void;
  currentPosition?: string | null;
  currentLevel?: string | null;
  newPosition?: string | null;
  newLevel?: string | null;
  employeeId: number;
  newPositionId: number;
  apiBaseUrl?: string;
  joinedDate?: string | null;
  currentPositionStartDate?: string | null;
  promotionDraft?: {
    effectiveDate?: string;
  };
  fmt?: (dateString: string) => string;
};

export default function PositionChangeConfirmModal({
  open,
  onClose,
  onConfirm,
  currentPosition,
  currentLevel,
  newPosition,
  newLevel,
  employeeId,
  newPositionId,
  apiBaseUrl = 'http://localhost:5001',
  joinedDate,
  currentPositionStartDate,
  promotionDraft,
  fmt = (dateString) => new Date(dateString).toLocaleDateString('en-MY'),
}: Props) {
  const [pastPositions, setPastPositions] = React.useState<any[]>([]);
  const [pastPositionsLoading, setPastPositionsLoading] = React.useState(false);
  const [date, setDate] = React.useState<Date | null>(null);
  const [dateInitialized, setDateInitialized] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch past positions when modal opens
  // React.useEffect(() => {
  //   if (open) {
  //     fetchPastPositions();
  //   }
  // }, [open, employeeId]);

  const fetchPastPositions = useCallback(async () => {//async () => {
    if (!employeeId) return;
    
    try {
      setPastPositionsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/employees/${employeeId}/past-positions`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch past positions: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPastPositions(data);
      
      // Initialize date after fetching past positions
      const defaultDate = getDefaultEffectiveDate();
      setDate(defaultDate);
      setDateInitialized(true);
      setError(null);
    } catch (error) {
      console.error('Error fetching past positions:', error);
      toast.error('Failed to load past positions. Please try again.');
    } finally {
      setPastPositionsLoading(false);
    }
   }, [employeeId]); //};

   useEffect(() => {
    if (open) {
      fetchPastPositions();
    }
  }, [open, fetchPastPositions]);

  // Calculate min date (today or joined date or current position start date)
const getMinDate = React.useCallback(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dates = [today]; // Can't select dates before today
  
  if (joinedDate) {
    const jd = new Date(joinedDate);
    jd.setHours(0, 0, 0, 0);
    if (jd > today) dates.push(jd);
  }
  
  if (currentPositionStartDate) {
    const psd = new Date(currentPositionStartDate);
    psd.setHours(0, 0, 0, 0);
    if (psd > today) dates.push(psd);
  }
  
  return new Date(Math.max(...dates.map(d => d.getTime())));
}, [joinedDate, currentPositionStartDate]);

// Update the getDefaultEffectiveDate function to ensure it's always in the future
const getDefaultEffectiveDate = React.useCallback(() => {
  const minDate = getMinDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // If minDate is in the future, use it directly
  if (minDate > today) return minDate;
  
  // Otherwise default to 1st of next month
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1, 1);
  nextMonth.setHours(0, 0, 0, 0);
  
  return nextMonth;
}, [getMinDate]);

  // Check if this is a duplicate position change
  const isDuplicatePositionChange = React.useMemo(() => {
    if (!newPositionId || !pastPositions.length) return false;
    
    // Check if the new position is the same as any past position (excluding current)
    return pastPositions.some(pos => 
      pos.position_id === newPositionId && 
      pos.status === 'active' &&
      (!pos.end_date || new Date(pos.end_date) > new Date())
    );
  }, [newPositionId, pastPositions]);

  const positionSelected = 
    typeof newPositionId === 'number' &&
    Number.isInteger(newPositionId) &&
    newPositionId > 0;

  const levelSelected = newLevel !== undefined && newLevel !== null && newLevel !== '';
  const canConfirm = dateInitialized && !!date && positionSelected && levelSelected && !submitting && !isDuplicatePositionChange;

  const handleConfirm = async () => {
    if (!date) {
      setError('Please select a valid effective date');
      return;
    }

    if (!positionSelected || !levelSelected) {
      setError('Please select both a position and job level');
      return;
    }

    if (isDuplicatePositionChange) {
      setError('This position change has already been applied');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        employee_id: employeeId,
        position_id: newPositionId,
        start_date: date.toISOString().split('T')[0], // YYYY-MM-DD
      };

      const resp = await fetch(`${API_BASE_URL}/api/admin/employees/past-positions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to update position');
      }

      toast.success('Please click "Save Changes" button to complete this transaction.', {
        duration: 5000,
      });

      onConfirm?.({ effectiveDate: payload.start_date });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
      toast.error(err instanceof Error ? err.message : 'Failed to update position');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-2xl ring-1 ring-black/5">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-white/60 px-6 py-5">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Confirm Position Change</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600"
            disabled={submitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Pending change notice */}
          {promotionDraft?.effectiveDate && (
            <div className="mb-4 rounded-lg bg-blue-50 p-3">
              <div className="text-sm text-blue-900">
                <span className="font-medium">Pending position/level change.</span>{' '}
                Set an <span className="font-medium">Effective Date</span> before confirming.
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Effective: {fmt(promotionDraft.effectiveDate)}
                </span>
              </div>
            </div>
          )}

          {/* Summary card */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500">From</div>
                <div className="mt-1 text-sm text-gray-600">Position</div>
                <div className="font-medium text-gray-900">{currentPosition || '-'}</div>
                <div className="mt-2 text-sm text-gray-600">Job Level</div>
                <div className="font-medium text-gray-900">{currentLevel || '-'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500">To</div>
                <div className="mt-1 text-sm text-gray-600">Position</div>
                <div className="font-medium text-gray-900">{newPosition || '-'}</div>
                <div className="mt-2 text-sm text-gray-600">Job Level</div>
                <div className="font-medium text-gray-900">{newLevel || '-'}</div>
              </div>
            </div>
          </div>

          {/* Effective date */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Effective Date <span className="text-red-500">*</span>
            </label>
            {dateInitialized ? (
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                minDate={getMinDate()}
                dateFormat="yyyy/MM/dd"
                placeholderText="Select effective date"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                wrapperClassName="w-full"
                required
                disabled={submitting || pastPositionsLoading}
                startDate={date}
                endDate={date}
                selectsStart
                selectsEnd
                popperPlacement="bottom-start"
              />
            ) : (
              <div className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 animate-pulse">
                Loading date picker...
              </div>
            )}
{joinedDate && (
  <p className="mt-1 text-xs text-gray-500">
    Joined on {new Date(joinedDate).toLocaleDateString('en-MY')}. 
    {currentPositionStartDate && (
      <> Current position started on {new Date(currentPositionStartDate).toLocaleDateString('en-MY')}.</>
    )}
    Effective date will default to the 1st of next month and cannot be before these dates or today's date.
  </p>
)}
          </div>

          {/* Validation messages */}
          {isDuplicatePositionChange && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              This position has already been assigned to the employee. Please select a different position or level.
            </div>
          )}

          {!positionSelected && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Please select a valid Position
            </div>
          )}

          {!levelSelected && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Please select a valid Job Level
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              onClick={handleConfirm}
              disabled={!canConfirm}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm
            </button>
          </div>

          <p className="mt-3 text-[11px] text-gray-500">Back-end may block dates in finalized payroll months.</p>
        </div>
      </div>
    </div>
  );
}