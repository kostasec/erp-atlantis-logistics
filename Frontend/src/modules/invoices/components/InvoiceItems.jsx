import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ItemRow from './ItemRow';
import ItemTypeDialog from './ItemTypeDialog';


export default function InvoiceItems({ control }) {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    fields,
    append,
    remove
  } = useFieldArray({
    name: 'items',
    control
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmItemType = (itemType) => {
    if (itemType === 'transport') {
      // Transport item - no taxName property
      append({
        route: '',
        regTag: '',
        uom: 'kom',
        quantity: '1',
        price: '',
        vat: '',
        discount: '',
        amount: ''
      });
    } else if (itemType === 'tax') {
      // Tax item - with taxName property
      append({
        taxName: '',
        uom: 'kom',
        quantity: '1',
        price: '',
        vat: '',
        discount: '',
        amount: ''
      });
    }
    setDialogOpen(false);
  };

  const handleRemoveItem = (index) => {
    remove(index);
  };

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack spacing={3}>
          <Typography variant="subtitle1" fontWeight={500}>
            {t('Item Information')}
          </Typography>
          
          <Grid container spacing={2} alignItems="flex-end">
            {fields.map((field, index) => (
              <ItemRow 
                key={field.id} 
                index={index} 
                field={field} 
                control={control} 
                onRemove={() => handleRemoveItem(index)} 
                onAdd={handleOpenDialog}
              />
            ))}
          </Grid>
        </Stack>
      </Grid>

      {/* Item Type Selection Dialog */}
      <ItemTypeDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmItemType}
      />
    </Grid>
  );
}