import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import HeadingArea from '@/shared/components/common/cev/HeadingArea';
import Add from '@/icons/Add';
import { VEHICLE_CATEGORIES } from '../../constants/vehicleCategories';

export default function VehicleHeader({ selectedCategory, onCategoryChange, onAddVehicle }) {
  const { t } = useTranslation();

  return (
    <Box>
      <HeadingArea 
        title={
          <Typography variant="h5" fontWeight={600}>
            {t('Vehicles')}
          </Typography>
        } 
      />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Vehicle management and creation
      </Typography>

      <Stack spacing={2} sx={{ mt: 1, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {VEHICLE_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'contained' : 'outlined'}
              onClick={() => onCategoryChange(category)}
              size="medium"
            >
              {t(category)}
            </Button>
          ))}
          
          <Box sx={{ ml: 'auto' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAddVehicle}
              size="medium"
            >
              {t('Add Vehicle')}
            </Button>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
