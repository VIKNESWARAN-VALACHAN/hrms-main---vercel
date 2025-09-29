// 'use client';

// import { useEffect, useState } from 'react';
// import { API_BASE_URL } from '@/app/config';
// import { toast } from 'react-hot-toast';

// interface AnalyticsData {
//   heatmap: { [section: string]: number };
//   slaDetails?: { category: string; avg_response_time_hours: string | null }[];
//   wordCloud: { keyword: string; occurrences: number }[];
//   monthlyReport?: { month: string; feedback_type: string; section: string; total: number }[];
// }

// export default function AdminAnalyticsPage() {
//   const [data, setData] = useState<AnalyticsData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   const fetchAnalytics = async () => {
//     try {
//       setLoading(true);
//       const query = startDate && endDate ? `?start=${startDate}&end=${endDate}` : '';

//       const [heatmap, metrics, trends, monthly] = await Promise.all([
//         fetch(`${API_BASE_URL}/api/feedback/dashboard/heatmap${query}`).then(r => r.json()),
//         fetch(`${API_BASE_URL}/api/feedback/dashboard/metrics${query}`).then(r => r.json()),
//         fetch(`${API_BASE_URL}/api/feedback/dashboard/trends${query}`).then(r => r.json()),
//         fetch(`${API_BASE_URL}/api/feedback/dashboard/monthly-report${query}`).then(r => r.json()),
//       ]);

//       const heatmapData: Record<string, number> = {};
//       heatmap.forEach((entry: any) => {
//         const label = `${entry.section} (${entry.category})`;
//         heatmapData[label] = (heatmapData[label] || 0) + entry.count;
//       });

//       setData({
//         heatmap: heatmapData,
//         slaDetails: metrics,
//         wordCloud: trends,
//         monthlyReport: monthly,
//       });
//     } catch (err) {
//       console.error('Failed to fetch analytics', err);
//       toast.error('Failed to load analytics');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAnalytics();
//   }, []);

//   if (loading) return <div className="p-6">Loading analytics...</div>;
//   if (!data) return <div className="p-6 text-red-500">No data available.</div>;

//   const getFontSize = (count: number) => {
//     if (count >= 10) return 'text-2xl';
//     if (count >= 5) return 'text-xl';
//     if (count >= 3) return 'text-lg';
//     return 'text-base';
//   };

//   const getColorClass = (index: number) => {
//     const blues = ['bg-blue-100 text-blue-800', 'bg-blue-200 text-blue-900', 'bg-blue-300 text-blue-900'];
//     return blues[index % blues.length];
//   };

//   return (
//     <div className="p-6 space-y-8 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold">Feedback Analytics</h1>

//       <div>
//         <h2 className="text-lg font-semibold mb-2">📍 Heatmap by Section & Category</h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {Object.entries(data.heatmap).map(([label, count]) => (
//             <div key={label} className="p-3 bg-blue-200 hover:bg-blue-300 rounded shadow text-center">
//               <div className="font-semibold text-sm text-blue-900">{label}</div>
//               <div className="text-xl font-bold text-blue-800">{count}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div>
//         <h2 className="text-lg font-semibold mb-2">⏱ SLA Metrics (Avg Response Time by Category)</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {data.slaDetails?.map((item, idx) => (
//             <div key={idx} className="p-4 bg-blue-100 rounded shadow text-center">
//               <div className="text-sm text-blue-800 font-semibold">{item.category}</div>
//               <div className="text-xl font-bold text-blue-900">{item.avg_response_time_hours || '—'} hrs</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div>
//         <h2 className="text-lg font-semibold mb-2">🔤 Word Cloud</h2>
//         <div className="flex flex-wrap gap-2">
//           {data.wordCloud.map((word, i) => (
//             <span
//               key={i}
//               className={`px-3 py-1 rounded-full shadow ${getColorClass(i)} ${getFontSize(word.occurrences)}`}
//             >
//               {word.keyword}
//             </span>
//           ))}
//         </div>
//       </div>

//       <div>
//         <h2 className="text-lg font-semibold mb-2">📈 Monthly Feedback Report</h2>
//         <table className="table w-full">
//           <thead>
//             <tr>
//               <th>Month</th>
//               <th>Feedback Type</th>
//               <th>Section</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.monthlyReport?.map((item, idx) => (
//               <tr key={idx}>
//                 <td>{item.month}</td>
//                 <td>{item.feedback_type}</td>
//                 <td>{item.section}</td>
//                 <td>{item.total}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useState, useCallback } from 'react';
import { API_BASE_URL } from '@/app/config';
import { toast } from 'react-hot-toast';


interface AnalyticsData {
  heatmap: { [section: string]: number };
  slaDetails?: { category: string; avg_response_time_hours: string | null }[];
  wordCloud: { keyword: string; occurrences: number }[];
  monthlyReport?: { month: string; feedback_type: string; section: string; total: number }[];
}

interface SummaryStats {
  total: number;
  open: number;
  resolved: number;
  escalated: number;
  byType: { feedback_type_name: string; count: number }[];
  bySection: { section_name: string; count: number }[];
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     const query = startDate && endDate ? `?start=${startDate}&end=${endDate}` : '';

  //     const [heatmap, metrics, trends, monthly, stats] = await Promise.all([
  //       fetch(`${API_BASE_URL}/api/feedback/dashboard/heatmap${query}`).then(r => r.json()),
  //       fetch(`${API_BASE_URL}/api/feedback/dashboard/metrics${query}`).then(r => r.json()),
  //       fetch(`${API_BASE_URL}/api/feedback/dashboard/trends${query}`).then(r => r.json()),
  //       fetch(`${API_BASE_URL}/api/feedback/dashboard/monthly-report${query}`).then(r => r.json()),
  //       fetch(`${API_BASE_URL}/api/feedback/stats`).then(r => r.json())
  //     ]);

