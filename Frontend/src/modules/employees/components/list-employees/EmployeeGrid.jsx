import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import GridCard from '@/shared/components/common/cev/GridCard';
import { paginate } from '@/utils/paginate';

import HomeOutlined from '@/icons/HomeOutlined';
import Call from '@/icons/Call';
import Car from '@/icons/Car';
import duotone from '@/icons/duotone';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router';

export default function EmployeeGrid({ employees, page, perPage, onPageChange }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const paginatedEmployees = paginate(page, perPage, employees);

  if (employees.length === 0) {
    return (
      <Grid container spacing={3}>
        <Grid size={12}>
          <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
            {t('No employees available yet.')}
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {paginatedEmployees.map(employee => (
        <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }} key={employee.employeeId || employee.id}>
          <Box sx={{ position: 'relative', width: '100%' }}>
            <GridCard
              title={employee.fullName} 
              subtitle={employee.employeeType} 
              fields={[
                { icon: HomeOutlined, label: t('Address'), value: employee.address || '-' },
                { icon: Call, label: t('Phone'), value: employee.phoneNumber || '-' },
                { icon: duotone.Pages, label: t('Passport'), value: employee.passportNumber || '-' },
                { icon: duotone.UserProfile, label: t('Manager'), value: employee.manager || 'No Manager' },
                { icon: Car, label: t('Vehicle'), value: employee.vehicle || '-' },
              ]} 
            />
            <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
              <Tooltip title={t('Edit Employee')}>
                <IconButton 
                  size="small" 
                  onClick={() => navigate(`/dashboard/edit-employee/${employee.employeeId || employee.id}`)}
                  sx={{
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      color: 'text.primary'
                    },
                    '&.Mui-disabled': { opacity: 0.7 }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Grid>
      ))}

      {employees.length > 0 && (
        <Grid size={12}>
          <Stack alignItems="center" py={2}>
            <Pagination 
              shape="rounded" 
              count={Math.ceil(employees.length / perPage)} 
              page={page}
              onChange={(_, newPage) => onPageChange(newPage)} 
            />
          </Stack>
        </Grid>
      )}
    </Grid>
  );
}
