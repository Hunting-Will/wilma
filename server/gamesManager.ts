import Redis from 'ioredis'
import redisMock from 'redis-mock'

import { GameController } from "../game-logic/GameController";
import { GridController } from '../game-logic/GridController';

const redis =
    process.env.NODE_ENV === 'test' ?
        redisMock.createClient() :
        new Redis('redis://:1aaiwdzIvNTH7TKlrehzCfgJI9SgiGmt@redis-11798.c323.us-east-1-2.ec2.cloud.redislabs.com:11798');

export let games: Record<GameController['key'], GameController> = {};

export const getGame = async (key: string) => {
    const game = games[key]
    if (game) {
        return game
    }

    const redisRes: GameController = JSON.parse(await redis.get(key))
    const remoteGame: GameController = Object.assign(new GameController(3, 3), redisRes)
    remoteGame.gc = Object.assign(new GridController(3, 3), redisRes.gc)

    games[key] = remoteGame

    return remoteGame
}

export const setGame = async (key: string, value: GameController) => {
    games[key] = value
    await redis.set(key, JSON.stringify(value));
} 