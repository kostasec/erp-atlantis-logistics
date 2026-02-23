import { lazy, Suspense } from 'react';
import LayoutV1 from '@/layouts/layout-1';
import useSettings from '@/hooks/useSettings';
import { LoadingProgress } from '@/components/loader';
import AuthGuard from '@/components/auth/AuthGuard'; 

// DASHBOARD PAGES - Using module structure
const Finance = lazy(() => import('@/modules/finance').then(m => ({ default: m.FinanceDashboardPage })));
const Logistics = lazy(() => import('@/modules/logistics').then(m => ({ default: m.LogisticsDashboardPage })));

// CEV PAGES - Using module structure
const ClientView = lazy(() => import('@/modules/clients').then(m => ({ default: m.ListClientsPage })));
const AddClientView = lazy(() => import('@/modules/clients').then(m => ({ default: m.AddClientPage })));
const EditClientView = lazy(() => import('@/modules/clients').then(m => ({ default: m.EditClientPage })));
const EmployeeView = lazy(() => import('@/modules/employees').then(m => ({ default: m.ListEmployeesPage })));
const AddEmployeeView = lazy(() => import('@/modules/employees').then(m => ({ default: m.AddEmployeePage })));
const EditEmployeeView = lazy(() => import('@/modules/employees').then(m => ({ default: m.EditEmployeePage })));

// VEHICLE PAGES - Using new module structure
const VehicleView = lazy(() => import('@/modules/vehicles').then(m => ({ default: m.ListVehiclesPage })));
const AddVehicleView = lazy(() => import('@/modules/vehicles').then(m => ({ default: m.AddVehiclePage })));

// EXPENSES - Using module structure
const ExpensesView = lazy(() => import('@/modules/expenses').then(m => ({ default: m.ExpensesPage })));

// INSPECTIONS - Using module structure
const InspectionsView = lazy(() => import('@/modules/inspections').then(m => ({ default: m.InspectionsPage })));

// INVOICE PAGES - Using module structure
const IncomingInvoice = lazy(() => import('@/modules/invoices').then(m => ({ default: m.IncomingInvoicePage })));
const OutgoingInvoice = lazy(() => import('@/modules/invoices').then(m => ({ default: m.OutgoingInvoicePage })));
const InvoiceCreate = lazy(() => import('@/modules/invoices').then(m => ({ default: m.CreateInvoicePage })));
const DocumentDownload = lazy(() => import('@/modules/invoices').then(m => ({ default: m.DocumentDownloadPage })));

// MANAGEMENT PAGES
const UserManagement = lazy(() => import('@/pages/management/UserManagementPage'));
// PROFILE PAGE
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));

// AUTH GUARDS
import AdminRoute from '@/components/auth/AdminRoute';


const ActiveLayout = () => {
  const {
    settings
  } = useSettings();
  return (
    <Suspense fallback={<LoadingProgress />}>
      <LayoutV1 />
    </Suspense>
  );
};

export const DashboardRoutes = [{
  path: 'dashboard',
  element: <AuthGuard><ActiveLayout /></AuthGuard>,
  children: [{
    index: true,
    element: <Finance />
  }, {
    path: 'finance',
    element: <Finance />
  }, {
    path: 'logistics',
    element: <Logistics />
  },{
    path: 'add-employee',
    element: <AddEmployeeView />
  },{
    path: 'edit-employee/:id',
    element: <EditEmployeeView />
  },{
    path: 'employee',
    element: <EmployeeView />
  },{
    path: 'client',
    element: <ClientView />
  },{
    path: 'add-client',
    element: <AddClientView />
  },{
    path: 'edit-client/:taxId',
    element: <EditClientView />
  },{
    path: 'vehicle',
    element: <VehicleView />
  },{
    path: 'add-vehicle',
    element: <AddVehicleView />
  },{
    path: 'withdrawal',
    element: <></>
  },{
    path: 'expenses',
    element: <ExpensesView />
  },{
    path: 'inspections',
    element: <InspectionsView />
  },{
    path: 'incoming-invoice',
    element: <IncomingInvoice />
  }, {
    path: 'outgoing-invoice',
    element: <OutgoingInvoice />
  }, {
    path: 'create-invoice',
    element: <InvoiceCreate />
  }, {
    path: 'document-download/:type/:id?',
    element: <DocumentDownload />
  }, {
    path: 'management/users',
    element: <AdminRoute><UserManagement /></AdminRoute>
  }, {
    path: 'profile',
    element: <ProfilePage />
  }]
}];