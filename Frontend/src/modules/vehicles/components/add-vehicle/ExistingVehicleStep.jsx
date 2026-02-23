import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function ExistingVehicleStep({ compositionMode, availableVehicles, value, onChange }) {
  const label = compositionMode === 'newTruckExistingTrailer' 
    ? 'Select Trailer' 
    : 'Select Truck';

  return (
    <FormControl fullWidth required>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        {availableVehicles && availableVehicles.length > 0 ? (
          availableVehicles.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No vehicles available</MenuItem>
        )}
      </Select>
    </FormControl>
  );
}
