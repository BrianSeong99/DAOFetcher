import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers';

import Image from "next/image";
import styles from './MintMembership.module.css';
import getDAOMemberships from "../../abis/getDAOMemberships";
import mintMembership from "../../abis/mintMembership";
import { useServerList } from '../../utils/ServerListContext';


export default function MintMembership(props) {
    const {
        onClose, mintServerChoice
    } = props

    const [daoMemberships, setDaoMemberships] = useState([]);
    const { serverList, handleServerListChange } = useServerList();
    const [currentDAOAddr, setCurrentDAOAddr] = useState();

    const handleDAOMembershipLists = async () => {
        const mintingServer = serverList.filter(ele => ele.daoId === mintServerChoice);
        console.log("mintingServer", mintingServer);
        setCurrentDAOAddr(mintingServer[0].DAOServerAddress);
        const response = await getDAOMemberships(mintingServer[0].DAOServerAddress);
        setDaoMemberships(response.slice(2));
    }

    useEffect(() => {
        handleDAOMembershipLists();
    }, [])

    const handleMint = async (index, price) => {
        console.log("mint ", index)
        const response = await mintMembership(currentDAOAddr, index+2, price);
        console.log(response);
    }
    return (
        <div id="myModal" className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.closeButton} onClick={onClose}>&times;</div>

                <div className={styles.cards}>
                    {Array.isArray(daoMemberships) && daoMemberships.length != 0 && daoMemberships.map((membership, index) => {
                        return (
                            <div className={styles.card} key={index}>
                                <div style={{ fontSize: "1.8rem", marginTop: "20px" }}>{membership.name}</div>
                                <Image
                                    src={membership.tokenURI}
                                    alt={membership.name}
                                    width={220}
                                    height={220}
                                    className="rounded-full overflow-clip shadow-md"
                                />
                                <div style={{ display: "flex" }}>
                                    <div style={{ fontSize: "3rem" }}>{membership.duration.toString()} </div>
                                    <div className={styles.days}>days</div>
                                </div>
                                <button
                                    id={index}
                                    className="border border-primary text-primary hover:bg-primary/10 px-6 py-2 scale-shadow-interactable rounded-full"
                                    // className={styles.mintButton}
                                    style={{display:"flex", alignItems:"center"}}
                                    onClick={() => handleMint(index, membership.price)}
                                >
                                    <div>Mint</div>
                                    <div style={{ fontWeight: "300", fontStyle: "italic", fontSize: "1.5rem", paddingLeft: "5px", paddingRight: "10px" }}>{ethers.utils.formatEther(membership.price)}</div>
                                    <div>ETH</div>
                                </button>
                            </div>
                        )

                    })}
                </div>


            </div>
        </div>
    );
}
