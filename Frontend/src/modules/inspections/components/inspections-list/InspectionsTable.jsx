import React, { useCallback } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { BodyTableCell, HeadTableCell } from '@/shared/components/common';
import Scrollbar from '@/components/scrollbar';
import InspectionTableRow from './InspectionTableRow';

export default function InspectionsTable({
  inspections,
  selectedCategory,
  onRenewClick,
  onDeleteClick
}) {
  const getColor = useCallback((index) => {
    return index % 2 === 1 ? 'action.selected' : 'transparent';
  }, []);

  return (
    <Scrollbar>
      <Table sx={{ width: '100%', tableLayout: 'auto' }}>
        <TableHead>
          <TableRow>
            {selectedCategory !== 'Other Inspections' && (
              <HeadTableCell>
                {selectedCategory === 'Employee Inspections' ? 'Employee' : 'Vehicle'}
              </HeadTableCell>
            )}
            <HeadTableCell>Inspection Type</HeadTableCell>
            <HeadTableCell>Status</HeadTableCell>
            <HeadTableCell>Last Inspection</HeadTableCell>
            <HeadTableCell>Next Inspection</HeadTableCell>
            <HeadTableCell>Days Until Expiry</HeadTableCell>
            <HeadTableCell>Actions</HeadTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {inspections.map((inspection, index) => (
            <InspectionTableRow
              key={inspection.id}
              inspection={inspection}
              selectedCategory={selectedCategory}
              backgroundColor={getColor(index)}
              onRenewClick={onRenewClick}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </TableBody>
      </Table>
    </Scrollbar>
  );
}
