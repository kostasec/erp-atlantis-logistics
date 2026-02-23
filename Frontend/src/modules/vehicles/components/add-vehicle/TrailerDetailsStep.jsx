import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function TrailerDetailsStep({ make, model, registrationTag, onChange }) {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <TextField 
        label="Trailer Make" 
        required 
        fullWidth 
        value={make} 
        onChange={(e) => onChange('trailerMake', e.target.value)} 
      />
      <TextField 
        label="Trailer Model" 
        required 
        fullWidth 
        value={model} 
        onChange={(e) => onChange('trailerModel', e.target.value)} 
      />
      <TextField 
        label="Trailer Registration Tag" 
        required 
        fullWidth 
        value={registrationTag} 
        onChange={(e) => onChange('trailerRegistrationTag', e.target.value)} 
      />
    </Box>
  );
}
