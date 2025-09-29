import React from 'react';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
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

const CardAnnouncementsView: React.FC<Props> = ({ announcements, role, theme, onDelete, onToggleActive, router }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {announcements.map((a) => (
        <div key={a.id} className={`rounded-xl shadow-md p-6 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
          <h3 className="text-lg font-bold mb-2 line-clamp-2">{a.title}</h3>
          <p className="text-sm mb-4 line-clamp-4">{a.content}</p>
          <p className="text-xs text-gray-500 mb-3">{new Date(a.created_at).toLocaleDateString()}</p>
          <div className="flex justify-between items-center">
            {role === 'admin' && (
              <div className="flex gap-2">
                <button onClick={() => onToggleActive(a.id, a.is_active ?? false)} className="btn btn-sm">
                  {a.is_active ? <FaEyeSlash /> : <FaEye />} {a.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => router.push(`/announcements/edit/${a.id}`)} className="btn btn-sm">
                  <FaEdit /> Edit
                </button>
                <button onClick={() => onDelete(a.id)} className="btn btn-sm text-red-600">
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardAnnouncementsView;
