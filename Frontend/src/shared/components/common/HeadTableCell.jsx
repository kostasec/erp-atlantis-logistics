// MUI
import TableCell from '@mui/material/TableCell';
import { styled } from '@mui/material/styles'; // STYLED COMPONENT

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '12px 16px',
  fontWeight: 600,
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  borderBottom: `2px solid ${theme.palette.divider}`,
  verticalAlign: 'middle',
  lineHeight: '1.5rem',
  boxSizing: 'border-box',
  textAlign: 'center',
  '&:first-of-type': {
    textAlign: 'left'
  }
})); // ==============================================================

// ==============================================================
export default function HeadTableCell({
  children,
  ...props
}) {
  return <StyledTableCell {...props}>{children}</StyledTableCell>;
}