'use client';

import { useEffect } from 'react';
import { useWebSocketStore } from '@/action/websocket';

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { connect, disconnect } = useWebSocketStore();

    useEffect(() => {
        connect();
        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    return <>{children}</>;
}; 