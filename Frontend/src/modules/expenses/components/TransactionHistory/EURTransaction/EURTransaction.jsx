import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import { BodyTableCell, HeadTableCell } from '@/shared/components/common';
import Scrollbar from '@/components/scrollbar';
import { payslipService } from '../../../services/payslip';

// Helper function to format numbers with dot as thousand separator
const formatNumber = (num) => {
  return Number(num || 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function EURTransaction({ open, onClose }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      fetchTransactions();
    }
  }, [open]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await payslipService.getTransactionEUR();
      if (response.success) {
        setTransactions(response.data);
      }
    } catch (err) {
      console.error('Error fetching EUR transactions:', err);
      setError('Failed to load EUR transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTransactions = transactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          position: 'absolute',
          right: '10%',
          top: '50%',
          transform: 'translateY(-50%)',
          maxHeight: '80vh',
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <DialogTitle sx={{ pr: 5 }}>EUR Transaction History</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'error.main',
            zIndex: 1
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent>
        {/* Loading state */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error state */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            <Scrollbar>
              <Table sx={{ '& .MuiTableCell-root': { px: 1, py: 1, whiteSpace: 'nowrap' } }} size="small">
                <TableHead>
                  <TableRow>
                    <HeadTableCell>Date</HeadTableCell>
                    <HeadTableCell>Amount (EUR)</HeadTableCell>
                    <HeadTableCell>Employee</HeadTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTransactions.length === 0 ? (
                    <TableRow>
                      <BodyTableCell colSpan={3} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                          No EUR transactions found
                        </Typography>
                      </BodyTableCell>
                    </TableRow>
                  ) : (
                    paginatedTransactions.map((transaction) => (
                      <TableRow key={transaction.paymentId}>
                        <BodyTableCell>
                          {new Date(transaction.date).toLocaleDateString('sr-RS')}
                        </BodyTableCell>
                        <BodyTableCell>
                          {formatNumber(transaction.amountEUR)} €
                        </BodyTableCell>
                        <BodyTableCell>{transaction.employee}</BodyTableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Scrollbar>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={transactions.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[]}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

