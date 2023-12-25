import { Game } from '../../types/index'
const baseUrl = 'http://localhost:3001';

export const joinGame = (id: string, nickname: string): Promise<{ playerId: string }> =>
    fetch(`${baseUrl}/api/joinGame/${id}/${nickname}`).then(res => res.json())

export const createGame = (name: string): Promise<{ gameId: string }> =>
    fetch(`${baseUrl}/api/createGame/${name}`).then(res => res.json())

export const fetchGame = (id: string): Promise<Game> =>
    fetch(`${baseUrl}/api/game/${id}`).then(res => res.json())
