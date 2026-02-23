import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';

import GridCard from '@/shared/components/common/cev/GridCard';
import LocalShipping from '@/icons/Car';
import AccountCircle from '@/icons/User';

import { paginate } from '@/utils/paginate';

export default function VehicleGrid({ vehicles, page, perPage, onPageChange, onEditVehicle }) {
  const { t } = useTranslation();

  const paginatedVehicles = paginate(page, perPage, vehicles);

  const getVehicleFields = (vehicle) => {
    let fields = [];
    let title = '';
    const type = (vehicle.type || '').toLowerCase();
    
    switch (type) {
      case 'composition':
        title = `${vehicle.truck?.registrationTag || '-'} / ${vehicle.trailer?.registrationTag || '-'}`;
        fields = [
          {
            icon: LocalShipping,
            label: t('Truck'),
            value: vehicle.truck?.registrationTag || '-',
            expandFields: [
              { label: t('Make'), value: vehicle.truck?.make || '-' },
              { label: t('Model'), value: vehicle.truck?.model || '-' },
              { label: t('Registration Tag'), value: vehicle.truck?.registrationTag || '-' }
            ]
          },
          {
            icon: LocalShipping,
            label: t('Trailer'),
            value: vehicle.trailer?.registrationTag || '-',
            expandFields: [
              { label: t('Make'), value: vehicle.trailer?.make || '-' },
              { label: t('Model'), value: vehicle.trailer?.model || '-' },
              { label: t('Registration Tag'), value: vehicle.trailer?.registrationTag || '-' }
            ]
          },
          { 
            icon: AccountCircle, 
            label: t('Drivers'), 
            value: Array.isArray(vehicle.drivers) && vehicle.drivers.length > 0
              ? vehicle.drivers.map(d => d.name || d).join(', ')
              : 'No driver'
          }
        ];
        break;

      case 'truck':
        title = vehicle.registrationTag || '-';
        fields = [
          { label: t('Make'), value: vehicle.make || '-' },
          { label: t('Model'), value: vehicle.model || '-' }
        ];
        break;

      case 'trailer':
        title = vehicle.registrationTag || '-';
        fields = [
          { label: t('Make'), value: vehicle.make || '-' },
          { label: t('Model'), value: vehicle.model || '-' }
        ];
        break;

      case 'car':
        title = vehicle.car?.registrationTag || '-';
        fields = [
          { label: t('Make'), value: vehicle.car?.make || '-' },
          { label: t('Model'), value: vehicle.car?.model || '-' },
          { 
            label: t('Employee'), 
            value: Array.isArray(vehicle.drivers) && vehicle.drivers.length > 0
              ? vehicle.drivers.map(d => d.name || d).join(', ')
              : 'No employee'
          }
        ];
        break;

      default:
        title = '-';
        fields = [];
    }

    return { title, fields };
  };

  if (vehicles.length === 0) {
    return (
      <Grid container spacing={3}>
        <Grid size={12}>
          <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
            {t('No vehicles available yet.')}
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {paginatedVehicles.map(vehicle => {
        const { title, fields } = getVehicleFields(vehicle);
        const type = (vehicle.type || '').toLowerCase();
        
        return (
          <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }} key={vehicle.id || vehicle.registrationTag || title}>
            <Box sx={{ position: 'relative', width: '100%' }}>
              <GridCard
                title={title}
                subtitle={vehicle.role || ''}
                fields={fields}
                sx={{ width: '100%' }}
              />
              {(type === 'composition' || type === 'truck' || type === 'trailer' || type === 'car') && onEditVehicle && (
                <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                  <Tooltip title={t(`Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`)}>
                    <IconButton 
                      size="small" 
                      onClick={() => onEditVehicle(vehicle, type)}
                      sx={{
                        bgcolor: 'background.paper',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          color: 'text.primary'
                        },
                        '&.Mui-disabled': { opacity: 0.7 }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Grid>
        );
      })}

      <Grid size={12}>
        <Stack alignItems="center" py={2}>
          <Pagination 
            shape="rounded" 
            count={Math.ceil(vehicles.length / perPage)} 
            page={page}
            onChange={(_, newPage) => onPageChange(newPage)} 
          />
        </Stack>
      </Grid>
    </Grid>
  );
}
