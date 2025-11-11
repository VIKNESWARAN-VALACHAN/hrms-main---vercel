

// frontend/components/Sidebar.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { useRouter, usePathname } from "next/navigation";
import PasswordChangeModal from "./PasswordChangeModal";
import { useModuleAccess } from "../hooks/useModuleAccess";

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ onCollapseChange }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  
  // Use permission hook - it should handle fallback to role-based access
  const { hasAccess, can, loading: permissionsLoading, hasCustomPermissions } = useModuleAccess();

  const [role, setRole] = useState<string>("");
  const [lastOpenedMenu, setLastOpenedMenu] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  // ---------- Permission check helper with fallback ----------
// ---------- Permission check helper with fallback ----------
const shouldShow = (module: string, requiredPermission?: string) => {
  // If custom permissions are configured, check them first
  if (hasCustomPermissions) {
    // Check if we have explicit custom permission for this module
    const hasExplicitPermission = requiredPermission ? can(requiredPermission) : hasAccess(module);
    
    // If we have explicit custom permission (either granted or denied), use it
    if (hasExplicitPermission !== undefined && hasExplicitPermission !== null) {
      return hasExplicitPermission;
    }
    
    // If no explicit custom permission, fall back to role-based access
    // This handles cases where custom permissions exist but this specific module isn't configured
  }
  
  // Fallback to role-based access
  switch (module) {
    case 'Dashboard':
      return true; // Everyone can see dashboard
    case 'Announcement':
      return true;
    case 'Leave':
      return true;
    case 'Attendance':
      return true;
    case 'Employee':
      return role === "admin" || role === "manager" || role === "employee";
    case 'Company':
      return role === "admin";
    case 'Scheduler':
      return role === "admin" ;
    case 'AssetManagement':
      return true;
    case 'Feedback':
      return true;
    case 'Payslip':
      return role !== "admin"; // Staff only
    case 'Payroll':
      return role === "admin";
    case 'Claims':
      return true;
    case 'MasterData':
      return role === "admin";
    case 'Configuration':
      return role === "admin";
    case 'Admin':
      return role === "admin";
    default:
      return false;
  }
};

  // Check specific permissions for sub-items
  const hasPermission = (permission: string) => {
    if (hasCustomPermissions) {
      return can(permission);
    }
    // For role-based fallback, most granular permissions are handled in the component logic
    return true;
  };

  // ---------- helpers ----------
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const toggleMenu = (menuId: string) => {
    if (lastOpenedMenu === menuId) {
      setLastOpenedMenu(null);
      localStorage.removeItem("lastOpenedMenu");
    } else {
      setLastOpenedMenu(menuId);
      localStorage.setItem("lastOpenedMenu", menuId);
    }
  };

  const toggleSubmenu = (key: string) =>
    setOpenSubmenus((s) => ({ ...s, [key]: !s[key] }));

  const isPayrollRoute = (p: string) => {
    const payrollPrefixes = [
      "/admins/payrolls",
      "/master-data/allowances",
      "/master-data/deductions",
      "/master-data/epf",
      "/master-data/socso",
      "/master-data/eis",
      "/master-data/pcb",
      "/master-data/reliefs",
      "/admins/payroll-config",
      "/admins/payroll-policy-assignment",
      "/admins/payroll-config-allowance",
      "/admins/payroll-config-deduction",
      "/admins/bank-currency",
      "/admins/overtime",
      "/admins/employee-allowances",
      "/admins/employee-deductions",
      "/admins/employee-reliefs",
      "/admins/claim",
    ];
    return payrollPrefixes.some((prefix) => p.startsWith(prefix));
  };

  const isFeedbackAdminRoute = (p: string) =>
    p.startsWith("/admins/feedbacks") ||
    p.startsWith("/admins/analytics") ||
    p.startsWith("/admins/pic-config") ||
    p.startsWith("/admins/settings");

  // Master Data items that are NOT payroll (avoid double highlight)
  const isStandaloneMasterDataRoute = (p: string) =>
    p.startsWith("/version-logs") ||
    p.startsWith("/admins/masters") ||
    p.startsWith("/admins/assets/locations") ||
    p.startsWith("/admins/assets/brands") ||
    p.startsWith("/admins/assets/models") ||
    p.startsWith("/admins/assets/types") ||
    p.startsWith("/admins/assets/statuses") ||
    p.startsWith("/admins/assets/units") ||
    p.startsWith("/admins/assets/categories") ||
    p.startsWith("/admins/assets/products") ||
    (p.startsWith("/master-data") &&
      !isPayrollRoute(p) &&
      !p.startsWith("/master-data/disciplinary_types"));

  // Determine which parent menu should be opened for current route
  const getActiveParentMenu = () => {
    if (pathname.startsWith("/companies") || pathname.startsWith("/company"))
      return "manage-company";

    if (pathname.startsWith("/employees") || pathname.startsWith("/employee"))
      return "manage-employee";

    if (isPayrollRoute(pathname)) return "payroll-management";

    if (isFeedbackAdminRoute(pathname)) return "admin-panel";

    if (
      pathname.startsWith("/admins/scheduler") ||
      pathname.startsWith("/admins/schedules") ||
      pathname.startsWith("/admins/Test1")
    )
      return "scheduler";

    if (pathname === "/admins" || pathname.startsWith("/admins/add") || pathname.startsWith("/admin-settings"))
      return "manage-admin";

    if (
      pathname.startsWith("/admins/claims") ||
      pathname.startsWith("/admins/ApprovalFlow")
    )
      return "claim-management";

    if (pathname.startsWith("/feedback")) return "user-feedback";

    if (pathname.startsWith("/config/holiday")) return "config-management";

    if (isStandaloneMasterDataRoute(pathname)) return "master-data";

    if (
      pathname.startsWith("/assets") ||
      pathname.startsWith("/my-assets") ||
      pathname.startsWith("/admins/assets") ||
      pathname.startsWith("/admin/assets")
    )
      return "asset-management";

    return null;
  };

  // ---------- lifecycle ----------
  useEffect(() => {
    const user = localStorage.getItem("hrms_user");
    if (user) {
      const userData = JSON.parse(user);
      setRole(userData.role);
    }

    const last = localStorage.getItem("lastOpenedMenu");
    setLastOpenedMenu(last);

    // Force expanded (no collapsed mode)
    setIsCollapsed(false);
    localStorage.removeItem("sidebar_collapsed");
    onCollapseChange?.(false);

    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    handleResize();

    // open proper parent on route change
    const parent = getActiveParentMenu();
    if (parent && last !== parent) {
      setLastOpenedMenu(parent);
      localStorage.setItem("lastOpenedMenu", parent);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCollapseChange, pathname]);

  // ---------- actions ----------
  const toggleMobileSidebar = () => setIsMobileOpen((v) => !v);

  const handleMobileNavigation = () => {
    if (isMobileView || window.innerWidth < 768) setIsMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("hrms_user");
    localStorage.removeItem("hrms_authenticated");
    localStorage.removeItem("hrms_token");
    localStorage.removeItem("hrms_refresh_token");
    localStorage.removeItem("viewedAnnouncements");
    localStorage.removeItem("hrms_role");
    router.push("/auth/login");
  };

  // Show loading while permissions are being fetched
  if (permissionsLoading) {
    return (
      <aside className="fixed left-0 top-0 h-screen z-30 bg-gradient-to-b from-blue-400 to-indigo-900 text-white w-64 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-2">Loading permissions...</p>
        </div>
      </aside>
    );
  }

  const MobileBackdrop = () => (
    <div
      className={`fixed inset-0 z-20 md:hidden transition-opacity duration-300 ${
        isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={toggleMobileSidebar}
    />
  );

  // small utility to make icons consistently legible
  const iconCls = "h-5 w-5 mr-3 opacity-90 text-white";
  const caretCls = (open: boolean) =>
    `h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`;

  // ---------- render ----------
  return (
    <>
      <MobileBackdrop />

      {/* Mobile menu FAB */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-30 md:hidden btn btn-primary btn-circle shadow-lg"
        aria-label="Toggle mobile menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen z-30 bg-gradient-to-b from-blue-400 to-indigo-900 text-white flex flex-col shadow-lg transition-all duration-300 dark:bg-gray-800
                    w-64 overflow-y-auto overflow-x-hidden
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        data-theme={theme}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="text-2xl font-bold">HRMS</div>

          <div className="flex items-center gap-2">
            {/* Dark / Light toggle */}
            <label className="swap swap-rotate">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={toggleTheme}
                aria-label="Toggle dark mode"
                className="hidden"
              />
              {/* moon (dark on) */}
              <svg className="swap-on h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Z" />
              </svg>
              {/* sun (light on) */}
<svg className="swap-off h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
</svg>
            </label>

            {/* Close (mobile) */}
            <button
              onClick={toggleMobileSidebar}
              className="md:hidden btn btn-ghost btn-square btn-sm text-white hover:text-blue-200"
              aria-label="Close mobile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Items with HYBRID PERMISSION CHECKS */}
        <ul className="menu menu-vertical bg-transparent w-full space-y-1 mt-4 flex-grow px-2">
          
{/* Dashboard - Everyone has access */}
<li>
  <Link
    href="/"
    className={`px-4 py-3 rounded-lg transition-all duration-300 ${
      isActive("/") ? "bg-blue-600 text-white font-semibold shadow-md" : "hover:bg-blue-500"
    }`}
    onClick={handleMobileNavigation}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-7 9 7M5 10v10h14V10" />
    </svg>
    <span>Dashboard</span>
  </Link>
</li>

{/* Announcement */}
{shouldShow('Announcement') && (
  <li>
    <Link
      href="/announcements"
      className={`px-4 py-3 rounded-lg transition-all duration-300 ${
        isActive("/announcements") ? "bg-blue-600 text-white font-semibold shadow-md" : "hover:bg-blue-500"
      }`}
      onClick={handleMobileNavigation}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5v10l-3-2H5a2 2 0 01-2-2V7a2 2 0 012-2h6z" />
      </svg>
      <span>Announcement</span>
    </Link>
  </li>
)}

{/* Leave */}
{shouldShow('Leave') && (
<li>
  <Link
    href="/leaves"
    className={`px-4 py-3 rounded-lg transition-all duration-300 ${
      isActive("/leaves") ? "bg-blue-600 text-white font-semibold shadow-md" : "hover:bg-blue-500"
    }`}
    onClick={handleMobileNavigation}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14" />
    </svg>
    <span>Leave</span>
  </Link>
</li>
)}

{/* Attendance */}
{shouldShow('Attendance') && (
<li>
  <Link
    href="/attendance"
    className={`px-4 py-3 rounded-lg transition-all duration-300 ${
      isActive("/attendance") ? "bg-blue-600 text-white font-semibold shadow-md" : "hover:bg-blue-500"
    }`}
    onClick={handleMobileNavigation}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M12 4a8 8 0 100 16 8 8 0 000-16z" />
    </svg>
    <span>Attendance</span>
  </Link>
</li>
)}

{/* Employee Management */}
{shouldShow('Employee') && (
<li>
  <button
    onClick={() => toggleMenu("manage-employee")}
    aria-expanded={lastOpenedMenu === "manage-employee"}
    className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
      pathname.startsWith("/employees") || pathname.startsWith("/employee")
        ? "bg-blue-600 text-white font-semibold shadow-md"
        : "hover:bg-blue-500"
    }`}
  >
    <div className="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a3 3 0 11-6 0 3 3 0 016 0zM4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
      </svg>
      <span>
        {(!hasCustomPermissions && role === "employee") || 
        (hasCustomPermissions && hasAccess('Employee.View') && !hasAccess('Employee.Create')) 
        ? "My Profile" : "Employee"}
      </span>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "manage-employee")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "manage-employee" ? "block" : "hidden"}`}>
    {/* View Employees/My Profile */}
    <li>
      <Link
        href="/employees"
        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
          pathname === "/employees" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
        }`}
        onClick={handleMobileNavigation}
      >
        {(!hasCustomPermissions && role === "employee") || 
        (hasCustomPermissions && hasAccess('Employee.View') && !hasAccess('Employee.Create')) 
        ? "View My Profile" : "View Employees"}
      </Link>
    </li>
    
    {/* Add New Employee - only for admin or with create permission */}
    {(!hasCustomPermissions && role === "admin") || 
    (hasCustomPermissions && hasAccess('Employee.Create')) ? (
      <li>
        <Link
          href="/employees/add"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/employees/add" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Add New Employee
        </Link>
      </li>
    ) : null}
    
    {/* Disciplinary types - only for admin or with disciplinary permission */}
    {(!hasCustomPermissions && role === "admin") || 
    (hasCustomPermissions && hasAccess('Employee.Disciplinary')) ? (
      <li>
        <Link
          href="/master-data/disciplinary_types"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/master-data/disciplinary_types" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Disciplinary Types
        </Link>
      </li>
    ) : null}
  </ul>
