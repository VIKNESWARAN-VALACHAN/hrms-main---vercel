
import { toast } from 'react-hot-toast';

export const calculateAge = (dob: string): number | null => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'badge-success';
    case 'pending':
      return 'badge-warning';
    case 'cancelled':
      return 'badge-error';
    default:
      return 'badge-neutral';
  }
};

export const formatDateTime = (dateTime: string) => {
  if (!dateTime) return '';
  return new Date(dateTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateForInput = (isoDateString: string | undefined) => {
  if (!isoDateString) return '';
  return isoDateString.split('T')[0];
};

export const calculateBondEndDate = (startDate: string, days: number): string => {
  if (!startDate || !days) return '';
  const date = new Date(startDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const getRemainingBondDays = (bondEndDate: string | undefined): number | null => {
  if (!bondEndDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day
  const endDate = new Date(bondEndDate);
  endDate.setHours(0, 0, 0, 0); // Normalize end date to start of day

  // If bond end date is in the past, remaining days is 0 or negative
  if (endDate < today) {
    return 0; // Bond has expired
  }

  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Use ceil to include the current day
  return diffDays;
};

export const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    case 'info':
      toast(message, { icon: 'ℹ️' });
      break;
    case 'warning':
      toast(message, { icon: '⚠️' });
      break;
    default:
      toast(message);
  }
};


