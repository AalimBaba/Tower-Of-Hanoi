import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * Custom Hook for WebSocket Communication
 * Manages the connection to the Spring Boot Backend and the Game State.
 */
export const useWebSocket = (discs, towerCount) => {
    // State to hold the current configuration of towers and disks
    // Initialize with a default structure to prevent "undefined" errors on first render
    const [towers, setTowers] = useState(() => {
        const initial = Array.from({ length: towerCount }, () => []);
        // Fill first tower with disks
        for (let i = discs; i >= 1; i--) {
            initial[0].push(i);
        }
        return initial;
    });

    const clientRef = useRef(null);
    const roomId = "CAPSTONE_ROOM"; // Hardcoded for this demo

    useEffect(() => {
        // Reset local state when props change
        const initial = Array.from({ length: towerCount }, () => []);
        for (let i = discs; i >= 1; i--) {
            initial[0].push(i);
        }
        setTowers(initial);

        // Initialize WebSocket Connection
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("Connected to WebSocket");
                
                // Subscribe to Game State Updates
                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    const gameState = JSON.parse(message.body);
                    if (gameState && gameState.towers) {
                        // Backend sends towers as List<Stack<Integer>>
                        // We update our local state to reflect this
                        setTowers(gameState.towers);
                    }
                });

                // Send Initialization Request to Backend
                client.publish({
                    destination: `/app/init/${roomId}`,
                    body: JSON.stringify({ disks: discs, towers: towerCount }),
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();
        clientRef.current = client;

        // Cleanup on Unmount
        return () => {
            if (client.active) {
                client.deactivate();
            }
        };
    }, [discs, towerCount]);

    // Function to send a move to the backend
    const sendMove = (from, to) => {
        if (clientRef.current && clientRef.current.connected) {
            clientRef.current.publish({
                destination: `/app/move/${roomId}`,
                body: JSON.stringify({ fromPeg: from, toPeg: to }),
            });
        }
    };

    // Function to reset/re-initialize the game
    const sendInit = (d, t) => {
        if (clientRef.current && clientRef.current.connected) {
            clientRef.current.publish({
                destination: `/app/init/${roomId}`,
                body: JSON.stringify({ disks: d, towers: t }),
            });
        }
    };

    return { towers, sendMove, sendInit };
};