</li>
)}

{/* Company Management */}
{shouldShow('Company') && (
  <li>
    <button
      onClick={() => toggleMenu("manage-company")}
      aria-expanded={lastOpenedMenu === "manage-company"}
      className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
        pathname.startsWith("/companies") || pathname.startsWith("/company")
          ? "bg-blue-600 text-white font-semibold shadow-md"
          : "hover:bg-blue-500"
      }`}
    >
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 21V5a2 2 0 012-2h12a2 2 0 012 2v16" />
        </svg>
        <span>Company</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "manage-company")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "manage-company" ? "block" : "hidden"}`}>
      {/* View Companies */}
      <li>
        <Link
          href="/companies"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/companies" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          View Companies
        </Link>
      </li>
      
      {/* Add Company */}
      {shouldShow('Company') && (
        <li>
          <Link
            href="/companies/add"
            className={`py-2 px-4 rounded-lg transition-all duration-300 ${
              pathname === "/companies/add" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
            }`}
            onClick={handleMobileNavigation}
          >
            Add Company
          </Link>
        </li>
      )}
    </ul>
  </li>
)}

{/* Scheduler */}
{shouldShow('Scheduler') && (
  <li>
    <Link
      href="/admins/schedules"
      onClick={handleMobileNavigation}
      className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
        pathname.startsWith("/admins/scheduler") ||
        pathname.startsWith("/admins/schedules") ||
        pathname.startsWith("/admins/Test1")
          ? "bg-blue-600 text-white font-semibold shadow-md"
          : "hover:bg-blue-500"
      }`}
    >
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconCls}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14" />
        </svg>
        <span>Scheduler</span>
      </div>
       {/* Remove or comment out this debugging badge */}
      {/* {hasCustomPermissions && (
        <span className="text-xs bg-green-500 px-1 rounded">Custom</span>
      )} */}
    </Link>
  </li>
)}

{/* Asset Management - Professional Design */}
{shouldShow('AssetManagement') && (
  <li>
    <div className="flex items-center group">
      {/* Main clickable area that goes to dashboard */}
      <Link
        href="/admins/assets"
        className={`flex-1 flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
          (pathname.startsWith("/admins/assets") ||
            pathname.startsWith("/admin/assets") ||
            pathname.startsWith("/assets") ||
            pathname.startsWith("/my-assets")) &&
          !pathname.startsWith("/admins/assets/locations") &&
          !pathname.startsWith("/admins/assets/brands") &&
          !pathname.startsWith("/admins/assets/models") &&
          !pathname.startsWith("/admins/assets/types") &&
          !pathname.startsWith("/admins/assets/statuses") &&
          !pathname.startsWith("/admins/assets/units") &&
          !pathname.startsWith("/admins/assets/categories") &&
          !pathname.startsWith("/admins/assets/products")
            ? "bg-blue-600 text-white font-semibold shadow-md"
            : "text-blue-50 hover:bg-blue-500/80"
        }`}
        onClick={handleMobileNavigation}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8 6l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <span className="flex-1">Asset Management</span>
      </Link>
      
      {/* Separate dropdown toggle button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMenu("asset-management");
        }}
        className={`p-2 mr-2 rounded-lg transition-all duration-200 ${
          lastOpenedMenu === "asset-management" 
            ? "bg-blue-500/30 text-white" 
            : "text-blue-100 hover:bg-blue-500/50 hover:text-white"
        }`}
        aria-label="Toggle asset menu"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform duration-200 ${
            lastOpenedMenu === "asset-management" ? "rotate-180" : ""
          }`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <ul className={`menu menu-compact mt-1 ml-4 border-l-2 border-blue-300/30 ${lastOpenedMenu === "asset-management" ? "block" : "hidden"}`}>
      
      {/* Admin/Manager Views - Show for admins/managers or users with AssetManagement access */}
      {(role === "admin" || role === "manager") && (
        <>
          {/* New Asset */}
          <li>
            <Link
              href="/admins/assets/add"
              className={`py-2.5 px-4 rounded-r-lg transition-all duration-200 border-l-2 border-transparent hover:border-blue-300 ${
                pathname === "/admins/assets/add" 
                  ? "bg-blue-500/20 text-white font-medium border-blue-300" 
                  : "text-blue-100 hover:bg-blue-500/30"
              }`}
              onClick={handleMobileNavigation}
            >
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Asset
              </span>
            </Link>
          </li>

          {/* Asset Reports */}
          <li>
            <Link
              href="/admins/assets/reports"
              className={`py-2.5 px-4 rounded-r-lg transition-all duration-200 border-l-2 border-transparent hover:border-blue-300 ${
                pathname === "/admins/assets/reports" 
                  ? "bg-blue-500/20 text-white font-medium border-blue-300" 
                  : "text-blue-100 hover:bg-blue-500/30"
              }`}
              onClick={handleMobileNavigation}
            >
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Asset Reports
              </span>
            </Link>
          </li>

          {/* Asset Requests */}
          <li>
            <Link
              href="/admins/assets/approval"
              className={`py-2.5 px-4 rounded-r-lg transition-all duration-200 border-l-2 border-transparent hover:border-blue-300 ${
                pathname === "/admins/assets/approval" 
                  ? "bg-blue-500/20 text-white font-medium border-blue-300" 
                  : "text-blue-100 hover:bg-blue-500/30"
              }`}
              onClick={handleMobileNavigation}
            >
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Asset Requests
              </span>
            </Link>
          </li>

          {/* Alerts */}
          <li>
            <Link
              href="/admins/assets/alerts"
              className={`py-2.5 px-4 rounded-r-lg transition-all duration-200 border-l-2 border-transparent hover:border-blue-300 ${
                pathname === "/admins/assets/alerts" 
                  ? "bg-blue-500/20 text-white font-medium border-blue-300" 
                  : "text-blue-100 hover:bg-blue-500/30"
              }`}
              onClick={handleMobileNavigation}
            >
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Alerts
              </span>
            </Link>
          </li>
        </>
      )}
      
      {/* Employee self-service - Show for non-admin/non-manager users */}
      {(role !== "admin" && role !== "manager") && (
        <>
          <li>
            <Link
              href="/assets"
              className={`py-2.5 px-4 rounded-r-lg transition-all duration-200 border-l-2 border-transparent hover:border-blue-300 ${
                pathname === "/assets" 
                  ? "bg-blue-500/20 text-white font-medium border-blue-300" 
                  : "text-blue-100 hover:bg-blue-500/30"
              }`}
              onClick={handleMobileNavigation}
            >
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                My Asset Requests
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/assets/add"
              className={`py-2.5 px-4 rounded-r-lg transition-all duration-200 border-l-2 border-transparent hover:border-blue-300 ${
                pathname === "/assets/add" 
                  ? "bg-blue-500/20 text-white font-medium border-blue-300" 
                  : "text-blue-100 hover:bg-blue-500/30"
              }`}
              onClick={handleMobileNavigation}
            >
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Request New Asset
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/my-assets"
              className={`py-2.5 px-4 rounded-r-lg transition-all duration-200 border-l-2 border-transparent hover:border-blue-300 ${
                pathname === "/my-assets" 
                  ? "bg-blue-500/20 text-white font-medium border-blue-300" 
                  : "text-blue-100 hover:bg-blue-500/30"
              }`}
              onClick={handleMobileNavigation}
            >
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Assets Assigned To Me
              </span>
            </Link>
          </li>
        </>
      )}
    </ul>
  </li>
)}

