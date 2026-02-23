// dto/VehicleDTO.js
const DOMPurify = require('isomorphic-dompurify');

class VehicleDTO {
  constructor(data) {
    if (!data) {
      throw new Error('VehicleDTO: data is required');
    }
    
    this.type = this.sanitize(data.type || data.vehicleType || ''); // 'truck', 'trailer', 'car', 'composition'
    
    if (!this.type) {
      console.error('VehicleDTO: type is missing from data:', data);
      throw new Error('VehicleDTO: type or vehicleType is required');
    }
    
    // Common fields for Truck, Trailer, Car
    if (['truck', 'trailer', 'car'].includes(this.type.toLowerCase())) {
      this.id = data.id || data.TruckID || data.TrailerID || data.CarID || null;
      this.make = this.sanitize(data.make || data.Make);
      this.model = this.sanitize(data.model || data.Model);
      this.registrationTag = this.sanitize(data.registrationTag || data.RegistrationTag);
      this.status = data.status || data.Status || 'Active';
    }
    
    // Composition fields
    if (this.type.toLowerCase() === 'composition') {
      this.compositionId = data.compositionId || data.CompositionID || null;
      this.truckId = parseInt(data.truckId || data.TruckID) || null;
      this.trailerId = parseInt(data.trailerId || data.TrailerID) || null;
      this.truck = data.truck || null;
      this.trailer = data.trailer || null;
    }

    // DriverComposition fields
    if (this.type.toLowerCase() === 'drivercomposition') {
      this.driverCompId = data.driverCompId || data.DriverCompID || null;
      this.driverId = parseInt(data.driverId || data.DriverID) || null;
      this.compositionId = data.compositionId || data.CompositionID || null;
      this.driverName = this.sanitize(data.driverName || data.DriverName || '');
      this.composition = data.composition || null;
    }

    // EmployeeCar fields
    if (this.type.toLowerCase() === 'employeecar') {
      this.employeeCarId = data.employeeCarId || data.ID || null;
      this.employeeId = parseInt(data.employeeId || data.EmplID) || null;
      this.carId = parseInt(data.carId || data.CarID) || null;
      this.carMake = this.sanitize(data.carMake || data.CarMake || '');
      this.carModel = this.sanitize(data.carModel || data.CarModel || '');
      this.carRegistrationTag = this.sanitize(data.carRegistrationTag || data.CarRegistrationTag || '');
      this.carStatus = data.carStatus || data.CarStatus || 'Active';
    }
  }

  sanitize(value) {
    if (!value || typeof value !== 'string') return value;
    return DOMPurify.sanitize(value.trim());
  }

  validate() {
    const errors = [];

    if (!this.type || !['truck', 'trailer', 'car', 'composition', 'drivercomposition', 'employeecar'].includes(this.type.toLowerCase())) {
      errors.push('Valid vehicle type is required (truck, trailer, car, composition, drivercomposition, employeecar)');
    }

    if (['truck', 'trailer', 'car'].includes(this.type.toLowerCase())) {
      if (!this.make || this.make.length === 0) {
        errors.push('Make is required');
      }
      if (this.make && this.make.length > 50) {
        errors.push('Make must be max 50 characters');
      }

      if (!this.model || this.model.length === 0) {
        errors.push('Model is required');
      }
      if (this.model && this.model.length > 50) {
        errors.push('Model must be max 50 characters');
      }

      if (!this.registrationTag || this.registrationTag.length === 0) {
        errors.push('Registration Tag is required');
      }
      if (this.registrationTag && this.registrationTag.length > 20) {
        errors.push('Registration Tag must be max 20 characters');
      }

      if (!this.status || !['Active', 'Inactive'].includes(this.status)) {
        errors.push('Status must be Active or Inactive');
      }
    }

    if (this.type.toLowerCase() === 'composition') {
      if (!this.truckId || this.truckId <= 0) {
        errors.push('Valid Truck ID is required');
      }
      if (!this.trailerId || this.trailerId <= 0) {
        errors.push('Valid Trailer ID is required');
      }
    }

    if (this.type.toLowerCase() === 'drivercomposition') {
      if (!this.driverId || this.driverId <= 0) {
        errors.push('Valid Driver ID is required');
      }
      if (!this.compositionId || this.compositionId <= 0) {
        errors.push('Valid Composition ID is required');
      }
    }

    if (this.type.toLowerCase() === 'employeecar') {
      if (!this.employeeId || this.employeeId <= 0) {
        errors.push('Valid Employee ID is required');
      }
      if (!this.carId || this.carId <= 0) {
        errors.push('Valid Car ID is required');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = VehicleDTO;
