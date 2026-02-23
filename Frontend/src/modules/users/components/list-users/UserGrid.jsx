import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';

import EntityGridCard from '@/shared/components/common/cev/GridCard';
import { paginate } from '@/utils/paginate';

import User from '@/icons/User';
import Email from '@/icons/Email';
import Key from '@/icons/Key';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';

export default function UserGrid({ 
  users, 
  page, 
  perPage, 
  onPageChange, 
  onEditUser, 
  onChangePassword, 
  onDeleteUser,
  onGenerateTempPassword 
}) {
  const { t } = useTranslation();

  const paginatedUsers = paginate(page, perPage, users);

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'Admin': return 'error';
      case 'Manager': return 'warning';
      case 'Employee': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'default';
  };

  if (users.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
        No users available yet.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {paginatedUsers.map(user => (
        <Box key={user.UserID} sx={{ position: 'relative', width: '100%' }}>
          <EntityGridCard
            title={`${user.FirstName} ${user.LastName}`}
            subtitle={
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                <Chip 
                  label={user.Role} 
                  size="small" 
                  color={getRoleColor(user.Role)}
                  variant="outlined"
                />
                <Chip 
                  label={user.IsActive ? 'Active' : 'Inactive'} 
                  size="small" 
                  color={getStatusColor(user.IsActive)}
                  variant={user.IsActive ? 'filled' : 'outlined'}
                />
              </Box>
            }
            fields={[
              { 
                icon: User, 
                label: 'User ID', 
                value: user.UserID 
              },
              { 
                icon: Email, 
                label: 'Email', 
                value: user.Email 
              },
              { 
                icon: BadgeIcon, 
                label: 'Role', 
                value: user.Role?.charAt(0).toUpperCase() + user.Role?.slice(1) || 'N/A'
              },
              { 
                icon: PersonIcon, 
                label: 'Status', 
                value: user.IsActive ? 'Active' : 'Inactive'
              }
            ]}
            sx={{ width: '100%' }}
          />
          
          {/* Action buttons */}
          <Box sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12,
            display: 'flex',
            gap: 0.5
          }}>
            <Tooltip title="Edit User">
              <IconButton 
                size="small" 
                onClick={() => onEditUser(user)}
                sx={{ 
                  bgcolor: 'background.paper', 
                  boxShadow: 1, 
                  '&:hover': { bgcolor: 'action.hover' } 
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Change Password">
              <IconButton 
                size="small" 
                onClick={() => onChangePassword(user)}
                sx={{ 
                  bgcolor: 'background.paper', 
                  boxShadow: 1, 
                  '&:hover': { bgcolor: 'action.hover' } 
                }}
              >
                <LockIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Generate Temporary Password">
              <IconButton 
                size="small" 
                onClick={() => onGenerateTempPassword(user)}
                sx={{ 
                  bgcolor: 'background.paper', 
                  boxShadow: 1, 
                  '&:hover': { bgcolor: 'action.hover' } 
                }}
              >
                <KeyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Deactivate User">
              <IconButton 
                size="small" 
                onClick={() => onDeleteUser(user.UserID)}
                sx={{ 
                  bgcolor: 'background.paper', 
                  boxShadow: 1, 
                  '&:hover': { bgcolor: 'action.hover' } 
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ))}

      {users.length > 0 && (
        <div>
          <Stack alignItems="center" py={2}>
            <Pagination 
              shape="rounded" 
              count={Math.ceil(users.length / perPage)} 
              page={page}
              onChange={(_, newPage) => onPageChange(newPage)} 
            />
          </Stack>
        </div>
      )}
    </Stack>
  );
}