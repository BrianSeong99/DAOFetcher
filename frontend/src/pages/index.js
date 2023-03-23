import { Inter } from 'next/font/google'

import React, { useState, useEffect } from 'react'

import ConnectWallet from '../components/ConnectWallet/ConnectWallet.js';
import DAOlist from '../components/DAOlist/DAOlist.js';
import CreateFetcher from '../components/CreateFetcher/CreateFetcher.js';

import styles from '@/styles/Home.module.css'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const handleModal = () => {
    setShowModal(true)
  };
  return (
    <>
      {showModal &&
        <CreateFetcher
          onClose={() => setShowModal(false)}
        // show={showModal}
        />
      }
      <div class="container">
        {/* <div> */}
        <div class="sidebar-container">
          <DAOlist />
        </div>
        <div class="navbar-container">
          <button onClick={handleModal}>Register Your Server</button>
          <ConnectWallet />
        </div>
        <div class="content-container">
          <div>This is Content</div>
        </div>
      </div>

    </>
  )
}
