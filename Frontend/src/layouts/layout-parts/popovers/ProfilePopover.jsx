import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router'; // MUI

import Box from '@mui/material/Box';
import { styled, alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography'; // CUSTOM COMPONENTS

import PopoverLayout from './_PopoverLayout';

import useAuth from '@/hooks/useAuth'; // STYLED COMPONENTS

const Text = styled('p')(({
  theme
}) => ({
  fontSize: 13,
  display: 'block',
  cursor: 'pointer',
  padding: '5px 1rem',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));
const UserTag = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 14px',
  borderRadius: 999,
  fontWeight: 600,
  letterSpacing: 1,
  fontSize: 12,
  minWidth: 56,
  background: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 100%)' : 'linear-gradient(135deg, rgba(37,99,235,0.16) 0%, rgba(37,99,235,0.08) 100%)',
  color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.primary[700],
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.28)' : alpha(theme.palette.primary.main, 0.35)}`,
  boxShadow: 'none',
  transition: 'transform 150ms ease',
  backdropFilter: 'blur(8px)',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: 'none'
  }
}));
export default memo(function ProfilePopover() {
  const navigate = useNavigate();
  const {
    logout,
    user
  } = useAuth();
  
  const displayName = user?.firstName || user?.name?.split(' ')[0] || 'Guest User';
  const fullName = user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Guest User';
  const SELECT_BUTTON = (
    <UserTag title={fullName}>
      {displayName}
    </UserTag>
  );
  const TITLE = <Box px={2} py={1.5}>
      <Typography variant="body2" fontWeight={600}>
        {fullName}
      </Typography>
    </Box>;
  const RENDER_CONTENT = useCallback(onClose => {
    return <Box pt={1}>
      <Text onClick={() => {
        navigate('/dashboard/profile');
        onClose();
      }}>Profile</Text>
      <Text onClick={() => {
        logout();
        onClose();
      }}>Sign Out</Text>
    </Box>;
  }, [logout, navigate]);
  return <PopoverLayout maxWidth={230} minWidth={200} showMoreButton={false} selectButton={SELECT_BUTTON} title={TITLE} renderContent={RENDER_CONTENT} />;
});