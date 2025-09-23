'use client';


import Footer from '@/layouts/components/footer';
import Topbar from '@/layouts/components/topbar';
import dynamic from 'next/dynamic';
import { Fragment } from 'react';
const ResponsiveNavbar = dynamic(() => import('@/layouts/components/responsive-navbar'), {
  ssr: false
});
const HorizontalLayout = ({
  children
}) => {
  return <Fragment>
      <div className="wrapper">
        <Topbar />

        <ResponsiveNavbar />

        <div className="content-page">
          {children}

          <Footer />
        </div>
      </div>

      <Customizer />
    </Fragment>;
};
export default HorizontalLayout;