{/* Feedback Management (Admin) */}
{shouldShow('Feedback') && role === "admin" && (
  <li>
    <button
      onClick={() => toggleMenu("admin-panel")}
      aria-expanded={lastOpenedMenu === "admin-panel"}
      className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
        isFeedbackAdminRoute(pathname)
          ? "bg-blue-600 text-white font-semibold shadow-md"
          : "hover:bg-blue-500"
      }`}
    >
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5" />
        </svg>
        <span>Feedback Management</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "admin-panel")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "admin-panel" ? "block" : "hidden"}`}>
      <li>
        <Link
          href="/admins/feedbacks"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/feedbacks" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          All Feedbacks
        </Link>
      </li>
      <li>
        <Link
          href="/admins/analytics"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/analytics" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Analytics
        </Link>
      </li>
      <li>
        <Link
          href="/admins/pic-config"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/pic-config" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          PIC Configuration
        </Link>
      </li>
      <li>
        <Link
          href="/admins/settings"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/settings" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          System Settings
        </Link>
      </li>
    </ul>
  </li>
)}

{/* Payslips (Staff) */}
{shouldShow('Payslip') && (
  <li>
    <Link
      href="/payslips"
      className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
        pathname.startsWith("/payslips") ? "bg-blue-600 text-white font-semibold shadow-md" : "hover:bg-blue-500"
      }`}
      onClick={handleMobileNavigation}
    >
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3v5h5M9 12h6m-6 4h6M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
        </svg>
        <span>Payslips</span>
      </div>
    </Link>
  </li>
)}

{/* Feedback (Staff) */}
{shouldShow('Feedback') && role !== "admin" && (
  <li>
    <button
      onClick={() => toggleMenu("user-feedback")}
      aria-expanded={lastOpenedMenu === "user-feedback"}
      className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
        pathname.startsWith("/feedback") ? "bg-blue-600 text-white font-semibold shadow-md" : "hover:bg-blue-500"
      }`}
    >
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5" />
        </svg>
        <span>Feedback</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "user-feedback")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "user-feedback" ? "block" : "hidden"}`}>
      <li>
        <Link
          href="/feedback"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/feedback" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          New Feedback
        </Link>
      </li>
      <li>
        <Link
          href="/feedback/my-feedbacks"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/feedback/my-feedbacks" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          My Feedbacks
        </Link>
      </li>
    </ul>
  </li>
)}

{/* PAYROLL (Admin) */}
{shouldShow('Payroll') && (
  <li>
    <button
      onClick={() => toggleMenu("payroll-management")}
      aria-expanded={lastOpenedMenu === "payroll-management"}
      className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
        isPayrollRoute(pathname) ? "bg-blue-600 text-white font-semibold shadow-md" : "hover:bg-blue-500"
      }`}
    >
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
        </svg>
        <span>Payroll</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "payroll-management")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "payroll-management" ? "block" : "hidden"}`}>
      {/* Payroll Run */}
      <li>
        <Link
          href="/admins/payrolls"
          className={`py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-300 ${
            pathname === "/admins/payrolls" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.7 0-3 .9-3 2s1.3 2 3 2 3 .9 3 2-1.3 2-3 2m0-8V7m0 10v2" />
          </svg>
          Payroll Run
        </Link>
      </li>

      {/* Setup Section */}
      <li className="mt-2 mb-1 pl-2 text-xs font-semibold text-blue-200 uppercase">Setup</li>

      {/* Pay Items */}
      <li>
        <button className="w-full text-left py-2 px-4 rounded-lg hover:bg-blue-500" onClick={() => toggleSubmenu("payroll-setup-payitems")}>
          <span className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h10" />
            </svg>
            Pay Items
          </span>
        </button>
        <ul className={`menu menu-compact pl-6 ${openSubmenus["payroll-setup-payitems"] ? "block" : "hidden"}`}>
          <li>
            <Link
              href="/master-data/allowances"
              className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                pathname === "/master-data/allowances" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                </svg>
                Allowances
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/master-data/deductions"
              className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                pathname === "/master-data/deductions" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                </svg>
                Deductions
              </span>
            </Link>
          </li>
        </ul>
      </li>

      {/* Statutory & Tax */}
      <li>
        <button className="w-full text-left py-2 px-4 rounded-lg hover:bg-blue-500" onClick={() => toggleSubmenu("payroll-setup-statutory")}>
          <span className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 21V10m10 11V10" />
            </svg>
            Statutory &amp; Tax
          </span>
        </button>
        <ul className={`menu menu-compact pl-6 ${openSubmenus["payroll-setup-statutory"] ? "block" : "hidden"}`}>
          <li>
            <Link
              href="/master-data/epf"
              className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                pathname === "/master-data/epf" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              EPF
            </Link>
          </li>
          <li>
            <Link
              href="/master-data/socso"
              className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                pathname === "/master-data/socso" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              SOCSO
            </Link>
          </li>
          <li>
            <Link
              href="/master-data/eis"
              className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                pathname === "/master-data/eis" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              EIS
            </Link>
          </li>
          <li>
            <Link
              href="/master-data/pcb"
              className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                pathname === "/master-data/pcb" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              PCB
            </Link>
          </li>
          <li>
            <Link
              href="/master-data/reliefs"
              className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                pathname === "/master-data/reliefs" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              Tax Reliefs
            </Link>
          </li>
        </ul>
      </li>

      {/* Configuration */}
      <li>
        <button className="w-full text-left py-2 px-4 rounded-lg hover:bg-blue-500" onClick={() => toggleSubmenu("payroll-setup-config")}>
          <span className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h12M4 17h8" />
            </svg>
            Configuration
          </span>
        </button>
        <ul className={`menu menu-compact pl-6 ${openSubmenus["payroll-setup-config"] ? "block" : "hidden"}`}>
          <li>
            <Link
              href="/admins/payroll-config-allowance"
              className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                pathname === "/admins/payroll-config-allowance" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              Allowance Mapping
            </Link>
          </li>
          <li>
            <Link
              href="/admins/payroll-config-deduction"
              className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                pathname === "/admins/payroll-config-deduction" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              Deduction Mapping
            </Link>
          </li>
          <li>
            <Link
              href="/admins/payroll-config"
              className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                pathname === "/admins/payroll-config" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              Payroll Config
            </Link>
          </li>
          <li>
            <Link
              href="/admins/payroll-policy-assignment"
              className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                pathname === "/admins/payroll-policy-assignment" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              Payroll Policy Assignment
            </Link>
          </li>
          <li>
            <Link
              href="/admins/bank-currency"
              className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                pathname.startsWith("/admins/bank-currency") ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              Bank &amp; Currency
            </Link>
          </li>
          <li>
            <Link
              href="/admins/overtime"
              className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                pathname.startsWith("/admins/overtime") ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              Attendance Configuration
            </Link>
          </li>
        </ul>
      </li>

      {/* Employee Overrides */}
      <li>
        <button className="w-full text-left py-2 px-4 rounded-lg hover:bg-blue-500" onClick={() => toggleSubmenu("payroll-setup-overrides")}>
          <span className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Allowance / Deduction
          </span>
        </button>
        <ul className={`menu menu-compact pl-6 ${openSubmenus["payroll-setup-overrides"] ? "block" : "hidden"}`}>
          <li>
            <Link
              href="/admins/employee-allowances"
              className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                pathname === "/admins/employee-allowances" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              Allowances
            </Link>
          </li>
          <li>
            <Link
              href="/admins/employee-deductions"
              className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                pathname === "/admins/employee-deductions" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              Deductions
            </Link>
          </li>
          <li>
            <Link
              href="/admins/employee-reliefs"
              className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                pathname === "/admins/employee-reliefs" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              Reliefs
            </Link>
          </li>
        </ul>
      </li>

      {/* Claims (paid via payroll) */}
      <li>
        <button className="w-full text-left py-2 px-4 rounded-lg hover:bg-blue-500" onClick={() => toggleSubmenu("payroll-setup-claims")}>
          <span className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 12a5 5 0 0110 0v3a5 5 0 01-10 0v-3z" />
            </svg>
            Claims
          </span>
        </button>
        <ul className={`menu menu-compact pl-6 ${openSubmenus["payroll-setup-claims"] ? "block" : "hidden"}`}>
          <li>
            <Link
              href="/admins/claim"
              className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                pathname === "/admins/claim" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              Claim Benefit
            </Link>
          </li>
        </ul>
      </li>
    </ul>
  </li>
)}

