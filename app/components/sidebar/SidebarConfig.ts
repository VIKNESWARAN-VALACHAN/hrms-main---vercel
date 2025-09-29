// // src/components/sidebar/SidebarConfig.ts
// import type { IconType } from 'react-icons';
// import {
//   FiHome, FiUsers, FiSettings, 
//   FiCalendar, FiBell, FiClock, 
//   FiPieChart, FiLayers, FiAlertTriangle as FiAlertCircle, 
//   FiFileText, FiCheckSquare, FiCpu, 
//   FiUserPlus, FiEye, FiPlus, 
//   FiSettings as FiCog, FiMessageSquare, 
//   FiBarChart2, FiUser, FiGrid, FiAlertCircle as FiAlert,
//   FiTrendingUp, FiInbox, FiPackage
// } from 'react-icons/fi';

// export type Role = 'admin' | 'manager' | 'staff';

// export interface MenuItem {
//   title: string;
//   path: string;
//   icon: IconType;
//   subItems?: MenuItem[];
//   roles?: Role[];
// }

// export const sidebarMenu: MenuItem[] = [
//   {
//     title: 'Dashboard',
//     path: '/',
//     icon: FiHome
//   },
//   {
//     title: 'Announcements',
//     path: '/announcements',
//     icon: FiBell
//   },
//   {
//     title: 'Leave',
//     path: '/leaves',
//     icon: FiCalendar
//   },
//   {
//     title: 'Attendance',
//     path: '/attendance',
//     icon: FiClock
//   },
//   {
//     title: 'Company',
//     path: '/companies',
//     icon: FiLayers,
//     roles: ['admin'],
//     subItems: [
//       {
//         title: 'View Companies',
//         path: '/companies',
//         icon: FiEye
//       },
//       {
//         title: 'Add Company',
//         path: '/companies/add',
//         icon: FiPlus
//       }
//     ]
//   },
//   {
//     title: 'Employee',
//     path: '/employees',
//     icon: FiUsers,
//     roles: ['admin', 'manager'],
//     subItems: [
//       {
//         title: 'View Employees',
//         path: '/employees',
//         icon: FiEye
//       },
//       {
//         title: 'Add New Employee',
//         path: '/employees/add',
//         icon: FiUserPlus,
//         roles: ['admin']
//       }
//     ]
//   },
//   {
//     title: 'Asset Management',
//     path: '/admins/assets',
//     icon: FiPackage,
//     subItems: [
//       // Admin/Manager routes
//       {
//         title: 'All Assets',
//         path: '/admins/assets',
//         icon: FiGrid,
//         roles: ['admin', 'manager']
//       },
//       {
//         title: 'Asset Alerts',
//         path: '/admins/assets/alerts',
//         icon: FiAlert,
//         roles: ['admin', 'manager']
//       },
//       {
//         title: 'Reports',
//         path: '/admins/assets/reports',
//         icon: FiFileText,
//         roles: ['admin', 'manager']
//       },
//       {
//         title: 'Asset Requests',
//         path: '/admins/assets/approval',
//         icon: FiCheckSquare,
//         roles: ['admin', 'manager']
//       },
//       // Staff routes
//       {
//         title: 'My Asset Requests',
//         path: '/assets',
//         icon: FiInbox,
//         roles: ['staff']
//       },
//       {
//         title: 'Request New Asset',
//         path: '/assets/add',
//         icon: FiPlus,
//         roles: ['staff']
//       },
//       {
//         title: 'Assets Assigned To Me',
//         path: '/my-assets',
//         icon: FiPackage,
//         roles: ['staff']
//       }
//     ]
//   },
//   {
//     title: 'Feedback Management',
//     path: '/admins/feedbacks',
//     icon: FiMessageSquare,
//     roles: ['admin'],
//     subItems: [
//       {
//         title: 'All Feedbacks',
//         path: '/admins/feedbacks',
//         icon: FiMessageSquare
//       },
//       {
//         title: 'Analytics',
//         path: '/admins/analytics',
//         icon: FiTrendingUp
//       },
//       {
//         title: 'PIC Configuration',
//         path: '/admins/pic-config',
//         icon: FiUser
//       },
//       {
//         title: 'System Settings',
//         path: '/admins/settings',
//         icon: FiCog
//       }
//     ]
//   }
// ];

// export const getFilteredMenu = (role: Role): MenuItem[] => {
//   return sidebarMenu
//     .filter(item => !item.roles || item.roles.includes(role))
//     .map(item => {
//       if (item.subItems) {
//         return {
//           ...item,
//           subItems: item.subItems.filter(subItem => 
//             !subItem.roles || subItem.roles.includes(role)
//           )
//         };
//       }
//       return item;
//     });
// };

