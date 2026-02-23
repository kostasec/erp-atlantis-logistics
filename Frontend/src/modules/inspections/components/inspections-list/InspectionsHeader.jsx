import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';

export default function InspectionsHeader({
  loading,
  error,
  selectedCategory,
  inspectionCategories,
  onCategoryChange,
  onAddClick
}) {
  return (
    <Box sx={{ p: 3 }}>
      <div>
        <Typography variant="h5">Inspections</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Track vehicle and employee inspections
        </Typography>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <Stack spacing={2} sx={{ mt: 3 }}>
          {/* Category Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {inspectionCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'contained' : 'outlined'}
                onClick={() => onCategoryChange(category)}
                size="medium"
              >
                {category}
              </Button>
            ))}
          </Box>

          {/* Add Inspection Button */}
          <Box>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={onAddClick}
              size="small"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Add Inspection
            </Button>
          </Box>
        </Stack>
      )}
    </Box>
  );
}
