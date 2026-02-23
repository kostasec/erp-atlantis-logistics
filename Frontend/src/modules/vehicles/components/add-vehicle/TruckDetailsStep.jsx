import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function TruckDetailsStep({ make, model, registrationTag, onChange }) {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <TextField 
        label="Truck Make" 
        required 
        fullWidth 
        value={make} 
        onChange={(e) => onChange('truckMake', e.target.value)} 
      />
      <TextField 
        label="Truck Model" 
        required 
        fullWidth 
        value={model} 
        onChange={(e) => onChange('truckModel', e.target.value)} 
      />
      <TextField 
        label="Truck Registration Tag" 
        required 
        fullWidth 
        value={registrationTag} 
        onChange={(e) => onChange('truckRegistrationTag', e.target.value)} 
      />
    </Box>
  );
}