{/* My Claims (Staff) */}
{shouldShow('Claims') && role !== "admin" && (
  <li>
    <Link
      href="/claims"
      className={`py-2 px-4 flex items-center rounded-lg transition-all duration-300 ${
        pathname === "/claims" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
      }`}
      onClick={handleMobileNavigation}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
      </svg>
      My Claims
    </Link>
  </li>
)}

{/* Claim Management (Admin) */}
{shouldShow('Claims') && role === "admin" && (
  <li>
    <button
      onClick={() => toggleMenu("claim-management")}
      aria-expanded={lastOpenedMenu === "claim-management"}
      className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
        pathname.startsWith("/admins/claims") || pathname.startsWith("/admins/ApprovalFlow")
          ? "bg-blue-600 text-white font-semibold shadow-md"
          : "hover:bg-blue-500"
      }`}
    >
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405M19 13v-3a8 8 0 10-16 0v3" />
        </svg>
        <span>Claim Management</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "claim-management")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "claim-management" ? "block" : "hidden"}`}>
      <li>
        <Link
          href="/admins/claims"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/claims" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          All Claims
        </Link>
      </li>
    </ul>
  </li>
)}

{/* Master Data (Admin) */}
{shouldShow('MasterData') && (
  <li>
    <button
      onClick={() => toggleMenu("master-data")}
      aria-expanded={lastOpenedMenu === "master-data"}
      className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
        isStandaloneMasterDataRoute(pathname)
          ? "bg-blue-600 text-white font-semibold shadow-md"
          : "hover:bg-blue-500"
      }`}
    >
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        <span>Master Data</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "master-data")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "master-data" ? "block" : "hidden"}`}>
      
      {/* Feedback System masters */}
      <li className="mt-4 mb-1 pl-2 text-xs font-semibold text-blue-200 uppercase">Feedback System</li>
      <li>
        <Link
          href="/admins/masters/sections"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/masters/sections" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Departments/Sections
        </Link>
      </li>
      <li>
        <Link
          href="/admins/masters/categories"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/masters/categories" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Feedback Categories
        </Link>
      </li>
      <li>
        <Link
          href="/admins/masters/feedback-types"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/masters/feedback-types" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Feedback Types
        </Link>
      </li>
      <li>
        <Link
          href="/admins/masters/priority-levels"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/masters/priority-levels" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Priority Levels
        </Link>
      </li>
      <li>
        <Link
          href="/admins/masters/status"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/masters/status" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Status Types
        </Link>
      </li>

      {/* Asset masters (under Master Data) */}
      <li className="mt-4 mb-1 pl-2 text-xs font-semibold text-blue-200 uppercase">Asset Management</li>
      <li>
        <Link
          href="/admins/assets/locations"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/assets/locations" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Locations
        </Link>
      </li>
      <li>
        <Link
          href="/admins/assets/brands"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/assets/brands" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Brands
        </Link>
      </li>
      <li>
        <Link
          href="/admins/assets/models"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/assets/models" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Models
        </Link>
      </li>
      <li>
        <Link
          href="/admins/assets/types"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/assets/types" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Types
        </Link>
      </li>
      <li>
        <Link
          href="/admins/assets/statuses"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/assets/statuses" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Statuses
        </Link>
      </li>
      <li>
        <Link
          href="/admins/assets/units"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/assets/units" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Units
        </Link>
      </li>
      <li>
        <Link
          href="/admins/assets/categories"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/assets/categories" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Categories
        </Link>
      </li>
      <li>
        <Link
          href="/admins/assets/products"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/assets/products" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Products
        </Link>
      </li>

      {/* System */}
      <li className="mt-4 mb-1 pl-2 text-xs font-semibold text-blue-200 uppercase">System</li>
      <li>
        <Link
          href="/version-logs"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/version-logs" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Version Logs
        </Link>
      </li>
    </ul>
  </li>
)}

