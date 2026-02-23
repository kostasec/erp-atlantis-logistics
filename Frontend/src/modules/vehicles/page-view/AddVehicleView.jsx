import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import HeadingArea from '@/shared/components/common/cev/HeadingArea';
import Add from '@/icons/Add';
import { MASTER_STEPS } from '../constants/vehicleCategories';
import vehicleService from '../services/vehicleService';
import { employeeService } from '../../employees/services/employeeService';

import {
  VehicleTypeStep,
  VehicleDetailsStep,
  ExistingVehicleStep,
  TruckDetailsStep,
  TrailerDetailsStep,
  DriverAssignmentStep,
  DoneStep
} from '../components/add-vehicle';

// Sanitization funkcija za input-e
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return DOMPurify.sanitize(input.trim());
};

export default function AddVehicleView() {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    vehicleType: '',
    compositionMode: '',
    existingVehicle: '',
    make: '',
    model: '',
    registrationTag: '',
    truckMake: '',
    truckModel: '',
    truckRegistrationTag: '',
    trailerMake: '',
    trailerModel: '',
    trailerRegistrationTag: '',
    driver: ''
  });
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trucks, setTrucks] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [carEmployees, setCarEmployees] = useState([]);

  useEffect(() => {
    loadVehicles();
    loadDrivers();
    loadCarEmployees();
    resetAll();
  }, []);

  const loadVehicles = async () => {
    try {
      const result = await vehicleService.getAllVehicles();
      const truckList = (result?.data?.trucks || []).map(t => ({
        value: t.vehicleId,
        label: t.registrationTag
      }));
      const trailerList = (result?.data?.trailers || []).map(t => ({
        value: t.vehicleId,
        label: t.registrationTag
      }));
      setTrucks(truckList);
      setTrailers(trailerList);
    } catch (err) {
      console.error('Failed to load vehicles:', err);
    }
  };

  const loadDrivers = async () => {
    try {
      const result = await employeeService.getDrivers();
      const driverList = (result?.data || []).map(driver => ({
        value: driver.employeeId,
        label: `${driver.firstName} ${driver.lastName}`
      }));
      setDrivers(driverList);
    } catch (err) {
      console.error('Failed to load drivers:', err);
    }
  };

  const loadCarEmployees = async () => {
    try {
      const result = await vehicleService.getAvailableEmployeesForCar();
      const employeeList = (result?.data || []).map(emp => ({
        value: emp.employeeId,
        label: `${emp.firstName} ${emp.lastName}`
      }));
      setCarEmployees(employeeList);
    } catch (err) {
      console.error('Failed to load car employees:', err);
    }
  };

  // Dynamic path steps based on form state
  const pathSteps = (() => {
    const { vehicleType, compositionMode } = form;

    if (!vehicleType) return [0];
    if (vehicleType === 'truck' || vehicleType === 'trailer') return [0, 1, 6];
    if (vehicleType === 'car') return [0, 1, 5, 6];
    if (vehicleType === 'composition' && !compositionMode) return [0, 1];
    if (vehicleType === 'composition' && compositionMode === 'newComposition') return [0, 1, 3, 4, 5, 6];
    if (compositionMode === 'newTruckExistingTrailer') return [0, 1, 2, 3, 5, 6];
    if (compositionMode === 'newTrailerExistingTruck') return [0, 1, 2, 4, 5, 6];

    return [0, 1];
  })();

  const currentPathIndex = Math.max(0, pathSteps.findIndex((abs) => abs === activeStep));

  /* Field handlers */
  const handleVehicleTypeChange = (value) => {
    setForm({
      vehicleType: value,
      compositionMode: '',
      existingVehicle: '',
      make: '',
      model: '',
      registrationTag: '',
      truckMake: '',
      truckModel: '',
      truckRegistrationTag: '',
      trailerMake: '',
      trailerModel: '',
      trailerRegistrationTag: '',
      driver: ''
    });
    setAvailableVehicles([]);
    setError(null);
    setSuccess(false);
  };

  const handleCompositionModeChange = (value) => {
    setAvailableVehicles(
      value === 'newTruckExistingTrailer'
        ? trailers
        : value === 'newTrailerExistingTruck'
        ? trucks
        : []
    );
    setForm((prev) => ({ 
      ...prev, 
      compositionMode: value, 
      existingVehicle: '',
      truckMake: '', 
      truckModel: '', 
      truckRegistrationTag: '',
      trailerMake: '', 
      trailerModel: '', 
      trailerRegistrationTag: ''
    }));
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* Navigation */
  const next = () => {
    setError(null);

    switch (activeStep) {
      case 0: {
        if (!form.vehicleType) return setError('Select a vehicle type.');
        setActiveStep(1);
        return;
      }
      case 1: {
        if (form.vehicleType === 'composition') {
          if (!form.compositionMode) return setError('Select a composition mode.');
          setActiveStep(form.compositionMode === 'newComposition' ? 3 : 2);
          return;
        }
        if (!form.make || !form.model || !form.registrationTag)
          return setError('Fill all required fields.');
        if (form.vehicleType === 'car') {
          setActiveStep(5);
        } else {
          setActiveStep(6);
        }
        return;
      }
      case 2: {
        if (!form.existingVehicle) return setError('Select an existing vehicle.');
        if (form.compositionMode === 'newTruckExistingTrailer') setActiveStep(3);
        else setActiveStep(4);
        return;
      }
      case 3: {
        if (!form.truckMake || !form.truckModel || !form.truckRegistrationTag)
          return setError('Fill all required truck fields.');
        if (form.compositionMode === 'newComposition') setActiveStep(4);
        else setActiveStep(5);
        return;
      }
      case 4: {
        if (!form.trailerMake || !form.trailerModel || !form.trailerRegistrationTag)
          return setError('Fill all required trailer fields.');
        setActiveStep(5);
        return;
      }
      case 5: {
        setActiveStep(6);
        return;
      }
      case 6: {
        submit();
        return;
      }
      default:
        return;
    }
  };

  const back = () => {
    const idx = pathSteps.findIndex((abs) => abs === activeStep);
    if (idx > 0) setActiveStep(pathSteps[idx - 1]);
  };

  const resetAll = () => {
    setActiveStep(0);
    setForm({
      vehicleType: '',
      compositionMode: '',
      existingVehicle: '',
      make: '',
      model: '',
      registrationTag: '',
      truckMake: '',
      truckModel: '',
      truckRegistrationTag: '',
      trailerMake: '',
      trailerModel: '',
      trailerRegistrationTag: '',
      driver: ''
    });
    setAvailableVehicles([]);
    setError(null);
    setSuccess(false);
  };

  /* Submit */
  const submit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (form.vehicleType === 'truck' || form.vehicleType === 'trailer') {
        const vehicleData = {
          vehicleType: form.vehicleType,
          make: sanitizeInput(form.make),
          model: sanitizeInput(form.model),
          registrationTag: sanitizeInput(form.registrationTag)
        };

        const result = await vehicleService.createVehicle(vehicleData);
        
        if (result.success) {
          setSuccess(true);
          await loadVehicles();
        } else {
          setError(result.message || `Failed to create ${form.vehicleType}`);
        }
      } else if (form.vehicleType === 'car') {
        const carData = {
          type: 'car',
          make: sanitizeInput(form.make),
          model: sanitizeInput(form.model),
          registrationTag: sanitizeInput(form.registrationTag),
          driverId: form.driver || null
        };

        const result = await vehicleService.createFullCar(carData);
        
        if (result.success) {
          setSuccess(true);
          await loadVehicles();
        } else {
          setError(result.message || 'Failed to create car');
        }
      } else if (form.vehicleType === 'composition') {
        // Composition creation - handles all 3 scenarios
        const compositionData = {
          compositionMode: form.compositionMode,
          driverId: form.driver || null
        };

        // Add truck data
        if (form.compositionMode === 'newComposition' || form.compositionMode === 'newTruckExistingTrailer') {
          compositionData.truckMake = sanitizeInput(form.truckMake);
          compositionData.truckModel = sanitizeInput(form.truckModel);
          compositionData.truckRegistrationTag = sanitizeInput(form.truckRegistrationTag);
        } else if (form.compositionMode === 'newTrailerExistingTruck') {
          compositionData.existingTruckId = form.existingVehicle;
        }

        // Add trailer data
        if (form.compositionMode === 'newComposition' || form.compositionMode === 'newTrailerExistingTruck') {
          compositionData.trailerMake = sanitizeInput(form.trailerMake);
          compositionData.trailerModel = sanitizeInput(form.trailerModel);
          compositionData.trailerRegistrationTag = sanitizeInput(form.trailerRegistrationTag);
        } else if (form.compositionMode === 'newTruckExistingTrailer') {
          compositionData.existingTrailerId = form.existingVehicle;
        }

        const result = await vehicleService.createFullComposition(compositionData);
        
        if (result.success) {
          setSuccess(true);
          await loadVehicles();
        } else {
          setError(result.message || 'Failed to create composition');
        }
      } else {
        setError('This vehicle type is not yet implemented');
      }
    } catch (e) {
      console.error('Submit error:', e);
      setError(e?.response?.data?.message || e?.message || 'Submit failed.');
    } finally {
      setLoading(false);
    }
  };

  /* Render fields based on active step */
  const renderFields = () => {
    switch (activeStep) {
      case 0:
        return (
          <VehicleTypeStep 
            value={form.vehicleType} 
            onChange={handleVehicleTypeChange} 
          />
        );

      case 1:
        return (
          <VehicleDetailsStep
            vehicleType={form.vehicleType}
            compositionMode={form.compositionMode}
            make={form.make}
            model={form.model}
            registrationTag={form.registrationTag}
            onCompositionModeChange={handleCompositionModeChange}
            onFieldChange={handleFieldChange}
          />
        );

      case 2:
        return (
          <ExistingVehicleStep
            compositionMode={form.compositionMode}
            availableVehicles={availableVehicles}
            value={form.existingVehicle}
            onChange={(value) => setForm((prev) => ({ ...prev, existingVehicle: value }))}
          />
        );

      case 3:
        return (
          <TruckDetailsStep
            make={form.truckMake}
            model={form.truckModel}
            registrationTag={form.truckRegistrationTag}
            onChange={handleFieldChange}
          />
        );

      case 4:
        return (
          <TrailerDetailsStep
            make={form.trailerMake}
            model={form.trailerModel}
            registrationTag={form.trailerRegistrationTag}
            onChange={handleFieldChange}
          />
        );

      case 5:
        // Find existing vehicle registration tag if applicable
        let existingVehicleTagForStep5 = '';
        if (form.existingVehicle && form.compositionMode) {
          if (form.compositionMode === 'newTrailerExistingTruck') {
            const truck = trucks.find(t => t.value === form.existingVehicle);
            existingVehicleTagForStep5 = truck?.label || '';
          } else if (form.compositionMode === 'newTruckExistingTrailer') {
            const trailer = trailers.find(t => t.value === form.existingVehicle);
            existingVehicleTagForStep5 = trailer?.label || '';
          }
        }
        return (
          <DriverAssignmentStep
            compositionMode={form.compositionMode}
            existingVehicle={form.existingVehicle}
            existingVehicleTag={existingVehicleTagForStep5}
            truckRegistrationTag={form.truckRegistrationTag}
            trailerRegistrationTag={form.trailerRegistrationTag}
            vehicleType={form.vehicleType}
            registrationTag={form.registrationTag}
            driver={form.driver}
            drivers={form.vehicleType === 'car' ? carEmployees : drivers}
            onChange={handleFieldChange}
          />
        );

      case 6:
        // Find existing vehicle registration tag if applicable
        let existingVehicleTag = '';
        if (form.existingVehicle && form.compositionMode) {
          if (form.compositionMode === 'newTrailerExistingTruck') {
            const truck = trucks.find(t => t.value === form.existingVehicle);
            existingVehicleTag = truck?.label || '';
          } else if (form.compositionMode === 'newTruckExistingTrailer') {
            const trailer = trailers.find(t => t.value === form.existingVehicle);
            existingVehicleTag = trailer?.label || '';
          }
        }
        
        // Find employee name for car
        let employeeName = '';
        if (form.vehicleType === 'car' && form.driver) {
          const employee = carEmployees.find(e => e.value === form.driver);
          employeeName = employee?.label || '';
        }
        
        return <DoneStep {...form} existingVehicleTag={existingVehicleTag} employee={employeeName} />;

      default:
        return null;
    }
  };

  /* Get dynamic labels */
  const getDynamicLabel = (absIndex, idx) => {
    let dynamicLabel = MASTER_STEPS[absIndex].label;
    
    if (absIndex === 1) {
      dynamicLabel = (form.vehicleType === 'truck' || form.vehicleType === 'trailer' || form.vehicleType === 'car')
        ? 'Enter Information'
        : 'Composition Mode';
    }
    
    if (absIndex === 2 && form.vehicleType === 'composition') {
      dynamicLabel = form.compositionMode === 'newTrailerExistingTruck'
        ? 'Select Existing Truck'
        : 'Select Existing Trailer';
    }
    
    if (absIndex === 5) {
      if (form.vehicleType === 'car') {
        dynamicLabel = 'Driver';
      } else if (form.vehicleType === 'composition' && form.compositionMode === 'newComposition') {
        dynamicLabel = 'Driver';
      }
    }
    
    return dynamicLabel;
  };

  const getStepDescription = () => {
    const activeAbsIndex = pathSteps[currentPathIndex];
    let descriptionText = MASTER_STEPS[activeAbsIndex]?.description;
    
    if (activeAbsIndex === 1) {
      descriptionText = (form.vehicleType === 'truck' || form.vehicleType === 'trailer' || form.vehicleType === 'car')
        ? 'Enter vehicle details'
        : MASTER_STEPS[activeAbsIndex]?.description;
    }
    
    if (activeAbsIndex === 5) {
      if (form.vehicleType === 'car') {
        descriptionText = undefined;
      } else if (form.vehicleType === 'composition' && form.compositionMode === 'newComposition') {
        descriptionText = undefined;
      }
    }
    
    return descriptionText;
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 8 }}>
      <Card sx={{ px: 3, py: 2, maxWidth: 1200, width: '100%', mx: 'auto' }}>
        <HeadingArea 
          title="Vehicles"
          icon={Add} 
        />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Add Vehicle
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          {/* Horizontal Stepper */}
          <Stepper activeStep={currentPathIndex} orientation="horizontal">
            {pathSteps
              .filter((_, idx) => idx <= currentPathIndex + 1)
              .map((absIndex, idx) => {
                const step = MASTER_STEPS[absIndex];
                const isActive = currentPathIndex === idx;
                const dynamicLabel = getDynamicLabel(absIndex, idx);
                
                return (
                  <Step key={step.key}>
                    <StepLabel>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: isActive || currentPathIndex > idx ? 600 : 400 }}
                        color={isActive || currentPathIndex > idx ? 'primary' : 'text.secondary'}
                      >
                        {`${idx + 1}. ${dynamicLabel}`}
                      </Typography>
                    </StepLabel>
                  </Step>
                );
              })}
          </Stepper>

          {/* Step Description */}
          <Typography variant="body2" color="text.secondary">
            {getStepDescription()}
          </Typography>

          {/* Error Alert */}
          {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
          
          {/* Success Alert */}
          {success && <Alert severity="success" sx={{ mb: 1 }}>Vehicle created successfully!</Alert>}
          
          {/* Fields */}
          <Box display="flex" flexDirection="column" gap={3} sx={{ mb: 2 }}>
            {renderFields()}
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              disabled={currentPathIndex === 0 || loading} 
              onClick={back}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={MASTER_STEPS[activeStep]?.key === 'done' ? (success ? resetAll : next) : next}
              disabled={loading}
            >
              {MASTER_STEPS[activeStep]?.key === 'done' ? (success ? 'Done' : 'Submit') : 'Continue'}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
