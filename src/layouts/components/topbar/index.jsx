'use client';

import { useLayoutContext } from '@/context/useLayoutContext';


import ThemeToggler from '@/layouts/components/topbar/components/ThemeToggler';
import UserProfile from '@/layouts/components/topbar/components/UserProfile';
import Image from 'next/image';
import Link from 'next/link';
import { Container, FormControl } from 'react-bootstrap';
import { LuSearch } from 'react-icons/lu';
import { TbMenu4 } from 'react-icons/tb';
import logoDark from '@/assets/images/logo-black.png';
import logoSm from '@/assets/images/logo-sm.png';
import logo from '@/assets/images/logo.png';

import FullscreenToggle from '@/layouts/components/topbar/components/FullscreenToggle';

const Topbar = () => {
  const {
    sidenav,
    changeSideNavSize,
    showBackdrop
  } = useLayoutContext();
  const toggleSideNav = () => {
    const html = document.documentElement;
    const currentSize = html.getAttribute('data-sidenav-size');
    if (currentSize === 'offcanvas') {
      html.classList.toggle('sidebar-enable');
      showBackdrop();
    } else if (sidenav.size === 'compact') {
      changeSideNavSize(currentSize === 'compact' ? 'condensed' : 'compact', false);
    } else {
      changeSideNavSize(currentSize === 'condensed' ? 'default' : 'condensed');
    }
  };
  return <header className="app-topbar">
      <Container fluid className="topbar-menu">
        <div className="d-flex align-items-center gap-2">
          <div className="logo-topbar">
            <Link href="/" className="logo-light">
              <span className="logo-lg">
                <Image src={logo.src} alt="logo" width={94.3} height={22} />
              </span>
              <span className="logo-sm">
                <Image src={logoSm.src} alt="small logo" width={30.55} height={26} />
              </span>
            </Link>

            <Link href="/" className="logo-dark">
              <span className="logo-lg">
                <Image src={logoDark.src} alt="dark logo" width={94.3} height={22} />
              </span>
              <span className="logo-sm">
                <Image src={logoSm.src} alt="small logo" width={30.55} height={26} />
              </span>
            </Link>
          </div>

          <button onClick={toggleSideNav} className="sidenav-toggle-button btn btn-default btn-icon">
            <TbMenu4 className="fs-22" />
          </button>

       
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* <div className="app-search d-none d-xl-flex me-2">
            <FormControl type="search" className="topbar-search rounded-pill" name="search" placeholder="Quick Search..." />
            <LuSearch className="app-search-icon text-muted" />
          </div> */}

          

          

         

          <ThemeToggler />

          <FullscreenToggle />

         

          <UserProfile />

        
        </div>
      </Container>
    </header>;
};
export default Topbar;