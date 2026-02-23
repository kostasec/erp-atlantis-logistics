import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';

import ChevronRight from '@/icons/ChevronRight';

export const SidebarWrapper = styled('div', {
  shouldForwardProp: prop => prop !== 'compact'
})(({ theme, compact }) => ({
  width: 280,
  height: '100vh',
  position: 'fixed',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: theme.palette.grey[100],
  backgroundImage: `linear-gradient(180deg, ${theme.palette.common.white} 0%, ${theme.palette.grey[50]} 25%, ${theme.palette.grey[100]} 55%, ${theme.palette.grey[200]} 80%, ${theme.palette.grey[300]} 100%)`,
  zIndex: theme.zIndex.drawer,
  transition: 'width 200ms ease',
  borderRight: `1px solid ${theme.palette.grey[300]}`,
  boxShadow: `0 12px 32px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(15, 23, 42, 0.08)`,
  ...(compact && {
    width: 86,
    '&:hover': {
      width: 280
    }
  }),
  ...theme.applyStyles('dark', {
    border: 0,
    backgroundImage: `linear-gradient(180deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`,
    boxShadow: `inset 0 1px 0 ${theme.palette.grey[700]}`
  })
}));

export const ICON_STYLE = active => ({
  fontSize: 18,
  color: active ? 'primary.main' : 'text.secondary'
});

export const AccordionExpandPanel = styled('div')({
  '&.expand': {
    '& .expand': {
      paddingLeft: 8
    }
  }
});

export const BulletIcon = styled('div', {
  shouldForwardProp: prop => prop !== 'active'
})(({ theme, active }) => ({
  width: 4,
  height: 4,
  marginLeft: '10px',
  marginRight: '8px',
  overflow: 'hidden',
  borderRadius: '50%',
  background: theme.palette.text.secondary,
  ...(active && {
    background: theme.palette.primary.main,
    boxShadow: `0px 0px 0px 3px ${theme.palette.primary[100]}`,
    ...theme.applyStyles('dark', {
      boxShadow: `0px 0px 0px 3px ${theme.palette.grey[700]}`
    })
  })
}));

export const AccordionButton = styled(ButtonBase, {
  shouldForwardProp: prop => prop !== 'active'
})(({ theme, active }) => ({
  height: 44,
  width: '100%',
  padding: '0 12px',
  marginBottom: 5,
  borderRadius: '10px',
  justifyContent: 'space-between',
  '& .icon': {
    fontSize: 18,
    color: theme.palette.text.secondary
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    '& span, & .MuiSvgIcon-root': {
      color: theme.palette.primary.main
    }
  },
  ...(active && {
    backgroundColor: theme.palette.grey[100],
    border: `2px solid ${theme.palette.primary.main}`,
    fontWeight: 600,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[700],
      border: `2px solid ${theme.palette.primary.light}`
    })
  })
}));

export const ChevronRightStyled = styled(ChevronRight, {
  shouldForwardProp: prop => prop !== 'collapsed' && prop !== 'compact' && prop !== 'active'
})(({ collapsed, compact, active, theme }) => ({
  fontSize: 18,
  color: theme.palette.grey[400],
  transition: 'transform 0.3s cubic-bezier(0, 0, 0.2, 1) 0ms',
  transform: collapsed ? 'rotate(90deg)' : 'rotate(0deg)',
  ...(compact && {
    opacity: 0,
    width: 0
  }),
  ...(active && {
    color: theme.palette.primary.main
  }),
  ...(theme.direction === 'rtl' && {
    rotate: '180deg',
    transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)'
  })
}));

export const ItemText = styled('span', {
  shouldForwardProp: prop => prop !== 'compact' && prop !== 'active'
})(({ theme, compact, active }) => ({
  fontSize: 14,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  paddingLeft: '0.8rem',
  transition: 'all 0.15s ease',
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  ...(compact && {
    opacity: 0,
    width: 0,
    paddingLeft: 0
  })
}));

export const NavItemButton = styled(ButtonBase, {
  shouldForwardProp: prop => prop !== 'active'
})(({ theme, active }) => ({
  height: 44,
  width: '100%',
  marginBottom: 4,
  padding: '0 18px',
  justifyContent: 'flex-start',
  '&.Mui-disabled': {
    opacity: 0.6
  },
  ...(active && {
    borderRadius: '10px',
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.grey[100],
    border: `2px solid ${theme.palette.primary.main}`,
    fontWeight: 600,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[700],
      border: `2px solid ${theme.palette.primary.light}`
    })
  }),
  '&:hover': {
    borderRadius: '10px',
    backgroundColor: theme.palette.action.hover,
    '& > span, & > .MuiSvgIcon-root': {
      color: theme.palette.primary.main
    }
  }
}));

export const ListLabel = styled('p', {
  shouldForwardProp: prop => prop !== 'compact'
})(({ theme, compact }) => ({
  fontSize: 12,
  marginTop: 20,
  marginLeft: 15,
  fontWeight: 600,
  marginBottom: 10,
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
  ...(compact && {
    opacity: 0,
    width: 0
  })
}));

export const ExternalLink = styled('a')(({ theme }) => ({
  overflow: 'hidden',
  whiteSpace: 'pre',
  marginBottom: '8px',
  textDecoration: 'none',
  color: theme.palette.text.primary
}));

export const DashboardHeaderRoot = styled(AppBar)({
  paddingTop: '1rem',
  paddingBottom: '1rem',
  backdropFilter: 'blur(6px)'
});

export const StyledToolBar = styled(Toolbar)({
  '@media (min-width: 0px)': {
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: 'auto'
  }
});