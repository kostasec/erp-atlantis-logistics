import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Trash from '@/icons/duotone/Trash';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function RSDPayment({ open, onClose }) {
  // Helper to get today's date in yyyy-mm-dd format
  const getToday = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  };

  const [rows, setRows] = useState([{ amount: '', date: getToday() }]);

  const handleChange = (index, field, value) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { amount: '', date: getToday() }]);
  };

  const handleRemoveRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const totalAmount = rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);

  const handleSubmit = () => {
    // TODO: Implement submit logic for RSD payments
    console.log('RSD Payment submitted:', rows);
    onClose();
  };

  const handleClose = () => {
    setRows([{ amount: '', date: getToday() }]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          position: 'absolute',
          left: '35%',
          top: '33%',
          right: 'auto',
          transform: 'none',
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <DialogTitle sx={{ pr: 5 }}>RSD Payment</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
      <DialogContent sx={{ pb: 3 }}>
        <Stack spacing={2}>
          {rows.map((row, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Amount (RSD)"
                name="amount"
                value={row.amount}
                onChange={e => handleChange(index, 'amount', e.target.value)}
                size="small"
                type="number"
                variant="outlined"
                sx={{ flex: 1 }}
              />
              <TextField
                fullWidth
                label="Date"
                type="date"
                name="date"
                value={row.date}
                onChange={e => handleChange(index, 'date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                variant="outlined"
                sx={{ flex: 1 }}
              />

            </Box>
          ))}
          

          <Divider sx={{ my: 1 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Total Amount: {totalAmount.toLocaleString('de-DE')} RSD
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

