'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../../../utils/api';
import { API_BASE_URL } from '../../../config';
import { useRouter } from 'next/navigation';

interface BenefitType {
  id: number;
  name: string;
  description: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export default function BenefitTypeListPage() {
  const [benefits, setBenefits] = useState<BenefitType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchBenefitTypes = async () => {
    try {
      setLoading(true);
      const data: BenefitType[] = await api.get(`${API_BASE_URL}/api/benefits`);
      setBenefits(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load benefit types.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenefitTypes();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Benefit Types</h1>
        <button
          className="btn btn-primary"
          onClick={() => router.push('/admins/claims/benefit-types/0')}
        >
          + Add Benefit Type
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <span className="loading loading-spinner text-primary"></span>
          <p className="mt-2">Loading benefit types...</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {benefits.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-4">
                    No benefit types found.
                  </td>
                </tr>
              ) : (
                benefits.map((benefit) => (
                  <tr key={benefit.id}>
                    <td>{benefit.name}</td>
                    <td>{benefit.description}</td>
                    <td>{benefit.is_active ? 'Active' : 'Inactive'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => router.push(`/admins/claims/benefit-types/${benefit.id}`)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}