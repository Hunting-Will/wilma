import { useEffect, useState } from "react";
import { fetchGame, simulateTurn, waitForChoices } from "../serverClient";
import { subscribe } from "../liveServerClient";
import {
    RealtimeGameState,
    RealtimeServerResponse,
    RealtimeTurnResults,
    RealtimeError,
} from "@wilma/types/realtime-types";
import { GameController } from "../../../game-logic/GameController";


const turnTime = 6

let interval: NodeJS.Timer;

export const useGameState = (key: string) => {
    const [gameState, setGameState] = useState<GameController>()
    const [turnResults, setTurnResults] = useState<RealtimeTurnResults>()

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

        return (() => {
            clearInterval(interval)
        })
    }, [key])

    const handleData = (data: RealtimeServerResponse) => {
        if (isRealtimeGameState(data)) {
            setGameState(data.game);
        }

        if (isRealtimeTurnResults(data)) {
            setTurnResults(data)
        }
    };

    const handleStart = async () => {
        await waitForChoices(key);
        startChoicesLoop();
    };

    const handleSimulateTurn = async () => {
        simulateTurn(key)
        clearInterval(interval)
        setTime(0)
    };

    const startChoicesLoop = () => {
        interval = setInterval(() => {
            setTime((time) => {
                if (time + 1 >= turnTime) {
                    // handleSimulateTurn()
                }
                return time + 1
            });
        }, 1000);
    };

    return { gameState, handleStart, time, handleSimulateTurn, turnResults };
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
