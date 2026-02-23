// services/VehicleService.js
const { sql, getPool } = require('../util/db');
const Truck = require('../models/Vehicle/Truck');
const Trailer = require('../models/Vehicle/Trailer');
const Car = require('../models/Vehicle/Car');
const Composition = require('../models/Vehicle/Composition');
const DriverComposition = require('../models/Vehicle/DriverComposition');
const EmployeeCar = require('../models/Vehicle/EmployeeCar');
const VehicleDTO = require('../dto/VehicleDTO');

class VehicleService {
  /**
   * Transform Truck to frontend format
   */
  static transformTruckToFrontend(truck) {
    return {
      vehicleId: truck.TruckID,
      type: 'truck',
      vehicleType: 'truck',
      make: truck.Make,
      model: truck.Model,
      registrationTag: truck.RegistrationTag,
      status: truck.Status
    };
  }

  /**
   * Transform Trailer to frontend format
   */
  static transformTrailerToFrontend(trailer) {
    return {
      vehicleId: trailer.TrailerID,
      type: 'trailer',
      vehicleType: 'trailer',
      make: trailer.Make,
      model: trailer.Model,
      registrationTag: trailer.RegistrationTag,
      status: trailer.Status
    };
  }

  /**
   * Transform Composition to frontend format
   */
  static transformCompositionToFrontend(composition) {
    return {
      compositionId: composition.CompositionID,
      type: 'composition',
      vehicleType: 'composition',
      truck: {
        vehicleId: composition.TruckID,
        make: composition.TruckMake,
        model: composition.TruckModel,
        registrationTag: composition.TruckRegistrationTag,
        status: composition.TruckStatus
      },
      trailer: {
        vehicleId: composition.TrailerID,
        make: composition.TrailerMake,
        model: composition.TrailerModel,
        registrationTag: composition.TrailerRegistrationTag,
        status: composition.TrailerStatus
      },
      compositionName: `${composition.TruckRegistrationTag}/${composition.TrailerRegistrationTag}`,
      driver: composition.Driver,
      driverId: composition.DriverID,
      driverCompId: composition.DriverCompID
    };
  }

  /**
   * Get all vehicles (trucks, trailers, compositions, cars) combined
   */
  static async getAllVehicles() {
    const [trucks, trailers, compositions, cars] = await Promise.all([
      this.getAllTrucks(),
      this.getAllTrailers(),
      this.getAllCompositions(),
      this.getCarByEmployee()
    ]);

    return {
      trucks,
      trailers,
      compositions,
      cars
    };
  }

  /**
   * Get available employees for car assignment (non-drivers)
   */
  static async getAvailableEmployeesForCar() {
    try {
      const result = await EmployeeCar.fetchAvailableEmployees();
      if (!result.recordset || result.recordset.length === 0) {
        return [];
      }
      return result.recordset.map(emp => ({
        employeeId: emp.EmplID,
        firstName: emp.FirstName,
        lastName: emp.LastName
      }));
    } catch (error) {
      console.error('Error in getAvailableEmployeesForCar:', error);
      throw error;
    }
  }

  /**
   * Get all trucks
   */
  static async getAllTrucks() {
    try {
      const result = await Truck.fetchAll();
      if (!result.recordset || result.recordset.length === 0) {
        return [];
      }
      return result.recordset.map(truck => this.transformTruckToFrontend(truck));
    } catch (error) {
      console.error('Error in getAllTrucks:', error);
      throw error;
    }
  }

  /**
   * Get all trailers
   */
  static async getAllTrailers() {
    try {
      const result = await Trailer.fetchAll();
      if (!result.recordset || result.recordset.length === 0) {
        return [];
      }
      return result.recordset.map(trailer => this.transformTrailerToFrontend(trailer));
    } catch (error) {
      console.error('Error in getAllTrailers:', error);
      throw error;
    }
  }

