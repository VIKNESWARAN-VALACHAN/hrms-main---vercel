'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/app/config';

interface FeedbackDetail {
  id: number;
  staff_id: number;
  section_id: number;
  category_id: number;
  feedback_type_id: number;
  status_id: number;
  description: string;
  attachments: string | null;
  assigned_pic: string;
  escalation_level: number;
  submitted_at: string;
  updated_at: string;
}

interface FeedbackLog {
  id: number;
  feedback_id: number;
  event: string;
  timestamp: string;
}

interface MasterData {
  sections: Record<number, string>;
  categories: Record<number, string>;
  types: Record<number, string>;
  statuses: Record<number, string>;
}

export default function FeedbackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [feedback, setFeedback] = useState<FeedbackDetail | null>(null);
  const [logs, setLogs] = useState<FeedbackLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [masters, setMasters] = useState<MasterData>({
    sections: {},
    categories: {},
    types: {},
    statuses: {},
  });
  const [newStatusId, setNewStatusId] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchFeedbackDetail = async (staffId: number, feedbackId: string | string[]) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/my-feedbacks/${staffId}/${feedbackId}`);
      if (res.ok) {
        const data = await res.json();
        setFeedback(data);
        setNewStatusId(data.status_id);
      }
    } catch (err) {
      console.error('Failed to fetch feedback detail:', err);
    }
  };

  const handleStatusChange = async () => {
    if (!feedback || newStatusId === null || newStatusId === feedback.status_id) return;

    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE_URL}/api/feedback/change-status/${feedback.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_id: newStatusId }),
      });

      if (res.ok) {
       await fetchFeedbackDetail(feedback.staff_id, feedback.id.toString());
        alert('Status updated successfully.');
        setNewStatusId(null);
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      console.error('Failed to update status', err);
      alert('An error occurred while updating status.');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const id = params?.id;
    if (!id) return;

    const fetchData = async () => {
      try {
        const [fbRes, logRes, secRes, catRes, typRes, statRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/feedback/my-feedbacks/215/${id}`),
          fetch(`${API_BASE_URL}/api/feedback/logs/${id}`),
          fetch(`${API_BASE_URL}/api/feedback/master/sections`),
          fetch(`${API_BASE_URL}/api/feedback/master/categories`),
          fetch(`${API_BASE_URL}/api/feedback/master/feedback-types`),
          fetch(`${API_BASE_URL}/api/feedback/master/status`),
        ]);

        if (!fbRes.ok) throw new Error('Failed to load feedback');

        const [fbData, logData, secData, catData, typData, statData] = await Promise.all([
          fbRes.json(),
          logRes.json(),
          secRes.json(),
          catRes.json(),
          typRes.json(),
          statRes.json(),
        ]);

        const mapById = (arr: any[]) => Object.fromEntries(arr.map(i => [i.id, i.name]));

        setFeedback(fbData);
        setLogs(logData || []);
        setNewStatusId(fbData.status_id);
        setMasters({
          sections: mapById(secData),
          categories: mapById(catData),
          types: mapById(typData),
          statuses: mapById(statData),
        });
      } catch (err) {
        console.error('Failed to fetch feedback detail or logs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!feedback) return <div className="p-6 text-red-500">Feedback not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Feedback Detail (#{feedback.id})</h1>

      <div className="border rounded-lg p-4 space-y-2 bg-base-100">
        <div><strong>Section:</strong> {masters.sections[feedback.section_id]}</div>
        <div><strong>Category:</strong> {masters.categories[feedback.category_id]}</div>
        <div><strong>Type:</strong> {masters.types[feedback.feedback_type_id]}</div>
        <div>
          <strong>Status:</strong>
          <select
            className="select select-bordered ml-2"
            value={newStatusId ?? ''}
            onChange={(e) => setNewStatusId(parseInt(e.target.value))}
          >
            {Object.entries(masters.statuses).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
          <button
            className="btn btn-sm ml-2 btn-primary"
            onClick={handleStatusChange}
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Change Status'}
          </button>
        </div>
        <div><strong>PIC:</strong> {feedback.assigned_pic}</div>
        <div><strong>Submitted:</strong> {new Date(feedback.submitted_at).toLocaleString()}</div>
        <div><strong>Last Updated:</strong> {new Date(feedback.updated_at).toLocaleString()}</div>
        <div><strong>Description:</strong><br />{feedback.description}</div>
        {feedback.attachments && (
          <div>
            <strong>Attachment:</strong><br />
            <img
              src={`${API_BASE_URL}/uploads/${feedback.attachments}`}
              alt="Attachment"
              className="max-w-xs rounded border"
            />
          </div>
        )}
      </div>

      {logs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-6">Feedback Logs</h2>
          <table className="table table-zebra w-full mt-2">
            <thead>
              <tr>
                <th>Action</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{log.event}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button onClick={() => router.back()} className="btn btn-secondary mt-4">Back</button>
    </div>
  );
}
