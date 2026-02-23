import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import Trash from '@/icons/duotone/Trash';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { payslipService } from '../../../services/payslip';

export default function EURPayment({ open, onClose }) {
  const [driverNames, setDriverNames] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Helper to get today's date in yyyy-mm-dd format
  const getToday = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  };

  const [rows, setRows] = useState([]);

  const fetchDriverNames = async () => {
    try {
      setLoading(true);
      const response = await payslipService.getDriverNames();
      if (response.success) {
        const names = response.data.map(driver => driver.firstName);
        setDriverNames(names);
        setRows(names.map(name => ({ name, amount: '', date: getToday() })));
      }
    } catch (err) {
      console.error('Error fetching driver names:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchDriverNames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleChange = (index, field, value) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { name: '', amount: '', date: getToday() }]);
  };

  const handleRemoveRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const totalAmount = rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);

  const handleSubmit = () => {
    // TODO: Implement submit logic for EUR payments
    console.log('EUR Payment submitted:', rows);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          position: 'absolute',
          left: '31%',
          top: '33%',
          right: 'auto',
          transform: 'none',
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <DialogTitle sx={{ pr: 5 }}>EUR Payment</DialogTitle>
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
      <DialogContent sx={{ pb: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2}>
            {rows.map((row, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Employee"
                name="name"
                value={row.name}
                size="small"
                variant="outlined"
                sx={{ flex: 2 }}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                label="Amount (EUR)"
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
              <IconButton color="error" size="small" onClick={() => handleRemoveRow(index)}>
                <Trash fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Total Amount: {totalAmount.toLocaleString('de-DE')} EUR
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </Box>
        </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}


