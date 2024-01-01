import { GameController } from '../../game-logic/GameController';
import { GameAction } from '@wilma/types/index'

const baseUrl = process.env.NODE_ENV === 'production' ? 'https://wilma-server.onrender.com' : 'http://localhost:3001';

export const joinGame = (id: string, nickname: string): Promise<{ playerId: string }> =>
    fetch(`${baseUrl}/api/joinGame/${id}/${nickname}`).then(res => res.json())

export const createGame = (name: string): Promise<{ gameId: string }> =>
    fetch(`${baseUrl}/api/createGame/${name}`).then(res => res.json())

export const fetchGame = (id: string): Promise<GameController> =>
    fetch(`${baseUrl}/api/game/${id}`).then(res => res.json())

export const waitForChoices = (id: string) => fetch(`${baseUrl}/api/game/${id}/waitForChoices`);

export const setAction = (key: string, playerId: string, action: GameAction, cellId: string) => fetch(`${baseUrl}/api/game/${key}/setAction`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action, playerId, cellId })
})

export const simulateTurn = (key: string) => fetch(`${baseUrl}/api/game/${key}/simulateTurn`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
})