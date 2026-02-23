import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography'; // CUSTOM COMPONENTS

import FlexBetween from '@/components/flexbox/FlexBetween'; // CUSTOM UTILS METHOD

import { parseEuropeanNumber } from '@/utils/numberFormat';

export default function InvoiceSummary() {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const items = useWatch({ control, name: 'items' }) || [];

  // Funkcija za mapiranje VAT koda u procenat
  const getVATPercentage = (vatCode) => {
    switch (vatCode) {
      case 'S20': return 0.20;  // Standardna stopa 20%
      case 'S10': return 0.10;  // Standardna stopa 10%
      case 'O': return 0.00;    // Oslobođeno
      case 'E': return 0.00;    // Izvoz
      case 'AE10': return 0.10; // Agrotehnika 10%
      case 'OE': return 0.00;   // Ostalo oslobođeno
      case 'SS': return 0.00;   // Posebna stopa
      case 'R': return 0.00;    // Rezervisano
      case 'N': return 0.00;    // Neoporezivo
      case 'Z': return 0.00;    // Nulta stopa
      default: return 0.00;
    }
  };

    // Logika za obračun PDV-a i ukupnih iznosa
    const calculations = items.reduce((acc, item) => {
    const price = parseEuropeanNumber(item.price);
    const quantity = parseEuropeanNumber(item.quantity);
    const discount = parseEuropeanNumber(item.discount) / 100; // Convert percentage to decimal
    const vatPercentage = getVATPercentage(item.vat);
    
    // TaxBase - osnovica
    acc.taxBase += price*quantity;
    
    // VAT Amount - iznos PDV-a
    acc.vatAmount += acc.taxBase * vatPercentage;
    
    // Total Amount - ukupan iznos sa PDV-om
    acc.totalAmount += acc.taxBase * (1 + vatPercentage);
    
    return acc;
  }, {
    taxBase: 0,
    discountAmount: 0,
    subtotal: 0,
    vatAmount: 0,
    totalAmount: 0
  });

  // Formatiranje brojeva na 2 decimale bez valute
  const formatAmount = (amount) => parseFloat(amount.toFixed(2)).toLocaleString('sr-RS', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const {
    taxBase,
    discountAmount,
    subtotal,
    vatAmount,
    totalAmount
  } = calculations;
  return <Box maxWidth={320}>
      <Typography variant="body1" fontWeight={500}>
        {t('Summary')}
      </Typography>

  <SummaryItem label={t('Tax Base')} value={formatAmount(taxBase)} />
  
  <SummaryItem label={t('VAT')} value={formatAmount(vatAmount)} />
    
      <Divider sx={{
        my: 2
      }} />
  <SummaryItem label={t('Total')} value={formatAmount(totalAmount)} />
    </Box>;
}

function SummaryItem({
  label,
  value
}) {
  return <FlexBetween my={1}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography variant="body2" fontWeight={500}>
        {value}
      </Typography>
    </FlexBetween>;
}