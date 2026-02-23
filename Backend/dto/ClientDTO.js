// dto/ClientDTO.js
const DOMPurify = require('isomorphic-dompurify');

class ClientDTO {
  constructor(data) {
    // Sanitize and validate
    this.TaxID = this.sanitize(data.TaxID || data.taxId);
    this.RegNmbr = this.sanitize(data.RegNmbr || data.regNmbr) || null;
    this.ClientName = this.sanitize(data.ClientName || data.clientName);
    this.StreetAndNmbr = this.sanitize(data.StreetAndNmbr || data.streetAndNumber);
    this.City = this.sanitize(data.City || data.city);
    this.ZIP = this.sanitize(data.ZIP || data.zipCode);
    this.Country = this.sanitize(data.Country || data.country);
    this.Email = this.sanitize(data.Email || data.email) || null;
    
    // ClientType mapping: Frontend šalje "Transportation" ili "Supplier"
    // Baza prima varchar(10), pa mapiramo na kratke vrednosti
    const typeMap = {
      'transportation': 'TRANS',
      'supplier': 'SUPPLIER',
      'trans': 'TRANS'
    };
    const rawType = (data.ClientType || data.clientType || '').toLowerCase();
    this.ClientType = typeMap[rawType] || null;
    
    // Contacts array
    this.contacts = (data.contacts || []).map(c => new ContactDTO(c, this.TaxID));
  }

  sanitize(value) {
    if (!value || typeof value !== 'string') return value;
    return DOMPurify.sanitize(value.trim());
  }

  // Validacija prema bazi podataka
  validate() {
    const errors = [];

    // Required fields (NOT NULL u bazi)
    if (!this.TaxID || this.TaxID.length === 0) {
      errors.push('TaxID is required');
    }
    if (this.TaxID && this.TaxID.length > 50) {
      errors.push('TaxID must be max 50 characters');
    }

    if (!this.ClientName || this.ClientName.length === 0) {
      errors.push('ClientName is required');
    }
    if (this.ClientName && this.ClientName.length > 100) {
      errors.push('ClientName must be max 100 characters');
    }

    if (!this.StreetAndNmbr || this.StreetAndNmbr.length === 0) {
      errors.push('StreetAndNmbr is required');
    }
    if (this.StreetAndNmbr && this.StreetAndNmbr.length > 100) {
      errors.push('StreetAndNmbr must be max 100 characters');
    }

    if (!this.City || this.City.length === 0) {
      errors.push('City is required');
    }
    if (this.City && this.City.length > 50) {
      errors.push('City must be max 50 characters');
    }

    if (!this.ZIP || this.ZIP.length === 0) {
      errors.push('ZIP is required');
    }
    if (this.ZIP && this.ZIP.length > 10) {
      errors.push('ZIP must be max 10 characters');
    }

    if (!this.Country || this.Country.length === 0) {
      errors.push('Country is required');
    }
    if (this.Country && this.Country.length > 50) {
      errors.push('Country must be max 50 characters');
    }

    // Optional fields sa max length provera
    if (this.RegNmbr && this.RegNmbr.length > 30) {
      errors.push('RegNmbr must be max 30 characters');
    }

    if (this.Email && this.Email.length > 100) {
      errors.push('Email must be max 100 characters');
    }

    // Email format validation (ako postoji)
    if (this.Email && !this.isValidEmail(this.Email)) {
      errors.push('Invalid email format');
    }

    // ClientType max length (varchar 10)
    if (this.ClientType && this.ClientType.length > 10) {
      errors.push('ClientType must be max 10 characters');
    }

    // Validate contacts
    this.contacts.forEach((contact, index) => {
      const contactErrors = contact.validate();
      if (contactErrors.length > 0) {
        errors.push(`Contact ${index + 1}: ${contactErrors.join(', ')}`);
      }
    });

    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Convert to frontend format (camelCase)
  toJSON() {
    return {
      taxId: this.TaxID,
      regNmbr: this.RegNmbr,
      clientName: this.ClientName,
      streetAndNumber: this.StreetAndNmbr,
      city: this.City,
      zipCode: this.ZIP,
      country: this.Country,
      email: this.Email,
      clientType: this.mapClientTypeToFrontend(this.ClientType),
      contacts: this.contacts.map(c => c.toJSON())
    };
  }

  mapClientTypeToFrontend(dbType) {
    const typeMap = {
      'TRANS': 'Transportation',
      'SUPPLIER': 'Supplier'
    };
    return typeMap[dbType] || 'Transportation';
  }
}

class ContactDTO {
  constructor(data, taxId) {
    this.ContactPersonID = data.ContactPersonID || data.contactPersonID || null;
    this.TaxID = taxId;
    this.ContactName = this.sanitize(data.ContactName || data.name || data.contactName);
    this.Description = this.sanitize(data.Description || data.description) || null;
    this.PhoneNmbr = this.sanitize(data.PhoneNmbr || data.phoneNumber) || null;
    this.PersonEmail = this.sanitize(data.PersonEmail || data.email) || null;
  }

  sanitize(value) {
    if (!value || typeof value !== 'string') return value;
    return DOMPurify.sanitize(value.trim());
  }

  validate() {
    const errors = [];

    // ContactName is required (NOT NULL)
    if (!this.ContactName || this.ContactName.length === 0) {
      errors.push('ContactName is required');
    }
    if (this.ContactName && this.ContactName.length > 100) {
      errors.push('ContactName must be max 100 characters');
    }

    // Optional fields max length
    if (this.Description && this.Description.length > 200) {
      errors.push('Description must be max 200 characters');
    }

    if (this.PhoneNmbr && this.PhoneNmbr.length > 50) {
      errors.push('PhoneNmbr must be max 50 characters');
    }

    if (this.PersonEmail && this.PersonEmail.length > 100) {
      errors.push('PersonEmail must be max 100 characters');
    }

    // Email format validation
    if (this.PersonEmail && !this.isValidEmail(this.PersonEmail)) {
      errors.push('Invalid PersonEmail format');
    }

    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toJSON() {
    return {
      contactPersonID: this.ContactPersonID,
      name: this.ContactName,
      description: this.Description,
      phoneNumber: this.PhoneNmbr,
      email: this.PersonEmail
    };
  }
}

module.exports = { ClientDTO, ContactDTO };