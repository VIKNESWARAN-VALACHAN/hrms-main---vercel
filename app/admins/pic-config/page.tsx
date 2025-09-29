'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/app/config';
import { toast } from 'react-hot-toast';

interface Section {
  id: number;
  name: string;
}

interface PICConfig {
  id: number;
  section_id: number;
  name: string;
  email: string;
  priority: number;
  status: string;
}

export default function PicConfigPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [configs, setConfigs] = useState<PICConfig[]>([]);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    email: '',
    priority: 1,
    status: 'Active'
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/feedback/master/sections`).then(res => res.json()).then(setSections);
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    const res = await fetch(`${API_BASE_URL}/api/feedback/pic-config`);
    const data = await res.json();
    setConfigs(data);
  };

  const handleSubmit = async () => {
    if (!selectedSection) return;

    // Ensure uniqueness of priority per section
    const exists = configs.find(c => c.section_id === selectedSection && c.priority === formData.priority && c.id !== formData.id);
    if (exists) {
      return toast.error(`Priority ${formData.priority} already assigned for this section.`);
    }

    const url = `${API_BASE_URL}/api/feedback/pic-config${editMode ? '/' + formData.id : ''}`;
    const method = editMode ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, section_id: selectedSection })
    });

    if (res.ok) {
      toast.success(`PIC ${editMode ? 'updated' : 'saved'} successfully.`);
      resetForm();
      fetchConfigs();
    } else {
      toast.error('Failed to save.');
    }
  };

  const handleEdit = (cfg: PICConfig) => {
    setFormData(cfg);
    setEditMode(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this PIC?')) return;
    const res = await fetch(`${API_BASE_URL}/api/feedback/pic-config/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      toast.success('PIC deleted.');
      fetchConfigs();
    } else {
      toast.error('Failed to delete.');
    }
  };

  const resetForm = () => {
    setFormData({ id: 0, name: '', email: '', priority: 1, status: 'Active' });
    setEditMode(false);
  };

  const filteredConfigs = configs.filter(cfg => cfg.section_id === selectedSection);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">PIC Configuration</h1>

      <select className="select select-bordered mb-4" value={selectedSection ?? ''} onChange={e => setSelectedSection(Number(e.target.value))}>
        <option value="">Select Section</option>
        {sections.map(sec => <option key={sec.id} value={sec.id}>{sec.name}</option>)}
      </select>

      {selectedSection && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{editMode ? 'Edit PIC' : 'Assign PIC'}</h2>
          <input className="input input-bordered w-full mb-2" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <input className="input input-bordered w-full mb-2" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          <select className="select select-bordered w-full mb-2" value={formData.priority} onChange={e => setFormData({ ...formData, priority: Number(e.target.value) })}>
            <option value={1}>Priority 1</option>
            <option value={2}>Priority 2</option>
            <option value={3}>Priority 3</option>
          </select>
          <select className="select select-bordered w-full mb-2" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={handleSubmit}>{editMode ? 'Update' : 'Save'}</button>
            {editMode && (
              <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </div>
      )}

      {filteredConfigs.length > 0 && (
        <div>
          <h3 className="font-bold mb-2">Existing PICs</h3>
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredConfigs.sort((a, b) => a.priority - b.priority).map(cfg => (
                <tr key={cfg.id}>
                  <td>{cfg.name}</td>
                  <td>{cfg.email}</td>
                  <td>{cfg.priority}</td>
                  <td>{cfg.status}</td>
                  <td className="space-x-2">
                    <button className="btn btn-sm btn-info" onClick={() => handleEdit(cfg)}>Edit</button>
                    <button className="btn btn-sm btn-error" onClick={() => handleDelete(cfg.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
