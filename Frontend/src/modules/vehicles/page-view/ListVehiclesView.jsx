import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { VehicleHeader, VehicleGrid } from '../components/list-vehicles';
import { EditCompositionDialog, EditTruckDialog, EditTrailerDialog, EditCarDialog } from '../components/edit-vehicle';
import vehicleService from '../services/vehicleService';

export default function ListVehiclesView() {
  const { t } = useTranslation();
  const [perPage] = useState(8);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Compositions');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editComposition, setEditComposition] = useState(null);
  const [editTruck, setEditTruck] = useState(null);
  const [editTrailer, setEditTrailer] = useState(null);
  const [editCar, setEditCar] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await vehicleService.getAllVehicles();
        
        if (result.success) {
          // Filtriraj vozila na osnovu izabrane kategorije
          let vehiclesToSet = [];
          
          switch (selectedCategory) {
            case 'Compositions':
              vehiclesToSet = result.data.compositions || [];
              break;
            case 'Trucks':
              vehiclesToSet = result.data.trucks || [];
              break;
            case 'Trailers':
              vehiclesToSet = result.data.trailers || [];
              break;
            case 'Cars':
              vehiclesToSet = result.data.cars || [];
              break;
            default:
              vehicles
          }
          
          console.log(`Loading ${selectedCategory}:`, vehiclesToSet);
          setItems(vehiclesToSet);
          
          // Učitaj trucks i trailers za edit dialog
          const truckList = (result.data.trucks || []).map(t => ({
            value: t.vehicleId,
            label: t.registrationTag
          }));
          const trailerList = (result.data.trailers || []).map(t => ({
            value: t.vehicleId,
            label: t.registrationTag
          }));
          setTrucks(truckList);
          setTrailers(trailerList);
        } else {
          setError('Failed to fetch vehicles');
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [selectedCategory]); // Dodaj selectedCategory kao dependency

  const handleCategoryChange = (category) => {
    console.log('Changing category to:', category);
    setSelectedCategory(category);
    setPage(1);
  };

  const handleAddVehicle = () => {
    window.location.href = '/dashboard/add-vehicle';
  };

  const handleEditVehicle = (vehicle, type) => {
    if (type === 'composition') {
      setEditComposition(vehicle);
    } else if (type === 'truck') {
      setEditTruck(vehicle);
    } else if (type === 'trailer') {
      setEditTrailer(vehicle);
    } else if (type === 'car') {
      setEditCar(vehicle);
    }
  };

  const handleEditClose = () => {
    setEditComposition(null);
    setEditTruck(null);
    setEditTrailer(null);
    setEditCar(null);
  };

  const handleEditSuccess = () => {
    // Reload vehicles
    window.location.reload();
  };

  const hasItems = items.length > 0;
  console.log('Selected category:', selectedCategory);
  console.log('Items count:', items.length);

  if (loading) {
    return (
      <div className="pt-2 pb-4">
        <Card sx={{ px: 3, py: 2 }}>
          <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
            {t('Loading vehicles...')}
          </Typography>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-2 pb-4">
        <Card sx={{ px: 3, py: 2 }}>
          <Typography variant="body2" color="error" textAlign="center" py={4}>
            {t('Error')}: {error}
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ px: 3, py: 2 }}>
        <VehicleHeader
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onAddVehicle={handleAddVehicle}
        />

        {hasItems ? (
          <VehicleGrid
            vehicles={items}
            page={page}
            perPage={perPage}
            onPageChange={setPage}
            onEditVehicle={handleEditVehicle}
          />
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
            {t('No vehicles available yet.')}
          </Typography>
        )}
        
        {/* Edit Composition Dialog */}
        <EditCompositionDialog
          open={!!editComposition}
          onClose={handleEditClose}
          composition={editComposition}
          trucks={trucks}
          trailers={trailers}
          onSuccess={handleEditSuccess}
        />

        {/* Edit Truck Dialog */}
        <EditTruckDialog
          open={!!editTruck}
          onClose={handleEditClose}
          truck={editTruck}
          onSuccess={handleEditSuccess}
        />

        {/* Edit Trailer Dialog */}
        <EditTrailerDialog
          open={!!editTrailer}
          onClose={handleEditClose}
          trailer={editTrailer}
          onSuccess={handleEditSuccess}
        />

        {/* Edit Car Dialog */}
        <EditCarDialog
          open={!!editCar}
          onClose={handleEditClose}
          car={editCar}
          onSuccess={handleEditSuccess}
        />
      </Card>
    </div>
  );
}