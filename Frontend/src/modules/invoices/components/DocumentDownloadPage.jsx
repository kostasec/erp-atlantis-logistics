import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { isDocumentAccepted, markDocumentAsAccepted } from '@/utils/documentStatus';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function DocumentDownloadPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { type: invoiceType, id: invoiceId } = useParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  
  // Determine if this is an incoming invoice (needs acceptance)
  const isIncomingInvoice = invoiceType === 'incoming';

  // Check if document is already accepted (only for incoming invoices)
  useEffect(() => {
    if (invoiceId && isIncomingInvoice) {
      setIsAccepted(isDocumentAccepted(invoiceId));
    }
  }, [invoiceId, isIncomingInvoice]);

  const handleDownloadInvoicePDF = () => {
    setIsProcessing(true);
    // Invoice PDF download logic here
    setTimeout(() => {
      console.log('Downloading Invoice PDF...');
      setIsProcessing(false);
    }, 1000);
  };

  const handleDownloadPDFAttachment = () => {
    setIsProcessing(true);
    // PDF Attachment download logic here
    setTimeout(() => {
      console.log('Downloading PDF Attachment...');
      setIsProcessing(false);
    }, 1000);
  };

  const handleAccept = () => {
    if (!invoiceId) return;
    
    setIsProcessing(true);
    // Accept document logic here
    setTimeout(() => {
      console.log('Document accepted');
      
      // Mark document as accepted
      markDocumentAsAccepted(invoiceId);
      setIsAccepted(true);
      setIsProcessing(false);
      navigate(-1); // Go back to previous page
    }, 1000);
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      {/* Header with Back Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={handleCancel} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight={600}>
        Download and Verification of eDocument Correctness
        </Typography>
      </Box>

      {/* Main Card */}
      <Card sx={{ p: 4 }}>
        <Stack spacing={4}>
            
          {/* Title */}
          
          <Typography 
            variant="h5" 
            component="h2" 
            textAlign="center" 
            color="text.primary"
            fontWeight={500}
          >
            Download Documents
          </Typography>
            
          {/* First Row - Download Buttons */}
          <Grid container spacing={3} justifyContent="center">
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<PictureAsPdfIcon />}
                onClick={handleDownloadInvoicePDF}
                disabled={isProcessing}
                sx={{ 
                  py: 2,
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }}
              >
                Invoice PDF
              </Button>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<AttachFileIcon />}
                onClick={handleDownloadPDFAttachment}
                disabled={isProcessing}
                sx={{ 
                  py: 2,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2
                  }
                }}
              >
                PDF Attachment
              </Button>
            </Grid>
          </Grid>

          {/* Second Row - Action Buttons - Only show for incoming invoices */}
          {isIncomingInvoice && !isAccepted && (
            <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleAccept}
                  disabled={isProcessing}
                  sx={{ 
                    py: 2,
                    backgroundColor: 'success.main',
                    '&:hover': {
                      backgroundColor: 'success.dark'
                    }
                  }}
                >
                  Accept
                </Button>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={isProcessing}
                  color="error"
                  sx={{ 
                    py: 2,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2
                    }
                  }}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          )}

          {/* Show acceptance status if already accepted (only for incoming) */}
          {isIncomingInvoice && isAccepted && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography 
                variant="h6" 
                color="success.main" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                <CheckCircleIcon /> Document Already Accepted
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This document has been previously accepted and verified.
              </Typography>
            </Box>
          )}

          {/* Processing State */}
          {isProcessing && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Processing...
              </Typography>
            </Box>
          )}
        </Stack>
      </Card>
    </Box>
  );
}