import { use, useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import { SettingsContext } from '@/contexts/settingsContext';
import ThemeIcon from '@/icons/ThemeIcon';
import LanguagePopover from '@/layouts/layout-parts/popovers/LanguagePopover';
import ProfilePopover from '@/layouts/layout-parts/popovers/ProfilePopover';
import { DashboardHeaderRoot, StyledToolBar } from '@/layouts/layout-1/styles';

export default function DashboardHeader() {
  const { settings, saveSettings } = use(SettingsContext);
  
  // State for hiding header on scroll
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        // Scrolling up or at top of page - show header
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold - hide header
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Add throttling to improve performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [lastScrollY]);

  const handleChangeTheme = value => {
    saveSettings({
      ...settings,
      theme: value
    });
  };

  return (
    <DashboardHeaderRoot 
      position="sticky" 
      sx={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: theme => theme.zIndex.appBar
      }}
    >
      <StyledToolBar sx={{ justifyContent: 'flex-end' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton 
            onClick={() => handleChangeTheme(settings.theme === 'light' ? 'dark' : 'light')}
            sx={{ 
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
            }}
          >
            <ThemeIcon />
          </IconButton> 
          <LanguagePopover />
          <ProfilePopover />
        </Stack>
      </StyledToolBar>
    </DashboardHeaderRoot>
  );
}