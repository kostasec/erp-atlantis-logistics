import { AddEmployeeView } from '../page-view';
import EmployeeErrorBoundary from '../components/EmployeeErrorBoundary';

export default function AddEmployeePage() {
  return (
    <EmployeeErrorBoundary>
      <AddEmployeeView />
    </EmployeeErrorBoundary>
  );
}
