'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { mockCompanies } from './mockData';
import { API_BASE_URL } from '../config';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import React from 'react';
import { useTheme } from '../components/ThemeProvider';

// Update the Company interface
interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  parentCompany: string | null;
  parent_id: string | null;
  status: string;
  hasSubcompanies: boolean;
  register_number?: string;
}

export default function ManageCompanies() {
  const { theme } = useTheme();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesList, setCompaniesList] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterParent, setFilterParent] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // State to track expanded companies
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({});
  // State to store child companies
  const [childCompanies, setChildCompanies] = useState<Record<string, Company[]>>({});
  // Loading state for child companies
  const [loadingChildren, setLoadingChildren] = useState<Record<string, boolean>>({});

  // New filter states
  const [filters, setFilters] = useState({
    parent_id: '',
    status: '',
  });

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      parent_id: '',
      status: ''
    });
    setSearchTerm('');
  };

  // Apply filters
  const applyFilters = async () => {
    // Clear cached child companies when filters change
    setChildCompanies({});
    
    // Reset expanded states when filters change
    setExpandedCompanies({});
    
    // Reset to page 1 when filters are applied
    setCurrentPage(1);
    
    await fetchCompanies(true);
  };

  // Toggle expanded state for a company
  const toggleCompanyExpanded = async (companyId: string) => {
    if (expandedCompanies[companyId]) {
      // If already expanded, just collapse
      setExpandedCompanies(prev => ({ ...prev, [companyId]: false }));
    } else {
      // If not expanded, expand and fetch children if we don't have them yet
      setExpandedCompanies(prev => ({ ...prev, [companyId]: true }));
      
      if (!childCompanies[companyId]) {
        await fetchChildCompanies(companyId);
      }
    }
  };

  // Fetch child companies for a parent
  const fetchChildCompanies = async (parentId: string) => {
    try {
      setLoadingChildren(prev => ({ ...prev, [parentId]: true }));
      
      const params = new URLSearchParams();
      params.append('parent_id', parentId);
      
      // Apply status filter if it's set
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      
      const response = await fetch(`${API_BASE_URL}/api/companies?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const formattedChildren: Company[] = data.map((comp: any) => ({
        id: comp.id.toString(),
        name: comp.company_name || '',
        address: comp.address || '',
        phone: comp.phone || '',
        email: comp.email || '',
        parentCompany: comp.parent_company_name || null,
        parent_id: comp.parent_id ? comp.parent_id.toString() : null,
        status: comp.is_active === 1 || comp.is_active === true ? 'active' : 'inactive',
        hasSubcompanies: comp.has_subcompanies || false,
        register_number: comp.register_number || '',
      }));
      
      setChildCompanies(prev => ({ ...prev, [parentId]: formattedChildren }));
    } catch (error) {
      console.error(`Error fetching child companies for parent ${parentId}:`, error);
    } finally {
      setLoadingChildren(prev => ({ ...prev, [parentId]: false }));
    }
  };

  const fetchCompanies1 = async (applyFilters = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query params for filtering
      const params = new URLSearchParams();
      
      // Handle search term
      if (searchTerm.length >= 2) {
        params.append('nameEmail', searchTerm);
        // When searching we don't apply parent_id filter to get all matches
      } 
      // Handle parent-child relationship filtering
      else {
        // Apply company relationship filter
        if (filters.parent_id) {
          if (filters.parent_id === 'empty') {
            params.append('parent_id', 'null');
          } else {
            // Show children of a specific parent
            params.append('parent_id', filters.parent_id);
          }
        } else {
          // Default view: only parent companies
          params.append('parent_id', 'null');
        }
      }
      
      // Apply status filter if set (works with any other filter)
      if (applyFilters && filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }

      // Handle sorting
      const sortField = sortBy === 'has_subcompanies' ? 'has_subcompanies' : `c.${sortBy}`;
      params.append('sortBy', sortField);
      params.append('sortOrder', sortOrder);
      
      // API call
      const apiBaseUrl = API_BASE_URL;
      const apiUrl = `${apiBaseUrl}/api/companies?${params.toString()}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} Message: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Map the API response to our Company interface
      const formattedCompanies: Company[] = data.map((comp: any) => ({
        id: comp.id.toString(),
        name: comp.company_name || '',
        address: comp.address || '',
        phone: comp.phone || '',
        email: comp.email || '',
        parentCompany: comp.parent_company_name || null,
        parent_id: comp.parent_id ? comp.parent_id.toString() : null,
        status: comp.is_active === 1 || comp.is_active === true ? 'active' : 'inactive',
        hasSubcompanies: comp.has_subcompanies || false,
        register_number: comp.register_number || '',
      }));
      
      setCompanies(formattedCompanies);
      
      // Pre-fetch children for parent companies when not searching
      if (searchTerm.length < 2) {
        formattedCompanies.forEach(company => {
          if (company.hasSubcompanies && !company.parent_id) {
            fetchChildCompanies(company.id);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      // Fallback to mock data if API fails
      //setCompanies(mockCompanies.filter(comp => !comp.parent_id));
      setError('Using mock data. Failed to fetch companies from API.');
    } finally {
      setLoading(false);
    }
  };

const fetchCompanies = useCallback(async (applyFilters = false) => {
  try {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();

    if (searchTerm.length >= 2) {
      params.append('nameEmail', searchTerm);
    } else {
      if (filters.parent_id) {
        if (filters.parent_id === 'empty') {
          params.append('parent_id', 'null');
        } else {
          params.append('parent_id', filters.parent_id);
        }
      } else {
        params.append('parent_id', 'null');
      }
    }

    if (applyFilters && filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }

    const sortField = sortBy === 'has_subcompanies' ? 'has_subcompanies' : `c.${sortBy}`;
    params.append('sortBy', sortField);
    params.append('sortOrder', sortOrder);

    const response = await fetch(`${API_BASE_URL}/api/companies?${params.toString()}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status} Message: ${response.statusText}`);

    const data = await response.json();
    const formattedCompanies: Company[] = data.map((comp: any) => ({
      id: comp.id.toString(),
      name: comp.company_name || '',
      address: comp.address || '',
      phone: comp.phone || '',
      email: comp.email || '',
      parentCompany: comp.parent_company_name || null,
      parent_id: comp.parent_id ? comp.parent_id.toString() : null,
      status: comp.is_active === 1 || comp.is_active === true ? 'active' : 'inactive',
      hasSubcompanies: comp.has_subcompanies || false,
      register_number: comp.register_number || '',
    }));

    setCompanies(formattedCompanies);

    if (searchTerm.length < 2) {
      formattedCompanies.forEach(company => {
        if (company.hasSubcompanies && !company.parent_id) {
          fetchChildCompanies(company.id);
        }
      });
    }
  } catch (error) {
    console.error('Error fetching companies:', error);
    setError('Using mock data. Failed to fetch companies from API.');
  } finally {
    setLoading(false);
  }
  // include every value read inside the function
}, [searchTerm, filters.parent_id, filters.status, sortBy, sortOrder]);


  const fetchAllCompanies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/companies`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} Message: ${response.statusText}`);
      }
      const data = await response.json();

      setCompaniesList(data.map((comp: any) => ({
        id: comp.id.toString(),
        name: comp.name,
      })));
    } catch (error) {
      console.error('Error fetching companies:', error);
      //setCompaniesList(mockCompanies);
      setError('Using mock data. Failed to fetch companies from API.');
    }
  };
  
  // // Fetch companies with filters
  // useEffect(() => {
  //   fetchCompanies(false); // Don't apply filters on initial load or sort changes
  // }, [sortBy, sortOrder]); // Remove filter dependencies

  // // Add live search effect
  // useEffect(() => {
  //   // Only search if term is at least 2 characters
  //   if (searchTerm.length >= 2 || searchTerm.length === 0) {
  //     const delaySearch = setTimeout(() => {
  //       // Reset to page 1 when search term changes
  //       setCurrentPage(1);
        
  //       // When searching, always maintain parent-child hierarchy
  //       fetchCompanies(true);
  //     }, 500); // Debounce search by 500ms
      
  //     return () => clearTimeout(delaySearch);
  //   }
  // }, [searchTerm]);

  // Initial load and when sort changes
