import { RealtimeGameState } from "@wilma/types/realtime-types";
import { GameController } from "../game-logic/GameController";

const request = require('superwstest');
const { server } = require('./');

const fetch = async <T>(path: string) => {
    const res = await request(server)
        .get(path)

        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

    return JSON.parse(res.text) as T
}

const fetchPost = async <T>(path: string, data: object) => {
    const res = await request(server)
        .post(path)
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

    return JSON.parse(res.text) as T
}

let key;

beforeEach(async () => {
    const name = 'Game'
    const data = await fetch<Record<any, any>>(`/api/createGame/${name}`)

    expect(data.gameId).not.toBeFalsy()
    expect(data.name).toBe(name);

    key = data.gameId;
})

afterAll(async () => {
    server.close()
})
test('Gets game', async () => {
    const response = await request(server)
        .get(`/api/game/${key}`)
        .expect('Content-Type', /json/)
        .expect(200);

    const data = JSON.parse(response.text) as GameController
    expect(data.key).toBe(key)
    expect(data.state).toBe('lobby')
});

test('Player joined, state published', (done) => {
    const playerName = 'Lior'

    request(server).ws(`?gameID=${key}`).expectJson(({ type, game }: RealtimeGameState) => {
        expect(type).toBe('GameState')
        expect(game.players.length).toBe(1)
        done()
    });

    fetch(`/api/joinGame/${key}/${playerName}`)
});

test('Player joined, sets action', async () => {
    const { playerId } = await fetch<any>(`/api/joinGame/${key}/Lior`)
    const game = await fetch<GameController>(`/api/game/${key}`)
    const { ID: cellId } = game.gc.grid[0]

    request(server).ws(`?gameID=${key}`).expectJson(({ type, game }: RealtimeGameState) => {
        expect(type).toBe('GameState')
        const cell = game.gc.grid.find(({ ID }) => ID === cellId)
        expect(cell.pendingActions[0].action).toBe('Seed')
    });
    await fetchPost(`/api/game/${key}/setAction`, {
        action: 'Seed',
        playerId,
        cellId
    })
});