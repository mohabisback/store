import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header.js';
import SupportEngine from './SupportEngine/SupportEngine';
import Footer from './footer/Footer.js';

const SharedLayout = () => {
  return (
    <>
      <Header />
      <main>
        <div className='main-overlay'></div>
        <Outlet />
      </main>{' '}
      {/* passes the children */}
      <SupportEngine />
      <Footer />
    </>
  );
};

export default SharedLayout;
