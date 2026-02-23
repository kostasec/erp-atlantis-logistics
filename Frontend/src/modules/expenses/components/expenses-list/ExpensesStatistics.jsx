import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ExpensesStatistics({ 
  rsdTotal = 0, 
  eurTotal = 0,
  showStatistics = true 
}) {
  if (!showStatistics) return null;

  const getBalanceColor = (balance) => {
    if (balance > 0) return 'success.main';   // positive balance - green
    if (balance < 0) return 'error.main';     // negative balance - red
    return 'text.secondary';                  // zero - gray
  };

  return (
    <Box sx={{ textAlign: 'right' }}>
      <Typography variant="body1" sx={{ color: getBalanceColor(rsdTotal), fontWeight: 'bold', display: 'inline' }}>
        RSD: {rsdTotal.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 'bold', display: 'inline' }}>
        {' | '}
      </Typography>
      <Typography variant="body1" sx={{ color: getBalanceColor(eurTotal), fontWeight: 'bold', display: 'inline' }}>
        EUR: {eurTotal.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Typography>
    </Box>
  );
}