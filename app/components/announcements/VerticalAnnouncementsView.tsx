import React from 'react';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  scheduled_at?: string;
  is_active?: boolean;
  is_posted?: boolean;
}

interface Props {
  announcements: Announcement[];
  role: string;
  theme: string;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentActive: boolean) => void;
  router: any;
}

const VerticalAnnouncementsView: React.FC<Props> = ({ announcements, role, theme, onDelete, onToggleActive, router }) => {
  const now = new Date();
  const upcoming = announcements.filter(a => a.scheduled_at && new Date(a.scheduled_at) > now);
  const latest = announcements.filter(a => !a.scheduled_at || new Date(a.scheduled_at) <= now);

  const renderSection = (title: string, list: Announcement[]) => (
    <div className="w-full lg:w-1/2 px-2">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-6">
        {list.map(a => (
          <div
            key={a.id}
            className={`rounded-xl shadow-md p-6 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}
          >
            <h3 className="text-xl font-bold mb-2">{a.title}</h3>
            <p className="text-sm mb-3 whitespace-pre-wrap">{a.content}</p>
            <p className="text-xs text-gray-500 mb-3">
              {a.scheduled_at
                ? `Scheduled: ${new Date(a.scheduled_at).toLocaleString()}`
                : `Posted: ${new Date(a.created_at).toLocaleString()}`}
            </p>
            {role === 'admin' && (
              <div className="flex gap-2">
                <button
                  onClick={() => onToggleActive(a.id, a.is_active ?? false)}
                  className="btn btn-sm"
                >
                  {a.is_active ? <FaEyeSlash /> : <FaEye />} {a.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => router.push(`/announcements/edit/${a.id}`)}
                  className="btn btn-sm"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => onDelete(a.id)}
                  className="btn btn-sm text-red-600"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {renderSection('Upcoming Announcements', upcoming)}
      {renderSection('Latest Announcements', latest)}
    </div>
  );
};

export default VerticalAnnouncementsView;
