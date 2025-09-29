// // src/components/sidebar/SidebarItem.tsx
// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useState } from 'react';
// import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
// import { MenuItem } from './SidebarConfig';

// export default function SidebarItem({
//   item,
//   isCollapsed,
//   role
// }: {
//   item: MenuItem;
//   isCollapsed: boolean;
//   role?: string;
// }) {
//   const pathname = usePathname();
//   const [isOpen, setIsOpen] = useState(false);

//   // Check role permissions
//   if (item.roles && (!role || !item.roles.includes(role))) return null;

//   const isActive = pathname === item.path || 
//                  (item.path !== '/' && pathname.startsWith(item.path));

//   const hasSubItems = item.subItems && item.subItems.length > 0;

//   return (
//     <li className="mb-1">
//       {hasSubItems ? (
//         <>
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className={`flex items-center w-full p-3 rounded-lg transition-colors ${
//               isActive ? 'bg-blue-600 text-white' : 'hover:bg-blue-500 hover:text-white'
//             }`}
//           >
//             <item.icon className="w-5 h-5" />
//             {!isCollapsed && (
//               <>
//                 <span className="ml-3">{item.title}</span>
//                 {isOpen ? (
//                   <FiChevronDown className="ml-auto" />
//                 ) : (
//                   <FiChevronRight className="ml-auto" />
//                 )}
//               </>
//             )}
//           </button>
//           {!isCollapsed && isOpen && (
//             <ul className="ml-8 mt-1">
//               {item.subItems?.map((subItem) => (
//                 <SidebarItem 
//                   key={subItem.path} 
//                   item={subItem} 
//                   isCollapsed={isCollapsed}
//                   role={role}
//                 />
//               ))}
//             </ul>
//           )}
//         </>
//       ) : (
//         <Link
//           href={item.path}
//           className={`flex items-center p-3 rounded-lg transition-colors ${
//             isActive ? 'bg-blue-600 text-white' : 'hover:bg-blue-500 hover:text-white'
//           }`}
//         >
//           <item.icon className="w-5 h-5" />
//           {!isCollapsed && <span className="ml-3">{item.title}</span>}
//         </Link>
//       )}
//     </li>
//   );
// }
// app/components/sidebar/SidebarItem.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { MenuItem, Role } from './SidebarConfig';
import clsx from 'clsx';

interface SidebarItemProps {
  item: MenuItem;
  isCollapsed: boolean;
  role?: Role;
  currentPath?: string;
}

export default function SidebarItem({
  item,
  isCollapsed,
  role,
  currentPath,
}: SidebarItemProps) {
  const pathnameFromRouter = usePathname(); 
  const pathname = currentPath ?? pathnameFromRouter;
  //const pathname = currentPath || usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (item.roles && (!role || !item.roles.includes(role))) return null;

  const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
  const hasSubItems = item.subItems && item.subItems.length > 0;

  const baseStyles = clsx(
    'flex items-center w-full p-3 rounded-lg transition duration-300',
    isActive
      ? 'bg-blue-800 text-white font-semibold shadow-md border-l-4 border-white'
      : 'text-white hover:bg-blue-500'
  );

  return (
    <li className="mb-1">
      {hasSubItems ? (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={baseStyles}
            title={isCollapsed ? item.title : undefined}
            aria-expanded={isOpen}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!isCollapsed && (
              <>
                <span className="ml-3 truncate">{item.title}</span>
                {isOpen ? <FiChevronDown className="ml-auto" /> : <FiChevronRight className="ml-auto" />}
              </>
            )}
          </button>
          {!isCollapsed && isOpen && (
            <ul className="ml-6 mt-1 space-y-1 border-l border-blue-300 pl-3">
              {item.subItems?.map((subItem) => (
                <SidebarItem
                  key={subItem.path}
                  item={subItem}
                  isCollapsed={isCollapsed}
                  role={role}
                  currentPath={pathname}
                />
              ))}
            </ul>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={baseStyles}
          title={isCollapsed ? item.title : undefined}
        >
          <item.icon className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="ml-3 truncate">{item.title}</span>}
        </Link>
      )}
    </li>
  );
}