useEffect(() => {
  fetchCompanies(false);
}, [fetchCompanies]);

// Live search (debounced)
useEffect(() => {
  if (searchTerm.length >= 2 || searchTerm.length === 0) {
    const delaySearch = setTimeout(() => {
      setCurrentPage(1);
      fetchCompanies(true);
    }, 500);
    return () => clearTimeout(delaySearch);
  }
}, [searchTerm, fetchCompanies]);


  useEffect(() => {
    fetchAllCompanies();
  }, [isFilterOpen]);

  // Get parent companies for filter dropdown
  const parentCompanies = companiesList.filter(company => !company.parent_id).map(company => ({
    id: company.id,
    name: company.name
  }));

  // Client-side filtering for immediate feedback
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = searchTerm.length < 2 || 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.email && company.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  // Calculate pagination (update to use filteredCompanies)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  // Smart pagination functions
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 3;

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    goToPage(pageNumber);
  };


  // Handle sort change
  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      // Set new sort field and reset order to ASC
      setSortBy(field);
      setSortOrder('ASC');
    }

    // If using mock data (no server), apply client-side sorting
    if (error && companies === mockCompanies) {
      let sortedCompanies = [...companies];
      const direction = sortOrder === 'ASC' ? 1 : -1;
      
      switch (field) {
        case 'has_subcompanies':
          sortedCompanies.sort((a, b) => {
            const aValue = a.hasSubcompanies ? 1 : 0;
            const bValue = b.hasSubcompanies ? 1 : 0;
            return (aValue - bValue) * direction;
          });
          break;
        case 'name':
          sortedCompanies.sort((a, b) => direction * a.name.localeCompare(b.name));
          break;
        case 'is_active':
          sortedCompanies.sort((a, b) => direction * a.status.localeCompare(b.status));
          break;
        case 'registration_number':
          sortedCompanies.sort((a, b) => {
            if (!a.register_number) return direction;
            if (!b.register_number) return -direction;
            return direction * a.register_number.localeCompare(b.register_number);
          });
          break;
        case 'parent_id':
          sortedCompanies.sort((a, b) => {
            const aParent = a.parentCompany || '';
            const bParent = b.parentCompany || '';
            return direction * aParent.localeCompare(bParent);
          });
          break;
        case 'email':
          sortedCompanies.sort((a, b) => {
            if (!a.email) return direction;
            if (!b.email) return -direction;
            return direction * a.email.localeCompare(b.email);
          });
          break;
        case 'phone_no':
          sortedCompanies.sort((a, b) => {
            if (!a.phone) return direction;
            if (!b.phone) return -direction;
            return direction * a.phone.localeCompare(b.phone);
          });
          break;
        case 'id':
          // For ID
          sortedCompanies.sort((a, b) => {
            const aValue = parseInt(a.id);
            const bValue = parseInt(b.id);
            return (aValue - bValue) * direction;
          });
          break;
        default:
          // No sorting
          break;
      }
      
      setCompanies(sortedCompanies);
    }
  };

  // ========= tiny utils =========

