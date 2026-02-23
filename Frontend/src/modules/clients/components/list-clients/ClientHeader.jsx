import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';

import HeadingArea from '@/shared/components/common/cev/HeadingArea';
import Add from '@/icons/Add';

export default function ClientHeader({ filterRole, onTabChange }) {
  const { t } = useTranslation();

  return (
    <>
      <HeadingArea 
        value={filterRole} 
        changeTab={onTabChange} 
        title={
          <Typography variant="h5" fontWeight={600}>{t('Clients')}</Typography>
        } 
        icon={Add} 
        buttonLabel={t('Add Client')} 
        buttonRoute="/dashboard/add-client" 
      />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Client management and creation
      </Typography>
    </>
  );
}
