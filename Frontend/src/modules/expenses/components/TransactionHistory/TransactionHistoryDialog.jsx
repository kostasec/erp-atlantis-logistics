import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import { styled, alpha } from '@mui/material/styles';
import EURTransaction from './EURTransaction';
import RSDTransaction from './RSDTransaction';

// STYLED COMPONENTS
const OptionCard = styled(Box)(({ theme, selected }) => ({
  border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: selected ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.08)
  }
}));

export default function TransactionHistoryDialog({ open, onClose }) {
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
  };

  const handleCloseSubDialog = () => {
    setSelectedCurrency(null);
  };

  const handleMainClose = () => {
    setSelectedCurrency(null);
    onClose();
  };

  return (
    <>
      {/* Main Dialog - Currency Selection */}
      <Dialog
        open={open && !selectedCurrency}
        onClose={handleMainClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            position: 'absolute',
            left: '53%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, pr: 5 }}>
          <Typography variant="h6" fontWeight={600}>
            Select Transaction Currency
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleMainClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'red'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2, pb: 3 }}>
          <Stack spacing={2}>
            <OptionCard
              selected={false}
              onClick={() => handleCurrencySelect('EUR')}
            >
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                EUR Transactions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View Euro currency transactions
              </Typography>
            </OptionCard>
            
            <OptionCard
              selected={false}
              onClick={() => handleCurrencySelect('RSD')}
            >
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                RSD Transactions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View Serbian Dinar transactions
              </Typography>
            </OptionCard>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* EUR Transaction Dialog */}
      <EURTransaction 
        open={selectedCurrency === 'EUR'} 
        onClose={() => {
          handleCloseSubDialog();
          onClose();
        }} 
      />

      {/* RSD Transaction Dialog */}
      <RSDTransaction 
        open={selectedCurrency === 'RSD'} 
        onClose={() => {
          handleCloseSubDialog();
          onClose();
        }} 
      />
    </>
  );
}

