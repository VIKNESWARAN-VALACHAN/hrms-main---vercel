import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "./components/Layout";
//import { ThemeProvider } from "./components/ThemeProvider";
import AuthProvider from "./components/AuthProvider";
import FetchInterceptor from "./components/FetchInterceptor";
import { Toaster } from 'react-hot-toast';
import { useTheme, ThemeProvider } from "./components/ThemeProvider";
import Sidebar from './components/sidebar/Sidebar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HRMS - Human Resource Management System",
  description: "A comprehensive HR management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider>
          <AuthProvider>
            <FetchInterceptor />
            <Layout>{children}</Layout>
          </AuthProvider>
        </ThemeProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}


// //new


// // app/layout.tsx
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Layout from "./components/Layout";
// import AuthProvider from "./components/AuthProvider";
// import FetchInterceptor from "./components/FetchInterceptor";
// import { Toaster } from 'react-hot-toast';
// import { ThemeProvider } from "./components/ThemeProvider";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "HRMS - Human Resource Management System",
//   description: "A comprehensive HR management system",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       {/* <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
//       > */}
//      <body
//   className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white dark:bg-slate-900`}
// >

//         <ThemeProvider>
//           <AuthProvider>
//             <FetchInterceptor />
//             <Layout>{children}</Layout>
//             <Toaster position="top-right" />
//           </AuthProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }


//             // <div className="flex">
//             //   {/* Sidebar will be rendered by Layout component */}
//             //   <Layout>{children}</Layout>
//             // </div>