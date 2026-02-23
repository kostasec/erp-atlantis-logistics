// views/AddEmployeeView.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import HeadingArea from '@/shared/components/common/cev/HeadingArea';
import Add from '@/icons/Add';
import employeeService from '../services/employeeService';
import { employeeValidationSchema } from '../validation/employeeValidation';

import { BasicInfoSection, AddressSection, DocumentSection } from '../components/add-employee';

export default function AddEmployeeView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
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
      city: 'Subotica',
      zipCode: '24000',
      country: 'Serbia',
      phoneNumber: '',
      emailAddress: '',
      idCardNumber: '',
      passportNumber: '',
      managerId: null
    }
  });

  // Load managers on mount
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
        // Ne prikazuj error za managers, dozvoli formu da radi
      } finally {
        setLoadingManagers(false);
      }
    };

    loadManagers();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      // Transform to backend format (PascalCase)
      const employeeData = {
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

      console.log('🔍 Sending to backend:', employeeData);

      const response = await employeeService.createEmployee(employeeData);
      
      if (response.success) {
        setSuccess(true);
        reset();
        setTimeout(() => {
          navigate('/dashboard/employee');
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating employee:', err);
      setError(err.message || t('Failed to create employee'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/employee');
  };

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ px: 3, py: 2 }}>
        <HeadingArea 
          title={t('Employees')}
          icon={Add} 
        />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {t('Add New Employee')}
        </Typography>
        <Box sx={{ mt: 1 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {t('Employee created successfully! Redirecting...')}
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

            <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
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
                {loading ? t('Creating...') : t('Create Employee')}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
    </div>
  );
}