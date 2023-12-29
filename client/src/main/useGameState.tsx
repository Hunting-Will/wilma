import { useEffect, useState } from "react";
import { fetchGame, simulateTurn, waitForChoices } from "../serverClient";
import { subscribe } from "../liveServerClient";
import {
    RealtimeGameState,
    RealtimeServerResponse,
    RealtimeTurnResults,
    RealtimeError,
} from "../../../types/realtime-types";
import { GameController } from "../../../game-logic/GameController";


const turnTime = 10

export const useGameState = (key: string) => {
    const [gameState, setGameState] = useState<GameController>();
    const [time, setTime] = useState(0)

    useEffect(() => {
        const init = async () => {
            const game = await fetchGame(key)
            setGameState(game);
            subscribe(key, handleData);

            if (game.state === 'player-choice') {
                startChoicesLoop()
            }
        }

        init()
    }, [])

    const handleData = (data: RealtimeServerResponse) => {
        if (isRealtimeGameState(data)) {
            setGameState(data.game);
        }
    };

    subscribe(key, handleData);

    const handleStart = async () => {
        await waitForChoices(key);
        startChoicesLoop();
    };

    const startChoicesLoop = () => {
        const interval = setInterval(() => {
            setTime((time) => {
                if (time + 1 >= turnTime) {
                    simulateTurn(key)
                    clearInterval(interval)
                }
                console.log(time);
                return time + 1
            });
        }, 1000);
    };

    return { gameState, handleStart, time };
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
