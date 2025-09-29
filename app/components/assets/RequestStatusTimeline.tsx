'use client';
import React from 'react';

export interface TimelineItem {
  status: string;
  changedAt: string; // ISO date
  changedBy: string | null;
  remarks: string | null;
}

export default function RequestStatusTimeline({
  history,
}: {
  history: TimelineItem[];
}) {
  if (!history || history.length === 0) return <div>No status history.</div>;
  return (
    <div className="flex flex-col gap-4">
      {history.map((item, idx) => (
        <div key={idx} className="flex gap-3 items-start">
          <div className="w-3 h-3 mt-1 rounded-full bg-blue-500 flex-shrink-0"></div>
          <div>
            <div className="font-semibold">{item.status}</div>
            <div className="text-xs text-gray-500">
              {item.changedAt && new Date(item.changedAt).toLocaleString()} 
              {item.changedBy ? ` • ${item.changedBy}` : ''}
            </div>
            {item.remarks && <div className="text-sm text-gray-700">{item.remarks}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
