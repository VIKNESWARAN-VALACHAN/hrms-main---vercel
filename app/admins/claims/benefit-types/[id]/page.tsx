'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api } from '../../../../utils/api';
import { API_BASE_URL } from '../../../../config';

interface BenefitType {
  id?: number;
  name: string;
  description: string;
  is_active: number;
}

export default function BenefitTypeFormPage({ params }: { params: Promise<{ id: string }> }) {
  const [formData, setFormData] = useState<BenefitType>({
    name: '',
    description: '',
    is_active: 1,
  });
  const [loading, setLoading] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
      if (resolved.id !== '0') {
        fetchData(resolved.id);
      }
    };
    resolveParams();
  }, [params]);

  const fetchData = async (id: string) => {
    try {
      setLoading(true);
      const data = await api.get(`${API_BASE_URL}/api/benefits/${id}`);
      setFormData(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load benefit type');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'is_active' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!resolvedParams) return;
    
    try {
      setLoading(true);
      if (resolvedParams.id !== '0') {
        await api.put(`${API_BASE_URL}/api/benefits/${resolvedParams.id}`, formData);
        toast.success('Benefit type updated successfully');
      } else {
        await api.post(`${API_BASE_URL}/api/benefits`, formData);
        toast.success('Benefit type created successfully');
      }
      router.push('/admins/claims/benefit-types');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save benefit type');
    } finally {
      setLoading(false);
    }
  };

  if (!resolvedParams) {
    return <div className="p-8">Loading...</div>;
  }

  const isEdit = resolvedParams.id !== '0';

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Edit Benefit Type' : 'Create Benefit Type'}
      </h1>

      <div className="grid gap-4 max-w-xl">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Benefit Name"
          className="input input-bordered w-full"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          rows={3}
          required
        />

        <select
          name="is_active"
          value={formData.is_active}
          onChange={handleChange}
          className="select select-bordered w-full"
        >
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>

        <div className="flex gap-4">
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => router.push('/admins/claims/benefit-types')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}