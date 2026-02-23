// dto/EmployeeDTO.js
const DOMPurify = require('isomorphic-dompurify');

class EmployeeDTO {
  constructor(data) {
    // Auto-increment, ignore if provided
    this.EmplID = data.EmplID || data.id || null;
    
    // Required fields
    this.EmplType = this.sanitize(data.EmplType || data.employeeType) || 'Driver';
    this.FirstName = this.sanitize(data.FirstName || data.firstName);
    this.LastName = this.sanitize(data.LastName || data.lastName);
    this.Status = data.Status || 'Active'; // Default from DB
    this.StreetAndNmbr = this.sanitize(data.StreetAndNmbr || data.streetAndNumber);
    this.City = this.sanitize(data.City || data.city);
    this.ZIPCode = this.sanitize(data.ZIPCode || data.zipCode);
    this.Country = this.sanitize(data.Country || data.country);
    this.PhoneNmbr = this.sanitize(data.PhoneNmbr || data.phoneNumber);
    this.IDCardNmbr = this.sanitize(data.IDCardNmbr || data.idCardNumber);
    this.PassportNmbr = this.sanitize(data.PassportNmbr || data.passportNumber);
    
    // Optional fields
    this.EmailAddress = this.sanitize(data.EmailAddress || data.emailAddress) || null;
    
    // Manager ID (self-referencing FK, nullable)
    this.MgrID = data.MgrID || data.managerId || data.mgrId || null;
    if (this.MgrID && typeof this.MgrID === 'string' && this.MgrID.trim() === '') {
      this.MgrID = null;
    }
    if (this.MgrID) {
      this.MgrID = parseInt(this.MgrID, 10);
    }
  }

  sanitize(value) {
    if (!value || typeof value !== 'string') return value;
    return DOMPurify.sanitize(value.trim());
  }

  // Validacija prema strukturi baze
  validate() {
    const errors = [];

    // EmplType - varchar(50), NOT NULL
    if (!this.EmplType || this.EmplType.length === 0) {
      errors.push('EmplType is required');
    }
    if (this.EmplType && this.EmplType.length > 50) {
      errors.push('EmplType must be max 50 characters');
    }

    // FirstName - varchar(50), NOT NULL
    if (!this.FirstName || this.FirstName.length === 0) {
      errors.push('FirstName is required');
    }
    if (this.FirstName && this.FirstName.length > 50) {
      errors.push('FirstName must be max 50 characters');
    }

    // LastName - varchar(50), NOT NULL
    if (!this.LastName || this.LastName.length === 0) {
      errors.push('LastName is required');
    }
    if (this.LastName && this.LastName.length > 50) {
      errors.push('LastName must be max 50 characters');
    }

    // Status - varchar(20), NOT NULL, CHECK ('Active' OR 'Inactive')
    if (!this.Status || this.Status.length === 0) {
      errors.push('Status is required');
    }
    if (!['Active', 'Inactive'].includes(this.Status)) {
      errors.push('Status must be Active or Inactive');
    }

    // StreetAndNmbr - varchar(100), NOT NULL
    if (!this.StreetAndNmbr || this.StreetAndNmbr.length === 0) {
      errors.push('StreetAndNmbr is required');
    }
    if (this.StreetAndNmbr && this.StreetAndNmbr.length > 100) {
      errors.push('StreetAndNmbr must be max 100 characters');
    }

    // City - varchar(50), NOT NULL
    if (!this.City || this.City.length === 0) {
      errors.push('City is required');
    }
    if (this.City && this.City.length > 50) {
      errors.push('City must be max 50 characters');
    }

    // ZIPCode - varchar(10), NOT NULL
    if (!this.ZIPCode || this.ZIPCode.length === 0) {
      errors.push('ZIPCode is required');
    }
    if (this.ZIPCode && this.ZIPCode.length > 10) {
      errors.push('ZIPCode must be max 10 characters');
    }

    // Country - varchar(50), NOT NULL
    if (!this.Country || this.Country.length === 0) {
      errors.push('Country is required');
    }
    if (this.Country && this.Country.length > 50) {
      errors.push('Country must be max 50 characters');
    }

    // PhoneNmbr - varchar(50), NOT NULL
    if (!this.PhoneNmbr || this.PhoneNmbr.length === 0) {
      errors.push('PhoneNmbr is required');
    }
    if (this.PhoneNmbr && this.PhoneNmbr.length > 50) {
      errors.push('PhoneNmbr must be max 50 characters');
    }

    // IDCardNmbr - varchar(20), NOT NULL
    if (!this.IDCardNmbr || this.IDCardNmbr.length === 0) {
      errors.push('IDCardNmbr is required');
    }
    if (this.IDCardNmbr && this.IDCardNmbr.length > 20) {
      errors.push('IDCardNmbr must be max 20 characters');
    }

    // PassportNmbr - varchar(20), NOT NULL
    if (!this.PassportNmbr || this.PassportNmbr.length === 0) {
      errors.push('PassportNmbr is required');
    }
    if (this.PassportNmbr && this.PassportNmbr.length > 20) {
      errors.push('PassportNmbr must be max 20 characters');
    }

    // EmailAddress - varchar(50), NULLABLE
    if (this.EmailAddress) {
      if (this.EmailAddress.length > 50) {
        errors.push('EmailAddress must be max 50 characters');
      }
      if (!this.isValidEmail(this.EmailAddress)) {
        errors.push('Invalid email format');
      }
    }

    // MgrID - int, NULLABLE, FK to Employee.EmplID
    if (this.MgrID !== null && (isNaN(this.MgrID) || this.MgrID < 1)) {
      errors.push('MgrID must be a valid positive integer');
    }

    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Convert to frontend format (camelCase)
  toJSON() {
    return {
      employeeId: this.EmplID,
      employeeType: this.EmplType,
      firstName: this.FirstName,
      lastName: this.LastName,
      fullName: `${this.FirstName} ${this.LastName}`,
      status: this.Status,
      streetAndNumber: this.StreetAndNmbr,
      city: this.City,
      zipCode: this.ZIPCode,
      country: this.Country,
      address: `${this.StreetAndNmbr}, ${this.City} ${this.ZIPCode}, ${this.Country}`,
      phoneNumber: this.PhoneNmbr,
      emailAddress: this.EmailAddress,
      idCardNumber: this.IDCardNmbr,
      passportNumber: this.PassportNmbr,
      managerId: this.MgrID
    };
  }
}

module.exports = EmployeeDTO;