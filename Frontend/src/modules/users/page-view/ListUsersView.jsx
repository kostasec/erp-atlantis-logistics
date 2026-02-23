import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';

import SearchArea from '@/shared/components/common/cev/SearchArea';
import { UserHeader, UserGrid } from '../components/list-users';
import { userService } from '@/services/userService';

export default function ListUsersView() {
  const { t } = useTranslation();
  const [perPage] = useState(8);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ role: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // Dialog states
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openTempPasswordDialog, setOpenTempPasswordDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  // Form states
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'employee'
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeFilter = (key, value) => {
    setFilter(state => ({ ...state, [key]: value }));
  };

  const handleSearchChange = useCallback(e => {
    handleChangeFilter('search', e.target.value);
  }, []);

  const changeTab = useCallback((_, newValue) => {
    handleChangeFilter('role', newValue);
  }, []);

  const handleCreateUser = useCallback(() => {
    setUserForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'employee'
    });
    setIsEditing(false);
    setOpenUserDialog(true);
  }, []);

  const handleEditUser = useCallback((user) => {
    setUserForm({
      firstName: user.FirstName,
      lastName: user.LastName,
      email: user.Email,
      password: '',
      role: user.Role
    });
    setSelectedUser(user);
    setIsEditing(true);
    setOpenUserDialog(true);
  }, []);

  const handleChangePassword = useCallback((user) => {
    setSelectedUser(user);
    setPasswordForm({
      newPassword: '',
      confirmPassword: ''
    });
    setOpenPasswordDialog(true);
  }, []);

  const handleDeleteUser = useCallback(async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await userService.deleteUser(userId);
        setSuccess('User deactivated successfully');
        fetchUsers();
      } catch (err) {
        setError(err.message);
      }
    }
  }, []);

  const handleGenerateTempPassword = useCallback((user) => {
    setSelectedUser(user);
    setConfirmAction(() => async () => {
      try {
        const response = await userService.generateTempPassword(user.UserID);
        setTempPassword(response.data.temporaryPassword);
        setOpenTempPasswordDialog(true);
        setSuccess('Temporary password generated successfully');
        setOpenConfirmDialog(false);
      } catch (err) {
        setError(err.message);
        setOpenConfirmDialog(false);
      }
    });
    setOpenConfirmDialog(true);
  }, []);

  const handleUserSubmit = async () => {
    try {
      if (isEditing) {
        await userService.updateUser(selectedUser.UserID, {
          firstName: userForm.firstName,
          lastName: userForm.lastName,
          email: userForm.email,
          role: userForm.role,
          isActive: true
        });
        setSuccess('User updated successfully');
      } else {
        if (!userForm.password) {
          setError('Password is required for new users');
          return;
        }
        await userService.createUser(userForm);
        setSuccess('User created successfully');
      }
      
      setOpenUserDialog(false);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      await userService.updateUserPassword(selectedUser.UserID, passwordForm.newPassword);
      setSuccess('Password updated successfully');
      setOpenPasswordDialog(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const filtered = users.filter(user => {
    if (filter.role) return user.Role?.toLowerCase() === filter.role;
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return (
        user.FirstName?.toLowerCase().includes(searchLower) ||
        user.LastName?.toLowerCase().includes(searchLower) ||
        user.Email?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="pt-2 pb-4">
        <Card sx={{ px: 3, py: 2 }}>
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress />
          </Box>
        </Card>
      </div>
    );
  }

  if (error && !users.length) {
    return (
      <div className="pt-2 pb-4">
        <Card sx={{ px: 3, py: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ px: 3, py: 2 }}>
        <UserHeader 
          filterRole={filter.role}
          onTabChange={changeTab}
          onCreateUser={handleCreateUser}
        />

        <SearchArea 
          value={filter.search} 
          onChange={handleSearchChange} 
          gridRoute="/dashboard/user-grid" 
          listRoute="/dashboard/user-list" 
        />

        <UserGrid
          users={filtered}
          page={page}
          perPage={perPage}
          onPageChange={setPage}
          onEditUser={handleEditUser}
          onChangePassword={handleChangePassword}
          onDeleteUser={handleDeleteUser}
          onGenerateTempPassword={handleGenerateTempPassword}
        />
      </Card>

      {/* User Create/Edit Dialog */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit User' : 'Create New User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="First Name"
              value={userForm.firstName}
              onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={userForm.lastName}
              onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              fullWidth
            />
            {!isEditing && (
              <TextField
                label="Password"
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                fullWidth
              />
            )}
            <TextField
              label="Role"
              select
              value={userForm.role}
              onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              fullWidth
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenUserDialog(false)}
            variant="outlined"
            color="primary"
            sx={{
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'primary.lighter'
              }
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleUserSubmit} variant="contained">
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              fullWidth
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenPasswordDialog(false)}
            variant="outlined"
            color="primary"
            sx={{
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'primary.lighter'
              }
            }}
          >
            Cancel
          </Button>
          <Button onClick={handlePasswordSubmit} variant="contained">
            Update Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Temporary Password Display Dialog */}
      <Dialog open={openTempPasswordDialog} onClose={() => setOpenTempPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Temporary Password Generated</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Temporary password for: <strong>{selectedUser?.FirstName} {selectedUser?.LastName}</strong>
            </Typography>
            <Box sx={{ 
              p: 2, 
              border: '2px solid', 
              borderColor: 'primary.main', 
              borderRadius: 1, 
              bgcolor: 'primary.light', 
              color: 'primary.contrastText',
              textAlign: 'center'
            }}>
              <Typography variant="h5" fontWeight="bold" sx={{ letterSpacing: 2 }}>
                {tempPassword}
              </Typography>
            </Box>
            <Typography variant="body2" color="warning.main" sx={{ fontWeight: 'bold' }}>
              ⚠️ Please share this password securely and ask the user to change it immediately after first login.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              navigator.clipboard.writeText(tempPassword);
              setSuccess('Password copied to clipboard');
            }}
            variant="outlined"
          >
            Copy Password
          </Button>
          <Button 
            onClick={() => {
              setOpenTempPasswordDialog(false);
              setTempPassword('');
            }} 
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Generate temporary password for <strong>{selectedUser?.FirstName} {selectedUser?.LastName}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This will create a new temporary password and invalidate any existing password.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={() => confirmAction && confirmAction()} 
            variant="contained"
            color="primary"
          >
            Generate Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars for feedback */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}