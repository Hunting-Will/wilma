import { RealtimeServerResponse } from '@wilma/types/realtime-types'

const path = process.env.NODE_ENV === 'production' ? 'wss://wilma-server.onrender.com' : 'ws://localhost:3001'

export const subscribe = (key: string, callback: (message: RealtimeServerResponse) => void) => {
    const ws = new WebSocket(`${path}?gameID=${key}`);

    ws.addEventListener("message", (m) => {
        const parsed = JSON.parse(m.data);
        callback(parsed as RealtimeServerResponse);
    });
}