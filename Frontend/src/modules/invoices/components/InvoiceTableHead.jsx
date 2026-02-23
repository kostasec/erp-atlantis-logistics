import { useCallback, useMemo } from 'react'; // MUI

import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import visuallyHidden from '@mui/utils/visuallyHidden';
import { styled } from '@mui/material/styles'; // STYLED COMPONENTS
import FlexBox from '@/components/flexbox/FlexBox';
import { useTranslation } from 'react-i18next';

const StyledTableHead = styled(TableHead)(({
  theme
}) => ({
  backgroundColor: theme.palette.grey[200],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[600]
  })
}));
const HeaderCell = styled(TableCell)(({
  theme
}) => ({
  fontWeight: 600,
  color: theme.palette.text.primary
}));
 // ==============================================================
// center header content
HeaderCell.defaultProps = {
  align: 'center'
};


// ==============================================================
// TABLE HEAD COLUMN DATA
export default function InvoiceTableHead({
  order,
  orderBy,
  rowCount,
  numSelected,
  onRequestSort,
  onSelectAllRows,
  partyLabel = 'Sender',
  partyKey = 'Sender' // Default to incoming for backward compatibility
}) {
  const { t } = useTranslation();
  const createSortHandler = useCallback(property => event => {
    onRequestSort(event, property);
  }, [onRequestSort]);
  const headCells = useMemo(() => [
    { id: 'documentStatus', numeric: true, disablePadding: false, label: t('Status') },
    { id: 'processingStatus', numeric: true, disablePadding: false, label: t('Proc. Status') },
    { id: partyKey, numeric: true, disablePadding: false, label: t(partyLabel) },
    { id: 'sentDate', numeric: true, disablePadding: false, label: t('Sent to SEF') },
    { id: 'deliveredDate', numeric: true, disablePadding: false, label: t('Delivered to SEF') },
    { id: 'invoiceNumber', numeric: true, disablePadding: false, label: t('Invoice Number') },
    { id: 'paymentStatus', numeric: true, disablePadding: false, label: t('Payment Status') },
    { id: '', numeric: true, disablePadding: false }
  ], [partyKey, partyLabel, t]);
  return <StyledTableHead>
      <TableRow>
        {headCells.map(headCell => 
        <HeaderCell key={headCell.id} align="center" padding={headCell.disablePadding ? 'none' : 'normal'} sortDirection={orderBy === headCell.id ? order : false}>
            <FlexBox justifyContent="center" alignItems="center">
              <TableSortLabel sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', transform: 'translateX(12px)' }} active={orderBy === headCell.id} onClick={createSortHandler(headCell.id)} direction={orderBy === headCell.id ? order : 'asc'}>
                <Typography variant="body2" sx={{ lineHeight: 1, textAlign: 'center' }}>
                  {headCell.label}
                </Typography>
                {orderBy === headCell.id && <span style={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>}
                 {/*Obavezno sortirati po datumu opadajuce kad dodje backend */}
              </TableSortLabel>
            </FlexBox>
          </HeaderCell>)}
      </TableRow>
    </StyledTableHead>;
}