// src/components/sidebar/SidebarConfig.ts
import type { IconType } from 'react-icons';
import {
  FiHome, FiUsers, FiSettings,  // FiSettings replaces FiCog
  FiCalendar, FiBell, FiClock, 
  FiPieChart, FiLayers, FiAlertTriangle, 
  FiFileText, FiCheckSquare, FiCpu, 
  FiUserPlus, FiEye, FiPlus, 
  FiMessageSquare, 
  FiBarChart2, FiUser, FiGrid, FiAlertCircle,
  FiTrendingUp, FiInbox, FiPackage,
  FiDollarSign, FiDatabase, FiGlobe,
  FiCreditCard, FiArchive, FiAward,
  FiShield, FiBook, FiMapPin,
  FiTag, FiHardDrive, FiServer,
  FiTool, FiSun, FiMoon,
  FiChevronDown, FiChevronUp,
  FiMinusCircle // Add this as replacement for FiMinus
} from 'react-icons/fi';

export type Role = 'admin' | 'manager' | 'staff';

export interface MenuItem {
  title: string;
  path: string;
  icon: IconType;
  subItems?: MenuItem[];
  roles?: Role[];
  divider?: boolean; // Optional divider before this item
}

export const sidebarMenu: MenuItem[] = [
  // Core modules (visible to all)
  {
    title: 'Dashboard',
    path: '/',
    icon: FiHome
  },
  {
    title: 'Announcements',
    path: '/announcements',
    icon: FiBell
  },
  {
    title: 'Leave',
    path: '/leaves',
    icon: FiCalendar
  },
  {
    title: 'Attendance',
    path: '/attendance',
    icon: FiClock
  },

  // Administration modules
  {
    title: 'Company',
    path: '/companies',
    icon: FiLayers,
    roles: ['admin'],
    subItems: [
      {
        title: 'View Companies',
        path: '/companies',
        icon: FiEye
      },
      {
        title: 'Add Company',
        path: '/companies/add',
        icon: FiPlus
      }
    ]
  },
  {
    title: 'Employee',
    path: '/employees',
    icon: FiUsers,
    roles: ['admin', 'manager'],
    subItems: [
      {
        title: 'View Employees',
        path: '/employees',
        icon: FiEye
      },
      {
        title: 'Add New Employee',
        path: '/employees/add',
        icon: FiUserPlus,
        roles: ['admin']
      }
    ]
  },
  {
    title: 'Admin',
    path: '/admins',
    icon: FiShield,
    roles: ['admin'],
    subItems: [
      {
        title: 'View Admins',
        path: '/admins',
        icon: FiEye
      },
      {
        title: 'Add New Admin',
        path: '/admins/add',
        icon: FiUserPlus
      },
      {
        title: 'Admin Settings',
        path: '/admin-settings',
        icon: FiSettings 
      }
    ]
  },

  // Asset Management
  {
    title: 'Asset Management',
    path: '/admins/assets',
    icon: FiPackage,
    subItems: [
      // Admin/Manager routes
      {
        title: 'All Assets',
        path: '/admins/assets',
        icon: FiGrid,
        roles: ['admin', 'manager']
      },
      {
        title: 'Asset Alerts',
        path: '/admins/assets/alerts',
        icon: FiAlertCircle,
        roles: ['admin', 'manager']
      },
      {
        title: 'Reports',
        path: '/admins/assets/reports',
        icon: FiFileText,
        roles: ['admin', 'manager']
      },
      {
        title: 'Asset Requests',
        path: '/admins/assets/approval',
        icon: FiCheckSquare,
        roles: ['admin', 'manager']
      },
      // Staff routes
      {
        title: 'My Asset Requests',
        path: '/assets',
        icon: FiInbox,
        roles: ['staff']
      },
      {
        title: 'Request New Asset',
        path: '/assets/add',
        icon: FiPlus,
        roles: ['staff']
      },
      {
        title: 'Assets Assigned To Me',
        path: '/my-assets',
        icon: FiPackage,
        roles: ['staff']
      }
    ]
  },

  // Feedback System
  {
    title: 'Feedback',
    path: '/feedback',
    icon: FiMessageSquare,
    roles: ['staff'],
    subItems: [
      {
        title: 'New Feedback',
        path: '/feedback',
        icon: FiPlus
      },
      {
        title: 'My Feedbacks',
        path: '/feedback/my-feedbacks',
        icon: FiInbox
      }
    ]
  },
  {
    title: 'Feedback Management',
    path: '/admins/feedbacks',
    icon: FiMessageSquare,
    roles: ['admin'],
    subItems: [
      {
        title: 'All Feedbacks',
        path: '/admins/feedbacks',
        icon: FiMessageSquare
      },
      {
        title: 'Analytics',
        path: '/admins/analytics',
        icon: FiTrendingUp
      },
      {
        title: 'PIC Configuration',
        path: '/admins/pic-config',
        icon: FiUser
      }
    ]
  },

  // Payroll Management
  {
    title: 'Payroll',
    path: '/payslip',
    icon: FiDollarSign,
    roles: ['admin', 'manager'],
    subItems: [
      {
        title: 'Payroll Report',
        path: '/payslip',
        icon: FiFileText
      },
      {
        title: 'Payroll Config',
        path: '/payroll-config',
        icon: FiSettings
      },
      {
        title: 'Payroll Processing',
        path: '/payroll-processing',
        icon: FiCpu
      },
      {
        title: 'Payroll Preview',
        path: '/admins/payrolls',
        icon: FiEye
      }
    ]
  },

  // Bank & Currency
  {
    title: 'Bank & Currency',
    path: '/config/banks',
    icon: FiCreditCard,
    roles: ['admin', 'manager'],
    subItems: [
      {
        title: 'Bank Management',
        path: '/config/banks',
        icon: FiCreditCard
      },
      {
        title: 'Currency Codes',
        path: '/config/currency-codes',
        icon: FiGlobe
      },
      {
        title: 'Exchange Rates',
        path: '/exchange-rates',
        icon: FiTrendingUp
      },
      {
        title: 'Currency Rates',
        path: '/config/currency-rates',
        icon: FiDollarSign
      }
    ]
  },

  // Master Data Configuration
  {
    title: 'Master Data',
    path: '/master-data/allowances',
    icon: FiDatabase,
    roles: ['admin'],
    subItems: [
      // Payroll Master Data
      {
        title: 'Allowances',
        path: '/master-data/allowances',
        icon: FiPlus,
        divider: true
      },
      {
        title: 'Deductions',
        path: '/master-data/deductions',
        icon: FiSettings 
      },
      {
        title: 'Tax Reliefs',
        path: '/master-data/reliefs',
        icon: FiAward
      },
      {
        title: 'EPF',
        path: '/master-data/epf',
        icon: FiArchive
      },
      {
        title: 'SOCSO',
        path: '/master-data/socso',
        icon: FiShield
      },
      {
        title: 'EIS',
        path: '/master-data/eis',
        icon: FiAlertCircle
      },
      {
        title: 'PCB',
        path: '/master-data/pcb',
        icon: FiBook
      },

      // Feedback System Master Data
      {
        title: 'Departments/Sections',
        path: '/admins/masters/sections',
        icon: FiGrid,
        divider: true
      },
      {
        title: 'Feedback Categories',
        path: '/admins/masters/categories',
        icon: FiTag
      },
      {
        title: 'Feedback Types',
        path: '/admins/masters/feedback-types',
        icon: FiMessageSquare
      },
      {
        title: 'Priority Levels',
        path: '/admins/masters/priority-levels',
        icon: FiAlertTriangle
      },
      {
        title: 'Status Types',
        path: '/admins/masters/status',
        icon: FiCheckSquare
      },

      // Asset Management Master Data
      {
        title: 'Locations',
        path: '/admins/assets/locations',
        icon: FiMapPin,
        divider: true
      },
      {
        title: 'Brands',
        path: '/admins/assets/brands',
        icon: FiTag
      },
      {
        title: 'Models',
        path: '/admins/assets/models',
        icon: FiCpu
      },
      {
        title: 'Types',
        path: '/admins/assets/types',
        icon: FiServer
      },
      {
        title: 'Statuses',
        path: '/admins/assets/statuses',
        icon: FiCheckSquare
      },
      {
        title: 'Units',
        path: '/admins/assets/units',
        icon: FiHardDrive
      },
      {
        title: 'Categories',
        path: '/admins/assets/categories',
        icon: FiGrid
      },
      {
        title: 'Products',
        path: '/admins/assets/products',
        icon: FiPackage
      },

      // System
      {
        title: 'Version Logs',
        path: '/version-logs',
        icon: FiBook,
        divider: true
      }
    ]
  },

  // System Configuration
  {
    title: 'Configuration',
    path: '/config/holiday',
    icon: FiSettings,
    roles: ['admin'],
    subItems: [
      {
        title: 'Holiday Calendar',
        path: '/config/holiday',
        icon: FiCalendar
      }
    ]
  }
];

export const getFilteredMenu = (role: Role): MenuItem[] => {
  return sidebarMenu
    .filter(item => !item.roles || item.roles.includes(role))
    .map(item => {
      if (item.subItems) {
        return {
          ...item,
          subItems: item.subItems.filter(subItem => 
            !subItem.roles || subItem.roles.includes(role)
          )
        };
      }
      return item;
    });
};