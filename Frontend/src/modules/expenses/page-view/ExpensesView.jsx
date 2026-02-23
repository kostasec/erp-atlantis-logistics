import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AddPaySlip from '../components/AddPaySlip';
import PaymentDialog from '../components/Payment';

import ExpensesHeader from '../components/expenses-list/ExpensesHeader';
import ExpensesActions from '../components/expenses-list/ExpensesActions';
import PaySlipList from '../components/expenses-list/PaySlipList';

// Services
import { payslipService } from '../services/payslip';

export default function ExpensesView() {
  const [selectedDriver, setselectedDriver] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paySlips, setPaySlips] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rsdTransactions, setRsdTransactions] = useState([]);
  const [eurTransactions, setEurTransactions] = useState([]);

  // Fetch payslips and transactions from backend
  useEffect(() => {
    const fetchPaySlips = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [groupedResponse, driversResponse, rsdTransResponse, eurTransResponse] = await Promise.all([
          payslipService.getGroupedPaySlips(),
          payslipService.getDriverNames(),
          payslipService.getTransactionRSD(),
          payslipService.getTransactionEUR()
        ]);

        if (groupedResponse.success) {
          // Format dates for display
          const formattedPaySlips = {};
          
          Object.keys(groupedResponse.data).forEach(employee => {
            formattedPaySlips[employee] = groupedResponse.data[employee].map(payslip => ({
              ...payslip,
              transactionDate: new Intl.DateTimeFormat('sr-RS', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              }).format(new Date(payslip.transactionDate)),
              issueDate: new Intl.DateTimeFormat('sr-RS', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              }).format(new Date(payslip.issueDate))
            }));
          });
          
          setPaySlips(formattedPaySlips);
          
          // Set drivers list from API
          if (driversResponse.success) {
            const driverNames = driversResponse.data.map(driver => driver.firstName);
            setDrivers(driverNames);
            
            // Set first driver as selected
            if (driverNames.length > 0) {
              setselectedDriver(driverNames[0]);
            }
          }

          // Set transactions
          if (rsdTransResponse.success) {
            setRsdTransactions(rsdTransResponse.data);
          }
          if (eurTransResponse.success) {
            setEurTransactions(eurTransResponse.data);
          }
        }
      } catch (err) {
        console.error('Error fetching payslips:', err);
        setError('Failed to load payslips');
      } finally {
        setLoading(false);
      }
    };

    fetchPaySlips();
  }, []);

  // Event handlers
  const handleDriverSelect = (selectedButton) => {
    setselectedDriver(selectedButton);
    setPage(0); // Reset pagination when switching drivers
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddExpense = (newExpense) => {
    setPaySlips(prev => [newExpense, ...prev]);
    console.log('Added Pay Slip:', newExpense);
  };

  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // Get expense data for selected driver
  let expenseData = [];
  if (selectedDriver) {
    expenseData = paySlips[selectedDriver] || [];
  }

  // Calculate balance for statistics (Transactions - PaySlips for ALL employees)
  const calculateBalance = () => {
    // Calculate total RSD from all transactions
    const totalRSDTransactions = rsdTransactions.reduce((sum, trans) => {
      return sum + Number(trans.amountRSD || 0);
    }, 0);

    // Calculate total EUR from all transactions
    const totalEURTransactions = eurTransactions.reduce((sum, trans) => {
      return sum + Number(trans.amountEUR || 0);
    }, 0);

    // Calculate total RSD payslips for ALL employees
    let totalRSDPayslips = 0;
    Object.keys(paySlips).forEach(employee => {
      const employeePayslips = paySlips[employee];
      totalRSDPayslips += employeePayslips.reduce((sum, exp) => {
        return sum + Number(exp.domesticAllowance || 0) + Number(exp.domesticExpenses || 0);
      }, 0);
    });

    // Calculate total EUR payslips for ALL employees
    let totalEURPayslips = 0;
    Object.keys(paySlips).forEach(employee => {
      const employeePayslips = paySlips[employee];
      totalEURPayslips += employeePayslips.reduce((sum, exp) => {
        return sum + Number(exp.inoAllowance || 0) + Number(exp.inoExpenses || 0);
      }, 0);
    });

    // Calculate balance (Transactions - Payslips)
    const rsdBalance = totalRSDTransactions - totalRSDPayslips;
    const eurBalance = totalEURTransactions - totalEURPayslips;
    
    return { rsdTotal: rsdBalance, eurTotal: eurBalance };
  };

  const { rsdTotal, eurTotal } = calculateBalance();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ px: 2, py: 2 }}>
        {/* Header with driver selection, action buttons, and statistics */}
        <ExpensesHeader
          drivers={drivers}
          selectedDriver={selectedDriver}
          onDriverSelect={handleDriverSelect}
          onPaymentClick={() => setIsPaymentOpen(true)}
          rsdBalance={rsdTotal}
          eurBalance={eurTotal}
        />

        {/* Add Pay Slip button */}
        <ExpensesActions
          selectedDriver={selectedDriver}
          onAddPaySlip={handleOpenDialog}
        />

        {/* Pay Slip List */}
        {selectedDriver && (
          <PaySlipList
            expenseData={expenseData}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}

        {/* Dialogs */}
        <AddPaySlip 
          open={isDialogOpen}
          onClose={handleCloseDialog}
          onAdd={handleAddExpense}
        />
        
        <PaymentDialog 
          open={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
        />
      </Card>
    </div>
  );
}