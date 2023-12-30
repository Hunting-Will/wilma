import { GameController } from '../../game-logic/GameController';
import { Game, GameAction } from '../../types/index'

const baseUrl = 'http://localhost:3001';
// const baseUrl = 'https://wilma-server.onrender.com';

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