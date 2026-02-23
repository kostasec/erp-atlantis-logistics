import { useNavigate } from 'react-router';

import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { styled, alpha } from '@mui/material/styles';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';

import { FlexBetween, FlexBox } from '@/components/flexbox';

const TabListWrapper = styled(TabList)(({ theme }) => ({
  borderBottom: 0,
  [theme.breakpoints.down(727)]: {
    order: 3
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '.icon': {
    fontSize: 22,
    color: theme.palette.primary.main
  }
}));

// ===================================================================

export default function HeadingArea({
  value,
  changeTab,
  title,          // string
  icon: Icon,     // React components & icons
  buttonLabel,    // string
  buttonRoute     // string 
}) {
  const navigate = useNavigate();

  return (
    <FlexBetween flexWrap="wrap" gap={1}>
      <FlexBox alignItems="center" gap={1.5}>


        <Typography variant="body1" fontWeight={500}>
          {title}
        </Typography>
      </FlexBox>

      <TabContext value={value}>
        <TabListWrapper variant="scrollable" onChange={changeTab}>
          {}
        </TabListWrapper>
      </TabContext>

      {buttonLabel && buttonRoute && (
        <Button
          variant="contained"
          startIcon={Icon ? <Icon /> : null}
          onClick={() => navigate(buttonRoute)}
        >
          {buttonLabel}
        </Button>
      )}
    </FlexBetween>
  );
}
