import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles'; //  STYLED COMPONENTS
import { useTranslation } from 'react-i18next';

const Wrapper = styled('div')(({
  theme
}) => ({
  gap: '1rem',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  paddingInline: '1rem',
  paddingBottom: '1.5rem',
  '& > *': {
    flex: '1 1 calc(25% - 0.75rem)', // 4 polja u prvom redu
    minWidth: '200px'
  },
  '& > *:nth-child(n+5)': {
    flex: '1 1 calc(33.333% - 0.67rem)' // 3 polja u drugom redu
  },
  [theme.breakpoints.down(768)]: {
    '& > *': {
      flex: '1 1 100%' // Na manjim ekranima jedno polje po redu
    }
  }
})); // ==============================================================

// ==============================================================
const INVOICE_STATUS = [{
  id: 1,
  labelKey: 'All',
  value: ''
}, {
  id: 2,
  labelKey: 'Pending',
  value: 'pending'
}, {
  id: 3,
  labelKey: 'Complete',
  value: 'complete'
}];
export default function InvoiceTableActions({
  handleChangeFilter,
  filter
}) {
  const { t } = useTranslation();
  return <Wrapper>
      <TextField select fullWidth label={t('Status')} className="select" value={filter.status} onChange={e => handleChangeFilter('status', e.target.value)}>
        {INVOICE_STATUS.map(({
        id,
        labelKey,
        value
      }) => <MenuItem key={id} value={value}>
            {t(labelKey)}
          </MenuItem>)}
      </TextField>

      <TextField select fullWidth label={t('Proc. status')} className="select" value={filter.status} onChange={e => handleChangeFilter('status', e.target.value)}>
        {INVOICE_STATUS.map(({
        id,
        labelKey,
        value
      }) => <MenuItem key={id} value={value}>
            {t(labelKey)}
          </MenuItem>)}
      </TextField>

      <TextField select fullWidth label={t('Payment. status')} className="select" value={filter.status} onChange={e => handleChangeFilter('status', e.target.value)}>
        {INVOICE_STATUS.map(({
        id,
        labelKey,
        value
      }) => <MenuItem key={id} value={value}>
            {t(labelKey)}
          </MenuItem>)}
      </TextField>

      <TextField fullWidth value={filter.search} label={t('Search invoice by invoice number')} onChange={e => handleChangeFilter('search', e.target.value)} />
            <TextField fullWidth className="search" value={filter.search} label={t('Search invoice by client name')} onChange={e => handleChangeFilter('search', e.target.value)} />
        <TextField fullWidth value={filter.search} label={t('Search invoice by client tax id')} onChange={e => handleChangeFilter('search', e.target.value)} />
          <TextField fullWidth value={filter.search} label={t('Search invoice by client reg. number')} onChange={e => handleChangeFilter('search', e.target.value)} />
    </Wrapper>;
}