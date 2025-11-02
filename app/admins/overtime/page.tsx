
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { API_BASE_URL } from '../../config';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/app/components/ThemeProvider';

interface OvertimeRate {
  rate_id: number;
  rate_name: string;
  rate_type: 'weekday' | 'weekend' | 'public_holiday' | 'rest_day' | 'special';
  rate_multiplier: number;
  start_time: string | null;
  end_time: string | null;
  min_hours_before_ot: number;
  is_active: boolean;
  effective_date: string;
  created_at: string;
  updated_at: string;
}

interface OvertimeRateForm {
  rate_name: string;
  rate_type: 'weekday' | 'weekend' | 'public_holiday' | 'rest_day' | 'special';
  rate_multiplier: number;
  start_time: string;
  end_time: string;
  min_hours_before_ot: number;
  is_active: boolean;
  effective_date: string;
}

interface OvertimeSettings {
  [key: string]: {
    value: string;
    description: string;
    key: string;
  };
}

interface OvertimeConfiguration {
  eligibility_minutes: number;
  max_daily_minutes: number;
  round_to_minutes: number;
  before_shift_enabled: boolean;
  after_shift_enabled: boolean;
  restday_enabled: boolean;
  break_minutes_deduct: number;
  approval_required: boolean;
  auto_calculate: boolean;
  enabled: boolean;
}

