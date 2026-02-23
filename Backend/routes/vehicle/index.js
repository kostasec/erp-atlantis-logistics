const express = require('express');
const router = express.Router();

const vehicleController = require('../../controllers/vehicle/index');
const { authenticateToken } = require('../../middleware/auth');

// DEBUG: Route without auth for testing
router.get('/test-all', vehicleController.getAllVehicles);

// GET endpoints
router.get('/all', authenticateToken, vehicleController.getAllVehicles);
router.get('/available-employees', authenticateToken, vehicleController.getAvailableEmployeesForCar);

// POST endpoints
router.post('/truck', authenticateToken, vehicleController.createTruck);
router.post('/trailer', authenticateToken, vehicleController.createTrailer);
router.post('/composition-full', authenticateToken, vehicleController.createFullComposition);
router.post('/car-full', authenticateToken, vehicleController.createFullCar);
router.post('/composition/:compositionId/driver', authenticateToken, vehicleController.assignDriverToComposition);
router.post('/car/:carId/employee', authenticateToken, vehicleController.assignEmployeeToCar);

// PUT endpoints
router.put('/truck/:truckId', authenticateToken, vehicleController.updateTruck);
router.put('/trailer/:trailerId', authenticateToken, vehicleController.updateTrailer);
router.put('/car/:carId', authenticateToken, vehicleController.updateCar);
router.put('/composition/:compositionId/truck', authenticateToken, vehicleController.updateCompositionTruck);
router.put('/composition/:compositionId/trailer', authenticateToken, vehicleController.updateCompositionTrailer);
router.put('/composition/driver/:driverCompId', authenticateToken, vehicleController.updateCompositionDriver);

// DELETE endpoints
router.delete('/truck/:truckId', authenticateToken, vehicleController.deleteTruck);
router.delete('/trailer/:trailerId', authenticateToken, vehicleController.deleteTrailer);
router.delete('/car/:carId', authenticateToken, vehicleController.deleteCar);
router.delete('/composition/:compositionId', authenticateToken, vehicleController.deleteComposition);
router.delete('/composition/driver/:driverCompId', authenticateToken, vehicleController.removeDriverFromComposition);
router.delete('/car/employee/:employeeCarId', authenticateToken, vehicleController.removeEmployeeFromCar);

module.exports = router;
