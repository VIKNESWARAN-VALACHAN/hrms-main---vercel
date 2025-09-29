// API Configuration

// Production URL
const LOCAL_URL= 'https://hrms-backend-2ymw.onrender.com';
//const LOCAL_URL= 'http://localhost:5001';
//const PREVIEW_URL= 'https://hrms-program-dev.onrender.com';
//const PRODUCTION_API_URL = 'https://hrms-service.onrender.com';
const PRODUCTION_API_URL = 'https://restore-minerals-immigration-recommends.trycloudflare.com';
const PREVIEW_URL= 'https://restore-minerals-immigration-recommends.trycloudflare.com';

// Export the appropriate API URL based on environment
let apiUrl;

if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
  apiUrl = PRODUCTION_API_URL;
} else if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
  apiUrl = PREVIEW_URL;
} else {
  apiUrl = LOCAL_URL;
}

export const API_BASE_URL = apiUrl;


// API Routes - aligned with backend structure
export const API_ROUTES = {
  // Announcements
  announcements: '/api/announcement/announcements',
  
  // Employees
  employees: '/api/admin/employees',
  
  // Companies
  companies: '/api/admin/companies',
  
  // Departments 
  departments: '/api/admin/departments',
  
  // Positions
  positions: '/api/admin/positions',
  
  // Attendance
  attendance: '/api/attendance',
  attendanceStats: '/api/attendance/stats',
  checkIn: '/api/attendance/check-in',
  checkOut: '/api/attendance/check-out',
  todayAttendance: '/api/attendance/today',
  attendanceHistory: '/api/attendance/history',
  attendanceData: '/api/attendance/attendances',
  departmentAttendance: '/api/attendance/department',
  attendanceAmendment: '/api/attendance/amendment',

  auth: '/api/auth',

  // inventory
  assets: '/api/inventory/assets',
  products: '/api/inventory/products',
  assetTypes: '/api/inventory/master/types',
  assetStatuses: '/api/inventory/master/statuses',

  assetGroups: '/api/inventory/asset-groups',
  stockMovements: '/api/inventory/stock-movements',
  importStock: '/api/inventory/stock/import',
  exportStock: '/api/inventory/stock/export',
  brands: '/api/inventory/master/brands',
  models: '/api/inventory/master/models',


  payrollConfig: '/api/payroll-config/configs',
  payrollProcess: {
    base: '/api/payroll/process',
    status: (month, year) => `/api/payroll/process/status/${month}/${year}`,
    lock: '/api/payroll/process/lock',
    unlock: '/api/payroll/process/unlock'
  }


}; 