import { RealtimeServerResponse } from '../../types/realtime-types'

// const path = 'ws://wilma-server.onrender.com'
const path = 'ws://localhost:3002'

export const subscribe = (key: string, callback: (message: RealtimeServerResponse) => void) => {
    const ws = new WebSocket(`${path}?gameID=${key}`);

    ws.addEventListener("message", (m) => {
        const parsed = JSON.parse(m.data);
        if (parsed.type === "GameState") {
            callback(parsed as RealtimeServerResponse);
        }
    });
}