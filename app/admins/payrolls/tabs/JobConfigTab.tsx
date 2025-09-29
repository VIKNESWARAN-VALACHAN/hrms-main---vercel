'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../../components/ThemeProvider';

interface JobConfig {
  [key: string]: boolean | number | string;
}

export default function JobConfigTab() {
  const { theme } = useTheme();
  const [config, setConfig] = useState<JobConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/payroll/jobconfig`);
      setConfig(res.data);
    } catch (err) {
      console.error('Failed to load job config:', err);
      toast.error('Failed to load job configuration');
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/api/payroll/jobconfig`, config);
      toast.success('Configuration saved successfully!');
    } catch (err) {
      console.error('Failed to save config', err);
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: boolean | number | string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const renderDayInputWithToggle = (enabledKey: string, dayKey: string, label: string) => {
    return (
      <div className={`p-4 rounded-lg shadow-sm ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              {label}
            </h3>
            <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              {config[enabledKey] ? 'Enabled' : 'Disabled'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={Boolean(config[enabledKey])}
              onChange={(e) => handleChange(enabledKey, e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {config[enabledKey] && (
          <div className="mt-2">
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Day of Month
            </label>
            <select
              className={`block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border ${
                theme === 'light' 
                  ? 'bg-white border-gray-300 text-gray-900' 
                  : 'bg-gray-700 border-gray-600 text-white'
              }`}
              value={config[dayKey] as number}
              onChange={(e) => handleChange(dayKey, parseInt(e.target.value))}
            >
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Day {i + 1}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  };

  const renderInput = (key: string, value: any) => {
    const label = key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    if (typeof value === 'boolean') {
      return (
        <div key={key} className={`flex items-center justify-between p-4 rounded-lg shadow-sm ${
          theme === 'light' ? 'bg-white' : 'bg-gray-800'
        }`}>
          <div>
            <h3 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              {label}
            </h3>
            <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              {value ? 'Enabled' : 'Disabled'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={Boolean(value)}
              onChange={(e) => handleChange(key, e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      );
    } else if (typeof value === 'number') {
      return (
        <div key={key} className={`p-4 rounded-lg shadow-sm ${
          theme === 'light' ? 'bg-white' : 'bg-gray-800'
        }`}>
          <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            {label}
          </label>
          <input
            type="number"
            className={`block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border ${
              theme === 'light' 
                ? 'bg-white border-gray-300 text-gray-900' 
                : 'bg-gray-700 border-gray-600 text-white'
            }`}
            value={value}
            onChange={(e) => handleChange(key, parseInt(e.target.value))}
          />
        </div>
      );
    } else {
      return (
        <div key={key} className={`p-4 rounded-lg shadow-sm ${
          theme === 'light' ? 'bg-white' : 'bg-gray-800'
        }`}>
          <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            {label}
          </label>
          <input
            type="text"
            className={`block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border ${
              theme === 'light' 
                ? 'bg-white border-gray-300 text-gray-900' 
                : 'bg-gray-700 border-gray-600 text-white'
            }`}
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        </div>
      );
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="flex flex-col space-y-6">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Payroll Job Configuration
          </h2>
          <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            Configure how payroll jobs are processed and scheduled
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderDayInputWithToggle('draft_enabled', 'draft_day', 'Payroll Draft Generation')}
          {renderDayInputWithToggle('auto_pay_enabled', 'auto_pay_day', 'Automatic Payment Processing')}
          
          {Object.entries(config)
            .filter(([key]) => !['draft_day', 'auto_pay_day', 'draft_enabled', 'auto_pay_enabled'].includes(key))
            .map(([key, value]) => (
              <div key={key}>
                {renderInput(key, value)}
              </div>
            ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={saveConfig}
            disabled={saving}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              theme === 'light'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            } ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Configuration'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}