import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';

import { TextField } from '@/components/form';
import Delete from '@/icons/Delete';
import Add from '@/icons/Add';
import Trash from '@/icons/duotone/Trash';
import { formatNumber, numberInputProps, parseEuropeanNumber } from '@/utils/numberFormat';

// =============================================
// CONSTANTS & OPTIONS
// =============================================

export const VAT_OPTIONS = [
  { value: 'S20', label: 'S20' },
  { value: 'S10', label: 'S10' },
  { value: 'O', label: 'O' },
  { value: 'E', label: 'E' },
  { value: 'AE10', label: 'AE10' },
  { value: 'OE', label: 'OE' },
  { value: 'SS', label: 'SS' },
  { value: 'R', label: 'R' },
  { value: 'N', label: 'N' },
  { value: 'Z', label: 'Z' }
];

export const UoM = [
  { value: 'kom', label: 'kom' },
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'km', label: 'km' }
];

// Funkcija za mapiranje VAT koda u procenat
const getVATPercentage = (vatCode) => {
  switch (vatCode) {
    case 'S20': return 0.20;  // Standardna stopa 20%
    case 'S10': return 0.10;  // Standardna stopa 10%
    case 'AE10': return 0.10; // Agrotehnika 10%
    case 'O': 
    case 'E': 
    case 'OE': 
    case 'SS': 
    case 'R': 
    case 'N': 
    case 'Z': 
    default: return 0.00;
  }
};



// =============================================
// MAIN COMPONENT
// =============================================

const ItemRow = memo(function ItemRow({
  index,
  field,
  control,
  onRemove,
  onAdd
}) {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  
  // Watch za polja koja utiču na izračun Amount-a
  const watchedFields = useWatch({
    control,
    name: [`items.${index}.quantity`, `items.${index}.price`, `items.${index}.discount`, `items.${index}.vat`]
  });

  const [quantity, price, discount, vat] = watchedFields;

  // Automatsko izračunavanje Amount polja
  useEffect(() => {
    const quantityNum = parseEuropeanNumber(quantity || '0');
    const priceNum = parseEuropeanNumber(price || '0');
    const discountNum = parseEuropeanNumber(discount || '0') / 100;
    const vatPercentage = getVATPercentage(vat);

    if (quantityNum && priceNum) {
      // Izračun: (quantity * price) * (1 - discount) * (1 + vat)
      const baseAmount = quantityNum * priceNum;
      const afterDiscount = baseAmount * (1 - discountNum);
      const finalAmount = afterDiscount * (1 + vatPercentage);
      
      // Formatiranje u evropski format
      const formattedAmount = finalAmount.toLocaleString('sr-RS', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      setValue(`items.${index}.amount`, formattedAmount);
    }
  }, [quantity, price, discount, vat, index, setValue]);
  
  return (
    <Grid container size={12} spacing={1}>
      
      {/* ========================================= */}
      {/* TAX ITEM LAYOUT */}
      {/* ========================================= */}
      {field.hasOwnProperty('taxName') && (
        <>
          <Grid size={{ md: 5.5, sm: 3, xs: 12 }}>
            <TextField 
              fullWidth 
              size="small" 
              label={t('Tax Name')} 
              name={`items.${index}.taxName`} 
            />
          </Grid>
        </>
      )}
      
      {/* ========================================= */}
      {/* TRANSPORT ITEM LAYOUT */}
      {/* ========================================= */}
      {!field.hasOwnProperty('taxName') && (
        <>
          <Grid size={{ md: 3.3, sm: 4, xs: 12 }}>
            <TextField 
              fullWidth 
              size="small" 
              label={t('Route')} 
              name={`items.${index}.route`} 
            />
          </Grid>

          <Grid size={{ md: 2.2, sm: 4, xs: 12 }}>
            <TextField 
              fullWidth 
              size="small" 
              label={t('Reg. Tag')} 
              name={`items.${index}.regTag`} 
            />
          </Grid>
        </>
      )}

      {/* ========================================= */}
      {/* COMMON FIELDS FOR BOTH ITEM TYPES */}
      {/* ========================================= */}
      
      {/* UoM field */}
      <Grid size={{ md: 1.1, sm: 3, xs: 5 }}>
            <TextField 
              fullWidth 
              size="small" 
              select
              label={t('UoM')} 
              name={`items.${index}.uom`}
              defaultValue="kom"
              SelectProps={{
                MenuProps: {
                  getContentAnchorEl: null,
                }
              }}
            >
              {UoM.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

      {/* Quantity Field */}
      <Grid size={{ md: 1.1, sm: 4, xs: 12 }}>
        <TextField 
          fullWidth 
          size="small" 
          label={t('Quantity')} 
          name={`items.${index}.quantity`}
          defaultValue="1"
        />
      </Grid>

      {/* Price Field */}
      <Grid size={{ md: 1.4, sm: 3, xs: 5 }}>
        <TextField 
          fullWidth 
          size="small" 
          type="text" 
          label={t('Price')} 
          name={`items.${index}.price`}
          placeholder="0,00"
          onInput={(e) => {
            const formatted = formatNumber(e.target.value);
            if (formatted !== e.target.value) {
              e.target.value = formatted;
            }
          }}
          inputProps={numberInputProps}
        />
      </Grid>

      {/* VAT Field */}
      <Grid size={{ md: 1.1, sm: 3, xs: 5 }}>
        <TextField 
          fullWidth 
          size="small" 
          select
          label={t('VAT')} 
          name={`items.${index}.vat`}
          defaultValue=""
          SelectProps={{
            MenuProps: {
              getContentAnchorEl: null,
            }
          }}
        >
          {VAT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>



      
      {/* ========================================= */}
      {/* ACTION BUTTONS */}
      {/* ========================================= */}
      <Grid size="auto" sx={{ 
        display: 'flex', 
        gap: 0.5, 
        alignItems: 'flex-end', 
        pb: 0.5 
      }}>
        {/* Plus button - always visible */}
        <IconButton onClick={onAdd} color="primary" size="small">
          <Add />
        </IconButton>
        
        {/* Delete button - only visible for rows after the first one */}
        {index > 0 && (
          <IconButton onClick={onRemove} color="error" size="small">
          <Trash fontSize="small" />
          </IconButton>
        )}
      </Grid>

    </Grid>
  );
});

export default ItemRow;