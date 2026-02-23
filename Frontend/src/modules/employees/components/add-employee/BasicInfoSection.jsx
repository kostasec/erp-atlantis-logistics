import { Controller } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';

import User from '@/icons/User';

export default function BasicInfoSection({ control, errors, t, managers = [], loadingManagers = false }) {
  return (
    <>
      <Typography variant="h6" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <User sx={{ fontSize: 20 }} />
        Basic Information
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="employeeType"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label={t('Employee Type')}
                fullWidth
                error={!!errors.employeeType}
                helperText={errors.employeeType?.message}
              >
                <MenuItem value="Driver">Driver</MenuItem>
                <MenuItem value="Office">Office</MenuItem>
                <MenuItem value="Director">Director</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Warehouse">Warehouse</MenuItem>
              </TextField>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('First Name')}
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            )}
          />
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('Last Name')}
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('Phone Number')}
                fullWidth
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="emailAddress"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('Email Address (Optional)')}
                type="email"
                fullWidth
                error={!!errors.emailAddress}
                helperText={errors.emailAddress?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="managerId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label={t('Manager (Optional)')}
                fullWidth
                error={!!errors.managerId}
                helperText={errors.managerId?.message}
                value={field.value || ''}
                disabled={loadingManagers}
                InputProps={{
                  endAdornment: loadingManagers && <CircularProgress size={20} />
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {managers.map((manager) => (
                  <MenuItem key={manager.employeeId} value={manager.employeeId}>
                    {manager.fullName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="vehicle"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label={t('Vehicle (Optional)')}
                fullWidth
                error={!!errors.vehicle}
                helperText={errors.vehicle?.message}
                value={field.value || ''}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="v1">Vehicle 1</MenuItem>
                <MenuItem value="v2">Vehicle 2</MenuItem>
              </TextField>
            )}
          />              
        </Grid>
      </Grid>
    </>
  );
}