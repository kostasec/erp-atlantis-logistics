/**
 * Calculate the status of an inspection based on the next inspection date
 */
export const calculateStatus = (nextInspectionDate) => {
  const days = calculateDaysUntilExpiry(nextInspectionDate);
  if (days < 0) return 'expired';
  if (days < 30) return 'warning';
  return 'valid';
};

/**
 * Calculate the number of days until the inspection expires
 */
export const calculateDaysUntilExpiry = (nextInspectionDate) => {
  const today = new Date();
  const expiry = new Date(nextInspectionDate);
  const diffTime = expiry - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Filter inspections by category
 */
export const filterInspectionsByCategory = (inspections, category) => {
  // Inspekcije su već filtrirane po kategoriji prilikom učitavanja
  // Ovde samo vraćamo sve inspekcije
  return inspections;
};

/**
 * Transform backend data to frontend structure
 */
export const transformInspectionData = (backendData, category = 'Vehicle Inspections') => {
  return backendData.map(inspection => {
    const baseData = {
      id: inspection.id || inspection.inspectionId,
      inspectionType: inspection.name,
      lastInspection: inspection.oldDate,
      nextInspection: inspection.newDate,
      status: calculateStatus(inspection.newDate),
      daysUntilExpiry: calculateDaysUntilExpiry(inspection.newDate),
      inspector: '',
      notes: ''
    };

    // Dodaj specifična polja zavisno od kategorije
    if (category === 'Vehicle Inspections') {
      return {
        ...baseData,
        vehicleId: inspection.registrationTag
      };
    } else if (category === 'Employee Inspections') {
      return {
        ...baseData,
        vehicleId: inspection.employeeName // koristimo vehicleId polje za prikaz imena zaposlenog
      };
    } else if (category === 'Other Inspections') {
      return {
        ...baseData,
        vehicleId: null // Other inspections nemaju vehicle/employee reference
      };
    }

    return baseData;
  });
};
