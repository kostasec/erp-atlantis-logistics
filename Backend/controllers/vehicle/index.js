const VehicleService = require('../../services/VehicleService');

/**
 * @swagger
 * /vehicle/all:
 *   get:
 *     summary: Get all vehicles (trucks, trailers, compositions, cars)
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: List of all vehicles
 *       500:
 *         description: Server error
 */
exports.getAllVehicles = async (req, res, next) => {
  try {
    const data = await VehicleService.getAllVehicles();
    return res.json({
      success: true,
      data
    });
  } catch (err) {
    console.error('Error fetching all vehicles:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicles'
    });
  }
};

/**
 * @swagger
 * /vehicle/available-employees:
 *   get:
 *     summary: Get available employees for car assignment (non-drivers)
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: List of available employees
 *       500:
 *         description: Server error
 */
exports.getAvailableEmployeesForCar = async (req, res, next) => {
  try {
    const data = await VehicleService.getAvailableEmployeesForCar();
    return res.json({
      success: true,
      data
    });
  } catch (err) {
    console.error('Error fetching available employees:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available employees'
    });
  }
};


/**
 * @swagger
 * /vehicle/truck:
 *   post:
 *     summary: Create a new truck
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Truck created
 *       500:
 *         description: Server error
 */
exports.createTruck = async (req, res, next) => {
  try {
    const truck = await VehicleService.createTruck(req.body);
    return res.status(201).json({
      success: true,
      data: truck
    });
  } catch (err) {
    console.error('Error creating truck:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create truck'
    });
  }
};

/**
 * @swagger
 * /vehicle/trailer:
 *   post:
 *     summary: Create a new trailer
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Trailer created
 *       500:
 *         description: Server error
 */
exports.createTrailer = async (req, res, next) => {
  try {
    const trailer = await VehicleService.createTrailer(req.body);
    return res.status(201).json({
      success: true,
      data: trailer
    });
  } catch (err) {
    console.error('Error creating trailer:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create trailer'
    });
  }
};

/**
 * @swagger
 * /vehicle/composition-full:
 *   post:
 *     summary: Create full composition with optional new truck/trailer and driver assignment
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               compositionMode:
 *                 type: string
 *                 enum: [newComposition, newTruckExistingTrailer, newTrailerExistingTruck]
 *               truckMake:
 *                 type: string
 *               truckModel:
 *                 type: string
 *               truckRegistrationTag:
 *                 type: string
 *               trailerMake:
 *                 type: string
 *               trailerModel:
 *                 type: string
 *               trailerRegistrationTag:
 *                 type: string
 *               existingTruckId:
 *                 type: integer
 *               existingTrailerId:
 *                 type: integer
 *               driverId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Composition created successfully
 *       500:
 *         description: Server error
 */
exports.createFullComposition = async (req, res, next) => {
  try {
    const result = await VehicleService.createFullComposition(req.body);
    return res.status(201).json(result);
  } catch (err) {
    console.error('Error creating full composition:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create composition'
    });
  }
};

/**
 * @swagger
 * /vehicle/car-full:
 *   post:
 *     summary: Create car with optional employee assignment
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               registrationTag:
 *                 type: string
 *               driverId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Car created successfully
 *       500:
 *         description: Server error
 */
exports.createFullCar = async (req, res, next) => {
  try {
    const result = await VehicleService.createFullCar(req.body);
    return res.status(201).json(result);
  } catch (err) {
    console.error('Error creating full car:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create car'
    });
  }
};

/**
 * @swagger
 * /vehicle/truck/{truckId}:
 *   put:
 *     summary: Update a truck
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: truckId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Truck updated
 *       500:
 *         description: Server error
 */
exports.updateTruck = async (req, res, next) => {
  try {
    const { truckId } = req.params;
    const truck = await VehicleService.updateTruck(parseInt(truckId, 10), req.body);
    return res.json({
      success: true,
      data: truck
    });
  } catch (err) {
    console.error('Error updating truck:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update truck'
    });
  }
};

/**
 * @swagger
 * /vehicle/trailer/{trailerId}:
 *   put:
 *     summary: Update a trailer
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: trailerId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Trailer updated
 *       500:
 *         description: Server error
 */
exports.updateTrailer = async (req, res, next) => {
  try {
    const { trailerId } = req.params;
    const trailer = await VehicleService.updateTrailer(parseInt(trailerId, 10), req.body);
    return res.json({
      success: true,
      data: trailer
    });
  } catch (err) {
    console.error('Error updating trailer:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update trailer'
    });
  }
};

/**
 * @swagger
 * /vehicle/car/{carId}:
 *   put:
 *     summary: Update a car
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Car updated
 *       500:
 *         description: Server error
 */
exports.updateCar = async (req, res, next) => {
  try {
    const { carId } = req.params;
    const car = await VehicleService.updateCar(parseInt(carId, 10), req.body);
    return res.json({
      success: true,
      data: car
    });
  } catch (err) {
    console.error('Error updating car:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update car'
    });
  }
};

/**
 * @swagger
 * /vehicle/composition/{compositionId}/truck:
 *   put:
 *     summary: Update truck in composition
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: compositionId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               truckId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Composition truck updated
 *       500:
 *         description: Server error
 */
exports.updateCompositionTruck = async (req, res, next) => {
  try {
    const { compositionId } = req.params;
    const { truckId } = req.body;
    const result = await VehicleService.updateCompositionTruck(parseInt(compositionId, 10), parseInt(truckId, 10));
    return res.json(result);
  } catch (err) {
    console.error('Error updating composition truck:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update composition truck'
    });
  }
};

