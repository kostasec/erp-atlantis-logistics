// MUI
import TableCell from '@mui/material/TableCell';
import { styled } from '@mui/material/styles'; // STYLED COMPONENT

const StyledTableCell = styled(TableCell)(({
  theme
}) => ({
  padding: '12px 16px',
  fontWeight: 500,
  fontSize: '0.875rem',
  borderTop: `1px dashed ${theme.palette.divider}`,
  verticalAlign: 'middle',
  lineHeight: '1.5rem',
  boxSizing: 'border-box',
  whiteSpace: 'nowrap', // ostaje u jednom redu
  // više ne skrivamo sadržaj – dozvoljavamo širenje ćelije
  textAlign: 'center',
  '&:first-of-type': {
    textAlign: 'left'
  }
})); // ==============================================================

// ==============================================================
export default function BodyTableCell({
  children,
  ...props
}) {
  return <StyledTableCell {...props}>{children}</StyledTableCell>;
}