  /**
   * Get all cars by employee - GRUPISANO PO AUTOMOBILIMA
   */
  static async getCarByEmployee() {
    try {
      const carsResult = await EmployeeCar.fetchAll();
      console.log('Cars fetched:', carsResult.recordset);
      
      if (!carsResult.recordset || carsResult.recordset.length === 0) {
        return [];
      }

      // Kreiraj niz automobila
      const cars = [];

      for (const carRow of carsResult.recordset) {
        // Dohvati zaposlene za ovaj automobil
        const employeesResult = await EmployeeCar.fetchEmployeesByCar(carRow.CarID);
        console.log(`Employees for car ${carRow.CarID}:`, employeesResult.recordset);
        
        const employees = employeesResult.recordset || [];

        cars.push({
          type: 'car',
          vehicleType: 'car',
          car: {
            vehicleId: carRow.CarID,
            make: carRow.CarMake,
            model: carRow.CarModel,
            registrationTag: carRow.CarRegistrationTag,
            status: carRow.CarStatus
          },
          drivers: employees.map(emp => ({
            employeeCarId: emp.ID,
            employeeId: emp.EmplID,
            name: emp.FullName,
            firstName: emp.FirstName,
            lastName: emp.LastName
          }))
        });
      }

      console.log('Final cars array:', JSON.stringify(cars, null, 2));
      return cars;
    } catch (error) {
      console.error('Error in getCarByEmployee:', error);
      throw error;
    }
  }

  /**
   * Get all compositions with truck and trailer details - GRUPISANO PO KOMPOZICIJAMA
   */
  static async getAllCompositions() {
    try {
      const result = await Composition.fetchCompositionDetails();
      if (!result.recordset || result.recordset.length === 0) {
        return [];
      }

      // Grupiši po CompositionID
      const compositionMap = new Map();

      result.recordset.forEach(row => {
        const compositionId = row.CompositionID;
        
        if (!compositionMap.has(compositionId)) {
          compositionMap.set(compositionId, {
            compositionId: row.CompositionID,
            type: 'composition',
            vehicleType: 'composition',
            truck: {
              vehicleId: row.TruckID,
              make: row.TruckMake,
              model: row.TruckModel,
              registrationTag: row.TruckRegistrationTag,
              status: row.TruckStatus
            },
            trailer: {
              vehicleId: row.TrailerID,
              make: row.TrailerMake,
              model: row.TrailerModel,
              registrationTag: row.TrailerRegistrationTag,
              status: row.TrailerStatus
            },
            compositionName: `${row.TruckRegistrationTag}/${row.TrailerRegistrationTag}`,
            drivers: []  // Niz vozača
          });
        }

        // Dodaj vozača ako postoji ime
        if (row.Driver) {
          const comp = compositionMap.get(compositionId);
          if (!comp.drivers.some(d => d.name === row.Driver)) {
            comp.drivers.push({
              name: row.Driver,
              driverId: row.DriverID,
              driverCompId: row.DriverCompID
            });
          }
        }
      });

      // Konvertuj Map u niz
      return Array.from(compositionMap.values());
    } catch (error) {
      console.error('Error in getAllCompositions:', error);
      throw error;
    }
  }

