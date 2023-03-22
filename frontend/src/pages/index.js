import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'

import ConnectWallet from '../components/ConnectWallet/ConnectWallet.js';
import DAOlist from '../components/DAOlist/DAOlist.js';

import styles from '@/styles/Home.module.css'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>


      <div class="container">
        {/* <div> */}
        <div class="sidebar-container">
          <DAOlist />
        </div>
        <div class="navbar-container">
          <ConnectWallet />
        </div>
        <div class="content-container">
          <div>This is Content</div>
        </div>
      </div>

    </>
  )
}
