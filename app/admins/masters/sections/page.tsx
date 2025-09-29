'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/app/config';
import { toast } from 'react-hot-toast';

interface Section {
  id: number;
  name: string;
}

export default function SectionMasterPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [newSection, setNewSection] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/sections`);
      const data = await res.json();
      setSections(data);
    } catch (err) {
      toast.error('Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  const createSection = async () => {
    if (!newSection.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        },
        body: JSON.stringify({ name: newSection })
      });
      if (res.ok) {
        toast.success('Section added');
        setNewSection('');
        fetchSections();
      } else {
        toast.error('Failed to add section');
      }
    } catch (err) {
      toast.error('Failed to add section');
    }
  };

  const updateSection = async () => {
    if (!editingName.trim() || editingId === null) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/sections/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        },
        body: JSON.stringify({ name: editingName })
      });
      if (res.ok) {
        toast.success('Section updated');
        setEditingId(null);
        setEditingName('');
        fetchSections();
      } else {
        toast.error('Update failed');
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const deleteSection = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/sections/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        }
      });
      if (res.ok) {
        toast.success('Deleted');
        fetchSections();
      } else {
        toast.error('Delete failed');
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Manage Sections</h1>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New section name"
          className="input input-bordered"
          value={newSection}
          onChange={e => setNewSection(e.target.value)}
        />
        <button className="btn btn-primary" onClick={createSection}>Add</button>
      </div>

      <table className="table w-full mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sections.map(section => (
            <tr key={section.id}>
              <td>{section.id}</td>
              <td>
                {editingId === section.id ? (
                  <input
                    className="input input-sm"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                  />
                ) : (
                  section.name
                )}
              </td>
              <td className="text-right">
                {editingId === section.id ? (
                  <>
                    <button className="btn btn-sm btn-success mr-2" onClick={updateSection}>Save</button>
                    <button className="btn btn-sm btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-sm btn-outline mr-2" onClick={() => { setEditingId(section.id); setEditingName(section.name); }}>Edit</button>
                    <button className="btn btn-sm btn-error" onClick={() => deleteSection(section.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
