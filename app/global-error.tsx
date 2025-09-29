// 'use client';

// import { useEffect } from 'react';
// import { useTheme } from './components/ThemeProvider';

// export default function GlobalError({
//   error,
//   reset,
// }: {
//   error: Error & { digest?: string };
//   reset: () => void;
// }) {
//   const { theme } = useTheme();
  
//   useEffect(() => {
//     // Log the error to an error reporting service
//     console.error('Unhandled error:', error);
//   }, [error]);

//   return (
//     <html lang="en">
//       <body>
//         <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-900'}`}>
//           <div className={`text-center max-w-md p-8 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow-lg ${theme === 'light' ? 'border border-slate-200' : 'border border-slate-600'}`}>
//             <div className={`text-5xl font-bold ${theme === 'light' ? 'text-red-600' : 'text-red-400'} mb-4`}>Error</div>
//             <h2 className={`text-xl font-semibold mt-4 mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-slate-50'}`}>Something went wrong!</h2>
//             <p className={`${theme === 'light' ? 'text-slate-600' : 'text-slate-300'} mb-6`}>
//               We're sorry, but we encountered an unexpected error.
//             </p>
//             <button
//               onClick={() => reset()}
//               className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
//             >
//               Try again
//             </button>
//           </div>
//         </div>
//       </body>
//     </html>
//   );
// } 
'use client';

import { useEffect, useState } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Read theme from localStorage or <html data-theme>
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    let found: 'light' | 'dark' = 'light';
    if (typeof window !== 'undefined') {
      // Try localStorage
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') found = stored;
      // Fallback: html[data-theme]
      else if (document?.documentElement) {
        const attr = document.documentElement.getAttribute('data-theme');
        if (attr === 'dark' || attr === 'light') found = attr;
      }
    }
    setTheme(found);
    // Optionally log error
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
          <div className={`text-center max-w-md p-8 ${theme === 'dark' ? 'bg-slate-800 border border-slate-600' : 'bg-white border border-slate-200'} rounded-lg shadow-lg`}>
            <div className={`text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>Error</div>
            <h2 className={`text-xl font-semibold mt-4 mb-2 ${theme === 'dark' ? 'text-slate-50' : 'text-slate-900'}`}>Something went wrong!</h2>
            <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
              We're sorry, but we encountered an unexpected error.
            </p>
            <button
              onClick={reset}
              className={`btn ${theme === 'dark' ? 'bg-blue-400 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'} text-white border-0`}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
