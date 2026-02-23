import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { COMPOSITION_MODES } from '../../constants/vehicleCategories';

export default function VehicleDetailsStep({ 
  vehicleType, 
  compositionMode,
  make,
  model,
  registrationTag,
  onCompositionModeChange,
  onFieldChange 
}) {
  // For composition: show mode selector
  if (vehicleType === 'composition') {
    return (
      <FormControl fullWidth required>
        <InputLabel>Composition Mode</InputLabel>
        <Select
          value={compositionMode}
          onChange={(e) => onCompositionModeChange(e.target.value)}
          label="Composition Mode"
        >
          {COMPOSITION_MODES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  // For truck/trailer/car: show basic fields
  if (vehicleType === 'truck' || vehicleType === 'trailer' || vehicleType === 'car') {
    return (
      <Box display="flex" flexDirection="column" gap={3}>
        <TextField 
          label="Make" 
          required 
          fullWidth 
          value={make} 
          onChange={(e) => onFieldChange('make', e.target.value)} 
        />
        <TextField 
          label="Model" 
          required 
          fullWidth 
          value={model} 
          onChange={(e) => onFieldChange('model', e.target.value)} 
        />
        <TextField 
          label="Registration Tag" 
          required 
          fullWidth 
          value={registrationTag} 
          onChange={(e) => onFieldChange('registrationTag', e.target.value)} 
        />
      </Box>
    );
  }

  return null;
}
