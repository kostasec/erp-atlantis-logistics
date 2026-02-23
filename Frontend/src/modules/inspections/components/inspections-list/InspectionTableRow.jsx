import React from 'react';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Trash from '@/icons/duotone/Trash';
import { BodyTableCell } from '@/shared/components/common';

const getStatusColor = (status) => {
  switch (status) {
    case 'valid':
      return 'success';
    case 'warning':
      return 'error';
    case 'expired':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'valid':
      return <CheckCircleIcon fontSize="small" />;
    case 'warning':
      return <WarningIcon fontSize="small" />;
    case 'expired':
      return <WarningIcon fontSize="small" />;
    default:
      return <CalendarTodayIcon fontSize="small" />;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('sr-RS');
};

export default function InspectionTableRow({
  inspection,
  selectedCategory,
  backgroundColor,
  onRenewClick,
  onDeleteClick
}) {
  return (
    <TableRow 
      sx={{
        backgroundColor,
        '& td:first-of-type': { paddingLeft: 3 }
      }}
    >
      {/* Vehicle/Employee Column */}
      {selectedCategory !== 'Other Inspections' && (
        <BodyTableCell>
          <Typography variant="body2" fontWeight={500}>
            {inspection.vehicleId}
          </Typography>
        </BodyTableCell>
      )}
      
      {/* Inspection Type */}
      <BodyTableCell>
        <Typography variant="body2">
          {inspection.inspectionType}
        </Typography>
      </BodyTableCell>

      {/* Status */}
      <BodyTableCell>
        <Chip
          size="medium"
          icon={getStatusIcon(inspection.status)}
          label={inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1)}
          color={getStatusColor(inspection.status)}
          variant="outlined"
          sx={{ minWidth: '100px', height: '30px' }}
        />
      </BodyTableCell>

      {/* Last Inspection Date */}
      <BodyTableCell>
        <Typography variant="body2">
          {formatDate(inspection.lastInspection)}
        </Typography>
      </BodyTableCell>

      {/* Next Inspection Date */}
      <BodyTableCell>
        <Typography variant="body2">
          {formatDate(inspection.nextInspection)}
        </Typography>
      </BodyTableCell>

      {/* Days Until Expiry */}
      <BodyTableCell>
        <Typography 
          variant="body2" 
          color={
            inspection.daysUntilExpiry < 0 
              ? 'error' 
              : inspection.daysUntilExpiry < 31 
              ? 'error' 
              : 'text.primary'
          }
          fontWeight={inspection.daysUntilExpiry < 31 ? 600 : 400}
        >
          {inspection.daysUntilExpiry < 0 
            ? `${Math.abs(inspection.daysUntilExpiry)} days overdue`
            : `${inspection.daysUntilExpiry} days`
          }
        </Typography>
      </BodyTableCell>

      {/* Actions */}
      <BodyTableCell>
        <Stack direction="row" spacing={1}>
          <IconButton 
            size="small" 
            color="primary"
            onClick={() => onRenewClick(inspection)}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            color="error"
            onClick={() => onDeleteClick(inspection.id)}
          >
            <Trash fontSize="small" />
          </IconButton>
        </Stack>
      </BodyTableCell>
    </TableRow>
  );
}
