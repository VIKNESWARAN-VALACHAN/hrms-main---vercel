'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';

interface Feedback {
  id: number;
  section_name: string;
  category_name: string;
  feedback_type_name: string;
  status_name: string;
  submitted_at: string;
  assigned_pic: string | null;
  description: string;
  escalation_level: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}


export default function MyFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
   const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

 const fetchFeedbacks = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/feedback/my-feedbacks/${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      setFeedbacks(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  }, [user]);//};

  useEffect(() => {
    const userData = localStorage.getItem('hrms_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchFeedbacks();
    }
  }, [user,fetchFeedbacks]);

  const filteredFeedbacks = feedbacks.filter(fb =>
    fb.section_name.toLowerCase().includes(filter.toLowerCase()) ||
    fb.feedback_type_name.toLowerCase().includes(filter.toLowerCase()) ||
    fb.category_name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Feedback Submissions</h1>
      
      {user && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">Logged in as: {user.name} ({user.email}) ({user.id})</p>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="Filter by section, type, or category"
          className="input input-bordered flex-grow"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button 
          className="btn btn-primary"
          onClick={fetchFeedbacks}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost" onClick={fetchFeedbacks}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="alert alert-info">
          {filter ? 'No matching feedbacks found' : 'No feedbacks submitted yet'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Section</th>
                <th>Type</th>
                <th>Category</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((fb) => (
                <tr key={fb.id}>
                  <td>{formatDateTime(fb.submitted_at)}</td>
                  <td>{fb.section_name}</td>
                  <td>{fb.feedback_type_name}</td>
                  <td>{fb.category_name}</td>
                  <td>
                    <span className={`badge ${
                      fb.status_name === 'Resolved' ? 'badge-success' :
                      fb.status_name === 'Pending' ? 'badge-warning' :
                      'badge-neutral'
                    }`}>
                      {fb.status_name}
                    </span>
                  </td>
                  <td>{fb.assigned_pic || 'Unassigned'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => router.push(`/feedback/view/${fb.id}`)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}