  //     const heatmapData: Record<string, number> = {};
  //     heatmap.forEach((entry: any) => {
  //       const label = `${entry.section} (${entry.category})`;
  //       heatmapData[label] = (heatmapData[label] || 0) + entry.count;
  //     });

  //     setAnalytics({
  //       heatmap: heatmapData,
  //       slaDetails: metrics,
  //       wordCloud: trends,
  //       monthlyReport: monthly,
  //     });

  //     setSummary(stats);
  //   } catch (err) {
  //     console.error('Failed to fetch analytics', err);
  //     toast.error('Failed to load analytics');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const fetchData = useCallback(async () => {
  try {
    setLoading(true);
    const query = startDate && endDate ? `?start=${startDate}&end=${endDate}` : '';

    const [heatmap, metrics, trends, monthly, stats] = await Promise.all([
      fetch(`${API_BASE_URL}/api/feedback/dashboard/heatmap${query}`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/feedback/dashboard/metrics${query}`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/feedback/dashboard/trends${query}`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/feedback/dashboard/monthly-report${query}`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/feedback/stats`).then(r => r.json())
    ]);

    const heatmapData: Record<string, number> = {};
    heatmap.forEach((entry: any) => {
      const label = `${entry.section} (${entry.category})`;
      heatmapData[label] = (heatmapData[label] || 0) + entry.count;
    });

    setAnalytics({
      heatmap: heatmapData,
      slaDetails: metrics,
      wordCloud: trends,
      monthlyReport: monthly,
    });

    setSummary(stats);
  } catch (err) {
    console.error('Failed to fetch analytics', err);
    toast.error('Failed to load analytics');
  } finally {
    setLoading(false);
  }
}, [startDate, endDate]); // 🧠 include only necessary deps


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="p-6">Loading analytics...</div>;
  if (!analytics || !summary) return <div className="p-6 text-red-500">No data available.</div>;

  const getFontSize = (count: number) => {
    if (count >= 10) return 'text-2xl';
    if (count >= 5) return 'text-xl';
    if (count >= 3) return 'text-lg';
    return 'text-base';
  };

  const getColorClass = (index: number) => {
    const blues = ['bg-blue-100 text-blue-800', 'bg-blue-200 text-blue-900', 'bg-blue-300 text-blue-900'];
    return blues[index % blues.length];
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">Feedback Analytics Dashboard</h1>

      {/* 🔹 Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-100 p-4 rounded shadow text-center">
          <div className="text-lg font-semibold text-gray-700">Total</div>
          <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow text-center">
          <div className="text-lg font-semibold text-yellow-700">Open</div>
          <div className="text-2xl font-bold text-yellow-900">{summary.open}</div>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <div className="text-lg font-semibold text-green-700">Resolved</div>
          <div className="text-2xl font-bold text-green-900">{summary.resolved}</div>
        </div>
        <div className="bg-red-100 p-4 rounded shadow text-center">
          <div className="text-lg font-semibold text-red-700">Escalated</div>
          <div className="text-2xl font-bold text-red-900">{summary.escalated}</div>
        </div>
      </div>

      {/* 🔹 Breakdown by Feedback Type */}
      <div>
        <h2 className="text-lg font-semibold mb-2">📌 Feedbacks by Type</h2>
        <ul className="list-disc pl-6">
          {summary.byType.map((t, i) => (
            <li key={i}>
              {t.feedback_type_name}: {t.count}
            </li>
          ))}
        </ul>
      </div>

      {/* 🔹 Breakdown by Section */}
      <div>
        <h2 className="text-lg font-semibold mb-2">📁 Feedbacks by Section</h2>
        <ul className="list-disc pl-6">
          {summary.bySection.map((s, i) => (
            <li key={i}>
              {s.section_name}: {s.count}
            </li>
          ))}
        </ul>
      </div>

      {/* 🔹 Heatmap */}
      <div>
        <h2 className="text-lg font-semibold mb-2">📍 Heatmap by Section & Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(analytics.heatmap).map(([label, count]) => (
            <div key={label} className="p-3 bg-blue-200 hover:bg-blue-300 rounded shadow text-center">
              <div className="font-semibold text-sm text-blue-900">{label}</div>
              <div className="text-xl font-bold text-blue-800">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 SLA Metrics */}
      <div>
        <h2 className="text-lg font-semibold mb-2">⏱ SLA Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analytics.slaDetails?.map((item, idx) => (
            <div key={idx} className="p-4 bg-blue-100 rounded shadow text-center">
              <div className="text-sm text-blue-800 font-semibold">{item.category}</div>
              <div className="text-xl font-bold text-blue-900">{item.avg_response_time_hours || '—'} hrs</div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Word Cloud */}
      <div>
        <h2 className="text-lg font-semibold mb-2">🔤 Word Cloud</h2>
        <div className="flex flex-wrap gap-2">
          {analytics.wordCloud.map((word, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full shadow ${getColorClass(i)} ${getFontSize(word.occurrences)}`}
            >
              {word.keyword}
            </span>
          ))}
        </div>
      </div>

      {/* 🔹 Monthly Trends */}
      <div>
        <h2 className="text-lg font-semibold mb-2">📈 Monthly Feedback Report</h2>
        <table className="table w-full">
          <thead>
            <tr>
              <th>Month</th>
              <th>Type</th>
              <th>Section</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {analytics.monthlyReport?.map((item, idx) => (
              <tr key={idx}>
                <td>{item.month}</td>
                <td>{item.feedback_type}</td>
                <td>{item.section}</td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
