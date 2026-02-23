import { EditClientView } from '../page-view';
import ClientErrorBoundary from '../components/ClientErrorBoundary';

export default function EditClientPage() {
  return (
    <ClientErrorBoundary>
      <EditClientView />
    </ClientErrorBoundary>
  );
}