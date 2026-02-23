import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

export default function VatLiabilityRecognition() {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext();

  const vatLiability = watch('vatLiability') || 'datumPrometa';
  const items = watch('items') || [];

  // Kreiraj string od svih VAT vrednosti da bi useEffect reagovao na promene
  const itemsVatString = items.map(item => item?.vat || '').join(',');

  useEffect(() => {
    // Proveri da li bilo koji item ima VAT vrednost S20 ili S10
    const hasStandardVAT = items.some(item => {
      const vat = item?.vat;
      return vat === 'S20' || vat === 'S10';
    });

    // Automatski postavi vrednost na osnovu VAT-a
    if (hasStandardVAT) {
      setValue('vatLiability', 'datumPrometa', { shouldDirty: true });
    } else if (items.length > 0) {
      // Postavi samo ako ima itema (ne pri inicijalnom učitavanju prazne forme)
      setValue('vatLiability', 'nema', { shouldDirty: true });
    }
  }, [itemsVatString, items, setValue]);

  const handleChange = (event) => {
    setValue('vatLiability', event.target.value);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1" fontWeight={500}>
        {t('VAT Liability Recognition')}
      </Typography>

      <RadioGroup value={vatLiability} onChange={handleChange}>
        <FormControlLabel
          value="datumPrometa"
          control={<Radio />}
          label={t('Datum Prometa')}
        />
        <FormControlLabel
          value="clan16"
          control={<Radio />}
          label={t('Član 16. Tačka 2a) ZPDV')}
        />
        <FormControlLabel
          value="clan36"
          control={<Radio />}
          label={t('Član 36a ZPDV')}
        />
        <FormControlLabel
          value="nema"
          control={<Radio />}
          label={t('Ne nastaje obaveza PDV-a')}
        />
      </RadioGroup>
    </Stack>
  );
}
