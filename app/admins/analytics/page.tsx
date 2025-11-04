// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { API_BASE_URL } from '@/app/config';
// // import { toast } from 'react-hot-toast';

// // interface AnalyticsData {
// //   heatmap: { [section: string]: number };
// //   slaDetails?: { category: string; avg_response_time_hours: string | null }[];
// //   wordCloud: { keyword: string; occurrences: number }[];
// //   monthlyReport?: { month: string; feedback_type: string; section: string; total: number }[];
// // }

// // export default function AdminAnalyticsPage() {
// //   const [data, setData] = useState<AnalyticsData | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [startDate, setStartDate] = useState('');
// //   const [endDate, setEndDate] = useState('');

// //   const fetchAnalytics = async () => {
// //     try {
// //       setLoading(true);
// //       const query = startDate && endDate ? `?start=${startDate}&end=${endDate}` : '';

// //       const [heatmap, metrics, trends, monthly] = await Promise.all([
// //         fetch(`${API_BASE_URL}/api/feedback/dashboard/heatmap${query}`).then(r => r.json()),
// //         fetch(`${API_BASE_URL}/api/feedback/dashboard/metrics${query}`).then(r => r.json()),
// //         fetch(`${API_BASE_URL}/api/feedback/dashboard/trends${query}`).then(r => r.json()),
// //         fetch(`${API_BASE_URL}/api/feedback/dashboard/monthly-report${query}`).then(r => r.json()),
// //       ]);

// //       const heatmapData: Record<string, number> = {};
// //       heatmap.forEach((entry: any) => {
// //         const label = `${entry.section} (${entry.category})`;
// //         heatmapData[label] = (heatmapData[label] || 0) + entry.count;
// //       });

// //       setData({
// //         heatmap: heatmapData,
// //         slaDetails: metrics,
// //         wordCloud: trends,
// //         monthlyReport: monthly,
// //       });
// //     } catch (err) {
// //       console.error('Failed to fetch analytics', err);
// //       toast.error('Failed to load analytics');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchAnalytics();
// //   }, []);

// //   if (loading) return <div className="p-6">Loading analytics...</div>;
// //   if (!data) return <div className="p-6 text-red-500">No data available.</div>;

// //   const getFontSize = (count: number) => {
// //     if (count >= 10) return 'text-2xl';
// //     if (count >= 5) return 'text-xl';
// //     if (count >= 3) return 'text-lg';
// //     return 'text-base';
// //   };

// //   const getColorClass = (index: number) => {
// //     const blues = ['bg-blue-100 text-blue-800', 'bg-blue-200 text-blue-900', 'bg-blue-300 text-blue-900'];
// //     return blues[index % blues.length];
// //   };

// //   return (
// //     <div className="p-6 space-y-8 max-w-6xl mx-auto">
// //       <h1 className="text-2xl font-bold">Feedback Analytics</h1>

// //       <div>
// //         <h2 className="text-lg font-semibold mb-2">📍 Heatmap by Section & Category</h2>
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //           {Object.entries(data.heatmap).map(([label, count]) => (
// //             <div key={label} className="p-3 bg-blue-200 hover:bg-blue-300 rounded shadow text-center">
// //               <div className="font-semibold text-sm text-blue-900">{label}</div>
// //               <div className="text-xl font-bold text-blue-800">{count}</div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       <div>
// //         <h2 className="text-lg font-semibold mb-2">⏱ SLA Metrics (Avg Response Time by Category)</h2>
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //           {data.slaDetails?.map((item, idx) => (
// //             <div key={idx} className="p-4 bg-blue-100 rounded shadow text-center">
// //               <div className="text-sm text-blue-800 font-semibold">{item.category}</div>
// //               <div className="text-xl font-bold text-blue-900">{item.avg_response_time_hours || '—'} hrs</div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       <div>
// //         <h2 className="text-lg font-semibold mb-2">🔤 Word Cloud</h2>
// //         <div className="flex flex-wrap gap-2">
// //           {data.wordCloud.map((word, i) => (
// //             <span
// //               key={i}
// //               className={`px-3 py-1 rounded-full shadow ${getColorClass(i)} ${getFontSize(word.occurrences)}`}
// //             >
// //               {word.keyword}
// //             </span>
// //           ))}
// //         </div>
// //       </div>