  /**
   * Create new truck
   */
  static async createTruck(truckData) {
    const dto = new VehicleDTO({ ...truckData, type: 'truck' });
    const validation = dto.validate();
    
    if (!validation.isValid) {
      throw new Error(`Validation error: ${validation.errors.join(', ')}`);
    }

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      
      const reqBody = {
        TruckMake: dto.make,
        TruckModel: dto.model,
        TruckRegistrationTag: dto.registrationTag
      };
      
      await Truck.insert(reqBody, transaction);
      await transaction.commit();
      
      return { success: true, message: 'Truck created' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Create new trailer
   */
  static async createTrailer(trailerData) {
    const dto = new VehicleDTO({ ...trailerData, type: 'trailer' });
    const validation = dto.validate();
    
    if (!validation.isValid) {
      throw new Error(`Validation error: ${validation.errors.join(', ')}`);
    }

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      
      const reqBody = {
        TrailerMake: dto.make,
        TrailerModel: dto.model,
        TrailerRegistrationTag: dto.registrationTag
      };
      
      await Trailer.insert(reqBody, transaction);
      await transaction.commit();
      
      return { success: true, message: 'Trailer created' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }



  /**
   * Create driver composition assignment
   */
  static async createDriverComposition(driverCompData) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();
      
      const dto = new VehicleDTO({ ...driverCompData, type: 'drivercomposition' });
      const validation = dto.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation error: ${validation.errors.join(', ')}`);
      }

      await DriverComposition.insert(
        dto.driverId,
        dto.compositionId,
        transaction
      );

      await transaction.commit();
      
      return { success: true, message: 'Driver composition assignment created' };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  /**
   * Create full composition with optional new truck/trailer and driver assignment
   * Handles all 3 scenarios:
   * 1. newComposition - create new truck + new trailer + composition + optional driver
   * 2. newTruckExistingTrailer - create new truck + use existing trailer + composition + optional driver
   * 3. newTrailerExistingTruck - use existing truck + create new trailer + composition + optional driver
   */
  static async createFullComposition(compositionData) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      const { compositionMode, driverId } = compositionData;
      let truckId = null;
      let trailerId = null;

      // Scenario 1 & 2: Create new truck if needed
      if (compositionMode === 'newComposition' || compositionMode === 'newTruckExistingTrailer') {
        const truckDto = new VehicleDTO({
          type: 'truck',
          make: compositionData.truckMake,
          model: compositionData.truckModel,
          registrationTag: compositionData.truckRegistrationTag
        });

        const truckValidation = truckDto.validate();
        if (!truckValidation.isValid) {
          throw new Error(`Truck validation error: ${truckValidation.errors.join(', ')}`);
        }

        const reqBody = {
          TruckMake: truckDto.make,
          TruckModel: truckDto.model,
          TruckRegistrationTag: truckDto.registrationTag
        };
        
        truckId = await Truck.insert(reqBody, transaction);
      } else if (compositionMode === 'newTrailerExistingTruck') {
        // Use existing truck
        truckId = parseInt(compositionData.existingTruckId);
        if (!truckId || truckId <= 0) {
          throw new Error('Valid existing truck ID is required');
        }
      }

      // Scenario 1 & 3: Create new trailer if needed
      if (compositionMode === 'newComposition' || compositionMode === 'newTrailerExistingTruck') {
        const trailerDto = new VehicleDTO({
          type: 'trailer',
          make: compositionData.trailerMake,
          model: compositionData.trailerModel,
          registrationTag: compositionData.trailerRegistrationTag
        });

        const trailerValidation = trailerDto.validate();
        if (!trailerValidation.isValid) {
          throw new Error(`Trailer validation error: ${trailerValidation.errors.join(', ')}`);
        }

        const reqBody = {
          TrailerMake: trailerDto.make,
          TrailerModel: trailerDto.model,
          TrailerRegistrationTag: trailerDto.registrationTag
        };
        
        trailerId = await Trailer.insert(reqBody, transaction);
      } else if (compositionMode === 'newTruckExistingTrailer') {
        // Use existing trailer
        trailerId = parseInt(compositionData.existingTrailerId);
        if (!trailerId || trailerId <= 0) {
          throw new Error('Valid existing trailer ID is required');
        }
      }

      // Create composition
      const compositionResult = await Composition.insert(truckId, trailerId, transaction);
      const compositionId = compositionResult.recordset[0].CompositionID;

      // Assign driver if provided
      if (driverId && parseInt(driverId) > 0) {
        await DriverComposition.insert(
          parseInt(driverId),
          compositionId,
          transaction
        );
      }

      await transaction.commit();
      
      return { 
        success: true, 
        message: 'Composition created successfully',
        data: {
          compositionId,
          truckId,
          trailerId
        }
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  /**
   * Create full car with optional driver assignment
   */
  static async createFullCar(carData) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      console.log('createFullCar received data:', carData);

      const { driverId } = carData;

      // Create car
      const carDto = new VehicleDTO({ ...carData, type: 'car' });
      console.log('CarDTO created:', { type: carDto.type, make: carDto.make, model: carDto.model });
      
      const carValidation = carDto.validate();
      
      if (!carValidation.isValid) {
        throw new Error(`Car validation error: ${carValidation.errors.join(', ')}`);
      }

      const carResult = await Car.insert(
        null,
        carDto.make,
        carDto.model,
        carDto.registrationTag,
        transaction
      );

      const carId = carResult.recordset[0].CarID;

      // Assign driver if provided
      if (driverId && parseInt(driverId) > 0) {
        await EmployeeCar.insert(
          parseInt(driverId),
          carId,
          transaction
        );
      }

      await transaction.commit();
      
      return { 
        success: true, 
        message: 'Car created successfully',
        data: {
          carId
        }
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  /**
   * Create employee car assignment
   */
  static async createEmployeeCar(employeeCarData) {
    const dto = new VehicleDTO({ ...employeeCarData, type: 'employeecar' });
    const validation = dto.validate();
    
    if (!validation.isValid) {
      throw new Error(`Validation error: ${validation.errors.join(', ')}`);
    }

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();
      
      await EmployeeCar.insert(dto.employeeId, dto.carId, transaction);
      await transaction.commit();
      
      return { success: true, message: 'Employee car assignment created' };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  /**
   * Update truck
   */
  static async updateTruck(truckId, truckData) {
    const dto = new VehicleDTO({ ...truckData, type: 'truck' });
    const validation = dto.validate();
    
    if (!validation.isValid) {
      throw new Error(`Validation error: ${validation.errors.join(', ')}`);
    }

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      await Truck.update(truckId, dto.make, dto.model, dto.registrationTag, transaction);
      await transaction.commit();
      return { success: true, message: 'Truck updated' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Update trailer
   */
  static async updateTrailer(trailerId, trailerData) {
    const dto = new VehicleDTO({ ...trailerData, type: 'trailer' });
    const validation = dto.validate();
    
    if (!validation.isValid) {
      throw new Error(`Validation error: ${validation.errors.join(', ')}`);
    }

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      await Trailer.update(trailerId, dto.make, dto.model, dto.registrationTag, transaction);
      await transaction.commit();
      return { success: true, message: 'Trailer updated' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Update car
   */
  static async updateCar(carId, carData) {
    const dto = new VehicleDTO({ ...carData, type: 'car' });
    const validation = dto.validate();
    
    if (!validation.isValid) {
      throw new Error(`Validation error: ${validation.errors.join(', ')}`);
    }

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      await Car.update(carId, dto.make, dto.model, dto.registrationTag, transaction);
      await transaction.commit();
      return { success: true, message: 'Car updated' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Update composition truck
   */
  static async updateCompositionTruck(compositionId, newTruckId) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      await Composition.updateTruck(compositionId, newTruckId, transaction);
      await transaction.commit();
      return { success: true, message: 'Composition truck updated' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Update composition trailer
   */
  static async updateCompositionTrailer(compositionId, newTrailerId) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      await Composition.updateTrailer(compositionId, newTrailerId, transaction);
      await transaction.commit();
      return { success: true, message: 'Composition trailer updated' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Remove driver from composition
   */
  static async removeDriverFromComposition(driverCompId) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      await DriverComposition.delete(driverCompId, transaction);
      await transaction.commit();
      return { success: true, message: 'Driver removed from composition' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Update driver in composition (change driver)
   */
  static async updateCompositionDriver(driverCompId, newDriverId) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      await DriverComposition.update(newDriverId, driverCompId, transaction);
      await transaction.commit();
      return { success: true, message: 'Driver updated successfully' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Assign driver to composition (if no driver exists)
   */
  static async assignDriverToComposition(compositionId, driverId) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      await DriverComposition.insert(driverId, compositionId, transaction);
      await transaction.commit();
      return { success: true, message: 'Driver assigned successfully' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Delete truck (soft delete - set to Inactive)
   */
  static async deleteTruck(truckId) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      await Truck.delete(truckId, transaction);
      await transaction.commit();
      return { success: true, message: 'Truck deleted' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Delete trailer (soft delete - set to Inactive)
   */
  static async deleteTrailer(trailerId) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      await Trailer.delete(trailerId, transaction);
      await transaction.commit();
      return { success: true, message: 'Trailer deleted' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Delete car (soft delete - set to Inactive)
   */
  static async deleteCar(carId) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      await Car.delete(carId, transaction);
      await transaction.commit();
      return { success: true, message: 'Car deleted' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Delete composition
   */
  static async deleteComposition(compositionId) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      await Composition.delete(compositionId, transaction);
      await transaction.commit();
      return { success: true, message: 'Composition deleted' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Delete driver composition
   */
  static async deleteDriverComposition(driverCompId) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      await DriverComposition.delete(driverCompId, transaction);
      await transaction.commit();
      return { success: true, message: 'Driver composition deleted' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Remove driver from composition (soft delete)
   */
  static async removeDriverFromComposition(driverCompId) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      await DriverComposition.delete(driverCompId, transaction);
      await transaction.commit();
      return { success: true, message: 'Driver composition deleted' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Assign employee to car
   */
  static async assignEmployeeToCar(carId, employeeId) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      const result = await EmployeeCar.insert(employeeId, carId, transaction);
      await transaction.commit();
      return { success: true, data: result };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Remove employee from car (soft delete)
   */
  static async removeEmployeeFromCar(employeeCarId) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      await EmployeeCar.delete(employeeCarId, transaction);
      await transaction.commit();
      return { success: true, message: 'Employee removed from car' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }


}

module.exports = VehicleService;
