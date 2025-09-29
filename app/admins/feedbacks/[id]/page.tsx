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

interface FeedbackResponse {
  sender: string;
  timestamp: string;
  message: string;
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
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [newResponse, setNewResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [masters, setMasters] = useState<MasterData>({ sections: {}, categories: {}, types: {}, statuses: {} });

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    const fetchDetail = async () => {
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

        setFeedback(fbData);
        setLogs(logData || []);

        const mapById = (arr: any[]) => Object.fromEntries(arr.map(i => [i.id, i.name]));
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

    const fetchResponses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/feedback/respond/${id}`);
        const data = await res.json();
        setResponses(data);
      } catch (err) {
        console.error('Failed to fetch responses', err);
      }
    };

    fetchDetail();
    fetchResponses();
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
        <div><strong>Status:</strong> {masters.statuses[feedback.status_id]}</div>
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

      {responses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-6">Response Log</h2>
          <div className="space-y-3">
            {responses.map((res, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg shadow border">
                <div className="text-sm text-gray-700 font-medium mb-1">
                  {res.sender} @ {new Date(res.timestamp).toLocaleString()}
                </div>
                <div className="text-gray-900 whitespace-pre-line">{res.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Admin Reply</h3>
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          placeholder="Type your response..."
          value={newResponse}
          onChange={e => setNewResponse(e.target.value)}
        />
        <button
          className="btn btn-primary mt-2"
          onClick={async () => {
            try {
              const res = await fetch(`${API_BASE_URL}/api/feedback/respond/${params.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ response_message: newResponse, responder_email: 'admin@example.com' }),
              });
              if (res.ok) {
                setNewResponse('');
                setResponses([...responses, { sender: 'admin@example.com', timestamp: new Date().toISOString(), message: newResponse }]);
              }
            } catch (err) {
              console.error('Failed to submit response', err);
            }
          }}
          disabled={!newResponse.trim()}
        >
          Submit Response
        </button>
      </div>

      <button onClick={() => router.back()} className="btn btn-secondary mt-4">Back</button>
    </div>
  );
}
