import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/jwtContext';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  console.log('AdminRoute - isAuthenticated:', isAuthenticated, 'user:', user);

  // Ako nije ulogovan, preusmeri na login
  if (!isAuthenticated) {
    console.log('AdminRoute - Redirecting to login');
    return <Navigate to="/auth/login" replace />;
  }

  // Ako nije admin, prikaži error message
  if (user?.role?.toLowerCase() !== 'admin') {
    console.log('AdminRoute - Access denied, user role:', user?.role);
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
            Access Denied
          </Typography>
          <Typography variant="body2">
            You don't have permission to access this page. Administrator privileges are required.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
            Current role: {user?.role || 'None'}
          </Typography>
        </Alert>
      </Box>
    );
  }

  console.log('AdminRoute - Access granted');
  // Ako je admin, prikaži komponentu
  return children;
};

export default AdminRoute;