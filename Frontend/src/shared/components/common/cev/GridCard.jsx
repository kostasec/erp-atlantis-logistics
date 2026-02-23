import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';

const StyledRoot = styled('div')(({ theme }) => ({
  padding: '1.5rem',
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  '.icon': {
    fontSize: 16,
    color: theme.palette.grey[500]
  }
}));

const ExpandButton = styled(Button)(({ theme }) => ({
  padding: 0,
  textTransform: 'none',
  justifyContent: 'flex-start',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: 'transparent'
  }
}));

const StyledExpandIcon = styled(ExpandMoreIcon, {
  shouldForwardProp: (prop) => prop !== 'expanded'
})(({ expanded }) => ({
  fontSize: 16,
  marginLeft: 4,
  transition: 'transform 0.3s ease',
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'
}));

export default function EntityGridCard({
  title,
  subtitle,
  fields = [],
  contactPerson,
  contactIcons = {},
  onEdit
}) {
  const { t } = useTranslation();
  const [showContact, setShowContact] = useState(false);
  const [expanded, setExpanded] = useState({});

  const toggleContact = useCallback(() => {
    setShowContact(prev => !prev);
  }, []);

  const toggleField = useCallback((idx) => {
    setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));
  }, []);

  return (
    <StyledRoot>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <div>
          <Typography variant="body2" fontWeight={500}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" fontSize={12} color="grey.500">
              {subtitle}
            </Typography>
          )}
        </div>
        {onEdit && (
          <IconButton size="small" onClick={onEdit} sx={{ color: 'primary.main' }}>
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>

      {fields.map((field, idx) => (
        <div key={idx}>
          <Stack direction="row" alignItems="center" spacing={1} mt={idx === 0 ? 2 : 1}>
            {field.icon && <field.icon className="icon" />}
            {field.expandFields ? (
              <ExpandButton
                variant="text"
                size="small"
                onClick={() => toggleField(idx)}
              >
                <Typography variant="body2" color="grey.500" textAlign="left">
                  {field.label ? `${field.label}: ` : ''}{field.value}
                </Typography>
                <StyledExpandIcon expanded={!!expanded[idx]} />
              </ExpandButton>
            ) : (
              <Typography variant="body2" color="grey.500">
                {field.label ? `${field.label}: ` : ''}
                {field.value}
              </Typography>
            )}
          </Stack>
          {field.expandFields && (
            <Collapse in={!!expanded[idx]} timeout="auto" unmountOnExit>
              <Stack spacing={0.5} mt={0.5} ml={4}>
                {field.expandFields.map((ef, eIdx) => (
                  <Typography key={eIdx} variant="body2" color="text.secondary">
                    {ef.label ? `${ef.label}: ` : ''}{ef.value}
                  </Typography>
                ))}
              </Stack>
            </Collapse>
          )}
        </div>
      ))}

      {contactPerson && (
        <>
          <Button
            variant="text"
            size="small"
            sx={{ mt: 2, px: 0 }}
            onClick={toggleContact}
          >
            {showContact ? t('Hide Contact Person') : t('Show Contact Person')}
          </Button>

          <Collapse in={showContact} timeout="auto" unmountOnExit>
            <Stack spacing={0.5} mt={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                {contactIcons.name && <contactIcons.name className="icon" />}
                <Typography variant="body2" color="text.primary">
                  {contactPerson.name || '-'}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                {contactIcons.description && <contactIcons.description className="icon" />}
                <Typography variant="body2" color="text.secondary">
                  {contactPerson.description || '-'}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                {contactIcons.phoneNumber && <contactIcons.phoneNumber className="icon" />}
                <Typography variant="body2" color="text.primary">
                  {contactPerson.phoneNumber || '-'}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                {contactIcons.email && <contactIcons.email className="icon" />}
                <Typography variant="body2" color="text.primary">
                  {contactPerson.email || '-'}
                </Typography>
              </Stack>
            </Stack>
          </Collapse>
        </>
      )}
    </StyledRoot>
  );
}
