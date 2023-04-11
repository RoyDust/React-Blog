import React, { } from 'react'
import type { NextPage } from 'next'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'

interface Props {
  children: React.ReactNode;
}

const Layout: NextPage<Props> = ({ children }) => {
  return (
    <div>
      <Navbar></Navbar>
      <main>{children}</main>
      <Footer></Footer>
    </div>
  )
}

export default Layout 