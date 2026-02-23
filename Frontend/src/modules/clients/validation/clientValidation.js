// validation/clientValidation.js
import * as yup from 'yup';

/**
 * Validation schema za Client formu
 * Usklađeno sa bazom podataka:
 * - Obavezna polja: TaxID, ClientName, StreetAndNmbr, City, ZIP, Country
 * - Opciona polja: RegNmbr, Email, ClientType
 */
export const clientValidationSchema = yup.object({
  // Required fields (NOT NULL u bazi)
  taxId: yup
    .string()
    .required('Tax ID is required')
    .max(50, 'Tax ID must be max 50 characters')
    .trim(),

  clientName: yup
    .string()
    .required('Client name is required')
    .max(100, 'Client name must be max 100 characters')
    .trim(),

  streetAndNumber: yup
    .string()
    .required('Street and number is required')
    .max(100, 'Address must be max 100 characters')
    .trim(),

  city: yup
    .string()
    .required('City is required')
    .max(50, 'City must be max 50 characters')
    .trim(),

  zipCode: yup
    .string()
    .required('ZIP code is required')
    .max(10, 'ZIP code must be max 10 characters')
    .trim(),

  country: yup
    .string()
    .required('Country is required')
    .max(50, 'Country must be max 50 characters')
    .trim(),

  // Optional fields (NULLABLE u bazi)
  regNmbr: yup
    .string()
    .max(30, 'Registration number must be max 30 characters')
    .nullable()
    .transform((value) => value || null)
    .trim(),

  email: yup
    .string()
    .email('Invalid email format')
    .max(100, 'Email must be max 100 characters')
    .nullable()
    .transform((value) => value || null)
    .trim(),

  clientType: yup
    .string()
    .oneOf(['Transportation', 'Supplier'], 'Invalid client type')
    .nullable()
    .transform((value) => value || null),

  // Contact person fields (opciono)
  contactPersonName: yup
    .string()
    .max(100, 'Name must be max 100 characters')
    .nullable()
    .transform((value) => value || null)
    .trim(),

  contactPersonDescription: yup
    .string()
    .max(200, 'Description must be max 200 characters')
    .nullable()
    .transform((value) => value || null)
    .trim(),

  contactPersonPhone: yup
    .string()
    .max(50, 'Phone number must be max 50 characters')
    .nullable()
    .transform((value) => value || null)
    .trim(),

  contactPersonEmail: yup
    .string()
    .email('Invalid email format')
    .max(100, 'Email must be max 100 characters')
    .nullable()
    .transform((value) => value || null)
    .trim()
});

export default clientValidationSchema;