// ✅ helper (optional)
const loadXLSX = async () => {
  const mod = await import('xlsx');               // ESM/CJS safe
  return (mod as any).default ? (mod as any).default : mod;
};


const safeFetchJson = async <T,>(url: string): Promise<T | null> => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
};
const toYesNo = (v?: any) => (v === 1 || v === true ? 'Yes' : 'No');
const s = (v?: any) => (v ?? '') + '';
const d = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '');
const todayTag = () => new Date().toISOString().slice(0,10);

// simple concurrency control without extra deps
async function mapWithConcurrency<T, R>(items: T[], limit: number, worker: (item: T, idx: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length) as any;
  let i = 0;
  const runners = new Array(Math.min(limit, items.length)).fill(0).map(async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx], idx);
    }
  });
  await Promise.all(runners);
  return results;
}

// ========= ALL-IN-ONE EXPORT =========
// Exports ALL companies in current scope (search + filters), not just current page.
const exportAllDetailsXLSX = async () => {
  // base list = ALL filtered parents you’re showing across pages
  const parents = filteredCompanies; // <- this already respects search + filters in your UI

  if (!parents.length) {
    alert('No companies to export.');
    return;
  }

  // Prepare sheet arrays
  const companyInfo: any[] = [];
  const departmentsSheet: any[] = [];
  const employeesSheet: any[] = [];
  const leavesSheet: any[] = [];
  const officesSheet: any[] = [];
  const subsSheet: any[] = [];

  // Fetch detail for each company with controlled concurrency
  // Adjust endpoint paths here if your API differs.
  const CONCURRENCY = 5;

  await mapWithConcurrency(parents, CONCURRENCY, async (p) => {
    const companyId = p.id;

    const companyUrl       = `${API_BASE_URL}/api/companies/${companyId}`;
    const departmentsUrl   = `${API_BASE_URL}/api/departments?company_id=${companyId}`;
    const employeesUrl     = `${API_BASE_URL}/api/employees?company_id=${companyId}&limit=10000`;
    const leaveTypesUrl    = `${API_BASE_URL}/api/leave-types?company_id=${companyId}`;
    const officesUrl       = `${API_BASE_URL}/api/offices?company_id=${companyId}`;
    const subsidiariesUrl  = `${API_BASE_URL}/api/companies?parent_id=${companyId}`;

    const [
      companyRaw,
      departmentsRaw,
      employeesRaw,
      leaveTypesRaw,
      officesRaw,
      subsidiariesRaw
    ] = await Promise.all([
      safeFetchJson<any>(companyUrl),
      safeFetchJson<any[]>(departmentsUrl),
      safeFetchJson<any[]>(employeesUrl),
      safeFetchJson<any[]>(leaveTypesUrl),
      safeFetchJson<any[]>(officesUrl),
      safeFetchJson<any[]>(subsidiariesUrl),
    ]);

    // --- Company Info (parents only) ---
    const c = companyRaw ?? {};
    companyInfo.push({
      CompanyID: s(c.id || companyId),
      CompanyName: s(c.company_name ?? c.name ?? p.name),
      RegistrationNo: s(c.register_number ?? p.register_number),
      Email: s(c.email ?? p.email),
      Phone: s(c.phone ?? p.phone),
      Website: s(c.website),
      Status: c.is_active === 1 || c.is_active === true ? 'active' : (c.status ?? p.status ?? ''),
      ParentID: s(c.parent_id ?? p.parent_id),
      ParentName: s(c.parent_company_name ?? p.parentCompany),
      Address: s(c.address ?? p.address),
      EPF_No: s(c.epf_account_no),
      SOCSO_No: s(c.socso_account_no),
      IncomeTax_No: s(c.income_tax_no),
      CreatedAt: d(c.created_at),
      UpdatedAt: d(c.updated_at),
      HasSubsidiaries: p.hasSubcompanies ? 'Yes' : 'No',
    });

    // --- Departments ---
    for (const [i, dpt] of (departmentsRaw ?? []).entries()) {
      departmentsSheet.push({
        CompanyID: s(companyId),
        CompanyName: s(c.company_name ?? c.name ?? p.name),
        No: i + 1,
        DepartmentID: s(dpt.id),
        DepartmentName: s(dpt.department_name ?? dpt.name),
        Description: s(dpt.description),
        Status: toYesNo(dpt.is_active) === 'Yes' ? 'Active' : 'Inactive',
        CreatedAt: d(dpt.created_at),
        UpdatedAt: d(dpt.updated_at),
      });
    }

    // --- Employees ---
    for (const [i, emp] of (employeesRaw ?? []).entries()) {
      employeesSheet.push({
        CompanyID: s(companyId),
        CompanyName: s(c.company_name ?? c.name ?? p.name),
        No: i + 1,
        EmployeeID: s(emp.employee_no ?? emp.id),
        Name: s(emp.name),
        Email: s(emp.email),
        Department: s(emp.department_name ?? emp.department),
        Position: s(emp.position_title ?? emp.position),
        JoinedDate: d(emp.joined_date),
        Gender: s(emp.gender),
        Status: s(emp.status ?? (emp.is_active ? 'Active' : 'Inactive')),
      });
    }

    // --- Leave Types ---
    for (const [i, lt] of (leaveTypesRaw ?? []).entries()) {
      leavesSheet.push({
        CompanyID: s(companyId),
        CompanyName: s(c.company_name ?? c.name ?? p.name),
        No: i + 1,
        LeaveTypeID: s(lt.id),
        Name: s(lt.leave_type_name ?? lt.name),
        Code: s(lt.code),
        MaxDays: s(lt.max_days),
        RequiresApproval: toYesNo(lt.requires_approval),
        RequiresDocs: toYesNo(lt.requires_documentation ?? lt.requires_docs),
        Status: toYesNo(lt.is_active) === 'Yes' ? 'Active' : 'Inactive',
        CreatedAt: d(lt.created_at),
        UpdatedAt: d(lt.updated_at),
      });
    }

    // --- Offices ---
    for (const [i, ofc] of (officesRaw ?? []).entries()) {
      officesSheet.push({
        CompanyID: s(companyId),
        CompanyName: s(c.company_name ?? c.name ?? p.name),
        No: i + 1,
        OfficeID: s(ofc.id),
        Name: s(ofc.name),
        Address1: s(ofc.address_line1),
        Address2: s(ofc.address_line2),
        City: s(ofc.city),
        State: s(ofc.state),
        Country: s(ofc.country),
        Postcode: s(ofc.postcode),
        Timezone: s(ofc.timezone),
        Lat: s(ofc.lat),
        Lng: s(ofc.lng),
        Status: toYesNo(ofc.is_active) === 'Yes' ? 'Active' : 'Inactive',
        CreatedAt: d(ofc.created_at),
        UpdatedAt: d(ofc.updated_at),
      });
    }

    // --- Subsidiaries (separate sheet) ---
    for (const [i, sc] of (subsidiariesRaw ?? []).entries()) {
      subsSheet.push({
        ParentCompanyID: s(companyId),
        ParentCompanyName: s(c.company_name ?? c.name ?? p.name),
//        No: i + 1,
        CompanyID: s(sc.id),
        Name: s(sc.company_name ?? sc.name),
        RegistrationNo: s(sc.register_number),
        Email: s(sc.email),
        Phone: s(sc.phone),
        Status: sc.is_active === 1 || sc.is_active === true ? 'active' : (sc.status ?? ''),
      });
    }
  });

  // Build workbook
const XLSX = await loadXLSX(); // use the helper shown above
const wb = XLSX.utils.book_new();

const addSheet = (name: string, rows: any[]) => {
  if (rows.length === 0) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['No data']]), name);
  } else {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), name);
  }
};


  addSheet('Company Info', companyInfo);
  //addSheet('Departments', departmentsSheet);
  //addSheet('Employees', employeesSheet);
  //addSheet('Leaves', leavesSheet);
  //addSheet('Offices', officesSheet);
  addSheet('Subsidiaries', subsSheet);

  // Meta sheet
  const meta = [
    ['Generated At', new Date().toLocaleString()],
    ['Scope', 'ALL companies in current filter/search (ignores pagination)'],
    ['Companies (parents)', String(companyInfo.length)],
    ['Departments', String(departmentsSheet.length)],
    ['Employees', String(employeesSheet.length)],
    ['Leave Types', String(leavesSheet.length)],
    ['Offices', String(officesSheet.length)],
    ['Subsidiaries', String(subsSheet.length)],
    ['Filters', `status=${filters.status || 'All'}, parent_id=${filters.parent_id || 'Default (parents)'}, search="${searchTerm || ''}"`],
    ['Sort', `${sortBy} ${sortOrder}`],
  ];

//XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(meta), 'Report');


XLSX.writeFile(wb, `all_companies_full_report_${todayTag()}.xlsx`);
};


  return (
    <div className={`container mx-auto px-4 py-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
      {error && (
        <div className={`alert mb-6 ${theme === 'light' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-yellow-900 border-yellow-700 text-yellow-200'} border rounded-lg`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>{error}</span>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Manage Companies
        </h1>
        
        <div className="flex gap-2 justify-end">
            <button
    className={`btn ${theme === 'light' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600'} text-white border-0`}
    onClick={exportAllDetailsXLSX}
    title="Exports all companies (filtered) with departments, employees, leaves, offices, subsidiaries"
  >
    Export
  </button>
          <Link href="/companies/add" className="btn bg-blue-600 hover:bg-blue-700 text-white border-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Company
          </Link>
        </div>
      </div>
      
      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="form-control flex-1">
          <div className="input-group flex space-x-2">
            <input 
              type="text" 
              placeholder="Search companies by name or email..." 
              className={`input input-bordered ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
              value={searchTerm} 
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // Reset to page 1 immediately when search term changes
                if (currentPage !== 1) {
                  setCurrentPage(1);
                }
              }} 
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setCurrentPage(1);
                  fetchCompanies(true);
                }
              }}
            />
            <button className={`btn btn-square ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`} onClick={() => fetchCompanies(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'} p-4 rounded-lg mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Advanced Filters</h3>
            <button 
              className={`btn btn-sm btn-ghost ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-700'}`}
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
          
          <div className={`alert mb-4 text-sm ${theme === 'light' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-blue-900 border-blue-700 text-blue-200'} border rounded-lg`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">Company Hierarchy View</p>
              <p>The table shows parent companies by default. Click on a row to view its subsidiary companies.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Status Filter */}
            <div className="form-control">
              <label className="label">
                <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Status</span>
              </label>
              <select 
                name="status"
                className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            {/* Company Type Filter */}
            <div className="form-control">
              <label className="label">
                <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Company Relationship</span>
                <span className={`label-text-alt tooltip tooltip-left ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`} data-tip="Filter companies by their parent-child relationship">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </label>
              <select 
                name="parent_id"
                className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                value={filters.parent_id}
                onChange={handleFilterChange}
              >
                <option value="">All Companies</option>
                <option value="empty">Parent Companies Only</option>
                <optgroup label="Show Subsidiaries Of:">
                  {parentCompanies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </optgroup>
              </select>
              {filters.parent_id && filters.parent_id !== "empty" && (
                <div className={`mt-1 text-xs ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Showing subsidiaries of selected parent company
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="button"
              className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
              onClick={applyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Companies Table */}
      <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
        {/* Filter context indicator */}
        {filters.parent_id && !loading && (
          <div className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'} p-3 border-b ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'} flex items-center gap-2`}>
            <div className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Active filter:</div>
            <div className={`badge gap-1 ${theme === 'light' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-blue-900 text-blue-200 border-blue-700'} border`}>
              {filters.parent_id === 'empty' ? (
                <>Parent Companies Only</>
              ) : (
                <>
                  Subsidiaries of {parentCompanies.find(c => c.id === filters.parent_id)?.name || 'Selected Parent'}
                  <button 
                    className="ml-1" 
                    onClick={() => {
                      setFilters(prev => ({ ...prev, parent_id: '' }));
                      applyFilters();
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                  <th className="w-10"></th>
                  <th className={`text-center ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                    <div className="flex items-center justify-center">
                      No
                    </div>
                  </th>
                  <th className={`cursor-pointer ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`} onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Name
                      {sortBy === 'name' && (
                        <span className="ml-2">{sortOrder === 'ASC' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className={`cursor-pointer ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`} onClick={() => handleSort('id')}>
                    <div className="flex items-center">
                      Company ID
                      {sortBy === 'id' && (
                        <span className="ml-2">{sortOrder === 'ASC' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className={`cursor-pointer ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`} onClick={() => handleSort('email')}>
                    <div className="flex items-center">
                      Email
                      {sortBy === 'email' && (
                        <span className="ml-2">{sortOrder === 'ASC' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className={`cursor-pointer ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`} onClick={() => handleSort('phone_no')}>
                    <div className="flex items-center">
                      Phone
                      {sortBy === 'phone_no' && (
                        <span className="ml-2">{sortOrder === 'ASC' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className={`cursor-pointer ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`} onClick={() => handleSort('has_subcompanies')}>
                    <div className="flex items-center">
                      Subsidiaries
                      {sortBy === 'has_subcompanies' && (
                        <span className="ml-2">{sortOrder === 'ASC' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className={`cursor-pointer ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`} onClick={() => handleSort('is_active')}>
                    <div className="flex items-center">
                      Status
                      {sortBy === 'is_active' && (
                        <span className="ml-2">{sortOrder === 'ASC' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCompanies.map((company, index) => (
                  <React.Fragment key={company.id}>
                    <tr 
                      className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${company.hasSubcompanies ? 'cursor-pointer' : ''}`}
                      onClick={() => company.hasSubcompanies && toggleCompanyExpanded(company.id)}
                    >
                      <td className="p-0 pl-2">
                        {company.hasSubcompanies && (
                          <button 
                            className={`btn btn-sm btn-circle ${expandedCompanies[company.id] ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `btn-ghost ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-600'}`}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCompanyExpanded(company.id);
                            }}
                          >
                            {expandedCompanies[company.id] ? (
                              <FaChevronDown className="text-white" size={14} />
                            ) : (
                              <FaChevronRight className={`${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} size={14} />
                            )}
                          </button>
                        )}
                      </td>
                      <td className={`text-center ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td>
                        <div className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{company.name}</div>
                        {company.hasSubcompanies && (
                          <div className={`text-xs ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                            {expandedCompanies[company.id] ? 'Click to collapse' : 'Click to show subsidiaries'}
                          </div>
                        )}
                      </td>
                      <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{company.id}</td>
                      <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{company.email}</td>
                      <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{company.phone}</td>
                      <td>
                        {company.hasSubcompanies ? (
                          <span className={`badge badge-outline ${theme === 'light' ? 'border-blue-600 text-blue-600' : 'border-blue-400 text-blue-400'}`}>
                            YES
                          </span>
                        ) : "—"}
                      </td>
                      <td>
                        <div
                          className={`${
                            company.status === 'active' 
                              ? 'text-green-500' 
                              : 'text-red-500'
                          }`}
                        >
                          {company.status === 'active' ? 'Active' : 'Inactive'}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link href={`/companies/${company.id}`} className={`btn btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}>
                            View
                          </Link>                       
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Child Companies */}
                    {expandedCompanies[company.id] && (
                      <tr>
                        <td colSpan={9} className="p-0">
                          <div className={`p-4 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                            {loadingChildren[company.id] ? (
                              <div className="flex justify-center items-center p-4">
                                <span className={`loading loading-spinner loading-md ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
                              </div>
                            ) : childCompanies[company.id]?.length > 0 ? (
                              <div className="overflow-x-auto rounded-lg shadow-sm">
                                <table className="table table-sm">
                                  <thead className={`${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}`}>
                                    <tr>
                                      <th className="text-center">No</th>
                                      <th>Name</th>
                                      <th>Company ID</th>
                                      <th>Email</th>
                                      <th>Phone</th>
                                      <th className="text-center">Status</th>
                                      <th className="text-center">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {childCompanies[company.id].map((child, childIndex) => (
                                      <tr key={child.id} className={`${theme === 'light' ? 'bg-white hover:bg-slate-50' : 'bg-slate-800 hover:bg-slate-700'}`}>
                                        <td className={`text-center font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{childIndex + 1}</td>
                                        <td>
                                          <div className="flex items-center gap-2">
                                            <div className={`${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900'} p-1 rounded-full`}>
                                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                              </svg>
                                            </div>
                                            <span className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{child.name}</span>
                                          </div>
                                        </td>
                                        <td className={`font-mono text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{child.id}</td>
                                        <td><a href={`mailto:${child.email}`} className={`link link-hover ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>{child.email}</a></td>
                                        <td><a href={`tel:${child.phone}`} className={`link link-hover ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{child.phone}</a></td>
                                        <td className="text-center">
                                          <div
                                            className={`badge ${
                                              child.status === 'active' 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-red-500 text-white'
                                            }`}
                                          >
                                            {child.status === 'active' ? 'Active' : 'Inactive'}
                                          </div>
                                        </td>
                                        <td className="text-center">
                                          <Link href={`/companies/${child.id}`} className={`btn btn-xs ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}>
                                            View
                                          </Link>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className={`text-center py-4 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 mx-auto ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'} mb-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className={`${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>No subsidiary companies found</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {!loading && companies.length > 0 && (
        <div className="flex justify-center mt-6">
          <div className="btn-group">
            <button 
              className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button 
              className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            {getPageNumbers().map(page => (
              <button 
                key={page}
                className={`btn btn-sm ${currentPage === page ? 
                  `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
                  `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}
            <button 
              className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
            <button 
              className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>
      )}
      
      {/* No Results */}
      {!loading && filteredCompanies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 mx-auto ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'} mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>No companies found</h3>
            <p className={`mt-1 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
