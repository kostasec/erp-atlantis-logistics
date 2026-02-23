import { useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

// MUI Components
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TablePagination from '@mui/material/TablePagination';

// MUI Icons
import Tune from '@mui/icons-material/Tune';
import Schedule from '@mui/icons-material/Schedule';

// Custom Components
import Scrollbar from '@/components/scrollbar';
import { FlexBetween, FlexBox } from '@/components/flexbox';
import { BodyTableCell, HeadTableCell } from '@/shared/components/common';
import PaymentCell from './PaymentCell';
import { currency } from '@/utils/currency';

export default function TransactionTableOutgoingInv({ 
  transactions = [], 
  title = 'Outgoing Invoices for Payment',
  subtitle = null 
}) {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const getColor = useCallback(index => {
    return index % 2 === 1 ? 'action.selected' : 'transparent';
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTransactions = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return transactions.slice(startIndex, startIndex + rowsPerPage);
  }, [transactions, page, rowsPerPage]);

  return <Card>
      <FlexBetween p={3}>
        <div>
          <Typography variant="h6">{t(title) || title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {subtitle && t(subtitle)}
            </Typography>
          )}
        </div>
      </FlexBetween>

      <Scrollbar>
        <Table sx={{ width: '100%', tableLayout: 'auto' }}>

          <TableHead>
            <TableRow>
              <HeadTableCell>{t('RECIPIENT')}</HeadTableCell>
              <HeadTableCell>{t('INVOICE')}</HeadTableCell>
              <HeadTableCell>{t('DUE DATE')}</HeadTableCell>
              <HeadTableCell>{t('AMOUNT')}</HeadTableCell>
              <HeadTableCell>{t('PAYMENT')}</HeadTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <BodyTableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary" py={4}>
                    {t('No invoices available')}
                  </Typography>
                </BodyTableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction, index) => (
                <TableRow key={transaction.id || index} sx={{
                  backgroundColor: getColor(index)
                }}>
                  <BodyTableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <FlexBox gap={1} alignItems="center" minWidth={0}>
                      {transaction.clientAvatar && (
                        <Avatar alt={transaction.recipient} sx={{ width: 32, height: 32 }} />
                      )}
                      <Typography
                        variant="body2"
                        color="text.primary"
                        fontWeight={500}
                        component="span"
                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {transaction.recipient || '-'}
                      </Typography>
                    </FlexBox>
                  </BodyTableCell>

                  <BodyTableCell>
                    <Typography variant="body2" color="text.primary" component="span">
                      {transaction.invoiceNumber || '-'}
                    </Typography>
                  </BodyTableCell>

                  <BodyTableCell>
                    <Typography variant="body2" color="text.secondary" component="span">
                      {transaction.dueDate ? format(new Date(transaction.dueDate), 'dd MMM, yyyy') : '-'}
                    </Typography>
                  </BodyTableCell>

                  <BodyTableCell>
                    <Typography variant="body2" color="text.primary" fontWeight={500} component="span">
                      {transaction.amount ? currency(transaction.amount, transaction.currency) : '-'}
                    </Typography>
                  </BodyTableCell>

                  <BodyTableCell>
                    <PaymentCell invoice={transaction} onConfirm={(inv) => console.log('Outgoing paid:', inv)} />
                  </BodyTableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Scrollbar>

      <TablePagination
        component="div"
        count={transactions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[20]}
        showFirstButton
        showLastButton
      />
    </Card>;
}