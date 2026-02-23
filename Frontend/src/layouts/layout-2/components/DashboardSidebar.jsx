import { Fragment } from 'react'; // MUI

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles'; // CUSTOM COMPONENTS

import Scrollbar from '@/components/scrollbar'; // CUSTOM DEFINED HOOK

import useLayout from '@/layouts/layout-2/context/useLayout'; // CUSTOM NAVIGATION DATA

import { navigations as allNavigations } from '@/data/navigation-1';
import { useContext, useMemo } from 'react';
import { JWTContext } from '@/contexts/jwtContext'; // STYLED COMPONENTS

import { Dot, LogoBox, MainMenu, SubMenuItem, NavItemButton, SecondarySideBar, MobileSidebarWrapper } from '@/layouts/layout-2/styles';
import { useTranslation } from 'react-i18next';
export default function LayoutSideBar() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useContext(JWTContext);
  const {
    active,
    downMd,
    categoryMenus,
    activeSubMenuItem,
    showMobileSideBar,
    openSecondarySideBar,
    handleSubMenuItem,
    handleActiveMainMenu,
    handleCloseMobileSidebar
  } = useLayout();

  // Filter navigations based on user role
  const navigation = useMemo(() => {
    return allNavigations.filter(nav => !nav.access || nav.access === user?.role?.toLowerCase());
  }, [user?.role]);
  const logoSrc = theme.palette.mode === 'dark' ? '/static/logo/logo-white.png' : '/static/logo/logo.png';
  const MAIN_SIDEBAR_CONTENT = <Fragment>
      {
      /* SIDEBAR LOGO */
    }
      <LogoBox>
        <Box component="img" src={logoSrc} alt="logo" sx={{ width: 86, height: 'auto' }} />
      </LogoBox>

      {
      /* NAVIGATION LIST WITH ICON */
    }
      <Scrollbar sx={{
      maxHeight: 'calc(100% - 50px)',
      pb: 3
    }}>
        <div className="navigation-list">
          {navigation.map((nav, index) => <Tooltip title={t(nav.name)} placement="right" key={index}>
              <NavItemButton disableRipple active={active === nav.name} onClick={handleActiveMainMenu(nav)}>
                <nav.Icon />
              </NavItemButton>
            </Tooltip>)}
        </div>
      </Scrollbar>
    </Fragment>;
  const SECONDARY_SIDEBAR_CONTENT = <Fragment>
      <Typography variant="body1" sx={{
      fontWeight: 500,
      color: 'primary.main',
      padding: '1rem 1.2rem'
    }}>
  {active ? t(active) : ''}
      </Typography>

      <Scrollbar sx={{
      pb: 3
    }}>
        {categoryMenus.map(({
        name,
        path
      }) => <SubMenuItem key={name} active={path === activeSubMenuItem} onClick={() => handleSubMenuItem(path)}>
            <Dot className="dot" />
            <Typography variant="body2" fontSize={13} className="title" fontWeight={500}>
              {t(name)}
            </Typography>
          </SubMenuItem>)}
      </Scrollbar>
    </Fragment>;
  /* SHOW ONLY SMALLER DEVICE - BY DEFAULT IS HIDDEN */

  if (downMd) {
    return <MobileSidebarWrapper show={showMobileSideBar}>
        <div className="main-list">{MAIN_SIDEBAR_CONTENT}</div>

        {showMobileSideBar && <div onClick={handleCloseMobileSidebar} className="backdrop" />}

        {categoryMenus.length > 0 ? <div className="secondary-list-wrapper">
            <div className="list-inner">{SECONDARY_SIDEBAR_CONTENT}</div>
          </div> : null}
      </MobileSidebarWrapper>;
  }

  return <Fragment>
      <MainMenu>{MAIN_SIDEBAR_CONTENT}</MainMenu>
      <SecondarySideBar show={openSecondarySideBar}>{SECONDARY_SIDEBAR_CONTENT}</SecondarySideBar>
    </Fragment>;
}