// //       <div>
// //         <h2 className="text-lg font-semibold mb-2">📈 Monthly Feedback Report</h2>
// //         <table className="table w-full">
// //           <thead>
// //             <tr>
// //               <th>Month</th>
// //               <th>Feedback Type</th>
// //               <th>Section</th>
// //               <th>Total</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {data.monthlyReport?.map((item, idx) => (
// //               <tr key={idx}>
// //                 <td>{item.month}</td>
// //                 <td>{item.feedback_type}</td>
// //                 <td>{item.section}</td>
// //                 <td>{item.total}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // }
// 'use client';

// import { useEffect, useState, useCallback } from 'react';
// import { API_BASE_URL } from '@/app/config';
// import { toast } from 'react-hot-toast';


// interface AnalyticsData {
//   heatmap: { [section: string]: number };
//   slaDetails?: { category: string; avg_response_time_hours: string | null }[];
//   wordCloud: { keyword: string; occurrences: number }[];
//   monthlyReport?: { month: string; feedback_type: string; section: string; total: number }[];
// }

// interface SummaryStats {
//   total: number;
//   open: number;
//   resolved: number;
//   escalated: number;
//   byType: { feedback_type_name: string; count: number }[];
//   bySection: { section_name: string; count: number }[];
// }

// export default function AdminAnalyticsPage() {
//   const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
//   const [summary, setSummary] = useState<SummaryStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   // const fetchData = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const query = startDate && endDate ? `?start=${startDate}&end=${endDate}` : '';

//   //     const [heatmap, metrics, trends, monthly, stats] = await Promise.all([
//   //       fetch(`${API_BASE_URL}/api/feedback/dashboard/heatmap${query}`).then(r => r.json()),
//   //       fetch(`${API_BASE_URL}/api/feedback/dashboard/metrics${query}`).then(r => r.json()),
//   //       fetch(`${API_BASE_URL}/api/feedback/dashboard/trends${query}`).then(r => r.json()),
//   //       fetch(`${API_BASE_URL}/api/feedback/dashboard/monthly-report${query}`).then(r => r.json()),
//   //       fetch(`${API_BASE_URL}/api/feedback/stats`).then(r => r.json())
//   //     ]);

//   //     const heatmapData: Record<string, number> = {};
//   //     heatmap.forEach((entry: any) => {
//   //       const label = `${entry.section} (${entry.category})`;
//   //       heatmapData[label] = (heatmapData[label] || 0) + entry.count;
//   //     });

//   //     setAnalytics({
//   //       heatmap: heatmapData,
//   //       slaDetails: metrics,
//   //       wordCloud: trends,
//   //       monthlyReport: monthly,
//   //     });

//   //     setSummary(stats);
//   //   } catch (err) {
//   //     console.error('Failed to fetch analytics', err);
//   //     toast.error('Failed to load analytics');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

// const fetchData = useCallback(async () => {
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
// }, [startDate, endDate]); // 🧠 include only necessary deps


//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   if (loading) return <div className="p-6">Loading analytics...</div>;
//   if (!analytics || !summary) return <div className="p-6 text-red-500">No data available.</div>;

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
//       <h1 className="text-2xl font-bold">Feedback Analytics Dashboard</h1>

//       {/* 🔹 Overview Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="bg-gray-100 p-4 rounded shadow text-center">
//           <div className="text-lg font-semibold text-gray-700">Total</div>
//           <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
//         </div>
//         <div className="bg-yellow-100 p-4 rounded shadow text-center">
//           <div className="text-lg font-semibold text-yellow-700">Open</div>
//           <div className="text-2xl font-bold text-yellow-900">{summary.open}</div>
//         </div>
//         <div className="bg-green-100 p-4 rounded shadow text-center">
//           <div className="text-lg font-semibold text-green-700">Resolved</div>
//           <div className="text-2xl font-bold text-green-900">{summary.resolved}</div>
//         </div>
//         <div className="bg-red-100 p-4 rounded shadow text-center">
//           <div className="text-lg font-semibold text-red-700">Escalated</div>
//           <div className="text-2xl font-bold text-red-900">{summary.escalated}</div>
//         </div>
//       </div>