{/* Configuration (Public Holidays) */}
{shouldShow('Configuration') && (
  <li>
    <button
      onClick={() => toggleMenu("config-management")}
      aria-expanded={lastOpenedMenu === "config-management"}
      className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
        pathname.startsWith("/config/holiday")
          ? "bg-blue-600 text-white font-semibold shadow-md"
          : "hover:bg-blue-500"
      }`}
    >
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h4m-7 8h10M5 21h14" />
        </svg>
        <span>Configuration</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "config-management")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "config-management" ? "block" : "hidden"}`}>
      <li>
        <Link
          href="/config/holiday"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/config/holiday" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Public Holidays
        </Link>
      </li>
    </ul>
  </li>
)}

{/* Admin (user management) */}
{shouldShow('Admin') && (
  <li>
    <button
      onClick={() => toggleMenu("manage-admin")}
      aria-expanded={lastOpenedMenu === "manage-admin"}
      className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
        pathname === "/admins" || pathname === "/admins/add" || pathname.startsWith("/admin-settings")
          ? "bg-blue-600 text-white font-semibold shadow-md"
          : "hover:bg-blue-500"
      }`}
    >
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
        </svg>
        <span>Admin</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "manage-admin")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "manage-admin" ? "block" : "hidden"}`}>
      <li>
        <Link
          href="/admins"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          View Admin
        </Link>
      </li>
      <li>
        <Link
          href="/admins/add"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/add" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          Add New Admin
        </Link>
      </li>
      <li>
        <Link
          href="/admins/permissions"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/admins/permissions" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          User Permissions
        </Link>
      </li>
    </ul>
  </li>
)}
        </ul>

        {/* Footer actions */}
        <div className="mt-auto p-4">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="btn btn-primary w-full gap-2 mb-2"
            aria-label="Change Password"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 10-6 0v2c0 1.657 1.343 3 3 3zm-5 3h10v6H7v-6z" />
            </svg>
            <span>Change Password</span>
          </button>

          <button
            onClick={handleLogout}
            className="btn btn-error w-full gap-2"
            aria-label="Logout"
          >
 <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    aria-hidden="true"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
    />
  </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Required props for modal */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
}
