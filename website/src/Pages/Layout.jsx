import React from 'react'
import { Outlet } from 'react-router'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

function Layout() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "90px" }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default Layout