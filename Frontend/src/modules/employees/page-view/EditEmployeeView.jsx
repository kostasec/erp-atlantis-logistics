// views/EditEmployeeView.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';

import HeadingArea from '@/shared/components/common/cev/HeadingArea';
import Edit from '@/icons/Edit';
import employeeService from '../services/employeeService';
import { employeeValidationSchema } from '../validation/employeeValidation';

import { BasicInfoSection, AddressSection, DocumentSection } from '../components/add-employee';

export default function EditEmployeeView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(employeeValidationSchema),
    defaultValues: {
      employeeType: 'Driver',
      firstName: '',
      lastName: '',
      streetAndNumber: '',
      city: '',
      zipCode: '',
      country: 'Serbia',
      phoneNumber: '',
      emailAddress: '',
      idCardNumber: '',
      passportNumber: '',
      managerId: null
    }
  });

  // Load managers
  useEffect(() => {
    const loadManagers = async () => {
      try {
        setLoadingManagers(true);
        const response = await employeeService.getManagers();
        if (response.success) {
          setManagers(response.data);
        }
      } catch (err) {
        console.error('Error loading managers:', err);
      } finally {
        setLoadingManagers(false);
      }
    };

    loadManagers();
  }, []);

  // Load employee data
  useEffect(() => {
    const loadEmployee = async () => {
      if (!id) return;

      try {
        setLoadingData(true);
        setError(null);
        
        const response = await employeeService.getEmployeeById(id);
        
        if (response.success && response.data) {
          const emp = response.data;
          setEmployeeData(emp);
          
          // Populate form
          reset({
            employeeType: emp.employeeType || 'Driver',
            firstName: emp.firstName || '',
            lastName: emp.lastName || '',
            streetAndNumber: emp.streetAndNumber || '',
            city: emp.city || '',
            zipCode: emp.zipCode || '',
            country: emp.country || 'Serbia',
            phoneNumber: emp.phoneNumber || '',
            emailAddress: emp.emailAddress || '',
            idCardNumber: emp.idCardNumber || '',
            passportNumber: emp.passportNumber || '',
            managerId: emp.managerId || null
          });
        } else {
          setError(t('Employee not found'));
        }
      } catch (err) {
        console.error('Error loading employee:', err);
        setError(t('Failed to load employee data'));
      } finally {
        setLoadingData(false);
      }
    };

    loadEmployee();
  }, [id, reset, t]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      // Transform to backend format (PascalCase)
      const updateData = {
        EmplType: data.employeeType,
        FirstName: data.firstName,
        LastName: data.lastName,
        StreetAndNmbr: data.streetAndNumber,
        City: data.city,
        ZIPCode: data.zipCode,
        Country: data.country,
        PhoneNmbr: data.phoneNumber,
        EmailAddress: data.emailAddress ? data.emailAddress.toLowerCase() : null,
        IDCardNmbr: data.idCardNumber,
        PassportNmbr: data.passportNumber,
        MgrID: data.managerId || null
      };

      console.log('🔍 Sending to backend:', updateData);

      const response = await employeeService.updateEmployee(id, updateData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard/employee');
        }, 2000);
      }
    } catch (err) {
      console.error('Error updating employee:', err);
      setError(err.message || t('Failed to update employee'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/employee');
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await employeeService.deleteEmployee(id);
      setDeleteDialogOpen(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/employee');
      }, 1500);
    } catch (err) {
      console.error('Error deleting employee:', err);
      setError(t('Failed to delete employee'));
      setDeleteDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="pt-2 pb-4">
        <Card sx={{ px: 3, py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ px: 3, py: 2 }}>
        <HeadingArea 
          title={t('Employees')}
          icon={Edit} 
        />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {t('Edit Employee')}
        </Typography>
        <Box sx={{ mt: 1 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {t('Employee updated successfully! Redirecting...')}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <BasicInfoSection 
              control={control} 
              errors={errors} 
              t={t}
              managers={managers}
              loadingManagers={loadingManagers}
            />
            <AddressSection control={control} errors={errors} t={t} />
            <DocumentSection control={control} errors={errors} t={t} />

            <Stack direction="row" spacing={2} justifyContent="space-between" pt={2}>
              <Button 
                variant="outlined" 
                color="error"
                onClick={handleDeleteClick}
                disabled={loading}
              >
                {t('Delete Employee')}
              </Button>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  {t('Cancel')}
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading}
                >
                  {loading ? t('Updating...') : t('Update Employee')}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </form>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('Confirm Delete')}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {t('Are you sure you want to delete employee')} <strong>{employeeData?.fullName}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('This will deactivate the employee. This action cannot be undone.')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            variant="outlined"
            disabled={loading}
          >
            {t('Cancel')}
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error" disabled={loading}>
            {loading ? t('Deleting...') : t('Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}