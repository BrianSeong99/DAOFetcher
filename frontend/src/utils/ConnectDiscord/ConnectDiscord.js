import { useState, useEffect } from "react";
import axios from "axios";

import { FaDiscord } from 'react-icons/fa';


export default function ConnectDiscord() {
    // const ConnectButton = () => {
    const [connected, setConnected] = useState(false);
    const [servers, setServers] = useState([]);

    const DISCORD_CLIENT_ID = '1088663386327351356';
    const DISCORD_REDIRECT_URI = 'http://localhost:3000/';
    const DISCORD_OAUTH2_URL = 'https://discord.com/api/oauth2/authorize';
    const DISCORD_OAUTH2_SCOPE = 'identify email';

    const handleConnect = () => {
        window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=1088663386327351356&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code&scope=guilds';
    };

    const handleFetchServers = async () => {
        try {
            const response = await axios.get("/api/get-servers");
            setServers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <button
                onClick={handleConnect}
                style={{ backgroundColor: "white", padding: "0.8rem", borderRadius: "20px", marginTop: "10px" }}
            >
                <p style={{ display: "flex", gap: "10px" }}><FaDiscord size={20} color="5865F2" /> Click to Connect Discord</p>
            </button>
            {connected && (
                <div>
                    <button onClick={handleFetchServers}>Fetch Servers</button>
                    <ul>
                        {servers.map((server) => (
                            <li key={server.id}>{server.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

