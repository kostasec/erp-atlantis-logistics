import { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TextField as MuiTextField } from '@mui/material';


import { FormProvider, TextField, DatePicker } from '@/components/form';
import InvoiceSummary from '../components/InvoiceSummary';
import InvoiceItems from '../components/InvoiceItems';
import VatLiabilityRecognition from '../components/VatLiabilityRecognition';
import AdditionalInformation from '../components/AdditionalInformation';
const validationSchema = Yup.object().shape({
  items: Yup.array().of(
    Yup.object().shape({
      // Optional fields for different item types
      route: Yup.string().nullable(),
      regTag: Yup.string().nullable(),
      taxName: Yup.string().nullable(),
      // Common required fields for both item types
      uom: Yup.string().required('UoM is Required'),
      quantity: Yup.string().required('Quantity is Required'),
      price: Yup.string().required('Price is Required'),
      vat: Yup.string().required('VAT is Required'),
      discount: Yup.string().required('Discount is Required'),
      amount: Yup.string().required('Amount is Required')
    })
  ),
  additionalInfo: Yup.object().shape({
    orderNumber: Yup.string(),
    customerReference: Yup.string(),
    projectCode: Yup.string(),
    departmentCode: Yup.string(),
    costCenter: Yup.string(),
    purchaseOrder: Yup.string(),
    contractNumber: Yup.string(),
    deliveryNote: Yup.string(),
    shipmentTracking: Yup.string(),
    specialInstructions: Yup.string()
  })
});

export default function CreateInvoicePageView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('RSD');
  const [exchangeRate, setExchangeRate] = useState('117.5');

  const handleCancel = useCallback(() => navigate('/dashboard/invoice-list'), [navigate]);

  const initialValues = {
    items: [
      {
        id: 1,
        route: '',
        regTag: '',
        uom: 'kom',
        quantity: '1',
        price: '',
        vat: '',
        discount: '',
        amount: ''
      }
    ],
    additionalInfo: {
      orderNumber: '',
      customerReference: '',
      projectCode: '',
      departmentCode: '',
      costCenter: '',
      purchaseOrder: '',
      contractNumber: '',
      deliveryNote: '',
      shipmentTracking: '',
      specialInstructions: ''
    }
  };

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });

  const { watch, control, setValue, handleSubmit, formState: { isSubmitting } } = methods;

  const handleSubmitForm = handleSubmit(values => {
    alert(JSON.stringify(values, null, 2));
  });

  const handleSendInvoice = handleSubmit(values => {
    console.log('Sending invoice:', values);
    alert('Invoice sent successfully!');
    navigate('/dashboard/invoice-list');
  });

  return (
    <div className="pt-2 pb-4">
      <Grid container spacing={3} sx={{ width: '120%', mx: 'auto' }}>
        {/* Main Form Card */}
        <Grid size={{ md: 9, sm: 9, xs: 12 }}>
          <Card className="p-3" sx={{ ml: -20 }}>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 3 }}>
              {t('Create Outgoing Invoice')}
            </Typography>

            <FormProvider methods={methods} onSubmit={handleSubmitForm}>
              {/* INVOICE NUMBER */}
              <Grid container spacing={3}>
                <Grid size={{ md: 6, sm: 6, xs: 12 }}>
                  <TextField fullWidth name="invoiceNo" label={t('Invoice Number')} />
                </Grid>

                <Grid size={{ md: 1, sm: 6, xs: 12 }}>
                  <TextField fullWidth name="model" label={t('Model')} />
                </Grid>

                <Grid size={{ md: 5, sm: 6, xs: 12 }}>
                  <TextField fullWidth name="referenceNo" label={t('Reference Number')} />
                </Grid>
              </Grid>

              <Divider sx={{ mt: 3, mb: 2 }} />

              {/* Invoice's dates information */}
              <Grid container spacing={3}>
                <Grid size={{ md: 4, sm: 3, xs: 12 }}>
                  <Stack spacing={3}>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {t('Invoice Information')}
                    </Typography>
                    <DatePicker name="issueDate" label={t('Issue Date')} />
                    <DatePicker name="transDate" label={t('Transaction Date')} />
                    <DatePicker name="dueDate" label={t('Due Date')} />
                  </Stack>
                </Grid>

                {/* Empty Space */}
                <Grid size={{ md: 2, sm: 0, xs: 0 }}></Grid>

                {/* Recipient */}
                <Grid size={{ md: 6, sm: 7, xs: 12 }}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {t('Recipient')}
                    </Typography>

                    <TextField
                      fullWidth
                      name="recipient"
                      label={t('Recipient')}
                      helperText={t('Find by Tax Number or Client Name')}
                    />
                  </Stack>
                </Grid>
              </Grid>

              <Divider sx={{ mt: 4, mb: 2 }} />

              {/* ITEM LIST FIELDS */}
              <InvoiceItems control={control} />

              <Divider sx={{ my: 4 }} />

              <InvoiceSummary />

              <Divider sx={{ my: 4 }} />

              <VatLiabilityRecognition />

              <Divider sx={{ my: 4 }} />

              <AdditionalInformation />

              <Divider sx={{ my: 4 }} />
            </FormProvider>
          </Card>
        </Grid>

        {/* Action Buttons Card */}
        <Grid size={{ md: 2.5, sm: 3, xs: 12 }}>
          <Card className="p-3">
            <Stack spacing={2}>
              
              {/* Currency Selection */}
              <FormControl fullWidth size="small">
                <InputLabel>{t('Currency')}</InputLabel>
                <Select
                  value={currency}
                  label={t('Currency')}
                  onChange={e => setCurrency(e.target.value)}
                >
                  <MenuItem value="RSD">RSD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                </Select>
              </FormControl>

              {/* Exchange Rate Field - only show when EUR is selected */}
              {currency === 'EUR' && (
                <Stack spacing={1}>
                  <Typography variant="caption" color="text.secondary">
                    {t('Exchange Rate')}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2">1 EUR =</Typography>
                    <MuiTextField
                      size="small"
                      variant="outlined"
                      value={exchangeRate}
                      onChange={e => setExchangeRate(e.target.value)}
                      placeholder="117.5"
                      sx={{ width: '80px' }}
                      InputProps={{ sx: { fontSize: '14px' } }}
                    />
                    <Typography variant="body2">RSD</Typography>
                  </Stack>
                </Stack>
              )}

              {/* Divider for visual separation */}
              <Divider sx={{ my: 2 }} />

              {/* Help text */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, mb: 2, lineHeight: 1.4 }}
              >
                <strong>Help:</strong> Fill in all required fields to activate the invoice sending
                link. You can save the invoice as a draft or form at any time.
              </Typography>

              <Button variant="outlined" color="primary" disabled={isSubmitting} sx={{ width: '100%' }}>
                {t('Save Form')}
              </Button>

              <Button
                type="submit"
                variant="outlined"
                color="primary"
                disabled={isSubmitting}
                sx={{ width: '100%' }}
              >
                {t('Save Draft')}
              </Button>

              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={handleSendInvoice}
                sx={{ width: '100%' }}
              >
                {t('Send Invoice')}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}