import { useLocation, useNavigate } from 'react-router'; // MUI

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles'; // MUI ICON COMPONENT

import Search from '@mui/icons-material/Search'; // CUSTOM COMPONENTS

import { useTranslation } from 'react-i18next';

import FlexBetween from '@/components/flexbox/FlexBetween'; // CUSTOM ICON COMPONENTS

import Apps from '@/icons/Apps';
import FormatBullets from '@/icons/FormatBullets'; // STYLED COMPONENTS

const SearchTextField = styled(TextField)({
  width: '100%'
});
const ActionButtons = styled('div')(({
  theme
}) => ({
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: theme.palette.grey[50],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700]
  })
})); // ==========================================================================================

// ==========================================================================================
export default function SearchArea({
  value = '',
  onChange,
  gridRoute,
  listRoute
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    pathname
  } = useLocation();

  const activeColor = path => pathname === path ? 'primary.main' : 'grey.400';

  return <FlexBetween gap={1} my={3}>
      {
      /* SEARCH BOX */
    }
      <SearchTextField value={value} onChange={onChange} placeholder={t('Search...')} slotProps={{
      input: {
        startAdornment: <Search />
      }
    }} />

      {
      /* NAVIGATION BUTTONS */
    }

    </FlexBetween>;
}