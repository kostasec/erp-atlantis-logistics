import { Controller } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import User from '@/icons/User';

export default function BasicInfoSection({ control, errors }) {
  return (
    <>
      <Typography variant="h6" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <User sx={{ fontSize: 20 }} />
        Basic Information
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="clientName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Client Name"
                fullWidth
                error={!!errors.clientName}
                helperText={errors.clientName?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="clientType"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Client Type"
                fullWidth
                error={!!errors.clientType}
                helperText={errors.clientType?.message}
              >
                <MenuItem value="Transportation">Transportation</MenuItem>
                <MenuItem value="Supplier">Supplier</MenuItem>
              </TextField>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="taxId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tax ID"
                fullWidth
                error={!!errors.taxId}
                helperText={errors.taxId?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="regNmbr"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Registration Number"
                fullWidth
                error={!!errors.regNmbr}
                helperText={errors.regNmbr?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </>
  );
}
