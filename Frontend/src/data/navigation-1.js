import duotone from '@/icons/duotone';
import Car from '@/icons/Car';
import Menu from '@/icons/Menu';
export const navigations = [
 {
     type: 'label',
     label: 'Dashboard'
   },{
      name: 'Finance',
      path: '/dashboard/finance',
      icon: duotone.Dashboard
   },{
     name: 'SEF',
     icon: duotone.Invoice,
     children: [{
     name: 'Incoming Invoices',
     path: '/dashboard/incoming-invoice'
   }, {
    name: 'Outgoing Invoices',
    path : '/dashboard/outgoing-invoice'
   }, {
    name: 'Create Invoice',
    path: '/dashboard/create-invoice'
     }]
   },{
    name: 'Travel reimbursement',
    icon: Menu,
    path: '/dashboard/expenses'
  },{
    name: 'Inspections',
    icon: duotone.DataTable,
    path: '/dashboard/inspections'
  }, /*{
      name: 'Statistics',
      path: '/dashboard/logistics',
      icon: duotone.Dashboard
   },*/
   {
      type: 'label',
      label: 'Management'
   },
   {
    name: 'Clients',
    icon: duotone.UserList,
    path: '/dashboard/client'
  },{
    name: 'Employees',
    icon: duotone.UserList,
    path: '/dashboard/employee'
  },{
    name: 'Vehicles',
    icon: Car,
    path: '/dashboard/vehicle'
  },{
    name: 'Users',
    icon: duotone.PersonCircleCheck,
    path: '/dashboard/management/users',
    access: 'admin'
  }
];