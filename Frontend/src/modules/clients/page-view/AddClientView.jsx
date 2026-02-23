// views/AddClientView.jsx
import { useState } from 'react';
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
import clientService from '../services/clientService';
import { clientValidationSchema } from '../validation/clientValidation';

import { BasicInfoSection, AddressSection, ContactPersonSection } from '../components/add-client';

export default function AddClientView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(clientValidationSchema),
    defaultValues: {
      clientName: '',
      taxId: '',
      regNmbr: '',
      streetAndNumber: '',
      city: '',
      zipCode: '',
      country: 'Serbia',
      clientType: 'Transportation',
      email: '',
      contactPersonName: '',
      contactPersonDescription: '',
      contactPersonPhone: '',
      contactPersonEmail: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      // Transform to backend format (PascalCase)
      const clientData = {
        TaxID: data.taxId,
        RegNmbr: data.regNmbr || null,
        ClientName: data.clientName,
        StreetAndNmbr: data.streetAndNumber,
        City: data.city,
        ZIP: data.zipCode,
        Country: data.country,
        Email: data.email ? data.email.toLowerCase() : null,
        ClientType: data.clientType || null,
        contacts: []
      };

      // Add contact if any field is filled
      if (data.contactPersonName || data.contactPersonPhone || data.contactPersonEmail) {
        clientData.contacts.push({
          ContactName: data.contactPersonName || '',
          Description: data.contactPersonDescription || null,
          PhoneNmbr: data.contactPersonPhone || null,
          PersonEmail: data.contactPersonEmail ? data.contactPersonEmail.toLowerCase() : null
        });
      }

      const response = await clientService.upsertClient(clientData);
      
      if (response.success) {
        setSuccess(true);
        reset();
        setTimeout(() => {
          navigate('/dashboard/client');
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating client:', err);
      setError(err.message || 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/client');
  };

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ px: 3, py: 2 }}>
        <HeadingArea 
          title={
            <Typography variant="h5" fontWeight={600}>
              {t('Clients')}
            </Typography>
          } 
          icon={Add} 
        />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {t('Add New Client')}
        </Typography>
        <Box sx={{ mt: 1 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {t('Client created successfully! Redirecting...')}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <BasicInfoSection control={control} errors={errors} />
            <AddressSection control={control} errors={errors} />
            <ContactPersonSection control={control} errors={errors} />

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
                {loading ? t('Creating...') : t('Create Client')}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
    </div>
  );
}