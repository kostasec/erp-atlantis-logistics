import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import vehicleService from '../../services/vehicleService';
import { employeeService } from '../../../employees/services/employeeService';

export default function EditCompositionDialog({ open, onClose, composition, trucks, trailers, onSuccess }) {
  const [selectedTruck, setSelectedTruck] = useState('');
  const [selectedTrailer, setSelectedTrailer] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [currentDrivers, setCurrentDrivers] = useState([]);
  const [driversToRemove, setDriversToRemove] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, data: null });

  useEffect(() => {
    if (open) {
      loadDrivers();
      // Reset form when dialog opens
      if (composition) {
        setSelectedTruck(composition.truck?.vehicleId || '');
        setSelectedTrailer(composition.trailer?.vehicleId || '');
        setCurrentDrivers(composition.drivers || []);
        setDriversToRemove([]);
        
        // Reset driver selection kada se otvori dialog
        setSelectedDriver('');
        console.log('Composition drivers:', composition.drivers);
      }
    }
  }, [open, composition]);

  const loadDrivers = async () => {
    try {
      const response = await employeeService.getDrivers();
      if (response.success) {
        setDrivers(response.data || []);
        console.log('Loaded drivers:', response.data);
      }
    } catch (err) {
      console.error('Failed to load drivers:', err);
    }
  };

  const handleUpdateTruck = async () => {
    if (!selectedTruck) {
      setError('Please select a truck');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await vehicleService.updateCompositionTruck(composition.compositionId, selectedTruck);
      
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

  const handleUpdateTrailer = async () => {
    if (!selectedTrailer) {
      setError('Please select a trailer');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await vehicleService.updateCompositionTrailer(composition.compositionId, selectedTrailer);
      
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

  const handleRemoveSpecificDriver = (driverCompId) => {
    setConfirmDialog({ 
      open: true, 
      type: 'removeDriver',
      data: driverCompId,
      title: 'Remove Driver',
      message: 'Are you sure you want to remove this driver from the composition?'
    });
  };

  const executeRemoveDriver = (driverCompId) => {
    // Remove driver from UI immediately
    setCurrentDrivers(prev => prev.filter(d => d.driverCompId !== driverCompId));
    // Add to removal list for later execution
    setDriversToRemove(prev => [...prev, driverCompId]);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      let hasChanges = false;
      let results = [];

      // Remove drivers first (if any marked for removal)
      if (driversToRemove.length > 0) {
        for (const driverCompId of driversToRemove) {
          const result = await vehicleService.removeDriverFromComposition(driverCompId);
          results.push(result);
        }
        hasChanges = true;
      }

      // Update truck if changed
      if (selectedTruck && selectedTruck !== composition.truck?.vehicleId) {
        const result = await vehicleService.updateCompositionTruck(composition.compositionId, selectedTruck);
        results.push(result);
        hasChanges = true;
      }

      // Update trailer if changed
      if (selectedTrailer && selectedTrailer !== composition.trailer?.vehicleId) {
        const result = await vehicleService.updateCompositionTrailer(composition.compositionId, selectedTrailer);
        results.push(result);
        hasChanges = true;
      }

      // Handle adding new driver
      if (selectedDriver) {
        // Assign new driver
        const result = await vehicleService.assignDriverToComposition(composition.compositionId, selectedDriver);
        results.push(result);
        hasChanges = true;
      }

      if (!hasChanges) {
        setError('No changes detected');
        return;
      }

      const allSuccess = results.every(r => r.success);
      if (allSuccess) {
        setSuccess('Composition updated successfully');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        const failedResult = results.find(r => !r.success);
        setError(failedResult?.message || 'Some updates failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to update composition');
    } finally {
      setLoading(false);
    }
  };

  const handleDecompose = async () => {
    setConfirmDialog({ 
      open: true, 
      type: 'decompose',
      title: 'Decompose Composition',
      message: 'Are you sure you want to decompose this composition? This action cannot be undone.'
    });
  };

  const executeDecompose = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await vehicleService.deleteComposition(composition.compositionId);
      
      if (result.success) {
        setSuccess('Composition decomposed successfully');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(result.message || 'Failed to decompose composition');
      }
    } catch (err) {
      setError(err.message || 'Failed to decompose composition');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialog({ open: false, type: null, data: null });
  };

  const handleConfirmDialogConfirm = () => {
    if (confirmDialog.type === 'removeDriver') {
      executeRemoveDriver(confirmDialog.data);
    } else if (confirmDialog.type === 'decompose') {
      executeDecompose();
    }
    handleConfirmDialogClose();
  };

  if (!composition) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { 
          marginLeft: '13%',
          marginTop: '8%'
        }
      }}
    >
      <DialogTitle>
        Edit Composition: {composition.truck?.registrationTag}/{composition.trailer?.registrationTag}
      </DialogTitle>
      <DialogContent sx={{ pb: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
          {/* Left Side - Composition Details */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              <Typography variant="h6" sx={{ fontWeight: 700 }}>Composition Details</Typography>

              {/* Change Truck */}
              <FormControl fullWidth>
                <InputLabel>Select New Truck</InputLabel>
                <Select
                  value={selectedTruck}
                  onChange={(e) => setSelectedTruck(e.target.value)}
                  label="Select New Truck"
                >
                  {trucks.map((truck) => (
                    <MenuItem key={truck.value} value={truck.value}>
                      {truck.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Change Trailer */}
              <FormControl fullWidth>
                <InputLabel>Select New Trailer</InputLabel>
                <Select
                  value={selectedTrailer}
                  onChange={(e) => setSelectedTrailer(e.target.value)}
                  label="Select New Trailer"
                >
                  {trailers.map((trailer) => (
                    <MenuItem key={trailer.value} value={trailer.value}>
                      {trailer.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="error"
                onClick={handleDecompose}
                disabled={loading}
                fullWidth
              >
                Decompose Composition
              </Button>
            </Stack>
          </Box>

          {/* Right Side - Drivers */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Stack spacing={3} sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Driver Details</Typography>
              
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Current Drivers</Typography>
                
                {/* Current Drivers - Fixed height */}
                <Box sx={{ minHeight: '32px', display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-start' }}>
                  {currentDrivers && currentDrivers.length > 0 ? (
                    currentDrivers.map((driver) => (
                      <Chip
                        key={driver.driverCompId}
                        label={driver.name}
                        onDelete={() => handleRemoveSpecificDriver(driver.driverCompId)}
                        color="primary"
                        variant="outlined"
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No driver
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Add Driver */}
              <Box sx={{ mt: '19px !important' }}>
                <FormControl fullWidth>
                  <InputLabel>Assign New Driver</InputLabel>
                  <Select
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    label="Select Driver"
                  >
                    <MenuItem value="">
                      <em>Select a driver to add</em>
                    </MenuItem>
                    {drivers.map((driver) => (
                      <MenuItem key={driver.employeeId} value={driver.employeeId}>
                        {driver.firstName} {driver.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>

            {/* Action Buttons - Bottom Right */}
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
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
          </Box>
        </Box>
      </DialogContent>

      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={handleConfirmDialogClose}
        PaperProps={{
          sx: { 
            minWidth: '500px',
            marginLeft: '200px',
            marginTop: '150px'
          }
        }}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography sx={{ whiteSpace: 'nowrap' }}>{confirmDialog.message}</Typography>
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
