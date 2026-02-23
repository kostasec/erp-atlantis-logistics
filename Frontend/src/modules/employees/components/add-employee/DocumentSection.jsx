import { Controller } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';

import FileOutlined from '@/icons/FileOutlined';

export default function DocumentSection({ control, errors, t }) {
  return (
    <>
      <Typography variant="h6" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FileOutlined sx={{ fontSize: 20 }} />
        Document Information
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="idCardNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('ID Card Number')}
                fullWidth
                error={!!errors.idCardNumber}
                helperText={errors.idCardNumber?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </>
  );
}