import { useNavigate } from 'react-router';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import { useTranslation } from 'react-i18next';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import FileDownload from '@mui/icons-material/FileDownload';
import Cancel from '@mui/icons-material/Cancel';

import FlexBox from '@/components/flexbox/FlexBox';
import StatusBadge from '@/components/status-badge';

const InvoiceName = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  marginBottom: '0.25rem',
  color: theme.palette.text.primary,
  ':hover': {
    cursor: 'pointer',
    textDecoration: 'underline'
  }
}));

export default function InvoiceTableRow(props) {
  const {
    invoice,
    isSelected,
    handleDeleteInvoice,
    handleSelectRow,
    partyKey = 'Sender',
    invoiceType = 'incoming'
  } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <TableRow hover>
      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center">
          {(() => {
            const status = (invoice.documentStatus || '').toString().toLowerCase();
            let statusType = 'error';

            switch (status) {
              case 'delivered':
                statusType = 'success';
                break;
              case 'sent':
                statusType = 'primary';
                break;
              case 'pending':
                statusType = 'warning';
                break;
              case 'failed':
              case 'rejected':
                statusType = 'error';
                break;
              default:
                statusType = 'error';
            }

            return (
              <StatusBadge type={statusType}>
                {invoice.documentStatus ? t(invoice.documentStatus) : '-'}
              </StatusBadge>
            );
          })()}
        </FlexBox>
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center">
          {(() => {
            const pStatus = (invoice.processingStatus || '').toString().toLowerCase();
            let statusType = 'error';

            switch (pStatus) {
              case 'accepted':
              case 'completed':
              case 'approved':
                statusType = 'success';
                break;
              case 'pending':
              case 'processing':
              case 'in review':
                statusType = 'warning';
                break;
              case 'sent':
              case 'submitted':
                statusType = 'primary';
                break;
              case 'rejected':
              case 'failed':
              case 'cancelled':
                statusType = 'error';
                break;
              default:
                statusType = 'error';
            }

            return (
              <StatusBadge type={statusType}>
                {invoice.processingStatus ? t(invoice.processingStatus) : '-'}
              </StatusBadge>
            );
          })()}
        </FlexBox>
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center">
          <Typography variant="body2">{invoice?.[partyKey] || '-'}</Typography>
        </FlexBox>
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {(() => {
              const d = invoice.sentDate ? new Date(invoice.sentDate) : null;
              return d && isValid(d) ? format(d, 'MMM dd, yyyy') : '-';
            })()}
          </Typography>
        </FlexBox>
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {(() => {
              const d = invoice.deliveredDate ? new Date(invoice.deliveredDate) : null;
              return d && isValid(d) ? format(d, 'MMM dd, yyyy') : '-';
            })()}
          </Typography>
        </FlexBox>
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center">
          <Typography variant="body2">{invoice.invoiceNumber || '-'}</Typography>
        </FlexBox>
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center">
          <Typography variant="body2">
            {invoice.paymentStatus ? t(invoice.paymentStatus) : '-'}
          </Typography>
        </FlexBox>
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center" gap={1}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/dashboard/document-download/${invoiceType}/${invoice.id}`)}
            title={t('Download invoice')}
          >
            <FileDownload fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            color="error"
            onClick={() => {
              console.log('Cancel invoice:', invoice.id);
            }}
            title={t('Cancel invoice')}
          >
            <Cancel fontSize="small" />
          </IconButton>
        </FlexBox>
      </TableCell>
    </TableRow>
  );
}