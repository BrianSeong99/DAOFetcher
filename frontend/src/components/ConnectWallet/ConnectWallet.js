import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';

import Web3 from 'web3'

// import styles from './ConnectWallet.less'

export default function ConnectWallet() {

    const [web3, setWeb3] = useState();
    const [account, setAccount] = useState('');
    const [showMenu, setShowMenu] = useState(false);

    const router = useRouter();
    useEffect(() => {
        const connect = async () => {
            // Check if MetaMask is installed
            if (window.ethereum) {
                // Connect to MetaMask
                try {
                    console.log("in refresh useeffect")
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const web3 = new Web3(window.ethereum);
                    setWeb3(web3);
                    const accounts = await web3.eth.getAccounts();
                    console.log("in refresh useeffect accounts", accounts)
                    setAccount(accounts[0]);
                } catch (err) {
                    console.error(err);
                }
            } else {
                console.error('Please install MetaMask!');
            }
        };
        connect();
        addWalletListener();
    }, []);

    const handleConnect = async () => {
        console.log("in handle connect")
        if (window.ethereum) {
            try {
                console.log("in handle connect 00")
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                // const web3 = new Web3(window.ethereum);
                // setWeb3(web3);
                // const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
            } catch (err) {
                console.error(err);
            }
        }
    };
    const addWalletListener = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
          window.ethereum.on("accountsChanged", (accounts) => {
            setAccount(accounts[0]);
            console.log(accounts[0]);
          });
        } else {
          /* MetaMask is not installed */
          setAccount("");
          console.log("Please install MetaMask");
        }
      };

    // const handleDisconnect = async () => {
    //     try {
    //         await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
    //         setAccount(null);
    //         toggleMenu();
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    const toggleMenu = () => {
        setShowMenu(!showMenu)
    };


    // Function that handles the login with MetaMask
    // const handleMetaMaskLogin = () => {
    //     // TODO: Add logic to authenticate user with MetaMask

    //     // Redirect to home page on successful login
    //     router.push('/home');
    // };

    return (
        <div>
            <div>
                <button onClick={handleConnect}>
                    {account ? `${account.substring(0, 4)}...${account.substring(38)}` : 'Connect Wallet'}
                </button>
                {/* {account && showMenu && (
                    <div >
                        <button onClick={handleDisconnect}>Disconnect</button>
                    </div>
                )} */}
            </div>
            {/* <div>MetaMask Login</div>
            {web3 && (
                !account ? (
                    <button className={styles.button} onClick={onConnect}>Connect</button>
                ) : (
                    <button className={styles.button} onClick={onLogin}>{account}</button>
                )
            )} */}
            {/* <button onClick={handleMetaMaskLogin}>Login with MetaMask</button>
            <button >Login with IntMax</button> */}
        </div>
    );
}
