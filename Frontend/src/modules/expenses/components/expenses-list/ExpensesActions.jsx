import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

export default function ExpensesActions({ 
  selectedDriver, 
  onAddPaySlip 
}) {
  if (!selectedDriver) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Button
        variant="outlined"
        size="small"
        onClick={onAddPaySlip}
        startIcon={<AddIcon />}
      >
        Add Pay Slip
      </Button>
    </Box>
  );
}