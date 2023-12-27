import { useEffect, useState } from "react";
import { fetchGame, waitForChoices } from "../serverClient";
import { subscribe } from "../liveServerClient";
import {
    RealtimeGameState,
    RealtimeServerResponse,
    RealtimeTurnResults,
    RealtimeError,
} from "../../../types/realtime-types";
import { GameController } from "../../../game-logic/GameController";

type GameState = "waiting" | "ftue" | "selecting" | "resolving";

export const useGameState = (key: string) => {
    const [gameState, setGameState] = useState<GameController>();

    useEffect(() => {
        const init = async () => {
            const game = await fetchGame(key)
            setGameState(game);
            subscribe(key, handleData);
        }

        init()
    }, [key])

    const handleData = (data: RealtimeServerResponse) => {
        if (isRealtimeGameState(data)) {
            setGameState(data.game);
        }
    };

    subscribe(key, handleData);

    const handleStart = async () => {
        await waitForChoices(key);
        startMainLoop();
    };

    const startMainLoop = () => {
        let i = 0;
        setInterval(() => {
            console.log(i);
            i++;
        }, 1000);
    };

    return { gameState, handleStart };
};

// TODO: move to some typings file
// TODO: can be switch case?
function isRealtimeGameState(
    res: RealtimeServerResponse
): res is RealtimeGameState {
    return res.type === "GameState";
}

function isRealtimeTurnResults(
    res: RealtimeServerResponse
): res is RealtimeTurnResults {
    return res.type === "TurnResults";
}

function isRealtimeError(res: RealtimeServerResponse): res is RealtimeError {
    return res.type === "Error";
}
