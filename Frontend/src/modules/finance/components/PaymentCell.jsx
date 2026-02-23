import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';

export default function PaymentCell({ invoice, onConfirm }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    if (onConfirm) onConfirm(invoice);
    handleClose();
  };

  return (
    <>
      <Button variant="outlined" size="small" onClick={handleOpen}>
        {t('PAY')}
      </Button>

      <Dialog open={open} onClose={handleClose}>
  <DialogTitle>{t('CONFIRM PAYMENT')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('Are you sure this invoice has been paid?')}</DialogContentText>
          {invoice && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t('INVOICE')}: {invoice.invoiceNumber || invoice.id}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('CANCEL')}</Button>
          <Button onClick={handleConfirm} autoFocus>
            {t('CONFIRM')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
