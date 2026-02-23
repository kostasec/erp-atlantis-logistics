import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TablePagination from '@mui/material/TablePagination';
import Divider from '@mui/material/Divider';
import PrintIcon from '@mui/icons-material/Print';
import PaySlipCard from './PaySlipCard';

// Helper function to format numbers
const formatNumber = (num) => {
  return Number(num || 0).toLocaleString('de-DE');
};

export default function PaySlipList({ 
  expenseData,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}) {
  if (!expenseData || expenseData.length === 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Card sx={theme => ({ mb: 3, p: 2, borderRadius: 2, border: `2px solid ${theme.palette.divider}` })}>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No expenses found for selected driver
          </Typography>
        </Card>
      </Box>
    );
  }

  // Group expenses by paySlipId
  const groupedByPaySlipId = expenseData.reduce((acc, expense) => {
    const paySlipId = expense.paySlipId;
    if (!acc[paySlipId]) {
      acc[paySlipId] = [];
    }
    acc[paySlipId].push(expense);
    return acc;
  }, {});

  // Convert to array of groups for pagination and sort by paySlipId descending
  const paySlipGroups = Object.entries(groupedByPaySlipId)
    .sort((a, b) => {
      // Sort by paySlipId descending (newest first)
      return Number(b[0]) - Number(a[0]);
    })
    .map(([paySlipId, items]) => items);

  const totalGroups = paySlipGroups.length;

  // Get current group (one paySlipId group per page)
  const currentGroup = paySlipGroups[page] || [];
  const paginatedData = currentGroup;

  // Calculate Grand Totals for current paySlipId group
  const calculateGrandTotals = () => {
    const grandTotalRSD = paginatedData.reduce((sum, expense) => {
      return sum + Number(expense.domesticAllowance || 0) + Number(expense.domesticExpenses || 0);
    }, 0);

    const grandTotalEUR = paginatedData.reduce((sum, expense) => {
      return sum + Number(expense.inoAllowance || 0) + Number(expense.inoExpenses || 0);
    }, 0);

    return { grandTotalRSD, grandTotalEUR };
  };

  const { grandTotalRSD, grandTotalEUR } = calculateGrandTotals();

  return (
    <Box sx={{ mt: 4 }}>
      <Card
        key={`payslip-page-${page}`}
        sx={theme => ({
          mb: 3,
          p: 2,
          borderRadius: 2,
          border: `2px solid ${theme.palette.divider}`
        })}
      >
        {/* Pay Slip Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography 
              variant="h5" 
              fontWeight={700} 
              color="primary"
            >
              Pay Slip
            </Typography>
            {paginatedData.length > 0 && paginatedData[0].paySlipId && (
              <Typography 
                variant="h6" 
                fontWeight={300} 
                color="primary"
                sx={{ mt: 1 }}
              >
                {paginatedData[0].issueDate}
              </Typography>
            )}
          </Stack>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </Stack>

        {/* Render Pay Slip Cards */}
        {paginatedData.map((expense, index) => (
          <PaySlipCard 
            key={`page${page}-${expense.paySlipId}-${expense.psID}-${expense.orderNumber}-${index}`} 
            expense={expense} 
            index={index} 
          />
        ))}

        {/* Grand Total Section */}
        {paginatedData.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', gap: 2, px: 2, pb: 2 }}>
              {/* RSD Total Card */}
              <Box 
                sx={theme => ({ 
                  flex: grandTotalEUR > 0 ? 1 : 'auto',
                  p: 2,
                  borderRadius: 2,
                  background: theme.palette.mode === 'dark' 
                    ? `linear-gradient(135deg, ${theme.palette.grey[800]}, ${theme.palette.grey[900]})`
                    : `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.primary.main}08)`,
                  border: `1px solid ${theme.palette.primary.main}30`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? `0 4px 12px ${theme.palette.grey[900]}80`
                      : `0 4px 12px ${theme.palette.primary.main}20`
                  }
                })}
              >
                <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Grand Total
                </Typography>
                <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 0.5 }}>
                  <Typography 
                    variant="h5" 
                    fontWeight={700} 
                    sx={theme => ({ color: theme.palette.mode === 'dark' ? theme.palette.success.main : theme.palette.primary.main })}
                  >
                    {formatNumber(grandTotalRSD)}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight={600}
                    sx={theme => ({ color: theme.palette.mode === 'dark' ? theme.palette.success.main : theme.palette.primary.main })}
                  >
                    RSD
                  </Typography>
                </Stack>
              </Box>

              {/* EUR Total Card */}
              {grandTotalEUR > 0 && (
                <Box 
                  sx={theme => ({ 
                    flex: 1,
                    p: 2,
                    borderRadius: 2,
                    background: theme.palette.mode === 'dark' 
                      ? `linear-gradient(135deg, ${theme.palette.grey[800]}, ${theme.palette.grey[900]})`
                      : `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.primary.main}08)`,
                    border: `1px solid ${theme.palette.primary.main}30`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? `0 4px 12px ${theme.palette.grey[900]}80`
                        : `0 4px 12px ${theme.palette.primary.main}20`
                    }
                  })}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Grand Total
                  </Typography>
                  <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 0.5 }}>
                    <Typography 
                      variant="h5" 
                      fontWeight={700} 
                      sx={theme => ({ color: theme.palette.mode === 'dark' ? theme.palette.success.main : theme.palette.primary.main })}
                    >
                      {formatNumber(grandTotalEUR)}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight={600}
                      sx={theme => ({ color: theme.palette.mode === 'dark' ? theme.palette.success.main : theme.palette.primary.main })}
                    >
                      EUR
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Box>
          </>
        )}
      </Card>

      {/* Pagination */}
      <Box sx={{ mt: 2 }}>
        <TablePagination
          component="div"
          count={totalGroups}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={1}
          onRowsPerPageChange={() => {}}
          rowsPerPageOptions={[1]}
          labelDisplayedRows={({ from, to, count }) => 
            `PaySlip ${from} of ${count !== -1 ? count : `more than ${to}`}`
          }
          sx={{ mt: 2 }}
        />
      </Box>
    </Box>
  );
}