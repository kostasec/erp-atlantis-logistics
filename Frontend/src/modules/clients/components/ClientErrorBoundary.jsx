import React from 'react';
import { Card, Alert, Button, Typography, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ClientErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Client form error:', error, errorInfo);
    
    // Send to monitoring service (u production)
    // sendErrorToMonitoring(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="pt-2 pb-4">
          <Card sx={{ px: 3, py: 4, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <ErrorOutlineIcon sx={{ fontSize: 48, color: 'error.main' }} />
            </Box>
            
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="h6" gutterBottom>
                Something went wrong
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                An error occurred while loading the client form. Please try again or contact support if the problem persists.
              </Typography>
            </Alert>
            
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                onClick={this.handleReset}
                sx={{ mr: 2 }}
              >
                Try Again
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => window.location.href = '/dashboard/client'}
              >
                Back to Clients
              </Button>
            </Box>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ClientErrorBoundary;