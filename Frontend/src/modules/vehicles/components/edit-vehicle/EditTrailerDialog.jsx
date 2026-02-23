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

export default function EditTrailerDialog({ open, onClose, trailer, onSuccess }) {
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
    if (open && trailer) {
      setFormData({
        make: trailer.make || '',
        model: trailer.model || '',
        registrationTag: trailer.registrationTag || ''
      });
      setError(null);
      setSuccess(null);
    }
  }, [open, trailer]);

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

      const result = await vehicleService.updateVehicle('trailer', trailer.vehicleId, formData);
      
      if (result.success) {
        setSuccess('Trailer updated successfully');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(result.message || 'Failed to update trailer');
      }
    } catch (err) {
      setError(err.message || 'Failed to update trailer');
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

      const result = await vehicleService.deleteVehicle('trailer', trailer.vehicleId);
      
      if (result.success) {
        setSuccess('Trailer deleted successfully');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(result.message || 'Failed to delete trailer');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete trailer');
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

  if (!trailer) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        Edit Trailer: {trailer.registrationTag}
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
              Delete Trailer
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
        <DialogTitle>Delete Trailer</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this trailer? This action will mark it as inactive.</Typography>
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
