export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  parentCompany: string | null;
  status: string;
  companyCode: string;
  register_number?: string;
  hasSubcompanies: boolean;
  parent_id: string | null;
}

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'info@acme.com',
    phone: '+1-555-123-4567',
    address: '123 Main St, New York, NY',
    parentCompany: null,
    parent_id: null,
    status: 'active',
    register_number: '1234567890',
    companyCode: 'ACM001',
    hasSubcompanies: true
  },
  {
    id: '2',
    name: 'Acme Software Division',
    email: 'software@acme.com',
    phone: '+1-555-123-7890',
    address: '124 Main St, New York, NY',
    parentCompany: 'Acme Corporation',
    parent_id: '1',
    status: 'active',
    register_number: '1234567890',
    companyCode: 'ASD002',
    hasSubcompanies: false
  },
  {
    id: '3',
    name: 'Global Enterprises',
    email: 'contact@globalent.com',
    phone: '+1-555-987-6543',
    address: '456 Business Ave, Chicago, IL',
    parentCompany: null,
    parent_id: null,
    status: 'active',
    register_number: '1234567890',
    companyCode: 'GLE003',
    hasSubcompanies: true
  },
  {
    id: '4',
    name: 'Global Consulting Group',
    email: 'consulting@globalent.com',
    phone: '+1-555-987-1234',
    address: '458 Business Ave, Chicago, IL',
    parentCompany: 'Global Enterprises',
    parent_id: '3',
    status: 'active',
    register_number: '1234567890',
    companyCode: 'GCG004',
    hasSubcompanies: false
  },
  {
    id: '5',
    name: 'Tech Innovations Inc',
    email: 'hello@techinnovations.com',
    phone: '+1-555-789-0123',
    address: '789 Tech Blvd, San Francisco, CA',
    parentCompany: null,
    parent_id: null,
    status: 'inactive',
    register_number: '1234567890',
    companyCode: 'TII005',
    hasSubcompanies: false
  }
]; 