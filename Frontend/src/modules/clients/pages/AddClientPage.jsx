import { AddClientView } from '../page-view';
import ClientErrorBoundary from '../components/ClientErrorBoundary';

export default function AddClientPage() {
  return (
    <ClientErrorBoundary>
      <AddClientView />
    </ClientErrorBoundary>
  );
}
