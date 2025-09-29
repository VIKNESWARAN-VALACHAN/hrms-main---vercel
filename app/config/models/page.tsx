'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL, API_ROUTES } from '../../config';

interface Model {
  id: number;
  brand_name: string;
  model_name: string;
}


export default function ModelsConfigPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [newModel, setNewModel] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchModels = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/master/models`);
      const data = await res.json();
      setModels(data);
    } catch {
      toast.error('Failed to load models');
    }
  };

  const addModel = async () => {
    if (!newModel.trim()) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/inventory/master/models`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newModel }),
      });
      if (!res.ok) throw new Error();
      toast.success('Model added');
      setNewModel('');
      fetchModels();
    } catch {
      toast.error('Failed to add model');
    } finally {
      setLoading(false);
    }
  };

  const deleteModel = async (id: number) => {
    if (!confirm('Delete this model?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/inventory/master/models/${id}`, {
        method: 'DELETE',
      });
      toast.success('Deleted');
      fetchModels();
    } catch {
      toast.error('Failed to delete');
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Configure Models</h1>
      <div className="flex gap-2 mb-6">
        <input
          className="input input-bordered w-full"
          placeholder="New model name"
          value={newModel}
          onChange={(e) => setNewModel(e.target.value)}
        />
        <button
          className={`btn btn-primary ${loading ? 'loading' : ''}`}
          onClick={addModel}
          disabled={loading}
        >
          Add
        </button>
      </div>

      <table className="table table-zebra">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
         <tbody>
          {models.length === 0 ? (
            <tr>
              <td colSpan={4}>No models available.</td>
            </tr>
          ) : (
            models.map((model, index) => (
              <tr key={`${model.brand_name}-${model.model_name}-${index}`}>
                <td>{index + 1}</td>
                <td>{model.brand_name}</td>
                <td>{model.model_name}</td>
                <td>
                  <button
                    onClick={() => deleteModel(model.id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
