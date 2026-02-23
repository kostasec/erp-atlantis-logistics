import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import TransactionTableIncomingInv from '../components/TransactionTableIncomingInv';
import TransactionTableOutgoingInv from '../components/TransactionTableOutgoingInv';
import { useTranslation } from 'react-i18next';
import incomingInvoiceService from '@/modules/invoices/services/incomingInvoiceService';
import outgoingInvoiceService from '@/modules/invoices/services/outgoingInvoiceService';

export function Finance1PageView() {
  const { t } = useTranslation();
  const [outgoingInvoices, setOutgoingInvoices] = useState([]);
  const [incomingInvoicesCarriers, setIncomingInvoicesCarriers] = useState([]);
  const [incomingInvoicesOthers, setIncomingInvoicesOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching carrier invoices...');
        const carriersResponse = await incomingInvoiceService.getIncomingInvoiceCarriers();
        console.log('Carriers response:', carriersResponse);
        const carriersInvoices = carriersResponse.data || [];
        
        console.log('Fetching other invoices...');
        const othersResponse = await incomingInvoiceService.getIncomingInvoiceSuppliers();
        console.log('Others response:', othersResponse);
        const othersInvoices = othersResponse.data || [];
        
        console.log('Fetching outgoing invoices...');
        const outgoingResponse = await outgoingInvoiceService.getAllOutgoingInvoices();
        console.log('Outgoing response:', outgoingResponse);
        const outgoingInvoicesData = outgoingResponse.data || [];
        
        // Transform carrier invoices to transaction format
        const transformedCarriers = carriersInvoices.map(invoice => ({
          id: invoice.id,
          sender: invoice.sender,
          invoiceNumber: invoice.invoiceNumber,
          dueDate: invoice.dueDate,
          amount: invoice.amount,
          currency: invoice.currency
        }));

        // Transform other invoices to transaction format
        const transformedOthers = othersInvoices.map(invoice => ({
          id: invoice.id,
          sender: invoice.sender,
          invoiceNumber: invoice.invoiceNumber,
          dueDate: invoice.dueDate,
          amount: invoice.amount,
          currency: invoice.currency
        }));

        // Transform outgoing invoices to transaction format
        const transformedOutgoing = outgoingInvoicesData.map(invoice => ({
          id: invoice.id,
          recipient: invoice.recipient,
          invoiceNumber: invoice.invoiceNumber,
          dueDate: invoice.dueDate,
          amount: invoice.amount,
          currency: invoice.currency
        }));

        setIncomingInvoicesCarriers(transformedCarriers);
        setIncomingInvoicesOthers(transformedOthers);
        setOutgoingInvoices(transformedOutgoing);
        
        console.log('Finance data loaded successfully');
        
      } catch (error) {
        console.error('Error fetching invoice data:', error);
        setError(error.message || 'Failed to load invoice data');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <div className="pt-2 pb-4">
        <Card sx={{ px: 3, py: 2 }}>
          <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
            {t('Loading...')}
          </Typography>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-2 pb-4">
        <Card sx={{ px: 3, py: 2 }}>
          <Typography variant="body2" color="error" textAlign="center" py={4}>
            {t('Error')}: {error}
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        {/* Incoming Invoices - Carriers */}
        <Grid size={{ xs: 12, md: 12 }}>
          <TransactionTableIncomingInv 
            title={t('Incoming Invoices for Payment')} 
            subtitle={t('Carriers')}
            transactions={incomingInvoicesCarriers}
          />
        </Grid>

        {/* Incoming Invoices - Others */}
        <Grid size={{ xs: 12, md: 12 }}>
          <TransactionTableIncomingInv 
            subtitle={t('Others')}
            transactions={incomingInvoicesOthers}
          />
        </Grid>

        {/* Outgoing Invoices */}
        <Grid size={{ xs: 12, md: 12 }}>
          <TransactionTableOutgoingInv
            title={t('Outgoing Invoices for Payment')}
            transactions={outgoingInvoices}
          />
        </Grid>
      </Grid>
    </div>
  );
}