//       {/* 🔹 Breakdown by Feedback Type */}
//       <div>
//         <h2 className="text-lg font-semibold mb-2">📌 Feedbacks by Type</h2>
//         <ul className="list-disc pl-6">
//           {summary.byType.map((t, i) => (
//             <li key={i}>
//               {t.feedback_type_name}: {t.count}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* 🔹 Breakdown by Section */}
//       <div>
//         <h2 className="text-lg font-semibold mb-2">📁 Feedbacks by Section</h2>
//         <ul className="list-disc pl-6">
//           {summary.bySection.map((s, i) => (
//             <li key={i}>
//               {s.section_name}: {s.count}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* 🔹 Heatmap */}
//       <div>
//         <h2 className="text-lg font-semibold mb-2">📍 Heatmap by Section & Category</h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {Object.entries(analytics.heatmap).map(([label, count]) => (
//             <div key={label} className="p-3 bg-blue-200 hover:bg-blue-300 rounded shadow text-center">
//               <div className="font-semibold text-sm text-blue-900">{label}</div>
//               <div className="text-xl font-bold text-blue-800">{count}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 🔹 SLA Metrics */}
//       <div>
//         <h2 className="text-lg font-semibold mb-2">⏱ SLA Metrics</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {analytics.slaDetails?.map((item, idx) => (
//             <div key={idx} className="p-4 bg-blue-100 rounded shadow text-center">
//               <div className="text-sm text-blue-800 font-semibold">{item.category}</div>
//               <div className="text-xl font-bold text-blue-900">{item.avg_response_time_hours || '—'} hrs</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 🔹 Word Cloud */}
//       <div>
//         <h2 className="text-lg font-semibold mb-2">🔤 Word Cloud</h2>
//         <div className="flex flex-wrap gap-2">
//           {analytics.wordCloud.map((word, i) => (
//             <span
//               key={i}
//               className={`px-3 py-1 rounded-full shadow ${getColorClass(i)} ${getFontSize(word.occurrences)}`}
//             >
//               {word.keyword}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* 🔹 Monthly Trends */}
//       <div>
//         <h2 className="text-lg font-semibold mb-2">📈 Monthly Feedback Report</h2>
//         <table className="table w-full">
//           <thead>
//             <tr>
//               <th>Month</th>
//               <th>Type</th>
//               <th>Section</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {analytics.monthlyReport?.map((item, idx) => (
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
  byType: { name: string; count: number }[]; // Changed from feedback_type_name to name
  bySection: { name: string; count: number }[]; // Changed from section_name to name
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

      console.log('Raw stats data:', stats); // Debug log
      console.log('Raw heatmap data:', heatmap); // Debug log

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

      // Transform the data to match our interface
      const transformedStats: SummaryStats = {
        total: stats.total || 0,
        open: stats.open || 0,
        resolved: stats.resolved || 0,
        escalated: stats.escalated || 0,
        byType: Array.isArray(stats.byType) ? stats.byType.map((item: any) => ({
          name: item.name || item.feedback_type_name || 'Unknown Type',
          count: item.count || 0
        })) : [],
        bySection: Array.isArray(stats.bySection) ? stats.bySection.map((item: any) => ({
          name: item.name || item.section_name || 'Unknown Section',
          count: item.count || 0
        })) : []
      };

      console.log('Transformed stats:', transformedStats); // Debug log
      setSummary(transformedStats);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getFontSize = (count: number) => {
    if (count >= 10) return 'text-xl';
    if (count >= 5) return 'text-lg';
    if (count >= 3) return 'text-base';
    return 'text-sm';
  };

  const getColorIntensity = (count: number, maxCount: number) => {
    const intensity = Math.floor((count / maxCount) * 100);
    if (intensity >= 80) return 'badge-primary';
    if (intensity >= 60) return 'badge-secondary';
    if (intensity >= 40) return 'badge-accent';
    if (intensity >= 20) return 'badge-info';
    return 'badge-ghost';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  if (!analytics || !summary) {
    return (
      <div className="alert alert-error shadow-lg max-w-4xl mx-auto mt-8">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>No analytics data available. Please try again later.</span>
        </div>
      </div>
    );
  }

  const maxWordCount = Math.max(...analytics.wordCloud.map(w => w.occurrences));

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Analytics Dashboard</h1>
          <p className="text-base-content/70 mt-2">Comprehensive overview of feedback performance and trends</p>
        </div>
        
        {/* Date Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Start Date</span>
            </label>
            <input 
              type="date" 
              className="input input-bordered input-sm" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">End Date</span>
            </label>
            <input 
              type="date" 
              className="input input-bordered input-sm" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="form-control self-end">
            <button 
              className="btn btn-primary btn-sm"
              onClick={fetchData}
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat bg-base-100 rounded-lg shadow-sm border">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div className="stat-title">Total Feedbacks</div>
          <div className="stat-value text-primary">{summary.total}</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-sm border">
          <div className="stat-figure text-warning">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="stat-title">Open Cases</div>
          <div className="stat-value text-warning">{summary.open}</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-sm border">
          <div className="stat-figure text-success">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="stat-title">Resolved</div>
          <div className="stat-value text-success">{summary.resolved}</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-sm border">
          <div className="stat-figure text-error">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div className="stat-title">Escalated</div>
          <div className="stat-value text-error">{summary.escalated}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feedback Type Breakdown */}
        <div className="card bg-base-100 shadow-sm border">
          <div className="card-body">
            <h2 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Feedback by Type
            </h2>
            <div className="space-y-3">
              {summary.byType.length > 0 ? (
                summary.byType.map((type, index) => (
                  <div key={index} className="flex justify-between items-center p-3 hover:bg-base-200 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="font-medium text-base-content">{type.name}</span>
                    </div>
                    <span className="badge badge-primary badge-lg font-bold">{type.count}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-base-content/60">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No feedback type data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Breakdown */}
        <div className="card bg-base-100 shadow-sm border">
          <div className="card-body">
            <h2 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M17 10a1 1 0 01-1 1H4a1 1 0 110-2h12a1 1 0 011 1zM4 5a1 1 0 000 2h12a1 1 0 100-2H4zm0 8a1 1 0 100 2h12a1 1 0 100-2H4z" clipRule="evenodd" />
              </svg>
              Feedback by Section
            </h2>
            <div className="space-y-3">
              {summary.bySection.length > 0 ? (
                summary.bySection.map((section, index) => (
                  <div key={index} className="flex justify-between items-center p-3 hover:bg-base-200 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                      <span className="font-medium text-base-content">{section.name}</span>
                    </div>
                    <span className="badge badge-secondary badge-lg font-bold">{section.count}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-base-content/60">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No section data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the components remain the same */}
      {/* Heatmap Section */}
      <div className="card bg-base-100 shadow-sm border">
        <div className="card-body">
          <h2 className="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293A1 1 0 0118 6v10a1 1 0 01-.293.707L14 14.586V3.586l3.707 1.707z" clipRule="evenodd" />
            </svg>
            Feedback Distribution Heatmap
          </h2>
          <p className="text-base-content/70">Distribution across sections and categories</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {Object.entries(analytics.heatmap).map(([label, count], index) => (
              <div key={index} className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="card-body p-4 text-center">
                  <h3 className="card-title text-sm justify-center text-base-content/80">{label}</h3>
                  <p className="text-2xl font-bold text-accent">{count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SLA Metrics */}
      <div className="card bg-base-100 shadow-sm border">
        <div className="card-body">
          <h2 className="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            SLA Performance Metrics
          </h2>
          <p className="text-base-content/70">Average response time by category</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {analytics.slaDetails?.map((item, idx) => (
              <div key={idx} className="stat bg-base-200 rounded-lg">
                <div className="stat-title">{item.category}</div>
                <div className="stat-value text-info text-2xl">
                  {item.avg_response_time_hours ? `${parseFloat(item.avg_response_time_hours).toFixed(1)}h` : '—'}
                </div>
                <div className="stat-desc">Avg. Response Time</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Word Cloud */}
      <div className="card bg-base-100 shadow-sm border">
        <div className="card-body">
          <h2 className="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
            </svg>
            Keyword Trends
          </h2>
          <p className="text-base-content/70">Most frequent words in feedback descriptions</p>
          <div className="flex flex-wrap gap-3 mt-4 p-4 bg-base-200 rounded-lg">
            {analytics.wordCloud.map((word, i) => (
              <div
                key={i}
                className={`badge gap-2 ${getColorIntensity(word.occurrences, maxWordCount)} ${getFontSize(word.occurrences)} p-4`}
              >
                {word.keyword}
                <span className="text-xs opacity-70">({word.occurrences})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Report */}
      <div className="card bg-base-100 shadow-sm border">
        <div className="card-body">
          <h2 className="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Monthly Feedback Trends
          </h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Feedback Type</th>
                  <th>Section</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {analytics.monthlyReport?.map((item, idx) => (
                  <tr key={idx} className="hover">
                    <td className="font-medium">{item.month}</td>
                    <td>
                      <span className="badge badge-outline">{item.feedback_type}</span>
                    </td>
                    <td>{item.section}</td>
                    <td className="text-right">
                      <span className="font-bold text-warning">{item.total}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

