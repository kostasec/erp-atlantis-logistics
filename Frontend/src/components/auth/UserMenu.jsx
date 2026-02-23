import React from 'react';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography, 
  Divider,
  Avatar,
  Box 
} from '@mui/material';
import { 
  AccountCircle, 
  ExitToApp,
  Person
} from '@mui/icons-material';
import { useAuthContext } from '../../contexts/AuthContext';

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user, logout } = useAuthContext();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  if (!user) return null;

  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
        </Avatar>
      </IconButton>
      
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
          <Typography variant="subtitle2" color="text.primary">
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
          <Typography variant="caption" color="primary">
            Role: {user.role}
          </Typography>
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleClose}>
          <Person sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        
        <MenuItem onClick={handleLogout}>
          <ExitToApp sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;