import { useState } from "react"

type GameState = 'waiting' | 'ftue' | 'selecting' | 'resolving'

export const useGameState = () => {
    const [gameState, setGameState] = useState<GameState>('waiting')

    const handleStart = () => {
        // Call api

        startMainMainLoop()
    }

    const startMainMainLoop = () => {
        setGameState('selecting')
        let i = 0
        setInterval(() => {
            console.log(i)
            i++
        }, 1000)
    }

    return { gameState, handleStart }
}