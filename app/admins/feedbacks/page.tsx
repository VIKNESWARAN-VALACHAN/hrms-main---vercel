'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/app/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Feedback {
  id: number;
  description: string;
  status_name: string;
  category_name: string;
  section_name: string;
  submitted_at: string;
  assigned_pic: string;
}

export default function AdminFeedbacksPage() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    section: '',
    pic: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  const fetchFeedbacks = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/feedback/all`);
    const data = await res.json();
    setFeedbacks(data);
    setTotalPages(Math.ceil(data.length / perPage));
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [filters, currentPage]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const handleChangeStatus = async (id: number, status_id: number) => {
    const res = await fetch(`${API_BASE_URL}/api/feedback/change-status/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status_id }),
    });
    if (res.ok) fetchFeedbacks();
  };

  const paginatedFeedbacks = feedbacks.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Feedback Management</h1>

      <div className="flex gap-4 mb-4">
        <select name="status" value={filters.status} onChange={handleFilterChange} className="select select-bordered">
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
        <select name="category" value={filters.category} onChange={handleFilterChange} className="select select-bordered">
          <option value="">All Categories</option>
          <option value="Complaint">Complaint</option>
          <option value="Suggestion">Suggestion</option>
          <option value="Appreciation">Appreciation</option>
        </select>
        <select name="section" value={filters.section} onChange={handleFilterChange} className="select select-bordered">
          <option value="">All Sections</option>
          <option value="HR">Human Resources</option>
          <option value="IT">Information Technology</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Status</th>
                <th>Category</th>
                <th>Section</th>
                <th>PIC</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFeedbacks.map(fb => (
                <tr key={fb.id}>
                  <td>{fb.id}</td>
                  <td>{fb.description.slice(0, 40)}...</td>
                  <td>{fb.status_name}</td>
                  <td>{fb.category_name}</td>
                  <td>{fb.section_name}</td>
                  <td>{fb.assigned_pic}</td>
                  <td>{new Date(fb.submitted_at).toLocaleDateString()}</td>
                  <td className="flex flex-wrap gap-2">
                    <Link href={`/admins/feedbacks/${fb.id}`} className="btn btn-sm btn-info">View</Link>
                    <Link href={`/admins/feedbacks/${fb.id}/edit`} className="btn btn-sm btn-warning">Edit</Link>
                    {/* <button className="btn btn-sm btn-success" onClick={() => handleChangeStatus(fb.id, 3)}>Mark Resolved</button>
                    <button className="btn btn-sm btn-error" onClick={() => handleChangeStatus(fb.id, 4)}>Close</button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex justify-center gap-2">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`btn btn-sm ${currentPage === idx + 1 ? 'btn-primary' : ''}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
