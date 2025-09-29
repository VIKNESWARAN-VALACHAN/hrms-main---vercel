'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/app/config';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/app/utils/api';


interface Settings {
  allow_anonymous: boolean;
  enable_auto_escalation: boolean;
  escalation_days: number;
  email_notifications: boolean;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
  allow_anonymous: false,
  enable_auto_escalation: false,
  escalation_days: 1,
  email_notifications: false,
});

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const role = getUserRole();

    if (role !== 'admin') {
      toast.error('Access denied');
      router.push('/');
      return;
    }

    fetch(`${API_BASE_URL}/api/feedback/settings`)
      .then(res => res.json())
      .then(data => {
        setSettings({
          allow_anonymous: !!data.allow_anonymous,
          enable_auto_escalation: !!data.auto_escalation,
          escalation_days: data.escalation_days ?? 1,
          email_notifications: !!data.email_notifications, 
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load settings', err);
        toast.error('Failed to load settings');
        setLoading(false);
      });
  }, [router]);

  const handleChange = (field: keyof Settings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleSave1 = async () => {
    if (!settings) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        toast.success('Settings updated successfully');
        const updated = await fetch(`${API_BASE_URL}/api/feedback/settings`);
        const data = await updated.json();
        setSettings({
          allow_anonymous: !!data.allow_anonymous,
          enable_auto_escalation: !!data.auto_escalation,
          escalation_days: data.escalation_days ?? 1,
          email_notifications: !!data.email_notifications, // if exists
        });
      } else {
        toast.error('Failed to update settings');
      }
    } catch (err) {
      console.error('Save failed', err);
      toast.error('An error occurred');
    } finally {
      setUpdating(false);
    }
  };
  const handleSave = async () => {
  if (!settings) return;
  setUpdating(true);
  try {
    const payload = {
      allow_anonymous: settings.allow_anonymous,
      auto_escalation: settings.enable_auto_escalation,
      escalation_days: settings.escalation_days,
      email_notifications: settings.email_notifications
    };

    const res = await fetch(`${API_BASE_URL}/api/feedback/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      toast.success('Settings updated successfully');
      const updated = await fetch(`${API_BASE_URL}/api/feedback/settings`);
      const data = await updated.json();
      setSettings({
        allow_anonymous: !!data.allow_anonymous,
        enable_auto_escalation: !!data.auto_escalation,
        escalation_days: data.escalation_days ?? 1,
        email_notifications: !!data.email_notifications,
      });
    } else {
      toast.error('Failed to update settings');
    }
  } catch (err) {
    console.error('Save failed', err);
    toast.error('An error occurred');
  } finally {
    setUpdating(false);
  }
};


  if (loading) return <div className="p-6">Loading settings...</div>;
  if (!settings) return <div className="p-6 text-red-500">Unable to load settings.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">System Settings</h1>

      <div className="space-y-4">
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Allow Anonymous Feedback</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={settings.allow_anonymous}
              onChange={e => handleChange('allow_anonymous', e.target.checked)}
            />
          </label>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Enable Auto-Escalation</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={settings.enable_auto_escalation}
              onChange={e => handleChange('enable_auto_escalation', e.target.checked)}
            />
          </label>
        </div>

        {settings.enable_auto_escalation && (
          <div>
            <label className="label">Escalate After (Days)</label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={settings.escalation_days}
              onChange={e => handleChange('escalation_days', Number(e.target.value))}
              min={1}
            />
          </div>
        )}

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Enable Email Notifications</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={settings.email_notifications}
              onChange={e => handleChange('email_notifications', e.target.checked)}
            />
          </label>
        </div>
      </div>

      <div className="mt-6">
        <button className="btn btn-primary" onClick={handleSave} disabled={updating}>
          {updating ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
