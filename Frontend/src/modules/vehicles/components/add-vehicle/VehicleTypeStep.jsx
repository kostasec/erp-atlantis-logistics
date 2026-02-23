import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { VEHICLE_TYPES } from '../../constants/vehicleCategories';

export default function VehicleTypeStep({ value, onChange }) {
  return (
    <FormControl fullWidth required>
      <InputLabel>Vehicle Type</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label="Vehicle Type"
      >
        {VEHICLE_TYPES.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
