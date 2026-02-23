import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { styled } from '@mui/material/styles';

import { FlexBetween, FlexBox } from '@/components/flexbox';
import Add from '@/icons/Add';

const TabListWrapper = styled(TabList)(({ theme }) => ({
  borderBottom: 0,
  [theme.breakpoints.down(727)]: {
    order: 3
  }
}));

export default function UserHeader({ filterRole, onTabChange, onCreateUser }) {
  const { t } = useTranslation();

  return (
    <>
      <FlexBetween flexWrap="wrap" gap={1}>
        <FlexBox alignItems="center" gap={1.5}>
          <Typography variant="h5" fontWeight={600}>
            Users
          </Typography>
        </FlexBox>

        <TabContext value={filterRole}>
          <TabListWrapper variant="scrollable" onChange={onTabChange}>
            {}
          </TabListWrapper>
        </TabContext>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onCreateUser}
        >
          Add User
        </Button>
      </FlexBetween>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        User management and administration
      </Typography>
    </>
  );
}