/**
 * @swagger
 * /vehicle/composition/{compositionId}/trailer:
 *   put:
 *     summary: Update trailer in composition
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: compositionId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trailerId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Composition trailer updated
 *       500:
 *         description: Server error
 */
exports.updateCompositionTrailer = async (req, res, next) => {
  try {
    const { compositionId } = req.params;
    const { trailerId } = req.body;
    const result = await VehicleService.updateCompositionTrailer(parseInt(compositionId, 10), parseInt(trailerId, 10));
    return res.json(result);
  } catch (err) {
    console.error('Error updating composition trailer:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update composition trailer'
    });
  }
};

/**
 * @swagger
 * /vehicle/composition/driver/{driverCompId}:
 *   delete:
 *     summary: Remove driver from composition
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: driverCompId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Driver removed from composition
 *       500:
 *         description: Server error
 */
exports.removeDriverFromComposition = async (req, res, next) => {
  try {
    const { driverCompId } = req.params;
    const result = await VehicleService.removeDriverFromComposition(parseInt(driverCompId, 10));
    return res.json(result);
  } catch (err) {
    console.error('Error removing driver from composition:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to remove driver from composition'
    });
  }
};

/**
 * @swagger
 * /vehicle/composition/driver/{driverCompId}:
 *   put:
 *     summary: Update driver in composition
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: driverCompId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driverId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Driver updated successfully
 *       500:
 *         description: Server error
 */
exports.updateCompositionDriver = async (req, res, next) => {
  try {
    const { driverCompId } = req.params;
    const { driverId } = req.body;
    const result = await VehicleService.updateCompositionDriver(parseInt(driverCompId, 10), parseInt(driverId, 10));
    return res.json(result);
  } catch (err) {
    console.error('Error updating composition driver:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update composition driver'
    });
  }
};

/**
 * @swagger
 * /vehicle/composition/{compositionId}/driver:
 *   post:
 *     summary: Assign driver to composition
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: compositionId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driverId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Driver assigned successfully
 *       500:
 *         description: Server error
 */
exports.assignDriverToComposition = async (req, res, next) => {
  try {
    const { compositionId } = req.params;
    const { driverId } = req.body;
    const result = await VehicleService.assignDriverToComposition(parseInt(compositionId, 10), parseInt(driverId, 10));
    return res.json(result);
  } catch (err) {
    console.error('Error assigning driver to composition:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to assign driver to composition'
    });
  }
};

/**
 * @swagger
 * /vehicle/truck/{truckId}:
 *   delete:
 *     summary: Delete a truck
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: truckId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Truck deleted
 *       500:
 *         description: Server error
 */
exports.deleteTruck = async (req, res, next) => {
  try {
    const { truckId } = req.params;
    const result = await VehicleService.deleteTruck(parseInt(truckId, 10));
    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('Error deleting truck:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete truck'
    });
  }
};

/**
 * @swagger
 * /vehicle/trailer/{trailerId}:
 *   delete:
 *     summary: Delete a trailer
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: trailerId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trailer deleted
 *       500:
 *         description: Server error
 */
exports.deleteTrailer = async (req, res, next) => {
  try {
    const { trailerId } = req.params;
    const result = await VehicleService.deleteTrailer(parseInt(trailerId, 10));
    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('Error deleting trailer:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete trailer'
    });
  }
};

/**
 * @swagger
 * /vehicle/car/{carId}:
 *   delete:
 *     summary: Delete a car
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Car deleted
 *       500:
 *         description: Server error
 */
exports.deleteCar = async (req, res, next) => {
  try {
    const { carId } = req.params;
    const result = await VehicleService.deleteCar(parseInt(carId, 10));
    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('Error deleting car:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete car'
    });
  }
};

/**
 * @swagger
 * /vehicle/composition/{compositionId}:
 *   delete:
 *     summary: Delete a composition
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: compositionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Composition deleted
 *       500:
 *         description: Server error
 */
exports.deleteComposition = async (req, res, next) => {
  try {
    const { compositionId } = req.params;
    const result = await VehicleService.deleteComposition(parseInt(compositionId, 10));
    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('Error deleting composition:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete composition'
    });
  }
};

/**
 * @swagger
 * /vehicle/driver-composition/{driverCompId}:
 *   delete:
 *     summary: Remove driver from composition
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: driverCompId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Driver removed from composition
 *       500:
 *         description: Server error
 */
exports.removeDriverFromComposition = async (req, res, next) => {
  try {
    const { driverCompId } = req.params;
    const result = await VehicleService.removeDriverFromComposition(parseInt(driverCompId, 10));
    return res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    console.error('Error removing driver from composition:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to remove driver from composition'
    });
  }
};

/**
 * @swagger
 * /vehicle/car/{carId}/employee:
 *   post:
 *     summary: Assign employee to car
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Employee assigned to car
 *       500:
 *         description: Server error
 */
exports.assignEmployeeToCar = async (req, res, next) => {
  try {
    const { carId } = req.params;
    const { employeeId } = req.body;
    const result = await VehicleService.assignEmployeeToCar(parseInt(carId, 10), parseInt(employeeId, 10));
    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('Error assigning employee to car:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to assign employee to car'
    });
  }
};

/**
 * @swagger
 * /vehicle/car/employee/{employeeCarId}:
 *   delete:
 *     summary: Remove employee from car
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: employeeCarId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employee removed from car
 *       500:
 *         description: Server error
 */
exports.removeEmployeeFromCar = async (req, res, next) => {
  try {
    const { employeeCarId } = req.params;
    const result = await VehicleService.removeEmployeeFromCar(parseInt(employeeCarId, 10));
    return res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    console.error('Error removing employee from car:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to remove employee from car'
    });
  }
};
