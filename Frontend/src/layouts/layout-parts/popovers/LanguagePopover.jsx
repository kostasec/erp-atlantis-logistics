import { Fragment, useCallback, useMemo, useRef, useState } from 'react'; // MUI

import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton'; // REACT TRANSLATION
import { styled, alpha } from '@mui/material/styles'; // REACT TRANSLATION

import { useTranslation } from 'react-i18next'; // STYLED COMPONENTS

const LANGUAGE_OPTIONS = {
  en: {
    label: 'English',
    shortLabel: 'ENG'
  },
  ser: {
    label: 'Serbian',
    shortLabel: 'SER'
  }
};

const LanguageTag = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 14px',
  borderRadius: 999,
  fontWeight: 600,
  letterSpacing: 1,
  fontSize: 12,
  textTransform: 'uppercase',
  minWidth: 56,
  background: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 100%)' : 'linear-gradient(135deg, rgba(37,99,235,0.16) 0%, rgba(37,99,235,0.08) 100%)',
  color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.primary[700],
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.28)' : alpha(theme.palette.primary.main, 0.35)}`,
  boxShadow: 'none',
  transition: 'transform 150ms ease',
  backdropFilter: 'blur(8px)',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: 'none'
  }
}));
export default function LanguagePopover() {
  const {
    i18n
  } = useTranslation();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleChangeLanguage = useCallback(language => {
    i18n.changeLanguage(language);
    setOpen(false);
  }, [i18n]);
  const selectedLanguage = useMemo(() => LANGUAGE_OPTIONS[i18n.language] ?? LANGUAGE_OPTIONS.en, [i18n.language]);
  return <Fragment>
      <IconButton 
        onClick={handleOpen} 
        ref={anchorRef} 
        sx={{ 
          p: 0, 
          borderRadius: '999px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        }}
      >
        <LanguageTag>{selectedLanguage?.shortLabel ?? selectedLanguage?.label}</LanguageTag>
      </IconButton>

      <Popover keepMounted open={open} onClose={handleClose} anchorEl={anchorRef.current} anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center'
    }} slotProps={{
      paper: {
        sx: {
          width: 110,
          paddingBlock: 1
        }
      }
    }}>
        {Object.entries(LANGUAGE_OPTIONS).map(([lang, {
        label
      }]) => <MenuItem key={label} onClick={() => handleChangeLanguage(lang)}>
            {label}
          </MenuItem>)}
      </Popover>
    </Fragment>;
}