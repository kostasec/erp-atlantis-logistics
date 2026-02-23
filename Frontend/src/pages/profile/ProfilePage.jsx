import { use, useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import { AuthContext } from '@/contexts/jwtContext';
import { userService } from '@/services/userService';
import HeadingArea from '@/shared/components/common/cev/HeadingArea';
import UserIcon from '@/icons/duotone/UserProfile';
import LockIcon from '@/icons/LockOutlined';

export default function ProfilePage() {
  const { user } = use(AuthContext);
  const [profile, setProfile] = useState({
    firstName: user?.firstName || user?.name?.split(' ')[0] || '',
    lastName: user?.lastName || user?.name?.split(' ')[1] || '',
    email: user?.email || ''
  });
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  // Load current user details from backend
  useEffect(() => {
    const load = async () => {
      try {
        const res = await userService.getUserById(user.id || user.userId);
        const d = res.data;
        setProfile({
          firstName: d.firstName || '',
          lastName: d.lastName || '',
          email: d.email || ''
        });
      } catch (err) {
        // keep defaults if fetch fails
        console.warn('Failed to load user profile:', err.message);
      }
    };
    if (user) load();
  }, [user]);

  const handleProfileSave = async () => {
    try {
      setStatus({ type: '', message: '' });
      const res = await userService.updateUser(user.id || user.userId, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        role: user.role
      });
      setStatus({ type: 'success', message: 'Profile updated successfully.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handlePasswordChange = async () => {
    try {
      setStatus({ type: '', message: '' });
      if (passwords.newPassword.length < 6) {
        setStatus({ type: 'error', message: 'Password must be at least 6 characters long.' });
        return;
      }
      if (passwords.newPassword !== passwords.confirmPassword) {
        setStatus({ type: 'error', message: 'Passwords do not match.' });
        return;
      }
      await userService.updateUserPassword(user.id || user.userId, passwords.newPassword);
      setPasswords({ newPassword: '', confirmPassword: '' });
      setStatus({ type: 'success', message: 'Password changed successfully.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ px: 3, py: 3 }}>
        <HeadingArea 
          title={
            <Typography variant="h5" fontWeight={600}>My Profile</Typography>
          }
        />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Manage your personal information and security settings
        </Typography>
        
        <Box sx={{ mt: 2 }} />

        {status.message && (
          <Alert severity={status.type === 'error' ? 'error' : 'success'} sx={{ mb: 3 }}>
            {status.message}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* General Info Section */}
          <Box>
            <Typography variant="h6" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <UserIcon sx={{ fontSize: 20 }} />
              General Info
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField 
                  label="First Name" 
                  value={profile.firstName} 
                  onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField 
                  label="Last Name" 
                  value={profile.lastName} 
                  onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField 
                  label="Email" 
                  type="email" 
                  value={profile.email} 
                  onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          {/* Password Section */}
          <Box>
            <Typography variant="h6" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LockIcon sx={{ fontSize: 20 }} />
              Password
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField 
                  label="New Password" 
                  type="password" 
                  value={passwords.newPassword} 
                  onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField 
                  label="Confirm Password" 
                  type="password" 
                  value={passwords.confirmPassword} 
                  onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
            <Button 
              variant="contained" 
              onClick={handleProfileSave}
            >
              Save Profile
            </Button>
            <Button 
              variant="contained" 
              onClick={handlePasswordChange}
            >
              Change Password
            </Button>
          </Stack>
        </Stack>
      </Card>
    </div>
  );
}