export default function OvertimeRateConfig() {
  const { theme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'rates' | 'settings'>('rates');

  // Data states
  const [rates, setRates] = useState<OvertimeRate[]>([]);
  const [settings, setSettings] = useState<OvertimeSettings>({});
  const [configuration, setConfiguration] = useState<OvertimeConfiguration | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<OvertimeRate | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [rateToDelete, setRateToDelete] = useState<OvertimeRate | null>(null);
  const [filters, setFilters] = useState({
    rate_type: '',
    is_active: ''
  });

  const [formData, setFormData] = useState<OvertimeRateForm>({
    rate_name: '',
    rate_type: 'weekday',
    rate_multiplier: 1.5,
    start_time: '',
    end_time: '',
    min_hours_before_ot: 8.00,
    is_active: true,
    effective_date: new Date().toISOString().split('T')[0]
  });

  const [settingsForm, setSettingsForm] = useState({
    OT_ELIGIBILITY_MINUTES: '30',
    OT_MAX_PER_DAY_MINUTES: '240',
    OT_ROUND_TO_MINUTES: '15',
    OT_BREAK_MINUTES_DEDUCT: '0',
    OT_BEFORE_SHIFT_ENABLED: false,
    OT_AFTER_SHIFT_ENABLED: false,
    OT_RESTDAY_ENABLED: false,
    OT_APPROVAL_REQUIRED: false,
    OT_AUTO_CALCULATE: false,
    OT_ENABLED: false
  });

  const [errors, setErrors] = useState<Partial<OvertimeRateForm>>({});
  const [settingsErrors, setSettingsErrors] = useState<{[key: string]: string}>({});

  // Rate type options
  const rateTypeOptions = [
    { value: 'weekday', label: 'Weekday', description: 'Regular working days (Monday-Friday)' },
    { value: 'weekend', label: 'Weekend', description: 'Saturday and Sunday' },
    { value: 'public_holiday', label: 'Public Holiday', description: 'National public holidays' },
    { value: 'rest_day', label: 'Rest Day', description: 'Scheduled rest days' },
    { value: 'special', label: 'Special', description: 'Special occasion rates' }
  ];

  // Add role check to redirect non-admin users
  useEffect(() => {
    const checkUserRole = () => {
      const user = localStorage.getItem('hrms_user');
      if (user) {
        const userData = JSON.parse(user);
        setUserRole(userData.role);

        // If user is not admin, redirect to dashboard
        if (userData.role !== 'admin') {
          router.push('/');
        }
      } else {
        // If no user data, redirect to login
        router.push('/auth/login');
      }
    };

    checkUserRole();
  }, [router]);

  // Fetch data
  const fetchRates = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.rate_type) queryParams.append('rate_type', filters.rate_type);
      if (filters.is_active) queryParams.append('is_active', filters.is_active);

      const token = localStorage.getItem('hrms_token');
      const response = await fetch(`${API_BASE_URL}/api/attendance/overtime-rates?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setRates(result.data);
        } else {
          throw new Error(result.error);
        }
      } else {
        throw new Error('Failed to fetch overtime rates');
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
      setError('Failed to load overtime rates');
    } finally {
      setLoading(false);
    }
  };

  const fetchOvertimeConfiguration = async () => {
    try {
      const token = localStorage.getItem('hrms_token');
      const response = await fetch(`${API_BASE_URL}/api/attendance/overtime/configuration`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSettings(result.data.settings);
          setConfiguration(result.data.configuration);
          
          // Update settings form with current values
          setSettingsForm({
            OT_ELIGIBILITY_MINUTES: result.data.settings.OT_ELIGIBILITY_MINUTES?.value || '30',
            OT_MAX_PER_DAY_MINUTES: result.data.settings.OT_MAX_PER_DAY_MINUTES?.value || '240',
            OT_ROUND_TO_MINUTES: result.data.settings.OT_ROUND_TO_MINUTES?.value || '15',
            OT_BREAK_MINUTES_DEDUCT: result.data.settings.OT_BREAK_MINUTES_DEDUCT?.value || '0',
            OT_BEFORE_SHIFT_ENABLED: result.data.settings.OT_BEFORE_SHIFT_ENABLED?.value === '1',
            OT_AFTER_SHIFT_ENABLED: result.data.settings.OT_AFTER_SHIFT_ENABLED?.value === '1',
            OT_RESTDAY_ENABLED: result.data.settings.OT_RESTDAY_ENABLED?.value === '1',
            OT_APPROVAL_REQUIRED: result.data.settings.OT_APPROVAL_REQUIRED?.value === '1',
            OT_AUTO_CALCULATE: result.data.settings.OT_AUTO_CALCULATE?.value === '1',
            OT_ENABLED: result.data.settings.OT_ENABLED?.value === '1',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching overtime configuration:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'rates') {
      fetchRates();
    } else {
      fetchOvertimeConfiguration();
    }
  }, [filters, activeTab]);

  // Form handlers
  const handleOpenDialog = (rate?: OvertimeRate) => {
    if (rate) {
      setEditingRate(rate);
      setFormData({
        rate_name: rate.rate_name,
        rate_type: rate.rate_type,
        rate_multiplier: rate.rate_multiplier,
        start_time: rate.start_time || '',
        end_time: rate.end_time || '',
        min_hours_before_ot: rate.min_hours_before_ot,
        is_active: rate.is_active,
        effective_date: rate.effective_date
      });
    } else {
      setEditingRate(null);
      setFormData({
        rate_name: '',
        rate_type: 'weekday',
        rate_multiplier: 1.5,
        start_time: '',
        end_time: '',
        min_hours_before_ot: 8.00,
        is_active: true,
        effective_date: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRate(null);
    setErrors({});
  };

  // Delete confirmation handlers
  const handleOpenDeleteConfirm = (rate: OvertimeRate) => {
    setRateToDelete(rate);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setRateToDelete(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    // Handle number inputs separately
    if (name === 'rate_multiplier' || name === 'min_hours_before_ot') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : parseFloat(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof OvertimeRateForm]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setSettingsForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (settingsErrors[name]) {
      setSettingsErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<OvertimeRateForm> = {};

    if (!formData.rate_name.trim()) {
      newErrors.rate_name = 'Rate name is required';
    }

    if (!formData.effective_date) {
      newErrors.effective_date = 'Effective date is required';
    }

    // Time validation - only if both times are provided
    if (formData.start_time && formData.end_time) {
      if (formData.start_time >= formData.end_time) {
        newErrors.end_time = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSettingsForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!settingsForm.OT_ELIGIBILITY_MINUTES || parseInt(settingsForm.OT_ELIGIBILITY_MINUTES) < 0) {
      newErrors.OT_ELIGIBILITY_MINUTES = 'Eligibility minutes must be a positive number';
    }

    if (!settingsForm.OT_MAX_PER_DAY_MINUTES || parseInt(settingsForm.OT_MAX_PER_DAY_MINUTES) < 0) {
      newErrors.OT_MAX_PER_DAY_MINUTES = 'Max daily minutes must be a positive number';
    }

    if (!settingsForm.OT_ROUND_TO_MINUTES || parseInt(settingsForm.OT_ROUND_TO_MINUTES) < 0) {
      newErrors.OT_ROUND_TO_MINUTES = 'Round to minutes must be a positive number';
    }

    if (!settingsForm.OT_BREAK_MINUTES_DEDUCT || parseInt(settingsForm.OT_BREAK_MINUTES_DEDUCT) < 0) {
      newErrors.OT_BREAK_MINUTES_DEDUCT = 'Break deduction minutes must be a positive number';
    }

    setSettingsErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('hrms_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const url = editingRate 
        ? `${API_BASE_URL}/api/attendance/overtime-rates/${editingRate.rate_id}`
        : `${API_BASE_URL}/api/attendance/overtime-rates`;
      
      const method = editingRate ? 'PUT' : 'POST';

      // Prepare data - convert empty strings to null for optional time fields
      const submitData = {
        ...formData,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save overtime rate');
      }

      if (result.success) {
        toast.success(
          editingRate ? 'Overtime rate updated successfully' : 'Overtime rate created successfully',
          { duration: 3000, position: 'top-center' }
        );
        fetchRates();
        handleCloseDialog();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving rate:', error);
      setError(error instanceof Error ? error.message : 'Failed to save overtime rate');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSettingsForm()) return;

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('hrms_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Prepare settings data
      const submitData = {
        ...settingsForm,
        OT_BEFORE_SHIFT_ENABLED: settingsForm.OT_BEFORE_SHIFT_ENABLED ? '1' : '0',
        OT_AFTER_SHIFT_ENABLED: settingsForm.OT_AFTER_SHIFT_ENABLED ? '1' : '0',
        OT_RESTDAY_ENABLED: settingsForm.OT_RESTDAY_ENABLED ? '1' : '0',
        OT_APPROVAL_REQUIRED: settingsForm.OT_APPROVAL_REQUIRED ? '1' : '0',
        OT_AUTO_CALCULATE: settingsForm.OT_AUTO_CALCULATE ? '1' : '0',
        OT_ENABLED: settingsForm.OT_ENABLED ? '1' : '0',
      };

      const response = await fetch(`${API_BASE_URL}/api/attendance/overtime/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ settings: submitData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save overtime settings');
      }

      if (result.success) {
        toast.success('Overtime settings updated successfully', { duration: 3000, position: 'top-center' });
        fetchOvertimeConfiguration();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setError(error instanceof Error ? error.message : 'Failed to save overtime settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!rateToDelete) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      const response = await fetch(`${API_BASE_URL}/api/attendance/overtime-rates/${rateToDelete.rate_id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Overtime rate deleted successfully', { duration: 3000, position: 'top-center' });
        fetchRates();
        handleCloseDeleteConfirm();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error deleting rate:', error);
      setError('Failed to delete overtime rate');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (rate: OvertimeRate) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      const response = await fetch(`${API_BASE_URL}/api/attendance/overtime-rates/${rate.rate_id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: !rate.is_active }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          `Overtime rate ${!rate.is_active ? 'activated' : 'deactivated'} successfully`,
          { duration: 3000, position: 'top-center' }
        );
        fetchRates();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error updating rate status:', error);
      setError('Failed to update rate status');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const renderRateTypeBadge = (rateType: string) => {
    const colors = {
      weekday: 'badge-primary',
      weekend: 'badge-secondary',
      public_holiday: 'badge-error',
      rest_day: 'badge-warning',
      special: 'badge-info'
    };

    const labels = {
      weekday: 'Weekday',
      weekend: 'Weekend',
      public_holiday: 'Public Holiday',
      rest_day: 'Rest Day',
      special: 'Special'
    };

    return (
      <span className={`badge ${colors[rateType as keyof typeof colors]}`}>
        {labels[rateType as keyof typeof labels]}
      </span>
    );
  };

  const renderTimeRange = (startTime: string | null, endTime: string | null) => {
    if (!startTime || !endTime) return 'All Day';
    // Format time to remove seconds if present
    const formatTime = (time: string) => {
      return time.includes(':') ? time.substring(0, 5) : time;
    };
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  // Settings form component
  const renderSettingsForm = () => (
    <div className="card bg-base-100 shadow-md rounded-lg p-6">
      <h2 className="card-title text-xl mb-6">Overtime Calculation Settings</h2>
      
      <form onSubmit={handleSaveSettings}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Core Settings */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Core Overtime Rules</h3>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Minimum OT Minutes</span>
              <span className="label-text-alt text-error">*</span>
            </label>
            <input
              type="number"
              name="OT_ELIGIBILITY_MINUTES"
              className={`input input-bordered w-full ${settingsErrors.OT_ELIGIBILITY_MINUTES ? 'input-error' : ''}`}
              value={settingsForm.OT_ELIGIBILITY_MINUTES}
              onChange={handleSettingsChange}
              min="0"
              max="120"
            />
            {settingsErrors.OT_ELIGIBILITY_MINUTES && (
              <label className="label">
                <span className="label-text-alt text-error">{settingsErrors.OT_ELIGIBILITY_MINUTES}</span>
              </label>
            )}
            <label className="label">
              <span className="label-text-alt text-gray-500">
                Minimum extra minutes required to qualify as OT
              </span>
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Daily OT Cap (Minutes)</span>
              <span className="label-text-alt text-error">*</span>
            </label>
            <input
              type="number"
              name="OT_MAX_PER_DAY_MINUTES"
              className={`input input-bordered w-full ${settingsErrors.OT_MAX_PER_DAY_MINUTES ? 'input-error' : ''}`}
              value={settingsForm.OT_MAX_PER_DAY_MINUTES}
              onChange={handleSettingsChange}
              min="0"
              max="480"
            />
            {settingsErrors.OT_MAX_PER_DAY_MINUTES && (
              <label className="label">
                <span className="label-text-alt text-error">{settingsErrors.OT_MAX_PER_DAY_MINUTES}</span>
              </label>
            )}
            <label className="label">
              <span className="label-text-alt text-gray-500">
                Maximum OT minutes counted per day
              </span>
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Round OT To (Minutes)</span>
              <span className="label-text-alt text-error">*</span>
            </label>
            <input
              type="number"
              name="OT_ROUND_TO_MINUTES"
              className={`input input-bordered w-full ${settingsErrors.OT_ROUND_TO_MINUTES ? 'input-error' : ''}`}
              value={settingsForm.OT_ROUND_TO_MINUTES}
              onChange={handleSettingsChange}
              min="0"
              max="60"
            />
            {settingsErrors.OT_ROUND_TO_MINUTES && (
              <label className="label">
                <span className="label-text-alt text-error">{settingsErrors.OT_ROUND_TO_MINUTES}</span>
              </label>
            )}
            <label className="label">
              <span className="label-text-alt text-gray-500">
                Round OT to nearest X minutes (0 to disable)
              </span>
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Break Deduction (Minutes)</span>
              <span className="label-text-alt text-error">*</span>
            </label>
            <input
              type="number"
              name="OT_BREAK_MINUTES_DEDUCT"
              className={`input input-bordered w-full ${settingsErrors.OT_BREAK_MINUTES_DEDUCT ? 'input-error' : ''}`}
              value={settingsForm.OT_BREAK_MINUTES_DEDUCT}
              onChange={handleSettingsChange}
              min="0"
              max="120"
            />
            {settingsErrors.OT_BREAK_MINUTES_DEDUCT && (
              <label className="label">
                <span className="label-text-alt text-error">{settingsErrors.OT_BREAK_MINUTES_DEDUCT}</span>
              </label>
            )}
            <label className="label">
              <span className="label-text-alt text-gray-500">
                Deduct X minutes from OT for breaks
              </span>
            </label>
          </div>

          {/* OT Calculation Options */}
          <div className="md:col-span-2 mt-4">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">OT Calculation Options</h3>
          </div>

          <div className="form-control md:col-span-2">
            <label className="cursor-pointer label justify-start gap-3">
              <input
                type="checkbox"
                name="OT_BEFORE_SHIFT_ENABLED"
                className="checkbox checkbox-primary"
                checked={settingsForm.OT_BEFORE_SHIFT_ENABLED}
                onChange={handleSettingsChange}
              />
              <span className="label-text">
                <span className="font-medium">Count Early Work as OT</span>
                <span className="block text-sm text-gray-500">Include work done before shift start as overtime</span>
              </span>
            </label>
          </div>

          <div className="form-control md:col-span-2">
            <label className="cursor-pointer label justify-start gap-3">
              <input
                type="checkbox"
                name="OT_AFTER_SHIFT_ENABLED"
                className="checkbox checkbox-primary"
                checked={settingsForm.OT_AFTER_SHIFT_ENABLED}
                onChange={handleSettingsChange}
              />
              <span className="label-text">
                <span className="font-medium">Count Late Work as OT</span>
                <span className="block text-sm text-gray-500">Include work done after shift end as overtime</span>
              </span>
            </label>
          </div>

          <div className="form-control md:col-span-2">
            <label className="cursor-pointer label justify-start gap-3">
              <input
                type="checkbox"
                name="OT_RESTDAY_ENABLED"
                className="checkbox checkbox-primary"
                checked={settingsForm.OT_RESTDAY_ENABLED}
                onChange={handleSettingsChange}
              />
              <span className="label-text">
                <span className="font-medium">Count Rest-day Work as OT</span>
                <span className="block text-sm text-gray-500">Include work on rest days as overtime</span>
              </span>
            </label>
          </div>

          {/* System Settings */}
          <div className="md:col-span-2 mt-4">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">System Settings</h3>
          </div>

          <div className="form-control md:col-span-2">
            <label className="cursor-pointer label justify-start gap-3">
              <input
                type="checkbox"
                name="OT_ENABLED"
                className="checkbox checkbox-primary"
                checked={settingsForm.OT_ENABLED}
                onChange={handleSettingsChange}
              />
              <span className="label-text">
                <span className="font-medium">Enable Overtime Module</span>
                <span className="block text-sm text-gray-500">Enable overtime calculations system-wide</span>
              </span>
            </label>
          </div>

          <div className="form-control md:col-span-2">
            <label className="cursor-pointer label justify-start gap-3">
              <input
                type="checkbox"
                name="OT_AUTO_CALCULATE"
                className="checkbox checkbox-primary"
                checked={settingsForm.OT_AUTO_CALCULATE}
                onChange={handleSettingsChange}
              />
              <span className="label-text">
                <span className="font-medium">Auto-calculate OT</span>
                <span className="block text-sm text-gray-500">Automatically calculate OT after check-out</span>
              </span>
            </label>
          </div>

          <div className="form-control md:col-span-2">
            <label className="cursor-pointer label justify-start gap-3">
              <input
                type="checkbox"
                name="OT_APPROVAL_REQUIRED"
                className="checkbox checkbox-primary"
                checked={settingsForm.OT_APPROVAL_REQUIRED}
                onChange={handleSettingsChange}
              />
              <span className="label-text">
                <span className="font-medium">Require OT Approval</span>
                <span className="block text-sm text-gray-500">Require manager approval for overtime claims</span>
              </span>
            </label>
          </div>
        </div>

        <div className="modal-action mt-6">
          <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`}>
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Overtime Configuration
        </h1>

        <div className="flex justify-end">
          {activeTab === 'rates' && (
            <button 
              onClick={() => handleOpenDialog()}
              className="btn btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Rate
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs tabs-boxed mb-6">
        <button 
          className={`tab ${activeTab === 'rates' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('rates')}
        >
          Overtime Rates
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Calculation Settings
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'rates' ? (
        <>
          {/* Filters */}
          <div className="card bg-base-100 shadow-md rounded-lg p-6 mb-6">
            <h2 className="card-title text-xl mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Rate Type</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={filters.rate_type}
                  onChange={(e) => setFilters({ ...filters, rate_type: e.target.value })}
                >
                  <option value="">All Types</option>
                  {rateTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={filters.is_active}
                  onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rates Table */}
          <div className="card bg-base-100 shadow-md rounded-lg p-6">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center items-center min-h-200">
                  <div className="loading loading-spinner loading-lg"></div>
                </div>
              ) : (
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Rate Name</th>
                      <th>Type</th>
                      <th>Multiplier</th>
                      <th>Time Range</th>
                      <th>Min Hours</th>
                      <th>Effective Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map((rate) => (
                      <tr key={rate.rate_id}>
                        <td>
                          <div className="font-medium">{rate.rate_name}</div>
                        </td>
                        <td>{renderRateTypeBadge(rate.rate_type)}</td>
                        <td>
                          <span className="badge badge-outline badge-primary">
                            {rate.rate_multiplier}x
                          </span>
                        </td>
                        <td>
                          <span className="text-sm">
                            {renderTimeRange(rate.start_time, rate.end_time)}
                          </span>
                        </td>
                        <td>{rate.min_hours_before_ot}h</td>
                        <td>{new Date(rate.effective_date).toLocaleDateString()}</td>
                        <td>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={rate.is_active}
                            onChange={() => handleToggleStatus(rate)}
                          />
                          <span className="ml-2 text-sm">
                            {rate.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpenDialog(rate)}
                              className="btn btn-ghost btn-sm"
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleOpenDeleteConfirm(rate)}
                              className="btn btn-ghost btn-sm text-error"
                              title="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {rates.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-8">
                          <div className="text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>No overtime rates found</p>
                            <button 
                              onClick={() => handleOpenDialog()}
                              className="btn btn-primary btn-sm mt-2"
                            >
                              Add Your First Rate
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      ) : (
        renderSettingsForm()
      )}

      {/* Add/Edit Rate Dialog */}
      {isDialogOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg mb-4">
              {editingRate ? 'Edit Overtime Rate' : 'Add New Overtime Rate'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rate Name */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Rate Name <span className="text-error">*</span></span>
                  </label>
                  <input
                    type="text"
                    name="rate_name"
                    className={`input input-bordered w-full ${errors.rate_name ? 'input-error' : ''}`}
                    value={formData.rate_name}
                    onChange={handleChange}
                    placeholder="Enter rate name"
                  />
                  {errors.rate_name && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.rate_name}</span>
                    </label>
                  )}
                </div>

                {/* Rate Type */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Rate Type <span className="text-error">*</span></span>
                  </label>
                  <select
                    name="rate_type"
                    className="select select-bordered w-full"
                    value={formData.rate_type}
                    onChange={handleChange}
                  >
                    {rateTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rate Multiplier */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Rate Multiplier <span className="text-error">*</span></span>
                  </label>
                  <input
                    type="number"
                    name="rate_multiplier"
                    step="0.1"
                    min="0.1"
                    className={`input input-bordered w-full ${errors.rate_multiplier ? 'input-error' : ''}`}
                    value={formData.rate_multiplier}
                    onChange={handleChange}
                  />
                  {errors.rate_multiplier && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.rate_multiplier}</span>
                    </label>
                  )}
                </div>

                {/* Start Time - Optional */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Start Time (Optional)</span>
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    className="input input-bordered w-full"
                    value={formData.start_time}
                    onChange={handleChange}
                  />
                  <label className="label">
                    <span className="label-text-alt text-gray-500">Leave empty for all day</span>
                  </label>
                </div>

                {/* End Time - Optional */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">End Time (Optional)</span>
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    className={`input input-bordered w-full ${errors.end_time ? 'input-error' : ''}`}
                    value={formData.end_time}
                    onChange={handleChange}
                  />
                  {errors.end_time ? (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.end_time}</span>
                    </label>
                  ) : (
                    <label className="label">
                      <span className="label-text-alt text-gray-500">Leave empty for all day</span>
                    </label>
                  )}
                </div>

                {/* Minimum Hours */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Minimum Hours Before OT</span>
                  </label>
                  <input
                    type="number"
                    name="min_hours_before_ot"
                    step="0.5"
                    min="0"
                    className={`input input-bordered w-full ${errors.min_hours_before_ot ? 'input-error' : ''}`}
                    value={formData.min_hours_before_ot}
                    onChange={handleChange}
                  />
                  {errors.min_hours_before_ot && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.min_hours_before_ot}</span>
                    </label>
                  )}
                </div>

                {/* Effective Date */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Effective Date <span className="text-error">*</span></span>
                  </label>
                  <input
                    type="date"
                    name="effective_date"
                    className={`input input-bordered w-full ${errors.effective_date ? 'input-error' : ''}`}
                    value={formData.effective_date}
                    onChange={handleChange}
                  />
                  {errors.effective_date && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.effective_date}</span>
                    </label>
                  )}
                </div>

                {/* Active Status */}
                <div className="form-control md:col-span-2">
                  <label className="cursor-pointer label justify-start gap-3">
                    <input
                      type="checkbox"
                      name="is_active"
                      className="checkbox checkbox-primary"
                      checked={formData.is_active}
                      onChange={handleChange}
                    />
                    <span className="label-text">
                      <span className="font-medium">Active</span>
                      <span className="block text-sm text-gray-500">This rate will be available for use</span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={handleCloseDialog}>
                  Cancel
                </button>
                <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`}>
                  {editingRate ? 'Update Rate' : 'Create Rate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && rateToDelete && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Confirm Deletion</h3>
            <div className="py-4">
              <p className="mb-4">Are you sure you want to delete this overtime rate?</p>
              <div className="bg-base-200 p-4 rounded-lg">
                <p><strong>Rate Name:</strong> {rateToDelete.rate_name}</p>
                <p><strong>Type:</strong> {rateToDelete.rate_type}</p>
                <p><strong>Multiplier:</strong> {rateToDelete.rate_multiplier}x</p>
                <p><strong>Scope:</strong> Global (All Companies)</p>
              </div>
              <p className="mt-4 text-warning">This action cannot be undone.</p>
            </div>
            <div className="modal-action">
              <button 
                type="button" 
                className="btn btn-ghost" 
                onClick={handleCloseDeleteConfirm}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-error" 
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : (
                  'Delete Rate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
