import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import GridCard from '@/shared/components/common/cev/GridCard';
import { paginate } from '@/utils/paginate';

import ReceiptOutlined from '@/icons/ReceiptOutlined';
import Key from '@/icons/Key';
import HomeOutlined from '@/icons/HomeOutlined';
import Email from '@/icons/Email';
import User from '@/icons/User';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import CallIcon from '@mui/icons-material/CallOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import EditIcon from '@mui/icons-material/Edit';

export default function ClientGrid({ clients, page, perPage, onPageChange }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const paginatedClients = paginate(page, perPage, clients);

  const handleEditClient = (taxId) => {
    navigate(`/dashboard/edit-client/${taxId}`);
  };

  if (clients.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
        {t('No clients available yet.')}
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {paginatedClients.map(client => (
        <Box key={client.id} sx={{ position: 'relative', width: '100%' }}>
          <GridCard
            title={client.clientName}
            fields={[
              { icon: ReceiptOutlined, label: t('Tax ID'), value: client.taxId || client.id },
              { icon: Key, label: t('Registration Number'), value: client.regNmbr || '-' },
              { icon: HomeOutlined, label: t('Address'), value: client.adress },
              { icon: Email, label: t('Email'), value: client.email }
            ]}
            contactPerson={client.contactPerson ? {
              name: client.contactPerson.name,
              description: client.contactPerson.description,
              phoneNumber: client.contactPerson.phoneNumber,
              email: client.contactPerson.email
            } : null}
            contactIcons={{
              name: User,
              description: InfoIcon,
              phoneNumber: CallIcon,
              email: AlternateEmailIcon
            }}
            sx={{ width: '100%' }}
          />
          <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
            <Tooltip title={t('Edit Client')}>
              <IconButton 
                size="small" 
                onClick={() => handleEditClient(client.taxId)}
                sx={{
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    color: 'text.primary'
                  },
                  '&.Mui-disabled': { opacity: 0.7 }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ))}

      {clients.length > 0 && (
        <div>
          <Stack alignItems="center" py={2}>
            <Pagination 
              shape="rounded" 
              count={Math.ceil(clients.length / perPage)} 
              page={page}
              onChange={(_, newPage) => onPageChange(newPage)} 
            />
          </Stack>
        </div>
      )}
    </Stack>
  );
}
