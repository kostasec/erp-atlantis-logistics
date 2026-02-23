import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

// MUI Components
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Custom Components
import Scrollbar from '@/components/scrollbar';
import FlexBetween from '@/components/flexbox/FlexBetween';
import { TableDataNotFound, TableToolbar } from '@/components/table';

// Table Components
import InvoiceTableRow from '../components/InvoiceTableRow';
import InvoiceTableHead from '../components/InvoiceTableHead';
import InvoiceTableActions from '../components/InvoiceTableActions';

// Hooks
import useMuiTable, { getComparator, stableSort } from '@/hooks/useMuiTable';

//Services
import incomingInvoiceService from '../services/incomingInvoiceService';


const normalizeInvoices = list => (Array.isArray(list) ? list : []).map(item => ({
  ...item,
  issueDate: item.issueDate ? new Date(item.issueDate) : null,
  deliveredDate: item.deliveredDate ? new Date(item.deliveredDate) : null
}));

function InvoiceTablePageView({
  title,
  initialInvoices = [],
  partyKey,
  partyLabel
}) {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState(() => normalizeInvoices(initialInvoices));
  const [invoiceFilter, setInvoiceFilter] = useState({
    search: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    page,
    order,
    orderBy,
    selected,
    rowsPerPage,
    setPage,
    isSelected,
    handleSelectRow,
    handleChangePage,
    handleRequestSort,
    handleSelectAllRows,
    handleChangeRowsPerPage
  } = useMuiTable({
    defaultOrderBy: partyKey,
    defaultRowsPerPage: 20
  });
  useEffect(() => {
    setPage(0);
  }, [invoiceFilter, setPage]);
  
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await incomingInvoiceService.getAllIncomingInvoices();
        if (response.success) {
          setInvoices(normalizeInvoices(response.data));
        } else {
          setError(t('Failed to fetch incoming invoices'));
        }
      } catch (err) {
        console.error('Error fetching incoming invoices:', err);
        setError(t('Error connecting to server') + ': ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    // Učitaj iz API-ja ako nema početnih podataka
    if (initialInvoices.length === 0) {
      fetchInvoices();
    } else {
      setInvoices(normalizeInvoices(initialInvoices));
      setLoading(false);
    }
  }, [initialInvoices]);
  const handleChangeFilter = useCallback((key, value) => {
    setInvoiceFilter(prev => ({ ...prev,
      [key]: value
    }));
  }, []);
  const filteredInvoices = useMemo(() => {
    const sortedInvoices = stableSort(invoices, getComparator(order, orderBy || partyKey));
    
    return sortedInvoices.filter(item => {
      const { status, search } = invoiceFilter;
      
      // Status filtering
      if (status === 'pending') return item.status === 'Pending';
      if (status === 'complete') return item.status === 'Complete';

      // Search filtering
      if (search) {
        const searchTerm = search.toLowerCase();
        const matchesName = item.name ? item.name.toLowerCase().includes(searchTerm) : false;
        const matchesParty = item[partyKey] ? item[partyKey].toString().toLowerCase().includes(searchTerm) : false;
        return matchesName || matchesParty;
      }
      return true;
    });

  }, [invoices, order, orderBy, invoiceFilter, partyKey]);
  const paginatedInvoices = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredInvoices.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredInvoices, page, rowsPerPage]);
  const handleDeleteInvoice = useCallback(id => {
    setInvoices(prev => prev.filter(item => item.id !== id));
  }, []);
  const handleAllDeleteInvoice = useCallback(() => {
    setInvoices(prev => prev.filter(item => !selected.includes(item.id)));
    handleSelectAllRows([])();
  }, [selected, handleSelectAllRows]);

  if (loading) {
    return (
      <Card>
        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      </Card>
    );
  }

  return <Card>
      <FlexBetween flexWrap="wrap" gap={2} px={2} py={3}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="body1" fontWeight={500}>
            {t(title)}
          </Typography>
        </Stack>
      </FlexBetween>

      {/* Invoice Filter Action Bar */}
      <InvoiceTableActions 
        filter={invoiceFilter} 
        handleChangeFilter={handleChangeFilter} 
      />

      {/* Table Content */}
      <TableContainer>
        <Scrollbar autoHide={false}>
          <Table sx={{ minWidth: 900 }}>

            {/* Table Head */}
            <InvoiceTableHead 
              order={order}
              orderBy={orderBy}
              numSelected={selected.length}
              rowCount={filteredInvoices.length}
              onRequestSort={handleRequestSort}
              onSelectAllRows={handleSelectAllRows(filteredInvoices.map(row => row.id))}
              partyLabel={partyLabel}
              partyKey={partyKey}
            />

            {/* Table Body */}
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableDataNotFound />
              ) : (
                paginatedInvoices.map(invoice => (
                  <InvoiceTableRow 
                    key={invoice.id}
                    invoice={invoice}
                    handleSelectRow={handleSelectRow}
                    isSelected={isSelected(invoice.id)}
                    handleDeleteInvoice={handleDeleteInvoice}
                    partyKey={partyKey}
                    invoiceType="incoming"
                  />
                ))
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      {/* Table Pagination Section */}
      <TablePagination 
        page={page} 
        component="div" 
        rowsPerPage={rowsPerPage} 
        count={filteredInvoices.length} 
        onPageChange={handleChangePage} 
        rowsPerPageOptions={[20]} 
        onRowsPerPageChange={handleChangeRowsPerPage} 
        showFirstButton 
        showLastButton 
      />
    </Card>;
}

export const IncomingInvoice = ({ initialInvoices = [], ...props }) => (
  <InvoiceTablePageView 
    title="Incoming Invoice"
    initialInvoices={initialInvoices}
    partyKey="sender"
    partyLabel="Sender"
    {...props}
  />
);

export default IncomingInvoice;