// views/ListEmployeesView.jsx
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import SearchArea from '@/shared/components/common/cev/SearchArea';
import { EmployeeHeader, EmployeeGrid } from '../components/list-employees';
import employeeService from '../services/employeeService';

export default function ListEmployeesView() {
  const { t } = useTranslation();
  const [perPage] = useState(8);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState({ role: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const MIN_SEARCH_LEN = 2;

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.getAllEmployees();
      if (response.success) {
        setItems(response.data);
      } else {
        setError('Failed to fetch employees');
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployeeByName = useCallback(async (fullName) => {
    if (!fullName || !fullName.trim()) {
      return fetchEmployees();
    }

    const value = fullName.trim();

    if (value.length < MIN_SEARCH_LEN) {
      setError(null);
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);

      // Try exact search first
      try {
        const response = await employeeService.getEmployeeByName(value);
        if (response.success && response.data) {
          const dataArray = Array.isArray(response.data) ? response.data : [response.data];
          setItems(dataArray);
          return;
        }
      } catch (err) {
        // Exact search failed, try contains search
      }

      // Fallback to contains search
      const all = await employeeService.getAllEmployees();
      if (all.success && Array.isArray(all.data)) {
        const lower = value.toLowerCase();
        const filtered = all.data.filter(emp =>
          (emp.fullName && emp.fullName.toLowerCase().includes(lower)) ||
          (emp.firstName && emp.firstName.toLowerCase().includes(lower)) ||
          (emp.lastName && emp.lastName.toLowerCase().includes(lower))
        );
        setItems(filtered);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('Error fetching employee by name:', err);
      setItems([]);
    } finally {
      setSearchLoading(false);
    }
  }, [fetchEmployees]);

  useEffect(() => {
    const search = filter.search?.trim() || '';

    if (!search) {
      fetchEmployees();
      return;
    }

    if (search.length < MIN_SEARCH_LEN) {
      setError(null);
      return;
    }

    fetchEmployeeByName(search);
  }, [filter.search, fetchEmployeeByName, fetchEmployees]);

  const handleChangeFilter = (key, value) => {
    setFilter(state => ({ ...state, [key]: value }));
  };

  const handleSearchChange = useCallback(e => {
    handleChangeFilter('search', e.target.value);
  }, []);

  const changeTab = useCallback((_, newValue) => {
    handleChangeFilter('role', newValue);
  }, []);

  const filtered = items.filter(item => {
    if (filter.role) return item.employeeType?.toLowerCase().includes(filter.role.toLowerCase());
    return true;
  });

  const showInitialLoading = loading && !searchLoading;

  if (showInitialLoading) {
    return (
      <div className="pt-2 pb-4">
        <Card sx={{ px: 3, py: 2 }}>
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress />
          </Box>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-2 pb-4">
        <Card sx={{ px: 3, py: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ px: 4, py: 2 }}>
        <EmployeeHeader 
          filterRole={filter.role}
          onTabChange={changeTab}
        />

        <SearchArea 
          value={filter.search} 
          onChange={handleSearchChange} 
          gridRoute="/dashboard/employee-grid" 
          listRoute="/dashboard/employee-list" 
        />

        {searchLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" py={2}>
            <CircularProgress size={20} />
          </Box>
        )}

        <EmployeeGrid
          employees={filtered}
          page={page}
          perPage={perPage}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}