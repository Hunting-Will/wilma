import { RealtimeServerResponse } from '../../types/realtime-types'
export const subscribe = (key: string, callback: (message: RealtimeServerResponse) => void) => {
    const ws = new WebSocket(`ws://localhost:8080?gameID=${key}`);

    ws.addEventListener("message", (m) => {
        const parsed = JSON.parse(m.data);
        if (parsed.type === "GameState") {
            callback(parsed as RealtimeServerResponse);
        }
    });
}