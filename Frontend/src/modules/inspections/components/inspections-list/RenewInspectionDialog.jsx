import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';

export default function RenewInspectionDialog({ open, onClose, onSave, inspection }) {
  const [nextInspectionDate, setNextInspectionDate] = useState('');

  const handleSave = () => {
    if (!nextInspectionDate) {
      alert('Please select a new inspection date');
      return;
    }

    onSave({
      ...inspection,
      lastInspection: inspection.nextInspection,
      nextInspection: nextInspectionDate
    });
    handleClose();
  };

  const handleClose = () => {
    setNextInspectionDate('');
    onClose();
  };

  React.useEffect(() => {
    if (open && inspection) {
      setNextInspectionDate('');
    }
  }, [open, inspection]);

  if (!inspection) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          p: 1
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <DialogTitle sx={{ pr: 5 }}>Renew Inspection</DialogTitle>
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

      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Update inspection date for {inspection?.vehicleId} - {inspection?.inspectionType}
          </Typography>

          {/* Current Info */}
          <Box sx={{ 
            p: 3, 
            backgroundColor: 'background.paper',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            '& .MuiTypography-root': {
              fontSize: '0.95rem'
            }
          }}>
            <Typography 
              variant="subtitle1" 
              fontWeight={600} 
              color="primary" 
              gutterBottom
              sx={{ mb: 2 }}
            >
              Current Information
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Vehicle/Employee:</Typography>
                <Typography variant="body2" fontWeight={500}>{inspection?.vehicleId}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Inspection Type:</Typography>
                <Typography variant="body2" fontWeight={500}>{inspection?.inspectionType}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Current Expiry:</Typography>
                <Typography variant="body2" fontWeight={500}>
                  {inspection?.nextInspection ? new Date(inspection.nextInspection).toLocaleDateString('sr-RS') : 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Status:</Typography>
                <Typography 
                  variant="body2" 
                  fontWeight={600}
                  color={inspection?.status === 'valid' ? 'success.main' : 'error.main'}
                >
                  {inspection?.status?.charAt(0).toUpperCase() + inspection?.status?.slice(1)}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* New Date Input */}
          <TextField
            fullWidth
            label="New Inspection Date *"
            type="date"
            value={nextInspectionDate}
            onChange={(e) => setNextInspectionDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Select the new expiry date for this inspection"
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, mb: 3 }}>
            <Button 
              onClick={handleSave} 
              variant="contained"
              disabled={!nextInspectionDate}
            >
              Update Inspection
            </Button>
          </Box>
        </Stack>
      </DialogContent>
      
      {/* Extra spacing */}
      <Box sx={{ pb: 2 }} />
    </Dialog>
  );
}