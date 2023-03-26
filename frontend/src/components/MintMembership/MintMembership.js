import React, { useState, useEffect } from 'react'

import Image from "next/image";
import styles from './MintMembership.module.css';


export default function MintMembership(props) {
    const {
        onClose,
        handleMintModal
    } = props


    const tmp_Membership = {
        "daoName": "Test DAO",
        "daoDescription": "A test DAO",
        "adminURI": "https://example.com/metadata/admin.json",
        "memberships": [
            {
                name: "Silver",
                symbol: "SLV",
                tokenURIs: "https://avatars.githubusercontent.com/u/77035304?s=280&v=4",
                expirationDates: "180",
                price: 0.5
            },
            {
                name: "Gold",
                symbol: "GLD",
                tokenURIs: "https://cdn.stamp.fyi/space/aave.eth?s=164",
                expirationDates: "365",
                price: 1
            },
            {
                name: "Diamond",
                symbol: "DIA",
                tokenURIs: "https://cdn.stamp.fyi/space/aave.eth?s=164",
                expirationDates: "365*5",
                price: 5
            }
        ]
    }
    const num_membership = Object.keys(tmp_Membership?.memberships).length
    console.log("check mint", tmp_Membership.memberships)

    const handleMint = (index) => {
        console.log("mint ", index)
    }
    return (
        <div id="myModal" className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.closeButton} onClick={onClose}>&times;</div>

                <div className={styles.cards}>
                    {tmp_Membership.memberships.map((tier, index) => {
                        return (
                            <div className={styles.card} >
                                <div style={{ fontSize: "1.8rem", marginTop: "20px" }}>{tier.name}</div>
                                <Image
                                    src={tier.tokenURIs}
                                    alt={tier.name}
                                    width={220}
                                    height={220}
                                    className="rounded-full overflow-clip  shadow-md"
                                />
                                <div style={{ display: "flex" }}>
                                    <div style={{ fontSize: "3rem" }}>{tier.expirationDates} </div>
                                    <div className={styles.days}>days</div>
                                </div>
                                <button
                                    id={index}
                                    className={styles.mintButton}
                                    style={{ display: "flex" }}
                                    onClick={() => handleMint(index)}
                                >
                                    <div>Mint</div>
                                    <div style={{ fontWeight: "300", fontStyle: "italic", fontSize: "1.5rem", paddingLeft: "5px", paddingRight: "10px" }}>{tier.price}</div>
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
