import { Controller } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

import Phone from '@/icons/Call';

export default function ContactPersonSection({ control, errors, onDeleteContact, disableDelete }) {
  return (
    <>
      <Typography variant="h6" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Phone sx={{ fontSize: 20 }} />
        Contact Person (Optional)
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 3 }}>
          <Controller
            name="contactPersonName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Contact Person Name"
                fullWidth
                error={!!errors.contactPersonName}
                helperText={errors.contactPersonName?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 3 }}>
          <Controller
            name="contactPersonDescription"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description/Title"
                fullWidth
                error={!!errors.contactPersonDescription}
                helperText={errors.contactPersonDescription?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 3 }}>
          <Controller
            name="contactPersonPhone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone Number"
                fullWidth
                error={!!errors.contactPersonPhone}
                helperText={errors.contactPersonPhone?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Controller
              name="contactPersonEmail"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Contact Email"
                  type="email"
                  fullWidth
                  error={!!errors.contactPersonEmail}
                  helperText={errors.contactPersonEmail?.message}
                />
              )}
            />
            {onDeleteContact && (
              <Tooltip title="Delete Contact">
                <span>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={onDeleteContact}
                    disabled={disableDelete}
                    sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'error.lighter', color: 'error.main' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </div>
        </Grid>
      </Grid>
    </>
  );
}
