// validation/employeeValidation.js
import * as yup from 'yup';

/**
 * Validation schema za Employee formu
 * Usklađeno sa bazom podataka:
 * - Obavezna polja: EmplType, FirstName, LastName, StreetAndNmbr, City, ZIPCode, 
 *   Country, PhoneNmbr, IDCardNmbr, PassportNmbr
 * - Opciona polja: EmailAddress, MgrID
 */
export const employeeValidationSchema = yup.object({
  // EmplType - varchar(50), NOT NULL
  employeeType: yup
    .string()
    .required('Employee type is required')
    .max(50, 'Employee type must be max 50 characters')
    .trim(),

  // FirstName - varchar(50), NOT NULL
  firstName: yup
    .string()
    .required('First name is required')
    .max(50, 'First name must be max 50 characters')
    .trim(),

  // LastName - varchar(50), NOT NULL
  lastName: yup
    .string()
    .required('Last name is required')
    .max(50, 'Last name must be max 50 characters')
    .trim(),

  // StreetAndNmbr - varchar(100), NOT NULL
  streetAndNumber: yup
    .string()
    .required('Street and number is required')
    .max(100, 'Address must be max 100 characters')
    .trim(),

  // City - varchar(50), NOT NULL
  city: yup
    .string()
    .required('City is required')
    .max(50, 'City must be max 50 characters')
    .trim(),

  // ZIPCode - varchar(10), NOT NULL
  zipCode: yup
    .string()
    .required('ZIP code is required')
    .max(10, 'ZIP code must be max 10 characters')
    .trim(),

  // Country - varchar(50), NOT NULL
  country: yup
    .string()
    .required('Country is required')
    .max(50, 'Country must be max 50 characters')
    .trim(),

  // PhoneNmbr - varchar(50), NOT NULL
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .max(50, 'Phone number must be max 50 characters')
    .trim(),

  // IDCardNmbr - varchar(20), NOT NULL
  idCardNumber: yup
    .string()
    .required('ID card number is required')
    .max(20, 'ID card number must be max 20 characters')
    .trim(),

  // PassportNmbr - varchar(20), NOT NULL
  passportNumber: yup
    .string()
    .required('Passport number is required')
    .max(20, 'Passport number must be max 20 characters')
    .trim(),

  // EmailAddress - varchar(50), NULLABLE
  emailAddress: yup
    .string()
    .email('Invalid email format')
    .max(50, 'Email must be max 50 characters')
    .nullable()
    .transform((value) => value || null)
    .trim(),

  // MgrID - int, NULLABLE
  managerId: yup
    .number()
    .positive('Manager ID must be positive')
    .integer('Manager ID must be an integer')
    .nullable()
    .transform((value, originalValue) => 
      originalValue === '' || originalValue === null ? null : value
    ),

    // vehicle, NULLABLE
    vehicle: yup
    .string()
    .nullable()
    .transform((value) => value || null),

// vehicle: ''
});

export default employeeValidationSchema;