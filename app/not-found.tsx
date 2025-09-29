'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from './components/ThemeProvider';

export default function NotFound() {
  const router = useRouter();
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-900'}`}>
      <div className={`text-center max-w-md p-8 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow-lg ${theme === 'light' ? 'border border-slate-200' : 'border border-slate-600'}`}>
        <h1 className={`text-9xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>404</h1>
        <h2 className={`text-2xl font-semibold mt-4 mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-slate-50'}`}>Page Not Found</h2>
        <p className={`${theme === 'light' ? 'text-slate-600' : 'text-slate-300'} mb-6`}>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={() => router.back()} 
            className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
          >
            Go Back
          </button>
          <Link href="/" className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 