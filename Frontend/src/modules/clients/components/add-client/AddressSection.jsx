import { Controller } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';

import HomeOutlined from '@/icons/HomeOutlined';

export default function AddressSection({ control, errors }) {
  return (
    <>
      <Typography variant="h6" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <HomeOutlined sx={{ fontSize: 20 }} />
        Address Information
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 3 }}>
          <Controller
            name="streetAndNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Street and Number"
                fullWidth
                error={!!errors.streetAndNumber}
                helperText={errors.streetAndNumber?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 3 }}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="City"
                fullWidth
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 3 }}>
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="ZIP Code"
                fullWidth
                error={!!errors.zipCode}
                helperText={errors.zipCode?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 3 }}>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Country"
                fullWidth
                error={!!errors.country}
                helperText={errors.country?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </>
  );
}
