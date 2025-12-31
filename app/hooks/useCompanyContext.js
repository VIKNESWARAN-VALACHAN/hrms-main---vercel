// frontend/hooks/useCompanyContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const CompanyContext = createContext();

export function CompanyProvider({ children }) {
  const [currentCompany, setCurrentCompany] = useState(null);
  const [userCompanies, setUserCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user's accessible companies on login
  const loadUserCompanies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      const user = JSON.parse(localStorage.getItem('hrms_user'));
      
      if (!token || !user) return;

      const response = await fetch(`${API_BASE_URL}/api/permissions/my-permissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success && data.permissions.accessible_companies) {
        setUserCompanies(data.permissions.accessible_companies);
        
        // Set default company if not set
        if (!currentCompany && data.permissions.accessible_companies.length > 0) {
          // Try to get from localStorage first
          const savedCompany = localStorage.getItem('current_company_id');
          if (savedCompany) {
            const company = data.permissions.accessible_companies.find(
              c => c.id === parseInt(savedCompany)
            );
            if (company) {
              setCurrentCompany(company);
            }
          } else {
            // Set to user's own company or first accessible company
            const ownCompany = data.permissions.accessible_companies.find(
              c => c.is_own_company
            ) || data.permissions.accessible_companies[0];
            setCurrentCompany(ownCompany);
            localStorage.setItem('current_company_id', ownCompany.id);
          }
        }
      }
    } catch (error) {
      console.error('Error loading user companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchCompany = (company) => {
    setCurrentCompany(company);
    localStorage.setItem('current_company_id', company.id);
    // You can also trigger a reload of company-specific data here
  };

  useEffect(() => {
    loadUserCompanies();
  }, []);

  return (
    <CompanyContext.Provider value={{
      currentCompany,
      userCompanies,
      loading,
      switchCompany,
      reloadCompanies: loadUserCompanies
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export const useCompany = () => useContext(CompanyContext);
