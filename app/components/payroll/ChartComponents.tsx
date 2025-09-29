"use client";

import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  BarChart as ReBarChart, 
  Bar, 
  LineChart as ReLineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function PieChart({ data, theme }: { data: { name: string; value: number }[], theme: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RePieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: theme === 'light' ? '#fff' : '#374151',
            borderColor: theme === 'light' ? '#e5e7eb' : '#4b5563'
          }}
        />
      </RePieChart>
    </ResponsiveContainer>
  );
}

export function BarChart({ data, theme }: { data: { name: string; value: number }[], theme: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReBarChart data={data}>
        <XAxis dataKey="name" stroke={theme === 'light' ? '#666' : '#ccc'} />
        <YAxis stroke={theme === 'light' ? '#666' : '#ccc'} />
        <Tooltip 
          contentStyle={{
            backgroundColor: theme === 'light' ? '#fff' : '#374151',
            borderColor: theme === 'light' ? '#e5e7eb' : '#4b5563'
          }}
        />
        <Bar dataKey="value" fill="#8884d8" />
      </ReBarChart>
    </ResponsiveContainer>
  );
}

export function LineChart({ 
  data, 
  xKey, 
  yKeys, 
  colors, 
  theme 
}: { 
  data: any[], 
  xKey: string, 
  yKeys: string[], 
  colors: string[], 
  theme: string 
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReLineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#eee' : '#555'} />
        <XAxis 
          dataKey={xKey} 
          stroke={theme === 'light' ? '#666' : '#ccc'} 
        />
        <YAxis stroke={theme === 'light' ? '#666' : '#ccc'} />
        <Tooltip 
          contentStyle={{
            backgroundColor: theme === 'light' ? '#fff' : '#374151',
            borderColor: theme === 'light' ? '#e5e7eb' : '#4b5563'
          }}
        />
        <Legend />
        {yKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            activeDot={{ r: 8 }}
          />
        ))}
      </ReLineChart>
    </ResponsiveContainer>
  );
}