import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack'; // CUSTOM PAGE SECTION COMPONENTS

import CompanyProgress from '../components/CompanyProgress';
import TopSellingCategories from '../components/TopSellingCategories';
export default function LogisticsPageView() {
  return <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        {
        /* LAST MONTH SHIPMENT CARD */
      }
        <Grid size={{
        lg: 5,
        xs: 12
      }}>
         
        </Grid>

        {
        /* SHIPPING ORDERS CHART AND QUICK GUIDE CARD */
      }
        <Grid size={{
        lg: 7,
        xs: 12
      }}>
          <Stack spacing={3}>
            
          </Stack>
        </Grid>

        {
        /* COMPANY PROGRESS CARD */
      }
        <Grid size={{
        md: 12,
        xs: 12
      }}>
          <CompanyProgress />
        </Grid>

        {
        /* ROLE MANAGEMENT CARD  */
      }
        <Grid size={{
        md: 4,
        xs: 12
      }}>
          
        </Grid>

        {
        /* OUR TRANSPORTATION CARD */
      }
        <Grid size={{
        md: 4,
        xs: 12
      }}>
          
        </Grid>

        {
        /* TOP SELLING CATEGORIES CARD */
      }
        <Grid size={{
        md: 12,
        xs: 12
      }}>
          <TopSellingCategories />
        </Grid>

        {
        /* VISITS BY COUNTRY CARD */
      }
        <Grid size={{
        md: 4,
        xs: 12
      }}>
          
        </Grid>

        {
        /* SHIPMENT HISTORY CARD */
      }
        <Grid size={{
        md: 8,
        xs: 12
      }}>
          
        </Grid>

      </Grid>
    </div>;
}