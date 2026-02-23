import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import SearchArea from '@/shared/components/common/cev/SearchArea';
import { ClientHeader, ClientGrid } from '../components/list-clients';
import clientService from '../services/clientService';

export default function ListClientsView() {
  const { t } = useTranslation();
  const [perPage] = useState(8);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState({ role: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const MIN_SEARCH_LEN = 3;

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientService.getAllClients();
      if (response.success) {
        setItems(response.data);
      } else {
        setError('Failed to fetch clients');
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClientByIdentifier = useCallback(async (identifier) => {
    if (!identifier || !identifier.trim()) {
      return fetchClients();
    }

    const value = identifier.trim();

    try {
      setSearchLoading(true);
      setError(null);

      let found = false;

      // Try TaxID first
      try {
        const byTax = await clientService.getClientByTaxId(value);
        if (byTax.success && byTax.data) {
          setItems([byTax.data]);
          found = true;
        }
      } catch (err) {
        // ignore, try next
      }

      // Fallback to Registration Number if not found by TaxID
      if (!found) {
        try {
          const byReg = await clientService.getClientByRegNmbr(value);
          if (byReg.success && byReg.data) {
            setItems([byReg.data]);
            found = true;
          }
        } catch (err) {
          // ignore, will clear below
        }
      }

      // Fallback to Client Name if not found yet
      if (!found) {
        try {
          const byName = await clientService.getClientByName(value);
          if (byName.success && byName.data) {
            setItems([byName.data]);
            found = true;
          }
        } catch (err) {
          // ignore
        }
      }

      // As a final fallback, do a contains search on all clients (taxId / regNmbr / clientName)
      if (!found) {
        try {
          const all = await clientService.getAllClients();
          if (all.success && Array.isArray(all.data)) {
            const lower = value.toLowerCase();
            const filteredAll = all.data.filter(c => {
              return (c.taxId && c.taxId.toLowerCase().includes(lower))
                || (c.regNmbr && c.regNmbr.toLowerCase().includes(lower))
                || (c.clientName && c.clientName.toLowerCase().includes(lower));
            });
            setItems(filteredAll);
            found = filteredAll.length > 0;
          }
        } catch (err) {
          // ignore
        }
      }

      if (!found) {
        setItems([]);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching client by identifier:', err);
      setItems([]);
      setError(null);
    } finally {
      setSearchLoading(false);
    }
  }, [fetchClients]);

  useEffect(() => {
    const search = filter.search?.trim() || '';

    if (!search) {
      fetchClients();
      return;
    }

    if (search.length < MIN_SEARCH_LEN) {
      setError(null);
      return;
    }

    fetchClientByIdentifier(search);
  }, [filter.search, fetchClientByIdentifier, fetchClients]);

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
    if (filter.role) return item.role?.toLowerCase() === filter.role;
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
      <Card sx={{ px: 3, py: 2 }}>
        <ClientHeader 
          filterRole={filter.role}
          onTabChange={changeTab}
        />

        <SearchArea 
          value={filter.search} 
          onChange={handleSearchChange} 
          gridRoute="/dashboard/client-grid" 
          listRoute="/dashboard/client-list" 
        />

        <ClientGrid
          clients={filtered}
          page={page}
          perPage={perPage}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}
