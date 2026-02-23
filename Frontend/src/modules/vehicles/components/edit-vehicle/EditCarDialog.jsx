import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

import vehicleService from '../../services/vehicleService';


export default function EditCarDialog({ open, onClose, car, onSuccess }) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    registrationTag: ''
  });
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [currentEmployees, setCurrentEmployees] = useState([]);
  const [employeesToRemove, setEmployeesToRemove] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, data: null });

  useEffect(() => {
    if (open && car) {
      setFormData({
        make: car.car?.make || '',
        model: car.car?.model || '',
        registrationTag: car.car?.registrationTag || ''
      });
      setSelectedEmployee('');
      setCurrentEmployees(car.drivers || []);
      setEmployeesToRemove([]);
      setError(null);
      setSuccess(null);
      loadAvailableEmployees();
    }
  }, [open, car]);

  const loadAvailableEmployees = async () => {
    try {
      const response = await vehicleService.getAvailableEmployeesForCar();
      if (response.success) {
        setAvailableEmployees(response.data || []);
      }
    } catch (err) {
      console.error('Failed to load available employees:', err);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      let hasChanges = false;
      let results = [];

      // Remove employees first (if any marked for removal)
      if (employeesToRemove.length > 0) {
        for (const employeeCarId of employeesToRemove) {
          const result = await vehicleService.removeEmployeeFromCar(employeeCarId);
          results.push(result);
        }
        hasChanges = true;
      }

      // Update car details if changed
      if (formData.make !== car.car?.make || 
          formData.model !== car.car?.model || 
          formData.registrationTag !== car.car?.registrationTag) {
        const result = await vehicleService.updateVehicle('car', car.car.vehicleId, formData);
        results.push(result);
        hasChanges = true;
      }

      // Assign new employee if selected
      if (selectedEmployee) {
        const result = await vehicleService.assignEmployeeToCar(car.car.vehicleId, selectedEmployee);
        results.push(result);
        hasChanges = true;
      }

      if (!hasChanges) {
        setError('No changes detected');
        return;
      }

      const allSuccess = results.every(r => r.success);
      if (allSuccess) {
        setSuccess('Car updated successfully');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        const failedResult = results.find(r => !r.success);
        setError(failedResult?.message || 'Some updates failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to update car');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveEmployee = (employee) => {
    setConfirmDialog({ 
      open: true, 
      type: 'removeEmployee',
      data: employee,
      title: 'Remove Employee',
      message: `Are you sure you want to remove ${employee.name} from this car?`
    });
  };

  const executeRemoveEmployee = (employee) => {
    // Remove employee from UI immediately
    setCurrentEmployees(prev => prev.filter(e => e.employeeCarId !== employee.employeeCarId));
    // Add to removal list for later execution
    setEmployeesToRemove(prev => [...prev, employee.employeeCarId]);
    setError(null);
  };

  const handleDelete = () => {
    setConfirmDialog({ 
      open: true, 
      type: 'deleteCar',
      title: 'Delete Car',
      message: 'Are you sure you want to delete this car? This action will mark it as inactive.'
    });
  };

  const executeDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await vehicleService.deleteVehicle('car', car.car.vehicleId);
      
      if (result.success) {
        setSuccess('Car deleted successfully');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(result.message || 'Failed to delete car');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete car');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialog({ open: false, type: null, data: null });
  };

  const handleConfirmDialogConfirm = () => {
    if (confirmDialog.type === 'removeEmployee') {
      executeRemoveEmployee(confirmDialog.data);
    } else if (confirmDialog.type === 'deleteCar') {
      executeDelete();
    }
    handleConfirmDialogClose();
  };

  if (!car) return null;

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
        Edit Car: {car.car?.registrationTag}
      </DialogTitle>
      <DialogContent sx={{ pb: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
          {/* Left Side - Car Details */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              <Typography variant="h6" sx={{ fontWeight: 700 }}>Car Details</Typography>
              
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

              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                disabled={loading}
                fullWidth
              >
                Delete Car
              </Button>
            </Stack>
          </Box>

          {/* Right Side - Employees */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Stack spacing={3} sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Employees Details</Typography>
              
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Current Employees</Typography>
                
                {/* Current Employees - Fixed height */}
                <Box sx={{ minHeight: '48px', display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-start' }}>
                  {currentEmployees && currentEmployees.length > 0 ? (
                    currentEmployees.map((employee) => (
                      <Chip
                        key={employee.employeeCarId}
                        label={employee.name}
                        onDelete={() => handleRemoveEmployee(employee)}
                        color="primary"
                        variant="outlined"
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" >
                      No employee
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Add Employee */}
              <Box sx={{ mt: '-8px !important' }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Assign New Employee</InputLabel>
                  <Select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    label="Select Employee"
                  >
                    <MenuItem value="">
                      <em>Select an employee to assign</em>
                    </MenuItem>
                    {availableEmployees.map((employee) => (
                      <MenuItem key={employee.employeeId} value={employee.employeeId}>
                        {employee.firstName} {employee.lastName}
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
