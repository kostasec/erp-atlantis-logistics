import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function DriverAssignmentStep({ 
  compositionMode, 
  existingVehicle,
  existingVehicleTag,
  truckRegistrationTag,
  trailerRegistrationTag,
  vehicleType,
  registrationTag,
  driver,
  drivers = [],
  onChange 
}) {
  const isNewComposition = compositionMode === 'newComposition';
  const isCar = vehicleType === 'car';
  
  let compositionLabel = '';
  if (!isNewComposition && !isCar) {
    if (compositionMode === 'newTruckExistingTrailer') {
      compositionLabel = `${truckRegistrationTag || 'TRK'}/${existingVehicleTag || '[Existing Trailer]'}`;
    } else if (compositionMode === 'newTrailerExistingTruck') {
      compositionLabel = `${existingVehicleTag || '[Existing Truck]'}/${trailerRegistrationTag || 'TRL'}`;
    }
  }

  return (
    <Box>
      {isCar && registrationTag && (
        <Typography sx={{ mb: 2 }}>
          Car Registration: {registrationTag}
        </Typography>
      )}
      
      {!isNewComposition && !isCar && compositionLabel && (
        <Typography sx={{ mb: 2 }}>
          Composition Registration: {compositionLabel}
        </Typography>
      )}
      
      <FormControl fullWidth>
        <InputLabel>Assign Driver (Optional)</InputLabel>
        <Select
          value={driver || ''}
          label="Assign Driver (Optional)"
          onChange={(e) => onChange('driver', e.target.value)}
        >
          <MenuItem value="">
            <em>No Driver</em>
          </MenuItem>
          {drivers.map((d) => (
            <MenuItem key={d.value} value={d.value}>
              {d.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        You can assign a driver to this composition now or leave it unassigned.
      </Typography>
    </Box>
  );
}
