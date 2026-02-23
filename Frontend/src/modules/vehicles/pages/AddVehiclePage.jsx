import { AddVehicleView } from '../page-view';
import VehicleErrorBoundary from '../components/VehicleErrorBoundary';

export default function AddVehiclePage() {
  return (
    <VehicleErrorBoundary>
      <AddVehicleView />
    </VehicleErrorBoundary>
  );
}
