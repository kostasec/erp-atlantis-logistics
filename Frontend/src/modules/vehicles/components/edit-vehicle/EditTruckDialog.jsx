import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import vehicleService from '../../services/vehicleService';

export default function EditTruckDialog({ open, onClose, truck, onSuccess }) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    registrationTag: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false });

  useEffect(() => {
    if (open && truck) {
      setFormData({
        make: truck.make || '',
        model: truck.model || '',
        registrationTag: truck.registrationTag || ''
      });
      setError(null);
      setSuccess(null);
    }
  }, [open, truck]);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.make || !formData.model || !formData.registrationTag) {
        setError('All fields are required');
        return;
      }

      const result = await vehicleService.updateVehicle('truck', truck.vehicleId, formData);
      
      if (result.success) {
        setSuccess('Truck updated successfully');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(result.message || 'Failed to update truck');
      }
    } catch (err) {
      setError(err.message || 'Failed to update truck');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setConfirmDialog({ open: true });
  };

  const executeDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await vehicleService.deleteVehicle('truck', truck.vehicleId);
      
      if (result.success) {
        setSuccess('Truck deleted successfully');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(result.message || 'Failed to delete truck');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete truck');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialog({ open: false });
  };

  const handleConfirmDialogConfirm = () => {
    executeDelete();
    handleConfirmDialogClose();
  };

  if (!truck) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        Edit Truck: {truck.registrationTag}
      </DialogTitle>
      <DialogContent sx={{ pb: 4 }}>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <TextField
            label="Make"
            value={formData.make}
            onChange={handleChange('make')}
            fullWidth
            required
          />

          <TextField
            label="Model"
            value={formData.model}
            onChange={handleChange('model')}
            fullWidth
            required
          />

          <TextField
            label="Registration Tag"
            value={formData.registrationTag}
            onChange={handleChange('registrationTag')}
            fullWidth
            required
          />

          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete Truck
            </Button>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="outlined" 
                onClick={onClose} 
                disabled={loading}
                sx={{ 
                  borderColor: (theme) => theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main,
                  color: (theme) => theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main,
                  '&:hover': {
                    borderColor: (theme) => theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main,
                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : theme.palette.primary.light + '1A'
                  }
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                Save Changes
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={handleConfirmDialogClose}>
        <DialogTitle>Delete Truck</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this truck? This action will mark it as inactive.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleConfirmDialogConfirm} variant="contained" color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
