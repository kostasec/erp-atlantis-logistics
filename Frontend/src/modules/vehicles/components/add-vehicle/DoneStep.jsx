import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function DoneStep({ 
  vehicleType, 
  compositionMode,
  make,
  model,
  registrationTag,
  truckMake,
  truckModel,
  truckRegistrationTag,
  trailerMake,
  trailerModel,
  trailerRegistrationTag,
  existingVehicle,
  existingVehicleTag,
  driver,
  employee
}) {
  // Simple vehicle (truck, trailer, or car)
  if (vehicleType === 'truck' || vehicleType === 'trailer' || vehicleType === 'car') {
    const typeLabel = vehicleType === 'truck' ? 'Truck' : vehicleType === 'trailer' ? 'Trailer' : 'Car';
    
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>Done</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          The vehicle has been entered.
        </Typography>
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography><strong>Type:</strong> {typeLabel}</Typography>
          <Typography><strong>Make:</strong> {make}</Typography>
          <Typography><strong>Model:</strong> {model}</Typography>
          <Typography><strong>Registration:</strong> {registrationTag}</Typography>
          {vehicleType === 'car' && employee && (
            <Typography><strong>Employee:</strong> {employee}</Typography>
          )}
        </Box>
      </Box>
    );
  }

  // Composition
  const isNewComposition = compositionMode === 'newComposition';
  let pairingSummary = '';
  
  if (!isNewComposition) {
    if (compositionMode === 'newTruckExistingTrailer') {
      pairingSummary = `${truckRegistrationTag || 'TRK'}/${existingVehicleTag || '[Existing Trailer]'}`;
    } else if (compositionMode === 'newTrailerExistingTruck') {
      pairingSummary = `${existingVehicleTag || '[Existing Truck]'}/${trailerRegistrationTag || 'TRL'}`;
    }
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Done</Typography>
      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
        {isNewComposition ? (
          <>
            <Typography sx={{ mb: 1 }}><strong>New Composition:</strong></Typography>
            <Typography>Truck Make: {truckMake}</Typography>
            <Typography>Truck Model: {truckModel}</Typography>
            <Typography>Truck Registration Tag: {truckRegistrationTag}</Typography>
            
            <Typography sx={{ mt: 1 }}>Trailer Make: {trailerMake}</Typography>
            <Typography>Trailer Model: {trailerModel}</Typography>
            <Typography>Trailer Registration Tag: {trailerRegistrationTag}</Typography>
          </>
        ) : (
          <Typography sx={{ mb: 1 }}><strong>Composition:</strong> {pairingSummary}</Typography>
        )}
      </Box>
    </Box>
  );
}
