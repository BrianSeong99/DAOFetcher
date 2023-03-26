import React, { useState, useEffect } from 'react'


import Image from "next/image";
import styles from './CreateFetcher.module.css';

import ConnectDiscord from '@/utils/ConnectDiscord/ConnectDiscord.js';
import InputBox from '@/components/InputBox/InputBox.js';

import createDAOServer from '@/abis/createDAOServer.js';

export default function CreateFetcher(props) {
    const {
        onClose,
        code,
        discordConnected,
    } = props;
    // const [accessToken, setAccessToken] = useState("");
    const [adminGuildsList, setAdminGuildsList] = useState({});
    const [serverSelection, setServerSelection] = useState(-1);
    const [selectedGuildId, setSelectedGuildId] = useState(null);
    const [nameInput, setNameInput] = useState('');
    const [symbolInput, setSymbolInput] = useState('');
    const [tokenURIInput, setTokenURIInput] = useState('');
    const [durationInput, setDurationInput] = useState(0);
    const [priceInput, setPriceInput] = useState(0);
    const [names, setNames] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const [tokenURIs, setTokenURIs] = useState([]);
    const [durations, setDurations] = useState([]);
    const [prices, setPrices] = useState([]);
    const [numTiers, setNumTiers] = useState(1);

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
                const accessToken = data.access_token;
                const tokenType = data.token_type;
                const expiresIn = data.expires_in;
                const refreshToken = data.refresh_token;

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
        console.log(adminGuilds);
        adminGuilds.map((adminGuild) => {
            let tmp = {
                id: adminGuild.id,
                icon_url: DISCORD_IMG_BASEURL + `icons/${adminGuild.id}/${adminGuild.icon}.png`,
                dao_name: adminGuild.name
            }
            decoded_guilds.push(tmp)
        })
        return decoded_guilds
    }

    const handleServerClick = (id) => {
        const index = adminGuildsList.findIndex((element) => element.id === id);
        setSelectedGuildId(id);
        setServerSelection(index);
    }

    const handleCreate = async () => {
        console.log("handle create", names, symbols, tokenURIs, durations, prices)
        const response = await createDAOServer(
            adminGuildsList[serverSelection].dao_name,
            adminGuildsList[serverSelection].icon_url,
            adminGuildsList[serverSelection].id,
            names,
            symbols,
            tokenURIs,
            durations,
            prices,
        );
        console.log(response);
        onClose();
    }

    const handleAdd = () => {
        setNumTiers(numTiers + 1)
        setNames([...names, nameInput]);
        setSymbols([...symbols, symbolInput]);
        setTokenURIs([...tokenURIs, tokenURIInput]);
        setDurations([...durations, durationInput]);
        setPrices([...prices, priceInput]);
    }

    const deleteTier = (e) => {
        setNames([...names.slice(0, e), ...names.slice(e + 1)])
        setSymbols([...symbols.slice(0, e), ...symbols.slice(e + 1)])
        setTokenURIs([...tokenURIs.slice(0, e), ...tokenURIs.slice(e + 1)])
        setDurations([...durations.slice(0, e), ...durations.slice(e + 1)])
        setPrices([...prices.slice(0, e), ...prices.slice(e + 1)])
    }

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
                        <div className={styles.caption}><ConnectDiscord discordConnected={discordConnected} /></div>
                    </div>
                </div>
                <div className={styles.step}>
                    <div>
                        <div className={styles.circle}>2</div>
                    </div>
                    <div>
                        <div className={styles.title}>Choose discord fetcher that you wish to create</div>
                        <div className={styles.caption} style={{ display: "flex" }}>
                            {Object.keys(adminGuildsList).length !== 0 &&
                                adminGuildsList.map((guild) =>
                                    <button
                                        key={guild.id}
                                        onClick={() => handleServerClick(guild.id)}
                                        className={styles.iconDisplay}
                                    >
                                        <Image
                                            className={
                                                guild.id === selectedGuildId
                                                    ? styles.circularIconHighlight
                                                    : styles.circularIcon
                                            }
                                            src={guild.icon_url}
                                            alt={guild.dao_name}
                                            width={50}
                                            height={50}
                                        />
                                    </button>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.step}>
                    <div>
                        <div className={styles.circle}>3</div>
                    </div>
                    <div>
                        <div className={styles.title} style={{ marginBottom: "10px" }}>Define the membership tiers</div>
                        <div className={styles.inputbox} >
                            <InputBox
                                displayText={"Name"}
                                value={nameInput}
                                setValue={setNameInput}
                            />
                        </div>
                        <div className={styles.inputbox} >
                            <InputBox
                                displayText={"Symbol"}
                                value={symbolInput}
                                setValue={setSymbolInput}
                            />
                        </div>
                        <div className={styles.inputbox} >
                            <InputBox
                                displayText={"Image URL"}
                                value={tokenURIInput}
                                setValue={setTokenURIInput}
                            />
                        </div>
                        <div className={styles.inputbox} >
                            <InputBox
                                displayText={"Durations"}
                                value={durationInput}
                                setValue={setDurationInput}
                            />
                        </div>
                        <div className={styles.inputbox} >
                            <InputBox
                                displayText={"Price"}
                                value={priceInput}
                                setValue={setPriceInput}
                            />
                        </div>
                        <div>
                            <button
                                className={names.length > 2 ? styles.addButtonDisabled : styles.addButton}
                                onClick={handleAdd}
                                disabled={names.length > 2}
                            >
                                Add
                            </button>
                        </div>
                        <div className={styles.caption}>
                            {names.length !== 0 &&
                                names.map((_, index) =>
                                (
                                    <div key={index} className={styles.tierDescription}>
                                        <div style={{ fontSize: "1rem", fontStyle: "italic", fontWeight: "700", marginLeft: "10px" }}>tier {index + 1}:</div>
                                        <div className={styles.tierTitle}>Tier Name:</div>
                                        <div className={styles.tierContent}>{names[index]}</div>
                                        <div className={styles.tierTitle}>Tier Symbol: </div>
                                        <div className={styles.tierContent}>{symbols[index]}</div>
                                        <div className={styles.tierTitle}> Duration: </div>
                                        <div className={styles.tierContent}>{durations[index]} days</div>
                                        <div className={styles.tierTitle}>TierPrice: </div>
                                        <div className={styles.tierContent}>{prices[index]}</div>
                                        <button className={styles.deleteTier} onClick={() => deleteTier(index)}>&times;</button>
                                    </div>
                                )
                                )
                            }
                        </div>
                    </div>
                </div>
                <div >
                    <button
                        className={styles.createButton}
                        onClick={handleCreate}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
