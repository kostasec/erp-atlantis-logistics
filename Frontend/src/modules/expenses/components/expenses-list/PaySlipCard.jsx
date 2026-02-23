import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

// Helper function to format numbers with dot as thousand separator
const formatNumber = (num) => {
  return Number(num || 0).toLocaleString('de-DE');
};

export default function PaySlipCard({ expense, index }) {
  const domesticTotal = Number(expense.domesticAllowance || 0) + Number(expense.domesticExpenses || 0);
  const internationalTotal = Number(expense.inoAllowance || 0) + Number(expense.inoExpenses || 0);
  const hasInternationalData = internationalTotal > 0;

  return (
    <Card
      sx={theme => ({
        mb: 3,
        p: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`
      })}
    >
      <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 2 }}>
        <Typography 
          variant="h7" 
          fontWeight={700} 
          color="primary"
        >
          Order: {expense.orderNumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {expense.transactionDate}
        </Typography>
      </Stack>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: hasInternationalData ? '1fr 1fr' : '1fr' }, gap: 2 }}>
        {/* Domestic Section */}
        <Box>
          <Typography 
            variant="subtitle2" 
            fontWeight="bold" 
            color="primary"
          >
            Domestic
          </Typography>
          <Box sx={{ mt: 1, mb: 1 }}>
            <Typography variant="body2">
              Allowance: <b>{formatNumber(expense.domesticAllowance)} RSD</b>
            </Typography>
            <Typography variant="body2">
              Expenses: <b>{formatNumber(expense.domesticExpenses)} RSD</b>
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography 
              variant="body2" 
              fontWeight="bold"
              sx={theme => ({ color: theme.palette.mode === 'dark' ? theme.palette.success.main : theme.palette.primary.main })}
            >
              Total: {formatNumber(domesticTotal)} RSD
            </Typography>
          </Box>
        </Box>
        
        {/* International Section - Only show if there's data */}
        {hasInternationalData && (
          <Box>
            <Typography 
              variant="subtitle2" 
              fontWeight="bold" 
              color="primary"
            >
              International
            </Typography>
            <Box sx={{ mt: 1, mb: 1 }}>
              <Typography variant="body2">
                Allowance: <b>{formatNumber(expense.inoAllowance)} EUR</b>
              </Typography>
              <Typography variant="body2">
                Expenses: <b>{formatNumber(expense.inoExpenses)} EUR</b>
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography 
                variant="body2" 
                fontWeight="bold"
                sx={theme => ({ color: theme.palette.mode === 'dark' ? theme.palette.success.main : theme.palette.primary.main })}
              >
                Total: {formatNumber(internationalTotal)} EUR
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Card>
  );
}