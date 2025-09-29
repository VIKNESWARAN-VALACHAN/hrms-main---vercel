'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '@/app/config';

interface OptionItem {
  id: string | number;
  name: string;
}

interface Settings {
  allow_anonymous: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function SubmitFeedbackPage() {
  const [types, setTypes] = useState<OptionItem[]>([]);
  const [sections, setSections] = useState<OptionItem[]>([]);
  const [categories, setCategories] = useState<OptionItem[]>([]);
  const [settings, setSettings] = useState<Settings>({ allow_anonymous: false });
  const [user, setUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    staff_id: user?.id.toString() || '',
    section_id: '',
    category_id: '',
    feedback_type_id: '',
    description: '',
    submit_anonymous: false,
    file: null as File | null,
  });

  const [successData, setSuccessData] = useState<{ id: number; assigned_pic: string } | null>(null);

 useEffect(() => {
    const fetchUser = () => {
      const userData = localStorage.getItem('hrms_user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    
    const fetchDropdowns = async () => {
      try {
        const [typeRes, sectionRes, categoryRes, settingsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/feedback/master/feedback-types`),
          fetch(`${API_BASE_URL}/api/feedback/master/sections`),
          fetch(`${API_BASE_URL}/api/feedback/master/categories`),
          fetch(`${API_BASE_URL}/api/feedback/settings`)
        ]);

        const [typesData, sectionsData, categoriesData, settingsData] = await Promise.all([
          typeRes.json(),
          sectionRes.json(),
          categoryRes.json(),
          settingsRes.json()
        ]);

        setTypes(typesData || []);
        setSections(sectionsData || []);
        setCategories(categoriesData || []);
        setSettings(settingsData || { allow_anonymous: false });

      } catch (err) {
        console.error('Error loading dropdowns:', err);
        toast.error('Failed to load feedback options');
      }
    };

    fetchUser();
    fetchDropdowns();
  }, []);

    useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        staff_id: user.id.toString()
      }));
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    if (!user) {
      toast.error('Please log in to submit feedback');
      return;
    }


    const data = new FormData();
    data.append('staff_id', form.staff_id);
    data.append('section_id', form.section_id);
    data.append('category_id', form.category_id);
    data.append('feedback_type_id', form.feedback_type_id);
    data.append('description', form.description);
    data.append('submit_anonymous', form.submit_anonymous ? 'true' : 'false');

    if (form.file && form.file instanceof File) {
      data.append('file', form.file); // backend handles it as 'attachments'
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/submit`, {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Feedback submitted!');
        setSuccessData({ id: result.id, assigned_pic: result.assigned_pic });

        // Reset the form
        setForm({
          staff_id: user.id.toString(),
          section_id: '',
          category_id: '',
          feedback_type_id: '',
          description: '',
          submit_anonymous: false,
          file: null,
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast.error(result.error || 'Failed to submit');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, file }));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto">
        <h1 className="text-xl font-bold">Submit Feedback</h1>

        {user && (
          <div className="text-sm text-gray-600 mb-2">
            Submitting as: {user.name} ({user.email}) ({user.id})
          </div>
        )}

        <select
          value={form.section_id}
          onChange={e => setForm({ ...form, section_id: e.target.value })}
          required
          className="select select-bordered w-full"
        >
          <option value="">Select Section</option>
          {sections.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          value={form.category_id}
          onChange={e => setForm({ ...form, category_id: e.target.value })}
          required
          className="select select-bordered w-full"
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={form.feedback_type_id}
          onChange={e => setForm({ ...form, feedback_type_id: e.target.value })}
          required
          className="select select-bordered w-full"
        >
          <option value="">Select Type</option>
          {types.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <textarea
          placeholder="Description"
          rows={4}
          required
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="textarea textarea-bordered w-full"
        />

        <input
          type="file"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full"
        />

        {settings.allow_anonymous && (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.submit_anonymous}
              onChange={e => setForm({ ...form, submit_anonymous: e.target.checked })}
              className="checkbox"
            />
            <span>Submit anonymously</span>
          </label>
        )}

        <button type="submit" className="btn btn-primary w-full">Submit</button>
      </form>

      {/* Success Modal */}
      {successData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h2 className="text-lg font-semibold text-green-600 mb-2">Feedback Submitted</h2>
            <p>Feedback ID: <strong>{successData.id}</strong></p>
            <p>Assigned PIC: <strong>{successData.assigned_pic || 'N/A'}</strong></p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => setSuccessData(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
