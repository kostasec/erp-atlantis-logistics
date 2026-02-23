import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import TablePagination from '@mui/material/TablePagination';

// Custom Components
import InspectionsHeader from '../components/inspections-list/InspectionsHeader';
import InspectionsTable from '../components/inspections-list/InspectionsTable';
import AddInspectionDialog from '../components/add-inspection/AddInspectionDialog';
import RenewInspectionDialog from '../components/inspections-list/RenewInspectionDialog';

// Services
import { vehicleInspection } from '../services/inspection';

// Utils
import {
  calculateStatus,
  calculateDaysUntilExpiry,
  filterInspectionsByCategory,
  transformInspectionData
} from '../utils/inspectionHelpers';

export default function InspectionsView() {
  // State Management
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Vehicle Inspections');

  // Categories
  const inspectionCategories = [
    'Vehicle Inspections',
    'Employee Inspections',
    'Other Inspections'
  ];

  // Fetch inspections from backend based on selected category
  useEffect(() => {
    const fetchInspections = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (selectedCategory === 'Vehicle Inspections') {
          response = await vehicleInspection.getVehicleInspection();
        } else if (selectedCategory === 'Employee Inspections') {
          response = await vehicleInspection.getEmployeeInspection();
        } else if (selectedCategory === 'Other Inspections') {
          response = await vehicleInspection.getInspectionOther();
        }
        
        if (response && response.success && response.data) {
          const transformedData = transformInspectionData(response.data, selectedCategory);
          setInspections(transformedData);
        } else {
          setInspections([]);
        }
      } catch (err) {
        console.error('Error fetching inspections:', err);
        setError(`Failed to load ${selectedCategory.toLowerCase()}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInspections();
  }, [selectedCategory]);

  // Event Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddInspection = (newInspection) => {
    const inspection = {
      id: inspections.length + 1,
      ...newInspection,
      status: calculateStatus(newInspection.nextInspection),
      daysUntilExpiry: calculateDaysUntilExpiry(newInspection.nextInspection)
    };
    setInspections(prev => [...prev, inspection]);
  };

  const handleRenewInspection = (updatedInspection) => {
    const renewedInspection = {
      ...updatedInspection,
      status: calculateStatus(updatedInspection.nextInspection),
      daysUntilExpiry: calculateDaysUntilExpiry(updatedInspection.nextInspection)
    };
    
    setInspections(prev => 
      prev.map(inspection => 
        inspection.id === renewedInspection.id ? renewedInspection : inspection
      )
    );
  };

  const handleDeleteInspection = (id) => {
    setInspections(prev => prev.filter(inspection => inspection.id !== id));
  };

  const handleOpenRenewDialog = (inspection) => {
    setSelectedInspection(inspection);
    setRenewDialogOpen(true);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(0);
  };

  // Filter and paginate inspections
  const filteredInspections = filterInspectionsByCategory(inspections, selectedCategory);
  // Prikaži sve inspekcije bez paginacije
  const paginatedInspections = filteredInspections;

  // Render
  return (
    <div className="pt-2 pb-4">
      <Card>
        <InspectionsHeader
          loading={loading}
          error={error}
          selectedCategory={selectedCategory}
          inspectionCategories={inspectionCategories}
          onCategoryChange={handleCategoryChange}
          onAddClick={() => setAddDialogOpen(true)}
        />

        {/* Inspections Table */}
        {!loading && (
          <InspectionsTable
            inspections={paginatedInspections}
            selectedCategory={selectedCategory}
            onRenewClick={handleOpenRenewDialog}
            onDeleteClick={handleDeleteInspection}
          />
        )}
      </Card>

      {/* Add Inspection Dialog */}
      <AddInspectionDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleAddInspection}
        selectedCategory={selectedCategory}
      />

      {/* Renew Inspection Dialog */}
      <RenewInspectionDialog
        open={renewDialogOpen}
        onClose={() => setRenewDialogOpen(false)}
        onSave={handleRenewInspection}
        inspection={selectedInspection}
      />
    </div>
  );
}