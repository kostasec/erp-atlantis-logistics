export const VEHICLE_CATEGORIES = ['Compositions', 'Trucks', 'Trailers', 'Cars'];

export const VEHICLE_TYPES = [
  { value: 'truck', label: 'Truck' },
  { value: 'trailer', label: 'Trailer' },
  { value: 'car', label: 'Car' },
  { value: 'composition', label: 'Composition' }
];

export const COMPOSITION_MODES = [
  { value: 'newTruckExistingTrailer', label: 'Add New Truck to Existing Trailer' },
  { value: 'newTrailerExistingTruck', label: 'Add New Trailer to Existing Truck' },
  { value: 'newComposition', label: 'Create New Composition' }
];

export const MASTER_STEPS = [
  { key: 'type', label: 'Select Vehicle Type', description: 'Choose the type of vehicle to add' },
  { key: 'modeOrInfo', label: 'Composition Mode', description: 'Depending on type, select mode or enter info' },
  { key: 'existing', label: 'Select Existing Vehicle', description: 'Select truck or trailer to pair with' },
  { key: 'newTruckInformation', label: 'New Truck Information', description: 'Enter information for the new truck' },
  { key: 'newTrailerInformation', label: 'New Trailer Infromation', description: 'Enter information for the new trailer' },
  { key: 'summary', label: 'Summary', description: 'Review composition and assign driver (optional)' },
  { key: 'done', label: 'Done', description: 'Process completed successfully' }
];
