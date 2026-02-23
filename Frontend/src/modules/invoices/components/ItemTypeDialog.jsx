import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { styled, alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

// STYLED COMPONENTS
const OptionCard = styled(Box)(({ theme, selected }) => ({
  border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: selected ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.08)
  }
}));

export default function ItemTypeDialog({ open, onClose, onConfirm }) {
  const { t } = useTranslation();

  const itemTypes = [
    {
      id: 'transport',
      title: 'Transport Item',
      description: 'Add a new transportation item'
    },
    {
      id: 'tax',
      title: 'Tax Item', 
      description: 'Add a tax type'
    }
  ];

  const handleSelectType = (typeId) => {
    onConfirm(typeId);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, pr: 5 }}>
        <Typography variant="h6" fontWeight={600}>
          {t('Select Item Type')}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'red'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2, pb: 2 }}>
        <Stack spacing={2}>
          {itemTypes.map((type) => (
            <OptionCard
              key={type.id}
              selected={false}
              onClick={() => handleSelectType(type.id)}
            >
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                {t(type.title)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t(type.description)}
              </Typography>
            </OptionCard>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}