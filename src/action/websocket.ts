import { create } from 'zustand';
import SockJS from 'sockjs-client';
import { Client, IMessage, IFrame } from '@stomp/stompjs';

export interface Suspension {
    id: string;
    metroLineID: string;
    title: string;
    description: string;
    suspensionType: 'EMERGENCY' | 'SCHEDULED';
    expectedRestoreTime: string;
}

interface WebSocketStore {
    suspension: Suspension | null;
    isConnected: boolean;
    error: string | null;
    connect: () => void;
    disconnect: () => void;
}

let stompClient: Client | null = null;
let clearSuspensionTimeout: NodeJS.Timeout | null = null;

// Demo suspension for testing
const demoSuspension: Suspension = {
    id: "demo-1",
    metroLineID: "line-1",
    title: "Emergency Maintenance",
    description: "Due to unexpected technical issues, Metro Line 1 will be temporarily suspended between Station A and Station B. Expected restoration time is 2 hours.",
    suspensionType: "EMERGENCY",
    expectedRestoreTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
};

const useWebSocketStore = create<WebSocketStore>((set) => ({
    suspension: null,
    isConnected: false,
    error: null,
    connect: () => {
        if (stompClient?.connected) {
            console.log('WebSocket already connected');
            return;
        }

        console.log('Attempting to connect to WebSocket...');
        const socket = new SockJS('http://localhost:8080/api/ws', null, {
            transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
            timeout: 5000,
        });

        stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log('STOMP Debug:', str);
            },
            onConnect: () => {
                console.log('WebSocket connected successfully');
                set({ isConnected: true, error: null });

                console.log('Subscribing to /topic/suspensions...');
                stompClient?.subscribe('/topic/suspensions', (message: IMessage) => {
                    console.log('Received message on /topic/suspensions:', message.body);
                    try {
                        const suspension = JSON.parse(message.body) as Suspension;
                        console.log('Parsed suspension:', suspension);
                        set({ suspension });

                        // Clear any existing timeout
                        if (clearSuspensionTimeout) {
                            clearTimeout(clearSuspensionTimeout);
                        }

                        // Set new timeout to clear suspension after 30 seconds
                        clearSuspensionTimeout = setTimeout(() => {
                            console.log('Clearing suspension message after 30 seconds');
                            set({ suspension: null });
                        }, 30000);
                    } catch (error) {
                        console.error('Failed to parse suspension message:', error);
                        set({ error: 'Failed to parse suspension message' });
                    }
                });
                console.log('Successfully subscribed to /topic/suspensions');
            },
            onDisconnect: () => {
                console.log('WebSocket disconnected');
                set({ isConnected: false });
            },
            onStompError: (frame: IFrame) => {
                console.error('STOMP error:', frame);
                set({ error: `WebSocket error: ${frame.headers['message'] || 'Unknown error'}` });
            },
            onWebSocketError: (event) => {
                console.error('WebSocket error:', event);
                set({ error: 'WebSocket connection error' });
            },
            onWebSocketClose: (event) => {
                console.log('WebSocket closed:', event);
                set({ isConnected: false });
            }
        });

        try {
            console.log('Activating STOMP client...');
            stompClient.activate();
        } catch (error) {
            console.error('Failed to activate WebSocket client:', error);
            set({ error: 'Failed to establish WebSocket connection' });
        }
    },
    disconnect: () => {
        if (stompClient) {
            console.log('Disconnecting WebSocket...');
            stompClient.deactivate();
            stompClient = null;
        }
        // Clear any existing timeout when disconnecting
        if (clearSuspensionTimeout) {
            clearTimeout(clearSuspensionTimeout);
            clearSuspensionTimeout = null;
        }
        set({ isConnected: false, suspension: null });
    },
}));

export { useWebSocketStore };