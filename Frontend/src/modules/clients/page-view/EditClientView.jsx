// views/EditClientView.jsx
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
import clientService from '../services/clientService';
import { clientValidationSchema } from '../validation/clientValidation';

import { BasicInfoSection, AddressSection, ContactPersonSection } from '../components/add-client';

export default function EditClientView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { taxId } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteContactDialogOpen, setDeleteContactDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
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

  // Load client data
  useEffect(() => {
    const loadClient = async () => {
      if (!taxId) return;

      try {
        setLoadingData(true);
        setError(null);
        
        const response = await clientService.getClientByTaxId(taxId);
        
        if (response.success && response.data) {
          const client = response.data;
          setClientData(client);
          
          // Populate form with client data
          reset({
            clientName: client.clientName || '',
            taxId: client.taxId || '',
            regNmbr: client.regNmbr || '',
            streetAndNumber: client.streetAndNumber || '',
            city: client.city || '',
            zipCode: client.zipCode || '',
            country: client.country || 'Serbia',
            email: client.email || '',
            clientType: client.clientType || 'Transportation',
            contactPersonName: client.contacts?.[0]?.name || '',
            contactPersonDescription: client.contacts?.[0]?.description || '',
            contactPersonPhone: client.contacts?.[0]?.phoneNumber || '',
            contactPersonEmail: client.contacts?.[0]?.email || ''
          });
        } else {
          setError(t('Client not found'));
        }
      } catch (err) {
        console.error('Error loading client:', err);
        setError(t('Failed to load client data'));
      } finally {
        setLoadingData(false);
      }
    };

    loadClient();
  }, [taxId, reset, t]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      // Transform to backend format (PascalCase)
      const updateData = {
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
        updateData.contacts.push({
          ContactPersonID: clientData?.contacts?.[0]?.contactPersonID || null,
          ContactName: data.contactPersonName || '',
          Description: data.contactPersonDescription || null,
          PhoneNmbr: data.contactPersonPhone || null,
          PersonEmail: data.contactPersonEmail ? data.contactPersonEmail.toLowerCase() : null
        });
      }

      const response = await clientService.upsertClient(updateData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard/client');
        }, 2000);
      }
    } catch (err) {
      console.error('Error updating client:', err);
      setError(err.message || t('Failed to update client'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/client');
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await clientService.deleteClient(taxId);
      setDeleteDialogOpen(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/client');
      }, 1500);
    } catch (err) {
      console.error('Error deleting client:', err);
      setError(t('Failed to delete client'));
      setDeleteDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContactClick = () => {
    setDeleteContactDialogOpen(true);
  };

  const confirmDeleteContact = async () => {
    if (!clientData?.contacts?.[0]?.contactPersonID) {
      setDeleteContactDialogOpen(false);
      return;
    }

    try {
      setLoading(true);
      await clientService.deleteClientContact(clientData.contacts[0].contactPersonID);
      setDeleteContactDialogOpen(false);
      setSuccess(true);
      
      // Clear contact fields
      setValue('contactPersonName', '');
      setValue('contactPersonDescription', '');
      setValue('contactPersonPhone', '');
      setValue('contactPersonEmail', '');
      
      // Update clientData
      setClientData(prev => ({ ...prev, contacts: [] }));
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError(t('Failed to delete contact'));
      setDeleteContactDialogOpen(false);
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
          title={
            <Typography variant="h5" fontWeight={600}>
              {t('Clients')}
            </Typography>
          } 
          icon={Edit} 
        />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {t('Edit Client')}
        </Typography>
        <Box sx={{ mt: 1 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {t('Client updated successfully! Redirecting...')}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <BasicInfoSection control={control} errors={errors} />
            <AddressSection control={control} errors={errors} />
            <ContactPersonSection 
              control={control} 
              errors={errors} 
              onDeleteContact={clientData?.contacts?.length > 0 ? handleDeleteContactClick : undefined}
              disableDelete={loading}
            />

            <Stack direction="row" spacing={2} justifyContent="space-between" pt={2}>
              <Button 
                variant="outlined" 
                color="error"
                onClick={handleDeleteClick}
                disabled={loading}
              >
                {t('Delete Client')}
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
                  {loading ? t('Updating...') : t('Update Client')}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </form>
      </Card>

      {/* Delete Client Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('Confirm Delete')}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {t('Are you sure you want to delete client')} <strong>{clientData?.clientName}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('This will deactivate the client. This action cannot be undone.')}
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

      {/* Delete Contact Dialog */}
      <Dialog open={deleteContactDialogOpen} onClose={() => setDeleteContactDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('Confirm Delete')}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {t('Are you sure you want to delete this contact person?')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('This action cannot be undone.')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteContactDialogOpen(false)} 
            variant="outlined"
            disabled={loading}
          >
            {t('Cancel')}
          </Button>
          <Button onClick={confirmDeleteContact} variant="contained" color="error" disabled={loading}>
            {loading ? t('Deleting...') : t('Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}