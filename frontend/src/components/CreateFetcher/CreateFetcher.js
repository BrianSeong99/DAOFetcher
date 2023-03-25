import React, { useState, useEffect } from 'react'

import Image from "next/image";
import styles from './CreateFetcher.module.css';

import ConnectDiscord from '@/utils/ConnectDiscord/ConnectDiscord.js';

export default function CreateFetcher(props) {
    const {
        onClose,
        code,
        discordConnected
    } = props
    // const [accessToken, setAccessToken] = useState("");
    const [adminGuildsList, setAdminGuildsList] = useState({});

    const DISCORD_IMG_BASEURL = 'https://cdn.discordapp.com/'

    useEffect(() => {
        const tokenEndpoint = 'https://discord.com/api/oauth2/token';
        const redirectUri = 'http://localhost:3000/?show=true&'; // Replace with your redirect URI
        const clientId = '1088663386327351356'; // Replace with your client ID
        const clientSecret = 'IKW7IpUU9grNs0BEZAlOhj49Qoh1dJbe';
        const requestBody = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
        });
        fetch(tokenEndpoint, {
            method: 'POST',
            body: requestBody,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log("checking response data", data)
                // setAccessToken(data.access_token)
                const accessToken = data.access_token;
                const tokenType = data.token_type;
                const expiresIn = data.expires_in;
                const refreshToken = data.refresh_token;
                // Use the access token to make requests to the Discord API
                // ...
                console.log("checking response accessToken", data.access_token, accessToken)

                fetch('https://discord.com/api/v9/users/@me/guilds', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                })
                    .then(response => response.json())
                    .then(guilds => {
                        // Process the list of guilds that the user is an admin of
                        const adminGuilds = guilds.filter(guild => guild.owner);
                        setAdminGuildsList(convertGuildInfo(adminGuilds))
                        console.log("here are the adminguilds", guilds, adminGuilds, adminGuildsList);
                    })
                    .catch(error => {
                        console.error('Error fetching guilds:', error);
                    });
            })
            .catch(error => {
                console.error('Error exchanging authorization code for access token:', error);
            });
    }, []);
    const convertGuildInfo = (adminGuilds) => {
        let decoded_guilds = []
        adminGuilds.map((adminguild) => {
            let tmp = {
                icon_url: DISCORD_IMG_BASEURL + `icons/${adminguild.id}/${adminguild.icon}.png`,
                dao_name: adminguild.name
            }
            decoded_guilds.push(tmp)
        })
        return decoded_guilds
    }
    console.log("here are the adminguilds 00", adminGuildsList);
    return (
        <div id="myModal" className={styles.modal}>
            <div class="modal-content">
                <div className={styles.closeButton} onClick={onClose}>&times;</div>

                <div className={styles.step}>
                    <div>
                        <div className={styles.circle}>1</div>
                    </div>
                    <div>
                        <div className={styles.title}>Connect to your discord account</div>
                        <div className={styles.caption}><ConnectDiscord discordConnected={discordConnected}/></div>
                    </div>
                </div>
                <div className={styles.step}>
                    <div>
                        <div className={styles.circle}>2</div>
                    </div>
                    <div>
                        <div className={styles.title}>Choose discord fetcher that you wish to create</div>
                        <div className={styles.caption}>
                            {Object.keys(adminGuildsList).length !== 0 &&
                                adminGuildsList.map((guild) => {
                                    return (
                                        <div className={styles.iconDisplay}>
                                            <Image
                                                className={styles.circularIcon}
                                                src={guild.icon_url}
                                                alt={guild.dao_name}
                                                width={50}
                                                height={50}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.step}>
                    <div>
                        <div className={styles.circle}>3</div>
                    </div>
                    <div>
                        <div className={styles.title}>Define the membership tiers</div>
                        <div className={styles.caption}>Select number of tiers </div>
                        <div className={styles.caption}>Set name for first tier</div>
                        <div className={styles.caption}>Set symbol for first tier</div>
                        <div className={styles.caption}>Set duration for first tier </div>
                        <div className={styles.caption}>Set price for first tier</div>

                    </div>
                </div>
                <div >
                    <button className={styles.createButton}>Create</button>
                </div>
            </div>
        </div>
    );
}
